import Box, { type BoxProps } from '@mui/material/Box';
import { forwardRef } from 'react';
import { motion } from '../../tokens/tokens.js';
import { enterAnimation, type EnterVariant, type TransitionOptions } from '../../motion/motion.js';

export interface RevealProps extends BoxProps {
  /** How the content arrives. `fade` moves nothing, so it's safe around fixed-position content. */
  variant?: EnterVariant;
  /** A `motion.duration` name or milliseconds. Defaults to `enter`. */
  duration?: TransitionOptions['duration'];
  /** Milliseconds before it starts. */
  delay?: number;
  /** Position in a list: adds `index × motion.stagger` ms (capped) to the delay. */
  index?: number;
}

/** Most items a stagger reaches; later ones arrive together so long lists don't trickle in. */
const MAX_STAGGERED = 8;

/**
 * Animates its content in when it mounts: pages, panels, cards in a grid (pass `index` to
 * stagger them). Remount it (change its `key`) to play again. Honours reduced motion.
 */
export const Reveal = forwardRef<HTMLDivElement, RevealProps>(function Reveal(
  { variant = 'up', duration = 'enter', delay = 0, index, sx, ...props },
  ref,
) {
  const staggered = index == null ? 0 : Math.min(index, MAX_STAGGERED) * motion.stagger;
  return (
    <Box
      ref={ref}
      sx={[
        enterAnimation({ variant, duration, delay: delay + staggered }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
});
