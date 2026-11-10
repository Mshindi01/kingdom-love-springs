// @ts-check
/**
 * Stories helpers shared by /stories/, /stories/tag/<tag>/ and /stories/<slug>/.
 * Production builds only ever see published (non-draft) stories with consent: true
 * (SAFEGUARDING §4); drafts appear in dev builds.
 */
import { html } from '../lib/html.mjs';
import { url } from '../lib/url.mjs';
import { formatDate, readingTime, isUnconfirmed } from '../lib/format.mjs';
import { icon } from './icon.mjs';
import { storyRow } from './cards.mjs';
import { imageRef } from './motifs.mjs';

/** @param {{ data: Record<string, any>, env: { production: boolean } }} ctx */
export function publishedStories(ctx) {
  return (ctx.data.stories?.stories ?? [])
    .filter((/** @type {any} */ s) => (ctx.env.production ? !s.draft && s.consent === true : true))
    .sort((/** @type {any} */ a, /** @type {any} */ b) => String(b.date).localeCompare(String(a.date)));
}

/** @param {{ data: Record<string, any> }} ctx */
export const storyTags = (ctx) => ctx.data.pages.stories.tags;

/** @param {{ data: Record<string, any> }} ctx @param {any} story */
export function tagsFor(ctx, story) {
  return storyTags(ctx).filter((/** @type {any} */ t) => t.programmes.includes(story.programme));
}

/** @param {any} story */
export function plainText(story) {
  return (story.body || [])
    .map((/** @type {any} */ b) => [b.text, ...(b.items || [])].filter(Boolean).join(' '))
    .join(' ');
}

/** @param {{ site: any }} ctx @param {any} story */
export const authorOf = (ctx, story) => (isUnconfirmed(story.author) || !story.author ? ctx.site.name : story.author);

/**
 * Filter chips: real links, so filtering works without JS.
 * @param {{ data: Record<string, any> }} ctx
 * @param {string | null} current tag id, or null for "All"
 */
export function tagChips(ctx, current) {
  const p = ctx.data.pages.stories;
  return html`<nav class="tag-chips" aria-label="Filter stories by topic">
    <ul class="cluster" role="list">
      <li><a class="tag-chip" href="${url('/stories/')}"${current ? '' : html` aria-current="page"`}>${p.allLabel}</a></li>
      ${p.tags.map(
        (/** @type {any} */ t) => html`<li><a class="tag-chip" href="${url(`/stories/tag/${t.id}/`)}"${current === t.id ? html` aria-current="page"` : ''}>${t.label}</a></li>`,
      )}
    </ul>
  </nav>`;
}

/**
 * @param {any} ctx
 * @param {any[]} stories
 */
export function storyRows(ctx, stories) {
  const programmes = ctx.data.programmes.programmes;
  return html`<div class="story-rows">
    ${stories.map((s) =>
      storyRow({
        href: `/stories/${s.slug}/`,
        title: s.title,
        excerpt: s.excerpt,
        author: authorOf(ctx, s),
        date: s.date,
        dateLabel: formatDate(s.date),
        readTime: readingTime(plainText(s)),
        thumb: imageRef(ctx, s.cover, { fallback: 'square', sizes: '9rem' }),
        programme: programmes.find((/** @type {any} */ p) => p.id === s.programme)?.title,
      }),
    )}
  </div>`;
}

/**
 * Featured story: large photo card.
 * @param {any} ctx
 * @param {any} s
 */
export function featuredStory(ctx, s) {
  const p = ctx.data.pages.stories;
  return html`<article class="feature-story" data-reveal>
    <div class="feature-story__media">${imageRef(ctx, s.cover, { fallback: 'landscape', sizes: '(width >= 56rem) 55vw, 100vw' })}</div>
    <div class="feature-story__body">
      <p class="eyebrow">${p.featuredLabel}</p>
      <h2 class="feature-story__title"><a class="stretched-link" href="${url(`/stories/${s.slug}/`)}">${s.title}</a></h2>
      <p class="text-muted">${s.excerpt}</p>
      <p class="story-row__meta"><time datetime="${s.date}">${formatDate(s.date)}</time><span aria-hidden="true">·</span><span>${readingTime(plainText(s))} min read</span></p>
      <span class="link-arrow" aria-hidden="true">Read the story${icon('arrow-right')}</span>
    </div>
  </article>`;
}

/** @param {any} ctx */
export function emptyStories(ctx) {
  return html`<div class="empty-state" data-surface="sand" data-reveal>
    <span class="empty-state__icon">${icon('book-open')}</span>
    <p>${ctx.data.pages.stories.empty}</p>
  </div>`;
}
