#!/usr/bin/env node
// @ts-check
/**
 * Generate on-brand SVG placeholders (sand + sunrise + football & leaf line drawing + slot label)
 * and the favicon. Colours are read from src/assets/css/tokens.css, so a brand swap is just
 * `npm run placeholders` after editing tokens. NO stock photos of children, ever.
 *
 *   npm run placeholders
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES = path.join(ROOT, 'src/assets/images');

const css = await readFile(path.join(ROOT, 'src/assets/css/tokens.css'), 'utf8');
/** @param {string} name */
function token(name) {
  const m = css.match(new RegExp(`--${name}\\s*:\\s*(#[0-9a-fA-F]{3,8})`));
  if (!m) throw new Error(`token --${name} not found in tokens.css`);
  return m[1];
}
const c = {
  sand: token('sand-100'),
  sun: token('sun-400'),
  leaf: token('leaf-600'),
  leafSoft: token('leaf-500'),
  clay: token('clay-500'),
  ink: token('ink-500'),
  forest: token('forest-900'),
  sage: token('sage-300'),
};

/** Must match PLACEHOLDERS in src/partials/motifs.mjs */
const SLOTS = {
  hero: { w: 1600, h: 1000, label: 'Hero photo' },
  landscape: { w: 1200, h: 900, label: 'Landscape photo' },
  square: { w: 800, h: 800, label: 'Square photo' },
  portrait: { w: 900, h: 1200, label: 'Portrait photo' },
};

const f = (/** @type {number} */ n) => Math.round(n * 10) / 10;

/** Simplified football: circle + central pentagon + spokes. */
function football(/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ r, /** @type {number} */ sw) {
  const pts = [];
  const spokes = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const px = x + Math.cos(a) * r * 0.38;
    const py = y + Math.sin(a) * r * 0.38;
    pts.push(`${f(px)},${f(py)}`);
    spokes.push(`M${f(px)} ${f(py)}L${f(x + Math.cos(a) * r)} ${f(y + Math.sin(a) * r)}`);
  }
  return `<g fill="none" stroke="${c.clay}" stroke-width="${f(sw)}" stroke-linejoin="round" stroke-linecap="round">
    <circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>
    <polygon points="${pts.join(' ')}"/>
    <path d="${spokes.join('')}"/>
  </g>`;
}

/** A leaf with a midrib, drawn along +x then rotated. */
function leaf(/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ len, /** @type {number} */ rot, /** @type {number} */ sw) {
  const h = len * 0.32;
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${rot})" fill="none" stroke="${c.leaf}" stroke-width="${f(sw)}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M0 0C${f(len * 0.25)} ${f(-h)} ${f(len * 0.75)} ${f(-h)} ${f(len)} 0C${f(len * 0.75)} ${f(h)} ${f(len * 0.25)} ${f(h)} 0 0Z"/>
    <path d="M${f(len * 0.08)} 0L${f(len * 0.9)} 0"/>
    <path d="M${f(len * -0.18)} ${f(len * 0.06)}L0 0"/>
  </g>`;
}

/** @param {{ w: number, h: number, label: string }} slot */
function placeholder({ w, h, label }) {
  const s = Math.min(w, h);
  const cx = w / 2;
  const cy = h / 2 - s * 0.07;
  const r = s * 0.11;
  const sw = Math.max(2, s * 0.006);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Placeholder: ${label}">
  <rect width="${w}" height="${h}" fill="${c.sand}"/>
  <circle cx="${f(cx)}" cy="${f(cy)}" r="${f(s * 0.24)}" fill="${c.sun}" fill-opacity="0.28"/>
  <circle cx="${f(cx)}" cy="${f(cy)}" r="${f(s * 0.31)}" fill="none" stroke="${c.leafSoft}" stroke-opacity="0.55" stroke-width="${f(sw * 0.5)}"/>
  ${football(cx - r * 0.55, cy + r * 0.15, r, sw)}
  ${leaf(cx + r * 0.55, cy - r * 0.1, r * 1.9, -38, sw)}
  <text x="${f(cx)}" y="${f(cy + s * 0.4)}" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="${f(s * 0.026)}" letter-spacing="${f(s * 0.003)}" fill="${c.ink}">PHOTO PLACEHOLDER</text>
  <text x="${f(cx)}" y="${f(cy + s * 0.45)}" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="${f(s * 0.034)}" font-weight="500" fill="${c.ink}">${label} · ${w}×${h}</text>
</svg>
`;
}

function favicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="${c.forest}"/>
  <circle cx="32" cy="32" r="22" fill="${c.sun}" fill-opacity="0.22"/>
  ${leaf(15, 41, 36, -38, 3.5).replace(new RegExp(c.leaf, 'g'), c.sage)}
</svg>
`;
}

await mkdir(path.join(IMAGES, 'placeholders'), { recursive: true });
for (const [name, slot] of Object.entries(SLOTS)) {
  await writeFile(path.join(IMAGES, 'placeholders', `${name}.svg`), placeholder(slot));
}
await writeFile(path.join(IMAGES, 'favicon.svg'), favicon());
console.log(`✓ ${Object.keys(SLOTS).length} placeholders + favicon.svg (colours from tokens.css)`);
