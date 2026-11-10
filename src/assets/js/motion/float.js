// @ts-check
/**
 * Floating cards (DESIGN_SYSTEM §5 #9): a gentle 6px float loop, paused off-screen.
 * Reduced motion: no loop.
 */
import { onVisible } from './observe.js';

/** @param {import('./index.js').MotionContext} ctx */
export default function float({ gsap, reduced }) {
  if (reduced) return;
  /** @type {(() => void)[]} */
  const off = [];
  document.querySelectorAll('[data-float]').forEach((el, i) => {
    const tween = gsap.to(el, { y: -6, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true, delay: i * 0.4 });
    off.push(onVisible(el, (_e, visible) => (visible ? tween.play() : tween.pause()), { once: false }));
  });
  return () => off.forEach((fn) => fn());
}
