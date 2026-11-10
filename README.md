# Kingdom Love Springs: Claude Code Build Pack

The full plan for the Kingdom Love Springs website: **build the website now on GitHub Pages, iterate with the client, then come back for the cPanel CMS and backend.**

```
kingdom-love-springs-plan/
├── README.md                         ← you are here
├── CLAUDE.md                         ← project memory (repo root)
├── docs/
│   ├── ROADMAP.md                    ← THE FULL PLAN: Parts A → B → C, decisions log, sign-off checklist
│   ├── DESIGN_SYSTEM.md              ← Genocide Edu patterns + CareNest/Unity warmth, palette, type, motion
│   ├── CONTENT.md                    ← the client's words verbatim, facts, home sections, pages
│   ├── SAFEGUARDING.md               ← child-protection rules for the website (enforced by the check script)
│   ├── LATER_BACKEND.md              ← Part C technical design (PHP + MySQL + Studio on cPanel)
│   └── reference/                    ← CareNest + Unity in Action screenshots
└── prompts/
    ├── part-a-website/               ← BUILD NOW (GitHub Pages)
    │   ├── A1-foundations.md               static build, tokens, fonts, GSAP, Pages deploy
    │   ├── A2-design-system-motion.md      script draw-on, outline circles, pill band, styleguide
    │   ├── A3-home.md                      the full home page
    │   ├── A4-inner-pages.md               about, education, sports, mentorship, stories, get involved…
    │   └── A5-sponsor-flow-polish.md       sponsor-a-child flow, a11y/perf/SEO, client review kit  ⏸ STOP
    ├── part-b-client-rounds/         ← REPEAT WITH THE CLIENT
    │   ├── feedback-round.md               paste client feedback → sorted, confirmed, applied, deployed
    │   └── brand-swap.md                   when the logo & colours arrive
    └── part-c-cpanel-cms/            ← LATER
        ├── C1-php-foundations-migration.md 1:1 port to PHP, JSON → database importer
        ├── C2-studio-cms.md                staff CMS with photo consent & safeguarding guards
        ├── C3-enquiries-sponsor-pipeline.md real forms, inboxes, sponsor pipeline, private child records
        ├── C4-newsletter.md                supporter updates with batched cron sending
        ├── C5-online-giving-optional.md    M-Pesa / Paystack / PayPal (only if chosen)
        └── C6-launch-cpanel-handover.md    security, deploy, DNS cut-over from GitHub Pages, handover
```

## Decisions locked in

| Topic | Decision |
|---|---|
| Design | **genocideedu.org** (handwritten draw-on lines, outline circles that reveal photos, a dark pill band with handwritten numbers, invert-on-hover cards, circle portraits, a map circle) + **CareNest & Unity in Action** as equal inspiration (photo-led warmth, floating hero card, bento stats, collage, cause cards) |
| Content model | **aspireglobally.org** (scholarships · faith-based football · nurture, numbers, stories, partners) |
| Colours | Green, warm, hopeful Kenya (forest green, leaf green, sage, sunrise gold, red-soil clay, cream) until the KLS logo/colours arrive (then `brand-swap.md`) |
| Fonts | General Sans (like Genocide Edu) + one handwriting script, picked in A2 |
| Part A stack | Static HTML/CSS/JS from a zero-dependency Node build, **GSAP + ScrollTrigger** self-hosted, the Lucide sprite, deployed by **GitHub Actions to GitHub Pages** |
| Giving | **Sponsor-a-child enquiry** (a multi-step form → WhatsApp or email). Online giving is optional in C5 |
| Later | **cPanel** with PHP + MySQL Studio CMS, real inboxes, newsletter. Same URLs, so the move breaks nothing |
| Safeguarding | First names only, no schools/locations, consent-registered photos only, no public child profiles |

## How to run it

1. Create a GitHub repo (e.g. `kingdom-love-springs`), clone it, and copy `CLAUDE.md` + `docs/` in.
2. Open Claude Code there and paste **A1** (below its `---` line). In plan mode, approve, build. Push, then in GitHub: **Settings → Pages → Source: GitHub Actions**. You get a link for the client on day one.
3. `/clear`, then A2 → A3 → A4 → A5. **Stop after A5** and send the client the link + `docs/CLIENT_NOTES.md`.
4. For each batch of client feedback, use `part-b-client-rounds/feedback-round.md`. When the logo arrives, use `brand-swap.md`.
5. When the ROADMAP sign-off checklist is complete, start Part C at **C1**.

**Tips**
- For A2 and A3, ask Claude Code to open genocideedu.org in a browser if it can. The hover circles and draw-on script are best understood live.
- Polish prompt after any UI phase:
  ```
  Screenshot this phase's pages at 375, 768, 1280 and 1600px (npx playwright ad hoc, not added
  to the project). Compare against genocideedu.org's rhythm and motion and DESIGN_SYSTEM.md.
  List the 10 biggest gaps (spacing, type, motion timing, warmth, mobile), then fix them.
  Keep safeguarding, accessibility and the performance budget intact.
  ```

## What to ask the client for (early)
- [ ] Logo + brand colours (SVG if possible)
- [ ] Photos with **guardian consent recorded** (tournaments, classrooms, mentors, families)
- [ ] Contact details: email, phone/WhatsApp, location, socials
- [ ] Founder/team names, photos and short bios
- [ ] Registration details (NGO/CBO/ministry) and partner organisations (with logo permission)
- [ ] 2–3 real stories (with consent), upcoming tournaments, prayer points, volunteer roles
- [ ] Preferred Bible verse(s) and translation for the quote band
- [ ] Domain name (for GitHub Pages now, and cPanel later)
