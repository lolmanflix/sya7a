/**
 * Predefined Curated Theme Presets
 * Hand-tuned for aesthetic elegance and WCAG AA contrast.
 */
import { PresetTheme, CompanyTheme } from '../../types/src/theme';
import { generateThemeFromColor } from './paletteGenerator';

export const PRESET_THEMES: PresetTheme[] = [
  {
    id: 'wasalt-sapphire',
    name: 'Wasalt Sapphire',
    description: 'Crisp royal blue designed for enterprise trust and executive clarity.',
    primary: '#2563EB',
    secondary: '#0D9488',
    accent: '#F59E0B',
    previewGradient: 'from-blue-600 to-teal-500',
  },
  {
    id: 'emerald-ops',
    name: 'Emerald Operations',
    description: 'Vibrant forest green tailored for fleet, logistics, and field operations.',
    primary: '#059669',
    secondary: '#0284C7',
    accent: '#F97316',
    previewGradient: 'from-emerald-600 to-sky-600',
  },
  {
    id: 'royal-amethyst',
    name: 'Royal Amethyst',
    description: 'Luxurious violet tone ideal for high-tech SaaS, education, and creative agencies.',
    primary: '#7C3AED',
    secondary: '#EC4899',
    accent: '#14B8A6',
    previewGradient: 'from-purple-600 to-pink-500',
  },
  {
    id: 'obsidian-slate',
    name: 'Obsidian Slate',
    description: 'Modern carbon monochrome with neon cyan highlights for command centers.',
    primary: '#0F172A',
    secondary: '#06B6D4',
    accent: '#10B981',
    previewGradient: 'from-slate-900 via-slate-800 to-cyan-500',
  },
];

export function getPresetThemeById(id: string): CompanyTheme {
  const match = PRESET_THEMES.find((p) => p.id === id) || PRESET_THEMES[0];
  return generateThemeFromColor({
    primaryHex: match.primary,
    source: 'preset',
    presetId: match.id,
  });
}
