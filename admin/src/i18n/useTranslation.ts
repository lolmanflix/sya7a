import { useContext } from 'react';
import { TranslationContext, type TranslationContextValue } from './context';

/**
 * Hook exposing the active translation function and language controls.
 */
export const useTranslation = (): TranslationContextValue => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
