// @ts-check
/** Collection template: /stories/tag/<tag>/ for each tag in pages.json → stories.tags. */
import { html } from '../lib/html.mjs';
import { pageHero, helpStrip } from '../partials/page.mjs';
import { publishedStories, tagChips, storyRows, tagsFor, emptyStories } from '../partials/stories.mjs';

/** @param {{ data: Record<string, any> }} ctx */
export function items(ctx) {
  return ctx.data.pages.stories.tags.map((/** @type {any} */ t) => ({ ...t, slug: t.id }));
}

/** @param {any} tag */
export function meta(tag) {
  return {
    title: `${tag.label} stories`,
    description: `Stories from the field about ${tag.label.toLowerCase()}.`,
    path: `/stories/tag/${tag.id}/`,
    motion: true,
  };
}

/**
 * @param {import('../../tools/build.mjs').RenderContext} ctx
 * @param {any} tag
 */
export function render(ctx, tag) {
  const p = ctx.data.pages.stories;
  const stories = publishedStories(ctx).filter((s) => tagsFor(ctx, s).some((/** @type {any} */ t) => t.id === tag.id));
  return html`
    ${pageHero(ctx, { eyebrow: p.hero.eyebrow, title: `${tag.label} stories`, intro: p.hero.intro }, {
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Stories', href: '/stories/' }, { label: tag.label }],
    })}
    <section class="section section--flush-top" aria-label="${tag.label} stories">
      <div class="container stack stack--lg">
        ${tagChips(ctx, tag.id)}
        ${stories.length ? html`<div data-reveal>${storyRows(ctx, stories)}</div>` : emptyStories(ctx)}
      </div>
    </section>
    ${helpStrip(ctx)}
  `;
}
