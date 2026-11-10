// @ts-check
/**
 * Script draw-on (DESIGN_SYSTEM §5 #1): the words "write" themselves through the mask
 * (a zig-zag pen path, see script-geometry.js), then the tapered swoosh strokes out
 * (thick stroke stops early, thin stroke runs to the end → a pen-lift taper).
 * Triggered once when 40% visible. Lines inside [data-hero] wait for a `kls:play` event
 * (hero.js). Reduced motion: nothing to do, lines render fully drawn.
 */

/** @param {import('./index.js').MotionContext} ctx */
export default function scriptDraw({ gsap, ScrollTrigger, reduced }) {
  if (reduced) return;
  /** @type {(() => void)[]} */
  const off = [];

  document.querySelectorAll('svg[data-script-line]').forEach((node) => {
    const svg = /** @type {SVGSVGElement} */ (node);
    const mask = svg.querySelector('.script-line__mask');
    const thick = svg.querySelector('.script-line__swoosh--thick');
    const thin = svg.querySelector('.script-line__swoosh--thin');
    const chars = (svg.querySelector('text')?.textContent || '').length;
    const write = gsap.utils.clamp(1.1, 1.9, 0.3 + chars * 0.06);

    const tl = gsap.timeline({ paused: true, delay: Number(svg.dataset.delay || 0) });
    if (mask) tl.fromTo(mask, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: write, ease: 'power1.inOut' }, 0);
    if (thin) tl.fromTo(thin, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 0.95, ease: 'power2.out' }, write * 0.62);
    if (thick) tl.fromTo(thick, { strokeDashoffset: 800 }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' }, write * 0.62);

    const play = () => tl.play();
    const replay = () => tl.restart(true);
    svg.addEventListener('kls:replay', replay);
    off.push(() => svg.removeEventListener('kls:replay', replay));

    if (svg.closest('[data-hero]')) {
      svg.addEventListener('kls:play', play);
      off.push(() => svg.removeEventListener('kls:play', play));
    } else {
      ScrollTrigger.create({ trigger: svg, start: '40% bottom', once: true, onEnter: play });
    }
  });

  return () => off.forEach((fn) => fn());
}
