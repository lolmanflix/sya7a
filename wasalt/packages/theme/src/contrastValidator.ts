/**
 * WCAG 2.1 Contrast Calculation and Automated Adjustment Engine
 */
import { hexToRgb, getRelativeLuminance, rgbToHsl, hslToRgb, rgbToHex } from './colorUtils';

export interface ContrastResult {
  ratio: number;
  isAccessible: boolean; // >= 4.5:1
  isLargeAccessible: boolean; // >= 3:1
  grade: 'AAA' | 'AA' | 'AA-Large' | 'Fail';
}

/**
 * Calculates WCAG 2.1 contrast ratio between two hex colors.
 */
export function calculateContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const fgRgb = hexToRgb(foregroundHex);
  const bgRgb = hexToRgb(backgroundHex);

  const l1 = getRelativeLuminance(fgRgb);
  const l2 = getRelativeLuminance(bgRgb);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Number(ratio.toFixed(2));
}

export function evaluateContrast(foregroundHex: string, backgroundHex: string): ContrastResult {
  const ratio = calculateContrastRatio(foregroundHex, backgroundHex);
  const isAccessible = ratio >= 4.5;
  const isLargeAccessible = ratio >= 3.0;

  let grade: ContrastResult['grade'] = 'Fail';
  if (ratio >= 7.0) grade = 'AAA';
  else if (ratio >= 4.5) grade = 'AA';
  else if (ratio >= 3.0) grade = 'AA-Large';

  return {
    ratio,
    isAccessible,
    isLargeAccessible,
    grade,
  };
}

/**
 * Adjusts color luminance dynamically until it satisfies WCAG AA (4.5:1) against a background.
 */
export function ensureAccessibleColor(colorHex: string, backgroundHex: string = '#FFFFFF'): string {
  let ratio = calculateContrastRatio(colorHex, backgroundHex);
  if (ratio >= 4.5) return colorHex;

  const rgb = hexToRgb(colorHex);
  const hsl = rgbToHsl(rgb);
  const isLightBg = getRelativeLuminance(hexToRgb(backgroundHex)) > 0.5;

  let iterations = 0;
  while (ratio < 4.5 && iterations < 30) {
    if (isLightBg) {
      // Darken the foreground to contrast with light background
      hsl.l = Math.max(10, hsl.l - 4);
    } else {
      // Lighten the foreground to contrast with dark background
      hsl.l = Math.min(95, hsl.l + 4);
    }
    const candidateHex = rgbToHex(hslToRgb(hsl));
    ratio = calculateContrastRatio(candidateHex, backgroundHex);
    iterations++;
  }

  return rgbToHex(hslToRgb(hsl));
}
