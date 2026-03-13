/**
 * main.js — Application entry point (Multipage-aware)
 */

import { initFermate } from './sections/fermate.js';
import { initMeteo }   from './sections/meteo.js';
import { initI18n }    from './api/i18n.js';
import { initJourney } from './sections/journey.js';

function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const html   = document.documentElement;
  
  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  window.dispatchEvent(new Event('themechange'));
  
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      window.dispatchEvent(new Event('themechange'));
    });
  }
}

function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const actions = document.querySelector('.nav-actions');
  const navbar = document.querySelector('.navbar');

  if (toggle && actions) {
    const setOpen = (open) => {
      actions.classList.toggle('open', open);
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    toggle.addEventListener('click', () => setOpen(!actions.classList.contains('open')));
    actions.addEventListener('click', (event) => {
      if (event.target.closest('a.nav-link')) setOpen(false);
    });
    document.addEventListener('click', (event) => {
      if (!actions.classList.contains('open')) return;
      if (actions.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 640) setOpen(false);
    });
  }

  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initNavbar();
  await initI18n();

  // Make page init robust even with rewrites / clean URLs:
  // run features based on DOM presence rather than pathname.
  if (document.getElementById('fermate-grid')) {
    initFermate();
  }

  if (document.getElementById('journey')) {
    initJourney();
  }

  if (document.getElementById('meteoChart') || document.getElementById('live-cards')) {
    await initMeteo();
  }
});
