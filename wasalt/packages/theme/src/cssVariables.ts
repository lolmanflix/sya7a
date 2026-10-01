/**
 * Injects Company Theme tokens as CSS Custom Properties on target DOM element or :root.
 */
import { CompanyTheme } from '../../types/src/theme';

export function applyThemeTokens(theme: CompanyTheme, targetElement?: HTMLElement | null): void {
  if (typeof window === 'undefined') return;

  const target = targetElement || document.documentElement;
  const { colors } = theme;

  const variableMap: Record<string, string> = {
    '--wasalt-primary': colors.primary,
    '--wasalt-primary-hover': colors.primaryHover,
    '--wasalt-primary-light': colors.primaryLight,
    '--wasalt-secondary': colors.secondary,
    '--wasalt-accent': colors.accent,
    '--wasalt-background': colors.background,
    '--wasalt-surface': colors.surface,
    '--wasalt-surface-muted': colors.surfaceMuted,
    '--wasalt-text': colors.text,
    '--wasalt-text-muted': colors.textMuted,
    '--wasalt-border': colors.border,
    '--wasalt-success': colors.success,
    '--wasalt-warning': colors.warning,
    '--wasalt-error': colors.error,
  };

  Object.entries(variableMap).forEach(([prop, val]) => {
    target.style.setProperty(prop, val);
  });
}
