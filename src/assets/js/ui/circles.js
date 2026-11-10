// @ts-check
/**
 * Outline circles on touch screens: the first tap reveals the photo + script label,
 * a second tap follows the link. Hover and keyboard focus are pure CSS.
 */
export function initCircleTaps() {
  /** @type {string} */
  let lastPointer = 'mouse';
  document.addEventListener('pointerdown', (e) => (lastPointer = e.pointerType), { passive: true, capture: true });

  document.addEventListener('click', (e) => {
    const circle = /** @type {HTMLElement | null} */ (/** @type {HTMLElement} */ (e.target).closest?.('[data-circle]'));
    if (!circle || lastPointer !== 'touch') return;
    if (circle.classList.contains('is-revealed')) return; // second tap: follow the link
    e.preventDefault();
    document.querySelectorAll('[data-circle].is-revealed').forEach((c) => c.classList.remove('is-revealed'));
    circle.classList.add('is-revealed');
  });
}
