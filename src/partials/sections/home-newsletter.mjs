// @ts-check
/**
 * Home §11: newsletter card floating over a photo (CareNest).
 * Part A: no backend. The form composes an email to KLS (ui/compose.js); without JS it
 * falls back to a mailto: form post. Until KLS's email is confirmed the form is disabled.
 * TODO(part-c): POST to /api/newsletter (double opt-in, C4).
 */
import { html, attrs } from '../../lib/html.mjs';
import { icon } from '../icon.mjs';
import { textField } from '../forms/fields.mjs';
import { imageRef } from '../motifs.mjs';
import { isUnconfirmed } from '../../lib/format.mjs';

/**
 * @param {import('../../../tools/build.mjs').RenderContext} ctx
 * @param {any} s
 */
export default function homeNewsletter(ctx, s) {
  const to = isUnconfirmed(ctx.site.contact?.email) ? null : ctx.site.contact.email;
  const subject = 'Please add me to your updates';

  return html`<section class="home-newsletter" aria-labelledby="home-newsletter-title">
    <div class="container">
      <div class="home-newsletter__panel photo-panel" data-surface="photo">
        <div class="photo-panel__media">${imageRef(ctx, s.image, { fallback: 'landscape', sizes: '100vw' })}</div>
        <div class="home-newsletter__card" data-surface="white" data-reveal>
          <p class="eyebrow">${s.eyebrow}</p>
          <h2 class="home-newsletter__title" id="home-newsletter-title">${s.title}</h2>
          <p class="text-muted">${s.text}</p>
          <form${attrs({
            class: 'form home-newsletter__form',
            'data-compose': 'email',
            'data-to': to,
            'data-subject': subject,
            'data-intro': 'Please add me to your updates.',
            action: to ? `mailto:${to}?subject=${encodeURIComponent(subject)}` : null,
            method: to ? 'post' : null,
            enctype: to ? 'text/plain' : null,
          })}>
            <fieldset class="home-newsletter__fields"${attrs({ disabled: !to })}>
              <legend class="sr-only">${s.title}</legend>
              ${textField({ id: 'newsletter-name', name: 'Name', label: 'Your name', required: true, autocomplete: 'name', errorMessage: 'Enter your name' })}
              ${textField({ id: 'newsletter-email', name: 'Email', label: 'Email', type: 'email', required: true, autocomplete: 'email', errorMessage: 'Enter an email address like name@example.com' })}
              <button class="btn btn--primary" type="submit">${icon('send')}<span class="btn__label">${s.button}</span></button>
            </fieldset>
            <p class="home-newsletter__note">${icon('info')}<span>${to ? s.note : s.unavailable}</span></p>
          </form>
          <div class="home-newsletter__done" role="status" tabindex="-1" hidden data-compose-done>
            <p class="home-newsletter__done-title">${icon('check-circle-2')}Thank you!</p>
            <p>Your email app should now open with a short message to us. Please press <strong>Send</strong> to finish.</p>
            ${to ? html`<p class="text-muted">If nothing opened, email us at <a href="mailto:${to}">${to}</a>.</p>` : ''}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}
