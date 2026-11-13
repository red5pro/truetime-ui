import { act, fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { AudioLevelDots } from '../AudioLevelDots/AudioLevelDots.js';
import { SplitToolbarButton } from './SplitToolbarButton.js';

describe('SplitToolbarButton', () => {
  it('has a toggle and an options button that reports whether it is open', () => {
    const onClick = vi.fn();
    const onOptionsClick = vi.fn();
    const { rerender } = renderWithTheme(
      <SplitToolbarButton
        icon={<svg />}
        label="Turn off camera"
        optionsLabel="Camera options"
        optionsControls="camera-tray"
        onClick={onClick}
        onOptionsClick={onOptionsClick}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Turn off camera' }));
    expect(onClick).toHaveBeenCalled();
    const options = screen.getByRole('button', { name: 'Camera options' });
    expect(options).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(options);
    expect(onOptionsClick).toHaveBeenCalled();

    rerender(
      <SplitToolbarButton
        icon={<svg />}
        label="Turn off camera"
        optionsLabel="Camera options"
        optionsOpen
      />,
    );
    expect(screen.getByRole('button', { name: 'Camera options' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('shows the idle indicator only while closed', () => {
    const { container, rerender } = renderWithTheme(
      <SplitToolbarButton
        icon={<svg />}
        label="Mute"
        optionsLabel="Microphone options"
        idleIndicator={<AudioLevelDots active />}
      />,
    );
    expect(container.querySelector('[data-active]')).toBeInTheDocument();
    rerender(
      <SplitToolbarButton
        icon={<svg />}
        label="Mute"
        optionsLabel="Microphone options"
        optionsOpen
        idleIndicator={<AudioLevelDots active />}
      />,
    );
    expect(container.querySelector('[data-active]')).not.toBeInTheDocument();
  });
});

describe('SplitToolbarButton hover', () => {
  afterEach(() => vi.useRealTimers());

  it('reports a mouse resting on the options segment, but not a touch or a quick pass', () => {
    vi.useFakeTimers();
    const onOptionsHover = vi.fn();
    renderWithTheme(
      <SplitToolbarButton
        icon={<svg />}
        label="Turn off camera"
        optionsLabel="Camera options"
        onOptionsHover={onOptionsHover}
      />,
    );
    const options = screen.getByRole('button', { name: 'Camera options' });

    fireEvent.pointerEnter(options, { pointerType: 'touch' });
    act(() => vi.advanceTimersByTime(300));
    expect(onOptionsHover).not.toHaveBeenCalled();

    fireEvent.pointerEnter(options, { pointerType: 'mouse' });
    fireEvent.pointerLeave(options, { pointerType: 'mouse' });
    act(() => vi.advanceTimersByTime(300));
    expect(onOptionsHover).not.toHaveBeenCalled();

    fireEvent.pointerEnter(options, { pointerType: 'mouse' });
    act(() => vi.advanceTimersByTime(300));
    expect(onOptionsHover).toHaveBeenCalledTimes(1);
  });
});
