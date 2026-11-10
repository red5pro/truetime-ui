import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { UiTextProvider } from '../../text/UiText.js';
import { CaptionsOverlay } from './CaptionsOverlay.js';

const captions = [
  { id: '1', speaker: 'Ana', text: 'Welcome everyone' },
  { id: '2', speaker: 'Ben', text: 'Thanks for having me' },
  { id: '3', text: 'Unattributed line' },
  { id: '4', speaker: 'Ana', text: 'Let us begin' },
];

it('shows only the latest lines, with the speaker before the text', () => {
  renderWithTheme(<CaptionsOverlay captions={captions} maxLines={2} />);
  const log = screen.getByRole('log', { name: 'Captions' });
  expect(log).toHaveAttribute('aria-live', 'polite');
  expect(log).toHaveTextContent('Unattributed line');
  expect(log).toHaveTextContent('Ana:Let us begin');
  expect(log).not.toHaveTextContent('Welcome everyone');
  expect(log).not.toHaveTextContent('Ben:');
});

it('keeps an empty live region so the first caption is announced', () => {
  renderWithTheme(<CaptionsOverlay captions={[]} />);
  expect(screen.getByRole('log', { name: 'Captions' })).toBeEmptyDOMElement();
});

it('takes its label from the app’s UI text', () => {
  renderWithTheme(
    <UiTextProvider text={{ captions: 'Untertitel' }}>
      <CaptionsOverlay captions={captions} />
    </UiTextProvider>,
  );
  expect(screen.getByRole('log', { name: 'Untertitel' })).toBeInTheDocument();
});
