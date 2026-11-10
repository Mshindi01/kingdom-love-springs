// @ts-check
/**
 * Motion entry: loads only the modules whose elements are on the page, waits for fonts,
 * then runs them inside gsap.matchMedia() so the OS reduced-motion setting (and the
 * styleguide's html.reduce-motion switch) give the final state instantly: no loops, no
 * scrub, no draws.
 *
 * Module contract: export default function init({ gsap, ScrollTrigger, reduced }) → cleanup?
 * Animations created inside are reverted automatically by matchMedia.
 */
import { fontsReady, fitAllScriptLines } from '../ui/script-fit.js';

/** @typedef {{ gsap: any, ScrollTrigger: any, reduced: boolean }} MotionContext */

/** Order matters: script-draw registers play listeners that hero.js triggers. */
const MODULES = /** @type {[string, () => Promise<any>][]} */ ([
  ['[data-reveal]', () => import('./reveal.js')],
  ['svg[data-script-line]', () => import('./script-draw.js')],
  ['[data-circles]', () => import('./circles.js')],
  ['[data-pill-band]', () => import('./pill-band.js')],
  ['[data-quote-band]', () => import('./quote-band.js')],
  ['[data-map]', () => import('./map.js')],
  ['[data-draw-line]', () => import('./line-draw.js')],
  ['[data-float]', () => import('./float.js')],
  ['[data-hero]', () => import('./hero.js')],
]);

/**
 * @param {any} gsap
 * @param {any} ScrollTrigger
 */
/** Give the browser a turn between chunks of work, so no single task blocks for long. */
const yieldToMain = () =>
  new Promise((resolve) => {
    const s = /** @type {any} */ (globalThis).scheduler;
    if (s?.yield) s.yield().then(resolve);
    else setTimeout(resolve, 0);
  });

export async function initMotion(gsap, ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  // Don't re-measure everything when the mobile address bar shows/hides.
  ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });

  const present = MODULES.filter(([selector]) => document.querySelector(selector));
  const inits = await Promise.all(present.map(([, load]) => load().then((m) => m.default)));
  await fontsReady();
  fitAllScriptLines();

  const conditions = { osReduced: '(prefers-reduced-motion: reduce)', full: '(prefers-reduced-motion: no-preference)' };
  /** @type {any} */
  let mm;
  // One matchMedia, one add() per module, each in its own task (short tasks = low TBT).
  // ScrollTrigger refreshes itself on window load, so no explicit refresh() is needed here.
  const start = async () => {
    mm = gsap.matchMedia();
    for (const init of inits) {
      await yieldToMain();
      mm.add(conditions, (/** @type {any} */ context) => {
        const reduced = Boolean(context.conditions.osReduced) || document.documentElement.classList.contains('reduce-motion');
        return init({ gsap, ScrollTrigger, reduced });
      });
    }
  };

  await start();
  if (document.readyState === 'complete') ScrollTrigger.refresh();

  document.addEventListener('kls:motionpref', async () => {
    mm?.revert();
    await start();
    ScrollTrigger.refresh();
  });
}

/**
 * Re-run hook used by replay buttons: `<button data-replay="#target">`.
 * Modules listen for `kls:replay` on their own elements.
 */
document.addEventListener('click', (e) => {
  const btn = /** @type {HTMLElement | null} */ (/** @type {HTMLElement} */ (e.target).closest?.('[data-replay]'));
  if (!btn) return;
  const target = document.querySelector(btn.dataset.replay || '');
  target?.querySelectorAll('*').forEach((el) => el.dispatchEvent(new CustomEvent('kls:replay')));
  target?.dispatchEvent(new CustomEvent('kls:replay'));
});
