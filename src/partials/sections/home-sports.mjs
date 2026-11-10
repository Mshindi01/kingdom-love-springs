// @ts-check
/** Home §6: sports ministry: Unity-style collage + text + region chips + CTA. */
import { html } from '../../lib/html.mjs';
import { url } from '../../lib/url.mjs';
import { icon } from '../icon.mjs';
import { photoCollage } from './media-blocks.mjs';
import { chip } from '../ui.mjs';
import { imageRef } from '../motifs.mjs';

/**
 * @param {import('../../../tools/build.mjs').RenderContext} ctx
 * @param {any} s
 */
export default function homeSports(ctx, s) {
  const programme = ctx.data.programmes.programmes.find((/** @type {any} */ p) => p.id === 'sports');
  const chipStat = ctx.data.stats.stats.find((/** @type {any} */ x) => x.id === s.chip.stat);

  return html`<section class="section home-sports" aria-labelledby="home-sports-title">
    <div class="container home-sports__grid">
      <div class="home-sports__media" data-reveal>
        ${photoCollage({
          main: imageRef(ctx, s.images.main, { fallback: 'portrait', sizes: '(width >= 56rem) 45vw, 100vw' }),
          round: imageRef(ctx, s.images.round, { fallback: 'square', sizes: '12rem' }),
          chip: chipStat ? { value: chipStat.display, text: s.chip.text, icon: 'trophy' } : undefined,
        })}
      </div>
      <div class="home-sports__text stack" data-reveal>
        <p class="eyebrow">${s.eyebrow}</p>
        <h2 id="home-sports-title">${s.title}</h2>
        <p class="home-sports__body">${programme.body}</p>
        <ul class="cluster" role="list" aria-label="Regions">
          ${ctx.data.regions.regions.map((/** @type {any} */ r) => html`<li>${chip(r.name, { icon: 'map-pin' })}</li>`)}
        </ul>
        <p><a class="link-arrow" href="${url(s.link.path)}">${s.link.label}${icon('arrow-right')}</a></p>
      </div>
    </div>
  </section>`;
}
