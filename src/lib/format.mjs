// @ts-check
/** Small formatting helpers shared by pages and partials. */

/**
 * "2026-11-10" → "10 November 2026" (en-GB, as used in Kenya).
 * @param {string} iso
 */
export function formatDate(iso) {
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00Z' : ''));
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
}

/**
 * Estimated reading time in minutes for plain text.
 * @param {string} text
 */
export function readingTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * URL-safe slug.
 * @param {string} text
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Should a data item appear? Drafts show only in dev builds; anything whose visible text
 * still contains [CONFIRM] never appears in production.
 * @param {any} item
 * @param {{ production: boolean }} env
 * @param {string[]} [textKeys] keys to scan for [CONFIRM]
 */
export function isVisible(item, env, textKeys = ['title', 'text', 'name', 'question', 'answer']) {
  if (!item) return false;
  if (!env.production) return true;
  if (item.draft) return false;
  return !textKeys.some((k) => isUnconfirmed(item[k]));
}

/**
 * True when a value still holds a [CONFIRM] placeholder.
 * @param {unknown} value
 */
export function isUnconfirmed(value) {
  return typeof value === 'string' && value.includes('[CONFIRM');
}
