/**
 * WCAG contrast helpers, so a palette (or a brand color a company picks) can be checked before it
 * reaches the screen.
 */
import { broadcastColors } from './palettes.js';

/** `#RGB` or `#RRGGBB` as 0-255 channels; null for anything else. */
function rgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

/** Relative luminance (WCAG 2.x), 0 (black) to 1 (white). */
export function relativeLuminance(hex: string): number {
  const channels = rgb(hex);
  if (!channels) throw new Error(`Not a hex color: ${hex}`);
  const [r, g, b] = channels.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two hex colors, 1 to 21. Body text needs 4.5, large text and UI parts 3. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Whichever of `dark` and `light` reads better on `background` (e.g. a brand-colored button's text). */
export function readableOn(background: string, dark = '#0B0D10', light = '#FFFFFF'): string {
  return contrastRatio(background, light) >= contrastRatio(background, dark) ? light : dark;
}

/** `overlay` laid over `base` at `amount` (0-1), as an opaque hex color. */
export function mixColors(base: string, overlay: string, amount: number): string {
  const a = rgb(base);
  const b = rgb(overlay);
  if (!a || !b) throw new Error(`Not hex colors: ${base}, ${overlay}`);
  return `#${a
    .map((c, i) =>
      Math.round(c + (b[i] - c) * amount)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

/** Hue in degrees (0-360) and saturation (0-1) of a hex color. */
function hueSat(hex: string): [number, number] {
  const [r, g, b] = rgb(hex)!.map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return [0, 0];
  const l = (max + min) / 2;
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s];
}

/**
 * True when a saturated color is close enough in hue to the program (red) or preview (green) tally
 * to be mistaken for on-air state. Brand colors should be kept off it.
 */
export function looksLikeTally(hex: string, maxHueDistance = 18): boolean {
  const [hue, sat] = hueSat(hex);
  if (sat < 0.45) return false;
  return [broadcastColors.program, broadcastColors.preview].some((tally) => {
    const d = Math.abs(hue - hueSat(tally)[0]);
    return Math.min(d, 360 - d) <= maxHueDistance;
  });
}
