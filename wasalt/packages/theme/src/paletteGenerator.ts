/**
 * Theme Palette Generator
 * Synthesizes accessible UI token sets from a single primary brand color.
 */
import { CompanyTheme, ThemeColors, ThemeSource } from '../../types/src/theme';
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from './colorUtils';
import { calculateContrastRatio, ensureAccessibleColor } from './contrastValidator';

export interface GenerateThemeOptions {
  primaryHex: string;
  source?: ThemeSource;
  presetId?: string;
  isDark?: boolean;
  borderRadius?: 'sm' | 'md' | 'lg' | 'full';
}

export function generateThemeFromColor(options: GenerateThemeOptions): CompanyTheme {
  const { primaryHex, source = 'custom', presetId, isDark = false, borderRadius = 'md' } = options;

  const primaryRgb = hexToRgb(primaryHex);
  const primaryHsl = rgbToHsl(primaryRgb);

  // Derive secondary (shifted hue by 35 degrees)
  const secondaryHsl = {
    h: (primaryHsl.h + 35) % 360,
    s: Math.max(40, Math.min(85, primaryHsl.s)),
    l: isDark ? 65 : 45,
  };
  const secondaryHex = rgbToHex(hslToRgb(secondaryHsl));

  // Derive accent (complementary hue ~180 degrees)
  const accentHsl = {
    h: (primaryHsl.h + 180) % 360,
    s: 85,
    l: 50,
  };
  const accentHex = rgbToHex(hslToRgb(accentHsl));

  // Derive primary hover (slightly darker or lighter)
  const hoverHsl = {
    ...primaryHsl,
    l: isDark ? Math.min(80, primaryHsl.l + 10) : Math.max(15, primaryHsl.l - 8),
  };
  const primaryHover = rgbToHex(hslToRgb(hoverHsl));

  // Derive light tint
  const lightHsl = {
    ...primaryHsl,
    s: Math.max(30, primaryHsl.s - 20),
    l: isDark ? 20 : 94,
  };
  const primaryLight = rgbToHex(hslToRgb(lightHsl));

  const background = isDark ? '#0B0F17' : '#F8FAFC';
  const surface = isDark ? '#111827' : '#FFFFFF';
  const surfaceMuted = isDark ? '#1F2937' : '#F1F5F9';
  const text = isDark ? '#F9FAFB' : '#0F172A';
  const textMuted = isDark ? '#9CA3AF' : '#64748B';
  const border = isDark ? '#374151' : '#E2E8F0';

  // Ensure accessible primary color for text usage
  const accessiblePrimary = ensureAccessibleColor(primaryHex, surface);
  const contrastRatio = calculateContrastRatio(accessiblePrimary, surface);
  const isAccessible = contrastRatio >= 4.5;

  const colors: ThemeColors = {
    primary: primaryHex,
    primaryHover,
    primaryLight,
    secondary: secondaryHex,
    accent: accentHex,
    background,
    surface,
    surfaceMuted,
    text,
    textMuted,
    border,
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  return {
    source,
    presetId,
    colors,
    borderRadius,
    isDark,
    contrastRatio,
    isAccessible,
  };
}
