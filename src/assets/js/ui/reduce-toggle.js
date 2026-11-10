// @ts-check
/**
 * Reduced-motion switch (html.reduce-motion), used by the styleguide's motion lab.
 * Remembered per browser; the OS "reduce motion" setting always wins.
 */
const KEY = 'kls-reduce-motion';

export function initReduceToggle() {
  const root = document.documentElement;
  try {
    if (localStorage.getItem(KEY) === '1') root.classList.add('reduce-motion');
  } catch {
    /* storage unavailable */
  }

  document.querySelectorAll('[data-reduce-toggle]').forEach((btn) => {
    const sync = () => btn.setAttribute('aria-pressed', String(root.classList.contains('reduce-motion')));
    sync();
    btn.addEventListener('click', () => {
      const on = root.classList.toggle('reduce-motion');
      try {
        localStorage.setItem(KEY, on ? '1' : '0');
      } catch {
        /* ignore */
      }
      sync();
      document.dispatchEvent(new CustomEvent('kls:motionpref'));
    });
  });
}
