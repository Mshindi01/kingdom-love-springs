// @ts-check
/** /get-involved/: anchored sections #sponsor #pray #volunteer #partner #tournament, each with a composer form. */
import { html } from '../../lib/html.mjs';
import { isUnconfirmed, isVisible } from '../../lib/format.mjs';
import { pageHero } from '../../partials/page.mjs';
import { icon } from '../../partials/icon.mjs';
import { button, chip } from '../../partials/ui.mjs';
import { composeForm } from '../../partials/forms/compose-form.mjs';
import { textField, textArea, selectField, radioCards } from '../../partials/forms/fields.mjs';

export const meta = {
  title: 'Get involved',
  description: 'Sponsor a child, pray with us, volunteer, partner with us as a church, school or business, or support a football tournament.',
  path: '/get-involved/',
  motion: true,
};

const NAV = [
  ['sponsor', 'Sponsor a child', 'heart'],
  ['pray', 'Pray', 'hand-heart'],
  ['volunteer', 'Volunteer', 'users'],
  ['partner', 'Partner', 'heart-handshake'],
  ['tournament', 'Support a tournament', 'trophy'],
];

/** Name + one way to reply, shared by every form. @param {string} p */
const you = (p) => html`
  ${textField({ id: `${p}-name`, name: 'Name', label: 'Your name', required: true, autocomplete: 'name', errorMessage: 'Enter your name' })}
  ${textField({ id: `${p}-contact`, name: 'Phone or email', label: 'Phone, WhatsApp or email', hint: 'So we can reply to you.', required: true, autocomplete: 'email', errorMessage: 'Enter a phone number or email address' })}`;

/** @param {import('../../../tools/build.mjs').RenderContext} ctx */
export function render(ctx) {
  const p = ctx.data.pages['get-involved'];
  const inv = ctx.data.involve;
  const prayerPoints = (inv.prayerPoints || []).filter((/** @type {string} */ x) => !isUnconfirmed(x));
  const roles = (inv.volunteerRoles || []).filter((/** @type {any} */ r) => isVisible(r, ctx.env));
  const regions = ctx.data.regions.regions;

  return html`
    ${pageHero(ctx, p.hero)}

    <nav class="container involve-nav" aria-label="On this page">
      <ul class="cluster" role="list">
        ${NAV.map(([id, label, ic]) => html`<li><a class="tag-chip" href="#${id}">${icon(ic)}${label}</a></li>`)}
      </ul>
    </nav>

    <section class="section involve" id="sponsor" aria-labelledby="sponsor-title">
      <div class="container">
        <div class="involve-sponsor" data-surface="forest" data-reveal>
          <span class="involve__icon">${icon('heart')}</span>
          <div class="stack stack--sm">
            <h2 id="sponsor-title">${p.sponsor.title}</h2>
            <p class="text-muted">${p.sponsor.text}</p>
          </div>
          ${button({ label: p.sponsor.button, href: p.sponsor.path, iconStart: 'heart', variant: 'soft', size: 'lg' })}
        </div>
      </div>
    </section>

    <section class="section involve" id="pray" aria-labelledby="pray-title">
      <div class="container involve__grid">
        <div class="involve__intro" data-reveal>
          <span class="involve__icon">${icon('hand-heart')}</span>
          <h2 id="pray-title">${p.pray.title}</h2>
          <p class="lead">${p.pray.text}</p>
          ${prayerPoints.length
            ? html`<h3 class="involve__sub">${p.pray.pointsTitle}</h3>
                <ul class="checklist" role="list">${prayerPoints.map((/** @type {string} */ x) => html`<li>${icon('sparkles')}<span>${x}</span></li>`)}</ul>`
            : ''}
        </div>
        <div class="involve__form" data-surface="white" data-reveal>
          ${composeForm(ctx, {
            id: 'form-pray',
            title: p.pray.formTitle,
            subject: 'A prayer note',
            intro: 'Hello Kingdom Love Springs, here is a prayer note.',
            fields: html`
              ${textField({ id: 'pray-name', name: 'Name', label: 'Your name', autocomplete: 'name' })}
              ${textArea({ id: 'pray-message', name: 'Prayer note', label: 'Your prayer or encouragement', required: true, rows: 5, errorMessage: 'Write your prayer note' })}`,
          })}
        </div>
      </div>
    </section>

    <section class="section involve" id="volunteer" data-surface="mint" aria-labelledby="volunteer-title">
      <div class="container involve__grid">
        <div class="involve__intro" data-reveal>
          <span class="involve__icon">${icon('users')}</span>
          <h2 id="volunteer-title">${p.volunteer.title}</h2>
          <p class="lead">${p.volunteer.text}</p>
          <ul class="role-list" role="list">
            ${roles.map((/** @type {any} */ r) => html`<li class="role">${icon(r.icon)}<span><strong>${r.title}</strong><br><span class="text-muted">${r.text}</span></span></li>`)}
          </ul>
        </div>
        <div class="involve__form" data-surface="white" data-reveal>
          ${composeForm(ctx, {
            id: 'form-volunteer',
            title: p.volunteer.formTitle,
            subject: 'Volunteering with Kingdom Love Springs',
            intro: 'Hello Kingdom Love Springs, I would like to volunteer.',
            fields: html`
              ${you('vol')}
              ${radioCards({ name: 'How I would like to help', legend: 'How would you like to help?', options: roles.map((/** @type {any} */ r) => ({ value: r.title, label: r.title, icon: r.icon })) })}
              ${textArea({ id: 'vol-message', name: 'Message', label: 'Tell us a little about yourself', rows: 4 })}`,
          })}
        </div>
      </div>
    </section>

    <section class="section involve" id="partner" aria-labelledby="partner-title">
      <div class="container involve__grid">
        <div class="involve__intro" data-reveal>
          <span class="involve__icon">${icon('heart-handshake')}</span>
          <h2 id="partner-title">${p.partner.title}</h2>
          <p class="lead">${p.partner.text}</p>
          <ul class="cluster" role="list">${inv.partnerTypes.map((/** @type {string} */ t) => html`<li>${chip(t, { tone: 'sage' })}</li>`)}</ul>
        </div>
        <div class="involve__form" data-surface="white" data-reveal>
          ${composeForm(ctx, {
            id: 'form-partner',
            title: p.partner.formTitle,
            subject: 'Partnering with Kingdom Love Springs',
            intro: 'Hello Kingdom Love Springs, we would like to talk about partnering with you.',
            fields: html`
              ${you('par')}
              ${textField({ id: 'par-org', name: 'Organisation', label: 'Church, school or business name', autocomplete: 'organization' })}
              ${selectField({ id: 'par-type', name: 'Type', label: 'Type of organisation', options: [{ value: '', label: 'Choose…' }, ...inv.partnerTypes.map((/** @type {string} */ t) => ({ value: t, label: t })), { value: 'Other', label: 'Other' }] })}
              ${textArea({ id: 'par-message', name: 'Message', label: 'How would you like to partner?', rows: 4 })}`,
          })}
        </div>
      </div>
    </section>

    <section class="section involve" id="tournament" data-surface="sand" aria-labelledby="tournament-title">
      <div class="container involve__grid">
        <div class="involve__intro" data-reveal>
          <span class="involve__icon">${icon('trophy')}</span>
          <h2 id="tournament-title">${p.tournament.title}</h2>
          <p class="lead">${p.tournament.text}</p>
        </div>
        <div class="involve__form" data-surface="white" data-reveal>
          ${composeForm(ctx, {
            id: 'form-tournament',
            title: p.tournament.formTitle,
            subject: 'Supporting a football tournament',
            intro: 'Hello Kingdom Love Springs, I would like to support a tournament.',
            fields: html`
              ${you('tour')}
              ${textField({ id: 'tour-org', name: 'Organisation', label: 'Church, school or organisation', autocomplete: 'organization' })}
              ${selectField({ id: 'tour-region', name: 'Region', label: 'Region', options: [{ value: '', label: 'Choose…' }, ...regions.map((/** @type {any} */ r) => ({ value: r.name, label: r.name }))] })}
              ${radioCards({ name: 'Support', legend: 'How would you like to support?', options: [{ value: 'Host a tournament', label: 'Host', icon: 'map-pin' }, { value: 'Support a tournament', label: 'Support', icon: 'heart' }, { value: 'Volunteer at a tournament', label: 'Volunteer', icon: 'users' }] })}
              ${textArea({ id: 'tour-message', name: 'Message', label: 'Anything else?', rows: 3 })}`,
          })}
        </div>
      </div>
    </section>
  `;
}
