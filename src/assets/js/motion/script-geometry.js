// @ts-check
/**
 * Shared geometry for handwritten "draw-on" lines (DESIGN_SYSTEM §5 #1).
 * Used at build time by src/partials/script-line.mjs and in the browser by
 * motion/script-draw.js (which re-measures the real text width once fonts load).
 *
 * Coordinate system: font-size F = 100 user units, text starts at x = 0, baseline y = 0.
 *
 * The text is revealed through a MASK holding one thick stroked path that zig-zags up and
 * down across the letters while travelling left → right with a slight wave. Animating its
 * stroke-dashoffset uncovers the script stroke by stroke, so it reads as writing, not a wipe.
 */

export const F = 100;
/** Ms Madi metrics (approx., in em): */
export const ASCENT = 0.92;
export const DESCENT = 0.42;
/** Average advance per character, used only for the build-time estimate. */
export const AVG_ADVANCE = 0.31;

/** @typedef {'rise' | 'loop' | 'underline' | 'cross'} SwooshName */
export const SWOOSHES = /** @type {const} */ (['rise', 'loop', 'underline', 'cross']);

const r = (/** @type {number} */ n) => Math.round(n * 10) / 10;

/** @param {string} text */
export function estimateWidth(text) {
  return Math.max(1, [...text].length) * AVG_ADVANCE * F;
}

/**
 * Swoosh control points as cubic segments [x0,y0, c1x,c1y, c2x,c2y, x,y, c1x,…].
 * W = text width, all y relative to the baseline. Hand-tuned to feel like one pen gesture.
 * @param {SwooshName} name @param {number} W
 * @returns {number[]}
 */
function swooshPoints(name, W) {
  switch (name) {
    case 'rise': // sweeps in under the words and flicks up past the end
      return [
        -0.06 * W, 0.5 * F,
        0.25 * W, 0.78 * F, 0.7 * W, 0.62 * F, 0.96 * W, 0.12 * F,
        1.02 * W, 0.0 * F, 1.06 * W, -0.42 * F, 1.12 * W, -0.88 * F,
      ];
    case 'loop': // underline that ties a small loop near the end, then trails off
      return [
        -0.04 * W, 0.42 * F,
        0.22 * W, 0.62 * F, 0.5 * W, 0.5 * F, 0.68 * W, 0.44 * F,
        0.84 * W, 0.38 * F, 0.92 * W, 0.0 * F, 0.83 * W, -0.04 * F,
        0.73 * W, -0.08 * F, 0.7 * W, 0.58 * F, 0.88 * W, 0.6 * F,
        0.98 * W, 0.6 * F, 1.06 * W, 0.48 * F, 1.14 * W, 0.3 * F,
      ];
    case 'underline': // a wavy underline that overshoots and hooks back
      return [
        -0.03 * W, 0.4 * F,
        0.2 * W, 0.56 * F, 0.42 * W, 0.3 * F, 0.64 * W, 0.42 * F,
        0.82 * W, 0.52 * F, 0.98 * W, 0.4 * F, 1.07 * W, 0.28 * F,
        1.1 * W, 0.24 * F, 1.09 * W, 0.12 * F, 1.03 * W, 0.16 * F,
      ];
    case 'cross': // one long arc crossing behind the words, overshooting both ends
    default:
      return [
        -0.18 * W, 0.2 * F,
        0.15 * W, 0.02 * F, 0.55 * W, -0.62 * F, 1.0 * W, -0.5 * F,
        1.1 * W, -0.47 * F, 1.17 * W, -0.4 * F, 1.22 * W, -0.32 * F,
      ];
  }
}

/** @param {number[]} p */
function toPath(p) {
  let d = `M${r(p[0])} ${r(p[1])}`;
  for (let i = 2; i + 5 < p.length; i += 6) {
    d += `C${r(p[i])} ${r(p[i + 1])} ${r(p[i + 2])} ${r(p[i + 3])} ${r(p[i + 4])} ${r(p[i + 5])}`;
  }
  return d;
}

/**
 * The writing mask: a rounded zig-zag between ascender and descender, period ≈ one letter,
 * drifting on a gentle wave so the reveal edge never looks mechanical.
 * @param {number} W
 */
function maskPath(W) {
  const top = -ASCENT * F - 0.04 * F;
  const bottom = DESCENT * F + 0.04 * F;
  const half = 0.15 * F; // horizontal travel per up/down stroke
  const start = -0.08 * F;
  const end = W + 0.12 * F;
  let x = start;
  let up = true;
  let d = `M${r(x)} ${r(bottom)}`;
  let i = 0;
  while (x < end) {
    const nx = Math.min(end, x + half);
    const wave = Math.sin(i * 0.9) * 0.05 * F;
    const y = (up ? top : bottom) + wave;
    // quadratic with a control point pulled sideways → rounded, slightly slanted strokes
    d += `Q${r(x + half * 0.15)} ${r(y)} ${r(nx)} ${r(y)}`;
    x = nx;
    up = !up;
    i++;
  }
  return d;
}

/**
 * @param {{ width: number, swoosh?: SwooshName | 'none' }} opts
 */
export function scriptGeometry({ width, swoosh = 'underline' }) {
  const W = Math.max(width, 0.6 * F);
  const pts = swoosh === 'none' ? null : swooshPoints(swoosh, W);

  // Bounds: text box ∪ swoosh control hull (a safe superset of the curve)
  let minX = -0.06 * F;
  let maxX = W + 0.1 * F;
  let minY = -ASCENT * F;
  let maxY = DESCENT * F;
  if (pts) {
    for (let i = 0; i < pts.length; i += 2) {
      minX = Math.min(minX, pts[i]);
      maxX = Math.max(maxX, pts[i]);
      minY = Math.min(minY, pts[i + 1]);
      maxY = Math.max(maxY, pts[i + 1]);
    }
  }
  const pad = 0.08 * F;
  const vb = { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 };

  return {
    viewBox: `${r(vb.x)} ${r(vb.y)} ${r(vb.w)} ${r(vb.h)}`,
    /** height in em of the rendered SVG (its font-size is the script size) */
    heightEm: r((vb.h / F) * 1000) / 1000,
    aspect: `${r(vb.w)} / ${r(vb.h)}`,
    mask: maskPath(W),
    maskWidth: 0.3 * F,
    swoosh: pts ? toPath(pts) : '',
    swooshThick: 0.075 * F,
    swooshThin: 0.035 * F,
  };
}
