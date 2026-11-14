import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Typography, LinearProgress, alpha } from '@mui/material';
import { Videocam, VideocamOff, Mic, MicOff, VolumeUp } from '@mui/icons-material';
import { DeviceMenuButton, type DeviceOption } from '../DeviceMenuButton/DeviceMenuButton.js';
import { useUiText } from '../../text/UiText.js';

export interface Device {
  deviceId: string;
  label: string;
  kind: string;
}

export interface Devices {
  videoInputs?: Device[];
  audioInputs?: Device[];
  audioOutputs?: Device[];
}

export interface DeviceSelectorProps {
  devices: Devices;
  /** Offer front/back camera choices instead of the device list (phones and tablets). */
  isMobile?: boolean;
  selectedCamera?: string;
  selectedMicrophone?: string;
  selectedSpeaker?: string;
  onCameraChange?: (deviceId: string) => void;
  onMicrophoneChange?: (deviceId: string) => void;
  onSpeakerChange?: (deviceId: string) => void;
  isCameraOn?: boolean;
  isMicOn?: boolean;
  /**
   * `horizontal` (default): the pickers side by side, sized to the window (the Meetings lobby).
   * `vertical`: stacked at full width, for narrow places such as a settings popup.
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Horizontal only: span the parent's width and share it between the pickers, wrapping on narrow
   * screens, so the row lines up with what is above or below it (e.g. a video preview).
   */
  fullWidth?: boolean;
  /** Open a picker's list when the mouse rests on it (see DeviceMenuButton). */
  openOnHover?: boolean;
}

// Extend Window interface for AudioContext
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

/**
 * Camera / microphone / speaker pickers with a live microphone level meter, as used in the
 * Meetings lobby. Selection is controlled by the parent through the on*Change callbacks.
 */
export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  devices,
  isMobile = false,
  selectedCamera,
  selectedMicrophone,
  selectedSpeaker,
  onCameraChange,
  onMicrophoneChange,
  onSpeakerChange,
  isCameraOn = true,
  isMicOn = true,
  orientation = 'horizontal',
  fullWidth = false,
  openOnHover = false,
}) => {
  const vertical = orientation === 'vertical';
  const grow = !vertical && fullWidth;
  const [micMenuOpen, setMicMenuOpen] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [selectedFacingMode, setSelectedFacingMode] = useState<'user' | 'environment' | null>(null);

  const text = useUiText();
  const mobileCameraOptions = [
    { id: 'facingMode:user', label: text.frontCamera, facingMode: 'user' as const },
    { id: 'facingMode:environment', label: text.backCamera, facingMode: 'environment' as const },
  ];

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize default selections
  useEffect(() => {
    if (!selectedCamera && devices.videoInputs?.length && devices.videoInputs.length > 0) {
      onCameraChange?.(devices.videoInputs[0].deviceId);
    } else if (selectedCamera) {
      onCameraChange?.(selectedCamera);
    }
    if (!selectedMicrophone && devices.audioInputs?.length && devices.audioInputs.length > 0) {
      onMicrophoneChange?.(devices.audioInputs[0].deviceId);
    } else if (selectedMicrophone) {
      onMicrophoneChange?.(selectedMicrophone);
    }
    if (!selectedSpeaker && devices.audioOutputs?.length && devices.audioOutputs.length > 0) {
      onSpeakerChange?.(devices.audioOutputs[0].deviceId);
    } else if (selectedSpeaker) {
      onSpeakerChange?.(selectedSpeaker);
    }
  }, [
    devices,
    selectedCamera,
    selectedMicrophone,
    selectedSpeaker,
    onCameraChange,
    onMicrophoneChange,
    onSpeakerChange,
  ]);

  // Audio level monitoring
  const startAudioLevelMonitoring = useCallback(async (): Promise<void> => {
    try {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedMicrophone ? { deviceId: selectedMicrophone } : true,
      });

      micStreamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext!)();
      analyserRef.current = audioContextRef.current.createAnalyser();

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      analyserRef.current.fftSize = 256;
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const updateAudioLevel = (): void => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          setAudioLevel(Math.min(100, (average / 128) * 100));
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };

      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      queueMicrotask(() => setAudioLevel(0));
    }
  }, [selectedMicrophone]);

  const stopAudioLevelMonitoring = useCallback((): void => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    queueMicrotask(() => setAudioLevel(0));
  }, []);

  // Start/stop audio monitoring when microphone menu opens/closes
  useEffect(() => {
    if (micMenuOpen && isMicOn) {
      startAudioLevelMonitoring();
    } else {
      stopAudioLevelMonitoring();
    }

    return () => stopAudioLevelMonitoring();
  }, [micMenuOpen, isMicOn, startAudioLevelMonitoring, stopAudioLevelMonitoring]);

  const handleCameraSelect = useCallback(
    (deviceId: string) => {
      if (deviceId.startsWith('facingMode:')) {
        setSelectedFacingMode(deviceId.split(':')[1] as 'user' | 'environment');
      }
      onCameraChange?.(deviceId);
    },
    [onCameraChange],
  );

  const toOptions = (list?: Device[]): DeviceOption[] =>
    (list ?? []).map((device) => ({ value: device.deviceId, label: device.label }));

  const cameraOptions: DeviceOption[] = isMobile
    ? mobileCameraOptions.map((option) => ({ value: option.id, label: option.label }))
    : toOptions(devices.videoInputs);

  const pickerProps = {
    openOnHover,
    placement: 'bottom' as const,
    fullWidth: vertical,
    maxWidth: vertical ? '100%' : undefined,
    sx: grow
      ? { flex: '1 1 160px', minWidth: 0, maxWidth: 'none' }
      : vertical
        ? undefined
        : {
            minWidth: { xs: '20vw', sm: '15vw', md: '12vw', lg: '10vw' },
            maxWidth: { xs: '25vw', sm: '18vw', md: '15vw', lg: '13vw' },
          },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        gap: 1,
        position: 'relative',
        zIndex: 1000,
        p: vertical ? 1 : 2,
        backgroundColor: alpha('#000', 0.1),
        backdropFilter: 'blur(20px)',
        borderRadius: 2,
        border: `1px solid ${alpha('#fff', 0.1)}`,
        width: vertical || grow ? '100%' : { xs: '100%', sm: 'fit-content' },
        maxWidth: '100%',
        flexWrap: 'wrap',
      }}
    >
      <DeviceMenuButton
        icon={isCameraOn ? <Videocam /> : <VideocamOff />}
        label={text.camera}
        options={cameraOptions}
        value={isMobile && selectedFacingMode ? `facingMode:${selectedFacingMode}` : selectedCamera}
        onChange={handleCameraSelect}
        emptyText={text.noDeviceSelected}
        {...pickerProps}
      />
      <DeviceMenuButton
        icon={isMicOn ? <Mic /> : <MicOff />}
        label={text.microphone}
        options={toOptions(devices.audioInputs)}
        value={selectedMicrophone}
        onChange={(deviceId) => onMicrophoneChange?.(deviceId)}
        emptyText={text.noDeviceSelected}
        onOpenChange={setMicMenuOpen}
        menuFooter={
          isMicOn ? (
            <Box sx={{ px: 2, pt: 1, pb: 1.5 }}>
              <LinearProgress
                variant="determinate"
                value={audioLevel}
                aria-label={text.microphone}
                sx={(theme) => ({
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.text.primary, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    backgroundColor:
                      audioLevel > 80
                        ? theme.palette.error.main
                        : audioLevel > 50
                          ? theme.palette.warning.main
                          : theme.palette.success.main,
                  },
                })}
              />
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>
                {Math.round(audioLevel)}%
              </Typography>
            </Box>
          ) : null
        }
        {...pickerProps}
      />
      <DeviceMenuButton
        icon={<VolumeUp />}
        label={text.speaker}
        options={toOptions(devices.audioOutputs)}
        value={selectedSpeaker}
        onChange={(deviceId) => onSpeakerChange?.(deviceId)}
        emptyText={text.noDeviceSelected}
        {...pickerProps}
      />
    </Box>
  );
};
