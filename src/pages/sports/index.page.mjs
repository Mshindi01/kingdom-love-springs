// @ts-check
/** /sports/: tournaments & clinics, what happens at a gathering, regions, numbers, events, CTA. */
import { html } from '../../lib/html.mjs';
import { formatDate } from '../../lib/format.mjs';
import { pageHero, helpStrip, ctaBand, askHref } from '../../partials/page.mjs';
import { icon } from '../../partials/icon.mjs';
import { sectionHeader, button } from '../../partials/ui.mjs';
import { stepsStrip } from '../../partials/sections/steps.mjs';
import { mapCircle } from '../../partials/sections/map-circle.mjs';

export const meta = {
  title: 'Sports Ministry',
  description: 'Football tournaments and clinics across Nairobi, Western Kenya and the Coast: around 200 children and youth at each gathering, 500–600 a year.',
  path: '/sports/',
  motion: true,
};

/** @param {import('../../../tools/build.mjs').RenderContext} ctx */
export function render(ctx) {
  const p = ctx.data.pages.sports;
  const prog = ctx.data.programmes.programmes.find((/** @type {any} */ x) => x.id === 'sports');
  const stat = (/** @type {string} */ id) => ctx.data.stats.stats.find((/** @type {any} */ s) => s.id === id);
  const regions = ctx.data.regions.regions;
  const today = new Date().toISOString().slice(0, 10);
  const events = (ctx.data.events.events || [])
    .filter((/** @type {any} */ e) => e.date >= today)
    .sort((/** @type {any} */ a, /** @type {any} */ b) => a.date.localeCompare(b.date));
  const ask = askHref(ctx, 'Hello Kingdom Love Springs, when is the next football tournament?');

  return html`
    ${pageHero(ctx, p.hero)}

    <section class="section" aria-labelledby="sports-intro-title">
      <div class="container split split--center">
        <div class="prose" data-reveal>
          <p class="eyebrow">Tournaments & clinics</p>
          <h2 id="sports-intro-title">${prog.summary}</h2>
          <p>${prog.body}</p>
        </div>
        <div class="stat-pair" data-reveal>
          ${['per-gathering', 'per-year'].map(
            (id) => html`<div class="big-stat" data-surface="${id === 'per-year' ? 'forest' : 'sand'}">
              <p class="big-stat__value">${stat(id).display}</p>
              <p class="big-stat__label">${stat(id).label}</p>
              <p class="big-stat__detail">${stat(id).detail}</p>
            </div>`,
          )}
        </div>
      </div>
    </section>

    <section class="home-band" data-surface="mint" aria-labelledby="gathering-title">
      <div class="container">${stepsStrip({ title: p.gatheringTitle, steps: p.gatheringSteps, headingLevel: 2, id: 'gathering-title' })}</div>
    </section>

    <section class="section" aria-labelledby="regions-title">
      <div class="container">
        ${mapCircle({ regions, title: p.regionsTitle, script: 'across Kenya', id: 'regions-title', lead: `${p.regionText} across ${regions.map((/** @type {any} */ r) => r.name).join(', ').replace(/, ([^,]*)$/, ' and the $1')}.` })}
        <ul class="region-cards" role="list">
          ${regions.map(
            (/** @type {any} */ r) => html`<li class="region-card" data-reveal>
              <span class="region-card__icon">${icon('map-pin')}</span>
              <h3 class="region-card__title">${r.name}</h3>
              <p class="region-card__text">${p.regionText}</p>
            </li>`,
          )}
        </ul>
      </div>
    </section>

    <section class="section section--flush-top" aria-labelledby="events-title">
      <div class="container">
        <div data-reveal>${sectionHeader({ eyebrow: 'Calendar', title: p.eventsTitle, id: 'events-title' })}</div>
        ${events.length
          ? html`<ul class="events" role="list">
              ${events.map(
                (/** @type {any} */ e) => html`<li class="event" data-reveal>
                  <p class="event__date">${icon('calendar')}<time datetime="${e.date}">${formatDate(e.date)}</time></p>
                  <h3 class="event__title">${e.title}</h3>
                  <p class="event__meta">${icon('map-pin')}${regions.find((/** @type {any} */ r) => r.id === e.region)?.name || ''} · ${e.type === 'clinic' ? 'Clinic' : 'Tournament'}</p>
                  ${e.summary ? html`<p class="event__summary">${e.summary}</p>` : ''}
                </li>`,
              )}
            </ul>`
          : html`<div class="empty-state" data-surface="sand" data-reveal>
              <span class="empty-state__icon">${icon('trophy')}</span>
              <p>${p.eventsEmpty}</p>
              ${button({ label: p.eventsAsk, href: ask, iconStart: 'message-circle', variant: 'outline', external: false })}
            </div>`}
      </div>
    </section>

    ${ctaBand({ ...p.cta, icon: 'trophy', script: 'play · hope · faith' })}
    ${helpStrip(ctx)}
  `;
}
