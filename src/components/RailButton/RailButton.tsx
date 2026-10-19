import type { ReactNode } from 'react';
import Badge from '@mui/material/Badge';
import ButtonBase, { type ButtonBaseProps } from '@mui/material/ButtonBase';
import { radii } from '../../tokens/tokens.js';
import { focusRingStyle, themeColors } from '../styleUtils.js';

export interface RailButtonProps extends Omit<ButtonBaseProps, 'children'> {
  icon: ReactNode;
  label: string;
  /** The panel or tool this button opens is showing. */
  selected?: boolean;
  /** Count shown on the icon, e.g. unread messages; hidden at 0. */
  badge?: number;
}

/**
 * Icon-over-label button for a side rail of tools (Design, Chat, …). It toggles what it opens, so
 * it reports `aria-pressed`.
 */
export function RailButton({
  icon,
  label,
  selected = false,
  badge,
  sx,
  ...props
}: RailButtonProps) {
  return (
    <ButtonBase
      aria-pressed={selected}
      {...props}
      sx={[
        (theme) => {
          const colors = themeColors(theme);
          return {
            width: '100%',
            minWidth: 64,
            py: 1,
            px: 0.5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            borderRadius: `${radii.control}px`,
            color: selected ? colors.info : colors.mutedText,
            ...theme.typography.caption,
            lineHeight: 1.2,
            transition: theme.transitions.create(['color', 'background-color']),
            '&:hover': {
              color: selected ? colors.info : colors.text,
              backgroundColor: colors.surfaceHover,
            },
            '&.Mui-focusVisible': focusRingStyle(theme),
            '&.Mui-disabled': { color: colors.disabledText },
            '& svg': { fontSize: 26 },
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* The name is the label; put a count in aria-label when it matters (e.g. "Chat, 3 new") */}
      <Badge aria-hidden badgeContent={badge} color="error" max={99}>
        {icon}
      </Badge>
      <span>{label}</span>
    </ButtonBase>
  );
}
