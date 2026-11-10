// @ts-check
/**
 * Form fields (A5 builds the real forms on top of these). Accessible by default: real
 * <label>s, hints and errors wired with aria-describedby, aria-invalid on error, visible
 * focus, 48px targets. Never ask about children (SAFEGUARDING §7).
 */
import { html, attrs } from '../../lib/html.mjs';
import { icon } from '../icon.mjs';

/**
 * @typedef {{ id: string, name?: string, label: string, hint?: string, error?: string,
 *   required?: boolean, disabled?: boolean, value?: string, placeholder?: string,
 *   autocomplete?: string }} BaseField
 */

/** @param {BaseField} f */
function describedBy(f) {
  return [f.hint && `${f.id}-hint`, f.error && `${f.id}-error`].filter(Boolean).join(' ') || null;
}

/** @param {BaseField} f */
function labelAndHelp(f) {
  return html`<label class="field__label" for="${f.id}">${f.label}${f.required ? '' : html` <span class="field__optional">(optional)</span>`}</label>
    ${f.hint ? html`<p class="field__hint" id="${f.id}-hint">${f.hint}</p>` : ''}
    ${f.error ? html`<p class="field__error" id="${f.id}-error">${icon('info')}<span><span class="sr-only">Error: </span>${f.error}</span></p>` : ''}`;
}

/** @param {BaseField} f */
const common = (f) => ({
  id: f.id,
  name: f.name || f.id,
  required: f.required,
  disabled: f.disabled,
  placeholder: f.placeholder,
  autocomplete: f.autocomplete,
  'aria-invalid': f.error ? 'true' : null,
  'aria-describedby': describedBy(f),
});

/** @param {BaseField & { type?: string, inputmode?: string }} f */
export function textField(f) {
  return html`<div class="field${f.error ? ' field--error' : ''}">
    ${labelAndHelp(f)}
    <input class="field__input"${attrs({ type: f.type || 'text', inputmode: f.inputmode, value: f.value, ...common(f) })}>
  </div>`;
}

/** @param {BaseField & { rows?: number }} f */
export function textArea(f) {
  return html`<div class="field${f.error ? ' field--error' : ''}">
    ${labelAndHelp(f)}
    <textarea class="field__input field__input--area"${attrs({ rows: f.rows || 5, ...common(f) })}>${f.value || ''}</textarea>
  </div>`;
}

/** @param {BaseField & { options: { value: string, label: string }[] }} f */
export function selectField(f) {
  return html`<div class="field${f.error ? ' field--error' : ''}">
    ${labelAndHelp(f)}
    <span class="field__select">
      <select class="field__input"${attrs(common(f))}>
        ${f.options.map((o) => html`<option${attrs({ value: o.value, selected: o.value === f.value })}>${o.label}</option>`)}
      </select>
      ${icon('chevron-down')}
    </span>
  </div>`;
}

/**
 * Radio cards: a fieldset of large selectable cards.
 * @param {{ name: string, legend: string, hint?: string, error?: string, required?: boolean, value?: string,
 *   options: { value: string, label: string, description?: string, icon?: string }[] }} f
 */
export function radioCards(f) {
  const hintId = f.hint ? `${f.name}-hint` : null;
  const errId = f.error ? `${f.name}-error` : null;
  return html`<fieldset class="field field--group${f.error ? ' field--error' : ''}"${attrs({ 'aria-describedby': [hintId, errId].filter(Boolean).join(' ') || null })}>
    <legend class="field__label">${f.legend}</legend>
    ${f.hint ? html`<p class="field__hint" id="${hintId}">${f.hint}</p>` : ''}
    ${f.error ? html`<p class="field__error" id="${errId}">${icon('info')}<span><span class="sr-only">Error: </span>${f.error}</span></p>` : ''}
    <div class="radio-cards">
      ${f.options.map((o, i) => {
        const id = `${f.name}-${o.value}`;
        return html`<div class="radio-card">
          <input class="radio-card__input" type="radio"${attrs({ id, name: f.name, value: o.value, checked: o.value === f.value, required: f.required && i === 0 })}>
          <label class="radio-card__label" for="${id}">
            ${o.icon ? html`<span class="radio-card__icon">${icon(o.icon)}</span>` : ''}
            <span class="radio-card__title">${o.label}</span>
            ${o.description ? html`<span class="radio-card__desc">${o.description}</span>` : ''}
            <span class="radio-card__check">${icon('check')}</span>
          </label>
        </div>`;
      })}
    </div>
  </fieldset>`;
}

/** @param {BaseField & { checked?: boolean }} f */
export function checkbox(f) {
  return html`<div class="field field--check${f.error ? ' field--error' : ''}">
    <span class="check">
      <input class="check__input" type="checkbox"${attrs({ id: f.id, name: f.name || f.id, checked: f.checked, required: f.required, disabled: f.disabled, 'aria-invalid': f.error ? 'true' : null, 'aria-describedby': describedBy(f) })}>
      <span class="check__box" aria-hidden="true">${icon('check')}</span>
    </span>
    <span>
      <label class="field__label field__label--inline" for="${f.id}">${f.label}</label>
      ${f.hint ? html`<p class="field__hint" id="${f.id}-hint">${f.hint}</p>` : ''}
      ${f.error ? html`<p class="field__error" id="${f.id}-error">${icon('info')}<span><span class="sr-only">Error: </span>${f.error}</span></p>` : ''}
    </span>
  </div>`;
}

/**
 * Steps indicator for multi-step forms.
 * @param {{ steps: string[], current: number, label?: string }} o current is 1-based
 */
export function stepsIndicator({ steps, current, label = 'Progress' }) {
  return html`<nav class="steps" aria-label="${label}">
    <p class="sr-only">Step ${current} of ${steps.length}</p>
    <ol class="steps__list" role="list">
      ${steps.map((s, i) => {
        const n = i + 1;
        const state = n < current ? 'done' : n === current ? 'current' : 'todo';
        return html`<li class="steps__item steps__item--${state}"${attrs({ 'aria-current': state === 'current' ? 'step' : null })}>
          <span class="steps__num" aria-hidden="true">${state === 'done' ? icon('check') : n}</span>
          <span class="steps__label">${s}${state === 'done' ? html`<span class="sr-only"> (completed)</span>` : ''}</span>
        </li>`;
      })}
    </ol>
  </nav>`;
}

/**
 * Error summary at the top of a form (focus it after a failed submit).
 * @param {{ errors: { href: string, text: string }[], id?: string }} o
 */
export function errorSummary({ errors, id = 'error-summary' }) {
  if (!errors.length) return '';
  return html`<div class="error-summary" id="${id}" role="alert" tabindex="-1" aria-labelledby="${id}-title">
    <h2 class="error-summary__title" id="${id}-title">${icon('info')}There ${errors.length === 1 ? 'is a problem' : `are ${errors.length} problems`}</h2>
    <ul role="list">
      ${errors.map((e) => html`<li><a href="${e.href}">${e.text}</a></li>`)}
    </ul>
  </div>`;
}
