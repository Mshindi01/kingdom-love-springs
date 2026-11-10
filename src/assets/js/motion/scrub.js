// @ts-check
/**
 * Tiny scroll-scrub helper (replaces ScrollTrigger for our three scrubbed effects).
 * Progress 0 → 1 as `el` moves from "top at startAt × viewport" to the end position;
 * the paused GSAP animation follows smoothly. Only listens to scroll while the element is
 * near the viewport (IntersectionObserver), and reads just that element's rect per frame.
 */

/**
 * @param {any} gsap
 * @param {Element} el element whose position drives progress
 * @param {any} animation a paused GSAP tween/timeline
 * @param {{ startAt?: number, endAt?: number, endWithBottom?: boolean, smooth?: number }} [o]
 *   startAt: fraction of the viewport where el's top starts (1 = bottom edge)
 *   endAt: fraction where el's top (or bottom, if endWithBottom) reaches progress 1
 * @returns {() => void} cleanup
 */
export function scrub(gsap, el, animation, { startAt = 1, endAt = 0.3, endWithBottom = false, smooth = 0.5 } = {}) {
  let frame = 0;
  let active = false;

  const update = () => {
    frame = 0;
    const vh = window.innerHeight;
    const r = el.getBoundingClientRect();
    const distance = (startAt - endAt) * vh + (endWithBottom ? r.height : 0);
    const p = Math.min(1, Math.max(0, (startAt * vh - r.top) / Math.max(1, distance)));
    gsap.to(animation, { progress: p, duration: smooth, ease: 'power1.out', overwrite: true });
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !active) {
        active = true;
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        onScroll();
      } else if (!entry.isIntersecting && active) {
        active = false;
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        // settle at the nearest end so nothing is left half-way off-screen
        update();
      }
    },
    { rootMargin: '25% 0px 25% 0px' },
  );
  io.observe(el);

  // Start in the right state for the current scroll position, without a tween.
  requestAnimationFrame(() => {
    const vh = window.innerHeight;
    const r = el.getBoundingClientRect();
    const distance = (startAt - endAt) * vh + (endWithBottom ? r.height : 0);
    animation.progress(Math.min(1, Math.max(0, (startAt * vh - r.top) / Math.max(1, distance))));
  });

  return () => {
    io.disconnect();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    if (frame) cancelAnimationFrame(frame);
  };
}
