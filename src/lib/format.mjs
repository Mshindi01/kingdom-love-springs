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
 * True when a value still holds a [CONFIRM] placeholder.
 * @param {unknown} value
 */
export function isUnconfirmed(value) {
  return typeof value === 'string' && value.includes('[CONFIRM');
}
