// @ts-check
/** Home §8: "How you can help": 3 soft cards, the middle one dark by default. */
import { html } from '../../lib/html.mjs';
import { softCard } from '../cards.mjs';
import { sectionHeader } from '../ui.mjs';

/**
 * @param {import('../../../tools/build.mjs').RenderContext} ctx
 * @param {any} s
 */
export default function homeHelp(ctx, s) {
  const ways = s.cards.map((/** @type {string} */ id) => ctx.data.involve.ways.find((/** @type {any} */ w) => w.id === id)).filter(Boolean);
  return html`<section class="section home-help" aria-labelledby="home-help-title">
    <div class="container">
      <div data-reveal>${sectionHeader({ eyebrow: s.eyebrow, title: s.title, id: 'home-help-title' })}</div>
      <div class="soft-cards" data-reveal>
        ${ways.map((/** @type {any} */ w) =>
          softCard({ icon: w.icon, title: w.title, text: w.text, cta: { label: w.cta.label, href: w.cta.path }, featured: w.id === s.featured }),
        )}
      </div>
    </div>
  </section>`;
}
