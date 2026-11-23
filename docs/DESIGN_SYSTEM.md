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

## 2. Colour: KLS brand (scarlet, blue, purple, light yellow)

Client brand colours (Part B, round 1, 2026-11-23). These replace the green placeholder palette.
Each colour has a meaning and a job:

- **Blue = the spring.** Deep navy carries the page: dark bands, footer, menu. Royal blue for links and focus.
- **Purple = the Kingdom.** Royal purple is the secondary dark (hover on dark, the Kenya map), with a soft lavender tint for light sections.
- **Scarlet = love.** Kept for the one thing we ask: the **Sponsor a child** button and other primary actions, plus decorative handwriting on light backgrounds.
- **Light yellow = light and hope.** Handwriting and numbers on dark, the soft button. A deeper sunflower yellow is used for small highlights on photos.

| Token | Hex | Role |
|---|---|---|
| `--navy-900` | `#17224F` | Deep "spring" blue: pill band, quote band, footer, dark cards |
| `--plum-700` | `#4B2A7E` | Royal purple: hover on dark, secondary dark surfaces (white 10.9:1) |
| `--blue-600` | `#2A4AB0` | Royal blue: links, focus ring, form selection (7.4:1 on cream; white 7.8:1) |
| `--violet-500` | `#8A63D2` | Soft purple: decorative icons, illustration (not small text) |
| `--butter-200` | `#FCE7A2` | Light yellow: handwriting on dark (12.4:1 on navy), soft button |
| `--lavender-50` | `#F3F0FA` | Light purple-tinted section background |
| `--sun-400` | `#F6C744` | Sunflower yellow: badges, script accent on photos, button hover glow |
| `--sun-700` | `#7D5E00` | Yellow as text on cream (5.8:1) |
| `--scarlet-500` | `#E0344B` | Scarlet: decorative handwriting on light (large display only, 4.2:1) |
| `--scarlet-600` | `#C8102E` | Scarlet: **primary action** (white text 5.9:1) |
| `--scarlet-700` | `#9E1A2E` | Scarlet as text, errors, primary hover (7.6:1 on cream) |
| `--cream-50` | `#FCF9F2` | Page background (warm, not white) |
| `--sand-100` | `#F5EEDF` | Soft cards |
| `--white` | `#FFFFFF` | Floating cards, form fields |
| `--ink-900` | `#1B1F33` | Body/headings on light (15.5:1) |
| `--ink-500` | `#5C6178` | Muted body (5.8:1 on cream) |

**Rules:** blue carries the page. Scarlet appears only where we ask for action. Purple and yellow are accents. Never put two saturated brand colours side by side as large fills (e.g. no scarlet block on purple). White text only on navy, plum, blue-600 and scarlet-600/700. Never white on yellow or violet-500.

**Surfaces:** `data-surface="cream|sand|lavender|white|navy|photo"` remaps `--bg`, `--fg`, `--muted`, `--accent`, `--line`.

### Logo (client, 2026-11-23)

The logo is a circular waterfall photo with "KINGDOM LOVE SPRINGS" arched in black serif capitals, a dove and a green vine. Files are in `src/assets/images/brand/` and the partial is `src/partials/brand.mjs`.

| Use | File | Where |
|---|---|---|
| **Full logo** | `kls-logo.png` (client original, 500px, transparent) | Footer, on a cream medallion; schema.org `logo`; OG image |
| **Mark** (waterfall circle only) | `kls-mark.png` (96px, circle-cropped) | Header, mobile menu, hero float card. The site name is set beside it in General Sans |
| Favicons | `favicon-32.png`, `favicon-48.png`, `apple-touch-icon.png` | `<head>` |

**Rules:** the full logo always sits on a light background, because its lettering is black. On navy, use the cream medallion. Don't use the full logo below about 150px, because the arched name becomes unreadable; use the mark plus the text name instead. Never recolour, stretch or crop the full logo. The mark gets a 2px white ring (light-yellow ring on navy and over photos).

---

## 3. Typography

| Role | Font | Use |
|---|---|---|
| `--font-sans` | **General Sans** (Fontshare; weights 400, 500, 600) | Everything: headings (500, tight tracking −0.02em), body (400), UI (500) |
| `--font-script` | **Ms Madi** (Google, OFL). **Decided in A2 (2026-11-10)** over Allison and Mrs Saint Delafield: closest to Genocide Edu's energetic, slanted hand while staying legible over photos, with the clearest numerals | **Decorative only:** draw-on lines, handwritten numbers in the pill band, hover labels in circles. Always paired with readable text or an `aria-label` |

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
