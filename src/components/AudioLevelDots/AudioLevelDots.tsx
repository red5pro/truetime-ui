import Box, { type BoxProps } from '@mui/material/Box';
import { keyframes } from '@mui/material/styles';
import { themeColors } from '../styleUtils.js';

export interface AudioLevelDotsProps extends Omit<BoxProps, 'children'> {
  /** The person is talking: the dots bounce. */
  active?: boolean;
}

const bounce = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(2.6); }
`;

/**
 * Three dots that bounce while someone is talking, e.g. in the options segment of the microphone
 * button. Decorative (`aria-hidden`); announce speaking state elsewhere if it matters.
 */
export function AudioLevelDots({ active = false, sx, ...props }: AudioLevelDotsProps) {
  return (
    <Box
      aria-hidden
      data-active={active || undefined}
      sx={[
        (theme) => ({
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px',
          height: 16,
          '& > span': {
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: themeColors(theme).info,
            ...(active && {
              animation: `${bounce} 0.6s ease-in-out infinite`,
              '&:nth-of-type(2)': { animationDelay: '0.15s' },
              '&:nth-of-type(3)': { animationDelay: '0.3s' },
            }),
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      <span />
      <span />
      <span />
    </Box>
  );
}
