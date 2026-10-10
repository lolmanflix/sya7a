import { en } from './translationsEn';
import { ar } from './translationsAr';

export type Language = 'en' | 'ar';
export type ColorMode = 'light' | 'dark';

export const translations: Record<Language, Record<string, string>> = {
  en,
  ar,
};
