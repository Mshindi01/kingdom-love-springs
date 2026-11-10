// @ts-check
/**
 * Hero (DESIGN_SYSTEM §5 #2 + #10): header fades in, the photo settles (scale 1.08 → 1),
 * headline lines rise from their masks (stagger .12s), the rest fades up, then the hero's
 * script line draws (via `kls:play`, see script-draw.js).
 */

/** @param {import('./index.js').MotionContext} ctx */
export default function hero({ gsap, reduced }) {
  if (reduced) return;
  /** @type {(() => void)[]} */
  const off = [];

  document.querySelectorAll('[data-hero]').forEach((hero) => {
    const build = () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      const img = hero.querySelector('.hero__media img');
      const lines = hero.querySelectorAll('.hero__line-inner');
      const rest = hero.querySelectorAll('.hero__subline, .hero__buttons, .hero__aside');
      const header = document.querySelector('[data-header]');
      if (header) tl.fromTo(header, { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.6, clearProps: 'transform,opacity,visibility' }, 0);
      if (img) tl.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0);
      if (lines.length) tl.fromTo(lines, { yPercent: 105 }, { yPercent: 0, duration: 1, stagger: 0.12 }, 0.15);
      if (rest.length) tl.fromTo(rest, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.55);
      tl.call(() => hero.querySelectorAll('svg[data-script-line]').forEach((s) => s.dispatchEvent(new CustomEvent('kls:play'))), [], 0.75);
      return tl;
    };
    build();
    const replay = () => {
      hero.querySelectorAll('svg[data-script-line]').forEach((s) => s.dispatchEvent(new CustomEvent('kls:replay')));
      build();
    };
    hero.addEventListener('kls:replay', replay);
    off.push(() => hero.removeEventListener('kls:replay', replay));
  });

  return () => off.forEach((fn) => fn());
}
