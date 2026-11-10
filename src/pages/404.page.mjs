// @ts-check
/** Branded 404: a football line illustration, "Looks like this ball went out of play". */
import { html } from '../lib/html.mjs';
import { button } from '../partials/ui.mjs';

export const meta = {
  title: 'Page not found',
  description: 'Sorry, we couldn’t find that page.',
  noindex: true,
  sitemap: false,
};

/** @param {import('../../tools/build.mjs').RenderContext} ctx */
export function render(ctx) {
  const p = ctx.data.pages['not-found'];
  return html`
    <section class="section not-found" aria-labelledby="nf-title">
      <div class="container not-found__grid">
        <svg class="not-found__art" viewBox="0 0 320 240" aria-hidden="true" focusable="false">
          <path class="not-found__line" d="M10 200H310"></path>
          <path class="not-found__line not-found__line--dash" d="M40 200C90 120 150 70 230 60"></path>
          <g class="not-found__ball" transform="translate(250 70)">
            <circle r="42"></circle>
            <polygon points="0,-16 15.2,-4.9 9.4,12.9 -9.4,12.9 -15.2,-4.9"></polygon>
            <path d="M0 -16V-42M15.2 -4.9L40 -13M9.4 12.9L24.7 34M-9.4 12.9L-24.7 34M-15.2 -4.9L-40 -13"></path>
          </g>
        </svg>
        <div class="stack">
          <p class="eyebrow">${p.eyebrow}</p>
          <h1 id="nf-title">${p.title}</h1>
          <p class="lead">${p.text}</p>
          <div class="cluster">
            ${button({ label: 'Go to the home page', href: '/', icon: 'arrow-right' })}
            ${button({ label: 'Read our stories', href: '/stories/', variant: 'outline' })}
          </div>
        </div>
      </div>
    </section>
  `;
}
