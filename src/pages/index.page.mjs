// @ts-check
/**
 * TEMPORARY Home (A1): name, mission, palette, type samples, "coming soon".
 * Replaced by the full Home in A3 (CONTENT §3).
 */
import { html } from '../lib/html.mjs';
import { icon } from '../partials/icon.mjs';
import { placeholderImage } from '../partials/motifs.mjs';

export const meta = {
  title: 'Home',
  description:
    'Kingdom Love Springs helps children and youth from vulnerable communities across Kenya thrive in school, in life and in faith, through education sponsorship, football and mentorship.',
  path: '/',
  ogImage: null,
  motion: true,
};

const SWATCHES = [
  { token: 'forest-900', role: 'Deep green: bands, footer' },
  { token: 'forest-700', role: 'Dark hover' },
  { token: 'leaf-600', role: 'Primary buttons' },
  { token: 'leaf-500', role: 'Icons, illustration' },
  { token: 'sage-300', role: 'Handwriting on dark' },
  { token: 'mint-50', role: 'Light sections' },
  { token: 'sun-400', role: 'Sunrise gold accent' },
  { token: 'clay-500', role: 'Red-soil accent' },
  { token: 'cream-50', role: 'Page background' },
  { token: 'sand-100', role: 'Soft cards' },
  { token: 'ink-900', role: 'Text' },
  { token: 'ink-500', role: 'Muted text' },
];

/** @param {import('../../tools/build.mjs').RenderContext} ctx */
export function render(ctx) {
  const { site, data } = ctx;
  const cs = data.home.comingSoon;

  return html`
    <section class="cs-hero" aria-labelledby="cs-title">
      <div class="container stack stack--lg">
        <p data-reveal><span class="cs-badge">${icon('sparkles')}${cs.badge}</span></p>
        <h1 id="cs-title" class="cs-hero__title" data-reveal>
          ${site.name}
          <span class="cs-hero__script script" aria-hidden="true">${cs.script}</span>
        </h1>
        <p class="lead" data-reveal>${site.mission}</p>
      </div>
    </section>

    <section class="section--tight" aria-labelledby="cs-note-title">
      <div class="container">
        <div class="cs-note" data-surface="mint" data-reveal>
          ${icon('leaf')}
          <div class="stack stack--sm">
            <h2 id="cs-note-title" class="cs-section-title mt-0">${cs.badge}</h2>
            <p class="measure">${cs.note}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="cs-palette-title">
      <div class="container">
        <p class="eyebrow">Design preview</p>
        <h2 id="cs-palette-title" class="cs-section-title">Our colours</h2>
        <ul class="grid cs-swatches" role="list">
          ${SWATCHES.map(
            (s) => html`<li class="cs-swatch" data-reveal>
              <span class="cs-swatch__chip" style="--swatch: var(--${s.token})" aria-hidden="true"></span>
              <span class="cs-swatch__label"><code>${s.token}</code><span>${s.role}</span></span>
            </li>`,
          )}
        </ul>
      </div>
    </section>

    <section class="section--tight" aria-labelledby="cs-type-title">
      <div class="container">
        <h2 id="cs-type-title" class="cs-section-title">Our type</h2>
        <div class="cs-type">
          <div class="cs-type__card stack" data-surface="sand" data-reveal>
            <p class="eyebrow">General Sans</p>
            <p class="cs-type__sample">Thrive in school, in life and in faith.</p>
            <p class="text-muted">Education, football and mentorship for children and youth across Kenya.</p>
          </div>
          <div class="cs-type__card stack" data-surface="forest" data-reveal>
            <p class="eyebrow">Handwriting (decorative)</p>
            <p class="cs-type__script script" aria-hidden="true">light &amp; salt</p>
            <p class="text-muted">Handwritten lines are decorative and always paired with readable text, like this: “light and salt”.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="cs-photo-title">
      <div class="container stack">
        <h2 id="cs-photo-title" class="cs-section-title">Photos</h2>
        <p class="measure text-muted">Real photos of KLS children and youth will be added once guardian consent is recorded. Until then, the site uses simple illustrated placeholders like this one.</p>
        <div class="cs-placeholder" data-reveal>${placeholderImage('hero', { alt: 'Placeholder illustration: a football and a leaf on a sand background' })}</div>
      </div>
    </section>
  `;
}
