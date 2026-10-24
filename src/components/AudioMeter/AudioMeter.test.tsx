import { act, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { AudioMeter, meterPosition } from './AudioMeter.js';

describe('meterPosition', () => {
  it('maps -60 to 0 dBFS onto the meter', () => {
    expect(meterPosition(-Infinity)).toBe(0);
    expect(meterPosition(-80)).toBe(0);
    expect(meterPosition(-18)).toBeCloseTo(0.7);
    expect(meterPosition(-6)).toBeCloseTo(0.9);
    expect(meterPosition(3)).toBe(1);
  });
});

describe('AudioMeter', () => {
  beforeEach(() =>
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] }),
  );
  afterEach(() => vi.useRealTimers());

  it('draws the level it reads and holds the peak', () => {
    let level = 0.5;
    const { container } = renderWithTheme(
      <AudioMeter label="Ana’s audio level" getLevel={() => level} />,
    );
    expect(screen.getByRole('img', { name: 'Ana’s audio level' })).toBeInTheDocument();
    const fill = container.querySelector<HTMLElement>('[data-meter-fill]')!;
    const peak = container.querySelector<HTMLElement>('[data-meter-peak]')!;

    act(() => vi.advanceTimersByTime(100));
    expect(fill.style.clipPath).toBe('inset(50% 0 0 0)');
    expect(peak.style.bottom).toBe('calc(50% - 1px)');

    // Quieter: the bar drops, the peak stays for a while
    level = 0.2;
    act(() => vi.advanceTimersByTime(100));
    expect(fill.style.clipPath).toBe('inset(80% 0 0 0)');
    expect(peak.style.bottom).toBe('calc(50% - 1px)');
    act(() => vi.advanceTimersByTime(1600));
    expect(peak.style.bottom).toBe('calc(20% - 1px)');
  });

  it('runs sideways when horizontal', () => {
    const { container } = renderWithTheme(
      <AudioMeter label="Level" orientation="horizontal" getLevel={() => 0.25} />,
    );
    act(() => vi.advanceTimersByTime(100));
    expect(container.querySelector<HTMLElement>('[data-meter-fill]')!.style.clipPath).toBe(
      'inset(0 75% 0 0)',
    );
  });
});
