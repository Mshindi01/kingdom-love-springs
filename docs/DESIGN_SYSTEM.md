# Kingdom Love Springs: Design System

> **Feeling:** sunrise over a dusty football pitch in Kenya. Joyful children, hope, faith, steady care. Calm, spacious layouts (Genocide Edu) with warm, photo-led NGO energy (CareNest, Unity in Action).

---

## 1. What we take from each reference

### genocideedu.org (main model: motion, shapes, layout). Seen in the browser on 2026-11-10
| Pattern | What it does | KLS use |
|---|---|---|
| **Handwritten draw-on lines** | Script phrases ("in charge of future", "Path to Empowerment", "Voices Unsilenced") with a long swooping stroke that draws itself over photos and dark bands (Lottie/GSAP) | "from struggle to purpose", "light & salt", "play · hope · faith", "walk alongside" |
| **Full-bleed hero photo** | Dark overlay, centred two-line headline, a script line crossing it | Hero with KLS children (tournament or classroom) |
| **Outline circles → photo reveal** | "What we do": thin 1px circles with a label; on hover the circle fills with a photo and the label becomes handwriting | "What we do": Education · Sports · Mentorship · Faith · Families |
| **Stories list** | Left: a big intro sentence. Right: stacked story rows (avatar + author, title, excerpt, date · read time, square thumb); the hovered row gets a soft grey card | Stories from the field |
| **Pill band for numbers** | A full-width dark band with fully rounded ends; big **handwritten** numbers in pale green + small captions | 35 children · ~200 per event · 500–600 a year · 3 regions |
| **"How can you help" cards** | 3 soft grey rounded cards with an icon, title, text and CTA; the middle/hovered one is dark | Sponsor a child · Pray · Volunteer / Partner |
| **Quote band** | A large rounded-top dark section with a quote, small avatar, and a script line crossing it | A Bible verse or founder quote |
| **Documents grid** | Light mint section, outline cards with file type, title, date; hover inverts to dark with a download icon | Reports & updates (annual report, newsletters) [CONFIRM if any exist] |
| **About** | A circle-masked portrait + a large paragraph | Founder / team |
| **Closing circle** | A big dark circle with a map + script title | A Kenya map circle with the regions (Nairobi, Western, Coast) + script "across Kenya" |
| **Type & tone** | General Sans everywhere, near-black ink, muted grey body, lots of white space, thin lines | Same type, KLS colours |

### CareNest (equal inspiration)
- A hero photo in a big rounded card with **a floating white card** inside ("Make an immediate impact" + button) and small pill badges ("100% transparent…").
- A **bento grid** mixing images, big numbers (500+ / 50,000+) and short value cards.
- Alternating **programme rows** (text card left, photo right) with small icon + button.
- Vision/Mission cards next to a stat strip, and a final **newsletter card floating over a photo**.
- Soft sage/olive greens, pill buttons, generous radii.

### Unity in Action (equal inspiration)
- Hero with an organic **rounded photo collage** + a small round photo + a floating "150 Happy Volunteers" chip with avatars.
- Cause cards with a small eyebrow, title, image, short text, and a **progress bar** (we use it for *journey/goal* bars, e.g. "School fees covered this term: 80%" [CONFIRM real data] or simply as decorative milestones).
- Icon category cards (Education, Healthcare…) with one highlighted.
- A **"Where your giving goes"** transparency donut + legend (Part C, when real figures exist; Part A can show it only with confirmed numbers).
- Dark blog cards with date chips.

---

## 2. Colour: green, warm, hopeful Kenya

(Placeholder brand until the KLS logo/colours arrive. The swap happens in `tokens.css` only.)

| Token | Hex | Role |
|---|---|---|
| `--forest-900` | `#12352A` | Deep green: pill band, quote band, footer, dark cards (Genocide Edu's navy/ink role) |
| `--forest-700` | `#1F5A43` | Hover on dark, secondary dark surfaces |
| `--leaf-600` | `#2B7548` | **Primary action** (buttons with white text 5.6:1, green text on cream 5.3:1) |
| `--leaf-500` | `#3E9A5F` | Decorative green, icons, illustrations (not small text) |
| `--sage-300` | `#B7D3A0` | Handwriting on dark (8.2:1 on forest-900), soft fills, highlights |
| `--mint-50` | `#EEF6EF` | Light section background (the "reports" mint) |
| `--sun-400` | `#F2B544` | Sunrise gold: highlights, badges, the script accent on photos, CTA hover glow |
| `--sun-700` | `#85590A` | Gold as text on cream (5.7:1) |
| `--clay-500` | `#C8693F` | Kenyan red soil: decorative accents, illustration, chips with dark text |
| `--clay-700` | `#9C4A26` | Clay as text (5.7:1) |
| `--cream-50` | `#FBF7EF` | Page background (warm, not white) |
| `--sand-100` | `#F3EBDD` | Soft cards (Genocide Edu's grey cards, warmed) |
| `--white` | `#FFFFFF` | Floating cards, form fields |
| `--ink-900` | `#1E2420` | Body/headings on light (14.8:1) |
| `--ink-500` | `#5F6B63` | Muted body (5.2:1 on cream) |

**Rules:** white text only on forest-900/700 and leaf-600. Never white on sun/clay/leaf-500. Gold/clay are accents, not large fills (except small chips with ink text).

**Surfaces:** `data-surface="cream|sand|mint|white|forest|photo"` remaps `--bg`, `--fg`, `--muted`, `--accent`, `--line`.

---

## 3. Typography

| Role | Font | Use |
|---|---|---|
| `--font-sans` | **General Sans** (Fontshare; weights 400, 500, 600) | Everything: headings (500, tight tracking −0.02em), body (400), UI (500) |
| `--font-script` | **Allison** (Google, OFL) *or* a similar brush-pen script; decide in A2 by matching Genocide Edu's energetic, slanted hand. Alternatives: **Mrs Saint Delafield**, **Ms Madi** | **Decorative only:** draw-on lines, handwritten numbers in the pill band, hover labels in circles. Always paired with readable text or an `aria-label` |

Scale: hero `clamp(2.75rem, 6vw, 5.25rem)` / h2 `clamp(2rem, 4vw, 3.25rem)` / h3 `1.5rem` / body `1.0625rem` (line-height 1.65) / small `.875rem` / eyebrow `.75rem` uppercase tracking .12em (Genocide Edu's "OUR STORIES").

---

## 4. Shapes, layout & components

- **Layout:** max content width 1200px, generous section padding `clamp(80px, 10vw, 160px)`, left-aligned section titles (Genocide Edu), an 8px spacing grid.
- **Radii:** cards 24px, big sections 48px (rounded-top dark bands), **pill band** fully rounded (999px), buttons pill, circles 50%.
- **Lines:** 1px `--line` (ink at 18% / cream at 20% on dark).
- **Header:** transparent over the hero photo (white text), then sticky white/blur with dark text after scrolling (Genocide Edu). Left: logo. Centre-left: links. Right: "Contact" + a divider + a **"Sponsor a child"** button with a heart icon. Mobile: a full-screen menu on forest-900.
- **Buttons:** `primary` leaf-600 pill, `soft` sage-300 pill with forest text (Genocide Edu's green "Donate"), `outline`, `link` with an animated underline. Icon + text.
- **Cards:** `soft-card` (sand, radius 24) → hover **inverts** to forest-900 with cream text (Genocide Edu); `float-card` (white, shadow, radius 20; CareNest hero card); `story-row`; `programme-row`; `cause-card` with a journey bar; `doc-card`; `person-circle`.
- **Outline circles:** 1px circles (~240–280px) in a row; hover/focus fills with a photo (clip-path circle grows from the centre), and the label crossfades to the script font in white. Touch: tap toggles. Keyboard: focus does the same.
- **Pill band:** forest-900, full width minus margins, height ~420px, fully rounded ends; numbers in script (sage-300, ~6rem) + captions in muted cream.
- **Bento grid (CareNest):** a 3-column grid mixing 2 photo tiles, 2 number tiles and 2 value cards.
- **Map circle:** a forest-900 circle with a simple Kenya outline (SVG), glowing dots at Nairobi, Western Kenya and Coast, and the script "across Kenya".
- **Icons:** Lucide (thin 1.5px stroke to match the line style).

---

## 5. Motion (GSAP + ScrollTrigger, gentle and joyful)

| # | Effect | Spec |
|---|---|---|
| 1 | **Script draw-on** | An SVG with (a) a swoosh path animated by `stroke-dashoffset` and (b) script text revealed by an animated mask (a stroked mask path roughly following the writing, or a left→right wipe fallback). 1.4–2s, `power2.out`, triggered when 40% visible, once |
| 2 | Hero | Photo scale 1.08→1 (1.6s), headline lines rise from a mask (stagger .12s), then script #1 |
| 3 | Outline circles | Hover: `clip-path: circle(0%→50%)` photo reveal (.6s) + label crossfade. Scroll-in: circles draw their outline (stroke) in sequence |
| 4 | Pill band | Scales from 0.92 + radius morph as it enters (scrubbed), and numbers count up while their script stroke draws |
| 5 | Cards | Hover invert (.35s), lift 4px. Story rows get a soft background on hover |
| 6 | Section reveals | Fade + 24px rise, batch-staggered (`ScrollTrigger.batch`) |
| 7 | Quote band | Rounded top grows from 80px to 48px radius on scroll (subtle), and the script line draws |
| 8 | Map circle | Dots pulse softly. The circle scales in |
| 9 | Floating hero card | Gentle 6px float loop (paused off-screen) |
| 10 | Page load | Header fades in. View transitions for page-to-page crossfade |

**Reduced motion:** `gsap.matchMedia()`. Everything shows in its final state instantly, with no loops and no scrub. **No JS:** everything visible (motion only adds hidden states after `html.js` is set).

---

## 6. Photography & imagery

- Real KLS photos: football tournaments and clinics, children in school uniform, mentors with youth, families, worship/teaching moments. Joyful, dignified, never pity-driven (see SAFEGUARDING).
- Warm natural colour; light consistent grading is optional, not required.
- Until photos arrive: tasteful placeholders (sand background + leaf line illustration + label), **not** stock images of children.
