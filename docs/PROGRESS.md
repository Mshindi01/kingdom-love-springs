# Progress

## Current part: **Part A, phase A1 (Foundations)**: done, not deployed

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

### Next: A2 Design system & motion
- Pick ONE script font (delete the other two files + `@font-face` blocks), full components,
  draw-on lines, outline circles, pill band, `/styleguide/`.
- Run Lighthouse on the local server.

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
| 18 | Quote-band verse + Bible translation (Matthew 5:14–16?) | `home.json → quote` |
| 19 | Statement of faith summary | About page (A4) |
| 20 | Any reports / documents (annual report, newsletters) | Documents grid (A3/A4) |
| 21 | Consented photos | `photos.json` (empty) |
| 22 | Logo + brand colours | `tokens.css` (brand-swap) |
| 23 | Full safeguarding policy (if any) | `/safeguarding/` (A4) |
