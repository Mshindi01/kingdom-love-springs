// @ts-check
/**
 * "What we do" outline circles (Genocide Edu): thin 1px circles with a label. On hover,
 * focus or tap the circle fills with a photo (clip-path grows from the centre) and the label
 * crossfades to handwriting. Each circle is a real link. Touch: first tap reveals, second follows.
 */
import { html } from '../../lib/html.mjs';
import { url } from '../../lib/url.mjs';

/**
 * @param {{ items: { label: string, script?: string, href: string, media: unknown, description?: string }[],
 *   label?: string }} o
 */
export function outlineCircles({ items, label = 'What we do' }) {
  return html`<ul class="circles" role="list" aria-label="${label}" data-circles>
    ${items.map(
      (item) => html`<li class="circles__item">
        <a class="circle" href="${url(item.href)}" data-circle>
          <svg class="circle__ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle cx="50" cy="50" r="49.6" pathLength="1000"></circle></svg>
          <span class="circle__photo" aria-hidden="true">${item.media}</span>
          <span class="circle__label">${item.label}${item.description ? html`<span class="sr-only">: ${item.description}</span>` : ''}</span>
          <span class="circle__script" aria-hidden="true">${item.script || item.label}</span>
        </a>
      </li>`,
    )}
  </ul>`;
}
