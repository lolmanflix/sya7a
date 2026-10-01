/**
 * Theme tokens, color definitions, and contrast evaluations
 */

export interface ThemeColors {
  primary: string; // Brand dominant hex (e.g. #3B82F6)
  primaryHover: string;
  primaryLight: string;
  secondary: string; // Complementary accent hex
  accent: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export type ThemeSource = 'logo' | 'preset' | 'custom';

export interface CompanyTheme {
  source: ThemeSource;
  presetId?: string;
  colors: ThemeColors;
  borderRadius: 'sm' | 'md' | 'lg' | 'full';
  isDark: boolean;
  contrastRatio: number; // Evaluated against white / surface
  isAccessible: boolean; // Meets WCAG AA (>= 4.5:1 for body)
}

export interface PresetTheme {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  previewGradient: string;
}
