// @ts-check
/**
 * Map circle (DESIGN_SYSTEM §5 #8): the circle scales in, Kenya's outline draws, the dots pop
 * in; the dots then pulse softly via CSS while the map is on screen (.is-live).
 * Reduced motion: static.
 */
import { onVisible } from './observe.js';

/** @param {import('./index.js').MotionContext} ctx */
export default function map({ gsap, reduced }) {
  if (reduced) return;
  /** @type {(() => void)[]} */
  const off = [];

  document.querySelectorAll('[data-map]').forEach((root) => {
    const disc = root.querySelector('.map-circle__disc');
    const outline = root.querySelector('.map-circle__kenya');
    const dots = root.querySelectorAll('.map-circle__core, .map-circle__label');

    const intro = () => {
      const tl = gsap.timeline();
      if (disc) tl.fromTo(disc, { scale: 0.88, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1, ease: 'power3.out' }, 0);
      if (outline) tl.fromTo(outline, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 0.2);
      tl.fromTo(dots, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.15 }, 1.2);
      return tl;
    };

    off.push(onVisible(root, intro, { rootMargin: '0px 0px -25% 0px' }));
    off.push(onVisible(root, (_el, visible) => root.classList.toggle('is-live', visible), { once: false }));
    const replay = () => intro();
    root.addEventListener('kls:replay', replay);
    off.push(() => {
      root.removeEventListener('kls:replay', replay);
      root.classList.remove('is-live');
    });
  });

  return () => off.forEach((fn) => fn());
}
