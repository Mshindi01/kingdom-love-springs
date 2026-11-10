#!/usr/bin/env node
// @ts-check
/**
 * Kingdom Love Springs: site checks (zero deps). Run after a build:
 *   node tools/build.mjs && node tools/check.mjs
 *
 * Errors (exit 1):
 *  - broken internal links/assets (incl. #fragments on the same page), URLs missing the basePath
 *  - <img> without alt, missing <title>/<meta name=description>, duplicate ids
 *  - images over 300 KB
 *  - raw hex colours outside src/assets/css/tokens.css (CSS, JS, page/partial/template modules)
 *  - safeguarding (docs/SAFEGUARDING.md): forbidden fields in children/story/photo data,
 *    published stories without consent, photos used without `consent: true` in photos.json,
 *    EXIF GPS data in JPEGs
 * Warnings (exit 0): visible "[CONFIRM" text in built pages, photos not in the registry.
 */

import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { walk, SRC, DIST } from './build.mjs';
import { normaliseBase } from '../src/lib/url.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGE_BUDGET = 300 * 1024;

/** @type {string[]} */
const errors = [];
/** @type {string[]} */
const warnings = [];
/** @param {string} p */
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
/** @param {string} f */
const exists = (f) => stat(f).then((s) => s.isFile(), () => false);

try {
  await stat(DIST);
} catch {
  console.error('✗ dist/ not found. Run `node tools/build.mjs` first.');
  process.exit(1);
}

const site = JSON.parse(await readFile(path.join(SRC, 'data/site.json'), 'utf8'));
const BASE = normaliseBase(process.env.BASE_PATH ?? site.basePath ?? '');
const photos = JSON.parse(await readFile(path.join(SRC, 'data/photos.json'), 'utf8')).photos ?? [];
/** Map "photos/x.jpg" → registry entry */
const photoByFile = new Map(photos.map((/** @type {any} */ p) => [String(p.file).replace(/^\/?(assets\/)?(images\/)?/, ''), p]));

// ─── 1. Built HTML pages ────────────────────────────────────────────────────

const distFiles = await walk(DIST);
const htmlFiles = distFiles.filter((f) => f.endsWith('.html'));
const cssFiles = distFiles.filter((f) => f.endsWith('.css'));

/** @type {Map<string, Set<string>>} html file → ids (for #fragment checks) */
const idsByFile = new Map();
/** @type {Map<string, string>} */
const htmlSource = new Map();

for (const file of htmlFiles) {
  const src = await readFile(file, 'utf8');
  htmlSource.set(file, src);
  const where = rel(file);

  // title + description
  const title = src.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if (!title) errors.push(`${where}: missing <title>`);
  const desc = src.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]?.trim();
  if (!desc) errors.push(`${where}: missing <meta name="description">`);

  // ids (ignore inside <script>/<template>)
  const body = src.replace(/<script[\s\S]*?<\/script>/gi, '');
  const ids = new Set();
  for (const m of body.matchAll(/\sid="([^"]+)"/g)) {
    if (ids.has(m[1])) errors.push(`${where}: duplicate id="${m[1]}"`);
    ids.add(m[1]);
  }
  idsByFile.set(file, ids);

  // <img> alt
  for (const m of body.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt=("[^"]*"|'[^']*')/i.test(m[0])) errors.push(`${where}: <img> without alt → ${m[0].slice(0, 120)}`);
  }

  // Unconfirmed placeholders visible to visitors
  const visible = body.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ');
  if (visible.includes('[CONFIRM')) warnings.push(`${where}: page shows "[CONFIRM" text`);
}

/**
 * Resolve an internal URL to a dist file path. Returns null for external/ignored URLs.
 * @param {string} ref
 * @param {string} fromFile
 * @returns {{ file: string | null, fragment: string, problem?: string } | null}
 */
function resolveRef(ref, fromFile) {
  if (!ref || /^(https?:|mailto:|tel:|sms:|data:|javascript:|\/\/)/i.test(ref)) return null;
  if (/^https:\/\/wa\.me/.test(ref)) return null;
  const [beforeHash, fragment = ''] = ref.split('#');
  const pathname = beforeHash.split('?')[0];
  if (pathname === '') return { file: fromFile, fragment }; // same-page #fragment

  let distPath;
  if (pathname.startsWith('/')) {
    if (BASE && pathname !== BASE && !pathname.startsWith(BASE + '/')) {
      return { file: null, fragment, problem: `root-relative URL without basePath "${BASE}" (use url()/asset())` };
    }
    distPath = path.join(DIST, decodeURIComponent(pathname.slice(BASE.length)));
  } else {
    distPath = path.resolve(path.dirname(fromFile), decodeURIComponent(pathname));
  }
  if (pathname.endsWith('/')) distPath = path.join(distPath, 'index.html');
  return { file: distPath, fragment };
}

/** @param {string} file */
async function targetExists(file) {
  if (await exists(file)) return file;
  if (!path.extname(file) && (await exists(path.join(file, 'index.html')))) return path.join(file, 'index.html');
  return null;
}

/** @type {Set<string>} photo files referenced by built pages */
const usedPhotos = new Set();
const PLANNED = new Set(site.plannedPages || []);
/** @type {Set<string>} planned pages that are linked but not built yet */
const plannedLinks = new Set();

/** @param {string} file @param {string} ref @param {string} where */
async function checkRef(file, ref, where) {
  const r = resolveRef(ref, file);
  if (!r) return;
  if (r.problem) {
    errors.push(`${where}: ${ref}: ${r.problem}`);
    return;
  }
  const target = r.file && (await targetExists(r.file));
  if (!target) {
    // Pages scheduled for a later phase (site.json → plannedPages) only warn.
    const plannedPath = r.file ? '/' + path.relative(DIST, r.file).split(path.sep).join('/').replace(/index\.html$/, '') : '';
    if (PLANNED.has(plannedPath)) plannedLinks.add(plannedPath);
    else errors.push(`${where}: broken link → ${ref}`);
    return;
  }
  const relToAssets = path.relative(path.join(DIST, 'assets/images'), target).split(path.sep).join('/');
  if (relToAssets.startsWith('photos/')) usedPhotos.add(relToAssets);
  if (r.fragment && target.endsWith('.html')) {
    let ids = idsByFile.get(target);
    if (!ids) {
      ids = new Set([...(await readFile(target, 'utf8')).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
      idsByFile.set(target, ids);
    }
    if (!ids.has(decodeURIComponent(r.fragment))) errors.push(`${where}: missing anchor → ${ref}`);
  }
}

for (const [file, src] of htmlSource) {
  const where = rel(file);
  const refs = new Set();
  for (const m of src.matchAll(/\s(?:href|src|poster|action)="([^"]*)"/gi)) refs.add(m[1]);
  for (const m of src.matchAll(/\ssrcset="([^"]*)"/gi)) {
    for (const part of m[1].split(',')) refs.add(part.trim().split(/\s+/)[0]);
  }
  for (const m of src.matchAll(/url\((["']?)([^"')]+)\1\)/g)) refs.add(m[2]);
  // og:image is absolute (site.url); map it back to a dist path for consent checks
  for (const m of src.matchAll(/<meta\s+property="og:image"\s+content="([^"]+)"/gi)) {
    const siteUrl = String(process.env.SITE_URL || site.url).replace(/\/+$/, '');
    if (m[1].startsWith(siteUrl)) refs.add(BASE + m[1].slice(siteUrl.length));
  }
  for (const ref of refs) await checkRef(file, ref, where);
}

for (const file of cssFiles) {
  const src = await readFile(file, 'utf8');
  for (const m of src.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/url\((["']?)([^"')]+)\1\)/g)) {
    await checkRef(file, m[2], rel(file));
  }
}

// ─── 2. Image budget ────────────────────────────────────────────────────────

for (const file of distFiles.filter((f) => /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(f))) {
  const { size } = await stat(file);
  if (size > IMAGE_BUDGET) errors.push(`${rel(file)}: ${(size / 1024).toFixed(0)} KB is over the 300 KB image budget`);
}

// ─── 3. Raw hex colours outside tokens.css ──────────────────────────────────

const HEX = /(?<![\w&/-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;
const hexSources = (await walk(SRC)).filter(
  (f) =>
    /\.(css|js|mjs)$/.test(f) &&
    !f.includes(`${path.sep}vendor${path.sep}`) &&
    path.basename(f) !== 'tokens.css',
);
for (const file of hexSources) {
  const src = await readFile(file, 'utf8');
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    // In CSS, ignore selectors (id selectors like #main) by only checking declaration values.
    const scan = file.endsWith('.css') ? (line.includes(':') && !/\{\s*$/.test(line) ? line.slice(line.indexOf(':')) : '') : line;
    for (const m of scan.matchAll(HEX)) {
      // In JS/MJS only flag hex that looks like a colour (6/8 digits, or after a colon/quote in a style context)
      if (!file.endsWith('.css') && m[0].length < 7 && !/(color|fill|stroke|background|:\s*)$/i.test(scan.slice(0, m.index))) continue;
      errors.push(`${rel(file)}:${i + 1}: raw hex colour ${m[0]} (use a token from tokens.css)`);
    }
  });
}

// ─── 4. Safeguarding ────────────────────────────────────────────────────────

// 4a. Forbidden fields in child-related data (SAFEGUARDING §1, §2, §7)
const FORBIDDEN = /^(surname|last_?name|family_?name|middle_?name|full_?name|school|school_?name|village|estate|address|home_?address|gps|lat|latitude|lng|lon|longitude|date_?of_?birth|dob|birthday|phone|health|medical|diagnosis)$/i;
const CHILD_DATA = ['children.json', 'stories.json', 'photos.json', 'events.json'];

/**
 * @param {any} value
 * @param {string} file
 * @param {string} trail
 */
function scanFields(value, file, trail) {
  if (Array.isArray(value)) value.forEach((v, i) => scanFields(v, file, `${trail}[${i}]`));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('$')) continue; // documentation keys
      if (FORBIDDEN.test(k)) errors.push(`src/data/${file}: ${trail}.${k}: field not allowed for children/story data (SAFEGUARDING)`);
      scanFields(v, file, `${trail}.${k}`);
    }
  }
}

for (const name of CHILD_DATA) {
  const file = path.join(SRC, 'data', name);
  if (!(await exists(file))) continue;
  const json = JSON.parse(await readFile(file, 'utf8'));
  scanFields(json, name, name.replace('.json', ''));

  // Child first names: a single word only (no surnames)
  const walkNames = (/** @type {any} */ v, /** @type {string} */ trail) => {
    if (Array.isArray(v)) v.forEach((x, i) => walkNames(x, `${trail}[${i}]`));
    else if (v && typeof v === 'object') {
      for (const [k, x] of Object.entries(v)) {
        if (/^(first_?name|child_?name|alias)$/i.test(k) && typeof x === 'string' && /\s/.test(x.trim())) {
          errors.push(`src/data/${name}: ${trail}.${k} = "${x}": first name or alias only, one word (SAFEGUARDING §1)`);
        }
        walkNames(x, `${trail}.${k}`);
      }
    }
  };
  walkNames(json, name.replace('.json', ''));
}

// 4b. Published stories need consent (SAFEGUARDING §4)
const stories = JSON.parse(await readFile(path.join(SRC, 'data/stories.json'), 'utf8')).stories ?? [];
for (const s of stories) {
  if (!s.draft && s.consent !== true) errors.push(`src/data/stories.json: "${s.slug}" is published without consent: true`);
}

// 4c. Photo consent registry (SAFEGUARDING §3)
for (const p of photos) {
  if (!p.id || !p.file) errors.push(`src/data/photos.json: entry missing id/file → ${JSON.stringify(p)}`);
  if (typeof p.alt !== 'string') errors.push(`src/data/photos.json: "${p.id}" needs alt text (use "" only if decorative)`);
  const f = path.join(SRC, 'assets/images', String(p.file).replace(/^\/?(assets\/)?(images\/)?/, ''));
  if (!(await exists(f))) errors.push(`src/data/photos.json: "${p.id}" file not found → ${rel(f)}`);
}
for (const used of usedPhotos) {
  const entry = photoByFile.get(used);
  if (!entry) errors.push(`images/${used} is used on the site but not registered in src/data/photos.json`);
  else if (entry.consent !== true) errors.push(`images/${used} is used on the site without consent: true in photos.json`);
}
const photoDir = path.join(SRC, 'assets/images/photos');
for (const f of (await walk(photoDir)).filter((f) => !path.basename(f).startsWith('.'))) {
  const key = 'photos/' + path.relative(photoDir, f).split(path.sep).join('/');
  if (!photoByFile.has(key)) warnings.push(`${rel(f)}: not registered in photos.json (it can't be used until it is)`);
}

// 4d. EXIF GPS in JPEGs (SAFEGUARDING §5): minimal APP1/TIFF parse, no deps
/**
 * @param {Buffer} buf
 * @returns {boolean} true if a GPS IFD with entries is present
 */
function hasExifGps(buf) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return false;
  let off = 2;
  while (off + 4 <= buf.length) {
    if (buf[off] !== 0xff) return false;
    const marker = buf[off + 1];
    if (marker === 0xd9 || marker === 0xda) return false; // EOI / start of scan: no more metadata
    if (marker >= 0xd0 && marker <= 0xd7) {
      off += 2;
      continue;
    }
    const len = buf.readUInt16BE(off + 2);
    if (marker === 0xe1 && buf.toString('latin1', off + 4, off + 10) === 'Exif\0\0') {
      const tiff = off + 10;
      const le = buf.toString('latin1', tiff, tiff + 2) === 'II';
      const u16 = (/** @type {number} */ o) => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o));
      const u32 = (/** @type {number} */ o) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o));
      try {
        const ifd0 = tiff + u32(tiff + 4);
        const count = u16(ifd0);
        for (let i = 0; i < count; i++) {
          const entry = ifd0 + 2 + i * 12;
          if (u16(entry) === 0x8825) {
            const gpsIfd = tiff + u32(entry + 8);
            return gpsIfd + 2 <= buf.length && u16(gpsIfd) > 0;
          }
        }
      } catch {
        return false; // malformed EXIF: nothing readable
      }
    }
    off += 2 + len;
  }
  return false;
}

const jpegs = [...(await walk(path.join(SRC, 'assets'))), ...distFiles].filter((f) => /\.jpe?g$/i.test(f));
for (const f of jpegs) {
  if (hasExifGps(await readFile(f))) errors.push(`${rel(f)}: contains EXIF GPS location data. Re-export without metadata (SAFEGUARDING §5)`);
}

// ─── Report ─────────────────────────────────────────────────────────────────

if (plannedLinks.size) warnings.push(`links to planned pages not built yet: ${[...plannedLinks].sort().join(' ')}`);
for (const w of warnings) console.warn(`⚠ ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  console.error(`\n✗ check failed: ${errors.length} error${errors.length === 1 ? '' : 's'}, ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`);
  process.exit(1);
}
console.log(
  `✓ check passed: ${htmlFiles.length} pages, ${jpegs.length} JPEGs scanned, ${photos.length} registered photos` +
    (warnings.length ? `, ${warnings.length} warning${warnings.length === 1 ? '' : 's'}` : ''),
);
