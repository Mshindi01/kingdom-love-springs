# Kingdom Love Springs: Full Roadmap

> The complete plan, from first deploy to the CMS. **Build Part A now, stop, iterate with the client in Part B, and come back for Part C.** Each part leaves the project in a finished, working state.

---

## Overview

| Part | Where it runs | What it delivers | Phases |
|---|---|---|---|
| **A: Website** | GitHub Pages (free, instant previews for the client) | The full public website: every page, all animations, real content, working enquiry flows via WhatsApp/email | A1–A5 |
| **B: Client rounds** | GitHub Pages | Repeated feedback → changes cycles until the client signs off on design and content | B (repeatable) |
| **C: CMS & backend** | cPanel (PHP + MySQL), with GitHub still the code home | A Studio CMS for KLS staff, real form inboxes, sponsor enquiry pipeline, newsletter, optional online giving, migration off GitHub Pages | C1–C6 |

```
A1 Foundations ─► A2 Design system & motion ─► A3 Home ─► A4 Inner pages ─► A5 Sponsor flow, polish & client kit
                                                                                        │
                                              ┌─────────────── Part B rounds ◄──────────┘ (repeat until sign-off)
                                              ▼
C1 PHP foundations & migration ─► C2 Studio CMS ─► C3 Enquiries & sponsor pipeline ─► C4 Newsletter
   ─► C5 Giving (optional) ─► C6 Launch on cPanel & handover
```

---

## Part A: Website on GitHub Pages (build now)

### A1: Foundations
Repo, the zero-dependency static build (`src/` → `dist/`), `url()` base-path handling, tokens, fonts (General Sans + the script font), GSAP vendored, the Lucide sprite, base layout, the check script, the GitHub Actions deploy, and a placeholder home live on GitHub Pages **on day one**, so the client has a link immediately.

### A2: Design system & motion
Every component and animation from DESIGN_SYSTEM: handwriting draw-on lines, outline-circle reveals, the pill impact band, invert-on-hover cards, circle portraits, the floating hero card, the bento grid, progress-style "journey" bars, buttons, forms, and the `/styleguide/` page.

### A3: Home page
The full Home from CONTENT §3, with all sections, motion, and the sponsor CTA throughout.

### A4: Inner pages
About · Education & Sponsorship · Sports Ministry · Mentorship & Families · Stories (list + generated story pages) · Get Involved · Contact · Safeguarding · Privacy · 404.

### A5: Sponsor-a-child flow, polish & client kit
- The multi-step "Sponsor a child" enquiry, plus the Volunteer / Partner / Pray / Contact forms, all composing WhatsApp/email messages.
- Then: an accessibility pass, a performance pass, SEO (meta, OG images, sitemap, JSON-LD for NGO), a custom domain option, and the **client review kit** (CLIENT_NOTES.md, a feedback checklist, and an optional on-page "Review mode" banner).

**⏸ Stop after A5.** Share the Pages link with the client.

---

## Part B: Client rounds (repeat as needed)

Use `prompts/part-b-client-rounds/feedback-round.md` each time the client sends feedback (photos, logo, colour tweaks, copy edits, new stories). Each round:
1. Paste the client's notes (and any files: logo, photos, documents).
2. Claude sorts them into **content changes** (data JSON), **design changes** (tokens/components) and **new things** (new sections/pages), asks about anything ambiguous, applies the changes, and redeploys.
3. CLIENT_NOTES.md gets a dated "What changed" entry to send to the client.

The **logo + brand colours** arrive in an early round. Use `prompts/part-b-client-rounds/brand-swap.md`: the tokens are designed so the swap touches only `tokens.css`, the logo files, and the favicon/OG template.

**Sign-off checklist before Part C:** final page list ✓, final copy ✓, approved photos with consent ✓, logo/colours ✓, which forms need real inboxes ✓, newsletter yes/no ✓, online giving yes/no (and which method) ✓, who will edit the site (number of staff users) ✓, domain ✓.

---

## Part C: cPanel + Studio CMS (later)

Full technical design: `docs/LATER_BACKEND.md`. Summary:

### C1: PHP foundations & migration
A PHP 8.1+ front controller, MySQL with migrations, the installer, and **the Part A templates converted to PHP views** (the partials map 1:1). A **seed importer** loads `src/data/*.json` into the database, so nothing is retyped. Same URLs as the GitHub Pages site. The static build is kept for reference.

### C2: Studio CMS
The same principles as our Her Quiet Place Studio: plain words, big buttons, autosave, previews. It edits pages/sections, programmes, stories (block editor), impact numbers, team, partners, FAQs, regions/tournaments and photos (with **consent fields** and safeguarding checks).

### C3: Enquiries & sponsor pipeline
Real form endpoints replace the WhatsApp/email composers (keeping WhatsApp as an option): a **sponsor enquiry pipeline** (New → Contacted → Meeting → Sponsoring / Not now), volunteer/partner/prayer/contact inboxes, email notifications, spam protection, and data-protection controls. Optionally, private **child profiles** (admin-only) to match sponsors, never public.

### C4: Newsletter
Double opt-in subscribe, updates/letters from stories, batched sending via cron, unsubscribe. (A copy of the Her Quiet Place engine.)

### C5: Online giving (optional; decide in Part B)
Options: M-Pesa (Daraja STK Push / Paybill confirmation), Paystack or Flutterwave (cards + M-Pesa), or a PayPal/Givebutter link for overseas donors. Includes recurring sponsorship and receipts. Needs a registered entity, a business account and API keys from the client.

### C6: Launch on cPanel & handover
Security review, deploy guide, DNS move (domain from GitHub Pages → cPanel, with no broken links thanks to identical URLs), cron, email deliverability, backups, a staff handover guide, and a usability session.

---

## Decisions log

| Date | Decision |
|---|---|
| 2026-11-10 | Design model: genocideedu.org (motion, shapes, layout) + Unity in Action & CareNest as equal inspiration (warm, photo-led NGO feel, donation/sponsor cards, bento stats) |
| 2026-11-10 | Content model: aspireglobally.org structure (scholarships · faith-based football · nurture, impact numbers, stories, partners) |
| 2026-11-10 | Brand: logo/colours to come. Meanwhile **green, warm, hopeful Kenya** palette (DESIGN_SYSTEM §2) |
| 2026-11-10 | Giving in Part A: **Sponsor-a-child enquiry** only (WhatsApp/email). Online giving is deferred to C5 |
| 2026-11-10 | Hosting: GitHub Pages for Part A/B, **cPanel for Part C** |
| 2026-11-10 | Motion: GSAP + ScrollTrigger (self-hosted) |
