// @ts-check
/**
 * Cards (DESIGN_SYSTEM §4): soft-card (invert on hover), float-card, story-row,
 * programme-row, doc-card, person-circle, journey-bar.
 * All colours come from the surface tokens, so every card works on every data-surface.
 */
import { html, attrs } from '../lib/html.mjs';
import { url } from '../lib/url.mjs';
import { icon } from './icon.mjs';
import { button } from './ui.mjs';
import { initials } from './motifs.mjs';

/**
 * Soft card → inverts to forest-900 on hover/focus. `featured` starts inverted (the middle
 * card in "How you can help"); it hands the dark state to whichever sibling is hovered.
 * @param {{ icon?: string, title: string, text: string, cta?: { label: string, href: string },
 *   featured?: boolean, headingLevel?: 2 | 3 }} o
 */
export function softCard({ icon: ic, title, text, cta, featured = false, headingLevel = 3 }) {
  const h = headingLevel === 2 ? html`<h2 class="soft-card__title">${title}</h2>` : html`<h3 class="soft-card__title">${title}</h3>`;
  return html`<article class="soft-card${featured ? ' soft-card--featured' : ''}">
    ${ic ? html`<span class="soft-card__icon">${icon(ic)}</span>` : ''}
    ${h}
    <p class="soft-card__text">${text}</p>
    ${cta ? html`<a class="soft-card__link stretched-link" href="${url(cta.href)}">${cta.label}${icon('arrow-up-right')}</a>` : ''}
  </article>`;
}

/**
 * CareNest floating card (white, shadow), e.g. over the hero photo.
 * @param {{ eyebrow?: string, icon?: string, title: string, text: string,
 *   cta?: { label: string, href: string, icon?: string }, meta?: string }} o
 */
export function floatCard({ eyebrow: eb, icon: ic = 'heart', title, text, cta, meta }) {
  return html`<div class="float-card" data-surface="white" data-float>
    <div class="float-card__top">
      ${eb ? html`<span class="float-card__brand">${icon('leaf')}${eb}</span>` : ''}
      ${meta ? html`<span class="float-card__meta"><span class="chip__dot" aria-hidden="true"></span>${meta}</span>` : ''}
    </div>
    <span class="float-card__icon">${icon(ic)}</span>
    <p class="float-card__title">${title}</p>
    <p class="float-card__text">${text}</p>
    ${cta ? button({ label: cta.label, href: cta.href, icon: cta.icon || 'arrow-right', size: 'sm' }) : ''}
  </div>`;
}

/**
 * Genocide Edu story row: avatar + author, title, excerpt, date · read time, square thumb.
 * @param {{ href: string, title: string, excerpt: string, author: string, date: string,
 *   dateLabel: string, readTime: number, thumb: unknown, programme?: string }} o
 */
export function storyRow({ href, title, excerpt, author, date, dateLabel, readTime, thumb, programme }) {
  return html`<article class="story-row">
    <div class="story-row__body">
      <p class="story-row__author">${initials(author)}<span>${author}</span>${programme ? html`<span class="story-row__tag">${programme}</span>` : ''}</p>
      <h3 class="story-row__title"><a class="stretched-link" href="${url(href)}">${title}</a></h3>
      <p class="story-row__excerpt">${excerpt}</p>
      <p class="story-row__meta"><time datetime="${date}">${dateLabel}</time><span aria-hidden="true">·</span><span>${readTime} min read</span></p>
    </div>
    <div class="story-row__thumb">${thumb}</div>
  </article>`;
}

/**
 * Programme row (CareNest): text card + photo; alternate with `reverse`.
 * @param {{ icon?: string, eyebrow?: string, title: string, text: string, media: unknown,
 *   cta?: { label: string, href: string }, reverse?: boolean, extra?: unknown, id?: string }} o
 */
export function programmeRow({ icon: ic, eyebrow: eb, title, text, media, cta, reverse = false, extra, id }) {
  return html`<article class="programme-row${reverse ? ' programme-row--reverse' : ''}"${attrs({ 'aria-labelledby': id })}>
    <div class="programme-row__card">
      ${ic ? html`<span class="programme-row__icon">${icon(ic)}</span>` : ''}
      ${eb ? html`<p class="eyebrow">${eb}</p>` : ''}
      <h3 class="programme-row__title"${attrs({ id })}>${title}</h3>
      <p class="programme-row__text">${text}</p>
      ${extra || ''}
      ${cta ? button({ label: cta.label, href: cta.href, icon: 'arrow-right', size: 'sm' }) : ''}
    </div>
    <div class="programme-row__media">${media}</div>
  </article>`;
}

/**
 * Document card: outline → inverts on hover with a download icon.
 * @param {{ href: string, type: string, title: string, date: string, dateLabel: string, size?: string }} o
 */
export function docCard({ href, type, title, date, dateLabel, size }) {
  return html`<article class="doc-card">
    <p class="doc-card__type">${icon('file-text')}${type}${size ? html` · ${size}` : ''}</p>
    <h3 class="doc-card__title"><a class="stretched-link" href="${url(href)}">${title}</a></h3>
    <p class="doc-card__date"><time datetime="${date}">${dateLabel}</time></p>
    <span class="doc-card__download" aria-hidden="true">${icon('download')}</span>
  </article>`;
}

/**
 * Circle-masked portrait + name/role (+ optional large paragraph for the About pattern).
 * Adults only (team/mentors). Never individual portraits of sponsored children.
 * @param {{ media: unknown, name: string, role?: string, text?: string, size?: 'md' | 'lg' }} o
 */
export function personCircle({ media, name, role, text, size = 'md' }) {
  return html`<figure class="person-circle person-circle--${size}">
    <div class="person-circle__photo">${media}</div>
    <figcaption>
      <span class="person-circle__name">${name}</span>
      ${role ? html`<span class="person-circle__role">${role}</span>` : ''}
      ${text ? html`<span class="person-circle__text">${text}</span>` : ''}
    </figcaption>
  </figure>`;
}

/**
 * Journey bar (Unity-style progress). Renders NOTHING unless `value` is a real number:
 * never show invented progress (CLAUDE.md §2.7).
 * @param {{ label: string, value: number | null | undefined, goalLabel?: string }} o
 */
export function journeyBar({ label, value, goalLabel = 'Goal' }) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '';
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return html`<div class="journey">
    <div class="journey__head"><span>${label}</span><span class="journey__value">${v}%</span></div>
    <div class="journey__track" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${v}">
      <span class="journey__fill" style="--value:${v}%"></span>
    </div>
    <div class="journey__foot"><span>${goalLabel}</span></div>
  </div>`;
}
