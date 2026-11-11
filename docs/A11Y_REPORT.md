# Accessibility report (Part A)

Target: **WCAG 2.2 AA**. Last checked: 11 November 2026, production build (`KLS_DIST=dist-check`).

## Automated

| Check | Result |
|---|---|
| **axe-core 4** (WCAG 2.0/2.1/2.2 A + AA + best practice), 14 pages × 375 px and 1280 px | **0 violations** (5 fixed in A5: heading order on Mentorship, duplicate landmark labels on story tag pages and the styleguide) |
| **Lighthouse accessibility** (mobile), every page | **100** on all pages |
| `tools/check.mjs` | alt text on every `<img>`, unique ids, titles/descriptions, valid JSON-LD: clean |

axe was run ad hoc (axe-core injected into headless Edge via Playwright; nothing added to the project).

## Manual checks done

| Area | What was checked | Result |
|---|---|---|
| Skip link | First Tab shows "Skip to main content"; it jumps to `<main>` | Pass |
| Header & mobile menu | Menu button at < 64rem; opens a full-screen dialog; focus moves to Close; Tab is trapped; Esc closes and focus returns to the button; the page behind is `inert` | Pass |
| No-JS header | Links wrap under the logo (via `<noscript><style>`), no menu button | Pass |
| Outline circles | Reachable by Tab; focus reveals the photo + script label; each circle is a real link with a text name | Pass |
| Focus visibility | 2 px ring, 3 px offset; leaf on light, sage/sun on dark and photo surfaces | Pass |
| Motion | `prefers-reduced-motion` and the styleguide switch: final states, no loops, scrubs or draws; nothing hidden without JS | Pass |
| Colour contrast | Computed from tokens (styleguide table); decorative script uses large sizes only | Pass |
| Zoom / reflow | No horizontal scroll at 375 px; layouts reflow | Pass |

## Not yet done (needs a person or comes later)

- **Forms and the sponsor flow:** markup is accessible by design (real labels, hints/errors wired with
  `aria-describedby`, fieldsets/legends, 48 px targets) and passes axe, but **interactive testing was
  deliberately skipped** at the owner's request (forms are visual-only in Part A for now). Test them by
  keyboard and screen reader when the composer is switched on, with `mailto:`/`wa.me` hand-offs blocked.
- **Screen reader pass** (NVDA + Firefox/Chrome on Windows, TalkBack on Android, VoiceOver on iPhone):
  recommended before launch. Focus on: menu dialog, circles, story rows, the sponsor form.

## Known decisions

- Decorative handwriting is `aria-hidden` when the same words are in the HTML, or `role="img"` with
  an `aria-label`.
- Pill-band numbers: screen readers get the real values from visually hidden text, never the counter.
- Radio cards keep the native radio (visually hidden over the card) so keyboard and screen readers work.
