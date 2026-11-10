// @ts-check
/** Home §2: outline circles (scroll-snap on mobile with a hint), mission paragraph, approach link. */
import { html } from '../../lib/html.mjs';
import { url } from '../../lib/url.mjs';
import { icon } from '../icon.mjs';
import { outlineCircles } from './circles.mjs';
import { sectionHeader } from '../ui.mjs';
import { imageRef } from '../motifs.mjs';

/**
 * @param {import('../../../tools/build.mjs').RenderContext} ctx
 * @param {any} s
 */
export default function homeWhatWeDo(ctx, s) {
  return html`<section class="section home-what" aria-labelledby="home-what-title">
    <div class="container">
      <div data-reveal>${sectionHeader({ eyebrow: s.eyebrow, title: s.title, id: 'home-what-title' })}</div>
    </div>
    <div class="home-what__circles">
      ${outlineCircles({
        label: s.eyebrow,
        items: s.circles.map((/** @type {any} */ c) => ({
          label: c.label,
          script: c.script,
          href: c.path,
          media: imageRef(ctx, c.image, { fallback: 'square', sizes: '16rem' }),
        })),
      })}
      <p class="home-what__hint" aria-hidden="true">${s.scrollHint}${icon('arrow-right')}</p>
    </div>
    <div class="container home-what__mission" data-reveal>
      <p class="home-what__text">${ctx.site.mission}</p>
      <a class="link-arrow" href="${url(s.link.path)}">${s.link.label}${icon('arrow-right')}</a>
    </div>
  </section>`;
}
