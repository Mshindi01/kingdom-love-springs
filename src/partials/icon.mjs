// @ts-check
import { html } from '../lib/html.mjs';
import { asset } from '../lib/url.mjs';

/**
 * Inline reference to a Lucide (or local brand) icon in the sprite.
 * Decorative by default (aria-hidden). Pass a label for a meaningful icon.
 * @param {string} name icon id from src/assets/icons/icons.json
 * @param {{ label?: string, className?: string }} [options]
 */
export function icon(name, { label, className = '' } = {}) {
  const cls = ['icon', `icon--${name}`, className].filter(Boolean).join(' ');
  const href = `${asset('icons/sprite.svg')}#${name}`;
  return label
    ? html`<svg class="${cls}" role="img" aria-label="${label}" focusable="false"><use href="${href}"></use></svg>`
    : html`<svg class="${cls}" aria-hidden="true" focusable="false"><use href="${href}"></use></svg>`;
}
