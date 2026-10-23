import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { TruncatedText } from './TruncatedText.js';

/** jsdom doesn't lay out text, so the widths are set by hand. */
function setWidths(el: HTMLElement, scrollWidth: number, clientWidth: number) {
  Object.defineProperty(el, 'scrollWidth', { configurable: true, value: scrollWidth });
  Object.defineProperty(el, 'clientWidth', { configurable: true, value: clientWidth });
}

it('shows the whole text in a tooltip when it is cut short', async () => {
  renderWithTheme(<TruncatedText>Ada Lovelace-Byron</TruncatedText>);
  const text = screen.getByText('Ada Lovelace-Byron');
  setWidths(text, 140, 60);
  fireEvent.mouseOver(text);
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Ada Lovelace-Byron');
});

it('shows no tooltip when the text fits', async () => {
  renderWithTheme(<TruncatedText>Ada</TruncatedText>);
  const text = screen.getByText('Ada');
  setWidths(text, 30, 60);
  fireEvent.mouseOver(text);
  // Give a tooltip time to appear before checking it didn't
  await new Promise((resolve) => setTimeout(resolve, 150));
  expect(screen.queryByRole('tooltip')).toBeNull();
});
