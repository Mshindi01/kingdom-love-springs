// @ts-check
/** Home §3: impact bento. Numbers come ONLY from data/stats.json. */
import { html } from '../../lib/html.mjs';
import { bento } from './media-blocks.mjs';
import { sectionHeader } from '../ui.mjs';
import { imageRef } from '../motifs.mjs';

/**
 * @param {import('../../../tools/build.mjs').RenderContext} ctx
 * @param {any} s
 */
export default function homeImpact(ctx, s) {
  const stat = (/** @type {string} */ id) => ctx.data.stats.stats.find((/** @type {any} */ x) => x.id === id);
  /** @param {string} id @param {string} [detail] */
  const num = (id, detail) => {
    const x = stat(id);
    return { type: /** @type {const} */ ('number'), value: x.display, label: x.label, detail: detail ?? x.detail };
  };
  const [v1, v2] = s.values;
  const [p1, p2] = s.images;

  return html`<section class="section home-impact" aria-labelledby="home-impact-title">
    <div class="container">
      <div data-reveal>${sectionHeader({ eyebrow: s.eyebrow, title: s.title, id: 'home-impact-title' })}</div>
      <div data-reveal>
        ${bento({
          label: s.eyebrow,
          tiles: [
            { type: 'photo', media: imageRef(ctx, p1, { fallback: 'portrait', sizes: '(width >= 64rem) 25vw, 100vw' }) },
            num('children', 'ages 7–17, with school fees and ongoing mentorship'),
            { type: 'value', icon: v1.icon, title: v1.title, text: v1.text },
            num('per-gathering'),
            num('per-year'),
            { type: 'value', icon: v2.icon, title: v2.title, text: v2.text },
            num('regions'),
            { type: 'photo', media: imageRef(ctx, p2, { fallback: 'square', sizes: '(width >= 64rem) 25vw, 100vw' }) },
          ],
        })}
      </div>
    </div>
  </section>`;
}
