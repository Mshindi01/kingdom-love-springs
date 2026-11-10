// @ts-check
/**
 * Kingdom Love Springs: front-end boot.
 *
 * Progressive enhancement: without JS, everything is visible and usable.
 * Motion only adds hidden "from" states AFTER html.js is set, and only when the user
 * hasn't asked for reduced motion. GSAP + ScrollTrigger are loaded (deferred) only on
 * pages whose meta has `motion: true`; this file works with or without them.
 */

const root = document.documentElement;
root.classList.remove('no-js');
root.classList.add('js');

/** @type {any} */
const w = window;
const gsap = w.gsap;
const ScrollTrigger = w.ScrollTrigger;

/**
 * Motion modules register here (A2 adds: script draw-on, outline circles, pill band, …).
 * Each receives the gsap instance and a `reduced` flag and returns an optional cleanup.
 * @typedef {(gsap: any, opts: { reduced: boolean }) => void | (() => void)} MotionModule
 * @type {MotionModule[]}
 */
const modules = [revealOnScroll];

if (gsap) {
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();
  mm.add(
    {
      reduced: '(prefers-reduced-motion: reduce)',
      full: '(prefers-reduced-motion: no-preference)',
    },
    (/** @type {{ conditions: { reduced: boolean } }} */ context) => {
      const { reduced } = context.conditions;
      const cleanups = modules.map((mod) => mod(gsap, { reduced }));
      return () => cleanups.forEach((fn) => typeof fn === 'function' && fn());
    },
  );
}

/**
 * Section reveal (DESIGN_SYSTEM §5 #6): fade + 24px rise, batch-staggered.
 * Reduced motion: no animation at all (elements simply stay visible).
 * @type {MotionModule}
 */
function revealOnScroll(gsap, { reduced }) {
  const items = gsap.utils.toArray('[data-reveal]');
  if (reduced || !items.length || !ScrollTrigger) return;

  gsap.set(items, { autoAlpha: 0, y: 24 });
  const triggers = ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (/** @type {Element[]} */ batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.12, overwrite: true }),
  });
  return () => {
    triggers.forEach((/** @type {any} */ t) => t.kill());
    gsap.set(items, { clearProps: 'opacity,visibility,transform' });
  };
}
