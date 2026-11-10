# Progress

## Current part: **Part A, phase A4 (Inner pages)**: done, not deployed

### 2026-11-10: A4 Inner pages

**Done**
- Pages: `/about/`, `/education/`, `/sports/`, `/mentorship/`, `/stories/` (+ `/stories/tag/<education|sports|families>/`
  and `/stories/<slug>/`), `/get-involved/` (#sponsor #pray #volunteer #partner #tournament), `/contact/`,
  `/safeguarding/`, `/privacy/`, branded 404 ("Looks like this ball went out of play").
- Copy in `data/pages.json` (headings + short connecting microcopy); facts from programmes/stats/faqs.
  Shared partials: `partials/page.mjs` (page hero cream/photo + breadcrumbs, help strip, CTA band,
  `askHref`), `partials/sections/steps.mjs`, `partials/stories.mjs`, `partials/forms/compose-form.mjs`.
- Story blocks: paragraph, heading, quote, verse, photo (consented) + caption, list; share row, related
  stories, sponsor CTA. Tag filters are plain links (work without JS). Drafts only in dev builds.
- Forms (prayer, volunteer, partner, tournament, contact) use the composer pattern with "Send on
  WhatsApp" / "Send by email". **Shown but disabled until KLS's WhatsApp/email are confirmed.**
  Visual only for now (owner: no form testing until A5).
- Hidden until confirmed: team (draft founder), statement of faith, partners, prayer points, the
  "Admin & media" volunteer role, safeguarding contact + full policy, contact details, socials.
  `isVisible()` (format.mjs) hides drafts and anything containing `[CONFIRM` in production.
- `plannedPages` now only `/sponsor/` (A5).

**Performance work (all pages)**
- **ScrollTrigger removed from the runtime.** "When visible" effects use IntersectionObserver
  (`motion/observe.js`); the three scrubbed effects use a tiny helper (`motion/scrub.js`). This
  removed a 270–1,500 ms layout pass on load. The vendored ScrollTrigger file stays in the repo, unused.
- Map dot pulse moved from a GSAP loop to a CSS animation (runs only while on screen).
- CLS 0.1 → 0: the no-JS mobile header fallback moved into `<noscript><style>` in the head, so the
  JS layout is the default and nothing jumps when JS starts.

**Verified**
- `build` + `check` clean (1 warning: `/sponsor/` planned). Type check clean.
- Lighthouse mobile (local, gzip): Home 93–96, About 95, Education 96, Sports 96, Mentorship 95,
  Stories 97, Get involved 98, Contact 95, Safeguarding 98, Privacy 100 (styleguide 85).
  **Accessibility 100 and Best practices 100 on every page. CLS 0 everywhere.**
- No horizontal overflow at 375 / 1280 on any page (fixed one on Sports).
- JS off, reduced motion and full motion: nothing left hidden, script lines drawn, real numbers,
  steps line complete. Mobile menu: focus moves in, page inert, Esc closes and returns focus.

### 2026-11-10: A3 Home page

**Done**
- `src/pages/index.page.mjs` renders the sections listed in `data/home.json` (order, `visible`,
  copy, image refs `{ photo, placeholder, alt }`), one partial each in
  `partials/sections/home-*.mjs`: hero (`layout: split | centered`, default split), what we do
  (circles scroll-snap on mobile + "Swipe to see more" hint), impact bento (stats.json only),
  education programme row + "How sponsorship works" (line draws on scroll), pill band, sports
  collage, stories (hidden in production until a published, consented story exists; drafts show
  in `npm run dev`), how you can help (middle card dark), quote band, map circle, newsletter card.
- Header uses the transparent overlay variant on Home.
- Newsletter: composes an email to KLS (`ui/compose.js`, mailto fallback without JS,
  `TODO(part-c)`). **Disabled with "Sign-up opens soon." until `site.contact.email` is confirmed.**
- `media()`/`imageRef()` support `srcset` + `sizes` from photos.json and `fetchpriority=high` for
  the hero. OG image `assets/images/og-default.png` (1200×630, template `tools/og/og-template.html`).
  JSON-LD `NGO` (name, description, url, areaServed Kenya, `sameAs` only from confirmed socials).
- `site.json → plannedPages`: links to pages arriving in A4/A5 are allowed (check warns, never
  fails) and the header/footer show the full navigation now. They 404 until built.
- Build: `KLS_DIST=dist-check` builds/checks/serves into another folder (no race with `npm run dev`).
- Motion start-up split into one task per module + no redundant `ScrollTrigger.refresh()`:
  home TBT went from ~800 ms to ~75 ms.

**Verified**
- `build` + `check` clean (1 warning: planned pages). Type check clean.
- 375 / 1280 screenshots of every section (768/1600 via the shared components in A2).
- JS off and reduced motion: nothing hidden, script lines fully drawn, real numbers shown.
- Lighthouse mobile (local, gzip): **Performance 94–95, Accessibility 100, Best practices 100**.
  SEO is low only because the preview is intentionally `noindex`.
- **Not yet:** hero photo ≤ 250 KB WebP (no consented photos yet; the `srcset` plumbing is ready).
  Forms are visual-only for now (owner's instruction): no further form testing until A5.

**Notes**
- The quote band shows Matthew 5:16 (KJV) as a default; translation is still [CONFIRM] (#18).
- A browser test of the newsletter form launched the local mail app (a draft to a fake address,
  nothing sent). Future form tests must block `mailto:`/`wa.me` hand-offs first.

### 2026-11-10: A2 Design system & motion

**Script font decision: Ms Madi.** Rendered the five phrases + 35 · 200 · 600 in Allison, Mrs Saint
Delafield and Ms Madi over a photo placeholder and on forest-900. Ms Madi has the slanted, flowing
energy closest to Genocide Edu's brush-pen hand, a larger x-height and stroke weight that stay
legible over photos, and the clearest numerals for the pill band. Mrs Saint Delafield was more
brush-like but crowded ("light&salt", an odd "K"); Allison was too thin at display sizes. The other
two fonts were deleted; `--font-script` is set in `tokens.css`.

**Done**
- **Handwriting draw-on** (`partials/script-line.mjs` + `js/motion/script-geometry.js` shared by
  build and browser + `js/motion/script-draw.js`): the words are revealed through a mask holding
  a zig-zag "pen" path on a slight wave (writes stroke by stroke, not a wipe), then a two-stroke
  tapered swoosh (thick stops early, thin runs on). 4 presets: `rise`, `loop`, `underline`,
  `cross`. Re-fitted to the real text width once fonts load. Fully drawn without JS / with
  reduced motion. Once, at 40% visible.
- **Components** (partials + CSS, all surface-aware via `--raised`/`--invert-*` tokens): header
  (overlay/solid, full-screen forest mobile menu with focus trap, Esc, inert page, focus return;
  no-JS fallback wraps links), footer (hides anything `[CONFIRM]`), buttons (primary/soft/
  outline/link/ghost, sizes), eyebrow, section header, outline circles (hover/focus/tap reveal),
  story row, soft card (invert; featured hands off its dark state), float card, programme row,
  bento grid, pill band, quote band, map circle (simplified Kenya outline from lon/lat + 3 region
  dots), doc card, person circle, journey bar (renders nothing without a real value), photo
  collage, photo hero, chips/badges, FAQ (`<details>`), form fields (input, select, textarea,
  radio cards, checkbox, steps, error summary, all states), toast, breadcrumbs, share row,
  pagination. `media()` refuses photos without `consent: true`.
- **Motion modules** (`js/motion/`): `index.js` (loads only what's on the page, waits for fonts,
  `gsap.matchMedia()` + `html.reduce-motion`), `reveal`, `script-draw`, `circles`, `pill-band`
  (scrubbed scale/radius + count-up with gold strokes), `quote-band`, `hero`, `float`, `map`.
  UI modules (`js/ui/`): header/menu, circle taps, toasts + copy link, reduce-motion toggle,
  script fitting.
- **`/styleguide/`** (noindex, not in sitemap): palette + contrast table computed from tokens,
  type scale, script decision, script lines on cream/forest/photo, every component on all six
  surfaces, header demos, motion lab with replay buttons and a reduce-motion toggle, forms in
  all states.
- Build: JS module imports get `?v=<hash>`; production CSS is minified (80 KB → 55 KB, ~11 KB
  gzipped). Dev server now gzips like GitHub Pages. View transitions between pages.

**Fixed along the way**
- GSAP rounds px values, so 0→1 dash offsets jumped: every drawn path now uses `pathLength="1000"`.
- `vector-effect: non-scaling-stroke` breaks `pathLength` dashes (circles only half drew): removed.
- `backdrop-filter` on the header trapped the fixed mobile menu inside it: moved to `::before`.
- GSAP `autoAlpha` on circle labels hid the links' accessible names: opacity only.

**Verified**
- `npm run build && npm run check`: clean. Type check (`tsc --checkJs`, ad hoc): clean.
- Edge at 375 / 768 / 1280 / 1600. Keyboard: circles reveal on focus, menu traps focus, Esc
  closes and returns focus. JS off: everything visible (masks fully drawn). Reduced motion: no
  hidden states, no loops/scrubs/draws, real numbers shown.
- Lighthouse mobile (local, gzip): **Home 98 / A11y 100 / BP 100**. **Styleguide 75 / A11y 100 /
  BP 100**. The styleguide is a deliberately heavy internal page (~2,000 elements, ~45 animated
  script lines, every component six times); real pages in A3/A4 will be far lighter. SEO is low
  only because the preview is intentionally `noindex`.

**Notes for A3**
- Use `photoHero` with `header: 'overlay'` in the page meta for the transparent header.
- On small screens consider hiding the hero float card (it's long on 375px).
- Example content in the styleguide (journey bar 80%, doc cards, KJV verse) is labelled
  "Example" and must not be copied into real pages without confirmation.

### 2026-11-10: A1 Foundations

**Done**
- Repo initialised locally on `main` (no GitHub repo yet). Planning PDF, biography `.docx` and
  `kingdom-love-springs-plan/` are git-ignored.
- Zero-dependency build `tools/build.mjs` (`src/` → `dist/`): page modules, layout, story collection
  template (drafts only in dev), CSS `@import` bundling, content-hash `?v=` cache busting,
  `sitemap.xml`, `robots.txt`, `404.html`, `.nojekyll`, optional `CNAME`. `--watch` rebuilds in a
  fresh child process (debounced).
- `tools/serve.mjs`: GitHub Pages-like server under the base path on `:4000`, 404 page, folder
  redirects, path-traversal guard, SSE live reload (`npm run dev`).
- `tools/check.mjs`: broken links/assets/anchors, URLs missing the basePath, alt text, title and
  description, duplicate ids, 300 KB image budget, raw hex outside `tokens.css`, and safeguarding
  (forbidden child fields, multi-word first names, published stories without consent, photos used
  without `consent: true`, EXIF GPS via a minimal APP1 parser). All rules tested against planted
  violations.
- Tokens (`tokens.css`) for every colour/type/space/radius/motion value in DESIGN_SYSTEM §2–§5,
  plus 6 `[data-surface]` blocks. `base.css`, `layout.css`, layer order
  `reset, base, layout, components, sections, pages, utilities`.
- Fonts self-hosted: General Sans 400/500/600 (ITF FFL licence included) + script candidates
  Allison (default), Mrs Saint Delafield, Ms Madi (OFL, Latin subset).
- GSAP **3.15.1** + ScrollTrigger vendored (`VERSION`, licence note), loaded with `defer` only on
  pages with `meta.motion`. `main.js` sets `html.js`, registers ScrollTrigger, `gsap.matchMedia()`
  with a reduced-motion branch, and a first reveal module.
- Lucide sprite (43 icons, lucide-static 1.71.0) + local Instagram/Facebook/YouTube outline marks.
- Placeholder SVGs (hero / landscape / square / portrait) and favicon, generated from tokens
  (`npm run placeholders`).
- All data files with the client's verbatim text and `[CONFIRM]` markers. Temporary "coming
  soon" home + 404.
- GitHub Actions workflow written, **push trigger commented out** (manual run only) per owner's
  instruction not to deploy yet. `docs/DEPLOY_GITHUB_PAGES.md`.

**Verified**
- `npm run build && npm run check`: clean.
- Dev server: base-path routing, 404, folder 301, live-reload event on file change.
- Edge (Playwright, ad hoc) at 375 / 768 / 1280 / 1600: renders, no console errors, all fonts load.
  JS disabled: all content visible. Reduced motion: no hidden states. First Tab shows the skip link.
- Not yet: Lighthouse (no deploy; run in A2 on the local server), live Pages URL.

**Decisions / notes**
- Workflow runs `actions/configure-pages` *before* the build so `SITE_URL`/`BASE_PATH` come from
  GitHub (correct for any repo name or custom domain).
- Preview is not indexed: `site.seo.indexing: false` → `robots.txt Disallow: /` + `noindex`. Flip at launch (A5).
- Header/footer only link to pages that exist, so there are no broken links while pages are built in stages.
- The hex check exempts generated SVG image files (their colours come from `tokens.css` via the generator).

### Next: A5 Sponsor flow, polish & client kit
- The multi-step `/sponsor/` enquiry (then remove it from `plannedPages`), then test all composer
  forms **with mailto:/wa.me hand-offs blocked in the browser**, a11y/perf/SEO passes, client kit.

### Open questions
- GitHub username + repo name (sets `site.url`; `basePath` assumed `/kingdom-love-springs`).
- When to deploy (then uncomment the push trigger).

## `[CONFIRM]` register

| # | Item | Where |
|---|---|---|
| 1 | GitHub username / repo name / domain | `site.json → url, basePath, customDomain` |
| 2 | Contact email | `site.json → contact.email` |
| 3 | Phone | `site.json → contact.phone` |
| 4 | WhatsApp number (international format) | `site.json → contact.whatsapp` |
| 5 | Location (city / area) | `site.json → contact.location` |
| 6 | Safeguarding contact person | `site.json → contact.safeguardingContact` |
| 7 | Founding year | `site.json → organisation.foundingYear` |
| 8 | Registration (NGO / CBO / ministry + number) | `site.json → organisation.registration` |
| 9 | Social media links (Instagram, Facebook, YouTube?) | `site.json → socials` |
| 10 | What sponsorship covers beyond fees + mentorship (uniforms? books?) | `programmes.json → education.covers` |
| 11 | Cost of sponsoring one child (and whether to show it) | `faqs.json → cost` (draft) |
| 12 | Founder / team names, roles, photos, bios | `team.json` |
| 13 | Partner churches / organisations + logo permission | `partners.json` |
| 14 | Real stories (with guardian consent + child assent) | `stories.json` (3 drafts) |
| 15 | Upcoming tournaments / clinics | `events.json` |
| 16 | Prayer points | `involve.json → prayerPoints` |
| 17 | Volunteer roles | `involve.json → volunteerRoles` |
| 18 | Quote-band verse + Bible translation (currently Matthew 5:16, KJV, as a default) | `home.json → quote` |
| 19 | Statement of faith summary | About page (A4) |
| 20 | Any reports / documents (annual report, newsletters) | Documents grid (A3/A4) |
| 21 | Consented photos | `photos.json` (empty) |
| 22 | Logo + brand colours | `tokens.css` (brand-swap) |
| 23 | Full safeguarding policy (if any) | `/safeguarding/` (A4) |
