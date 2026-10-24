/**
 * Color palettes: the TrueTime Meeting™ black and blue themes, and more dark themes in the same
 * shape (some with a gradient behind the page).
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

  /** A CSS gradient drawn behind the page (over themeColor80), fixed while it scrolls. */
  backgroundGradient?: string;
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

/** Deep violet. */
export const purplePalette: TrueTimePalette = {
  themeColor0: '#F3E8FF',
  themeColor10: '#E9D5FF',
  themeColor20: '#D8B4FE',
  themeColor30: '#C084FC',
  themeColor40: '#A855F7',
  themeColor50: '#7E22CE',
  themeColor60: '#4C1D95',
  themeColor70: '#2E1065',
  themeColor71: '#25104F',
  themeColor72: '#1F0D42',
  themeColor75: '#170A33',
  themeColor80: '#0F0622',
  themeColor85: '#0A0418',
  themeColor90: '#06020F',
  themeColor99: '#FFFFFF',

  textColor: '#FAF5FF',
  chatText: '#FAF5FF',
  secondaryText: '#C4B5FD',
  iconColor: '#FFFFFF',
  darkIconColor: '#A855F7',

  error: '#F87171',
  warning: '#FBBF24',
  success: '#34D399',
  info: '#A78BFA',

  primaryColor: '#A855F7',
  secondaryColor: '#2E1065',

  hoverColor: '#9333EA',
  activeColor: '#7E22CE',
  focusColor: '#C084FC',
};

/** Deep green. */
export const emeraldPalette: TrueTimePalette = {
  themeColor0: '#ECFDF5',
  themeColor10: '#D1FAE5',
  themeColor20: '#A7F3D0',
  themeColor30: '#6EE7B7',
  themeColor40: '#10B981',
  themeColor50: '#047857',
  themeColor60: '#064E3B',
  themeColor70: '#053B2D',
  themeColor71: '#043226',
  themeColor72: '#032A20',
  themeColor75: '#02201A',
  themeColor80: '#011712',
  themeColor85: '#01100D',
  themeColor90: '#000A08',
  themeColor99: '#FFFFFF',

  textColor: '#F0FDF4',
  chatText: '#F0FDF4',
  secondaryText: '#9FD8C0',
  iconColor: '#FFFFFF',
  darkIconColor: '#10B981',

  error: '#F87171',
  warning: '#FBBF24',
  success: '#34D399',
  info: '#38BDF8',

  primaryColor: '#10B981',
  secondaryColor: '#053B2D',

  hoverColor: '#059669',
  activeColor: '#047857',
  focusColor: '#34D399',
};

/** Night sky with a violet-to-teal gradient behind the page. */
export const auroraPalette: TrueTimePalette = {
  themeColor0: '#E0FBFF',
  themeColor10: '#B8F1F8',
  themeColor20: '#7EE0EE',
  themeColor30: '#3CC8DC',
  themeColor40: '#14A3C7',
  themeColor50: '#2C4A7A',
  themeColor60: '#253A66',
  themeColor70: '#1C2B52',
  themeColor71: '#182545',
  themeColor72: '#141F3B',
  themeColor75: '#101830',
  themeColor80: '#0B1124',
  themeColor85: '#080C1A',
  themeColor90: '#050810',
  themeColor99: '#FFFFFF',

  textColor: '#F5FBFF',
  chatText: '#F5FBFF',
  secondaryText: '#A9C1DA',
  iconColor: '#FFFFFF',
  darkIconColor: '#3CC8DC',

  error: '#F87171',
  warning: '#FBBF24',
  success: '#34D399',
  info: '#3CC8DC',

  primaryColor: '#3CC8DC',
  secondaryColor: '#1C2B52',

  hoverColor: '#22B2CC',
  activeColor: '#1891A8',
  focusColor: '#7EE0EE',

  backgroundGradient: 'linear-gradient(135deg, #1A0B3D 0%, #0B1124 45%, #04303A 100%)',
};

/** Warm plum with a plum-to-ember gradient behind the page. */
export const sunsetPalette: TrueTimePalette = {
  themeColor0: '#FFF1EB',
  themeColor10: '#FFD9C7',
  themeColor20: '#FDB394',
  themeColor30: '#FB8A60',
  themeColor40: '#F2643C',
  themeColor50: '#7A3048',
  themeColor60: '#5C2440',
  themeColor70: '#441A34',
  themeColor71: '#3A162D',
  themeColor72: '#311327',
  themeColor75: '#280F21',
  themeColor80: '#1E0B19',
  themeColor85: '#160812',
  themeColor90: '#0E050B',
  themeColor99: '#FFFFFF',

  textColor: '#FFF7F2',
  chatText: '#FFF7F2',
  secondaryText: '#E2B6A8',
  iconColor: '#FFFFFF',
  darkIconColor: '#F2643C',

  error: '#FF5C5C',
  warning: '#FBBF24',
  success: '#4ADE80',
  info: '#FB8A60',

  primaryColor: '#F2643C',
  secondaryColor: '#441A34',

  hoverColor: '#E0532C',
  activeColor: '#C44320',
  focusColor: '#FB8A60',

  backgroundGradient: 'linear-gradient(160deg, #3B0D2E 0%, #1E0B19 50%, #3D1A0C 100%)',
};

/** Deep sea with a teal glow from the top of the page. */
export const oceanPalette: TrueTimePalette = {
  themeColor0: '#E6F7FB',
  themeColor10: '#BFEAF4',
  themeColor20: '#8AD6EA',
  themeColor30: '#4FBEDC',
  themeColor40: '#1FA2C8',
  themeColor50: '#1B5470',
  themeColor60: '#16425A',
  themeColor70: '#11334A',
  themeColor71: '#0E2B3F',
  themeColor72: '#0C2536',
  themeColor75: '#0A1E2D',
  themeColor80: '#071723',
  themeColor85: '#05111A',
  themeColor90: '#030B11',
  themeColor99: '#FFFFFF',

  textColor: '#F2FBFE',
  chatText: '#F2FBFE',
  secondaryText: '#9CC3D4',
  iconColor: '#FFFFFF',
  darkIconColor: '#1FA2C8',

  error: '#F87171',
  warning: '#FBBF24',
  success: '#34D399',
  info: '#4FBEDC',

  primaryColor: '#1FA2C8',
  secondaryColor: '#11334A',

  hoverColor: '#1A8FB2',
  activeColor: '#167A98',
  focusColor: '#4FBEDC',

  backgroundGradient: 'radial-gradient(ellipse at top, #0F3B52 0%, #071723 60%, #030B11 100%)',
};

export const palettes = {
  black: blackPalette,
  blue: bluePalette,
  purple: purplePalette,
  emerald: emeraldPalette,
  aurora: auroraPalette,
  sunset: sunsetPalette,
  ocean: oceanPalette,
} as const;

export type ThemeName = keyof typeof palettes;

export const themeNames = Object.keys(palettes) as ThemeName[];

export interface SemanticColors {
  background: string;
  /** The palette's page gradient (backgroundGradient), or `none`. */
  backgroundImage: string;
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
    backgroundImage: palette.backgroundGradient ?? 'none',
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
