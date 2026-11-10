// @ts-check
/**
 * Quote band (DESIGN_SYSTEM §5 #7): the rounded top eases from 80px to its final 48px
 * radius as it scrolls in (subtle, scrubbed). The crossing script line is script-draw.js.
 */
import { scrub } from './scrub.js';

/** @param {import('./index.js').MotionContext} ctx */
export default function quoteBand({ gsap, reduced }) {
  if (reduced) return;
  /** @type {(() => void)[]} */
  const off = [];
  document.querySelectorAll('[data-quote-band]').forEach((band) => {
    const final = getComputedStyle(band).borderTopLeftRadius;
    const tween = gsap.fromTo(
      band,
      { borderTopLeftRadius: '80px', borderTopRightRadius: '80px' },
      { borderTopLeftRadius: final, borderTopRightRadius: final, ease: 'none', paused: true },
    );
    off.push(scrub(gsap, band, tween, { startAt: 1, endAt: 0.4 }));
  });
  return () => off.forEach((fn) => fn());
}
