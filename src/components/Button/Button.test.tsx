import { act, fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { Button } from './Button.js';

describe('Button', () => {
  it('renders a contained button that handles clicks', () => {
    const onClick = vi.fn();
    renderWithTheme(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('MuiButton-contained');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled and busy while loading', () => {
    const onClick = vi.fn();
    renderWithTheme(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: /save/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('Button as a link', () => {
  it('renders the given component', () => {
    renderWithTheme(
      <Button component="a" href="/studios" variant="text">
        Studios
      </Button>,
    );
    expect(screen.getByRole('link', { name: 'Studios' })).toHaveAttribute('href', '/studios');
  });
});

describe('Button with holdMs', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('confirms only once it is held long enough', () => {
    const onHoldComplete = vi.fn();
    renderWithTheme(
      <Button holdMs={600} onHoldComplete={onHoldComplete}>
        Go Live
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Go Live' });
    expect(button).toHaveAttribute('aria-description', 'Press and hold');

    // Let go early: nothing happens
    fireEvent.pointerDown(button, { button: 0 });
    act(() => vi.advanceTimersByTime(300));
    fireEvent.pointerUp(button);
    act(() => vi.advanceTimersByTime(600));
    expect(onHoldComplete).not.toHaveBeenCalled();

    fireEvent.pointerDown(button, { button: 0 });
    expect(button).toHaveAttribute('data-holding', 'true');
    act(() => vi.advanceTimersByTime(600));
    expect(onHoldComplete).toHaveBeenCalledOnce();
    expect(button).not.toHaveAttribute('data-holding');
  });

  it('holds with Space or Enter, and a click alone does nothing', () => {
    const onHoldComplete = vi.fn();
    renderWithTheme(
      <Button holdMs={600} onHoldComplete={onHoldComplete}>
        Go Live
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Go Live' });
    fireEvent.click(button);
    expect(onHoldComplete).not.toHaveBeenCalled();

    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyDown(button, { key: 'Enter', repeat: true });
    act(() => vi.advanceTimersByTime(599));
    fireEvent.keyUp(button, { key: 'Enter' });
    act(() => vi.advanceTimersByTime(10));
    expect(onHoldComplete).not.toHaveBeenCalled();

    fireEvent.keyDown(button, { key: ' ' });
    act(() => vi.advanceTimersByTime(600));
    expect(onHoldComplete).toHaveBeenCalledOnce();
  });

  it('reports a hold let go too early, but not one held long enough', () => {
    const onHoldCancel = vi.fn();
    renderWithTheme(
      <Button holdMs={600} onHoldCancel={onHoldCancel}>
        Go Live
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Go Live' });
    fireEvent.pointerDown(button, { button: 0 });
    act(() => vi.advanceTimersByTime(100));
    fireEvent.pointerUp(button);
    expect(onHoldCancel).toHaveBeenCalledOnce();

    // Leaving and letting go without a hold, or after a full one, isn't a cancel
    fireEvent.pointerLeave(button);
    fireEvent.pointerDown(button, { button: 0 });
    act(() => vi.advanceTimersByTime(600));
    fireEvent.pointerUp(button);
    expect(onHoldCancel).toHaveBeenCalledOnce();
  });
});
