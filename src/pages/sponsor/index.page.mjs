// @ts-check
/**
 * /sponsor/: the sponsor-a-child enquiry.
 * Left (sticky on desktop): photo, what sponsorship means, what happens next.
 * Right: one <form> with a <fieldset> per step (About you · How you'd like to help · A note ·
 * Review & send). All steps show on one page, which is also the no-JS fallback.
 *
 * VISUAL ONLY for now (owner's instruction): the multi-step behaviour, review summary,
 * sessionStorage draft and WhatsApp/email/copy composer are not wired up yet. Send buttons stay
 * disabled until KLS's WhatsApp/email are confirmed.
 * TODO(part-a): step-by-step JS, review summary, composer actions (forms/composer.js).
 * TODO(part-c): POST /api/enquiries
 * Never asks about children (SAFEGUARDING §7).
 */
import { html, attrs } from '../../lib/html.mjs';
import { isUnconfirmed } from '../../lib/format.mjs';
import { icon } from '../../partials/icon.mjs';
import { scriptLine } from '../../partials/script-line.mjs';
import { breadcrumbs } from '../../partials/ui.mjs';
import { imageRef } from '../../partials/motifs.mjs';
import { textField, textArea, selectField, radioCards, checkbox, stepsIndicator } from '../../partials/forms/fields.mjs';

export const meta = {
  title: 'Sponsor a child',
  description: 'Start a sponsorship enquiry: walk with one child from primary through secondary school, with school fees and ongoing mentorship.',
  path: '/sponsor/',
  motion: true,
};

const COUNTRIES = ['Kenya', 'Uganda', 'Tanzania', 'United Kingdom', 'United States', 'Canada', 'Germany', 'Other'];

/**
 * @param {number} n
 * @param {number} total
 * @param {string} title
 * @param {unknown} body
 */
const step = (n, total, title, body) => html`<fieldset class="sponsor-step" id="step-${n}" aria-labelledby="step-${n}-title">
  <legend class="sr-only">Step ${n} of ${total}: ${title}</legend>
  <p class="sponsor-step__count" aria-hidden="true">Step ${n} of ${total}</p>
  <h3 class="sponsor-step__title" id="step-${n}-title" tabindex="-1">${title}</h3>
  <div class="sponsor-step__body">${body}</div>
</fieldset>`;

/** @param {import('../../../tools/build.mjs').RenderContext} ctx */
export function render(ctx) {
  const p = ctx.data.pages.sponsor;
  const c = ctx.site.contact || {};
  const email = isUnconfirmed(c.email) ? null : c.email;
  const whatsapp = isUnconfirmed(c.whatsapp) ? null : String(c.whatsapp).replace(/\D/g, '');
  const total = p.steps.length;

  return html`
    <section class="sponsor" aria-labelledby="page-title">
      <div class="container">
        ${breadcrumbs([{ label: 'Home', href: '/' }, { label: p.eyebrow }])}
        <div class="sponsor__grid">
          <aside class="sponsor__aside" aria-label="About sponsorship">
            <div class="sponsor__intro" data-reveal>
              <p class="eyebrow">${p.eyebrow}</p>
              <h1 class="sponsor__title" id="page-title">${p.title}</h1>
              <p class="lead">${p.intro}</p>
            </div>
            <div class="sponsor__photo">
              ${imageRef(ctx, p.image, { priority: true, fallback: 'portrait', sizes: '(width >= 56rem) 40vw, 100vw' })}
              <div class="sponsor__script">${scriptLine({ text: p.script, swoosh: 'rise', size: 'md', color: 'sun' })}</div>
            </div>
            <div class="sponsor__info" data-surface="sand" data-reveal>
              <h2 class="sponsor__subtitle">${p.meansTitle}</h2>
              <ul class="checklist" role="list">${p.means.map((/** @type {any} */ m) => html`<li>${icon(m.icon)}<span>${m.text}</span></li>`)}</ul>
              <h2 class="sponsor__subtitle">${p.nextTitle}</h2>
              <ol class="sponsor__next" role="list">${p.next.map((/** @type {string} */ s, /** @type {number} */ i) => html`<li><span class="sponsor__next-num" aria-hidden="true">${i + 1}</span><span>${s}</span></li>`)}</ol>
            </div>
          </aside>

          <div class="sponsor__form" data-surface="white">
            <h2 class="sponsor__form-title">${p.formTitle}</h2>
            <p class="text-muted">${p.formIntro}</p>
            ${stepsIndicator({ steps: p.steps, current: 1, label: 'Enquiry steps' })}
            <form${attrs({
              class: 'form sponsor-form',
              'aria-labelledby': 'sponsor-form-label',
              action: email ? `mailto:${email}?subject=${encodeURIComponent('Sponsorship enquiry')}` : null,
              method: email ? 'post' : null,
              enctype: email ? 'text/plain' : null,
            })}>
              <span class="sr-only" id="sponsor-form-label">${p.formTitle}</span>
              ${step(1, total, p.steps[0], html`
                ${textField({ id: 'sp-name', name: 'Name', label: 'Your name', required: true, autocomplete: 'name' })}
                ${textField({ id: 'sp-email', name: 'Email', label: 'Email', type: 'email', required: true, autocomplete: 'email' })}
                ${textField({ id: 'sp-phone', name: 'Phone or WhatsApp', label: 'Phone or WhatsApp', type: 'tel', inputmode: 'tel', autocomplete: 'tel', value: '+254 ', hint: 'Starts with +254 for Kenya. Numbers from other countries are welcome.' })}
                ${selectField({ id: 'sp-country', name: 'Country', label: 'Country', value: 'Kenya', autocomplete: 'country-name', options: COUNTRIES.map((x) => ({ value: x, label: x })) })}`)}
              ${step(2, total, p.steps[1], html`
                ${radioCards({ name: 'sp-help', legend: 'How would you like to help?', required: true, options: p.help })}
                ${radioCards({ name: 'sp-contact', legend: 'How should we contact you? (optional)', options: p.contactMethods })}`)}
              ${step(3, total, p.steps[2], html`
                ${textArea({ id: 'sp-note', name: 'Note', label: 'Anything you’d like us to know?', rows: 4, hint: 'Please don’t include children’s names or personal details.' })}
                ${selectField({ id: 'sp-heard', name: 'How did you hear about us', label: 'How did you hear about us?', options: [{ value: '', label: 'Choose…' }, ...p.heardOptions.map((/** @type {string} */ x) => ({ value: x, label: x }))] })}`)}
              ${step(4, total, p.steps[3], html`
                <div class="sponsor-review" data-surface="sand">
                  <p class="sponsor-review__title">${icon('file-text')}Your answers</p>
                  <p class="text-muted">Before sending, check your answers above. You can change anything.</p>
                </div>
                ${checkbox({ id: 'sp-consent', name: 'Consent', label: p.consent, required: true })}
                <div class="cluster sponsor-actions">
                  <button class="btn btn--primary" type="submit" name="via" value="whatsapp"${attrs({ disabled: !whatsapp })}>${icon('message-circle')}<span class="btn__label">Send via WhatsApp</span></button>
                  <button class="btn btn--outline" type="submit" name="via" value="email"${attrs({ disabled: !email })}>${icon('mail')}<span class="btn__label">Send via email</span></button>
                  <button class="btn btn--ghost js-only" type="button" disabled>${icon('link')}<span class="btn__label">Copy message</span></button>
                </div>
                <p class="compose__note">${icon('info')}<span>${whatsapp || email ? p.sendNote : p.unavailable}</span></p>`)}
            </form>
          </div>
        </div>
      </div>
    </section>
  `;
}
