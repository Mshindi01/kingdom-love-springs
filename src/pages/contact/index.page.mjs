// @ts-check
/** /contact/: contact details (only confirmed ones), WhatsApp button, composer form, socials, regions. */
import { html } from '../../lib/html.mjs';
import { isUnconfirmed } from '../../lib/format.mjs';
import { pageHero, helpStrip } from '../../partials/page.mjs';
import { icon } from '../../partials/icon.mjs';
import { button, chip } from '../../partials/ui.mjs';
import { composeForm } from '../../partials/forms/compose-form.mjs';
import { textField, textArea } from '../../partials/forms/fields.mjs';

export const meta = {
  title: 'Contact',
  description: 'Get in touch with Kingdom Love Springs on WhatsApp or by email.',
  path: '/contact/',
  motion: true,
};

/** @param {import('../../../tools/build.mjs').RenderContext} ctx */
export function render(ctx) {
  const p = ctx.data.pages.contact;
  const c = ctx.site.contact || {};
  const ok = (/** @type {unknown} */ v) => v && !isUnconfirmed(v);
  const whatsapp = ok(c.whatsapp) ? String(c.whatsapp).replace(/\D/g, '') : null;
  const socials = (ctx.site.socials || []).filter((/** @type {any} */ s) => ok(s.url));
  const details = [
    ok(c.email) && html`<li>${icon('mail')}<a href="mailto:${c.email}">${c.email}</a></li>`,
    ok(c.phone) && html`<li>${icon('phone')}<a href="tel:${String(c.phone).replace(/\s/g, '')}">${c.phone}</a></li>`,
    ok(c.location) && html`<li>${icon('map-pin')}<span>${c.location}</span></li>`,
  ].filter(Boolean);

  return html`
    ${pageHero(ctx, p.hero)}
    <section class="section section--flush-top" aria-label="Contact us">
      <div class="container contact">
        <div class="contact__details stack" data-reveal>
          <div class="contact__card" data-surface="forest">
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
            <ul class="cluster" role="list">${ctx.data.regions.regions.map((/** @type {any} */ r) => html`<li>${chip(r.name, { icon: 'map-pin' })}</li>`)}</ul>
          </div>
        </div>
        <div class="involve__form" data-surface="white" data-reveal>
          ${composeForm(ctx, {
            id: 'form-contact',
            title: p.formTitle,
            headingLevel: 2,
            subject: 'A message for Kingdom Love Springs',
            intro: 'Hello Kingdom Love Springs,',
            fields: html`
              ${textField({ id: 'contact-name', name: 'Name', label: 'Your name', required: true, autocomplete: 'name', errorMessage: 'Enter your name' })}
              ${textField({ id: 'contact-reply', name: 'Phone or email', label: 'Phone, WhatsApp or email', hint: 'So we can reply to you.', required: true, autocomplete: 'email', errorMessage: 'Enter a phone number or email address' })}
              ${textArea({ id: 'contact-message', name: 'Message', label: 'Your message', required: true, rows: 6, errorMessage: 'Write your message' })}`,
          })}
        </div>
      </div>
    </section>
    ${helpStrip(ctx)}
  `;
}
