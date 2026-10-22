import Box from '@mui/material/Box';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { themeColors } from '../styleUtils.js';

export type StatusTone = 'live' | 'success' | 'warning' | 'error' | 'neutral';

export interface StatusBadgeProps {
  tone?: StatusTone;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * Compact status label, e.g. LIVE on a video or a studio card. `error` is a problem state (tinted
 * like success and warning); `live` is the solid red on-air badge.
 */
export function StatusBadge({ tone = 'neutral', children, sx }: StatusBadgeProps) {
  return (
    <Box
      component="span"
      sx={[
        (theme) => {
          const colors = themeColors(theme);
          const accent = {
            live: colors.error,
            success: colors.success,
            warning: colors.warning,
            error: colors.error,
            neutral: colors.mutedText,
          }[tone];
          return {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            px: 1,
            py: '2px',
            borderRadius: '4px',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            lineHeight: '18px',
            color: tone === 'live' ? colors.text : accent,
            backgroundColor: tone === 'live' ? accent : alpha(accent, 0.14),
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
