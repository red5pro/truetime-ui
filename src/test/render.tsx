import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { TrueTimeThemeProvider } from '../theme/TrueTimeThemeProvider.js';
import type { Typeface } from '../tokens/tokens.js';

export function renderWithTheme(ui: ReactElement, typeface?: Typeface) {
  return render(<TrueTimeThemeProvider typeface={typeface}>{ui}</TrueTimeThemeProvider>);
}
