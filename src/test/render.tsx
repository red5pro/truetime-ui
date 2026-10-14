import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { TrueTimeThemeProvider } from '../theme/TrueTimeThemeProvider.js';

export function renderWithTheme(ui: ReactElement) {
  return render(<TrueTimeThemeProvider>{ui}</TrueTimeThemeProvider>);
}
