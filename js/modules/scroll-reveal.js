import { $$, prefersReducedMotion } from './helpers.js';

export function initScrollReveal() {
  if (prefersReducedMotion()) return;

  const elements = $$('.reveal');
  if (!elements.length || !('IntersectionObserver' in window)) return;

  elements.forEach((el) => {
    const delay = el.getAttribute('data-delay');
    if (delay) el.style.setProperty('--delay', delay);
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}
