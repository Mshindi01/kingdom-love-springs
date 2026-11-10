// @ts-check
/** /education/: who we sponsor, what it covers, how it works, visits & meetups, outcomes, FAQ, CTA. */
import { html } from '../../lib/html.mjs';
import { isUnconfirmed, isVisible } from '../../lib/format.mjs';
import { pageHero, helpStrip, ctaBand } from '../../partials/page.mjs';
import { icon } from '../../partials/icon.mjs';
import { sectionHeader, faqList } from '../../partials/ui.mjs';
import { stepsStrip } from '../../partials/sections/steps.mjs';
import { imageRef } from '../../partials/motifs.mjs';

export const meta = {
  title: 'Education & Sponsorship',
  description: 'We sponsor 35 children, ages 7–17, with school fees and ongoing mentorship, visiting their schools and walking alongside their families.',
  path: '/education/',
  motion: true,
};

/** @param {import('../../../tools/build.mjs').RenderContext} ctx */
export function render(ctx) {
  const p = ctx.data.pages.education;
  const prog = ctx.data.programmes.programmes.find((/** @type {any} */ x) => x.id === 'education');
  const stat = (/** @type {string} */ id) => ctx.data.stats.stats.find((/** @type {any} */ s) => s.id === id);
  const steps = ctx.data.home.sections.find((/** @type {any} */ s) => s.id === 'education').steps;
  const covers = prog.covers.filter((/** @type {string} */ c) => !isUnconfirmed(c));
  const faqs = ctx.data.faqs.faqs.filter((/** @type {any} */ f) => f.topic === 'sponsorship' && isVisible(f, ctx.env));

  return html`
    ${pageHero(ctx, p.hero)}

    <section class="section" aria-labelledby="who-title">
      <div class="container split split--center">
        <div class="big-stat" data-surface="sand" data-reveal>
          <p class="big-stat__value">${stat('children').display}</p>
          <p class="big-stat__label">${stat('children').label}</p>
          <p class="big-stat__detail">ages ${stat('ages').display}</p>
        </div>
        <div class="prose" data-reveal>
          <p class="eyebrow">${p.whoTitle}</p>
          <h2 id="who-title">${prog.summary}</h2>
          <p>${prog.body}</p>
        </div>
      </div>
    </section>

    <section class="section section--flush-top" aria-labelledby="covers-title">
      <div class="container">
        <div data-reveal>${sectionHeader({ title: p.coversTitle, id: 'covers-title' })}</div>
        <ul class="covers" role="list" data-reveal>
          ${covers.map((/** @type {string} */ c) => html`<li class="covers__item">${icon('check-circle-2')}<span>${c}</span></li>`)}
          <li class="covers__item">${icon('check-circle-2')}<span>School visits and holiday meetups</span></li>
          <li class="covers__item">${icon('check-circle-2')}<span>Walking alongside the family</span></li>
        </ul>
      </div>
    </section>

    <section class="home-band" data-surface="mint" aria-labelledby="how-title">
      <div class="container">
        ${stepsStrip({ title: 'How sponsorship works', steps, headingLevel: 2, id: 'how-title' })}
      </div>
    </section>

    <section class="section" aria-labelledby="visits-title">
      <div class="container">
        <div data-reveal>${sectionHeader({ title: p.visitsTitle, id: 'visits-title', lead: p.visitsText })}</div>
        <ul class="photo-row" role="list">
          ${p.visitsPhotos.map(
            (/** @type {any} */ x) => html`<li data-reveal><figure class="photo-row__item">${imageRef(ctx, x.image, { fallback: 'landscape', sizes: '(width >= 48rem) 33vw, 100vw' })}<figcaption>${x.caption}</figcaption></figure></li>`,
          )}
        </ul>
      </div>
    </section>

    <section class="section section--flush-top" aria-labelledby="outcomes-title">
      <div class="container split">
        <div data-reveal>${sectionHeader({ eyebrow: 'Outcomes', title: p.outcomesTitle, id: 'outcomes-title', lead: 'Through this consistent support, children who once faced the streets or an uncertain future are now:' })}</div>
        <ul class="checklist checklist--lg" role="list" data-reveal>
          ${ctx.data.programmes.outcomes.map((/** @type {string} */ o) => html`<li>${icon('check-circle-2')}<span>${o}</span></li>`)}
        </ul>
      </div>
    </section>

    ${faqs.length
      ? html`<section class="section section--flush-top" aria-labelledby="faq-title">
          <div class="container split">
            <div data-reveal>${sectionHeader({ eyebrow: 'FAQ', title: p.faqTitle, id: 'faq-title' })}</div>
            <div data-reveal>${faqList(faqs)}</div>
          </div>
        </section>`
      : ''}

    ${ctaBand({ ...p.cta, script: 'walk alongside' })}
    ${helpStrip(ctx, { exclude: [] })}
  `;
}
