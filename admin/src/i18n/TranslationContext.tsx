import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  TranslationContext,
  type Dir,
  type Lang,
  type TranslationContextValue,
  type TranslationVars,
} from './context';
import { en } from './locales/en';
import { ar } from './locales/ar';

type Dictionary = Record<string, string>;

const DICTIONARIES: Record<Lang, Dictionary> = { en, ar };
const STORAGE_KEY = 'wasalt_admin_lang';

/** Warn about each missing key only once per session (dev-visible). */
const warnedKeys = new Set<string>();

const detectInitialLang = (): Lang => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'ar') return stored;
  } catch {
    // Storage unavailable (private mode / blocked) — fall through to navigator.
  }
  return typeof navigator !== 'undefined' && navigator.language?.startsWith('ar') ? 'ar' : 'en';
};

const dirForLang = (lang: Lang): Dir => (lang === 'ar' ? 'rtl' : 'ltr');

const interpolate = (template: string, vars?: TranslationVars): string => {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
  );
};

/**
 * Provides EN/AR dictionaries, language persistence, and document dir/lang syncing.
 */
export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(detectInitialLang);

  const dir = dirForLang(lang);

  // Keep <html lang dir> in sync so Tailwind logical props and fonts behave.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore persistence failures — session still switches language.
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: TranslationVars): string => {
      const dictionary = DICTIONARIES[lang];
      const template = dictionary[key];
      if (template === undefined) {
        if (!warnedKeys.has(key)) {
          warnedKeys.add(key);
          console.warn(`[i18n] Missing translation key: "${key}" (${lang})`);
        }
        return key;
      }
      return interpolate(template, vars);
    },
    [lang]
  );

  const value = useMemo<TranslationContextValue>(() => ({ t, lang, setLang, dir }), [t, lang, setLang, dir]);

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
};
