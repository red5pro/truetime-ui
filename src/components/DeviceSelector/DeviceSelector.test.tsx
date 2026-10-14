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

  it('disables pickers without devices', () => {
    renderWithTheme(
      <DeviceSelector devices={devices} selectedCamera="cam1" selectedMicrophone="mic1" />,
    );
    expect(screen.getByRole('button', { name: /no device selected/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /FaceTime HD/ })).toBeEnabled();
  });
});
