/**
 * Non-color design tokens, extracted from the TrueTime Meeting™ theme and components.
 * Values are numbers in px unless they carry a unit.
 */

export const fontFamily = {
  /** Brand typeface; @font-face rules ship in `truetime-ui/fonts.css`. */
  display: 'ClashDisplay',
  fallback: 'sans-serif',
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const typography = {
  h1: { fontSize: 56, fontWeight: fontWeight.bold },
  h2: { fontWeight: fontWeight.bold },
  h3: { fontWeight: fontWeight.bold },
  h5: { fontSize: 40, letterSpacing: '-0.007em' },
  h6: { fontSize: 20, lineHeight: 1, fontWeight: fontWeight.medium },
  body1: { fontSize: 16, fontWeight: fontWeight.medium, lineHeight: 1.2 },
  body2: { fontSize: 14, lineHeight: 1.2 },
  label: { fontSize: 14 },
  button: { fontSize: 16, fontWeight: fontWeight.medium, lineHeight: '24px' },
} as const;

/** MUI spacing unit; `theme.spacing(n)` = n * 8px. */
export const spacingUnit = 8;

export const radii = {
  /** Buttons, inputs, paper */
  control: 6,
  /** Dialogs, menus, cards */
  container: 12,
  /** Pill CTAs (Meetings "New meeting", "Start Call") */
  pill: 24,
  round: '50%',
} as const;

export const controlPadding = {
  button: '10px 16px',
  input: '11.5px 20px',
  filledInput: '12px 16px',
} as const;

export const borderWidth = {
  hairline: 1,
  control: 2,
} as const;

export const focusRing = {
  width: 2,
  offset: 2,
} as const;

export const shadows = {
  /** Frosted-glass panels and drawers */
  glass:
    '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(255, 255, 255, 0.05), inset 0 0 20px 10px rgba(255, 255, 255, 0.05)',
  /** Controls floating over video */
  overlay:
    '0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
} as const;

export const motion = {
  standard: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const disabledOpacity = 0.5;
