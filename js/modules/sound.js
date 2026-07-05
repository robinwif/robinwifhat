import { $ } from './helpers.js';

export function initSound() {
  const audio = $('#site-music');
  const slider = $('#sound-slider');
  if (!audio || !slider) return;

  const toVolume = (value) => Math.pow(Number(value) / 100, 2);

  audio.volume = 1;
  audio.muted = false;

  // Route through Web Audio so volume changes are ramped (avoids the
  // "zipper noise" crackle caused by stepping HTMLMediaElement.volume directly).
  let gainNode = null;
  const setupGain = () => {
    if (gainNode) return gainNode;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    try {
      const ctx = new AudioContextClass();
      const source = ctx.createMediaElementSource(audio);
      gainNode = ctx.createGain();
      gainNode.gain.value = toVolume(slider.value);
      source.connect(gainNode).connect(ctx.destination);
      return gainNode;
    } catch {
      return null;
    }
  };

  const setVolume = (value) => {
    const vol = toVolume(value);
    const node = gainNode || setupGain();
    if (node) {
      const ctx = node.context;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      node.gain.setTargetAtTime(vol, ctx.currentTime, 0.015);
    } else {
      audio.volume = vol;
    }
  };

  setVolume(slider.value);

  // Only real, discrete user-activation events count toward the browser's
  // "sticky activation" requirement — scroll/wheel do not, and attempting
  // ctx.resume() on those silently fails and can stall the retry chain.
  const events = ['pointerdown', 'mousedown', 'touchstart', 'keydown'];

  const clearResumeListeners = () => {
    events.forEach((evt) => document.removeEventListener(evt, resume, { capture: true }));
  };

  const resume = () => {
    const ctx = gainNode && gainNode.context;
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    audio.play().then(clearResumeListeners).catch(() => {});
  };

  const armResumeListeners = () => {
    events.forEach((evt) => document.addEventListener(evt, resume, { passive: true, capture: true }));
  };

  const tryAutoplay = () => {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (gainNode && gainNode.context.state === 'suspended') {
            armResumeListeners();
          } else {
            clearResumeListeners();
          }
        })
        .catch(armResumeListeners);
    }
  };

  tryAutoplay();

  slider.addEventListener('input', () => {
    setVolume(slider.value);
    if (audio.paused) audio.play().catch(() => {});
  });
}
