import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { broadcastColors } from '../../tokens/palettes.js';
import { StatusBadge } from './StatusBadge.js';

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};

it('renders its label', () => {
  renderWithTheme(<StatusBadge tone="live">Live</StatusBadge>);
  expect(screen.getByText('Live')).toBeInTheDocument();
});

it('draws LIVE in the on-air red and preview in the preview green, whatever the theme', () => {
  renderWithTheme(
    <>
      <StatusBadge tone="live">Live</StatusBadge>
      <StatusBadge tone="preview">Preview</StatusBadge>
    </>,
  );
  expect(getComputedStyle(screen.getByText('Live')).backgroundColor).toBe(
    rgb(broadcastColors.program),
  );
  expect(getComputedStyle(screen.getByText('Preview')).backgroundColor).toBe(
    rgb(broadcastColors.preview),
  );
});

it('tints problem states and marks errors with an icon, unlike the solid LIVE badge', () => {
  renderWithTheme(
    <>
      <StatusBadge tone="error">Poor</StatusBadge>
      <StatusBadge tone="live">Live</StatusBadge>
    </>,
  );
  const poor = screen.getByText('Poor');
  const live = screen.getByText('Live');
  expect(getComputedStyle(poor).backgroundColor).not.toBe(getComputedStyle(live).backgroundColor);
  expect(poor.querySelector('svg')).not.toBeNull();
  expect(live.querySelector('svg')).toBeNull();
});
