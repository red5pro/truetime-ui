import { render, screen } from '@testing-library/react';
import { ChatPanel } from '../components/ChatPanel/ChatPanel.js';
import { Spinner } from '../components/Spinner/Spinner.js';
import { VolumeControl } from '../components/VolumeControl/VolumeControl.js';
import { TrueTimeThemeProvider } from '../theme/TrueTimeThemeProvider.js';
import { UiTextProvider } from './UiText.js';

it('keeps the English defaults without a provider', () => {
  render(
    <TrueTimeThemeProvider>
      <Spinner />
    </TrueTimeThemeProvider>,
  );
  expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument();
});

it('translates the components’ own text, keeping English for what it leaves out', () => {
  render(
    <TrueTimeThemeProvider>
      <UiTextProvider
        text={{ loading: 'Wird geladen', mute: (name) => `${name} stummschalten`, you: 'Du' }}
      >
        <Spinner />
        <VolumeControl label="Linus" value={1} onChange={() => {}} />
        <ChatPanel
          messages={[{ id: '1', author: 'Grace', text: 'Hi', timestamp: '', mine: true }]}
          onSend={() => {}}
        />
      </UiTextProvider>
    </TrueTimeThemeProvider>,
  );
  expect(screen.getByRole('progressbar', { name: 'Wird geladen' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Linus stummschalten' })).toBeInTheDocument();
  expect(screen.getByText('Du')).toBeInTheDocument();
  // Not given: English
  expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
});
