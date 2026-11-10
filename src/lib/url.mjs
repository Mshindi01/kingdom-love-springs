// @ts-check
/**
 * Every internal link and asset URL goes through these helpers, so the site
 * works at a GitHub Pages sub-path, at a custom-domain root, and later on cPanel.
 *
 * The build calls `configureUrls()` once with `site.basePath` and the asset hash map.
 */

let basePath = '';
/** @type {Map<string, string>} asset path (e.g. "/assets/css/main.css") → short content hash */
let assetHashes = new Map();

/**
 * @param {{ basePath?: string, hashes?: Map<string, string> }} options
 */
export function configureUrls({ basePath: bp = '', hashes = new Map() }) {
  basePath = normaliseBase(bp);
  assetHashes = hashes;
}

/** @param {string} bp */
export function normaliseBase(bp) {
  if (!bp || bp === '/') return '';
  return '/' + bp.replace(/^\/+|\/+$/g, '');
}

export function getBasePath() {
  return basePath;
}

/**
 * Prefix an internal, root-relative path with the base path.
 * External URLs, mailto:, tel:, #hash and already-prefixed values pass through.
 * @param {string} path e.g. "/about/" or "/"
 */
export function url(path = '/') {
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;
  const p = path.startsWith('/') ? path : '/' + path;
  return basePath + p;
}

/**
 * URL for a file in src/assets, with a cache-busting content hash.
 * @param {string} path e.g. "css/main.css" or "/assets/css/main.css"
 */
export function asset(path) {
  const clean = '/assets/' + path.replace(/^\/?(assets\/)?/, '');
  const hash = assetHashes.get(clean);
  return url(clean) + (hash ? `?v=${hash}` : '');
}

/**
 * Absolute URL (for sitemap, canonical, Open Graph).
 * @param {string} siteUrl e.g. "https://user.github.io/kingdom-love-springs"
 * @param {string} path root-relative path WITHOUT base path, e.g. "/about/"
 */
export function absoluteUrl(siteUrl, path) {
  return siteUrl.replace(/\/+$/, '') + (path.startsWith('/') ? path : '/' + path);
}
