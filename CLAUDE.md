# CLAUDE.md — Kingdom Love Springs website

> Project memory for Claude Code. Read this file before every task. Then read:
> - `docs/ROADMAP.md`: the full plan (Part A website → Part B client rounds → Part C cPanel + CMS). **Know which part you're in.**
> - `docs/DESIGN_SYSTEM.md` before any UI work
> - `docs/CONTENT.md` before touching copy
> - `docs/SAFEGUARDING.md` before touching any photo, story or child-related content
>
> References: `docs/reference/` (two extra NGO layouts: Unity in Action and CareNest). The main design reference is **genocideedu.org**, described in detail in DESIGN_SYSTEM §1 (open it in a browser if you can).

## 1. What we are building

A hopeful, warm, faith-centred website for **Kingdom Love Springs (KLS)**, a Kenyan ministry that helps children and youth from poor and vulnerable communities **thrive in school, in life and in faith** through:
1. **Education sponsorship:** school fees + ongoing mentorship for 35 children (ages 7–17), with school visits and holiday meetups.
2. **Sports ministry:** football tournaments and clinics across Nairobi, Western Kenya and the Coast (~200 per event, ~500–600 a year), with Christian teaching.
3. **Mentorship & family involvement**, and the Gospel shared through sports and relationships.

**Primary goal of every page:** move a visitor toward **sponsoring a child** (an enquiry), or **getting involved** (pray, volunteer, partner, support a tournament).

## 2. Current part: **Part A, the website on GitHub Pages**

Hard constraints for Part A:
1. **Static only.** Plain HTML, modern CSS and vanilla JS, built by our own **zero-dependency Node build script** (`tools/build.mjs`) from `src/` to `dist/`, deployed by GitHub Actions to **GitHub Pages**. There's no server, no PHP and no database in Part A.
2. **Runtime dependencies:** **GSAP + ScrollTrigger** (self-hosted copies in `src/assets/vendor/gsap/`; GSAP is free for commercial use) and **Lucide** icons (local SVG sprite). Nothing else without asking.
3. **Paths must work in three places:** `https://<user>.github.io/<repo>/` (a sub-path), a custom domain at the root, and later cPanel. So **every internal link and asset URL is generated through `url()` in the build**, using `site.basePath` from config. Never hand-write `/assets/...`.
4. **Forms without a backend:** the sponsor/volunteer/partner/prayer/contact forms are real forms whose submit **composes a WhatsApp message or an email** (`wa.me` / `mailto:`) from the answers, with a clear confirmation screen. Each one is marked `// TODO(part-c): POST to /api/...`. No third-party form services.
5. **Content lives in data files** (`src/data/*.json`) and templates, never scattered in markup. That makes client edits fast in Part B and the database migration trivial in Part C.
6. **Safeguarding first** (see `docs/SAFEGUARDING.md`): first names only, no school names or exact locations for sponsored children, and photos only from the approved set.
7. **Never invent facts.** Numbers, names, testimonies and partners come from `docs/CONTENT.md`. Unknowns are `[CONFIRM]`.
8. **Accessibility:** WCAG 2.2 AA. Everything works without JS (animations are enhancement only).

## 3. Tech (Part A)

| Concern | Choice |
|---|---|
| Source | `src/pages/**/*.page.mjs` export `meta` + `render(ctx)` returning HTML strings, `src/partials/*.mjs` (header, footer, cards…), and `src/data/*.json` (see §4) |
| Templating | JS template literals with an escaping `html` tag (`src/lib/html.mjs`) + `raw()` for trusted HTML. No template engine |
| Build | `node tools/build.mjs` (zero deps): render pages, generate collection pages (stories), copy assets, write `sitemap.xml`, `robots.txt`, `404.html`, `.nojekyll`, `CNAME` (if configured), and fingerprint CSS/JS (`?v=hash`). `--watch` rebuilds on change, and `node tools/serve.mjs` serves `dist/` locally with live reload |
| CSS | Vanilla: tokens as custom properties, `@layer`, nesting, `clamp()`, container queries. BEM-ish classes |
| JS | Vanilla ES modules, `// @ts-check` + JSDoc, no inline scripts/handlers |
| Motion | GSAP + ScrollTrigger for scroll-linked and handwriting effects. CSS transitions for hovers. `gsap.matchMedia()` + `prefers-reduced-motion` respected everywhere |
| Fonts | **General Sans** (Fontshare, free licence: self-host WOFF2 and include the licence) + one handwriting script for decorative lines (DESIGN_SYSTEM §3) |
| Deploy | `.github/workflows/pages.yml`: checkout → Node LTS → `node tools/build.mjs` → `actions/upload-pages-artifact` (dist) → `actions/deploy-pages` |
| Checks | `node tools/check.mjs`: broken internal links, missing alt text, missing meta, images over budget, raw hex outside tokens, and safeguarding rules (no surnames in `children` data, etc.) |

## 4. Folder structure (Part A)

```
src/
  pages/        index.page.mjs  about/index.page.mjs  education/…  sports/…  mentorship/…
                stories/index.page.mjs  get-involved/…  sponsor/…  contact/…  safeguarding/…  privacy/…  404.page.mjs
  templates/    story.mjs  (generates /stories/<slug>/ for each item in data/stories.json)
  partials/     layout.mjs head.mjs header.mjs footer.mjs cards.mjs sections/*.mjs forms/*.mjs motifs.mjs
  data/         site.json home.json programmes.json stories.json stats.json team.json partners.json faqs.json
                regions.json events.json involve.json photos.json (consent registry)
  assets/       css/ js/ fonts/ icons/ images/ (photos, placeholders, motifs) vendor/gsap/
  lib/          html.mjs url.mjs format.mjs
tools/          build.mjs serve.mjs check.mjs build-icons.mjs
.github/workflows/pages.yml
dist/           (build output, git-ignored)
docs/
```

## 5. Design rules (summary; full spec in DESIGN_SYSTEM.md)

- **Genocide Edu's structure and motion**, in **KLS greens and warm Kenyan sunrise tones**, with the **warm photo-led NGO feel** of CareNest and Unity in Action.
- **Signature moves:** handwritten script lines that **draw themselves** over photos and dark bands; thin **outline circles** that fill with a photo on hover; a big **dark-green pill band** for impact numbers (numbers in handwriting); cards that **invert** on hover; circle-masked portraits; a floating "Sponsor a child" card over the hero photo (CareNest); a bento grid of numbers + images (CareNest); clean white space.
- Tokens only (raw hex only in `tokens.css`). Generous spacing. Photos of real KLS children and youth, joyful and dignified.

## 6. Workflow for every phase

1. Read this file, the docs the phase names, and `docs/PROGRESS.md`.
2. Plan first and wait for my OK when the phase asks.
3. Build in small steps, then `node tools/build.mjs && node tools/check.mjs` (both clean).
4. Check at 375 / 768 / 1280 / 1600px, keyboard-only, reduced motion, and **JS disabled**.
5. Lighthouse mobile ≥ 90 performance, 100 accessibility on the pages you touched.
6. Update `docs/PROGRESS.md` (done, next, open questions, `[CONFIRM]` register), and `docs/CLIENT_NOTES.md` (what changed, in plain words, for the client).
7. Commit. Pushing to `main` deploys to GitHub Pages.

## 7. Definition of done (Part A phases)

- [ ] Build + check clean. The deployed Pages URL works at the sub-path
- [ ] Responsive, accessible, works without JS, reduced motion respected
- [ ] No invented facts. Safeguarding rules pass
- [ ] PROGRESS.md + CLIENT_NOTES.md updated
