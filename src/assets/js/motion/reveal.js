// @ts-check
/**
 * Section reveals (DESIGN_SYSTEM §5 #6): fade + 24px rise, batch-staggered.
 * Reduced motion: no hidden state at all.
 */

/** @param {import('./index.js').MotionContext} ctx */
export default function reveal({ gsap, ScrollTrigger, reduced }) {
  if (reduced) return;
  const items = gsap.utils.toArray('[data-reveal]').filter((/** @type {Element} */ el) => !el.closest('[data-hero], [data-menu]'));
  if (!items.length) return;

  gsap.set(items, { autoAlpha: 0, y: 24 });
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (/** @type {Element[]} */ batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.12, overwrite: true }),
  });

  /** @param {Event} e */
  const replay = (e) => {
    const el = /** @type {Element} */ (e.currentTarget);
    gsap.fromTo(el, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' });
  };
  items.forEach((/** @type {Element} */ el) => el.addEventListener('kls:replay', replay));
  return () => items.forEach((/** @type {Element} */ el) => el.removeEventListener('kls:replay', replay));
}
