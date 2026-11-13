import { act, fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { DeviceMenuButton } from './DeviceMenuButton.js';

const options = [
  { value: 'frost', label: 'FrostCam' },
  { value: 'obs', label: 'OBS Virtual Camera' },
  { value: 'mac', label: 'MacBook Air Camera' },
];

function hover(element: Element, type: 'pointerEnter' | 'pointerLeave') {
  fireEvent[type](element, { pointerType: 'mouse' });
}

describe('DeviceMenuButton', () => {
  afterEach(() => vi.useRealTimers());

  it('shows the selected device and switches on click', () => {
    const onChange = vi.fn();
    renderWithTheme(
      <DeviceMenuButton label="Camera" options={options} value="mac" onChange={onChange} />,
    );
    const button = screen.getByRole('button', { name: 'Camera: MacBook Air Camera' });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitemradio', { name: 'MacBook Air Camera' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'FrostCam' }));
    expect(onChange).toHaveBeenCalledWith('frost');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens when the mouse rests on it and closes when it leaves', () => {
    vi.useFakeTimers();
    renderWithTheme(<DeviceMenuButton label="Camera" options={options} value="mac" />);
    const button = screen.getByRole('button', { name: /Camera/ });

    hover(button, 'pointerEnter');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Moving onto the list keeps it open
    hover(button, 'pointerLeave');
    hover(screen.getByRole('menu').closest('.MuiPaper-root')!, 'pointerEnter');
    act(() => vi.advanceTimersByTime(500));
    expect(button).toHaveAttribute('aria-expanded', 'true');

    hover(screen.getByRole('menu').closest('.MuiPaper-root')!, 'pointerLeave');
    act(() => vi.advanceTimersByTime(500));
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('stays open after a click even when the mouse leaves', () => {
    vi.useFakeTimers();
    renderWithTheme(<DeviceMenuButton label="Camera" options={options} value="mac" />);
    const button = screen.getByRole('button', { name: /Camera/ });
    hover(button, 'pointerEnter');
    act(() => vi.advanceTimersByTime(200));
    fireEvent.click(button);
    hover(button, 'pointerLeave');
    act(() => vi.advanceTimersByTime(500));
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('ignores hover when openOnHover is off, and touch hovers always', () => {
    vi.useFakeTimers();
    renderWithTheme(
      <>
        <DeviceMenuButton label="Camera" options={options} value="mac" openOnHover={false} />
        <DeviceMenuButton label="Microphone" options={options} value="mac" />
      </>,
    );
    hover(screen.getByRole('button', { name: /^Camera/ }), 'pointerEnter');
    fireEvent.pointerEnter(screen.getByRole('button', { name: /^Microphone/ }), {
      pointerType: 'touch',
    });
    act(() => vi.advanceTimersByTime(500));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes on Escape and is disabled without options', () => {
    renderWithTheme(
      <>
        <DeviceMenuButton label="Camera" options={options} value="mac" />
        <DeviceMenuButton label="Speaker" options={[]} emptyText="No device selected" />
      </>,
    );
    const button = screen.getByRole('button', { name: /^Camera/ });
    fireEvent.keyDown(button, { key: 'ArrowUp' });
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Speaker: No device selected' })).toBeDisabled();
  });
});
