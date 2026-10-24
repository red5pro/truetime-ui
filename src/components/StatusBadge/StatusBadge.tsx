import Box from '@mui/material/Box';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';
import { ErrorOutline } from '@mui/icons-material';
import type { ReactNode } from 'react';
import { themeColors } from '../styleUtils.js';

export type StatusTone = 'live' | 'preview' | 'success' | 'warning' | 'error' | 'neutral';

export interface StatusBadgeProps {
  tone?: StatusTone;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * Compact status label, e.g. LIVE on a video or a studio card. `live` is the solid on-air
 * (program) red and `preview` the solid preview green, the same in every theme; `error` is a
 * problem state, tinted like success and warning and marked with an icon so it isn't read as on
 * air.
 */
export function StatusBadge({ tone = 'neutral', children, sx }: StatusBadgeProps) {
  return (
    <Box
      component="span"
      sx={[
        (theme) => {
          const colors = themeColors(theme);
          const solid =
            tone === 'live'
              ? { color: colors.onProgram, backgroundColor: colors.program }
              : tone === 'preview'
                ? { color: colors.onPreview, backgroundColor: colors.preview }
                : null;
          const accent = {
            success: colors.success,
            warning: colors.warning,
            error: colors.error,
            neutral: colors.mutedText,
          }[tone as 'success' | 'warning' | 'error' | 'neutral'];
          return {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            px: 1,
            py: '2px',
            borderRadius: '4px',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            lineHeight: '18px',
            whiteSpace: 'nowrap',
            ...(solid ?? { color: accent, backgroundColor: alpha(accent, 0.14) }),
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {tone === 'error' && <ErrorOutline aria-hidden sx={{ fontSize: 14, ml: -0.25 }} />}
      {children}
    </Box>
  );
}
