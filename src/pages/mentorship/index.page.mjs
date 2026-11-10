// @ts-check
/** /mentorship/: consistent mentorship, walking alongside families, the Gospel through relationships. */
import { html } from '../../lib/html.mjs';
import { pageHero, helpStrip, ctaBand } from '../../partials/page.mjs';
import { programmeRow } from '../../partials/cards.mjs';
import { quoteBand } from '../../partials/sections/bands.mjs';
import { imageRef } from '../../partials/motifs.mjs';

export const meta = {
  title: 'Mentorship & Families',
  description: 'Consistent mentorship, active family involvement and the Gospel shared through sports and relationships.',
  path: '/mentorship/',
  motion: true,
};

/** @param {import('../../../tools/build.mjs').RenderContext} ctx */
export function render(ctx) {
  const p = ctx.data.pages.mentorship;
  return html`
    ${pageHero(ctx, p.hero)}

    <section class="section" aria-label="How we walk alongside">
      <div class="container programme-rows">
        ${p.blocks.map(
          (/** @type {any} */ b, /** @type {number} */ i) => html`<div data-reveal>${programmeRow({
            id: `mentorship-${b.id}`,
            icon: b.icon,
            title: b.title,
            text: b.text,
            media: imageRef(ctx, b.image, { fallback: 'landscape', sizes: '(width >= 48rem) 50vw, 100vw' }),
            reverse: i % 2 === 1,
          })}</div>`,
        )}
      </div>
    </section>

    ${quoteBand({ id: 'mentorship-quote', quote: p.quote.text, cite: p.quote.cite, script: p.quote.script })}
    <div class="section--gap"></div>
    ${ctaBand({ ...p.cta, icon: 'hand-heart' })}
    ${helpStrip(ctx)}
  `;
}
