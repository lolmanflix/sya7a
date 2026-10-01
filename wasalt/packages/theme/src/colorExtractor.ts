/**
 * Client-Side Canvas Dominant Color Extractor
 * Extracts dominant tones from an image/logo without external dependencies.
 */
import { RGB, rgbToHex } from './colorUtils';

export interface ExtractedColorResult {
  dominantHex: string;
  palette: string[]; // Up to 5 dominant colors
}

/**
 * Quantizes image pixels from an HTMLImageElement or data URL via Offscreen/HTML Canvas.
 */
export async function extractColorsFromImageUrl(imageUrl: string): Promise<ExtractedColorResult> {
  return new Promise((resolve) => {
    // If not in a browser environment, return fallback
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      resolve({ dominantHex: '#2563EB', palette: ['#2563EB', '#0D9488', '#F59E0B'] });
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve({ dominantHex: '#2563EB', palette: ['#2563EB', '#0D9488'] });
          return;
        }

        // Downscale image to 64x64 for instant quantization
        const width = 64;
        const height = 64;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height).data;

        const colorBuckets = new Map<string, { count: number; rgb: RGB }>();

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          // Skip transparent or near-white / near-black pixels
          if (a < 128) continue;
          if (r > 240 && g > 240 && b > 240) continue; // Pure white background
          if (r < 15 && g < 15 && b < 15) continue; // Pure black

          // Quantize into 16-step bins
          const qr = Math.round(r / 16) * 16;
          const qg = Math.round(g / 16) * 16;
          const qb = Math.round(b / 16) * 16;
          const key = `${qr},${qg},${qb}`;

          const existing = colorBuckets.get(key);
          if (existing) {
            existing.count++;
          } else {
            colorBuckets.set(key, { count: 1, rgb: { r, g, b } });
          }
        }

        const sorted = Array.from(colorBuckets.values()).sort((a, b) => b.count - a.count);

        if (sorted.length === 0) {
          resolve({ dominantHex: '#2563EB', palette: ['#2563EB', '#0D9488'] });
          return;
        }

        const dominantHex = rgbToHex(sorted[0].rgb);
        const palette = sorted.slice(0, 5).map((item) => rgbToHex(item.rgb));

        resolve({ dominantHex, palette });
      } catch (err) {
        console.warn('[Wasalt Theme] Canvas extraction error, using fallback:', err);
        resolve({ dominantHex: '#2563EB', palette: ['#2563EB', '#0D9488'] });
      }
    };

    img.onerror = () => {
      resolve({ dominantHex: '#2563EB', palette: ['#2563EB', '#0D9488'] });
    };

    img.src = imageUrl;
  });
}
