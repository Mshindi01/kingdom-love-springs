// @ts-check
/**
 * Tiny, safe HTML templating.
 *
 *   html`<p>${userText}</p>`   → interpolations are escaped
 *   html`<ul>${items.map(i => html`<li>${i}</li>`)}</ul>` → arrays are joined, nested results pass through
 *   raw('<b>trusted</b>')      → opt out of escaping (trusted strings only)
 *   attrs({ class: 'x', hidden: true, href: url('/') }) → ` class="x" hidden href="/…"`
 */

/** Marker class for already-safe HTML. */
export class SafeHtml {
  /** @param {string} value */
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

const ESCAPES = /** @type {Record<string, string>} */ ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
});

/** @param {unknown} value */
export function escape(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

/**
 * Mark a string as trusted HTML (no escaping).
 * @param {unknown} value
 */
export function raw(value) {
  return new SafeHtml(value == null ? '' : String(value));
}

/**
 * Convert any interpolated value to safe HTML text.
 * null / undefined / false → '' ; arrays → joined ; SafeHtml → as-is ; others → escaped.
 * @param {unknown} value
 * @returns {string}
 */
function toHtml(value) {
  if (value == null || value === false) return '';
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(toHtml).join('');
  return escape(value);
}

/**
 * Tagged template that escapes every interpolation.
 * @param {TemplateStringsArray} strings
 * @param {...unknown} values
 * @returns {SafeHtml}
 */
export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) {
    out += toHtml(values[i]) + strings[i + 1];
  }
  return new SafeHtml(out);
}

/**
 * Build an attribute string from an object.
 * true → bare attribute, false/null/undefined → omitted, arrays → space-joined (for class).
 * @param {Record<string, unknown>} obj
 * @returns {SafeHtml}
 */
export function attrs(obj) {
  let out = '';
  for (const [key, value] of Object.entries(obj)) {
    if (value == null || value === false) continue;
    if (value === true) {
      out += ` ${key}`;
      continue;
    }
    const v = Array.isArray(value) ? value.filter(Boolean).join(' ') : String(value);
    out += ` ${key}="${escape(v)}"`;
  }
  return new SafeHtml(out);
}
