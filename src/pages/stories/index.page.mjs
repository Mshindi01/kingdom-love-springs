// @ts-check
/** /stories/: featured story + story rows + tag filter chips (links, so it works without JS). */
import { html } from '../../lib/html.mjs';
import { pageHero, helpStrip } from '../../partials/page.mjs';
import { publishedStories, tagChips, storyRows, featuredStory, emptyStories } from '../../partials/stories.mjs';

export const meta = {
  title: 'Stories',
  description: 'Stories from the field: children and youth moving from struggle to purpose through education, football and mentorship.',
  path: '/stories/',
  motion: true,
};

/** @param {import('../../../tools/build.mjs').RenderContext} ctx */
export function render(ctx) {
  const p = ctx.data.pages.stories;
  const stories = publishedStories(ctx);
  const [first, ...rest] = stories;
  return html`
    ${pageHero(ctx, p.hero)}
    <section class="section section--flush-top" aria-label="${p.allLabel}">
      <div class="container stack stack--lg">
        ${tagChips(ctx, null)}
        ${first ? featuredStory(ctx, first) : emptyStories(ctx)}
        ${rest.length ? html`<div data-reveal>${storyRows(ctx, rest)}</div>` : ''}
      </div>
    </section>
    ${helpStrip(ctx)}
  `;
}
