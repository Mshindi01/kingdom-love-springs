// @ts-check
/**
 * Handwritten draw-on line (the signature effect, DESIGN_SYSTEM §5 #1).
 *
 *   scriptLine({ text: 'from struggle to purpose', swoosh: 'rise', size: 'lg' })
 *
 * Outputs an inline SVG: a two-stroke tapered swoosh + the words in the script font,
 * revealed through a mask (see assets/js/motion/script-geometry.js). Without JS, or with
 * reduced motion, it renders fully drawn. motion/script-draw.js animates it once, when
 * 40% visible.
 *
 * Accessibility: pass `label` for role="img" + aria-label, or omit it when the same words
 * are already readable in the HTML (the SVG is then aria-hidden).
 */
import { html, attrs } from '../lib/html.mjs';
import { scriptGeometry, estimateWidth, F } from '../assets/js/motion/script-geometry.js';

let counter = 0;

const COLORS = /** @type {const} */ ({
  auto: null,
  sage: 'var(--sage-300)',
  sun: 'var(--sun-400)',
  clay: 'var(--clay-500)',
  cream: 'var(--cream-50)',
  white: 'var(--white)',
  leaf: 'var(--leaf-500)',
  forest: 'var(--forest-900)',
});

/**
 * @param {{
 *   text: string,
 *   swoosh?: import('../assets/js/motion/script-geometry.js').SwooshName | 'none',
 *   size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero',
 *   color?: keyof typeof COLORS,
 *   label?: string,
 *   className?: string,
 *   delay?: number,
 * }} options
 */
export function scriptLine({ text, swoosh = 'underline', size = 'lg', color = 'auto', label, className = '', delay = 0 }) {
  const id = `sl-${++counter}`;
  const g = scriptGeometry({ width: estimateWidth(text), swoosh });
  const [vx, vy, vw, vh] = g.viewBox.split(' ');
  const style = [`--h:${g.heightEm}`, `aspect-ratio:${g.aspect}`, COLORS[color] ? `--script-color:${COLORS[color]}` : '']
    .filter(Boolean)
    .join(';');

  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' };
  const swooshPaths = g.swoosh
    ? html`<path class="script-line__swoosh script-line__swoosh--thick" d="${g.swoosh}" pathLength="1000" stroke-width="${g.swooshThick}" stroke-dasharray="800 2000"></path>
      <path class="script-line__swoosh script-line__swoosh--thin" d="${g.swoosh}" pathLength="1000" stroke-width="${g.swooshThin}" stroke-dasharray="1000 2000"></path>`
    : '';

  return html`<svg${attrs({
    class: ['script-line', `script-line--${size}`, className],
    viewBox: g.viewBox,
    style,
    focusable: 'false',
    'data-script-line': swoosh,
    'data-delay': delay || null,
    ...a11y,
  })}><defs><mask id="${id}" maskUnits="userSpaceOnUse" x="${vx}" y="${vy}" width="${vw}" height="${vh}"><path class="script-line__mask" d="${g.mask}" pathLength="1000" stroke-width="${g.maskWidth}" stroke-dasharray="1000 2000"></path></mask></defs>${swoosh === 'cross' ? swooshPaths : ''}<text class="script-line__text" x="0" y="0" font-size="${F}" mask="url(#${id})">${text}</text>${swoosh === 'cross' ? '' : swooshPaths}</svg>`;
}
