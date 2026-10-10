import { createContext } from 'react';

export type Lang = 'en' | 'ar';
export type Dir = 'ltr' | 'rtl';
export type TranslationVars = Record<string, string | number>;

export interface TranslationContextValue {
  t: (key: string, vars?: TranslationVars) => string;
  lang: Lang;
  setLang: (lang: Lang) => void;
  dir: Dir;
}

/** Shared context instance consumed by TranslationProvider and useTranslation. */
export const TranslationContext = createContext<TranslationContextValue | null>(null);
