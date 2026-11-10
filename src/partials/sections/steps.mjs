// @ts-check
/**
 * Numbered steps with a thin connecting line that draws on scroll (motion/line-draw.js).
 * Used for "How sponsorship works" (Home, Education) and "What happens at a gathering" (Sports).
 */
import { html } from '../../lib/html.mjs';

/**
 * @param {{ title?: string, steps: { title: string, text?: string }[], headingLevel?: 2 | 3, id?: string }} o
 */
export function stepsStrip({ title, steps, headingLevel = 3, id }) {
  const heading = title
    ? headingLevel === 2
      ? html`<h2 class="how__title" id="${id}" data-reveal>${title}</h2>`
      : html`<h3 class="how__title" id="${id}" data-reveal>${title}</h3>`
    : '';
  const stepHeading = (/** @type {number} */ i, /** @type {string} */ t) =>
    headingLevel === 2
      ? html`<h3 class="how__step-title"><span class="sr-only">Step ${i + 1}: </span>${t}</h3>`
      : html`<h4 class="how__step-title"><span class="sr-only">Step ${i + 1}: </span>${t}</h4>`;
  return html`<div class="how">
    ${heading}
    <div class="how__track">
      <span class="how__line" aria-hidden="true" data-draw-line></span>
      <ol class="how__list" role="list">
        ${steps.map(
          (step, i) => html`<li class="how__step" data-reveal>
            <span class="how__num" aria-hidden="true">${i + 1}</span>
            ${stepHeading(i, step.title)}
            ${step.text ? html`<p class="how__step-text">${step.text}</p>` : ''}
          </li>`,
        )}
      </ol>
    </div>
  </div>`;
}
