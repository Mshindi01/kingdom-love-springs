// @ts-check
import { html } from '../lib/html.mjs';
import { url } from '../lib/url.mjs';
import { isUnconfirmed } from '../lib/format.mjs';

/**
 * Site footer. A1: minimal. A3 builds the full forest-900 footer (CONTENT §3.12).
 * Contact details still marked [CONFIRM] are never shown.
 * @param {import('../../tools/build.mjs').RenderContext} ctx
 */
export function footer(ctx) {
  const { site, pages, buildYear } = ctx;
  const legal = (site.nav?.legal || []).filter((item) => pages.has(item.path));
  const email = isUnconfirmed(site.contact?.email) ? null : site.contact?.email;

  return html`
    <footer class="site-footer" data-surface="forest">
      <div class="container site-footer__inner">
        <p>© ${buildYear} ${site.name}</p>
        ${email ? html`<p><a href="mailto:${email}">${email}</a></p>` : ''}
        ${legal.length
          ? html`<ul class="cluster" role="list">
              ${legal.map((item) => html`<li><a href="${url(item.path)}">${item.label}</a></li>`)}
            </ul>`
          : ''}
      </div>
    </footer>
  `;
}
