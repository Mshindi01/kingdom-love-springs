// @ts-check
import { html } from '../lib/html.mjs';
import { url } from '../lib/url.mjs';
import { icon } from './icon.mjs';

/**
 * Site header. A1: brand + nav to pages that already exist.
 * Nav items whose page isn't built yet are skipped, so there are never broken links
 * while Part A is in progress. A2 adds the full sticky/transparent header + mobile menu.
 * @param {import('../../tools/build.mjs').RenderContext} ctx
 */
export function header(ctx) {
  const { site, pages, page } = ctx;
  const items = (site.nav?.main || []).filter((item) => pages.has(item.path));

  return html`
    <header class="site-header">
      <div class="container site-header__inner">
        <a class="site-header__brand" href="${url('/')}" ${page.path === '/' ? html`aria-current="page"` : ''}>
          ${icon('leaf')}<span>${site.name}</span>
        </a>
        ${items.length
          ? html`<nav class="site-nav" aria-label="Main">
              <ul class="site-nav__list" role="list">
                ${items.map(
                  (item) => html`<li><a href="${url(item.path)}" ${page.path === item.path ? html`aria-current="page"` : ''}>${item.label}</a></li>`,
                )}
              </ul>
            </nav>`
          : ''}
      </div>
    </header>
  `;
}
