import { act, fireEvent, render, screen } from '@testing-library/react';
import { HOVER_CLOSE_DELAY_MS, HOVER_OPEN_DELAY_MS, useHoverIntent } from './useHoverIntent.js';

function Harness({
  enabled = true,
  onOpenChange,
}: {
  enabled?: boolean;
  onOpenChange?: (o: boolean) => void;
}) {
  const { open, pinned, triggerProps, panelProps, toggle } = useHoverIntent({
    enabled,
    onOpenChange,
  });
  return (
    <>
      <button {...triggerProps} onClick={toggle}>
        trigger
      </button>
      {open && (
        <div data-testid="panel" data-pinned={pinned} {...panelProps}>
          panel
        </div>
      )}
    </>
  );
}

const mouse = { pointerType: 'mouse' };

describe('useHoverIntent', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('opens after a rest on the trigger and closes after the grace once the mouse leaves', () => {
    const onOpenChange = vi.fn();
    render(<Harness onOpenChange={onOpenChange} />);
    fireEvent.pointerEnter(screen.getByText('trigger'), mouse);
    act(() => vi.advanceTimersByTime(HOVER_OPEN_DELAY_MS - 1));
    expect(screen.queryByTestId('panel')).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByTestId('panel')).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    fireEvent.pointerLeave(screen.getByText('trigger'), mouse);
    act(() => vi.advanceTimersByTime(HOVER_CLOSE_DELAY_MS));
    expect(screen.queryByTestId('panel')).toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('stays open while the mouse moves from the trigger into the panel', () => {
    render(<Harness />);
    fireEvent.pointerEnter(screen.getByText('trigger'), mouse);
    act(() => vi.advanceTimersByTime(HOVER_OPEN_DELAY_MS));
    fireEvent.pointerLeave(screen.getByText('trigger'), mouse);
    act(() => vi.advanceTimersByTime(HOVER_CLOSE_DELAY_MS / 2));
    fireEvent.pointerEnter(screen.getByTestId('panel'), mouse);
    act(() => vi.advanceTimersByTime(HOVER_CLOSE_DELAY_MS));
    expect(screen.getByTestId('panel')).toBeInTheDocument();
  });

  it('ignores a pass-through shorter than the rest', () => {
    render(<Harness />);
    fireEvent.pointerEnter(screen.getByText('trigger'), mouse);
    act(() => vi.advanceTimersByTime(HOVER_OPEN_DELAY_MS / 2));
    fireEvent.pointerLeave(screen.getByText('trigger'), mouse);
    act(() => vi.advanceTimersByTime(HOVER_OPEN_DELAY_MS * 4));
    expect(screen.queryByTestId('panel')).toBeNull();
  });

  it('opens only for a mouse, and not when disabled', () => {
    const { rerender } = render(<Harness />);
    fireEvent.pointerEnter(screen.getByText('trigger'), { pointerType: 'touch' });
    act(() => vi.advanceTimersByTime(HOVER_OPEN_DELAY_MS * 2));
    expect(screen.queryByTestId('panel')).toBeNull();
    rerender(<Harness enabled={false} />);
    fireEvent.pointerEnter(screen.getByText('trigger'), mouse);
    act(() => vi.advanceTimersByTime(HOVER_OPEN_DELAY_MS * 2));
    expect(screen.queryByTestId('panel')).toBeNull();
  });

  it('pins on click so leaving no longer closes it, and a second click closes it', () => {
    render(<Harness />);
    const trigger = screen.getByText('trigger');
    fireEvent.pointerEnter(trigger, mouse);
    act(() => vi.advanceTimersByTime(HOVER_OPEN_DELAY_MS));
    fireEvent.click(trigger);
    expect(screen.getByTestId('panel').dataset.pinned).toBe('true');
    fireEvent.pointerLeave(trigger, mouse);
    act(() => vi.advanceTimersByTime(HOVER_CLOSE_DELAY_MS * 2));
    expect(screen.getByTestId('panel')).toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.queryByTestId('panel')).toBeNull();
  });
});
