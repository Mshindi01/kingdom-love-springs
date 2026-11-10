// @ts-check
/** Home §4: education programme row + "How sponsorship works" (4 steps, connecting line draws on scroll). */
import { html } from '../../lib/html.mjs';
import { programmeRow } from '../cards.mjs';
import { button } from '../ui.mjs';
import { imageRef } from '../motifs.mjs';

/**
 * @param {import('../../../tools/build.mjs').RenderContext} ctx
 * @param {any} s
 */
export default function homeEducation(ctx, s) {
  const programme = ctx.data.programmes.programmes.find((/** @type {any} */ p) => p.id === 'education');

  return html`<section class="home-band home-education" data-surface="mint" aria-labelledby="home-education-title">
    <div class="container">
      <h2 class="sr-only" id="home-education-title">${s.eyebrow}</h2>
      <div data-reveal>
        ${programmeRow({
          id: 'home-education-row',
          icon: programme.icon,
          eyebrow: s.eyebrow,
          title: s.title,
          text: programme.body,
          media: imageRef(ctx, s.image, { fallback: 'landscape', sizes: '(width >= 48rem) 50vw, 100vw' }),
          cta: { label: s.cta.label, href: s.cta.path },
        })}
      </div>

      <div class="how">
        <h3 class="how__title" data-reveal>${s.stepsTitle}</h3>
        <div class="how__track">
          <span class="how__line" aria-hidden="true" data-draw-line></span>
          <ol class="how__list" role="list">
            ${s.steps.map(
              (/** @type {any} */ step, /** @type {number} */ i) => html`<li class="how__step" data-reveal>
                <span class="how__num" aria-hidden="true">${i + 1}</span>
                <h4 class="how__step-title"><span class="sr-only">Step ${i + 1}: </span>${step.title}</h4>
                <p class="how__step-text">${step.text}</p>
              </li>`,
            )}
          </ol>
        </div>
        <p class="how__cta" data-reveal>${button({ label: s.cta.label, href: s.cta.path, iconStart: 'heart' })}</p>
      </div>
    </div>
  </section>`;
}
