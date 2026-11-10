// @ts-check
/** /privacy/: plain-language privacy notice (Part A: forms store nothing; Kenya Data Protection Act 2019). */
import { html } from '../../lib/html.mjs';
import { url } from '../../lib/url.mjs';
import { formatDate } from '../../lib/format.mjs';
import { pageHero, helpStrip } from '../../partials/page.mjs';

export const meta = {
  title: 'Privacy',
  description: 'How Kingdom Love Springs handles your information: our forms open WhatsApp or email, and nothing is stored on this website.',
  path: '/privacy/',
};

/** @param {import('../../../tools/build.mjs').RenderContext} ctx */
export function render(ctx) {
  const p = ctx.data.pages.privacy;
  return html`
    ${pageHero(ctx, p.hero)}
    <section class="section section--flush-top" aria-label="Privacy notice">
      <div class="container container--narrow privacy flow">
        ${p.sections.map(
          (/** @type {any} */ s, /** @type {number} */ i) => html`<h2 id="privacy-${i + 1}">${s.title}</h2>
            ${s.body.map((/** @type {string} */ para) => html`<p>${para}</p>`)}`,
        )}
        <p>Questions? <a href="${url('/contact/')}">Contact us</a>.</p>
        <p class="text-muted"><small>Last updated <time datetime="${p.updated}">${formatDate(p.updated)}</time>.</small></p>
      </div>
    </section>
    ${helpStrip(ctx)}
  `;
}
