// @ts-check
/**
 * /contact/: the one place visitors reach us (replaces /get-involved/, client 2026-11-23).
 * Left: contact details (only confirmed ones), WhatsApp button, socials, regions.
 * Right: a two-step composer form.
 *   Step 1 "What would you like to do?": cards from pages.contact.reasons. "Sponsor a child" is a
 *     link card straight to /sponsor/ (its own enquiry); the others are radios.
 *   Step 2 shows the chosen reason's panel ([data-panel="reason-<key>"]):
 *     volunteer → how they'd like to help (volunteer roles)
 *     partner   → organisation, type, region, how (host / support a tournament / another way)
 *     question  → just the shared fields
 *   Shared: name, phone/email, message.
 * Step switching is CSS-only (:has(), contact.css rules in inner.css), so it works without JS;
 * browsers without :has() show every panel. ui/compose.js only sends the active panel's fields
 * and preselects a reason from the URL (/contact/#reason-volunteer).
 * Panel fields are never `required`, so the no-JS mailto fallback can't be blocked by a
 * hidden field.
 */
import { html } from '../../lib/html.mjs';
import { isUnconfirmed, isVisible } from '../../lib/format.mjs';
import { pageHero } from '../../partials/page.mjs';
import { icon } from '../../partials/icon.mjs';
import { button, chip } from '../../partials/ui.mjs';
import { composeForm } from '../../partials/forms/compose-form.mjs';
import { textField, textArea, selectField, radioCards } from '../../partials/forms/fields.mjs';

export const meta = {
  title: 'Contact',
  description: 'Volunteer, partner with us, host or support a football tournament, or ask a question. Get in touch with Kingdom Love Springs on WhatsApp or by email.',
  path: '/contact/',
  motion: true,
};

/**
 * @param {string} key
 * @param {unknown} body
 */
const panel = (key, body) => html`<div class="contact-panel" data-panel="reason-${key}">${body}</div>`;

/** @param {import('../../../tools/build.mjs').RenderContext} ctx */
export function render(ctx) {
  const p = ctx.data.pages.contact;
  const inv = ctx.data.involve;
  const c = ctx.site.contact || {};
  const ok = (/** @type {unknown} */ v) => v && !isUnconfirmed(v);
  const whatsapp = ok(c.whatsapp) ? String(c.whatsapp).replace(/\D/g, '') : null;
  const socials = (ctx.site.socials || []).filter((/** @type {any} */ s) => ok(s.url));
  const details = [
    ok(c.email) && html`<li>${icon('mail')}<a href="mailto:${c.email}">${c.email}</a></li>`,
    ok(c.phone) && html`<li>${icon('phone')}<a href="tel:${String(c.phone).replace(/\s/g, '')}">${c.phone}</a></li>`,
    ok(c.location) && html`<li>${icon('map-pin')}<span>${c.location}</span></li>`,
  ].filter(Boolean);
  const roles = (inv.volunteerRoles || []).filter((/** @type {any} */ r) => isVisible(r, ctx.env));
  const regions = ctx.data.regions.regions;
  const choose = { value: '', label: 'Choose…' };

  const fields = html`
    <div class="contact-step contact-step--1">
      <p class="sponsor-step__count">Step 1 of 2</p>
      ${radioCards({
        name: 'What I would like to do',
        idBase: 'reason',
        legend: p.stepOne,
        options: p.reasons.map((/** @type {any} */ r) => ({ id: r.key, value: r.label, label: r.label, description: r.description, icon: r.icon, href: r.href, primary: Boolean(r.href) })),
      })}
    </div>

    <fieldset class="contact-step contact-step--2">
      <legend class="sr-only">Step 2 of 2: ${p.stepTwo}</legend>
      <p class="sponsor-step__count" aria-hidden="true">Step 2 of 2</p>
      <p class="sponsor-step__title" aria-hidden="true">${p.stepTwo}</p>

      <div class="contact-shared">
        ${textField({ id: 'contact-name', name: 'Name', label: 'Your name', required: true, autocomplete: 'name', errorMessage: 'Enter your name' })}
        ${textField({ id: 'contact-reply', name: 'Phone or email', label: 'Phone, WhatsApp or email', hint: 'So we can reply to you.', required: true, autocomplete: 'email', errorMessage: 'Enter a phone number or email address' })}
      </div>

      ${panel('volunteer', html`
        ${radioCards({ name: 'How I would like to help', idBase: 'vol', legend: p.volunteer.legend, options: roles.map((/** @type {any} */ r) => ({ id: r.id, value: r.title, label: r.title, description: r.text, icon: r.icon })) })}`)}

      ${panel('partner', html`
        ${textField({ id: 'par-org', name: 'Organisation', label: p.partner.orgLabel, autocomplete: 'organization' })}
        ${selectField({ id: 'par-type', name: 'Type of organisation', label: p.partner.typeLabel, options: [choose, ...inv.partnerTypes.map((/** @type {string} */ t) => ({ value: t, label: t })), { value: 'Other', label: 'Other' }] })}
        ${selectField({ id: 'par-region', name: 'Region', label: 'Region', options: [choose, ...regions.map((/** @type {any} */ r) => ({ value: r.name, label: r.name }))] })}
        ${radioCards({ name: 'How we would like to partner', idBase: 'par', legend: p.partner.waysLegend, options: inv.partnerWays })}`)}

      <div class="contact-shared">
        ${textArea({ id: 'contact-message', name: 'Message', label: p.messageLabel, hint: p.messageHint, required: true, rows: 5, errorMessage: 'Write a short message' })}
      </div>
    </fieldset>`;

  return html`
    ${pageHero(ctx, p.hero)}
    <section class="section section--flush-top" aria-label="Contact us">
      <div class="container contact">
        <div class="contact__details stack" data-reveal>
          <div class="contact__card" data-surface="navy">
            <h2 class="contact__title">${p.detailsTitle}</h2>
            ${details.length ? html`<ul class="contact__list" role="list">${details}</ul>` : html`<p class="text-muted">${p.detailsPending}</p>`}
            ${whatsapp ? button({ label: 'Message us on WhatsApp', href: `https://wa.me/${whatsapp}`, iconStart: 'message-circle', variant: 'soft' }) : ''}
            ${socials.length
              ? html`<ul class="cluster" role="list">${socials.map(
                  (/** @type {any} */ s) => html`<li><a class="share-row__btn" href="${s.url}" rel="noopener" target="_blank">${icon(s.icon)}<span class="sr-only">${s.name} (opens in a new tab)</span></a></li>`,
                )}</ul>`
              : ''}
          </div>
          <div class="contact__regions">
            <h2 class="contact__title">${p.regionsTitle}</h2>
            <ul class="cluster" role="list">${regions.map((/** @type {any} */ r) => html`<li>${chip(r.name, { icon: 'map-pin' })}</li>`)}</ul>
          </div>
        </div>
        <div class="involve__form" data-surface="white" data-reveal>
          ${composeForm(ctx, {
            id: 'form-contact',
            title: p.formTitle,
            headingLevel: 2,
            className: 'contact-form',
            interactive: true,
            choice: 'What I would like to do',
            subject: 'A message for Kingdom Love Springs',
            intro: 'Hello Kingdom Love Springs,',
            fields,
          })}
        </div>
      </div>
    </section>
  `;
}
