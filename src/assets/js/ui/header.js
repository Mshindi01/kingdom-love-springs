// @ts-check
/**
 * Header behaviour:
 *  - adds .is-scrolled after a little scrolling (overlay header turns solid)
 *  - full-screen mobile menu: focus trap, Esc to close, scroll lock, focus return,
 *    the rest of the page made inert while open
 */

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function initHeader() {
  const header = /** @type {HTMLElement | null} */ (document.querySelector('[data-header]'));
  if (header) {
    let ticking = false;
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    };
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    update();
  }

  document.querySelectorAll('[data-menu-toggle]').forEach((toggle) => initMenu(/** @type {HTMLButtonElement} */ (toggle)));
}

/** @param {HTMLButtonElement} toggle */
function initMenu(toggle) {
  const menu = /** @type {HTMLElement | null} */ (document.getElementById(toggle.getAttribute('aria-controls') || ''));
  if (!menu) return;
  const closeBtn = /** @type {HTMLButtonElement | null} */ (menu.querySelector('[data-menu-close]'));
  const label = toggle.querySelector('.sr-only');
  /** @type {Element[]} */
  let inerted = [];

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  const reduced = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('reduce-motion');

  const open = () => {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    if (label) label.textContent = 'Close menu';
    document.documentElement.classList.add('menu-open');
    // Make everything except the menu inert
    inerted = [...document.body.children].filter((el) => !el.contains(menu) && !el.hasAttribute('inert'));
    inerted.forEach((el) => el.setAttribute('inert', ''));
    const headerInner = menu.parentElement?.querySelector('.site-header__inner');
    if (headerInner) {
      headerInner.setAttribute('inert', '');
      inerted.push(headerInner);
    }
    requestAnimationFrame(() => menu.classList.add('is-open'));
    (closeBtn || /** @type {HTMLElement | null} */ (menu.querySelector(FOCUSABLE)))?.focus();
    document.addEventListener('keydown', onKey);
  };

  const close = (returnFocus = true) => {
    if (!isOpen()) return;
    toggle.setAttribute('aria-expanded', 'false');
    if (label) label.textContent = 'Open menu';
    menu.classList.remove('is-open');
    document.documentElement.classList.remove('menu-open');
    inerted.forEach((el) => el.removeAttribute('inert'));
    inerted = [];
    document.removeEventListener('keydown', onKey);
    const hide = () => {
      if (!isOpen()) menu.hidden = true;
    };
    if (reduced()) hide();
    else setTimeout(hide, 320);
    if (returnFocus) toggle.focus();
  };

  /** @param {KeyboardEvent} e */
  function onKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = /** @type {HTMLElement[]} */ ([...menu.querySelectorAll(FOCUSABLE)]).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  toggle.addEventListener('click', () => (isOpen() ? close() : open()));
  closeBtn?.addEventListener('click', () => close());
  menu.addEventListener('click', (e) => {
    if (/** @type {HTMLElement} */ (e.target).closest('a')) close(false);
  });
  window.matchMedia('(width >= 64rem)').addEventListener('change', (e) => e.matches && close(false));
}
