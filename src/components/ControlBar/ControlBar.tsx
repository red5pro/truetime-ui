import { useEffect, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import type { SxProps, Theme } from '@mui/material/styles';
import { controlBar } from '../../tokens/tokens.js';
import { themeColors } from '../styleUtils.js';

export interface ControlBarProps {
  /** The bar's controls, usually ToolbarButton and SplitToolbarButton. */
  children: ReactNode;
  /** Accessible name of the toolbar, e.g. "Call controls". */
  label: string;
  /** Options shown above the controls, inside the same surface (e.g. camera options). */
  tray?: ReactNode;
  trayOpen?: boolean;
  /** Accessible name of the tray, e.g. "Camera options". */
  trayLabel?: string;
  /** id of the tray, for the `aria-controls` of what opens it. */
  trayId?: string;
  /** Escape inside the tray, so the app can close it and move focus back. */
  onTrayClose?: () => void;
  /**
   * The mouse left the bar, its tray and anything rendered from them (such as a picker's list)
   * and stayed away for a moment; for closing a tray that hovering opened.
   */
  onHoverEnd?: () => void;
  /** `filled` (default) draws the bar's surface; `plain` lays out the controls without one. */
  variant?: 'filled' | 'plain';
  sx?: SxProps<Theme>;
}

/**
 * Rounded surface for a group of meeting controls. Its tray grows upwards out of the same surface,
 * so device options appear attached to the controls that opened them.
 */
const HOVER_END_DELAY_MS = 300;

export function ControlBar({
  children,
  label,
  tray,
  trayOpen = false,
  trayLabel,
  trayId,
  onTrayClose,
  onHoverEnd,
  variant = 'filled',
  sx,
}: ControlBarProps) {
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  // React's enter/leave follow the component tree, so moving into a portalled list (a picker's
  // menu) is not leaving; the delay covers the gap between the bar and such a list
  const handlePointerEnter = () => clearTimeout(leaveTimer.current);
  const handlePointerLeave = (event: PointerEvent) => {
    if (!onHoverEnd || event.pointerType !== 'mouse') return;
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(onHoverEnd, HOVER_END_DELAY_MS);
  };

  const handleTrayKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && onTrayClose) {
      event.stopPropagation();
      onTrayClose();
    }
  };

  return (
    <Box
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      sx={[
        (theme) => ({
          display: 'inline-flex',
          flexDirection: 'column',
          maxWidth: '100%',
          borderRadius: `${controlBar.radius}px`,
          backgroundColor: variant === 'filled' ? themeColors(theme).surfaceRaised : 'transparent',
          p: `${controlBar.padding}px`,
          [theme.breakpoints.down('md')]: { p: `${controlBar.padding / 2}px` },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {tray != null && (
        // width 0 + minWidth 100%: the tray wraps to the controls' width instead of widening the bar
        <Collapse in={trayOpen} unmountOnExit sx={{ width: 0, minWidth: '100%' }}>
          <Box
            id={trayId}
            role="group"
            aria-label={trayLabel}
            onKeyDown={handleTrayKeyDown}
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1.5,
              pb: `${controlBar.padding}px`,
            }}
          >
            {tray}
          </Box>
        </Collapse>
      )}
      <Box
        role="toolbar"
        aria-label={label}
        sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 }, flexWrap: 'nowrap' }}
      >
        {children}
      </Box>
    </Box>
  );
}
