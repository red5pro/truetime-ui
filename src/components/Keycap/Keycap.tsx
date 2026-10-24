import Box from '@mui/material/Box';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { monoText } from '../../tokens/tokens.js';
import { themeColors } from '../styleUtils.js';

export interface KeycapProps {
  /** The key, e.g. `T` or `⇧1`. */
  children: ReactNode;
  sx?: SxProps<Theme>;
}

/** A keyboard shortcut hint drawn as a small key (`<kbd>`). */
export function Keycap({ children, sx }: KeycapProps) {
  return (
    <Box
      component="kbd"
      sx={[
        (theme) => {
          const colors = themeColors(theme);
          return {
            ...monoText,
            display: 'inline-grid',
            placeItems: 'center',
            minWidth: 18,
            height: 18,
            px: '4px',
            borderRadius: '4px',
            fontSize: 11,
            fontWeight: 500,
            lineHeight: 1,
            color: colors.text,
            backgroundColor: alpha(colors.background, 0.72),
            border: `1px solid ${colors.border}`,
            boxShadow: `inset 0 -1px 0 ${colors.border}`,
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
