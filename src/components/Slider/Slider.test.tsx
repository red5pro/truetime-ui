import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { Slider } from './Slider.js';

describe('Slider', () => {
  it('is a named slider that reports its value', () => {
    const onChange = vi.fn();
    renderWithTheme(
      <Slider
        min={0}
        max={100}
        step={10}
        value={40}
        onChange={(_, value) => onChange(value)}
        getAriaValueText={(value) => `${value}% removed`}
        slotProps={{ input: { 'aria-label': 'Noise suppression level' } }}
      />,
    );
    const slider = screen.getByRole('slider', { name: 'Noise suppression level' });
    expect(slider).toHaveAttribute('aria-valuetext', '40% removed');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(50);
  });

  it('can be disabled', () => {
    renderWithTheme(
      <Slider disabled value={20} slotProps={{ input: { 'aria-label': 'Level' } }} />,
    );
    expect(screen.getByRole('slider', { name: 'Level' })).toBeDisabled();
  });
});
