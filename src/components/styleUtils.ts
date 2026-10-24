import type { Theme } from '@mui/material/styles';
import { blackPalette, semanticColors, type SemanticColors } from '../tokens/palettes.js';
import { focusRing } from '../tokens/tokens.js';

const fallbackColors = semanticColors(blackPalette);

/** Semantic colors of the active TrueTime theme, or the black palette under a plain MUI theme. */
export function themeColors(theme: Theme): SemanticColors {
  return theme.truetime?.colors ?? fallbackColors;
}

/** Keyboard focus indicator shared by interactive components. */
export function focusRingStyle(theme: Theme) {
  return {
    outline: `${focusRing.width}px solid ${themeColors(theme).focus}`,
    outlineOffset: focusRing.offset,
  };
}

/** Hides text on screen while keeping it for screen readers. */
export const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
} as const;
