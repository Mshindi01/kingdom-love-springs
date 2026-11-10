// @ts-check
/** Toasts (polite live region) + "copy link" buttons. */

const SPRITE_ICON = (/** @type {string} */ name) => {
  const use = document.querySelector('svg.icon use');
  const sprite = use?.getAttribute('href')?.split('#')[0] ?? '';
  return `<svg class="icon" aria-hidden="true" focusable="false"><use href="${sprite}#${name}"></use></svg>`;
};

/**
 * @param {string} message
 * @param {{ icon?: string, duration?: number }} [o]
 */
export function showToast(message, { icon = 'check-circle-2', duration = 3600 } = {}) {
  const region = document.querySelector('[data-toast-region]');
  if (!region) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = SPRITE_ICON(icon);
  const text = document.createElement('span');
  text.textContent = message;
  toast.append(text);
  region.append(toast);
  setTimeout(() => {
    toast.classList.add('is-leaving');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

export function initToasts() {
  document.addEventListener('click', async (e) => {
    const target = /** @type {HTMLElement} */ (e.target);
    const copy = /** @type {HTMLElement | null} */ (target.closest('[data-copy-link]'));
    if (copy) {
      try {
        await navigator.clipboard.writeText(copy.dataset.copyLink || location.href);
        showToast('Link copied');
      } catch {
        showToast('Couldn’t copy. Please copy the address from your browser.', { icon: 'info' });
      }
      return;
    }
    const demo = /** @type {HTMLElement | null} */ (target.closest('[data-toast-demo]'));
    if (demo) showToast(demo.dataset.toastDemo || 'Done');
  });
}
