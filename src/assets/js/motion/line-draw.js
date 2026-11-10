// @ts-check
/**
 * Connecting lines that draw on scroll (e.g. "How sponsorship works"): animates the `--p`
 * custom property (0 → 1) that CSS turns into scaleX (desktop) or scaleY (mobile), scrubbed
 * with the scroll. Reduced motion / no JS: the line is simply complete (--p: 1).
 */
import { scrub } from './scrub.js';

/** @param {import('./index.js').MotionContext} ctx */
export default function lineDraw({ gsap, reduced }) {
  if (reduced) return;
  /** @type {(() => void)[]} */
  const off = [];
  document.querySelectorAll('[data-draw-line]').forEach((line) => {
    const tween = gsap.fromTo(line, { '--p': 0 }, { '--p': 1, ease: 'none', paused: true });
    off.push(scrub(gsap, line.parentElement || line, tween, { startAt: 0.8, endAt: 0.6, endWithBottom: true }));
  });
  return () => off.forEach((fn) => fn());
}
