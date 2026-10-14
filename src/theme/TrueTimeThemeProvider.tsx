import { useMemo, type ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { ThemeName } from '../tokens/palettes.js';
import { createTrueTimeTheme } from './createTrueTimeTheme.js';

export interface TrueTimeThemeProviderProps {
  /** Palette name; unknown names fall back to `black`. */
  theme?: ThemeName | (string & {});
  /** Render MUI's CssBaseline with the TrueTime global styles. Defaults to true. */
  baseline?: boolean;
  children: ReactNode;
}

export function TrueTimeThemeProvider({
  theme = 'black',
  baseline = true,
  children,
}: TrueTimeThemeProviderProps) {
  const muiTheme = useMemo(() => createTrueTimeTheme(theme), [theme]);

  return (
    <ThemeProvider theme={muiTheme}>
      {baseline && <CssBaseline />}
      {children}
    </ThemeProvider>
  );
}
