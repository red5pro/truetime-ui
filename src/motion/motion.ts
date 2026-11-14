import { keyframes } from '@mui/material/styles';
import { motion } from '../tokens/tokens.js';

type Duration = keyof typeof motion.duration;
type Easing = keyof typeof motion.easing;

export interface TransitionOptions {
  /** A `motion.duration` name or milliseconds. Defaults to `base`. */
  duration?: Duration | number;
  /** A `motion.easing` name. Defaults to `standard`. */
  easing?: Easing;
  /** Milliseconds before the transition starts. */
  delay?: number;
}

const ms = (value: Duration | number) =>
  typeof value === 'number' ? value : motion.duration[value];

/**
 * A CSS `transition` value for the given properties on the motion tokens, e.g.
 * `transition(['background-color', 'transform'], { duration: 'fast' })`.
 */
export function transition(
  properties: string | string[],
  { duration = 'base', easing = 'standard', delay = 0 }: TransitionOptions = {},
): string {
  const props = Array.isArray(properties) ? properties : [properties];
  const timing = `${ms(duration)}ms ${motion.easing[easing]}${delay ? ` ${delay}ms` : ''}`;
  return props.map((property) => `${property} ${timing}`).join(', ');
}

/** Media query for people who asked their system for less motion. */
export const reducedMotion = '@media (prefers-reduced-motion: reduce)';

/** Fade in place. */
export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

/** Fade in while rising by `motion.distance`. */
export const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(${motion.distance}px); }
  to { opacity: 1; transform: none; }
`;

/** Fade in while dropping by `motion.distance` (toasts and menus coming from the top). */
export const fadeInDown = keyframes`
  from { opacity: 0; transform: translateY(-${motion.distance}px); }
  to { opacity: 1; transform: none; }
`;

/** Fade in from the right edge (side panels). */
export const fadeInLeft = keyframes`
  from { opacity: 0; transform: translateX(${motion.distance * 2}px); }
  to { opacity: 1; transform: none; }
`;

/** Fade in while growing from 96% (dialogs, tiles, cards). */
export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: none; }
`;

/** Pop in with a small overshoot (reactions, badges); pair with the `spring` easing. */
export const popIn = keyframes`
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: none; }
`;

/** Soft opacity pulse for live indicators. */
export const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

export const enterKeyframes = {
  fade: fadeIn,
  up: fadeInUp,
  down: fadeInDown,
  left: fadeInLeft,
  scale: scaleIn,
  pop: popIn,
} as const;

export type EnterVariant = keyof typeof enterKeyframes;

export interface EnterAnimationOptions extends TransitionOptions {
  /** Defaults to `up`. */
  variant?: EnterVariant;
}

/**
 * Style object that animates an element in when it mounts. Plays once, holds the first frame
 * during `delay` (so staggered items don't flash), and leaves no transform behind afterwards, so
 * fixed-position children aren't affected once it ends. Skipped for reduced motion.
 */
export function enterAnimation({
  variant = 'up',
  duration = 'enter',
  easing = variant === 'pop' ? 'spring' : 'decelerate',
  delay = 0,
}: EnterAnimationOptions = {}) {
  return {
    animation: `${enterKeyframes[variant]} ${ms(duration)}ms ${motion.easing[easing]} ${delay}ms backwards`,
    [reducedMotion]: { animation: 'none' },
  } as const;
}

/** Slight shrink while a control is pressed. Add to a component's root styles. */
export const pressFeedback = {
  '&:active:not(.Mui-disabled)': { transform: 'scale(0.96)' },
  [reducedMotion]: { '&:active:not(.Mui-disabled)': { transform: 'none' } },
} as const;
