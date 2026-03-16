import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const LANGUAGES = [
  { code: 'it', label: 'Italiano', short: 'IT' },
  { code: 'en', label: 'English', short: 'EN' },
];

const FALLBACK_LANG = 'it';

const I18nContext = createContext({
  lang: FALLBACK_LANG,
  setLang: () => {},
  applyTranslation: () => {},
  t: (key, fallback) => fallback ?? key,
  tm: (key, fallback) => fallback,
  languages: LANGUAGES,
});

function isSupportedLanguage(lang) {
  return LANGUAGES.some((item) => item.code === lang);
}

function getStoredLang() {
  if (typeof window === 'undefined') return FALLBACK_LANG;
  try {
    const stored = localStorage.getItem('lang');
    return isSupportedLanguage(stored) ? stored : FALLBACK_LANG;
  } catch {
    return FALLBACK_LANG;
  }
}

function getDeepValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function interpolate(text, values) {
  if (!values) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = values[key];
    return value === undefined || value === null ? '' : String(value);
  });
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(getStoredLang);
  const [dictionary, setDictionary] = useState({});

  const setLang = useCallback((nextLang) => {
    const safeLang = isSupportedLanguage(nextLang) ? nextLang : FALLBACK_LANG;
    setLangState(safeLang);
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('lang', safeLang);
    } catch {
      // Ignore storage errors.
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    if (lang === FALLBACK_LANG) {
      setDictionary({});
      if (typeof document !== 'undefined') {
        document.documentElement.lang = FALLBACK_LANG;
      }
      return () => {
        isActive = false;
      };
    }

    const load = async () => {
      try {
        const res = await fetch(`/locales/${lang}.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isActive) setDictionary(data || {});
      } catch {
        if (isActive) {
          setDictionary({});
          setLang(FALLBACK_LANG);
        }
      }
    };

    load();
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }

    return () => {
      isActive = false;
    };
  }, [lang, setLang]);

  const t = useCallback(
    (key, fallback, values) => {
      const raw = getDeepValue(dictionary, key);
      const text = typeof raw === 'string' ? raw : (fallback ?? key);
      return interpolate(text, values);
    },
    [dictionary],
  );

  const tm = useCallback(
    (key, fallback) => {
      const raw = getDeepValue(dictionary, key);
      return raw === undefined ? fallback : raw;
    },
    [dictionary],
  );

  const value = useMemo(
    () => ({
      lang,
      setLang,
      applyTranslation: () => {},
      t,
      tm,
      languages: LANGUAGES,
    }),
    [lang, setLang, t, tm],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export { LANGUAGES };
