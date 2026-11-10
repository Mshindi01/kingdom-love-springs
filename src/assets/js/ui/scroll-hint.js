// @ts-check
/**
 * Horizontal scrollers (e.g. the "What we do" circles on mobile): hide the "Swipe to see
 * more" hint once the user reaches the end, and show it only when content actually overflows.
 */
export function initScrollHints() {
  document.querySelectorAll('.home-what__circles').forEach((wrap) => {
    const scroller = /** @type {HTMLElement | null} */ (wrap.querySelector('.circles'));
    const hint = /** @type {HTMLElement | null} */ (wrap.querySelector('.home-what__hint'));
    if (!scroller || !hint) return;
    const update = () => {
      const overflow = scroller.scrollWidth - scroller.clientWidth > 4;
      const atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 8;
      hint.classList.toggle('is-hidden', !overflow || atEnd);
    };
    scroller.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  });
}
