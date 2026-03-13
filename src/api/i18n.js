/**
 * i18n.js — Simple translation engine
 */

let currentLang = localStorage.getItem('lang') || 'it';
let translations = {};

export async function initI18n() {
  const toggle = document.getElementById('lang-toggle');
  
  await loadTranslations(currentLang);
  updateDOM();

  if (toggle) {
    toggle.textContent = currentLang === 'it' ? '🇮🇹' : '🇬🇧';
    toggle.addEventListener('click', async () => {
      currentLang = currentLang === 'it' ? 'en' : 'it';
      localStorage.setItem('lang', currentLang);
      toggle.textContent = currentLang === 'it' ? '🇮🇹' : '🇬🇧';
      await loadTranslations(currentLang);
      updateDOM();
    });
  }
}

async function loadTranslations(lang) {
  try {
    const res = await fetch(`/locales/${lang}.json`);
    translations = await res.json();
  } catch (e) {
    console.warn(`Could not load translations for ${lang}`, e);
  }
}

function updateDOM() {
  // Translate elements with data-i18n attribute
  // e.g., <h1 data-i18n="hero.title">...</h1>
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const text = getDeepValue(translations, key);
    if (text) el.textContent = text;
  });
}

function getDeepValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}
