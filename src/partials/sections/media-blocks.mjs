// @ts-check
/**
 * Photo-led blocks: photo hero (full-bleed + overlay + floating card), photo collage
 * (Unity in Action) and the bento grid (CareNest).
 */
import { html } from '../../lib/html.mjs';
import { icon } from '../icon.mjs';
import { button, chip } from '../ui.mjs';

/**
 * Full-bleed photo hero: overlay, headline lines rising from a mask, script line,
 * buttons, optional floating card + pill badges (CareNest).
 * @param {{ lines: string[], subline?: string, media: unknown, script?: unknown,
 *   buttons?: { label: string, href: string, icon?: string, variant?: 'primary' | 'soft' | 'outline' }[],
 *   floatCard?: unknown, badges?: string[], id?: string, compact?: boolean, headingLevel?: 1 | 2,
 *   layout?: 'split' | 'centered' }} o
 */
export function photoHero({ lines, subline, media, script, buttons = [], floatCard, badges = [], id = 'hero-title', compact = false, headingLevel = 1, layout = 'split' }) {
  const lineHtml = lines.map((l) => html`<span class="hero__line"><span class="hero__line-inner">${l}</span></span> `);
  return html`<section class="hero hero--${layout}${compact ? ' hero--compact' : ''}" data-surface="photo" aria-labelledby="${id}" data-hero>
    <div class="hero__media">${media}</div>
    <div class="container hero__inner">
      <div class="hero__content">
        ${headingLevel === 1
          ? html`<h1 class="hero__title" id="${id}">${lineHtml}</h1>`
          : html`<h2 class="hero__title" id="${id}">${lineHtml}</h2>`}
        ${script ? html`<div class="hero__script">${script}</div>` : ''}
        ${subline ? html`<p class="hero__subline">${subline}</p>` : ''}
        ${buttons.length
          ? html`<div class="cluster hero__buttons">${buttons.map((b, i) =>
              button({ label: b.label, href: b.href, icon: b.icon, variant: b.variant || (i === 0 ? 'primary' : 'outline') }),
            )}</div>`
          : ''}
      </div>
      ${floatCard || badges.length
        ? html`<div class="hero__aside">
            ${badges.length ? html`<ul class="hero__badges" role="list">${badges.map((b) => html`<li>${chip(b, { tone: 'glass', dot: true })}</li>`)}</ul>` : ''}
            ${floatCard || ''}
          </div>`
        : ''}
    </div>
  </section>`;
}

/**
 * Unity-style collage: an organic rounded main photo, a small round photo and a floating
 * chip (a number + text). The chip's number must come from data (stats.json).
 * @param {{ main: unknown, round?: unknown, chip?: { value: string, text: string, icon?: string } }} o
 */
export function photoCollage({ main, round, chip: c }) {
  return html`<div class="collage">
    <div class="collage__main">${main}</div>
    ${round ? html`<div class="collage__round">${round}</div>` : ''}
    ${c
      ? html`<div class="collage__chip" data-float>
          <span class="collage__chip-icon">${icon(c.icon || 'users')}</span>
          <span><span class="collage__chip-value">${c.value}</span><span class="collage__chip-text">${c.text}</span></span>
        </div>`
      : ''}
  </div>`;
}

/**
 * Bento grid (CareNest): 2 photo tiles, number tiles and value cards in a 3-column grid.
 * @param {{ tiles: ({ type: 'photo', media: unknown }
 *   | { type: 'number', value: string, label: string, detail?: string }
 *   | { type: 'value', icon?: string, title: string, text: string })[], label?: string }} o
 */
export function bento({ tiles, label = 'Our impact' }) {
  return html`<ul class="bento" role="list" aria-label="${label}">
    ${tiles.map((t, i) => {
      if (t.type === 'photo') return html`<li class="bento__tile bento__tile--photo bento__tile--${i + 1}">${t.media}</li>`;
      if (t.type === 'number')
        return html`<li class="bento__tile bento__tile--number bento__tile--${i + 1}">
          <p class="bento__value">${t.value}</p>
          <p class="bento__label">${t.label}</p>
          ${t.detail ? html`<p class="bento__detail">${t.detail}</p>` : ''}
        </li>`;
      return html`<li class="bento__tile bento__tile--value bento__tile--${i + 1}">
        ${t.icon ? html`<span class="bento__icon">${icon(t.icon)}</span>` : ''}
        <h3 class="bento__title">${t.title}</h3>
        <p class="bento__text">${t.text}</p>
      </li>`;
    })}
  </ul>`;
}
