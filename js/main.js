import { $ } from './modules/helpers.js';
import { initNavbar } from './modules/navbar.js';
import { initClipboardCopy } from './modules/clipboard.js';
import { initScrollReveal } from './modules/scroll-reveal.js';
import { initSound } from './modules/sound.js';

initNavbar();
initClipboardCopy();
initScrollReveal();
initSound();

const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
