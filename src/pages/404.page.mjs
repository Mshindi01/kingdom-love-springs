// @ts-check
import { html } from '../lib/html.mjs';
import { url } from '../lib/url.mjs';
import { icon } from '../partials/icon.mjs';

export const meta = {
  title: 'Page not found',
  description: 'Sorry, we couldn’t find that page.',
  noindex: true,
  sitemap: false,
};

/** @param {import('../../tools/build.mjs').RenderContext} _ctx */
export function render(_ctx) {
  return html`
    <section class="section" aria-labelledby="nf-title">
      <div class="container stack">
        <p class="eyebrow">404</p>
        <h1 id="nf-title">We couldn’t find that page.</h1>
        <p class="lead">It may have moved, or the link may be mistyped.</p>
        <p><a href="${url('/')}">${icon('arrow-right')} Go to the home page</a></p>
      </div>
    </section>
  `;
}
