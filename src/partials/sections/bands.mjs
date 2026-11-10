// @ts-check
/**
 * Dark bands: the impact pill band (handwritten numbers) and the quote band (rounded top).
 */
import { html } from '../../lib/html.mjs';
import { icon } from '../icon.mjs';
import { scriptLine } from '../script-line.mjs';

/**
 * Pill band (DESIGN_SYSTEM §4): forest-900, fully rounded ends, numbers in script with a
 * small hand-drawn stroke under each. Counts up when it enters (motion/pill-band.js).
 * Numbers come ONLY from data/stats.json.
 * @param {{ stats: { id: string, value: number | null, display: string, label: string }[],
 *   title?: string, id?: string }} o
 */
export function pillBand({ stats, title = 'Our impact in numbers', id = 'impact-numbers' }) {
  return html`<section class="pill-band" data-surface="forest" aria-labelledby="${id}" data-pill-band>
    <h2 class="sr-only" id="${id}">${title}</h2>
    <ul class="pill-band__list" role="list">
      ${stats.map((s) => {
        const v = typeof s.value === 'number' ? String(s.value) : null;
        const prefix = v && s.display.endsWith(v) ? s.display.slice(0, s.display.length - v.length) : '';
        return html`<li class="pill-band__item">
          <p class="pill-band__num" aria-hidden="true"><span class="script"${v && s.display.endsWith(v) ? html` data-count="${v}" data-prefix="${prefix}"` : ''}>${s.display}</span>
            <svg class="pill-band__stroke" viewBox="0 0 120 16" focusable="false"><path d="M3 11C24 5 52 4 74 7s30 3 43-2" pathLength="1000"></path></svg>
          </p>
          <p class="pill-band__caption"><span class="sr-only">${s.display} </span>${s.label}</p>
        </li>`;
      })}
    </ul>
  </section>`;
}

/**
 * Quote band: rounded-top dark section, a large quote, citation, and a script line crossing it.
 * @param {{ quote: string, cite: string, citeDetail?: string, script?: string, id?: string }} o
 */
export function quoteBand({ quote, cite, citeDetail, script, id = 'quote' }) {
  return html`<section class="quote-band" data-surface="forest" aria-labelledby="${id}" data-quote-band>
    <div class="container quote-band__inner">
      <h2 class="sr-only" id="${id}">A word we live by</h2>
      <span class="quote-band__mark">${icon('quote')}</span>
      <figure class="quote-band__figure">
        <blockquote class="quote-band__quote"><p>${quote}</p></blockquote>
        <figcaption class="quote-band__cite"><span class="quote-band__avatar">${icon('book-open')}</span><span><strong>${cite}</strong>${citeDetail ? html`<br><span class="text-muted">${citeDetail}</span>` : ''}</span></figcaption>
      </figure>
      ${script ? html`<div class="quote-band__script">${scriptLine({ text: script, swoosh: 'rise', size: 'xl', color: 'sage' })}</div>` : ''}
    </div>
  </section>`;
}
