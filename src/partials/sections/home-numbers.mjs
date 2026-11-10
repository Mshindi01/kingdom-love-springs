// @ts-check
/** Home §5: the pill band (handwritten numbers from stats.json). */
import { html } from '../../lib/html.mjs';
import { pillBand } from './bands.mjs';

/**
 * @param {import('../../../tools/build.mjs').RenderContext} ctx
 * @param {any} s
 */
export default function homeNumbers(ctx, s) {
  const stats = s.stats.map((/** @type {string} */ id) => ctx.data.stats.stats.find((/** @type {any} */ x) => x.id === id)).filter(Boolean);
  return html`<div class="home-numbers">${pillBand({ stats, id: 'home-numbers-title' })}</div>`;
}
