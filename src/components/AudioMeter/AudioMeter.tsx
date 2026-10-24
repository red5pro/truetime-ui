import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';
import { themeColors } from '../styleUtils.js';

/** Meter scale: -60 dBFS (empty) to 0 dBFS (full). */
const FLOOR_DB = -60;
/** Where the green part ends (-18 dBFS) and the amber part ends (-6 dBFS), as shares of the meter. */
const AMBER_AT = 0.7;
const RED_AT = 0.9;
const PEAK_HOLD_MS = 1500;
/** At most this many redraws a second; meters don't need every frame. */
const FRAME_MS = 1000 / 30;

/** dBFS (FLOOR_DB to 0) as a meter position (0 to 1). */
export function meterPosition(db: number): number {
  if (!Number.isFinite(db)) return 0;
  return Math.min(1, Math.max(0, (db - FLOOR_DB) / -FLOOR_DB));
}

type AudioContextClass = typeof AudioContext;
let sharedContext: AudioContext | null = null;
/** One AudioContext for every meter on the page (browsers limit how many there can be). */
function audioContext(): AudioContext | null {
  if (sharedContext) return sharedContext;
  const Context: AudioContextClass | undefined =
    typeof window === 'undefined'
      ? undefined
      : (window.AudioContext ??
        (window as unknown as { webkitAudioContext?: AudioContextClass }).webkitAudioContext);
  if (!Context) return null;
  sharedContext = new Context();
  return sharedContext;
}

/**
 * Reads a stream's audio level as a meter position (0 to 1, RMS in dBFS), or null when the stream
 * has no audio or the browser can't measure it. `stop` disconnects it.
 */
export function streamLevelReader(
  stream: MediaStream,
): { read: () => number; stop: () => void } | null {
  if (!stream.getAudioTracks().length) return null;
  const context = audioContext();
  if (!context) return null;
  try {
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const samples = new Float32Array(analyser.fftSize);
    return {
      read: () => {
        analyser.getFloatTimeDomainData(samples);
        let sum = 0;
        for (const s of samples) sum += s * s;
        const rms = Math.sqrt(sum / samples.length);
        return meterPosition(20 * Math.log10(rms));
      },
      stop: () => source.disconnect(),
    };
  } catch {
    return null;
  }
}

export interface AudioMeterProps {
  /** Measured from this stream's audio. */
  stream?: MediaStream | null;
  /** Or read from here on each redraw: a meter position, 0 to 1 (see `meterPosition`). */
  getLevel?: () => number;
  orientation?: 'vertical' | 'horizontal';
  /** Length along the meter, and its thickness, in px (or any CSS length for length). */
  length?: number | string;
  thickness?: number;
  /** Names the source, e.g. "Ana’s audio level". */
  label: string;
  sx?: SxProps<Theme>;
}

/**
 * Compact audio level meter: green to -18 dBFS, amber to -6, red above, with the peak held for
 * 1.5s. Redrawn on animation frames straight to the DOM, so many meters don't re-render React.
 */
export function AudioMeter({
  stream,
  getLevel,
  orientation = 'vertical',
  length = 40,
  thickness = 4,
  label,
  sx,
}: AudioMeterProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const peakRef = useRef<HTMLDivElement>(null);
  const readLevel = useRef(getLevel);
  useEffect(() => {
    readLevel.current = getLevel;
  });
  const vertical = orientation === 'vertical';

  useEffect(() => {
    const reader = stream ? streamLevelReader(stream) : null;
    const read = () => reader?.read() ?? readLevel.current?.() ?? 0;
    let frame = 0;
    let last = -Infinity;
    let peak = 0;
    let peakAt = 0;
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (now - last < FRAME_MS) return;
      last = now;
      const level = Math.min(1, Math.max(0, read()));
      if (level >= peak || now - peakAt > PEAK_HOLD_MS) {
        peak = level;
        peakAt = now;
      }
      const hidden = `${(1 - level) * 100}%`;
      if (fillRef.current) {
        fillRef.current.style.clipPath = vertical
          ? `inset(${hidden} 0 0 0)`
          : `inset(0 ${hidden} 0 0)`;
      }
      if (peakRef.current) {
        peakRef.current.style[vertical ? 'bottom' : 'left'] = `calc(${peak * 100}% - 1px)`;
        peakRef.current.style.opacity = peak > 0.02 ? '1' : '0';
      }
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      reader?.stop();
    };
  }, [stream, vertical]);

  return (
    <Box
      role="img"
      aria-label={label}
      sx={[
        (theme) => ({
          position: 'relative',
          flexShrink: 0,
          overflow: 'hidden',
          borderRadius: `${thickness / 2}px`,
          backgroundColor: alpha(themeColors(theme).text, 0.12),
          ...(vertical
            ? { width: thickness, height: length }
            : { width: length, height: thickness }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        ref={fillRef}
        data-meter-fill
        sx={(theme) => {
          const colors = themeColors(theme);
          const stops = `${colors.success} 0%, ${colors.success} ${AMBER_AT * 100}%, ${colors.warning} ${AMBER_AT * 100}%, ${colors.warning} ${RED_AT * 100}%, ${colors.program} ${RED_AT * 100}%`;
          return {
            position: 'absolute',
            inset: 0,
            clipPath: vertical ? 'inset(100% 0 0 0)' : 'inset(0 100% 0 0)',
            backgroundImage: `linear-gradient(${vertical ? 'to top' : 'to right'}, ${stops})`,
          };
        }}
      />
      <Box
        ref={peakRef}
        data-meter-peak
        sx={(theme) => ({
          position: 'absolute',
          opacity: 0,
          backgroundColor: themeColors(theme).text,
          ...(vertical
            ? { left: 0, right: 0, height: 2, bottom: 0 }
            : { top: 0, bottom: 0, width: 2, left: 0 }),
        })}
      />
    </Box>
  );
}
