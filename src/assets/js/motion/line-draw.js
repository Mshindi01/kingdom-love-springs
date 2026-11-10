// @ts-check
/**
 * Connecting lines that draw on scroll (e.g. "How sponsorship works"): animates the
 * `--p` custom property (0 → 1) that the CSS turns into scaleX (desktop) or scaleY (mobile).
 * Scrubbed with the scroll. Reduced motion / no JS: the line is simply complete (--p: 1).
 */

/** @param {import('./index.js').MotionContext} ctx */
export default function lineDraw({ gsap, reduced }) {
  if (reduced) return;
  document.querySelectorAll('[data-draw-line]').forEach((line) => {
    gsap.fromTo(
      line,
      { '--p': 0 },
      {
        '--p': 1,
        ease: 'none',
        scrollTrigger: { trigger: line.parentElement, start: 'top 80%', end: 'bottom 60%', scrub: 0.6 },
      },
    );
  });
}
