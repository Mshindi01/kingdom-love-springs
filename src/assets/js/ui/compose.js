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
  const label = field.id ? document.querySelector(`label[for="${field.id}"]`) : null;
  return (label?.childNodes[0]?.textContent || field.name || '').trim();
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
    [...form.elements].filter((el) => 'value' in el && /** @type {any} */ (el).name && !(/** @type {any} */ (el).disabled))
  );
}

export function initCompose() {
  document.querySelectorAll('form[data-compose]').forEach((node) => {
    const form = /** @type {HTMLFormElement} */ (node);
    if (!form.dataset.to) return; // disabled until the address is confirmed
    form.noValidate = true;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
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
      const to = form.dataset.to || '';
      const href =
        form.dataset.compose === 'whatsapp'
          ? `https://wa.me/${to.replace(/\D/g, '')}?text=${encodeURIComponent(body)}`
          : `mailto:${to}?subject=${encodeURIComponent(form.dataset.subject || '')}&body=${encodeURIComponent(body)}`;

      window.location.href = href;

      const done = /** @type {HTMLElement | null} */ (form.nextElementSibling?.matches('[data-compose-done]') ? form.nextElementSibling : null);
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
