// @ts-check
/**
 * Outline circles (DESIGN_SYSTEM §5 #3): on scroll-in each circle draws its 1px outline in
 * sequence and its label fades up. (The hover/focus photo reveal is CSS clip-path.)
 */
import { onVisible } from './observe.js';

/** @param {import('./index.js').MotionContext} ctx */
export default function circles({ gsap, reduced }) {
  if (reduced) return;
  /** @type {(() => void)[]} */
  const off = [];

  document.querySelectorAll('[data-circles]').forEach((list) => {
    const rings = list.querySelectorAll('.circle__ring circle');
    const labels = list.querySelectorAll('.circle__label');
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(rings, { strokeDashoffset: 1000, rotation: -90, transformOrigin: '50% 50%' }, { strokeDashoffset: 0, rotation: 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.14 }, 0);
    // opacity only (not autoAlpha): visibility:hidden would remove the link's accessible name
    tl.fromTo(labels, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.14, clearProps: 'opacity,transform' }, 0.45);

    off.push(onVisible(list, () => tl.play(), { rootMargin: '0px 0px -20% 0px' }));
    const replay = () => tl.restart();
    list.addEventListener('kls:replay', replay);
    off.push(() => list.removeEventListener('kls:replay', replay));
  });

  return () => off.forEach((fn) => fn());
}
