// @ts-check
/** Home §10: "Across Kenya" map circle (regions only). */
import { html } from '../../lib/html.mjs';
import { mapCircle } from './map-circle.mjs';

/**
 * @param {import('../../../tools/build.mjs').RenderContext} ctx
 * @param {any} s
 */
export default function homeMap(ctx, s) {
  return html`<section class="section home-map" aria-labelledby="home-map-title">
    <div class="container">
      ${mapCircle({ regions: ctx.data.regions.regions, title: s.title, script: s.script, lead: s.lead, id: 'home-map-title' })}
    </div>
  </section>`;
}
