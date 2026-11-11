// @ts-check
/**
 * Site header (DESIGN_SYSTEM §4).
 *  - variant 'overlay': transparent over the hero photo (white text); with JS it becomes a
 *    fixed, solid white/blur bar with dark text after scrolling. Without JS it simply scrolls away.
 *  - variant 'solid' (default): sticky cream/blur bar with dark text.
 * Left: logo. Centre-left: links. Right: secondary links | divider | "Sponsor a child".
 * Mobile: a full-screen menu on forest-900 (ui/menu.js: focus trap, Esc, scroll lock).
 * Without JS the menu button is hidden and the links wrap under the logo.
 *
 * Only links to pages that exist are rendered (no broken links while Part A is built in
 * stages). `demo` renders every link pointing at `demoHref` (styleguide only).
 */
import { html, attrs } from '../lib/html.mjs';
import { url } from '../lib/url.mjs';
import { icon } from './icon.mjs';

/**
 * @param {import('../../tools/build.mjs').RenderContext} ctx
 * @param {{ variant?: 'overlay' | 'solid', demo?: boolean, demoHref?: string, idPrefix?: string }} [o]
 */
export function header(ctx, { variant, demo = false, demoHref = '#', idPrefix = 'site' } = {}) {
  const { site, pages, page } = ctx;
  const v = variant || page.meta.header || 'solid';

  const planned = new Set(site.plannedPages || []);
  /** @param {{ label: string, path: string, icon?: string }} item */
  const resolve = (item) =>
    demo && !pages.has(item.path)
      ? { ...item, href: demoHref, current: false }
      : pages.has(item.path) || planned.has(item.path)
        ? { ...item, href: url(item.path), current: page.path === item.path }
        : null;
  const main = (site.nav?.main || []).map(resolve).filter(Boolean);
  const secondary = (site.nav?.secondary || []).map(resolve).filter(Boolean);
  const cta = site.nav?.cta ? resolve(site.nav.cta) : null;
  const menuId = `${idPrefix}-menu`;

  /** @param {any} item @param {string} cls */
  const link = (item, cls) => html`<a${attrs({ class: cls, href: item.href, 'aria-current': item.current ? 'page' : null })}>${item.label}</a>`;
  const brand = html`<a class="brand" href="${url('/')}"${attrs({ 'aria-current': !demo && page.path === '/' ? 'page' : null })}>
      <span class="brand__mark">${icon('leaf')}</span><span class="brand__name">${site.name}</span>
    </a>`;
  const ctaButton = cta
    ? html`<a class="btn btn--primary btn--sm site-header__cta" href="${cta.href}">${icon(cta.icon || 'heart')}<span class="btn__label">${cta.label}</span></a>`
    : '';

  return html`<header class="site-header site-header--${v}"${attrs({ 'data-header': demo ? null : v, 'data-surface': v === 'overlay' ? null : 'cream' })}>
    <div class="container site-header__inner">
      ${brand}
      ${main.length
        ? html`<nav class="site-nav" aria-label="${demo ? `Main (${idPrefix} example)` : 'Main'}">
            <ul class="site-nav__list" role="list">${main.map((item) => html`<li>${link(item, 'site-nav__link')}</li>`)}</ul>
          </nav>`
        : html`<span class="site-nav"></span>`}
      <div class="site-header__actions">
        ${secondary.map((item) => link(item, 'site-nav__link site-header__secondary'))}
        ${secondary.length && cta ? html`<span class="site-header__divider" aria-hidden="true"></span>` : ''}
        ${ctaButton}
        ${main.length || secondary.length
          ? html`<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="${menuId}" data-menu-toggle>
              ${icon('menu')}<span class="sr-only">Open menu</span>
            </button>`
          : ''}
      </div>
    </div>
    ${main.length || secondary.length
      ? html`<div class="site-menu" id="${menuId}" data-surface="forest" role="dialog" aria-modal="true" aria-label="Menu" hidden data-menu>
          <div class="container site-menu__top">
            <span class="brand brand--menu"><span class="brand__mark">${icon('leaf')}</span><span class="brand__name">${site.name}</span></span>
            <button class="menu-toggle menu-toggle--close" type="button" data-menu-close>${icon('x')}<span class="sr-only">Close menu</span></button>
          </div>
          <nav class="container site-menu__nav" aria-label="${demo ? `Menu (${idPrefix} example)` : 'Menu'}">
            <ul class="site-menu__list" role="list">
              ${[...main, ...secondary].map((item) => html`<li>${link(item, 'site-menu__link')}</li>`)}
            </ul>
            ${cta ? html`<p class="site-menu__cta"><a class="btn btn--soft" href="${cta.href}">${icon(cta.icon || 'heart')}<span class="btn__label">${cta.label}</span></a></p>` : ''}
          </nav>
        </div>`
      : ''}
  </header>`;
}
