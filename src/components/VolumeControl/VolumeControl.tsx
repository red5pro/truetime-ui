import { useEffect, useRef } from 'react';
import Box, { type BoxProps } from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import { VolumeDown, VolumeOff, VolumeUp } from '@mui/icons-material';
import { focusRingStyle, themeColors } from '../styleUtils.js';
import { useUiText } from '../../text/UiText.js';

// The theme's IconButton padding (createTrueTimeTheme), MUI's size="small" Slider thumb, and the
// blank space at the left of the volume icons (3 of 24 units, at 20px)
const BUTTON_PADDING = 8;
const SMALL_THUMB_SIZE = 12;
const ICON_INSET = 2.5;

export interface VolumeControlProps extends Omit<BoxProps, 'onChange'> {
  /** Playback volume, 0 (muted) to 1. */
  value: number;
  onChange: (value: number) => void;
  /** What is being played, used in the accessible names ("Linus volume", "Mute Linus"). */
  label: string;
  disabled?: boolean;
}

/**
 * A mute button and a volume slider for one audio source. Unmuting goes back to the volume set
 * before muting (full volume if it started muted). The icon and the slider's thumb (at either end)
 * line up with the edges of the box, so it sits evenly in its container.
 */
export function VolumeControl({
  value,
  onChange,
  label,
  disabled = false,
  sx,
  ...props
}: VolumeControlProps) {
  const lastAudible = useRef(value > 0 ? value : 1);
  useEffect(() => {
    if (value > 0) lastAudible.current = value;
  }, [value]);
  const muted = value === 0;
  const text = useUiText();

  return (
    <Box
      sx={[
        { display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      <IconButton
        size="small"
        aria-label={muted ? text.unmute(label) : text.mute(label)}
        aria-pressed={muted}
        disabled={disabled}
        onClick={() => onChange(muted ? lastAudible.current : 0)}
        sx={(theme) => ({
          // The icon, not the button's padding, starts at the left edge
          ml: `-${BUTTON_PADDING}px`,
          color: themeColors(theme).text,
          '&.Mui-focusVisible': focusRingStyle(theme),
        })}
      >
        {muted ? (
          <VolumeOff fontSize="small" />
        ) : value < 0.5 ? (
          <VolumeDown fontSize="small" />
        ) : (
          <VolumeUp fontSize="small" />
        )}
      </IconButton>
      <Slider
        size="small"
        min={0}
        max={100}
        value={Math.round(value * 100)}
        disabled={disabled}
        onChange={(_, next) => onChange((Array.isArray(next) ? next[0]! : next) / 100)}
        getAriaValueText={(v) => `${v}%`}
        slotProps={{ input: { 'aria-label': `${label} volume` } }}
        sx={(theme) => {
          const colors = themeColors(theme);
          return {
            flex: 1,
            minWidth: 0,
            // The thumb is centred on the track's ends, so the track is inset by half of it to keep
            // the thumb inside the box, and on the right by the icon's blank space too, to match
            ml: `${SMALL_THUMB_SIZE / 2}px`,
            mr: `${SMALL_THUMB_SIZE / 2 + ICON_INSET}px`,
            color: colors.info,
            '& .MuiSlider-rail': { backgroundColor: colors.surfaceHover, opacity: 1 },
            '& .MuiSlider-thumb': {
              color: colors.text,
              boxShadow: 'none',
              '&:hover, &.Mui-active': { boxShadow: 'none' },
              '&.Mui-focusVisible': { boxShadow: 'none', ...focusRingStyle(theme) },
            },
          };
        }}
      />
    </Box>
  );
}
