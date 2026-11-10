// @ts-check
/**
 * "When visible" triggers via IntersectionObserver (measured off the main thread, with no
 * page-wide layout pass on load). Scrubbed effects use scrub.js.
 */

/**
 * @param {Element | Element[] | NodeListOf<Element>} targets
 * @param {(el: Element, visible: boolean) => void} callback
 * @param {{ threshold?: number, rootMargin?: string, once?: boolean }} [o]
 * @returns {() => void} disconnect
 */
export function onVisible(targets, callback, { threshold = 0, rootMargin = '0px', once = true } = {}) {
  const list = targets instanceof Element ? [targets] : [...targets];
  if (!list.length) return () => {};
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          callback(e.target, true);
          if (once) io.unobserve(e.target);
        } else if (!once) {
          callback(e.target, false);
        }
      }
    },
    { threshold, rootMargin },
  );
  list.forEach((el) => io.observe(el));
  return () => io.disconnect();
}
