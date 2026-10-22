import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { StatusBadge } from './StatusBadge.js';

it('renders its label', () => {
  renderWithTheme(<StatusBadge tone="live">Live</StatusBadge>);
  expect(screen.getByText('Live')).toBeInTheDocument();
});

it('tints problem states in the error color, unlike the solid LIVE badge', () => {
  renderWithTheme(
    <>
      <StatusBadge tone="error">Poor</StatusBadge>
      <StatusBadge tone="live">Live</StatusBadge>
    </>,
  );
  const poor = getComputedStyle(screen.getByText('Poor'));
  const live = getComputedStyle(screen.getByText('Live'));
  expect(poor.color).toBe(live.backgroundColor);
  expect(poor.backgroundColor).not.toBe(live.backgroundColor);
});
