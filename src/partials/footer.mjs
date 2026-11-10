// @ts-check
/**
 * Site footer (forest-900, rounded top): short mission, links, contact, socials,
 * "Sponsor a child", safeguarding & privacy, ©. Anything still [CONFIRM] is never shown,
 * and links only appear once their page exists.
 */
import { html } from '../lib/html.mjs';
import { url } from '../lib/url.mjs';
import { isUnconfirmed } from '../lib/format.mjs';
import { icon } from './icon.mjs';
import { button } from './ui.mjs';

/** @param {import('../../tools/build.mjs').RenderContext} ctx */
export function footer(ctx) {
  const { site, pages, buildYear } = ctx;
  const planned = new Set(site.plannedPages || []);
  /** @param {{ path: string }} item */
  const exists = (item) => pages.has(item.path) || planned.has(item.path);
  const links = [...(site.nav?.main || []), ...(site.nav?.secondary || [])].filter(exists);
  const legal = (site.nav?.legal || []).filter(exists);
  const cta = site.nav?.cta && exists(site.nav.cta) ? site.nav.cta : null;
  const c = site.contact || {};
  const email = isUnconfirmed(c.email) ? null : c.email;
  const phone = isUnconfirmed(c.phone) ? null : c.phone;
  const whatsapp = isUnconfirmed(c.whatsapp) ? null : String(c.whatsapp).replace(/\D/g, '');
  const location = isUnconfirmed(c.location) ? null : c.location;
  const socials = (site.socials || []).filter((/** @type {any} */ s) => s.url && !isUnconfirmed(s.url));
  const hasContact = email || phone || whatsapp || location;

  return html`<footer class="site-footer" data-surface="forest">
    <div class="container site-footer__grid">
      <div class="site-footer__about">
        <p class="brand brand--footer"><span class="brand__mark">${icon('leaf')}</span><span class="brand__name">${site.name}</span></p>
        <p class="site-footer__mission">${site.tagline}.</p>
        ${cta ? button({ label: cta.label, href: cta.path, variant: 'soft', iconStart: cta.icon || 'heart' }) : ''}
      </div>
      ${links.length
        ? html`<nav class="site-footer__col" aria-label="Footer">
            <h2 class="site-footer__heading">Explore</h2>
            <ul role="list">${links.map((l) => html`<li><a href="${url(l.path)}">${l.label}</a></li>`)}</ul>
          </nav>`
        : ''}
      ${hasContact
        ? html`<div class="site-footer__col">
            <h2 class="site-footer__heading">Contact</h2>
            <ul role="list">
              ${email ? html`<li><a href="mailto:${email}">${icon('mail')}${email}</a></li>` : ''}
              ${phone ? html`<li><a href="tel:${phone.replace(/\s/g, '')}">${icon('phone')}${phone}</a></li>` : ''}
              ${whatsapp ? html`<li><a href="https://wa.me/${whatsapp}">${icon('message-circle')}WhatsApp</a></li>` : ''}
              ${location ? html`<li><span>${icon('map-pin')}${location}</span></li>` : ''}
            </ul>
          </div>`
        : ''}
      ${socials.length
        ? html`<div class="site-footer__col">
            <h2 class="site-footer__heading">Follow</h2>
            <ul class="cluster" role="list">${socials.map(
              (/** @type {any} */ s) => html`<li><a class="share-row__btn" href="${s.url}" rel="noopener" target="_blank">${icon(s.icon)}<span class="sr-only">${s.name} (opens in a new tab)</span></a></li>`,
            )}</ul>
          </div>`
        : ''}
    </div>
    <div class="container site-footer__bottom">
      <p>© ${buildYear} ${site.name}</p>
      ${legal.length ? html`<ul class="cluster" role="list">${legal.map((l) => html`<li><a href="${url(l.path)}">${l.label}</a></li>`)}</ul>` : ''}
    </div>
  </footer>`;
}
