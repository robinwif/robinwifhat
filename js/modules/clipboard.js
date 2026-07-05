import { $$ } from './helpers.js';

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}

function showToast(button) {
  const toast = button.querySelector('.toast');
  if (!toast) return;
  toast.classList.add('is-visible');
  clearTimeout(button._toastTimeout);
  button._toastTimeout = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 1800);
}

export function initClipboardCopy() {
  $$('[data-ca]').forEach((button) => {
    button.addEventListener('click', async () => {
      const text = button.getAttribute('data-ca');
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          fallbackCopy(text);
        }
      } catch {
        try {
          fallbackCopy(text);
        } catch {}
      }
      showToast(button);
    });
  });
}
