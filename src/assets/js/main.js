// @ts-check
/**
 * Kingdom Love Springs: front-end boot.
 *
 * Progressive enhancement: without JS, everything is visible and usable.
 * Motion only adds hidden "from" states AFTER html.js is set, and only when the user hasn't
 * asked for reduced motion. GSAP is loaded (deferred) only on pages whose meta has
 * `motion: true`; UI behaviour (menu, circles, toasts) works without them.
 */
import { initHeader } from './ui/header.js';
import { initCircleTaps } from './ui/circles.js';
import { initToasts } from './ui/toast.js';
import { initReduceToggle } from './ui/reduce-toggle.js';
import { fitAllScriptLines, fontsReady } from './ui/script-fit.js';
import { initCompose } from './ui/compose.js';
import { initScrollHints } from './ui/scroll-hint.js';

const root = document.documentElement;
root.classList.remove('no-js');
root.classList.add('js');

initReduceToggle();
initHeader();
initCircleTaps();
initToasts();
initCompose();
initScrollHints();

/** @type {any} */
const w = window;
if (w.gsap) {
  import('./motion/index.js').then(({ initMotion }) => initMotion(w.gsap));
} else {
  // No motion on this page: still fit handwritten lines to their real width once fonts load.
  fontsReady().then(fitAllScriptLines);
}
