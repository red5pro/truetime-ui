import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { ChatPanel } from './ChatPanel.js';

const messages = [
  { id: '1', author: 'Ada', text: 'Hello', timestamp: '2026-10-13T10:00:00Z' },
  { id: '2', author: 'Me', text: 'Hi there', timestamp: '2026-10-13T10:01:00Z', mine: true },
];

describe('ChatPanel', () => {
  it('lists messages and labels my own as You', () => {
    renderWithTheme(<ChatPanel messages={messages} onSend={() => {}} />);
    const log = screen.getByRole('log', { name: 'Chat messages' });
    expect(log).toHaveTextContent('Hello');
    expect(log).toHaveTextContent(/You ·/);
  });

  it('shows the empty state', () => {
    renderWithTheme(<ChatPanel messages={[]} onSend={() => {}} emptyText="Say hi" />);
    expect(screen.getByText('Say hi')).toBeInTheDocument();
  });

  it('sends trimmed text on Enter and clears the draft', () => {
    const onSend = vi.fn();
    renderWithTheme(<ChatPanel messages={[]} onSend={onSend} />);
    const input = screen.getByRole('textbox', { name: 'Send a message' });
    fireEvent.change(input, { target: { value: '  hey  ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSend).toHaveBeenCalledWith('hey');
    expect(input).toHaveValue('');
  });

  it('keeps the draft when sending fails and ignores blank input', () => {
    const onSend = vi.fn(() => false);
    renderWithTheme(<ChatPanel messages={[]} onSend={onSend} />);
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
    const input = screen.getByRole('textbox', { name: 'Send a message' });
    fireEvent.change(input, { target: { value: 'hey' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    expect(input).toHaveValue('hey');
  });

  it('replaces the composer when unavailable', () => {
    renderWithTheme(<ChatPanel messages={[]} onSend={() => {}} unavailable="Chat is off" />);
    expect(screen.getByText('Chat is off')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
