// @ts-check
/** /about/: mission, vision, approach (4 pillars), why it matters, team, faith, partners. */
import { html } from '../../lib/html.mjs';
import { isVisible } from '../../lib/format.mjs';
import { pageHero, helpStrip } from '../../partials/page.mjs';
import { icon } from '../../partials/icon.mjs';
import { sectionHeader } from '../../partials/ui.mjs';
import { personCircle } from '../../partials/cards.mjs';
import { imageRef } from '../../partials/motifs.mjs';

export const meta = {
  title: 'About',
  description: 'Kingdom Love Springs gives children and youth from vulnerable communities across Kenya the opportunity to thrive in school, in life and in faith.',
  motion: true,
};

/** @param {import('../../../tools/build.mjs').RenderContext} ctx */
export function render(ctx) {
  const p = ctx.data.pages.about;
  const prog = ctx.data.programmes;
  const team = (ctx.data.team.members || []).filter((/** @type {any} */ m) => isVisible(m, ctx.env, ['name', 'role', 'bio']));
  const partners = (ctx.data.partners.partners || []).filter((/** @type {any} */ x) => isVisible(x, ctx.env, ['name']) && (x.logoPermission || !ctx.env.production));
  const faith = isVisible(p.faith, ctx.env) ? p.faith : null;

  return html`
    ${pageHero(ctx, p.hero)}

    <section class="section" aria-label="Mission and vision">
      <div class="container mv">
        <article class="mv__card" data-surface="sand" data-reveal>
          <span class="mv__icon">${icon('heart')}</span>
          <h2 class="mv__title">${p.missionTitle}</h2>
          <p>${ctx.site.mission}</p>
        </article>
        <article class="mv__card" data-surface="forest" data-reveal>
          <span class="mv__icon">${icon('sun')}</span>
          <h2 class="mv__title">${p.visionTitle}</h2>
          <p>${prog.vision}</p>
        </article>
      </div>
    </section>

    <section class="section section--flush-top" aria-labelledby="approach-title">
      <div class="container">
        <div data-reveal>${sectionHeader({ eyebrow: p.approachEyebrow, title: p.approachTitle, id: 'approach-title' })}</div>
        <ul class="pillars" role="list">
          ${prog.approach.pillars.map(
            (/** @type {any} */ x, /** @type {number} */ i) => html`<li class="pillar" data-reveal>
              <span class="pillar__num" aria-hidden="true">0${i + 1}</span>
              <span class="pillar__icon">${icon(x.icon)}</span>
              <h3 class="pillar__title">${x.title}</h3>
              <p class="pillar__text">${x.text}</p>
            </li>`,
          )}
        </ul>
        <p class="belief" data-reveal>${prog.approach.belief}</p>
      </div>
    </section>

    <section class="section" data-surface="mint" aria-labelledby="why-title">
      <div class="container split">
        <div data-reveal>${sectionHeader({ eyebrow: 'Outcomes', title: p.whyTitle, id: 'why-title', lead: p.whyIntro })}</div>
        <ul class="checklist checklist--lg" role="list" data-reveal>
          ${prog.outcomes.map((/** @type {string} */ o) => html`<li>${icon('check-circle-2')}<span>${o}</span></li>`)}
        </ul>
      </div>
    </section>

    ${team.length
      ? html`<section class="section" aria-labelledby="team-title">
          <div class="container">
            <div data-reveal>${sectionHeader({ title: p.teamTitle, id: 'team-title' })}</div>
            <div class="team" data-reveal>
              ${team.map((/** @type {any} */ m) => personCircle({ media: imageRef(ctx, m.photo ? { photo: m.photo } : null, { fallback: 'square' }), name: m.name, role: m.role, text: m.bio }))}
            </div>
          </div>
        </section>`
      : ''}

    ${faith
      ? html`<section class="section section--flush-top" aria-labelledby="faith-title">
          <div class="container container--narrow" data-reveal>
            <h2 id="faith-title">${faith.title}</h2>
            <p class="lead">${faith.text}</p>
          </div>
        </section>`
      : ''}

    ${partners.length
      ? html`<section class="section section--flush-top" aria-labelledby="partners-title">
          <div class="container">
            <h2 id="partners-title" class="sg-subtitle">${p.partnersTitle}</h2>
            <ul class="marquee" role="list">
              ${partners.map((/** @type {any} */ x) => html`<li class="marquee__item">${x.name}</li>`)}
            </ul>
          </div>
        </section>`
      : ''}

    ${helpStrip(ctx)}
  `;
}
