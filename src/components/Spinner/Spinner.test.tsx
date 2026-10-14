import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { Spinner } from './Spinner.js';

describe('Spinner', () => {
  it.each(['circle', 'dots', 'ring', 'bars'] as const)(
    'renders the %s variant accessibly',
    (type) => {
      renderWithTheme(<Spinner type={type} label="Connecting" />);
      expect(screen.getByRole('progressbar', { name: 'Connecting' })).toBeInTheDocument();
    },
  );
});
