import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { StatusBadge } from './StatusBadge.js';

it('renders its label', () => {
  renderWithTheme(<StatusBadge tone="live">Live</StatusBadge>);
  expect(screen.getByText('Live')).toBeInTheDocument();
});
