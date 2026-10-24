import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { Keycap } from './Keycap.js';

it('shows a key as <kbd>', () => {
  renderWithTheme(<Keycap>T</Keycap>);
  const key = screen.getByText('T');
  expect(key.tagName).toBe('KBD');
  expect(getComputedStyle(key).fontFamily).toContain('JetBrains Mono');
});
