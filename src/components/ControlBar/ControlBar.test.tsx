import { act, fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { ControlBar } from './ControlBar.js';

describe('ControlBar', () => {
  it('is a labelled toolbar with a tray that shows only when open', () => {
    const onTrayClose = vi.fn();
    const { rerender } = renderWithTheme(
      <ControlBar label="Call controls" tray={<button>Blur</button>} trayLabel="Camera options">
        <button>Mute</button>
      </ControlBar>,
    );
    expect(screen.getByRole('toolbar', { name: 'Call controls' })).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Camera options' })).not.toBeInTheDocument();

    rerender(
      <ControlBar
        label="Call controls"
        tray={<button>Blur</button>}
        trayOpen
        trayLabel="Camera options"
        onTrayClose={onTrayClose}
      >
        <button>Mute</button>
      </ControlBar>,
    );
    const tray = screen.getByRole('group', { name: 'Camera options' });
    fireEvent.keyDown(screen.getByRole('button', { name: 'Blur' }), { key: 'Escape' });
    expect(tray).toBeInTheDocument();
    expect(onTrayClose).toHaveBeenCalled();
  });
});

describe('ControlBar hover end', () => {
  afterEach(() => vi.useRealTimers());

  it('reports the mouse leaving after a moment, unless it comes back', () => {
    vi.useFakeTimers();
    const onHoverEnd = vi.fn();
    renderWithTheme(
      <ControlBar label="Call controls" onHoverEnd={onHoverEnd}>
        <button>Mute</button>
      </ControlBar>,
    );
    const bar = screen.getByRole('toolbar').parentElement!;

    fireEvent.pointerLeave(bar, { pointerType: 'mouse' });
    fireEvent.pointerEnter(bar, { pointerType: 'mouse' });
    act(() => vi.advanceTimersByTime(500));
    expect(onHoverEnd).not.toHaveBeenCalled();

    fireEvent.pointerLeave(bar, { pointerType: 'mouse' });
    act(() => vi.advanceTimersByTime(500));
    expect(onHoverEnd).toHaveBeenCalledTimes(1);
  });
});
