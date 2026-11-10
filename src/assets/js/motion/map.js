// @ts-check
/**
 * Map circle (DESIGN_SYSTEM §5 #8): the circle scales in, Kenya's outline draws, the dots
 * pop in, then pulse softly (paused off-screen). Reduced motion: static.
 */

/** @param {import('./index.js').MotionContext} ctx */
export default function map({ gsap, ScrollTrigger, reduced }) {
  if (reduced) return;
  /** @type {(() => void)[]} */
  const off = [];

  document.querySelectorAll('[data-map]').forEach((root) => {
    const disc = root.querySelector('.map-circle__disc');
    const outline = root.querySelector('.map-circle__kenya');
    const dots = root.querySelectorAll('.map-circle__core, .map-circle__label');
    const pulses = root.querySelectorAll('.map-circle__pulse');

    const pulse = gsap.timeline({ repeat: -1, paused: true });
    pulse.fromTo(pulses, { scale: 1, opacity: 0.45 }, { scale: 2.8, opacity: 0, duration: 2.2, ease: 'power1.out', stagger: 0.6 });

    const intro = () => {
      const tl = gsap.timeline();
      if (disc) tl.fromTo(disc, { scale: 0.88, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1, ease: 'power3.out' }, 0);
      if (outline) tl.fromTo(outline, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 0.2);
      tl.fromTo(dots, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.15 }, 1.2);
      return tl;
    };

    ScrollTrigger.create({ trigger: root, start: 'top 75%', once: true, onEnter: intro });
    ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (/** @type {any} */ self) => (self.isActive ? pulse.play() : pulse.pause()),
    });
    const replay = () => intro();
    root.addEventListener('kls:replay', replay);
    off.push(() => root.removeEventListener('kls:replay', replay));
  });

  return () => off.forEach((fn) => fn());
}
