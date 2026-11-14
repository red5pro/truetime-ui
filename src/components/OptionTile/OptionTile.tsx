import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase, { type ButtonBaseProps } from '@mui/material/ButtonBase';
import { radii } from '../../tokens/tokens.js';
import { focusRingStyle, themeColors } from '../styleUtils.js';
import { reducedMotion, transition } from '../../motion/motion.js';

export interface OptionTileProps extends Omit<ButtonBaseProps, 'children'> {
  /** Picture of the option, filling a 16:9 swatch (an image, a gradient box, an icon…). */
  preview: ReactNode;
  label: string;
  selected?: boolean;
}

/**
 * A choice in a grid of visual options (backgrounds, overlays, themes): a swatch with a label,
 * outlined when selected. Reports `aria-pressed`; put several in a labelled group.
 */
export function OptionTile({ preview, label, selected = false, sx, ...props }: OptionTileProps) {
  return (
    <ButtonBase
      aria-pressed={selected}
      {...props}
      sx={[
        (theme) => {
          const colors = themeColors(theme);
          return {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 0.75,
            p: 0.75,
            borderRadius: `${radii.container}px`,
            color: selected ? colors.text : colors.mutedText,
            backgroundColor: selected ? colors.surfaceHover : 'transparent',
            outline: selected ? `2px solid ${colors.info}` : `1px solid ${colors.border}`,
            outlineOffset: -1,
            textAlign: 'left',
            ...theme.typography.caption,
            transition: transition(['background-color', 'color', 'outline-color']),
            '&:hover': { backgroundColor: colors.surfaceHover, color: colors.text },
            // The picture leans in a little under the pointer
            '& [data-option-preview] > *': {
              transition: transition('transform', { duration: 'slow' }),
            },
            '@media (hover: hover)': {
              '&:hover:not(.Mui-disabled) [data-option-preview] > *': { transform: 'scale(1.04)' },
            },
            [reducedMotion]: { '&:hover [data-option-preview] > *': { transform: 'none' } },
            '&.Mui-focusVisible': focusRingStyle(theme),
            '&.Mui-disabled': { opacity: 0.5 },
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        aria-hidden
        data-option-preview
        sx={(theme) => ({
          position: 'relative',
          aspectRatio: '16 / 9',
          overflow: 'hidden',
          borderRadius: `${radii.control}px`,
          backgroundColor: themeColors(theme).surfaceRaised,
          display: 'grid',
          placeItems: 'center',
        })}
      >
        {preview}
      </Box>
      <Box
        component="span"
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {label}
      </Box>
    </ButtonBase>
  );
}
