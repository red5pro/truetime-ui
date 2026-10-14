import { forwardRef } from 'react';
import MuiButton, {
  type ButtonProps as MuiButtonProps,
  type ButtonTypeMap,
} from '@mui/material/Button';
import type { ExtendButtonBase } from '@mui/material/ButtonBase';
import type { SxProps, Theme } from '@mui/material/styles';
import { radii } from '../../tokens/tokens.js';
import { focusRingStyle } from '../styleUtils.js';

interface ButtonOwnProps {
  /** `pill` is the rounded CTA shape used for primary page actions. */
  shape?: 'rounded' | 'pill';
}

export type ButtonProps = MuiButtonProps & ButtonOwnProps;

const baseSx: SxProps<Theme> = (theme) => ({
  '&.Mui-focusVisible': focusRingStyle(theme),
  '&.MuiButton-loading': { cursor: 'progress' },
});

/**
 * MUI Button with TrueTime defaults (contained), a pill shape, a visible keyboard focus ring and
 * a `loading` state that disables the button and announces it as busy. Like MUI's Button it
 * accepts `component` (e.g. a router Link) and `href`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { shape = 'rounded', variant = 'contained', loading = false, sx, ...props },
  ref,
) {
  return (
    <MuiButton
      ref={ref}
      variant={variant}
      loading={loading}
      aria-busy={loading || undefined}
      sx={[
        baseSx,
        shape === 'pill' && { borderRadius: `${radii.pill}px` },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}) as ExtendButtonBase<ButtonTypeMap<ButtonOwnProps>>;
