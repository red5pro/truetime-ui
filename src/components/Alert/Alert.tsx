import MuiAlert, { type AlertProps as MuiAlertProps } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { alpha } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { mixColors } from '../../tokens/contrast.js';
import { radii, shadows } from '../../tokens/tokens.js';
import { themeColors } from '../styleUtils.js';

export interface AlertProps extends Omit<MuiAlertProps, 'variant' | 'title'> {
  title?: ReactNode;
  /**
   * Shown over other content (a toast): the tint sits on a solid surface with a shadow, so it
   * reads over video and panels instead of letting them show through.
   */
  floating?: boolean;
}

/**
 * Inline status message. Uses role="alert" (announced immediately) for errors and warnings, and
 * role="status" otherwise; pass `role` to override.
 */
export function Alert({
  severity = 'error',
  title,
  floating = false,
  children,
  sx,
  role,
  ...props
}: AlertProps) {
  return (
    <MuiAlert
      severity={severity}
      variant="outlined"
      role={role ?? (severity === 'error' || severity === 'warning' ? 'alert' : 'status')}
      sx={[
        (theme) => {
          const colors = themeColors(theme);
          const accent = colors[severity];
          return {
            alignItems: 'center',
            borderRadius: `${radii.control}px`,
            borderColor: alpha(accent, 0.6),
            // Floating: the same tint mixed into an opaque surface, so nothing shows through
            backgroundColor: floating
              ? mixColors(colors.surfaceRaised, accent, 0.14)
              : alpha(accent, 0.1),
            ...(floating && { borderColor: alpha(accent, 0.8), boxShadow: shadows.overlay }),
            color: colors.text,
            fontSize: 14,
            '& .MuiAlert-icon': { color: accent },
            '& .MuiAlert-message': { color: colors.text },
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      {title && <AlertTitle sx={{ fontWeight: 600, mb: 0.25 }}>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  );
}
