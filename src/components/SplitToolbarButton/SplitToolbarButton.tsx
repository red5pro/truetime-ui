import { useEffect, useRef, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { controlBar, disabledOpacity, motion, radii } from '../../tokens/tokens.js';
import { focusRingStyle } from '../styleUtils.js';
import { ToolbarButton } from '../ToolbarButton/ToolbarButton.js';
import { segmentColors, type ToolbarTone } from '../ToolbarButton/toolbarTones.js';

export interface SplitToolbarButtonProps {
  icon: ReactNode;
  /** Accessible name and tooltip of the toggle, e.g. "Turn off camera". */
  label: string;
  /** `off` when the device is off; `default` otherwise. */
  tone?: ToolbarTone;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  /** Accessible name and tooltip of the options segment, e.g. "Camera options". */
  optionsLabel: string;
  /** What the options segment opens is showing (a tray or menu). */
  optionsOpen?: boolean;
  onOptionsClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * The mouse rested on the options segment, to open what it opens without a click. Not called for
   * touch or pen, which use the click.
   */
  onOptionsHover?: () => void;
  /** id of what the options segment opens, for `aria-controls`. */
  optionsControls?: string;
  optionsDisabled?: boolean;
  /**
   * Shown in the options segment while it is closed and not hovered or focused, such as
   * `<AudioLevelDots />`; the chevron replaces it on hover, on focus and while open.
   */
  idleIndicator?: ReactNode;
  id?: string;
}

/**
 * A device toggle with an options segment on its left (Meet-style): the segment opens a tray or menu
 * of device options, the toggle turns the device on or off.
 */
const OPTIONS_HOVER_DELAY_MS = 150;

export function SplitToolbarButton({
  icon,
  label,
  tone = 'default',
  onClick,
  disabled,
  optionsLabel,
  optionsOpen = false,
  onOptionsClick,
  onOptionsHover,
  optionsControls,
  optionsDisabled,
  idleIndicator,
  id,
}: SplitToolbarButtonProps) {
  const showIdle = idleIndicator != null && !optionsOpen;
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const handleOptionsPointerEnter = (event: PointerEvent) => {
    if (!onOptionsHover || optionsDisabled || event.pointerType !== 'mouse') return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(onOptionsHover, OPTIONS_HOVER_DELAY_MS);
  };
  const cancelOptionsHover = () => clearTimeout(hoverTimer.current);
  return (
    <Box
      sx={(theme) => {
        const segment = segmentColors(theme, tone);
        return {
          display: 'inline-flex',
          alignItems: 'stretch',
          flexShrink: 0,
          borderRadius: `${radii.pill}px`,
          backgroundColor: segment.background,
          transition: motion.standard,
          '& .split-chevron': { display: showIdle ? 'none' : 'inline-flex' },
          ...(showIdle && {
            '&:hover .split-idle, &:focus-within .split-idle': { display: 'none' },
            '&:hover .split-chevron, &:focus-within .split-chevron': { display: 'inline-flex' },
          }),
        };
      }}
    >
      <Tooltip title={optionsLabel} placement="top">
        <ButtonBase
          id={id ? `${id}-options` : undefined}
          aria-label={optionsLabel}
          aria-expanded={optionsOpen}
          aria-controls={optionsControls}
          disabled={optionsDisabled}
          onClick={(event) => {
            // A click before the hover delay ran out shouldn't be followed by the hover
            cancelOptionsHover();
            onOptionsClick?.(event);
          }}
          onPointerEnter={handleOptionsPointerEnter}
          onPointerLeave={cancelOptionsHover}
          sx={(theme) => {
            const segment = segmentColors(theme, tone);
            return {
              width: controlBar.segmentWidth,
              borderRadius: `${radii.pill}px 0 0 ${radii.pill}px`,
              color: segment.color,
              transition: motion.standard,
              '& svg': { fontSize: 22 },
              '@media (hover: hover)': { '&:hover': { backgroundColor: segment.hover } },
              '&.Mui-focusVisible': focusRingStyle(theme),
              '&.Mui-disabled': { opacity: disabledOpacity },
              [theme.breakpoints.down('md')]: { width: controlBar.segmentWidth - 8 },
            };
          }}
        >
          {showIdle && (
            <Box component="span" className="split-idle" sx={{ display: 'inline-flex' }}>
              {idleIndicator}
            </Box>
          )}
          <Box component="span" className="split-chevron" sx={{ alignItems: 'center' }}>
            {optionsOpen ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
          </Box>
        </ButtonBase>
      </Tooltip>
      <ToolbarButton
        id={id}
        icon={icon}
        label={label}
        tone={tone}
        disabled={disabled}
        onClick={onClick}
      />
    </Box>
  );
}
