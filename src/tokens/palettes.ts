/**
 * Color palettes, extracted from the TrueTime Meetings black and blue themes.
 *
 * The numbered `themeColor*` keys are a lightness scale (0 = lightest, 99 = pure white for text)
 * and are exposed on the MUI theme as `palette.themeColor[n]`. Prefer the semantic aliases in
 * `semanticColors()` when styling new components.
 */
export interface TrueTimePalette {
  themeColor0: string;
  themeColor10: string;
  themeColor20: string;
  themeColor30: string;
  themeColor40: string;
  themeColor50: string;
  themeColor60: string;
  themeColor70: string;
  themeColor71: string;
  themeColor72: string;
  themeColor75: string;
  themeColor80: string;
  themeColor85: string;
  themeColor90: string;
  themeColor99: string;

  textColor: string;
  chatText: string;
  secondaryText: string;
  iconColor: string;
  darkIconColor: string;

  error: string;
  warning: string;
  success: string;
  info: string;

  primaryColor: string;
  secondaryColor: string;

  hoverColor: string;
  activeColor: string;
  focusColor: string;
}

export const blackPalette: TrueTimePalette = {
  themeColor0: '#F5F5F5', // Lightest - for backgrounds that need high contrast
  themeColor10: '#E0E0E0', // Very light gray - subtle borders, disabled states
  themeColor20: '#B8B8B8', // Light gray - secondary text, placeholders
  themeColor30: '#8E8E8E', // Medium gray - icons, less important text
  themeColor40: '#6E6E6E', // Active secondary elements
  themeColor50: '#4A4A4A', // Darker gray - borders, dividers
  themeColor60: '#393737', // Card backgrounds, panels
  themeColor70: '#2C2C2C', // Dark backgrounds - modals, dropdowns
  themeColor71: '#242424', // Slightly darker variation
  themeColor72: '#1E1E1E', // Darker variation - sidebar backgrounds
  themeColor75: '#1A1A1A', // Very dark - main backgrounds
  themeColor80: '#141414', // Almost black - deep backgrounds
  themeColor85: '#0F0F0F', // Near black - footer, header backgrounds
  themeColor90: '#0A0A0A', // Very deep black
  themeColor99: '#FFFFFF', // Pure white - primary text, icons

  textColor: '#FAFAFA',
  chatText: '#FAFAFA',
  secondaryText: '#B8B8B8',
  iconColor: '#FFFFFF',
  darkIconColor: '#6E6E6E',

  error: '#FF4444',
  warning: '#FFB74D',
  success: '#81C784',
  info: '#64B5F6',

  primaryColor: '#8A8A8A',
  secondaryColor: '#393737',

  hoverColor: '#9A9A9A',
  activeColor: '#7A7A7A',
  focusColor: '#8A8A8A',
};

export const bluePalette: TrueTimePalette = {
  themeColor0: '#E0F2FE', // Lightest blue - High contrast text/elements
  themeColor10: '#BAE6FD', // Very light blue
  themeColor20: '#7DD3FC', // Light blue
  themeColor30: '#38BDF8', // Medium light blue
  themeColor40: '#3B82F6', // Active secondary
  themeColor50: '#2563EB', // Blue borders/accents
  themeColor60: '#1E3A8A', // Card backgrounds (Dark Blue)
  themeColor70: '#172554', // Dark backgrounds (Darker Blue)
  themeColor71: '#0F172A', // Slightly darker (Slate 900)
  themeColor72: '#1E293B', // Sidebar (Slate 800)
  themeColor75: '#020617', // Very dark (Slate 950)
  themeColor80: '#02040A', // Almost black blue - Main BG
  themeColor85: '#000000', // Footer/Header
  themeColor90: '#000000', // Deepest
  themeColor99: '#FFFFFF', // Pure white

  textColor: '#F8FAFC',
  chatText: '#F8FAFC',
  secondaryText: '#94A3B8',
  iconColor: '#FFFFFF',
  darkIconColor: '#3B82F6',

  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',

  primaryColor: '#3B82F6',
  secondaryColor: '#1E293B',

  hoverColor: '#1D4ED8',
  activeColor: '#1E40AF',
  focusColor: '#3B82F6',
};

export const palettes = {
  black: blackPalette,
  blue: bluePalette,
} as const;

export type ThemeName = keyof typeof palettes;

export const themeNames = Object.keys(palettes) as ThemeName[];

export interface SemanticColors {
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  text: string;
  mutedText: string;
  disabledText: string;
  primary: string;
  secondary: string;
  hover: string;
  active: string;
  focus: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

/** Role-based aliases over a palette; these are what library components style against. */
export function semanticColors(palette: TrueTimePalette): SemanticColors {
  return {
    background: palette.themeColor80,
    surface: palette.themeColor75,
    surfaceRaised: palette.themeColor70,
    surfaceHover: palette.themeColor60,
    border: palette.themeColor50,
    borderStrong: palette.themeColor40,
    text: palette.themeColor99,
    mutedText: palette.secondaryText,
    disabledText: palette.themeColor30,
    primary: palette.primaryColor,
    secondary: palette.secondaryColor,
    hover: palette.hoverColor,
    active: palette.activeColor,
    focus: palette.focusColor,
    error: palette.error,
    warning: palette.warning,
    success: palette.success,
    info: palette.info,
  };
}
