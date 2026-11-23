// @ts-check
/**
 * KLS logo (client-supplied, Part B round 1).
 *
 * - brandMark(): the waterfall circle from the logo, for small sizes (header, menu). The full
 *   logo's arched lettering is unreadable below ~160px, so the site name sits beside it as text.
 *   Decorative (alt=""): the name next to it is the accessible label.
 * - brandLogo(): the full logo (waterfall, arched name, dove, vine). Its lettering is black, so it
 *   always sits on a light disc; on dark surfaces it gets the cream "medallion" (.brand-logo).
 *
 * Source files: src/assets/images/brand/ (kls-logo.png is the client's original 500px PNG).
 */
import { html } from '../lib/html.mjs';
import { asset } from '../lib/url.mjs';

/** @param {{ small?: boolean }} [o] small: inline next to a label (e.g. the hero float card) */
export function brandMark({ small = false } = {}) {
  const px = small ? 20 : 44;
  return html`<img class="brand__mark${small ? ' brand__mark--sm' : ''}" src="${asset('images/brand/kls-mark.png')}" alt="" width="${px}" height="${px}" decoding="async">`;
}

/** @param {{ name: string, className?: string }} o */
export function brandLogo({ name, className = '' }) {
  return html`<span class="brand-logo ${className}"><img src="${asset('images/brand/kls-logo.png')}" alt="${name} logo" width="500" height="500" loading="lazy" decoding="async"></span>`;
}
