import Paper, { type PaperProps } from '@mui/material/Paper';
import { radii } from '../../tokens/tokens.js';
import { themeColors } from '../styleUtils.js';

const paddings = { none: 0, sm: 2, md: 3, lg: 5 } as const;

export interface CardProps extends Omit<PaperProps, 'variant'> {
  /** Inner spacing on the MUI spacing scale: sm 16px, md 24px, lg 40px. */
  padding?: keyof typeof paddings;
  /** `outlined` adds a hairline border; `plain` relies on the surface color alone. */
  variant?: 'outlined' | 'plain';
}

/** Surface container styled like the Meetings dialogs. */
export function Card({ padding = 'md', variant = 'outlined', sx, ...props }: CardProps) {
  return (
    <Paper
      elevation={0}
      sx={[
        (theme) => ({
          p: paddings[padding],
          borderRadius: `${radii.container}px`,
          background: themeColors(theme).surface,
          border: variant === 'outlined' ? `1px solid ${themeColors(theme).surfaceRaised}` : 'none',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}
