import { useState } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { VolumeControl } from './VolumeControl.js';

describe('VolumeControl', () => {
  it('sets the volume from the slider', () => {
    const onChange = vi.fn();
    renderWithTheme(<VolumeControl label="Linus" value={0.5} onChange={onChange} />);
    const slider = screen.getByRole('slider', { name: 'Linus volume' });
    expect(slider).toHaveAttribute('aria-valuetext', '50%');
    fireEvent.change(slider, { target: { value: 80 } });
    expect(onChange).toHaveBeenCalledWith(0.8);
  });

  it('mutes, then unmutes back to the previous volume', () => {
    const onChange = vi.fn();
    function Harness() {
      const [value, setValue] = useState(0.4);
      return (
        <VolumeControl
          label="Linus"
          value={value}
          onChange={(v) => {
            onChange(v);
            setValue(v);
          }}
        />
      );
    }
    renderWithTheme(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Mute Linus' }));
    expect(onChange).toHaveBeenLastCalledWith(0);
    const unmute = screen.getByRole('button', { name: 'Unmute Linus' });
    expect(unmute).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(unmute);
    expect(onChange).toHaveBeenLastCalledWith(0.4);
  });

  it('unmutes to full volume when it started muted', () => {
    const onChange = vi.fn();
    renderWithTheme(<VolumeControl label="Screen" value={0} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Unmute Screen' }));
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
