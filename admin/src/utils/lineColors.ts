/**
 * Deterministic per-line color assignment for the fleet map.
 * Same lineId always maps to the same palette color so operators can
 * visually tell corridors apart across renders and sessions.
 * Amber (#F59E0B) is intentionally reserved for the selected-line highlight.
 */

const LINE_PALETTE: readonly string[] = [
  '#EF4444', // red
  '#84CC16', // lime
  '#22C55E', // green
  '#14B8A6', // teal
  '#0EA5E9', // sky
  '#3B82F6', // blue
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#D946EF', // fuchsia
  '#EC4899', // pink
  '#F43F5E', // rose
  '#65A30D', // olive
  '#0891B2', // cyan-600
  '#7C3AED', // violet-700
  '#DB2777', // pink-600
  '#EA580C', // orange-600
] as const;

/** djb2 string hash — stable, allocation-free, good spread for short labels. */
function hashString(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Returns the stable palette color for a bus line label. */
export function getLineColor(lineId: string): string {
  const key = (lineId || '').trim().toLowerCase();
  return LINE_PALETTE[hashString(key) % LINE_PALETTE.length];
}
