// @ts-check
/** /safeguarding/: the public child-protection commitment + a concern contact [CONFIRM]. */
import { html } from '../../lib/html.mjs';
import { isUnconfirmed, isVisible } from '../../lib/format.mjs';
import { pageHero, helpStrip } from '../../partials/page.mjs';
import { icon } from '../../partials/icon.mjs';
import { button, sectionHeader } from '../../partials/ui.mjs';

export const meta = {
  title: 'Safeguarding',
  description: 'How Kingdom Love Springs keeps children safe: first names only, no locations, photos only with consent, and stories told with care.',
  path: '/safeguarding/',
  motion: true,
};

/** @param {import('../../../tools/build.mjs').RenderContext} ctx */
export function render(ctx) {
  const p = ctx.data.pages.safeguarding;
  const contact = ctx.site.contact?.safeguardingContact;
  const hasContact = contact && !isUnconfirmed(contact);
  const policy = isVisible(p.policy, ctx.env) ? p.policy : null;

  return html`
    ${pageHero(ctx, p.hero)}
    <section class="section section--flush-top" aria-labelledby="commit-title">
      <div class="container">
        <div data-reveal>${sectionHeader({ eyebrow: 'Our commitment', title: 'How we protect children on this website and beyond', id: 'commit-title' })}</div>
        <ul class="commitments" role="list">
          ${p.commitments.map(
            (/** @type {any} */ c) => html`<li class="commitment" data-reveal>
              <span class="commitment__icon">${icon(c.icon)}</span>
              <h3 class="commitment__title">${c.title}</h3>
              <p class="commitment__text">${c.text}</p>
            </li>`,
          )}
        </ul>
        ${policy ? html`<p class="sg-note">${icon('file-text')}${policy.text}</p>` : ''}
      </div>
    </section>

    <section class="section section--flush-top" aria-labelledby="concern-title">
      <div class="container">
        <div class="concern" data-surface="forest" data-reveal>
          <span class="involve__icon">${icon('shield-check')}</span>
          <div class="stack stack--sm">
            <h2 id="concern-title">${p.concernTitle}</h2>
            <p>${p.concernText}</p>
            <p class="text-muted">${hasContact ? contact : p.concernPending}</p>
          </div>
          ${button({ label: 'Contact us', href: '/contact/', iconStart: 'message-circle', variant: 'soft' })}
        </div>
      </div>
    </section>
    ${helpStrip(ctx)}
  `;
}
