// @ts-check
/**
 * Small UI partials: buttons, chips/badges, eyebrow, section header, breadcrumbs,
 * pagination, share row, FAQ accordion, toast region.
 */
import { html, attrs } from '../lib/html.mjs';
import { url } from '../lib/url.mjs';
import { icon } from './icon.mjs';

/**
 * @param {{
 *   label: string, href?: string, variant?: 'primary' | 'soft' | 'outline' | 'link' | 'ghost',
 *   icon?: string, iconStart?: string, size?: 'sm' | 'md' | 'lg', type?: 'button' | 'submit',
 *   attributes?: Record<string, unknown>, className?: string, external?: boolean
 * }} o
 */
export function button({ label, href, variant = 'primary', icon: iconEnd, iconStart, size = 'md', type = 'button', attributes = {}, className = '', external }) {
  const cls = ['btn', `btn--${variant}`, size !== 'md' && `btn--${size}`, className];
  const inner = html`${iconStart ? icon(iconStart) : ''}<span class="btn__label">${label}</span>${iconEnd ? icon(iconEnd) : ''}`;
  if (href) {
    const link = external || /^(https?:|mailto:|tel:)/.test(href) ? href : url(href);
    return html`<a${attrs({ class: cls, href: link, ...(external ? { rel: 'noopener', target: '_blank' } : {}), ...attributes })}>${inner}</a>`;
  }
  return html`<button${attrs({ class: cls, type, ...attributes })}>${inner}</button>`;
}

/**
 * @param {string} text
 * @param {{ tone?: 'outline' | 'sun' | 'clay' | 'sage' | 'glass', icon?: string, dot?: boolean }} [o]
 */
export function chip(text, { tone = 'outline', icon: ic, dot } = {}) {
  return html`<span class="chip chip--${tone}">${dot ? html`<span class="chip__dot" aria-hidden="true"></span>` : ''}${ic ? icon(ic) : ''}${text}</span>`;
}

/** @param {string} text */
export const eyebrow = (text) => html`<p class="eyebrow">${text}</p>`;

/**
 * Left-aligned section title (Genocide Edu): eyebrow, title, optional lead + link.
 * @param {{ eyebrow?: string, title: string, lead?: string, id?: string, level?: 1 | 2 | 3,
 *   link?: { label: string, href: string }, align?: 'start' | 'center', script?: unknown }} o
 */
export function sectionHeader({ eyebrow: eb, title, lead, id, level = 2, link, align = 'start', script }) {
  const heading =
    level === 1 ? html`<h1 class="section-header__title" id="${id}">${title}</h1>`
    : level === 3 ? html`<h3 class="section-header__title" id="${id}">${title}</h3>`
    : html`<h2 class="section-header__title" id="${id}">${title}</h2>`;
  return html`<div class="section-header section-header--${align}">
    <div class="section-header__text">
      ${eb ? html`<p class="eyebrow">${eb}</p>` : ''}
      ${heading}
      ${script || ''}
      ${lead ? html`<p class="lead">${lead}</p>` : ''}
    </div>
    ${link ? html`<a class="link-arrow" href="${url(link.href)}">${link.label}${icon('arrow-right')}</a>` : ''}
  </div>`;
}

/** @param {{ label: string, href?: string }[]} items last item = current page */
export function breadcrumbs(items) {
  return html`<nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol role="list">
      ${items.map((item, i) =>
        i === items.length - 1
          ? html`<li><span aria-current="page">${item.label}</span></li>`
          : html`<li><a href="${url(item.href || '/')}">${item.label}</a>${icon('chevron-right')}</li>`,
      )}
    </ol>
  </nav>`;
}

/**
 * @param {{ current: number, total: number, href: (n: number) => string }} o
 */
export function pagination({ current, total, href }) {
  if (total <= 1) return '';
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return html`<nav class="pagination" aria-label="Pagination">
    <ul role="list">
      <li>${current > 1
        ? html`<a class="pagination__step" href="${url(href(current - 1))}" rel="prev">${icon('chevron-left')}<span>Previous</span></a>`
        : html`<span class="pagination__step is-disabled" aria-hidden="true">${icon('chevron-left')}<span>Previous</span></span>`}</li>
      ${pages.map((n) =>
        n === current
          ? html`<li><a class="pagination__page" href="${url(href(n))}" aria-current="page"><span class="sr-only">Page </span>${n}</a></li>`
          : html`<li><a class="pagination__page" href="${url(href(n))}"><span class="sr-only">Page </span>${n}</a></li>`,
      )}
      <li>${current < total
        ? html`<a class="pagination__step" href="${url(href(current + 1))}" rel="next"><span>Next</span>${icon('chevron-right')}</a>`
        : html`<span class="pagination__step is-disabled" aria-hidden="true"><span>Next</span>${icon('chevron-right')}</span>`}</li>
    </ul>
  </nav>`;
}

/**
 * Share links (no third-party scripts). The copy button needs JS; it's hidden without it.
 * @param {{ url: string, title: string }} o absolute page URL
 */
export function shareRow({ url: pageUrl, title }) {
  const t = encodeURIComponent(title);
  const u = encodeURIComponent(pageUrl);
  return html`<div class="share-row">
    <p class="share-row__label">${icon('share-2')}Share</p>
    <ul class="cluster" role="list">
      <li><a class="share-row__btn" href="https://wa.me/?text=${t}%20${u}" rel="noopener" target="_blank">${icon('message-circle')}<span class="sr-only">Share on WhatsApp (opens in a new tab)</span></a></li>
      <li><a class="share-row__btn" href="https://www.facebook.com/sharer/sharer.php?u=${u}" rel="noopener" target="_blank">${icon('facebook')}<span class="sr-only">Share on Facebook (opens in a new tab)</span></a></li>
      <li><a class="share-row__btn" href="mailto:?subject=${t}&amp;body=${u}">${icon('mail')}<span class="sr-only">Share by email</span></a></li>
      <li class="js-only"><button class="share-row__btn" type="button" data-copy-link="${pageUrl}">${icon('link')}<span class="sr-only">Copy link</span></button></li>
    </ul>
  </div>`;
}

/**
 * FAQ accordion: native <details>, works without JS.
 * @param {{ id?: string, question: string, answer: string }[]} items
 */
export function faqList(items) {
  return html`<div class="faq">
    ${items.map(
      (item) => html`<details class="faq__item"${attrs({ id: item.id ? `faq-${item.id}` : null })}>
        <summary class="faq__q"><span>${item.question}</span>${icon('chevron-down', { className: 'faq__icon' })}</summary>
        <div class="faq__a"><p>${item.answer}</p></div>
      </details>`,
    )}
  </div>`;
}

/** Live region for toasts (one per page, rendered by the layout). */
export const toastRegion = () => html`<div class="toast-region" role="status" aria-live="polite" data-toast-region></div>`;
