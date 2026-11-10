// @ts-check
/**
 * Section reveals (DESIGN_SYSTEM §5 #6): fade + 24px rise, staggered for items that enter
 * together. IntersectionObserver-driven (cheap). Reduced motion: no hidden state at all.
 */
import { onVisible } from './observe.js';

/** @param {import('./index.js').MotionContext} ctx */
export default function reveal({ gsap, reduced }) {
  if (reduced) return;
  const items = gsap.utils.toArray('[data-reveal]').filter((/** @type {Element} */ el) => !el.closest('[data-hero], [data-menu]'));
  if (!items.length) return;

  gsap.set(items, { autoAlpha: 0, y: 24 });

  /** @type {Element[]} */
  let queue = [];
  let scheduled = false;
  const flush = () => {
    gsap.to(queue, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.12, overwrite: true });
    queue = [];
    scheduled = false;
  };
  const disconnect = onVisible(
    items,
    (el) => {
      queue.push(el);
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(flush);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );

  /** @param {Event} e */
  const replay = (e) => gsap.fromTo(e.currentTarget, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' });
  items.forEach((/** @type {Element} */ el) => el.addEventListener('kls:replay', replay));
  return () => {
    disconnect();
    items.forEach((/** @type {Element} */ el) => el.removeEventListener('kls:replay', replay));
  };
}
