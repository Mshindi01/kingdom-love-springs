// @ts-check
import { html } from '../lib/html.mjs';
import { head } from './head.mjs';
import { header } from './header.mjs';
import { footer } from './footer.mjs';
import { toastRegion } from './ui.mjs';
import { isUnconfirmed } from '../lib/format.mjs';

/**
 * Slim "Preview: share your feedback" banner for client review rounds (site.reviewBanner).
 * The WhatsApp link only appears once a real number is set.
 * @param {import('../../tools/build.mjs').RenderContext} ctx
 */
function reviewBanner(ctx) {
  const { site } = ctx;
  if (!site.reviewBanner) return '';
  const wa = site.review?.whatsapp;
  const link = wa && !isUnconfirmed(wa) ? `https://wa.me/${String(wa).replace(/\D/g, '')}?text=${encodeURIComponent(`Feedback on ${ctx.page.meta.title} (${ctx.page.path}): `)}` : null;
  return html`<div class="review-banner" role="note"><div class="container">${site.review?.text || 'Preview'}${link ? html` · <a href="${link}" rel="noopener" target="_blank">Send feedback on WhatsApp</a>` : ''}</div></div>`;
}

/**
 * Full HTML document around a page body.
 * @param {import('../../tools/build.mjs').RenderContext} ctx
 * @param {import('../lib/html.mjs').SafeHtml} body
 */
export function layout(ctx, body) {
  const { site, page } = ctx;
  return html`<!doctype html>
<html lang="${site.language}" class="no-js">
  <head>
    ${head(ctx)}
  </head>
  <body data-page="${page.id}">
    <a class="skip-link" href="#main">Skip to main content</a>
    ${reviewBanner(ctx)}
    ${header(ctx)}
    <main id="main" tabindex="-1">
      ${body}
    </main>
    ${footer(ctx)}
    ${toastRegion()}
  </body>
</html>
`;
}
