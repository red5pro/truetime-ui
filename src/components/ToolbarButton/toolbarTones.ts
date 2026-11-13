import { alpha, darken, lighten, type Theme } from '@mui/material/styles';
import { themeColors } from '../styleUtils.js';

/**
 * How a control in the meeting bar reads:
 * - `default`: a neutral control (the device is on, the panel is closed)
 * - `active`: something it controls is on or showing (presenting, hand raised, panel open)
 * - `off`: the device it controls is off (camera off, microphone muted)
 * - `danger`: a destructive action such as leaving the call
 * - `ghost`: no fill until hovered, for secondary controls in a group
 */
export type ToolbarTone = 'default' | 'active' | 'off' | 'danger' | 'ghost';

export interface ToneColors {
  background: string;
  hover: string;
  color: string;
}

/** Fill, hover fill and icon color for a toolbar tone in the active theme. */
export function toolbarToneColors(theme: Theme, tone: ToolbarTone): ToneColors {
  const colors = themeColors(theme);
  switch (tone) {
    case 'active':
      return {
        background: lighten(colors.info, 0.7),
        hover: lighten(colors.info, 0.6),
        color: darken(colors.info, 0.7),
      };
    case 'off':
      return {
        background: lighten(colors.error, 0.85),
        hover: lighten(colors.error, 0.75),
        color: darken(colors.error, 0.55),
      };
    case 'danger':
      return {
        background: colors.error,
        hover: darken(colors.error, 0.12),
        color: theme.palette.getContrastText(colors.error),
      };
    case 'ghost':
      return {
        background: 'transparent',
        hover: alpha(colors.text, 0.08),
        color: colors.text,
      };
    default:
      return {
        background: colors.surfaceHover,
        hover: colors.border,
        color: colors.text,
      };
  }
}

/** The fill behind the options segment of a split button whose toggle has this tone. */
export function segmentColors(theme: Theme, tone: ToolbarTone): ToneColors {
  const colors = themeColors(theme);
  if (tone === 'off') {
    return {
      background: darken(colors.error, 0.65),
      hover: darken(colors.error, 0.55),
      color: lighten(colors.error, 0.85),
    };
  }
  return {
    // Half the toggle's fill, so the segment reads as part of the same control but recedes
    background: alpha(colors.surfaceHover, 0.55),
    hover: colors.surfaceHover,
    color: colors.text,
  };
}
