import { initLenis } from './lenis.js';
import { runPreloader } from './preloader.js';
import { initReveals } from './reveals.js';
import { initParallax } from './parallax.js';
import { initMagnetic } from './magnetic.js';
import { initFolders } from './folders.js';
import { initNav } from './nav.js';
import { initChatAJT } from './chatajt.js';
import { initParticles } from './particles.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (window.gsap && window.ScrollTrigger){
  window.gsap.registerPlugin(window.ScrollTrigger);
}

runPreloader();
initNav();
initReveals();
initParallax();
initMagnetic();
initFolders();
initChatAJT();
initParticles();
initLenis(prefersReducedMotion);

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
