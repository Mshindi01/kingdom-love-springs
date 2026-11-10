// @ts-check
/**
 * Collection template: one page per story in data/stories.json → /stories/<slug>/.
 * Drafts are generated in dev builds only. A4 designs this page properly.
 */
import { html } from '../lib/html.mjs';
import { formatDate } from '../lib/format.mjs';
import { placeholderImage } from '../partials/motifs.mjs';

/** @param {{ data: Record<string, any> }} ctx */
export function items(ctx) {
  return ctx.data.stories?.stories ?? [];
}

/** @param {any} story */
export function meta(story) {
  return {
    title: story.title,
    description: story.excerpt,
    path: `/stories/${story.slug}/`,
    ogImage: null,
    noindex: Boolean(story.draft),
  };
}

/**
 * @param {import('../../tools/build.mjs').RenderContext} _ctx
 * @param {any} story
 */
export function render(_ctx, story) {
  return html`
    <article class="section" aria-labelledby="story-title">
      <div class="container--narrow container stack">
        ${story.draft ? html`<p class="eyebrow">Draft (not published)</p>` : ''}
        <h1 id="story-title">${story.title}</h1>
        <p class="text-muted"><time datetime="${story.date}">${formatDate(story.date)}</time></p>
        ${story.cover?.placeholder ? placeholderImage(story.cover.placeholder, { alt: story.cover.alt || '' }) : ''}
        ${(story.body || []).map((/** @type {any} */ block) =>
          block.type === 'paragraph' ? html`<p>${block.text}</p>` : '',
        )}
      </div>
    </article>
  `;
}
