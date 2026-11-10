// @ts-check
/**
 * Re-fit handwritten lines to the real rendered text width (the build only estimates it).
 * Keeps the swoosh, mask and viewBox in step with the actual words.
 */
import { scriptGeometry } from '../motion/script-geometry.js';

/** Resolve when web fonts are ready (or after 2.5s, whichever comes first). */
export function fontsReady() {
  const ready = document.fonts?.ready ?? Promise.resolve();
  return Promise.race([ready, new Promise((r) => setTimeout(r, 2500))]);
}

/** @param {SVGSVGElement} svg */
function measure(svg) {
  const text = /** @type {SVGTextElement | null} */ (svg.querySelector('.script-line__text'));
  try {
    return text ? text.getComputedTextLength() : 0;
  } catch {
    return 0;
  }
}

/**
 * @param {SVGSVGElement} svg
 * @param {number} [measured] width from a batched read (avoids layout thrashing)
 */
export function fitScriptLine(svg, measured) {
  const width = measured ?? measure(svg);
  if (!width) return;
  const swoosh = /** @type {any} */ (svg.dataset.scriptLine || 'underline');
  const g = scriptGeometry({ width, swoosh });
  const [x, y, w, h] = g.viewBox.split(' ');
  svg.setAttribute('viewBox', g.viewBox);
  svg.style.setProperty('--h', String(g.heightEm));
  svg.style.aspectRatio = g.aspect;
  const mask = svg.querySelector('mask');
  if (mask) {
    mask.setAttribute('x', x);
    mask.setAttribute('y', y);
    mask.setAttribute('width', w);
    mask.setAttribute('height', h);
  }
  svg.querySelector('.script-line__mask')?.setAttribute('d', g.mask);
  svg.querySelectorAll('.script-line__swoosh').forEach((p) => p.setAttribute('d', g.swoosh));
}

/** Read every width first, then write: one layout instead of one per line. */
export function fitAllScriptLines() {
  const svgs = /** @type {SVGSVGElement[]} */ ([...document.querySelectorAll('svg[data-script-line]')]);
  const widths = svgs.map(measure);
  svgs.forEach((svg, i) => fitScriptLine(svg, widths[i]));
}
