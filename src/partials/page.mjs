// @ts-check
/**
 * Shared inner-page partials: page hero (cream or photo variant) with breadcrumbs,
 * the closing "How you can help" strip, a CTA band and the contact helper.
 */
import { html } from '../lib/html.mjs';
import { isUnconfirmed } from '../lib/format.mjs';
import { icon } from './icon.mjs';
import { scriptLine } from './script-line.mjs';
import { breadcrumbs, button, sectionHeader } from './ui.mjs';
import { softCard } from './cards.mjs';
import { imageRef } from './motifs.mjs';

/**
 * Page hero. With `hero.image` it's the photo variant: title block, then a wide rounded
 * photo with the script line crossing its edge. Without an image it's the cream variant.
 * @param {import('../../tools/build.mjs').RenderContext} ctx
 * @param {{ eyebrow?: string, title: string, script?: string, intro?: string, image?: any }} hero
 * @param {{ crumbs?: { label: string, href?: string }[] }} [o]
 */
export function pageHero(ctx, hero, { crumbs } = {}) {
  const trail = crumbs || [{ label: 'Home', href: '/' }, { label: ctx.page.meta.title }];
  const hasImage = Boolean(hero.image);
  return html`<section class="page-hero${hasImage ? ' page-hero--photo' : ''}" aria-labelledby="page-title">
    <div class="container">
      ${breadcrumbs(trail)}
      <div class="page-hero__text" data-reveal>
        ${hero.eyebrow ? html`<p class="eyebrow">${hero.eyebrow}</p>` : ''}
        <h1 class="page-hero__title" id="page-title">${hero.title}</h1>
        ${hero.intro ? html`<p class="lead page-hero__intro">${hero.intro}</p>` : ''}
      </div>
      ${hasImage
        ? html`<div class="page-hero__media">
            ${imageRef(ctx, hero.image, { priority: true, fallback: 'hero', sizes: '(width >= 75rem) 75rem, 100vw' })}
            ${hero.script ? html`<div class="page-hero__script">${scriptLine({ text: hero.script, swoosh: 'rise', size: 'lg', color: 'sun' })}</div>` : ''}
          </div>`
        : hero.script
          ? html`<div class="page-hero__script page-hero__script--inline">${scriptLine({ text: hero.script, swoosh: 'underline', size: 'lg' })}</div>`
          : ''}
    </div>
  </section>`;
}

/**
 * The closing "How you can help" strip (3 soft cards, middle one dark).
 * @param {import('../../tools/build.mjs').RenderContext} ctx
 * @param {{ exclude?: string[] }} [o]
 */
export function helpStrip(ctx, { exclude = [] } = {}) {
  const cfg = ctx.data.pages.help;
  const ways = cfg.cards
    .filter((/** @type {string} */ id) => !exclude.includes(id))
    .map((/** @type {string} */ id) => ctx.data.involve.ways.find((/** @type {any} */ w) => w.id === id))
    .filter(Boolean);
  return html`<section class="section help-strip" aria-labelledby="help-strip-title">
    <div class="container">
      <div data-reveal>${sectionHeader({ eyebrow: cfg.eyebrow, title: cfg.title, id: 'help-strip-title' })}</div>
      <div class="soft-cards" data-reveal>
        ${ways.map((/** @type {any} */ w) =>
          softCard({ icon: w.icon, title: w.title, text: w.text, cta: { label: w.cta.label, href: w.cta.path }, featured: w.id === cfg.featured }),
        )}
      </div>
    </div>
  </section>`;
}

/**
 * A big dark rounded call-to-action band.
 * @param {{ title: string, text?: string, button: string, path: string, icon?: string, id?: string, script?: string }} o
 */
export function ctaBand({ title, text, button: label, path, icon: ic = 'heart', id = 'cta-title', script }) {
  return html`<section class="cta-band-wrap" aria-labelledby="${id}">
    <div class="container">
      <div class="cta-band" data-surface="forest" data-reveal>
        <div class="cta-band__text">
          <h2 class="cta-band__title" id="${id}">${title}</h2>
          ${text ? html`<p class="cta-band__lead">${text}</p>` : ''}
        </div>
        ${button({ label, href: path, iconStart: ic, variant: 'soft', size: 'lg' })}
        ${script ? html`<div class="cta-band__script">${scriptLine({ text: script, swoosh: 'loop', size: 'md', color: 'sage' })}</div>` : ''}
      </div>
    </div>
  </section>`;
}

/**
 * "Ask us…" link: WhatsApp with a prefilled message when the number is confirmed,
 * otherwise the contact page. Returns an un-prefixed internal path (pass it to button()/url()).
 * @param {import('../../tools/build.mjs').RenderContext} ctx
 * @param {string} message
 */
export function askHref(ctx, message) {
  const wa = ctx.site.contact?.whatsapp;
  if (wa && !isUnconfirmed(wa)) return `https://wa.me/${String(wa).replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  return '/contact/';
}

/**
 * Simple prose section with an optional icon and side media.
 * @param {{ id: string, eyebrow?: string, title: string, paragraphs: string[], media?: unknown, reverse?: boolean, surface?: string }} o
 */
export function proseSection({ id, eyebrow, title, paragraphs, media, reverse = false, surface }) {
  return html`<section class="section prose-section${reverse ? ' prose-section--reverse' : ''}"${surface ? html` data-surface="${surface}"` : ''} aria-labelledby="${id}">
    <div class="container prose-section__grid${media ? '' : ' prose-section__grid--single'}">
      <div class="prose-section__text" data-reveal>
        ${eyebrow ? html`<p class="eyebrow">${eyebrow}</p>` : ''}
        <h2 id="${id}">${title}</h2>
        ${paragraphs.map((p) => html`<p>${p}</p>`)}
      </div>
      ${media ? html`<div class="prose-section__media" data-reveal>${media}</div>` : ''}
    </div>
  </section>`;
}

export { icon };
