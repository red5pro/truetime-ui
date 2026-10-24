import { useMemo, type ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { ThemeName } from '../tokens/palettes.js';
import type { Typeface } from '../tokens/tokens.js';
import { createTrueTimeTheme } from './createTrueTimeTheme.js';

export interface TrueTimeThemeProviderProps {
  /** Palette name; unknown names fall back to `black`. */
  theme?: ThemeName | (string & {});
  /** `interface` sets text in Inter and keeps the brand face for headings. Defaults to `display`. */
  typeface?: Typeface;
  /** Render MUI's CssBaseline with the TrueTime global styles. Defaults to true. */
  baseline?: boolean;
  children: ReactNode;
}

export function TrueTimeThemeProvider({
  theme = 'black',
  typeface = 'display',
  baseline = true,
  children,
}: TrueTimeThemeProviderProps) {
  const muiTheme = useMemo(() => createTrueTimeTheme(theme, { typeface }), [theme, typeface]);

  return (
    <ThemeProvider theme={muiTheme}>
      {baseline && <CssBaseline />}
      {children}
    </ThemeProvider>
  );
}
