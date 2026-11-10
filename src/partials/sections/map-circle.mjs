// @ts-check
/**
 * Closing "across Kenya" map circle: a forest-900 circle with a simplified Kenya outline
 * and glowing dots at Nairobi, Western Kenya and the Coast (regions only, never exact
 * locations of children).
 *
 * The outline is a hand-simplified polygon of Kenya's border (lon/lat, WGS84), projected
 * equirectangularly. It includes Kenya's share of Lake Victoria for a clean silhouette.
 */
import { html } from '../../lib/html.mjs';
import { scriptLine } from '../script-line.mjs';

/** [lon, lat] clockwise from the Kenya–Uganda–South Sudan tripoint */
const BORDER = [
  [33.99, 4.22], [34.38, 4.62], [35.3, 5.02], [35.92, 4.62], [36.85, 4.43], [38.12, 3.6],
  [39.05, 3.52], [39.86, 3.84], [40.77, 4.26], [41.9, 3.98], [41.32, 3.4], [40.99, 2.82],
  [40.99, -0.85], [41.56, -1.66], [41.2, -1.95], [40.9, -2.27], [40.24, -2.62], [40.12, -3.22],
  [39.85, -3.63], [39.67, -4.05], [39.2, -4.67], [37.75, -3.65], [37.7, -3.05], [33.95, -1.0],
  [33.93, 0.1], [34.1, 0.47], [34.55, 1.15], [34.98, 1.95], [34.9, 2.9], [34.4, 3.75],
];
/** Region dots (approx. regional centres) */
const REGION_POINTS = /** @type {Record<string, [number, number]>} */ ({
  nairobi: [36.82, -1.29],
  western: [34.75, 0.28],
  coast: [39.67, -3.75],
});

const K = 50; // px per degree
const LON0 = 33.6;
const LAT0 = 5.3;
/** @param {[number, number]} p */
const project = ([lon, lat]) => [Math.round((lon - LON0) * K * 10) / 10, Math.round((LAT0 - lat) * K * 10) / 10];

export const KENYA_VIEWBOX = `0 0 ${Math.round((42.2 - LON0) * K)} ${Math.round((LAT0 + 5.0) * K)}`;
export const KENYA_PATH = 'M' + BORDER.map((p) => project(/** @type {[number, number]} */ (p)).join(' ')).join('L') + 'Z';

/**
 * @param {{ regions: { id: string, name: string }[], title?: string, script?: string, id?: string, lead?: string }} o
 */
export function mapCircle({ regions, title = 'Across Kenya', script = 'across Kenya', id = 'map-title', lead }) {
  const dots = regions
    .filter((r) => REGION_POINTS[r.id])
    .map((r) => ({ ...r, xy: project(REGION_POINTS[r.id]) }));
  const label = `Map of Kenya showing where we serve: ${regions.map((r) => r.name).join(', ')}`;

  return html`<div class="map-circle" data-map>
    <div class="map-circle__disc" data-surface="forest">
      <svg class="map-circle__map" viewBox="${KENYA_VIEWBOX}" role="img" aria-label="${label}" focusable="false">
        <path class="map-circle__kenya" d="${KENYA_PATH}" pathLength="1000"></path>
        ${dots.map(
          (d) => html`<g class="map-circle__dot" transform="translate(${d.xy[0]} ${d.xy[1]})">
            <circle class="map-circle__pulse" r="9"></circle>
            <circle class="map-circle__core" r="6"></circle>
            <text class="map-circle__label" x="14" y="7">${d.name}</text>
          </g>`,
        )}
      </svg>
      <div class="map-circle__script">${scriptLine({ text: script, swoosh: 'rise', size: 'lg', color: 'sage' })}</div>
    </div>
    <div class="map-circle__text">
      <h2 class="map-circle__title" id="${id}">${title}</h2>
      ${lead ? html`<p class="lead">${lead}</p>` : ''}
      <ul class="map-circle__regions" role="list">
        ${regions.map((r) => html`<li><span class="chip__dot" aria-hidden="true"></span>${r.name}</li>`)}
      </ul>
    </div>
  </div>`;
}
