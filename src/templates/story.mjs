// @ts-check
/**
 * Collection template: /stories/<slug>/ for each story in data/stories.json.
 * Drafts are generated in dev builds only; production also requires consent: true.
 * Body blocks: paragraph, heading, quote, verse, photo (consented, with caption), list.
 */
import { html } from '../lib/html.mjs';
import { absoluteUrl } from '../lib/url.mjs';
import { formatDate, readingTime } from '../lib/format.mjs';
import { shareRow, breadcrumbs } from '../partials/ui.mjs';
import { imageRef } from '../partials/motifs.mjs';
import { icon } from '../partials/icon.mjs';
import { ctaBand } from '../partials/page.mjs';
import { publishedStories, storyRows, tagsFor, plainText, authorOf } from '../partials/stories.mjs';

/** @param {{ data: Record<string, any>, env: { production: boolean } }} ctx */
export function items(ctx) {
  return (ctx.data.stories?.stories ?? []).filter((/** @type {any} */ s) => (ctx.env.production ? !s.draft && s.consent === true : true));
}

/** @param {any} story */
export function meta(story) {
  return {
    title: story.title,
    description: story.excerpt,
    path: `/stories/${story.slug}/`,
    ogImage: null,
    noindex: Boolean(story.draft),
    motion: true,
  };
}

/** @param {any} ctx @param {any} b */
function block(ctx, b) {
  switch (b.type) {
    case 'heading':
      return html`<h2>${b.text}</h2>`;
    case 'quote':
      return html`<figure class="story-quote"><blockquote><p>${b.text}</p></blockquote>${b.cite ? html`<figcaption>${b.cite}</figcaption>` : ''}</figure>`;
    case 'verse':
      return html`<figure class="story-verse">${icon('book-open')}<blockquote><p>${b.text}</p></blockquote>${b.reference ? html`<figcaption>${b.reference}</figcaption>` : ''}</figure>`;
    case 'photo':
      return html`<figure class="story-photo">${imageRef(ctx, b.image, { fallback: 'landscape', sizes: '(width >= 48rem) 48rem, 100vw' })}${b.caption ? html`<figcaption>${b.caption}</figcaption>` : ''}</figure>`;
    case 'list':
      return html`<ul class="checklist">${(b.items || []).map((/** @type {string} */ i) => html`<li>${icon('check')}<span>${i}</span></li>`)}</ul>`;
    case 'paragraph':
    default:
      return html`<p>${b.text}</p>`;
  }
}

/**
 * @param {import('../../tools/build.mjs').RenderContext} ctx
 * @param {any} story
 */
export function render(ctx, story) {
  const tags = tagsFor(ctx, story);
  const related = publishedStories(ctx)
    .filter((s) => s.slug !== story.slug && tagsFor(ctx, s).some((/** @type {any} */ t) => tags.some((x) => x.id === t.id)))
    .slice(0, 3);

  return html`
    <article class="story" aria-labelledby="story-title">
      <header class="container container--narrow story__header">
        ${breadcrumbs([{ label: 'Home', href: '/' }, { label: 'Stories', href: '/stories/' }, { label: story.title }])}
        ${story.draft ? html`<p class="chip chip--clay">Draft: not published</p>` : ''}
        <h1 class="story__title" id="story-title">${story.title}</h1>
        <p class="story-row__meta">
          <span>${authorOf(ctx, story)}</span><span aria-hidden="true">·</span>
          <time datetime="${story.date}">${formatDate(story.date)}</time><span aria-hidden="true">·</span>
          <span>${readingTime(plainText(story))} min read</span>
          ${tags.map((/** @type {any} */ t) => html`<span aria-hidden="true">·</span><span>${t.label}</span>`)}
        </p>
      </header>
      <div class="container story__cover">${imageRef(ctx, story.cover, { priority: true, fallback: 'landscape', sizes: '(width >= 75rem) 75rem, 100vw' })}</div>
      <div class="container container--narrow story__body flow">
        ${(story.body || []).map((/** @type {any} */ b) => block(ctx, b))}
      </div>
      <div class="container container--narrow story__share">
        ${shareRow({ url: absoluteUrl(ctx.site.url, `/stories/${story.slug}/`), title: story.title })}
      </div>
    </article>

    ${related.length
      ? html`<section class="section" aria-labelledby="related-title">
          <div class="container">
            <h2 id="related-title" class="related__title">${ctx.data.pages.stories.relatedTitle}</h2>
            ${storyRows(ctx, related)}
          </div>
        </section>`
      : html`<div class="section--gap"></div>`}

    ${ctaBand({ title: 'Walk with one child', text: 'Sponsor a child from primary through secondary school.', button: 'Sponsor a child', path: '/sponsor/', id: 'story-cta' })}
  `;
}
