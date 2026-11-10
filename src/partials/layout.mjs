// @ts-check
import { html } from '../lib/html.mjs';
import { head } from './head.mjs';
import { header } from './header.mjs';
import { footer } from './footer.mjs';
import { toastRegion } from './ui.mjs';

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
