/**
 * @file timeUtils.ts
 * @description Time, elapsed duration, and clock formatting helpers.
 */

/**
 * Formats a duration in seconds into digital clock string (mm:ss or hh:mm:ss).
 * @param seconds - Total elapsed seconds.
 * @returns Digital clock format string.
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${String(hours).padStart(2, '0')}:${String(remMins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
