import { createTheme, responsiveFontSizes, type Theme } from '@mui/material/styles';
import {
  palettes,
  semanticColors,
  type SemanticColors,
  type ThemeName,
  type TrueTimePalette,
} from '../tokens/palettes.js';
import {
  borderWidth,
  controlPadding,
  disabledOpacity,
  fontFamily,
  radii,
  typography,
  type Typeface,
} from '../tokens/tokens.js';

type ThemeColorScale = {
  0: string;
  10: string;
  20: string;
  30: string;
  40: string;
  50: string;
  60: string;
  70: string;
  71: string;
  72: string;
  75: string;
  80: string;
  85: string;
  90: string;
  99: string;
};

type IconColorSet = { primary: string; default: string; secondary: string };

export interface TrueTimeThemeExtension {
  name: ThemeName;
  palette: TrueTimePalette;
  colors: SemanticColors;
}

declare module '@mui/material/styles' {
  interface Palette {
    themeColor: ThemeColorScale;
    gray: { 90: string };
    textColor: string;
    chatText: string;
    participantListIcon: IconColorSet;
    iconColor: IconColorSet;
    darkIconColor: IconColorSet;
  }

  interface PaletteOptions {
    themeColor?: Partial<ThemeColorScale>;
    gray?: { 90?: string };
    textColor: string;
    chatText: string;
    participantListIcon?: Partial<IconColorSet>;
    iconColor?: Partial<IconColorSet>;
    darkIconColor?: Partial<IconColorSet>;
  }

  interface TypeBackground {
    level1: string;
    level2: string;
  }

  interface Theme {
    truetime: TrueTimeThemeExtension;
  }

  interface ThemeOptions {
    truetime?: TrueTimeThemeExtension;
  }
}

// The `!important` font declarations are carried over from Meetings, where they override
// third-party widgets rendered inside the app.
const DISPLAY = `${fontFamily.display} !important`;

function buildTheme(name: ThemeName, typeface: Typeface): Theme {
  const colors = palettes[name];
  // Text face: the brand face throughout, or Inter with the brand face kept for headings
  const textFace = typeface === 'interface' ? fontFamily.ui : fontFamily.display;
  const FONT = `'${textFace}', ${fontFamily.fallback} !important`;

  return createTheme({
    truetime: { name, palette: colors, colors: semanticColors(colors) },
    typography: {
      allVariants: {
        color: '#FFFFFF',
        fontFamily: FONT,
      },
      h1: {
        fontFamily: DISPLAY,
        ...typography.h1,
      },
      h2: { fontFamily: DISPLAY, ...typography.h2 },
      h3: { fontFamily: DISPLAY, ...typography.h3 },
      h4: { fontFamily: DISPLAY },
      h5: { fontFamily: DISPLAY, ...typography.h5 },
      h6: { fontFamily: DISPLAY, ...typography.h6 },
      body1: {
        ...typography.body1,
        color: '#FFFFFF',
      },
      body2: {
        ...typography.body2,
        color: colors.secondaryText,
      },
    },
    components: {
      MuiSelect: {
        styleOverrides: {
          root: {
            fontFamily: FONT,
            '& fieldset': {
              borderColor: colors.themeColor40,
            },
          },
          icon: {
            color: colors.iconColor,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            fontFamily: FONT,
            padding: 8,
            '&:hover': {
              backgroundColor: colors.hoverColor,
            },
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            fontFamily: FONT,
            boxShadow: 'unset',
            '&:hover': {
              backgroundColor: colors.hoverColor,
            },
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            fontFamily: FONT,
            background: colors.themeColor70,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            fontFamily: FONT,
            padding: '12px 40px 32px',
            width: '100%',
            backgroundColor: colors.themeColor75,
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontFamily: DISPLAY,
            color: colors.themeColor99,
            padding: '24px 0',
            fontSize: 24,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            fontFamily: FONT,
            borderRadius: radii.control,
            background: colors.themeColor72,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontFamily: FONT,
            paddingTop: 16,
            paddingBottom: 16,
            color: colors.themeColor99,
            '&:hover': {
              backgroundColor: colors.hoverColor,
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            fontFamily: FONT,
            marginRight: 16,
            // Same color as the menu item's text (MUI's default is a grey of its own)
            color: 'inherit',
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: colors.themeColor99,
          },
          secondary: {
            color: colors.secondaryText,
          },
          root: {
            fontFamily: FONT,
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: colors.secondaryText,
            fontSize: typography.label.fontSize,
            marginBottom: 4,
            fontFamily: FONT,
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            color: colors.themeColor99,
            paddingLeft: 0,
            paddingRight: 0,
            marginTop: 16,
            fontFamily: FONT,
          },
        },
      },
      MuiGrid: {
        styleOverrides: {
          item: { lineHeight: 0 },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            border: `${borderWidth.hairline}px solid ${colors.themeColor50}`,
          },
          input: {
            fontFamily: FONT,
            borderRadius: radii.control,
            padding: controlPadding.input,
            color: colors.themeColor99,
            '&::placeholder': {
              fontSize: 16,
              color: colors.secondaryText,
              opacity: 1,
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            backgroundColor: colors.themeColor70,
            '&:hover': {
              backgroundColor: colors.themeColor60,
            },
            '&.Mui-focused': {
              backgroundColor: colors.themeColor60,
            },
          },
          input: {
            fontFamily: FONT,
            padding: controlPadding.filledInput,
            color: colors.themeColor99,
            '&::placeholder': {
              fontSize: 14,
              color: colors.secondaryText,
              opacity: 0.8,
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          // After the variant styles, so headings get the brand face back here
          root: ({ ownerState }) => ({
            fontFamily: /^h[1-6]$/.test(String(ownerState.variant)) ? DISPLAY : FONT,
          }),
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: `${colors.themeColor70} !important`,
              '&:hover': {
                backgroundColor: `${colors.themeColor60} !important`,
              },
              '&.Mui-focused': {
                backgroundColor: `${colors.themeColor60} !important`,
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          outlinedSecondary: {
            border: `${borderWidth.control}px solid ${colors.themeColor50}`,
            color: colors.themeColor99,
            '&:hover': {
              border: `${borderWidth.control}px solid ${colors.themeColor40}`,
              backgroundColor: colors.hoverColor,
            },
          },
          root: {
            fontFamily: FONT,
            color: colors.themeColor99,
            borderRadius: radii.control,
            ...typography.button,
            borderWidth: borderWidth.control,
            padding: controlPadding.button,
            textTransform: 'initial',
            minWidth: 60,
          },
          containedError: {
            backgroundColor: colors.error,
            borderColor: colors.error,
            '&:hover': {
              backgroundColor: '#E53935',
            },
            '&.Mui-disabled': {
              opacity: disabledOpacity,
              cursor: 'not-allowed',
              color: colors.themeColor99,
              boxShadow: 'none',
              borderColor: colors.error,
              backgroundColor: colors.error,
              pointerEvents: 'unset',
            },
          },
          outlinedPrimary: {
            backgroundColor: 'transparent',
            borderColor: colors.primaryColor,
            color: colors.primaryColor,
            '&:hover': {
              border: `${borderWidth.control}px solid ${colors.primaryColor}`,
              backgroundColor: colors.hoverColor,
              color: colors.themeColor99,
            },
            '&.Mui-disabled': {
              opacity: disabledOpacity,
              cursor: 'not-allowed',
              color: colors.primaryColor,
              boxShadow: 'none',
              borderColor: colors.primaryColor,
              pointerEvents: 'unset',
            },
          },
          contained: {
            boxShadow: 'none',
            borderWidth: borderWidth.control,
            borderColor: 'inherit',
            borderStyle: 'solid',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          containedPrimary: {
            backgroundColor: colors.primaryColor,
            boxShadow: 'none',
            borderColor: colors.primaryColor,
            '&:hover': {
              backgroundColor: colors.hoverColor,
            },
            '&.Mui-disabled': {
              opacity: disabledOpacity,
              cursor: 'not-allowed',
              color: colors.themeColor99,
              boxShadow: 'none',
              borderColor: colors.primaryColor,
              backgroundColor: colors.primaryColor,
              pointerEvents: 'unset',
            },
          },
          containedSecondary: {
            backgroundColor: colors.secondaryColor,
            boxShadow: 'none',
            borderColor: colors.secondaryColor,
            '&:hover': {
              backgroundColor: colors.hoverColor,
            },
            '&.Mui-disabled': {
              opacity: disabledOpacity,
              cursor: 'not-allowed',
              color: colors.themeColor99,
              boxShadow: 'none',
              borderColor: colors.secondaryColor,
              backgroundColor: colors.secondaryColor,
              pointerEvents: 'unset',
            },
          },
        },
      },
      MuiCssBaseline: {
        // @font-face rules live in truetime-ui/fonts.css so bundlers resolve the font files.
        styleOverrides: `
        html, body {
          font-family: '${textFace}', ${fontFamily.fallback} !important;
          background-color: ${colors.themeColor80};
          color: ${colors.themeColor99};
        }
        body {
          background-image: ${colors.backgroundGradient ?? 'none'};
          background-attachment: fixed;
          min-height: 100vh;
        }
        *, *::before, *::after {
          font-family: '${textFace}', ${fontFamily.fallback} !important;
        }
        /* Dark scrollbars everywhere: black track, dark gray thumb. color-scheme also darkens
           native controls; scrollbar-color covers Chrome/Edge/Firefox and inherits into every
           scroll container, the ::-webkit-scrollbar rules cover Safari. */
        html {
          color-scheme: dark;
          scrollbar-color: ${colors.themeColor60} ${colors.themeColor90};
        }
        *::-webkit-scrollbar {
          width: 10px;
          height: 10px;
          background-color: ${colors.themeColor90};
        }
        *::-webkit-scrollbar-track,
        *::-webkit-scrollbar-corner {
          background-color: ${colors.themeColor90};
        }
        *::-webkit-scrollbar-thumb {
          background-color: ${colors.themeColor60};
          border-radius: 5px;
          border: 2px solid ${colors.themeColor90};
        }
        *::-webkit-scrollbar-thumb:hover {
          background-color: ${colors.themeColor50};
        }
      `,
      },
    },
    palette: {
      primary: {
        main: colors.primaryColor,
        dark: '#7A7A7A',
        light: '#9A9A9A',
      },
      secondary: {
        main: colors.secondaryColor,
        dark: colors.themeColor70,
        light: colors.themeColor50,
      },
      error: {
        main: colors.error,
        dark: '#E53935',
        light: '#EF5350',
      },
      warning: {
        main: colors.warning,
        dark: '#F57C00',
        light: '#FFCC02',
      },
      success: {
        main: colors.success,
        dark: '#388E3C',
        light: '#A5D6A7',
      },
      info: {
        main: colors.info,
        dark: '#1976D2',
        light: '#90CAF9',
      },
      textColor: colors.textColor,
      chatText: colors.chatText,
      themeColor: {
        0: colors.themeColor0,
        10: colors.themeColor10,
        20: colors.themeColor20,
        30: colors.themeColor30,
        40: colors.themeColor40,
        50: colors.themeColor50,
        60: colors.themeColor60,
        70: colors.themeColor70,
        71: colors.themeColor71,
        72: colors.themeColor72,
        75: colors.themeColor75,
        80: colors.themeColor80,
        85: colors.themeColor85,
        90: colors.themeColor90,
        99: colors.themeColor99,
      },
      gray: {
        90: colors.themeColor50,
      },
      text: {
        primary: colors.themeColor99,
        secondary: colors.secondaryText,
        disabled: colors.themeColor30,
      },
      participantListIcon: {
        primary: colors.iconColor,
        default: colors.iconColor,
        secondary: colors.iconColor,
      },
      iconColor: {
        primary: colors.iconColor,
        default: colors.iconColor,
        secondary: colors.iconColor,
      },
      darkIconColor: {
        primary: colors.darkIconColor,
        default: colors.darkIconColor,
        secondary: colors.darkIconColor,
      },
      action: {
        hover: colors.hoverColor,
        selected: colors.activeColor,
        disabled: colors.themeColor30,
        disabledOpacity,
      },
      background: {
        default: colors.themeColor80,
        paper: colors.themeColor72,
        level1: colors.themeColor75,
        level2: colors.themeColor70,
      },
    },
  });
}

function isThemeName(name: string): name is ThemeName {
  return Object.prototype.hasOwnProperty.call(palettes, name);
}

/**
 * Builds the MUI theme for a TrueTime palette. Unknown names fall back to `black`, matching the
 * Meetings behaviour for runtime-configured theme names.
 */
export function createTrueTimeTheme(
  name: ThemeName | (string & {}) = 'black',
  { typeface = 'display' }: { typeface?: Typeface } = {},
): Theme {
  return responsiveFontSizes(buildTheme(isThemeName(name) ? name : 'black', typeface));
}
