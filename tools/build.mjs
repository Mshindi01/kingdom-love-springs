#!/usr/bin/env node
// @ts-check
/**
 * Kingdom Love Springs: zero-dependency static build (src/ → dist/).
 *
 *   node tools/build.mjs            production build (drafts hidden)
 *   node tools/build.mjs --dev      dev build (drafts shown, live-reload script injected)
 *   node tools/build.mjs --watch    dev build, rebuilt on every change in src/
 *
 * Env overrides (used by CI with actions/configure-pages):
 *   SITE_URL   e.g. https://user.github.io/kingdom-love-springs
 *   BASE_PATH  e.g. /kingdom-love-springs  ("" for a custom domain)
 *
 * Steps: clean dist → load src/data/*.json → copy & bundle assets → hash assets →
 * render src/pages/**\/*.page.mjs through the layout → generate collection pages from
 * src/templates/*.mjs → sitemap.xml, robots.txt, 404.html, .nojekyll, CNAME.
 */

import { readFile, writeFile, mkdir, rm, readdir, copyFile, stat } from 'node:fs/promises';
import { watch as fsWatch } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { configureUrls, normaliseBase, absoluteUrl } from '../src/lib/url.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SRC = path.join(ROOT, 'src');
export const DIST = path.join(ROOT, 'dist');

/**
 * @typedef {{ title: string, description: string, path?: string, ogImage?: string | null,
 *   motion?: boolean, draft?: boolean, noindex?: boolean, sitemap?: boolean,
 *   header?: 'overlay' | 'solid' }} PageMeta
 *
 * @typedef {{ id: string, path: string, meta: PageMeta, isNotFound: boolean, outFile: string }} PageInfo
 *
 * @typedef {{
 *   site: any,
 *   data: Record<string, any>,
 *   tokens: Record<string, string>,
 *   page: PageInfo,
 *   pages: Set<string>,
 *   env: { dev: boolean, production: boolean },
 *   buildYear: number,
 * }} RenderContext
 */

// ─── helpers ────────────────────────────────────────────────────────────────

/** @param {string} dir @returns {Promise<string[]>} absolute file paths, recursive */
export async function walk(dir) {
  /** @type {string[]} */
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/** @param {string} p */
const toPosix = (p) => p.split(path.sep).join('/');

/** @param {string} file @param {string | Buffer} content */
async function write(file, content) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
}

/** @param {Buffer | string} buf */
const shortHash = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 10);

/** Normalise a page path to "/x/y/" form ("/" for home). @param {string} p */
function normalisePagePath(p) {
  let out = '/' + p.replace(/^\/+|\/+$/g, '');
  if (out !== '/') out += '/';
  return out;
}

/** Load every src/data/*.json as data[basename]. */
async function loadData() {
  /** @type {Record<string, any>} */
  const data = {};
  const dir = path.join(SRC, 'data');
  for (const file of await readdir(dir)) {
    if (!file.endsWith('.json')) continue;
    const name = path.basename(file, '.json');
    try {
      data[name] = JSON.parse(await readFile(path.join(dir, file), 'utf8'));
    } catch (err) {
      throw new Error(`Invalid JSON in src/data/${file}: ${/** @type {Error} */ (err).message}`);
    }
  }
  return data;
}

/** Parse custom properties with literal values out of tokens.css (for meta theme-color etc.). */
async function loadTokens() {
  const css = await readFile(path.join(SRC, 'assets/css/tokens.css'), 'utf8');
  /** @type {Record<string, string>} */
  const tokens = {};
  for (const m of css.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) tokens[m[1]] = m[2];
  return tokens;
}

/**
 * Inline `@import "file.css";` recursively (relative to the importing file).
 * @param {string} file
 * @param {Set<string>} [seen]
 * @returns {Promise<string>}
 */
async function bundleCss(file, seen = new Set()) {
  if (seen.has(file)) return '';
  seen.add(file);
  const css = await readFile(file, 'utf8');
  const parts = [];
  let last = 0;
  for (const m of css.matchAll(/@import\s+(?:url\()?["']([^"']+)["']\)?\s*;/g)) {
    parts.push(css.slice(last, m.index));
    const target = path.resolve(path.dirname(file), m[1]);
    const inner = await bundleCss(target, seen);
    // Rebase relative url() references in the imported file onto the entry file's directory.
    const rebased = inner.replace(/url\((["']?)(?!data:|https?:|\/|#)([^"')]+)\1\)/g, (_all, q, ref) => {
      const abs = path.resolve(path.dirname(target), ref);
      const rel = toPosix(path.relative(path.dirname(file), abs));
      return `url(${q}${rel}${q})`;
    });
    parts.push(`/* ── ${toPosix(path.relative(path.dirname(file), target))} ── */\n${rebased}`);
    last = /** @type {number} */ (m.index) + m[0].length;
  }
  parts.push(css.slice(last));
  return parts.join('');
}

/**
 * Conservative CSS minifier: strips comments and collapses whitespace around { } ; , and
 * after ":" (never before, so descendant combinators like `.a :is(…)` survive). calc()
 * operators keep their spaces because "+" / "-" are never touched.
 * @param {string} css
 */
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,])\s*/g, '$1')
    .replace(/:\s+/g, ':')
    .replace(/;}/g, '}')
    .trim();
}

/**
 * Copy src/assets → dist/assets, bundling CSS entry points. Returns the hash map.
 * CSS partials (imported by main.css) are still copied, so unbundled debugging works.
 * @param {{ minify: boolean }} options
 */
async function buildAssets({ minify }) {
  const srcAssets = path.join(SRC, 'assets');
  const distAssets = path.join(DIST, 'assets');
  /** @type {Map<string, string>} */
  const hashes = new Map();
  const files = await walk(srcAssets);

  // One version for all JS modules: relative imports get `?v=<jsHash>` so a change anywhere
  // in the module graph busts every cached module (they're small, and this avoids stale graphs).
  const jsFiles = files.filter((f) => /\.m?js$/.test(f) && !f.includes(`${path.sep}vendor${path.sep}`)).sort();
  const jsHash = shortHash(Buffer.concat(await Promise.all(jsFiles.map((f) => readFile(f)))));

  for (const file of files) {
    const rel = toPosix(path.relative(srcAssets, file));
    if (path.basename(rel).startsWith('.') || rel.endsWith('Thumbs.db')) continue; // .gitkeep, .DS_Store…
    if (rel.startsWith('icons/') && (rel === 'icons/icons.json' || rel.startsWith('icons/brands/'))) continue; // sources for the sprite
    const out = path.join(distAssets, rel);
    let content;
    if (rel === 'css/main.css') {
      const bundled = await bundleCss(file);
      content = Buffer.from(minify ? minifyCss(bundled) : bundled);
      await write(out, content);
    } else if (jsFiles.includes(file)) {
      const src = await readFile(file, 'utf8');
      content = Buffer.from(
        src.replace(/(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])(\.{1,2}\/[^"'?]+\.js)\2/g, (_m, pre, q, spec) => `${pre}${q}${spec}?v=${jsHash}${q}`),
      );
      await write(out, content);
    } else {
      await mkdir(path.dirname(out), { recursive: true });
      await copyFile(file, out);
      content = await readFile(file);
    }
    hashes.set('/assets/' + rel, shortHash(content));
  }
  return hashes;
}

/** Find all page modules. */
async function findPages() {
  const dir = path.join(SRC, 'pages');
  return (await walk(dir)).filter((f) => f.endsWith('.page.mjs')).sort();
}

/**
 * Import a module fresh (cache-busted for watch mode in the same process).
 * @param {string} file
 */
async function importFresh(file) {
  return import(pathToFileURL(file).href + `?t=${Date.now()}`);
}

/**
 * Derive the URL path from a page file, unless meta.path is set.
 * src/pages/index.page.mjs → "/" ; src/pages/about/index.page.mjs → "/about/" ; 404.page.mjs → 404
 * @param {string} file
 */
function pathFromFile(file) {
  const rel = toPosix(path.relative(path.join(SRC, 'pages'), file)).replace(/\.page\.mjs$/, '');
  if (rel === 'index') return '/';
  if (rel.endsWith('/index')) return normalisePagePath(rel.slice(0, -'/index'.length));
  return normalisePagePath(rel);
}

/** @param {string} pagePath */
function outFileFor(pagePath) {
  return path.join(DIST, ...pagePath.split('/').filter(Boolean), 'index.html');
}

/** @param {string} p */
const idFromPath = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-'));

/**
 * @param {PageMeta} meta
 * @param {string} where
 */
function validateMeta(meta, where) {
  if (!meta || typeof meta !== 'object') throw new Error(`${where}: missing \`export const meta\``);
  if (!meta.title) throw new Error(`${where}: meta.title is required`);
  if (!meta.description) throw new Error(`${where}: meta.description is required`);
}

// ─── build ──────────────────────────────────────────────────────────────────

/**
 * @param {{ dev?: boolean, quiet?: boolean }} [options]
 */
export async function build({ dev = false, quiet = false } = {}) {
  const started = performance.now();
  const env = { dev, production: !dev };

  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  const data = await loadData();
  const site = data.site;
  if (!site) throw new Error('src/data/site.json is required');
  if (process.env.SITE_URL) site.url = process.env.SITE_URL.replace(/\/+$/, '');
  if (process.env.BASE_PATH !== undefined) site.basePath = process.env.BASE_PATH;
  site.basePath = normaliseBase(site.basePath || '');
  const tokens = await loadTokens();

  const hashes = await buildAssets({ minify: env.production });
  configureUrls({ basePath: site.basePath, hashes });

  /** @type {{ info: PageInfo, render: (ctx: RenderContext) => any }[]} */
  const jobs = [];

  // 1. Page modules
  for (const file of await findPages()) {
    const where = toPosix(path.relative(ROOT, file));
    const mod = await importFresh(file);
    validateMeta(mod.meta, where);
    if (typeof mod.render !== 'function') throw new Error(`${where}: missing \`export function render(ctx)\``);
    if (mod.meta.draft && env.production) continue;
    const isNotFound = path.basename(file) === '404.page.mjs';
    const pagePath = isNotFound ? '/404.html' : normalisePagePath(mod.meta.path || pathFromFile(file));
    jobs.push({
      info: {
        id: isNotFound ? 'not-found' : idFromPath(pagePath),
        path: pagePath,
        meta: mod.meta,
        isNotFound,
        outFile: isNotFound ? path.join(DIST, '404.html') : outFileFor(pagePath),
      },
      render: mod.render,
    });
  }

  // 2. Collection templates: export function items(ctx), meta(item, ctx), render(ctx, item)
  const templateDir = path.join(SRC, 'templates');
  for (const file of (await walk(templateDir)).filter((f) => f.endsWith('.mjs'))) {
    const where = toPosix(path.relative(ROOT, file));
    const mod = await importFresh(file);
    if (typeof mod.items !== 'function' || typeof mod.meta !== 'function' || typeof mod.render !== 'function') {
      throw new Error(`${where}: templates must export items(ctx), meta(item, ctx) and render(ctx, item)`);
    }
    const baseCtx = { site, data, env };
    for (const item of mod.items(baseCtx)) {
      if (item.draft && env.production) continue;
      const meta = mod.meta(item, baseCtx);
      validateMeta(meta, `${where} (${item.slug ?? '?'})`);
      if (!meta.path) throw new Error(`${where}: meta(item).path is required`);
      const pagePath = normalisePagePath(meta.path);
      jobs.push({
        info: { id: idFromPath(pagePath), path: pagePath, meta, isNotFound: false, outFile: outFileFor(pagePath) },
        render: (ctx) => mod.render(ctx, item),
      });
    }
  }

  // Duplicate path guard
  const seen = new Map();
  for (const j of jobs) {
    if (seen.has(j.info.path)) throw new Error(`Two pages render to ${j.info.path}`);
    seen.set(j.info.path, true);
  }

  const pages = new Set(jobs.filter((j) => !j.info.isNotFound).map((j) => j.info.path));
  const { layout } = await importFresh(path.join(SRC, 'partials/layout.mjs'));
  const buildYear = new Date().getFullYear();

  for (const job of jobs) {
    /** @type {RenderContext} */
    const ctx = { site, data, tokens, page: job.info, pages, env, buildYear };
    let doc;
    try {
      doc = layout(ctx, job.render(ctx));
    } catch (err) {
      throw new Error(`Rendering ${job.info.path} failed: ${/** @type {Error} */ (err).stack}`);
    }
    await write(job.info.outFile, String(doc));
  }

  // 3. sitemap.xml, robots.txt, .nojekyll, CNAME
  const sitemapPages = jobs.filter((j) => !j.info.isNotFound && j.info.meta.sitemap !== false && !j.info.meta.noindex);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages.map((j) => `  <url><loc>${absoluteUrl(site.url, j.info.path)}</loc></url>`).join('\n')}
</urlset>
`;
  await write(path.join(DIST, 'sitemap.xml'), sitemap);

  const indexing = Boolean(site.seo?.indexing);
  const robots = indexing
    ? `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl(site.url, '/sitemap.xml')}\n`
    : `# Preview site: not indexed until launch (site.json → seo.indexing).\nUser-agent: *\nDisallow: /\n`;
  await write(path.join(DIST, 'robots.txt'), robots);
  await write(path.join(DIST, '.nojekyll'), '');
  if (site.customDomain) await write(path.join(DIST, 'CNAME'), site.customDomain.trim() + '\n');

  const ms = Math.round(performance.now() - started);
  if (!quiet) {
    console.log(
      `✓ built ${jobs.length} page${jobs.length === 1 ? '' : 's'} in ${ms}ms → dist/  (${env.dev ? 'dev' : 'production'}, basePath "${site.basePath}")`,
    );
  }
  return { pages: jobs.length, ms, site };
}

// ─── watch ──────────────────────────────────────────────────────────────────

/**
 * Rebuild in a fresh child process on every change in src/ (so partials imported by
 * pages are never stale in Node's module cache). Calls onRebuild after each success.
 * @param {{ onRebuild?: () => void }} [options]
 */
export function watch({ onRebuild } = {}) {
  /** @type {NodeJS.Timeout | undefined} */
  let timer;
  let running = false;
  let queued = false;

  const run = () => {
    if (running) {
      queued = true;
      return;
    }
    running = true;
    const child = spawn(process.execPath, [fileURLToPath(import.meta.url), '--dev'], { stdio: 'inherit', env: process.env });
    child.on('exit', (code) => {
      running = false;
      if (code === 0) onRebuild?.();
      else console.error('✗ build failed (waiting for changes)');
      if (queued) {
        queued = false;
        run();
      }
    });
  };

  run();
  fsWatch(SRC, { recursive: true }, (_event, filename) => {
    if (filename && /(^|[\\/])\.|~$/.test(String(filename))) return; // ignore dotfiles & editor temp files
    clearTimeout(timer);
    timer = setTimeout(run, 120);
  });
  console.log('… watching src/ for changes');
}

// ─── CLI ────────────────────────────────────────────────────────────────────

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = new Set(process.argv.slice(2));
  if (args.has('--watch')) {
    watch();
  } else {
    build({ dev: args.has('--dev') }).catch((err) => {
      console.error('✗ build failed\n' + (err?.stack || err));
      process.exit(1);
    });
  }
}
