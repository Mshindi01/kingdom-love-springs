// @ts-check
/**
 * Message-composer form (CLAUDE.md §2.4): the answers become a WhatsApp message or an email
 * that opens in the visitor's own app (ui/compose.js). Nothing is stored on the website.
 * Each channel button is enabled only once KLS's WhatsApp number / email is confirmed;
 * until then the form is shown but disabled, with a plain note.
 * TODO(part-c): POST to /api/<form> (C3), keeping WhatsApp as an option.
 */
import { html, attrs } from '../../lib/html.mjs';
import { isUnconfirmed } from '../../lib/format.mjs';
import { icon } from '../icon.mjs';

/**
 * @param {import('../../../tools/build.mjs').RenderContext} ctx
 * @param {{ id: string, title?: string, subject: string, intro: string, fields: unknown,
 *   note?: string, headingLevel?: 2 | 3 }} o
 */
export function composeForm(ctx, { id, title, subject, intro, fields, note, headingLevel = 3 }) {
  const c = ctx.site.contact || {};
  const email = isUnconfirmed(c.email) ? null : c.email;
  const whatsapp = isUnconfirmed(c.whatsapp) ? null : String(c.whatsapp).replace(/\D/g, '');
  const ready = Boolean(email || whatsapp);
  const titleId = `${id}-title`;

  return html`<div class="compose" id="${id}">
    ${title ? (headingLevel === 2 ? html`<h2 class="compose__title" id="${titleId}">${title}</h2>` : html`<h3 class="compose__title" id="${titleId}">${title}</h3>`) : ''}
    <form${attrs({
      class: 'form compose__form',
      'aria-labelledby': title ? titleId : null,
      'data-compose': 'auto',
      'data-to-email': email,
      'data-to-whatsapp': whatsapp,
      'data-subject': subject,
      'data-intro': intro,
      action: email ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : null,
      method: email ? 'post' : null,
      enctype: email ? 'text/plain' : null,
    })}>
      <fieldset class="compose__fields"${attrs({ disabled: !ready })}>
        <legend class="sr-only">${title || subject}</legend>
        ${fields}
        <p class="field__hint">${icon('shield-check')} Please don’t include children’s names or personal details.</p>
        <div class="cluster compose__actions">
          <button class="btn btn--primary" type="submit" name="via" value="whatsapp"${attrs({ disabled: !whatsapp })}>${icon('message-circle')}<span class="btn__label">Send on WhatsApp</span></button>
          <button class="btn btn--outline" type="submit" name="via" value="email"${attrs({ disabled: !email })}>${icon('mail')}<span class="btn__label">Send by email</span></button>
        </div>
      </fieldset>
      <p class="compose__note">${icon('info')}<span>${ready
        ? note || 'This opens WhatsApp or your email app with your message ready to send. Nothing is stored on this website.'
        : 'This form will open once our WhatsApp and email details are confirmed.'}</span></p>
    </form>
    <div class="compose__done" role="status" tabindex="-1" hidden data-compose-done>
      <p class="compose__done-title">${icon('check-circle-2')}Thank you!</p>
      <p>WhatsApp or your email app should now open with your message. Please press <strong>Send</strong> to finish.</p>
    </div>
  </div>`;
}
