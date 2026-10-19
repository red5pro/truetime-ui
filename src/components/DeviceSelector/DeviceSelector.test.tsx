import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { DeviceSelector } from './DeviceSelector.js';

const devices = {
  videoInputs: [
    { deviceId: 'cam1', label: 'FaceTime HD', kind: 'videoinput' },
    { deviceId: 'cam2', label: 'USB Camera', kind: 'videoinput' },
  ],
  audioInputs: [{ deviceId: 'mic1', label: 'Built-in Mic', kind: 'audioinput' }],
  audioOutputs: [],
};

describe('DeviceSelector', () => {
  it('shows the selected devices and switches camera', () => {
    const onCameraChange = vi.fn();
    renderWithTheme(
      <DeviceSelector
        devices={devices}
        selectedCamera="cam1"
        selectedMicrophone="mic1"
        onCameraChange={onCameraChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /FaceTime HD/ }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'USB Camera' }));
    expect(onCameraChange).toHaveBeenLastCalledWith('cam2');
  });

  it('shows the full name of a long device on hover', () => {
    const long =
      'MacBook Pro Microphone (Built-in) with an unusually long device description (05ac:8514)';
    renderWithTheme(
      <DeviceSelector
        devices={{
          ...devices,
          audioInputs: [{ deviceId: 'mic1', label: long, kind: 'audioinput' }],
        }}
        selectedCamera="cam1"
        selectedMicrophone="mic1"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /MacBook Pro Microphone/ }));
    const item = screen.getByRole('menuitem', { name: long });
    expect(item).toHaveAttribute('title', long);
  });

  it('disables pickers without devices', () => {
    renderWithTheme(
      <DeviceSelector devices={devices} selectedCamera="cam1" selectedMicrophone="mic1" />,
    );
    expect(screen.getByRole('button', { name: /no device selected/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /FaceTime HD/ })).toBeEnabled();
  });

  it('stacks the pickers at full width when vertical', () => {
    renderWithTheme(
      <DeviceSelector devices={devices} selectedCamera="cam1" orientation="vertical" />,
    );
    const camera = screen.getByRole('button', { name: /FaceTime HD/ });
    expect(camera).toHaveClass('MuiButton-fullWidth');
    expect(camera.parentElement).toHaveStyle({ flexDirection: 'column' });
  });
});
