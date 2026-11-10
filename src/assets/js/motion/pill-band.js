// @ts-check
/**
 * Pill band (DESIGN_SYSTEM §5 #4): scales up from 0.92 with a radius morph as it enters
 * (scrubbed), and the handwritten numbers count up while their small gold stroke draws.
 * Screen readers always get the real value (sr-only caption text), never the counter.
 */

import { onVisible } from './observe.js';
import { scrub } from './scrub.js';

/** @param {import('./index.js').MotionContext} ctx */
export default function pillBand({ gsap, reduced }) {
  if (reduced) return;
  /** @type {(() => void)[]} */
  const off = [];

  document.querySelectorAll('[data-pill-band]').forEach((node) => {
    const band = /** @type {HTMLElement} */ (node);
    const finalRadius = getComputedStyle(band).borderTopLeftRadius;

    const grow = gsap.fromTo(band, { scale: 0.92, borderRadius: '32px' }, { scale: 1, borderRadius: finalRadius, ease: 'none', paused: true });
    off.push(scrub(gsap, band, grow, { startAt: 1, endAt: 0.3, smooth: 0.6 }));

    const nums = /** @type {HTMLElement[]} */ ([...band.querySelectorAll('[data-count]')]);
    const strokes = band.querySelectorAll('.pill-band__stroke path');

    const count = () => {
      const tl = gsap.timeline();
      nums.forEach((el, i) => {
        const target = Number(el.dataset.count);
        const prefix = el.dataset.prefix || '';
        const state = { v: 0 };
        tl.to(state, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => (el.textContent = prefix + Math.round(state.v)),
        }, i * 0.15);
      });
      tl.fromTo(strokes, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out', stagger: 0.15 }, 0.1);
      return tl;
    };

    nums.forEach((el) => (el.textContent = (el.dataset.prefix || '') + '0'));
    gsap.set(strokes, { strokeDashoffset: 1000 });
    off.push(onVisible(band, count, { rootMargin: '0px 0px -25% 0px' }));

    const replay = () => count();
    band.addEventListener('kls:replay', replay);
    off.push(() => {
      band.removeEventListener('kls:replay', replay);
      nums.forEach((el) => (el.textContent = (el.dataset.prefix || '') + el.dataset.count));
    });
  });

  return () => off.forEach((fn) => fn());
}
