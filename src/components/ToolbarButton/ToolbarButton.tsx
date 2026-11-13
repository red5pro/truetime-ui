import { forwardRef, type ReactNode } from 'react';
import ButtonBase, { type ButtonBaseProps } from '@mui/material/ButtonBase';
import Tooltip from '@mui/material/Tooltip';
import { controlBar, disabledOpacity, motion, radii, typography } from '../../tokens/tokens.js';
import { focusRingStyle } from '../styleUtils.js';
import { toolbarToneColors, type ToolbarTone } from './toolbarTones.js';

export interface ToolbarButtonProps extends Omit<ButtonBaseProps, 'children'> {
  icon?: ReactNode;
  /** Accessible name, also shown as a tooltip when the button has no visible text. */
  label: string;
  /**
   * Visible text next to the icon. With `size="chip"` it is the accessible name (tray chips such as
   * "Blur background"); otherwise `label` stays the name (e.g. a participant count).
   */
  children?: ReactNode;
  tone?: ToolbarTone;
  /** `regular` toolbar control, `narrow` (more options), `wide` (leave call), `chip` (tray). */
  size?: 'regular' | 'narrow' | 'wide' | 'chip';
  /** For toggles: reported as `aria-pressed`. Leave undefined for plain actions. */
  pressed?: boolean;
  /** Hide the tooltip, e.g. when the button already shows its label. Defaults to chips. */
  hideTooltip?: boolean;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Pill control for a meeting toolbar (mic, camera, share, reactions, leave, …) and the chips in
 * its tray. Colors come from `tone`; the label is the accessible name and the tooltip.
 */
export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton(
    {
      icon,
      label,
      children,
      tone = 'default',
      size = 'regular',
      pressed,
      hideTooltip,
      tooltipPlacement = 'top',
      disabled,
      sx,
      ...props
    },
    ref,
  ) {
    const chip = size === 'chip';
    const button = (
      <ButtonBase
        ref={ref}
        aria-label={chip ? undefined : label}
        aria-pressed={pressed}
        disabled={disabled}
        sx={[
          (theme) => {
            const tones = toolbarToneColors(theme, tone);
            const height = chip ? controlBar.chipHeight : controlBar.buttonHeight;
            const width = chip
              ? undefined
              : size === 'narrow'
                ? controlBar.narrowWidth
                : size === 'wide'
                  ? controlBar.wideWidth
                  : controlBar.buttonWidth;
            return {
              height,
              minWidth: chip ? height : width,
              px: chip ? 2 : children != null ? 1.5 : 0,
              gap: 1,
              borderRadius: `${radii.pill}px`,
              backgroundColor: tones.background,
              color: tones.color,
              fontFamily: 'inherit',
              fontSize: typography.body2.fontSize,
              fontWeight: typography.button.fontWeight,
              whiteSpace: 'nowrap',
              transition: motion.standard,
              flexShrink: 0,
              '& svg': { fontSize: chip ? 20 : 24 },
              '@media (hover: hover)': { '&:hover': { backgroundColor: tones.hover } },
              '&.Mui-focusVisible': focusRingStyle(theme),
              '&.Mui-disabled': { opacity: disabledOpacity },
              ...(!chip && {
                [theme.breakpoints.down('md')]: {
                  height: controlBar.compactButtonHeight,
                  minWidth: size === 'regular' ? controlBar.compactButtonHeight : (width ?? 0) - 8,
                },
              }),
            };
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
      >
        {icon}
        {children}
      </ButtonBase>
    );

    if (hideTooltip ?? chip) return button;
    return (
      <Tooltip title={label} placement={tooltipPlacement}>
        {/* A disabled button fires no events, so the tooltip needs a wrapper to show */}
        {disabled ? <span style={{ display: 'inline-flex' }}>{button}</span> : button}
      </Tooltip>
    );
  },
);
