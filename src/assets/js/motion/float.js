// @ts-check
/**
 * Floating cards (DESIGN_SYSTEM §5 #9): a gentle 6px float loop, paused off-screen.
 * Reduced motion: no loop.
 */

/** @param {import('./index.js').MotionContext} ctx */
export default function float({ gsap, ScrollTrigger, reduced }) {
  if (reduced) return;
  document.querySelectorAll('[data-float]').forEach((el, i) => {
    const tween = gsap.to(el, { y: -6, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true, delay: i * 0.4 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (/** @type {any} */ self) => (self.isActive ? tween.play() : tween.pause()),
    });
  });
}
