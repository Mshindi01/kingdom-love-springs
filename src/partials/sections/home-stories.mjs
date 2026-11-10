// @ts-check
/**
 * Home §7: stories (Genocide Edu: big intro left, story rows right).
 * Production: only published (non-draft, consented) stories; the section disappears if there
 * are none. Dev builds show the draft placeholders.
 */
import { html } from '../../lib/html.mjs';
import { url } from '../../lib/url.mjs';
import { icon } from '../icon.mjs';
import { storyRow } from '../cards.mjs';
import { imageRef } from '../motifs.mjs';
import { formatDate, readingTime, isUnconfirmed } from '../../lib/format.mjs';

/**
 * @param {import('../../../tools/build.mjs').RenderContext} ctx
 * @param {any} s
 */
export default function homeStories(ctx, s) {
  const all = ctx.data.stories?.stories ?? [];
  const stories = all
    .filter((/** @type {any} */ x) => (ctx.env.production ? !x.draft && x.consent === true : true))
    .sort((/** @type {any} */ a, /** @type {any} */ b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, s.limit || 3);
  if (!stories.length) return '';

  const programmes = ctx.data.programmes.programmes;
  const storiesIndexExists = ctx.pages.has('/stories/') || (ctx.site.plannedPages || []).includes('/stories/');

  return html`<section class="section home-stories" aria-labelledby="home-stories-title">
    <div class="container home-stories__grid">
      <div class="home-stories__intro" data-reveal>
        <p class="eyebrow">${s.eyebrow}</p>
        <h2 class="home-stories__title" id="home-stories-title">${s.intro}</h2>
        ${storiesIndexExists ? html`<a class="link-arrow" href="${url(s.link.path)}">${s.link.label}${icon('arrow-right')}</a>` : ''}
      </div>
      <div class="story-rows" data-reveal>
        ${stories.map((/** @type {any} */ x) =>
          storyRow({
            href: `/stories/${x.slug}/`,
            title: x.title,
            excerpt: x.excerpt,
            author: isUnconfirmed(x.author) ? ctx.site.name : x.author,
            date: x.date,
            dateLabel: formatDate(x.date),
            readTime: readingTime((x.body || []).map((/** @type {any} */ b) => b.text || '').join(' ')),
            thumb: imageRef(ctx, x.cover, { fallback: 'square', sizes: '9rem' }),
            programme: programmes.find((/** @type {any} */ p) => p.id === x.programme)?.title,
          }),
        )}
      </div>
    </div>
  </section>`;
}
