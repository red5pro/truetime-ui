import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import MuiButton, {
  type ButtonProps as MuiButtonProps,
  type ButtonTypeMap,
} from '@mui/material/Button';
import type { ExtendButtonBase } from '@mui/material/ButtonBase';
import type { SxProps, Theme } from '@mui/material/styles';
import { radii } from '../../tokens/tokens.js';
import { focusRingStyle } from '../styleUtils.js';
import { useUiText } from '../../text/UiText.js';

interface ButtonOwnProps {
  /** `pill` is the rounded CTA shape used for primary page actions. */
  shape?: 'rounded' | 'pill';
  /**
   * Press and hold for this many ms to confirm (pointer, or Space/Enter held down), for actions
   * that are costly to trigger by accident, such as going live. A fill shows the progress;
   * letting go early cancels. `onHoldComplete` runs once it's held long enough; `onClick` isn't
   * used for it.
   */
  holdMs?: number;
  onHoldComplete?: () => void;
  /** Runs when a hold is let go (or loses focus or the pointer) before `holdMs`, e.g. to explain it. */
  onHoldCancel?: () => void;
}

export type ButtonProps = MuiButtonProps & ButtonOwnProps;

const baseSx: SxProps<Theme> = (theme) => ({
  '&.Mui-focusVisible': focusRingStyle(theme),
  '&.MuiButton-loading': { cursor: 'progress' },
});

const holdSx = (holdMs: number, holding: boolean): SxProps<Theme> => ({
  position: 'relative',
  overflow: 'hidden',
  // The fill is drawn over the background and under the label
  isolation: 'isolate',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundColor: 'currentColor',
    opacity: 0.22,
    transformOrigin: 'left',
    transform: holding ? 'scaleX(1)' : 'scaleX(0)',
    transition: holding ? `transform ${holdMs}ms linear` : 'transform 150ms ease-out',
    pointerEvents: 'none',
    zIndex: -1,
  },
});

const HOLD_KEYS = new Set([' ', 'Enter']);

/**
 * MUI Button with TrueTime defaults (contained), a pill shape, a visible keyboard focus ring and
 * a `loading` state that disables the button and announces it as busy. Like MUI's Button it
 * accepts `component` (e.g. a router Link) and `href`. With `holdMs` it confirms on press and hold.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    shape = 'rounded',
    variant = 'contained',
    loading = false,
    holdMs,
    onHoldComplete,
    onHoldCancel,
    sx,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    onKeyDown,
    onKeyUp,
    onBlur,
    ...props
  },
  ref,
) {
  const [holding, setHolding] = useState(false);
  const text = useUiText();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latest = useRef({ onHoldComplete, onHoldCancel });
  useEffect(() => {
    latest.current = { onHoldComplete, onHoldCancel };
  });
  useEffect(() => () => clearTimeout(timer.current), []);

  const hold = holdMs !== undefined;
  const start = () => {
    if (!hold || timer.current !== undefined) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = undefined;
      setHolding(false);
      latest.current.onHoldComplete?.();
    }, holdMs);
  };
  const stop = () => {
    if (timer.current === undefined) return;
    clearTimeout(timer.current);
    timer.current = undefined;
    setHolding(false);
    latest.current.onHoldCancel?.();
  };

  const holdHandlers = hold
    ? {
        onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
          onPointerDown?.(e);
          if (e.button === 0) start();
        },
        onPointerUp: (e: PointerEvent<HTMLButtonElement>) => {
          onPointerUp?.(e);
          stop();
        },
        onPointerLeave: (e: PointerEvent<HTMLButtonElement>) => {
          onPointerLeave?.(e);
          stop();
        },
        onPointerCancel: (e: PointerEvent<HTMLButtonElement>) => {
          onPointerCancel?.(e);
          stop();
        },
        onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
          onKeyDown?.(e);
          if (!HOLD_KEYS.has(e.key)) return;
          // The key is the hold, not a click
          e.preventDefault();
          if (!e.repeat) start();
        },
        onKeyUp: (e: KeyboardEvent<HTMLButtonElement>) => {
          onKeyUp?.(e);
          if (HOLD_KEYS.has(e.key)) stop();
        },
        onBlur: (e: FocusEvent<HTMLButtonElement>) => {
          onBlur?.(e);
          stop();
        },
        'aria-description': text.pressAndHold,
      }
    : { onPointerDown, onPointerUp, onPointerLeave, onPointerCancel, onKeyDown, onKeyUp, onBlur };

  return (
    <MuiButton
      ref={ref}
      variant={variant}
      loading={loading}
      aria-busy={loading || undefined}
      data-holding={holding || undefined}
      sx={[
        baseSx,
        shape === 'pill' && { borderRadius: `${radii.pill}px` },
        hold && holdSx(holdMs, holding),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...holdHandlers}
      {...props}
    />
  );
}) as ExtendButtonBase<ButtonTypeMap<ButtonOwnProps>>;
