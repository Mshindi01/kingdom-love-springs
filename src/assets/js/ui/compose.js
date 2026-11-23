// @ts-check
/**
 * Backend-free forms (CLAUDE.md §2.4): `<form data-compose="email|whatsapp" data-to="…">`.
 * On submit: validate (accessible inline errors, focus the first problem), compose a message
 * from the labelled fields, open the user's email app / WhatsApp, then show the form's
 * confirmation panel ([data-compose-done], the next sibling).
 * Without JS, email forms fall back to a plain mailto: post.
 *
 * TODO(part-c): POST to /api/<form> instead (C3/C4), keeping WhatsApp as an option.
 */

const ICON = (/** @type {string} */ name) => {
  const sprite = document.querySelector('svg.icon use')?.getAttribute('href')?.split('#')[0] ?? '';
  return `<svg class="icon" aria-hidden="true" focusable="false"><use href="${sprite}#${name}"></use></svg>`;
};

/** @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} field */
function labelFor(field) {
  // Radio groups: the question (legend) is the label, the chosen value is the answer
  if (field instanceof HTMLInputElement && field.type === 'radio') {
    return (field.closest('fieldset')?.querySelector('legend')?.textContent || field.name).trim();
  }
  const label = field.id ? document.querySelector(`label[for="${field.id}"]`) : null;
  return (label?.childNodes[0]?.textContent || field.name || '').trim();
}

/**
 * Two-step forms (form[data-choice="<radio group name>"]): a field inside
 * [data-panel="<radio id>"] only counts when that radio is checked.
 * @param {HTMLFormElement} form @param {Element} el
 */
function inActivePanel(form, el) {
  const group = form.dataset.choice;
  const panel = group ? el.closest('[data-panel]') : null;
  if (!panel) return true;
  const chosen = /** @type {HTMLInputElement | null} */ (form.querySelector(`input[type="radio"][name="${CSS.escape(group || '')}"]:checked`));
  return chosen?.id === /** @type {HTMLElement} */ (panel).dataset.panel;
}

/** @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} field @param {string | null} message */
function setError(field, message) {
  const wrap = field.closest('.field');
  const id = `${field.id}-error`;
  let el = document.getElementById(id);
  const describedBy = new Set((field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
  if (message) {
    if (!el) {
      el = document.createElement('p');
      el.className = 'field__error';
      el.id = id;
      field.before(el);
    }
    el.innerHTML = `${ICON('info')}<span><span class="sr-only">Error: </span></span>`;
    el.querySelector('span')?.append(message);
    field.setAttribute('aria-invalid', 'true');
    describedBy.add(id);
    wrap?.classList.add('field--error');
  } else {
    el?.remove();
    field.removeAttribute('aria-invalid');
    describedBy.delete(id);
    wrap?.classList.remove('field--error');
  }
  if (describedBy.size) field.setAttribute('aria-describedby', [...describedBy].join(' '));
  else field.removeAttribute('aria-describedby');
}

/** @param {HTMLFormElement} form */
function fields(form) {
  return /** @type {(HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[]} */ (
    [...form.elements].filter(
      (el) => 'value' in el && el.tagName !== 'BUTTON' && /** @type {any} */ (el).name && !(/** @type {any} */ (el).disabled) && inActivePanel(form, el),
    )
  );
}

/**
 * Preselect a two-step form's reason from the URL, e.g. /contact/#reason-volunteer, so
 * "Volunteer with us" links elsewhere land on step 2. Runs even before KLS's details are
 * confirmed (the steps themselves are CSS).
 */
export function initChoice() {
  const apply = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const radio = document.getElementById(id);
    if (!(radio instanceof HTMLInputElement) || radio.type !== 'radio' || !radio.closest('form[data-choice]')) return;
    radio.checked = true;
    radio.closest('.compose')?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  apply();
  window.addEventListener('hashchange', apply);
}

export function initCompose() {
  document.querySelectorAll('form[data-compose]').forEach((node) => {
    const form = /** @type {HTMLFormElement} */ (node);
    const toEmail = form.dataset.toEmail || (form.dataset.compose === 'email' ? form.dataset.to : '');
    const toWhatsapp = form.dataset.toWhatsapp || (form.dataset.compose === 'whatsapp' ? form.dataset.to : '');
    if (!toEmail && !toWhatsapp) return; // disabled until KLS's details are confirmed
    form.noValidate = true;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Which button was pressed (data-compose="auto" forms offer both channels)
      const via = /** @type {HTMLButtonElement | null} */ (/** @type {SubmitEvent} */ (e).submitter)?.value || (toWhatsapp && !toEmail ? 'whatsapp' : 'email');
      let firstInvalid = null;
      for (const f of fields(form)) {
        const ok = f.checkValidity();
        setError(f, ok ? null : f.dataset.error || f.validationMessage);
        if (!ok && !firstInvalid) firstInvalid = f;
      }
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const lines = [form.dataset.intro || '', ''];
      for (const f of fields(form)) {
        if (f instanceof HTMLInputElement && (f.type === 'checkbox' || f.type === 'radio') && !f.checked) continue;
        if (f.value.trim()) lines.push(`${labelFor(f)}: ${f.value.trim()}`);
      }
      const body = lines.join('\n').trim();
      const href =
        via === 'whatsapp'
          ? `https://wa.me/${toWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(body)}`
          : `mailto:${toEmail}?subject=${encodeURIComponent(form.dataset.subject || '')}&body=${encodeURIComponent(body)}`;

      window.location.href = href;

      const next = form.nextElementSibling;
      const done = /** @type {HTMLElement | null} */ (next && next.matches('[data-compose-done]') ? next : null);
      if (done) {
        form.hidden = true;
        done.hidden = false;
        done.focus();
      }
    });

    // Clear an error as soon as the field becomes valid
    form.addEventListener('input', (e) => {
      const f = /** @type {HTMLInputElement} */ (e.target);
      if (f.getAttribute('aria-invalid') === 'true' && f.checkValidity()) setError(f, null);
    });
  });
}
