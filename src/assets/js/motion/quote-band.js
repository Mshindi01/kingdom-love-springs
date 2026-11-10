// @ts-check
/**
 * Quote band (DESIGN_SYSTEM §5 #7): the rounded top eases from 80px to its final 48px
 * radius as it scrolls in (subtle, scrubbed). The crossing script line is script-draw.js.
 */

/** @param {import('./index.js').MotionContext} ctx */
export default function quoteBand({ gsap, reduced }) {
  if (reduced) return;
  document.querySelectorAll('[data-quote-band]').forEach((band) => {
    const final = getComputedStyle(band).borderTopLeftRadius;
    gsap.fromTo(
      band,
      { borderTopLeftRadius: '80px', borderTopRightRadius: '80px' },
      {
        borderTopLeftRadius: final,
        borderTopRightRadius: final,
        ease: 'none',
        scrollTrigger: { trigger: band, start: 'top bottom', end: 'top 40%', scrub: 0.5 },
      },
    );
  });
}
