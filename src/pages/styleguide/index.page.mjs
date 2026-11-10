// @ts-check
/**
 * /styleguide/: every component and motion pattern (A2). noindex, not in the sitemap.
 * Demo links point at anchors on this page, so nothing links to pages that don't exist yet.
 * Copy comes from src/data; anything that isn't real data is labelled "Example".
 */
import { html, raw } from '../../lib/html.mjs';
import { icon } from '../../partials/icon.mjs';
import { scriptLine } from '../../partials/script-line.mjs';
import { button, chip, sectionHeader, breadcrumbs, pagination, shareRow, faqList } from '../../partials/ui.mjs';
import { softCard, floatCard, storyRow, programmeRow, docCard, personCircle, journeyBar } from '../../partials/cards.mjs';
import { outlineCircles } from '../../partials/sections/circles.mjs';
import { pillBand, quoteBand } from '../../partials/sections/bands.mjs';
import { mapCircle } from '../../partials/sections/map-circle.mjs';
import { photoHero, photoCollage, bento } from '../../partials/sections/media-blocks.mjs';
import { textField, textArea, selectField, radioCards, checkbox, stepsIndicator, errorSummary } from '../../partials/forms/fields.mjs';
import { placeholderImage } from '../../partials/motifs.mjs';
import { header } from '../../partials/header.mjs';
import { formatDate, readingTime } from '../../lib/format.mjs';
import { absoluteUrl } from '../../lib/url.mjs';

export const meta = {
  title: 'Styleguide',
  description: 'Kingdom Love Springs design system: colours, type, components and motion.',
  noindex: true,
  sitemap: false,
  motion: true,
};

const SURFACES = ['cream', 'sand', 'mint', 'white', 'forest', 'photo'];
const PHRASES = /** @type {const} */ ([
  ['from struggle to purpose', 'rise'],
  ['light & salt', 'loop'],
  ['play · hope · faith', 'underline'],
  ['walk alongside', 'cross'],
  ['across Kenya', 'rise'],
]);

const TOC = [
  ['sg-colour', 'Colour'],
  ['sg-type', 'Type'],
  ['sg-script', 'Handwriting'],
  ['sg-buttons', 'Buttons'],
  ['sg-surfaces', 'Surfaces'],
  ['sg-header', 'Header'],
  ['sg-hero', 'Hero'],
  ['sg-circles', 'Circles'],
  ['sg-cards', 'Cards'],
  ['sg-stories', 'Stories'],
  ['sg-programmes', 'Programmes'],
  ['sg-bento', 'Bento'],
  ['sg-band', 'Pill band'],
  ['sg-collage', 'Collage'],
  ['sg-quote', 'Quote'],
  ['sg-map', 'Map'],
  ['sg-docs', 'Docs & people'],
  ['sg-ui', 'Small UI'],
  ['sg-forms', 'Forms'],
  ['sg-motion', 'Motion lab'],
];

// ── WCAG contrast, computed from the real token values ─────────────────────────
/** @param {string} hex */
function luminance(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** @param {string} a @param {string} b */
function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const PALETTE = [
  ['forest-900', 'Pill band, quote band, footer, dark cards'],
  ['forest-700', 'Hover on dark, secondary dark'],
  ['leaf-600', 'Primary action'],
  ['leaf-500', 'Decorative green, icons (not small text)'],
  ['sage-300', 'Handwriting on dark, soft fills'],
  ['mint-50', 'Light "reports" section'],
  ['sun-400', 'Sunrise gold: highlights, badges'],
  ['sun-700', 'Gold as text on cream'],
  ['clay-500', 'Red soil: decorative accents'],
  ['clay-700', 'Clay as text'],
  ['cream-50', 'Page background'],
  ['sand-100', 'Soft cards'],
  ['white', 'Floating cards, fields'],
  ['ink-900', 'Body & headings'],
  ['ink-500', 'Muted body'],
];

const PAIRS = [
  ['ink-900', 'cream-50', 'Body text'],
  ['ink-500', 'cream-50', 'Muted text'],
  ['leaf-600', 'cream-50', 'Green text / links'],
  ['white', 'leaf-600', 'Primary button'],
  ['forest-900', 'sage-300', 'Soft button'],
  ['cream-50', 'forest-900', 'Text on dark'],
  ['sage-300', 'forest-900', 'Handwriting on dark'],
  ['sun-700', 'cream-50', 'Gold text'],
  ['clay-700', 'cream-50', 'Clay text / errors'],
  ['ink-900', 'sun-400', 'Gold chip'],
  ['clay-500', 'cream-50', 'Decorative script (large only)'],
];

/** @param {string} id */
const demo = (id) => `#${id}`;

/** @param {import('../../../tools/build.mjs').RenderContext} ctx */
export function render(ctx) {
  const { data, tokens, site } = ctx;
  const t = (/** @type {string} */ name) => tokens[`--${name}`];
  const stats = data.stats.stats;
  const stat = (/** @type {string} */ id) => stats.find((/** @type {any} */ s) => s.id === id);
  const home = Object.fromEntries(data.home.sections.map((/** @type {any} */ s) => [s.id, s]));
  const programmes = data.programmes.programmes;
  const ways = data.involve.ways;
  const stories = data.stories.stories;

  return html`
    <section class="sg-intro" aria-labelledby="sg-title">
      <div class="container stack">
        <p class="eyebrow">Design system · A2</p>
        <h1 id="sg-title">Styleguide</h1>
        ${scriptLine({ text: 'play · hope · faith', swoosh: 'underline', size: 'lg' })}
        <p class="lead">Every colour, type style, component and motion pattern used on the Kingdom Love Springs website. Calm, spacious layouts in warm Kenyan greens and sunrise gold. Examples that aren’t real data are labelled <strong>Example</strong>.</p>
        <nav aria-label="Styleguide sections">
          <ul class="sg-toc" role="list">${TOC.map(([id, label]) => html`<li><a href="#${id}">${label}</a></li>`)}</ul>
        </nav>
      </div>
    </section>

    <!-- ── Colour ─────────────────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-colour" aria-labelledby="sg-colour-t">
      <div class="container">
        ${sectionHeader({ eyebrow: 'Colour', title: 'Green, warm, hopeful Kenya', id: 'sg-colour-t', lead: 'Placeholder brand until the KLS logo and colours arrive; the swap happens in tokens.css only.' })}
        <ul class="sg-palette" role="list">
          ${PALETTE.map(
            ([name, role]) => html`<li class="sg-chipcard">
              <span class="sg-chipcard__swatch" style="--swatch: var(--${name})"></span>
              <span class="sg-chipcard__label"><code>--${name}</code><span class="sg-mono">${t(name)}</span><span class="text-muted">${role}</span></span>
            </li>`,
          )}
        </ul>
        <h3 class="sg-subtitle">Contrast (WCAG 2.2, computed from tokens)</h3>
        <div class="sg-table-wrap">
          <table class="sg-table">
            <thead><tr><th scope="col">Pair</th><th scope="col">Use</th><th scope="col">Ratio</th><th scope="col">Result</th></tr></thead>
            <tbody>
              ${PAIRS.map(([fg, bg, use]) => {
                const ratio = contrast(t(fg), t(bg));
                const verdict = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large / UI' : 'Decorative only';
                return html`<tr>
                  <td><span class="sg-pair" style="--pair-fg: var(--${fg}); --pair-bg: var(--${bg})">Aa</span> <code>${fg}</code> on <code>${bg}</code></td>
                  <td>${use}</td>
                  <td class="sg-mono">${ratio.toFixed(2)}:1</td>
                  <td>${verdict}</td>
                </tr>`;
              })}
            </tbody>
          </table>
        </div>
        <p class="sg-note">${icon('info')}Rules: white text only on forest-900/700 and leaf-600. Never white on sun, clay or leaf-500. Gold and clay are accents, not large fills (except small chips with dark text).</p>
      </div>
    </section>

    <!-- ── Type ───────────────────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-type" aria-labelledby="sg-type-t" data-surface="sand">
      <div class="container">
        ${sectionHeader({ eyebrow: 'Typography', title: 'General Sans, with handwriting for decoration', id: 'sg-type-t' })}
        <dl class="sg-type">
          <div><dt>Hero · clamp(2.75rem, 6vw, 5.25rem) · 500</dt><dd class="sg-type__hero">Every child deserves the chance.</dd></div>
          <div><dt>H2 · clamp(2rem, 4vw, 3.25rem) · 500</dt><dd class="sg-type__h2">Thrive in school, in life and in faith</dd></div>
          <div><dt>H3 · 1.5rem · 500</dt><dd class="sg-type__h3">Education &amp; Sponsorship</dd></div>
          <div><dt>Lead · clamp(1.1875rem, 1.6vw, 1.375rem)</dt><dd class="lead">${data.programmes.vision}</dd></div>
          <div><dt>Body · 1.0625rem / 1.65</dt><dd>${programmes[0].body}</dd></div>
          <div><dt>Small · .875rem</dt><dd><small>Regions only, never exact locations.</small></dd></div>
          <div><dt>Eyebrow · .75rem uppercase, tracking .12em</dt><dd><span class="eyebrow">Our stories</span></dd></div>
          <div><dt>Script · Ms Madi (decorative only)</dt><dd><span class="script sg-type__script" aria-hidden="true">from struggle to purpose</span><span class="sr-only">from struggle to purpose</span></dd></div>
        </dl>
      </div>
    </section>

    <!-- ── Script draw-on ─────────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-script" aria-labelledby="sg-script-t">
      <div class="container">
        ${sectionHeader({ eyebrow: 'Signature effect', title: 'Handwriting that draws itself', id: 'sg-script-t', lead: 'scriptLine({ text, swoosh, size, color, label }): the words are revealed by a zig-zag pen path (not a wipe), then a tapered swoosh strokes out. Once, when 40% visible.' })}
        <div class="sg-decision" data-surface="mint">
          <p class="eyebrow">Script font decision (final)</p>
          <p><strong>Ms Madi</strong> (SIL OFL). Compared with Allison and Mrs Saint Delafield over photos and on forest-900: it has the slanted, flowing energy closest to Genocide Edu’s brush-pen hand, a larger x-height and stroke weight that stay legible over photographs, and the clearest numerals for the pill band. Mrs Saint Delafield was more brush-like but crowded (“light&amp;salt”) and less legible; Allison was too thin at display sizes.</p>
        </div>
        <div class="sg-script-grid">
          <div class="sg-script-panel" data-surface="cream" id="sg-script-light">
            <p class="sg-label">On cream · clay</p>
            ${PHRASES.map(([text, swoosh]) => html`<div class="sg-script-item"><span class="sg-label">${swoosh}</span>${scriptLine({ text, swoosh, size: 'lg', label: text })}</div>`)}
          </div>
          <div class="sg-script-panel" data-surface="forest" id="sg-script-dark">
            <p class="sg-label">On forest-900 · sage</p>
            ${PHRASES.map(([text, swoosh]) => html`<div class="sg-script-item"><span class="sg-label">${swoosh}</span>${scriptLine({ text, swoosh, size: 'lg', label: text })}</div>`)}
          </div>
          <div class="sg-script-panel photo-panel" data-surface="photo" id="sg-script-photo">
            <div class="photo-panel__media">${placeholderImage('portrait')}</div>
            <p class="sg-label">Over a photo · sun</p>
            ${PHRASES.map(([text, swoosh]) => html`<div class="sg-script-item"><span class="sg-label">${swoosh}</span>${scriptLine({ text, swoosh, size: 'lg', label: text })}</div>`)}
          </div>
        </div>
        <div class="cluster sg-actions">
          <button class="btn btn--outline btn--sm" type="button" data-replay="#sg-script-light">${icon('play')}Replay cream</button>
          <button class="btn btn--outline btn--sm" type="button" data-replay="#sg-script-dark">${icon('play')}Replay forest</button>
          <button class="btn btn--outline btn--sm" type="button" data-replay="#sg-script-photo">${icon('play')}Replay photo</button>
        </div>
      </div>
    </section>

    <!-- ── Buttons ─────────────────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-buttons" aria-labelledby="sg-buttons-t">
      <div class="container">
        ${sectionHeader({ eyebrow: 'Buttons', title: 'Pills with icons', id: 'sg-buttons-t', lead: 'Primary (leaf), soft (sage, like Genocide Edu’s Donate), outline and link. All 48px tall by default, with a visible focus ring.' })}
        <div class="sg-row">
          ${button({ label: 'Sponsor a child', href: demo('sg-buttons'), iconStart: 'heart' })}
          ${button({ label: 'See our work', href: demo('sg-buttons'), variant: 'soft', icon: 'arrow-right' })}
          ${button({ label: 'Get involved', href: demo('sg-buttons'), variant: 'outline' })}
          ${button({ label: 'Learn about our approach', href: demo('sg-buttons'), variant: 'link', icon: 'arrow-right' })}
        </div>
        <div class="sg-row">
          ${button({ label: 'Small', href: demo('sg-buttons'), size: 'sm', icon: 'arrow-right' })}
          ${button({ label: 'Medium', href: demo('sg-buttons') })}
          ${button({ label: 'Large', href: demo('sg-buttons'), size: 'lg', iconStart: 'heart' })}
          ${button({ label: 'Button element', type: 'button', variant: 'soft', iconStart: 'send' })}
          <a class="link-arrow" href="#sg-buttons">See tournaments${icon('arrow-right')}</a>
        </div>
      </div>
    </section>

    <!-- ── Surfaces matrix ─────────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-surfaces" aria-labelledby="sg-surfaces-t">
      <div class="container">
        ${sectionHeader({ eyebrow: 'Surfaces', title: 'Every component on every surface', id: 'sg-surfaces-t', lead: 'data-surface="cream | sand | mint | white | forest | photo" remaps --bg, --fg, --muted, --accent, --line (and raised/invert colours). No component needs a modifier.' })}
        <div class="sg-surfaces">
          ${SURFACES.map(
            (s) => html`<div class="sg-surface${s === 'photo' ? ' photo-panel' : ''}" data-surface="${s}">
              ${s === 'photo' ? html`<div class="photo-panel__media">${placeholderImage('landscape')}</div>` : ''}
              <p class="eyebrow">data-surface="${s}"</p>
              <h3>Walk alongside a child</h3>
              <p class="text-muted">Our team regularly visits their schools and meets them during school holidays.</p>
              <div class="sg-row">
                ${button({ label: 'Sponsor', href: demo('sg-surfaces'), iconStart: 'heart', size: 'sm' })}
                ${button({ label: 'Pray', href: demo('sg-surfaces'), variant: 'soft', size: 'sm' })}
                ${button({ label: 'Volunteer', href: demo('sg-surfaces'), variant: 'outline', size: 'sm' })}
                ${button({ label: 'More', href: demo('sg-surfaces'), variant: 'link', icon: 'arrow-right', size: 'sm' })}
              </div>
              <div class="sg-row">${chip('Nairobi', { dot: true })}${chip('35 children', { tone: 'sun' })}${chip('Sports', { tone: 'sage' })}${chip('Coast', { tone: 'clay' })}</div>
              <div class="soft-cards sg-mini-cards">
                ${softCard({ icon: 'hand-heart', title: 'Pray with us', text: 'Hover or focus me: I invert.', cta: { label: 'Pray', href: demo('sg-surfaces') } })}
                ${docCard({ href: demo('sg-surfaces'), type: 'PDF', title: 'Example document', date: '2026-11-10', dateLabel: formatDate('2026-11-10') })}
              </div>
              ${textField({ id: `sg-surface-${s}-email`, label: 'Email', type: 'email', hint: 'We’ll only use it to reply.', autocomplete: 'email' })}
              ${faqList([{ id: `sg-${s}`, question: data.faqs.faqs[0].question, answer: data.faqs.faqs[0].answer }])}
              ${scriptLine({ text: 'walk alongside', swoosh: 'underline', size: 'md' })}
            </div>`,
          )}
        </div>
      </div>
    </section>

    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-header" aria-labelledby="sg-header-t">
      <div class="container">
        ${sectionHeader({ eyebrow: 'Header', title: 'Transparent over photos, solid after scrolling', id: 'sg-header-t', lead: 'Left: logo. Centre-left: links. Right: Contact | Sponsor a child. Below 64rem: a full-screen forest menu with a focus trap and Esc to close. (On the live site, links appear only once their page exists.)' })}
        <p class="sg-label">Overlay variant (over the hero photo)</p>
        <div class="sg-frame photo-panel" data-surface="photo">
          <div class="photo-panel__media">${placeholderImage('hero')}</div>
          ${header(ctx, { variant: 'overlay', demo: true, demoHref: '#sg-header', idPrefix: 'sg-overlay' })}
        </div>
        <p class="sg-label">Solid variant (sticky; also the overlay's scrolled state)</p>
        <div class="sg-frame sg-frame--solid">
          ${header(ctx, { variant: 'solid', demo: true, demoHref: '#sg-header', idPrefix: 'sg-solid' })}
        </div>
        <p class="sg-note">${icon('info')}Narrow your window below 64rem (1024px) and use the menu button in either example to try the mobile menu.</p>
      </div>
    </section>

    <!-- ── Hero ───────────────────────────────────────────────────────────── -->
    <section class="sg-section sg-section--flush" id="sg-hero" aria-label="Hero example">
      ${photoHero({
        id: 'sg-hero-title',
        headingLevel: 2,
        lines: ['Every child deserves the chance', 'to move from struggle to purpose.'],
        subline: home.hero.subline,
        media: placeholderImage('hero', { alt: '' }),
        script: scriptLine({ text: home.hero.script, swoosh: 'rise', size: 'hero', color: 'sun' }),
        buttons: [
          { label: home.hero.buttons[0].label, href: demo('sg-hero'), icon: 'heart' },
          { label: home.hero.buttons[1].label, href: demo('sg-hero'), icon: 'arrow-right', variant: 'outline' },
        ],
        badges: home.hero.badges,
        floatCard: floatCard({
          eyebrow: site.name,
          meta: 'Sponsorship',
          title: home.hero.floatCard.title,
          text: home.hero.floatCard.text,
          cta: { label: home.hero.floatCard.button.label, href: demo('sg-hero') },
        }),
      })}
      <div class="container cluster sg-actions"><button class="btn btn--outline btn--sm" type="button" data-replay="#sg-hero">${icon('play')}Replay hero</button></div>
    </section>

    <!-- ── Outline circles ────────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-circles" aria-labelledby="sg-circles-t">
      <div class="container">
        ${sectionHeader({ eyebrow: 'What we do', title: 'Outline circles that reveal a photo', id: 'sg-circles-t', lead: 'Hover, focus (Tab) or tap: the circle fills with a photo from the centre and the label turns into handwriting. Each one is a link.' })}
        ${outlineCircles({
          items: home['what-we-do'].circles.map((/** @type {string} */ label, /** @type {number} */ i) => ({
            label,
            href: demo('sg-circles'),
            media: placeholderImage(i % 2 ? 'square' : 'portrait'),
          })),
        })}
        <div class="cluster sg-actions"><button class="btn btn--outline btn--sm" type="button" data-replay="#sg-circles">${icon('play')}Replay outline draw</button></div>
      </div>
    </section>

    <!-- ── Cards ──────────────────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-cards" aria-labelledby="sg-cards-t">
      <div class="container">
        ${sectionHeader({ eyebrow: 'How you can help', title: 'Soft cards that invert', id: 'sg-cards-t', lead: 'The middle card starts dark and hands its dark state to whichever card you hover or focus.' })}
        <div class="soft-cards">
          ${ways.slice(0, 3).map((/** @type {any} */ w, /** @type {number} */ i) =>
            softCard({ icon: w.icon, title: w.title, text: w.text, cta: { label: w.cta.label, href: demo('sg-cards') }, featured: i === 1 }),
          )}
        </div>
        <h3 class="sg-subtitle">Float card (CareNest)</h3>
        <div class="sg-float-demo photo-panel" data-surface="photo">
          <div class="photo-panel__media">${placeholderImage('landscape')}</div>
          ${floatCard({ eyebrow: site.name, meta: 'Sponsorship', title: home.hero.floatCard.title, text: home.hero.floatCard.text, cta: { label: 'Sponsor a child', href: demo('sg-cards') } })}
        </div>
      </div>
    </section>

    <!-- ── Stories ─────────────────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-stories" aria-labelledby="sg-stories-t">
      <div class="container sg-split">
        <div>
          ${sectionHeader({ eyebrow: 'Our stories', title: home.stories.intro, id: 'sg-stories-t' })}
        </div>
        <div class="story-rows">
          ${stories.map((/** @type {any} */ s) =>
            storyRow({
              href: demo('sg-stories'),
              title: s.title.replace(/\s*\[CONFIRM[^\]]*\]/, ''),
              excerpt: s.excerpt,
              author: 'Kingdom Love Springs',
              date: s.date,
              dateLabel: formatDate(s.date),
              readTime: readingTime(s.body.map((/** @type {any} */ b) => b.text).join(' ')),
              thumb: placeholderImage('square'),
              programme: programmes.find((/** @type {any} */ p) => p.id === s.programme)?.title,
            }),
          )}
        </div>
      </div>
    </section>

    <!-- ── Programme rows ──────────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-programmes" aria-labelledby="sg-programmes-t" data-surface="mint">
      <div class="container">
        ${sectionHeader({ eyebrow: 'Programmes', title: 'Alternating programme rows', id: 'sg-programmes-t' })}
        <div class="programme-rows">
          ${programmes.map((/** @type {any} */ p, /** @type {number} */ i) =>
            programmeRow({
              id: `sg-prog-${p.id}`,
              icon: p.icon,
              eyebrow: 'Programme',
              title: p.title,
              text: p.summary,
              media: placeholderImage('landscape'),
              cta: { label: 'Learn more', href: demo('sg-programmes') },
              reverse: i % 2 === 1,
            }),
          )}
        </div>
      </div>
    </section>

    <!-- ── Bento ───────────────────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-bento" aria-labelledby="sg-bento-t">
      <div class="container">
        ${sectionHeader({ eyebrow: 'Our impact', title: 'Bento grid', id: 'sg-bento-t', lead: 'Numbers come only from data/stats.json.' })}
        ${bento({
          tiles: [
            { type: 'photo', media: placeholderImage('portrait') },
            { type: 'number', value: stat('children').display, label: stat('children').label, detail: 'ages 7–17' },
            { type: 'value', icon: 'heart-handshake', title: home['impact-bento'].values[0], text: 'Our team regularly visits their schools and meets them during school holidays, walking alongside their families.' },
            { type: 'number', value: stat('per-gathering').display, label: stat('per-gathering').label, detail: stat('per-gathering').detail },
            { type: 'number', value: stat('per-year').display, label: stat('per-year').label, detail: stat('per-year').detail },
            { type: 'value', icon: 'church', title: home['impact-bento'].values[1], text: 'The Gospel shared through sports and relationships.' },
            { type: 'number', value: stat('regions').display, label: stat('regions').label, detail: stat('regions').detail },
            { type: 'photo', media: placeholderImage('square') },
          ],
        })}
      </div>
    </section>

    <!-- ── Pill band ───────────────────────────────────────────────────────── -->
    <div class="sg-section sg-section--flush" id="sg-band">
      ${pillBand({ stats: home['numbers-band'].stats.map((/** @type {string} */ id) => stat(id)), id: 'sg-band-t' })}
      <div class="container cluster sg-actions"><button class="btn btn--outline btn--sm" type="button" data-replay="#sg-band">${icon('play')}Replay count-up</button></div>
    </div>

    <!-- ── Collage + journey ──────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-collage" aria-labelledby="sg-collage-t">
      <div class="container sg-split">
        ${photoCollage({
          main: placeholderImage('portrait'),
          round: placeholderImage('square'),
          chip: { value: stat('per-gathering').display, text: 'at every tournament', icon: 'trophy' },
        })}
        <div class="stack">
          ${sectionHeader({ eyebrow: 'Sports ministry', title: 'Photo collage', id: 'sg-collage-t', lead: programmes[1].summary })}
          <div class="cluster">${data.regions.regions.map((/** @type {any} */ r) => chip(r.name, { icon: 'map-pin' }))}</div>
          <h3 class="sg-subtitle">Journey bar</h3>
          <p class="text-muted">Only rendered when a real, confirmed value exists. Example only (not real data):</p>
          ${journeyBar({ label: 'Example: school fees covered this term', value: 80, goalLabel: 'Example goal' })}
          <p class="sg-label">journeyBar({ value: null }) renders nothing:</p>
          <div class="sg-empty">${journeyBar({ label: 'Unconfirmed', value: null }) || raw('<span class="text-muted">(nothing rendered)</span>')}</div>
        </div>
      </div>
    </section>

    <!-- ── Quote band ──────────────────────────────────────────────────────── -->
    <div class="sg-section sg-section--flush" id="sg-quote">
      ${quoteBand({
        id: 'sg-quote-t',
        quote: 'Ye are the light of the world. A city that is set on an hill cannot be hid.',
        cite: home.quote.reference.replace('–16', ''),
        citeDetail: 'Example (KJV). Verse and translation to be confirmed',
        script: home.quote.script,
      })}
    </div>

    <!-- ── Map circle ──────────────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-map" aria-label="Map circle example">
      <div class="container">
        ${mapCircle({ regions: data.regions.regions, title: home.map.title, script: home.map.script, id: 'sg-map-t', lead: 'Football tournaments and clinics across Nairobi, Western Kenya and the Coast.' })}
        <div class="cluster sg-actions"><button class="btn btn--outline btn--sm" type="button" data-replay="#sg-map">${icon('play')}Replay map</button></div>
      </div>
    </section>

    <!-- ── Docs & people ───────────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-docs" aria-labelledby="sg-docs-t" data-surface="mint">
      <div class="container">
        ${sectionHeader({ eyebrow: 'Reports & updates', title: 'Document cards', id: 'sg-docs-t', lead: 'Example cards: real documents only if KLS has them [to be confirmed].' })}
        <div class="docs">
          ${docCard({ href: demo('sg-docs'), type: 'PDF', size: 'Example', title: 'Example: annual report', date: '2026-11-10', dateLabel: formatDate('2026-11-10') })}
          ${docCard({ href: demo('sg-docs'), type: 'PDF', size: 'Example', title: 'Example: termly newsletter', date: '2026-11-10', dateLabel: formatDate('2026-11-10') })}
          ${docCard({ href: demo('sg-docs'), type: 'PDF', size: 'Example', title: 'Example: tournament update', date: '2026-11-10', dateLabel: formatDate('2026-11-10') })}
        </div>
        <h3 class="sg-subtitle">Person circle (adults only)</h3>
        <div class="sg-row sg-row--top">
          ${personCircle({ media: placeholderImage('square'), name: 'Example name', role: 'Example role' })}
          ${personCircle({ media: placeholderImage('square'), name: 'Example name', role: 'Example role' })}
        </div>
        ${personCircle({ size: 'lg', media: placeholderImage('portrait'), name: 'Example: founder', role: 'Founder', text: data.programmes.approach.belief })}
      </div>
    </section>

    <!-- ── Small UI ────────────────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-ui" aria-labelledby="sg-ui-t">
      <div class="container">
        ${sectionHeader({ eyebrow: 'Small UI', title: 'Chips, FAQ, breadcrumbs, share, pagination, toast', id: 'sg-ui-t' })}
        <div class="sg-ui-grid">
          <div class="stack">
            <p class="sg-label">Chips & badges</p>
            <div class="cluster">
              ${chip('Nairobi · Western · Coast', { dot: true })}
              ${chip('35 children sponsored', { tone: 'sun' })}
              ${chip('Football', { tone: 'sage', icon: 'trophy' })}
              ${chip('Draft', { tone: 'clay' })}
            </div>
            <div class="sg-glass photo-panel" data-surface="photo">
              <div class="photo-panel__media">${placeholderImage('landscape')}</div>
              <div class="cluster">${home.hero.badges.map((/** @type {string} */ b) => chip(b, { tone: 'glass', dot: true }))}</div>
            </div>
            <p class="sg-label">Breadcrumbs</p>
            ${breadcrumbs([{ label: 'Home', href: '/' }, { label: 'Styleguide', href: '/styleguide/' }, { label: 'Small UI' }])}
            <p class="sg-label">Share row</p>
            ${shareRow({ url: absoluteUrl(site.url, '/styleguide/'), title: `${site.name}: styleguide` })}
            <p class="sg-label">Pagination</p>
            ${pagination({ current: 2, total: 4, href: () => '/styleguide/#sg-ui' })}
            <p class="sg-label">Toast</p>
            <div class="cluster">
              <button class="btn btn--soft btn--sm" type="button" data-toast-demo="Thank you. Your message is ready to send.">${icon('check')}Show a toast</button>
            </div>
          </div>
          <div class="stack">
            <p class="sg-label">FAQ accordion (native details: works without JS)</p>
            ${faqList(data.faqs.faqs.filter((/** @type {any} */ f) => !f.draft))}
          </div>
        </div>
      </div>
    </section>

    <!-- ── Forms ───────────────────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-forms" aria-labelledby="sg-forms-t" data-surface="sand">
      <div class="container">
        ${sectionHeader({ eyebrow: 'Forms', title: 'Fields in every state', id: 'sg-forms-t', lead: 'Real labels, hints and errors linked to the field, aria-invalid on error, 48px targets. Forms never ask about children.' })}
        ${stepsIndicator({ steps: ['About you', 'How you’d like to help', 'Your message', 'Send'], current: 2, label: 'Sponsorship enquiry progress (example)' })}
        <div class="sg-forms">
          <form class="form" action="#sg-forms" novalidate>
            ${errorSummary({ errors: [{ href: '#sg-f-email-err', text: 'Enter an email address in the correct format, like name@example.com' }, { href: '#sg-f-help-err-sponsor', text: 'Choose how you’d like to help' }], id: 'sg-error-summary' })}
            ${textField({ id: 'sg-f-name', label: 'Your name', required: true, autocomplete: 'name' })}
            ${textField({ id: 'sg-f-phone', label: 'Phone or WhatsApp', hint: 'Include your country code, e.g. +254.', type: 'tel', inputmode: 'tel', autocomplete: 'tel' })}
            ${textField({ id: 'sg-f-email-err', label: 'Email', type: 'email', required: true, value: 'name@', error: 'Enter an email address in the correct format, like name@example.com', autocomplete: 'email' })}
            ${textField({ id: 'sg-f-disabled', label: 'Disabled field', value: 'Not editable', disabled: true })}
            ${selectField({ id: 'sg-f-region', label: 'Where are you?', options: [{ value: '', label: 'Choose…' }, { value: 'kenya', label: 'In Kenya' }, { value: 'abroad', label: 'Outside Kenya' }] })}
            ${textArea({ id: 'sg-f-msg', label: 'Your message', hint: 'Please don’t include any information about children.' })}
          </form>
          <div class="form">
            ${radioCards({
              name: 'sg-f-help',
              legend: 'How would you like to help?',
              hint: 'Choose one.',
              value: 'pray',
              options: ways.slice(0, 3).map((/** @type {any} */ w) => ({ value: w.id, label: w.title, icon: w.icon })),
            })}
            ${radioCards({
              name: 'sg-f-help-err',
              legend: 'Radio cards with an error',
              required: true,
              error: 'Choose how you’d like to help',
              options: ways.slice(0, 2).map((/** @type {any} */ w) => ({ value: w.id, label: w.title, description: w.text })),
            })}
            ${checkbox({ id: 'sg-f-updates', label: 'Send me occasional updates by email' })}
            ${checkbox({ id: 'sg-f-consent', label: 'I agree that KLS may contact me about my enquiry', checked: true })}
            ${checkbox({ id: 'sg-f-consent-err', label: 'I agree to the privacy notice', required: true, error: 'Tick to confirm you agree' })}
            <div class="cluster">
              ${button({ label: 'Continue', type: 'button', icon: 'arrow-right' })}
              ${button({ label: 'Back', type: 'button', variant: 'outline', iconStart: 'chevron-left' })}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Motion lab ──────────────────────────────────────────────────────── -->
    <section class="sg-section" id="sg-motion" aria-labelledby="sg-motion-t" data-surface="forest">
      <div class="container">
        ${sectionHeader({ eyebrow: 'Motion lab', title: 'Gentle and joyful, never in the way', id: 'sg-motion-t', lead: 'GSAP + ScrollTrigger, all inside gsap.matchMedia(). With reduced motion everything shows in its final state instantly: no loops, scrubs or draws. Without JS, everything is visible.' })}
        <div class="sg-row">
          <button class="btn btn--soft" type="button" data-reduce-toggle aria-pressed="false">${icon('sparkles')}Reduce motion</button>
          <button class="btn btn--outline btn--sm" type="button" data-replay="#sg-script-light">${icon('play')}Script (cream)</button>
          <button class="btn btn--outline btn--sm" type="button" data-replay="#sg-hero">${icon('play')}Hero</button>
          <button class="btn btn--outline btn--sm" type="button" data-replay="#sg-circles">${icon('play')}Circles</button>
          <button class="btn btn--outline btn--sm" type="button" data-replay="#sg-band">${icon('play')}Pill band</button>
          <button class="btn btn--outline btn--sm" type="button" data-replay="#sg-map">${icon('play')}Map</button>
          <button class="btn btn--outline btn--sm" type="button" data-replay="#sg-motion-lab">${icon('play')}Lab lines</button>
        </div>
        <div class="sg-lab" id="sg-motion-lab">
          ${PHRASES.slice(0, 4).map(([text, swoosh]) => html`<div><p class="sg-label">${swoosh}</p>${scriptLine({ text, swoosh, size: 'lg', label: text })}</div>`)}
        </div>
        <table class="sg-table sg-table--dark">
          <thead><tr><th scope="col">#</th><th scope="col">Effect</th><th scope="col">Module</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Script draw-on: pen-path mask + tapered swoosh, once at 40% visible</td><td><code>motion/script-draw.js</code></td></tr>
            <tr><td>2</td><td>Hero: photo 1.08 → 1, headline lines rise, then the script</td><td><code>motion/hero.js</code></td></tr>
            <tr><td>3</td><td>Circles: outlines draw in sequence; hover/focus clip-path reveal</td><td><code>motion/circles.js</code> + CSS</td></tr>
            <tr><td>4</td><td>Pill band: scrubbed scale + radius, count-up with gold strokes</td><td><code>motion/pill-band.js</code></td></tr>
            <tr><td>5</td><td>Cards: invert .35s + 4px lift; story rows soften</td><td>CSS</td></tr>
            <tr><td>6</td><td>Section reveals: fade + 24px rise, batched</td><td><code>motion/reveal.js</code></td></tr>
            <tr><td>7</td><td>Quote band: top radius 80 → 48px (scrubbed)</td><td><code>motion/quote-band.js</code></td></tr>
            <tr><td>8</td><td>Map: circle scales in, outline draws, dots pulse (paused off-screen)</td><td><code>motion/map.js</code></td></tr>
            <tr><td>9</td><td>Floating cards: 6px loop, paused off-screen</td><td><code>motion/float.js</code></td></tr>
            <tr><td>10</td><td>Header fade-in; page-to-page view transitions</td><td><code>motion/hero.js</code> + CSS</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}
