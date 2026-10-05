/**
 * Applies a company's theme (from /companies/{id}/theme/) to the admin
 * console by setting the --brand-* CSS variables consumed by the Tailwind
 * `brand` palette (see tailwind.config.js). Clears them when no theme is
 * given, restoring the default Wasalt palette.
 */
import { CompanyThemeLike } from '../types';

const SHADE_VARS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex(r: number, g: number, b: number): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Linearly blends `from` toward `to` (t = 0 keeps `from`, t = 1 keeps `to`). */
function blend(from: string, to: string, t: number): string | null {
  const a = parseHex(from);
  const b = parseHex(to);
  if (!a || !b) return null;
  return toHex(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
}

/**
 * Sets --brand-50..950 from the company's primary/primaryHover/primaryLight
 * colors. Safe to call with undefined (resets to defaults).
 */
export function applyCompanyTheme(theme?: CompanyThemeLike | null): void {
  const root = document.documentElement;
  const colors = theme?.colors;
  const primary = colors?.primary;

  if (!primary || !parseHex(primary)) {
    SHADE_VARS.forEach((shade) => root.style.removeProperty(`--brand-${shade}`));
    return;
  }

  const hover = colors?.primaryHover && parseHex(colors.primaryHover) ? colors.primaryHover! : primary;
  const light = colors?.primaryLight && parseHex(colors.primaryLight) ? colors.primaryLight! : blend(primary, '#ffffff', 0.9)!;

  const shades: Record<number, string> = {
    50: blend(primary, '#ffffff', 0.95) || primary,
    100: light,
    200: blend(light, primary, 0.35) || primary,
    300: blend(primary, '#ffffff', 0.55) || primary,
    400: blend(primary, '#ffffff', 0.3) || primary,
    500: primary,
    600: hover,
    700: blend(hover, '#000000', 0.2) || hover,
    800: blend(hover, '#000000', 0.35) || hover,
    900: blend(hover, '#000000', 0.5) || hover,
    950: blend(hover, '#000000', 0.65) || hover,
  };

  SHADE_VARS.forEach((shade) => {
    root.style.setProperty(`--brand-${shade}`, shades[shade]);
  });
}
