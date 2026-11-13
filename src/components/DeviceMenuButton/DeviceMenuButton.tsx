import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import Check from '@mui/icons-material/Check';
import {
  borderWidth,
  controlBar,
  disabledOpacity,
  motion,
  radii,
  typography,
} from '../../tokens/tokens.js';
import { focusRingStyle, themeColors } from '../styleUtils.js';

export interface DeviceOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DeviceMenuButtonProps {
  icon?: ReactNode;
  /** Accessible name of the picker, e.g. "Camera". */
  label: string;
  options: DeviceOption[];
  /** The selected option's value. */
  value?: string;
  onChange?: (value: string) => void;
  /**
   * Open the list when a mouse rests on the button and close it when the mouse leaves both the
   * button and the list. Clicking pins it open; touch and keyboard always use click/Enter.
   */
  openOnHover?: boolean;
  /** Shown on the button when nothing is selected, and in the list when there are no options. */
  emptyText?: string;
  disabled?: boolean;
  /** Fill the parent's width instead of sizing to the label (up to `maxWidth`). */
  fullWidth?: boolean;
  maxWidth?: number | string;
  /** Where the list opens; `top` for pickers at the bottom of the screen. */
  placement?: 'top' | 'bottom';
  /** Close after choosing (default). Turn off to keep the list open, e.g. to watch a level meter. */
  closeOnSelect?: boolean;
  /** Extra content under the options, such as a level meter. */
  menuFooter?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  sx?: SxProps<Theme>;
}

const OPEN_DELAY_MS = 120;
const CLOSE_DELAY_MS = 250;

/**
 * Outlined pill that shows the selected device and opens a list of devices to choose from. With
 * `openOnHover` the list opens when the mouse rests on it, so switching devices takes one click.
 */
export function DeviceMenuButton({
  icon,
  label,
  options,
  value,
  onChange,
  openOnHover = true,
  emptyText = '',
  disabled = false,
  fullWidth = false,
  maxWidth = 260,
  placement = 'top',
  closeOnSelect = true,
  menuFooter,
  onOpenChange,
  id,
  sx,
}: DeviceMenuButtonProps) {
  const autoId = useId();
  const buttonId = id ?? `device-menu-${autoId}`;
  const listId = `${buttonId}-list`;
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  // The Popper needs the element during render, so keep it in state as well as in the ref
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const setAnchor = useCallback((element: HTMLButtonElement | null) => {
    anchorRef.current = element;
    setAnchorEl(element);
  }, []);
  const [open, setOpen] = useState(false);
  /** Opened by click or keyboard: stays open when the mouse leaves and takes focus. */
  const [pinned, setPinned] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const clearTimers = useCallback(() => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const setOpenState = useCallback(
    (next: boolean, nextPinned = false) => {
      setOpen(next);
      setPinned(next && nextPinned);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  const close = useCallback(
    (returnFocus = false) => {
      clearTimers();
      setOpenState(false);
      if (returnFocus) anchorRef.current?.focus();
    },
    [clearTimers, setOpenState],
  );

  const canOpen = !disabled && options.length > 0;

  const scheduleOpen = (event: PointerEvent) => {
    if (!openOnHover || !canOpen || event.pointerType !== 'mouse') return;
    clearTimeout(closeTimer.current);
    if (open) return;
    openTimer.current = setTimeout(() => setOpenState(true), OPEN_DELAY_MS);
  };

  const scheduleClose = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    clearTimeout(openTimer.current);
    if (!open || pinned) return;
    closeTimer.current = setTimeout(() => setOpenState(false), CLOSE_DELAY_MS);
  };

  const handleClick = () => {
    clearTimers();
    if (!canOpen) return;
    if (open && !pinned) {
      // Opened by hover: the click keeps it open
      setPinned(true);
    } else if (open) {
      close();
    } else {
      setOpenState(true, true);
    }
  };

  const handleButtonKeyDown = (event: KeyboardEvent) => {
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && canOpen) {
      event.preventDefault();
      clearTimers();
      setOpenState(true, true);
    }
  };

  const handleListKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    } else if (event.key === 'Tab') {
      close();
    }
  };

  const handleSelect = (next: string) => {
    onChange?.(next);
    if (closeOnSelect) close(pinned);
  };

  const selected = options.find((option) => option.value === value);
  const shownLabel = selected?.label || emptyText;

  return (
    <>
      <ButtonBase
        ref={setAnchor}
        id={buttonId}
        aria-label={shownLabel ? `${label}: ${shownLabel}` : label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        disabled={!canOpen}
        title={shownLabel || undefined}
        onClick={handleClick}
        onKeyDown={handleButtonKeyDown}
        onPointerEnter={scheduleOpen}
        onPointerLeave={scheduleClose}
        sx={[
          (theme) => {
            const colors = themeColors(theme);
            return {
              height: controlBar.chipHeight,
              width: fullWidth ? '100%' : undefined,
              maxWidth: fullWidth ? '100%' : maxWidth,
              minWidth: 0,
              flexShrink: 1,
              justifyContent: 'flex-start',
              gap: 1,
              pl: 1.5,
              pr: 1,
              borderRadius: `${radii.pill}px`,
              border: `${borderWidth.hairline}px solid ${colors.borderStrong}`,
              backgroundColor: open ? alpha(colors.text, 0.08) : 'transparent',
              color: colors.text,
              fontFamily: 'inherit',
              fontSize: typography.body2.fontSize,
              fontWeight: typography.button.fontWeight,
              transition: motion.standard,
              '& > svg': { fontSize: 20, flexShrink: 0 },
              '@media (hover: hover)': {
                '&:hover': { backgroundColor: alpha(colors.text, 0.08) },
              },
              '&.Mui-focusVisible': focusRingStyle(theme),
              '&.Mui-disabled': { opacity: disabledOpacity },
            };
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {icon}
        <Box
          component="span"
          sx={{
            flex: 1,
            minWidth: 0,
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {shownLabel}
        </Box>
        {open ? <ArrowDropUp /> : <ArrowDropDown />}
      </ButtonBase>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={placement === 'top' ? 'top-start' : 'bottom-start'}
        transition
        modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
        sx={(theme) => ({ zIndex: theme.zIndex.modal })}
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'top' ? 'bottom left' : 'top left' }}
          >
            <Paper
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') clearTimeout(closeTimer.current);
              }}
              onPointerLeave={scheduleClose}
              sx={(theme) => {
                const colors = themeColors(theme);
                return {
                  minWidth: anchorEl?.offsetWidth,
                  maxWidth: 'min(400px, calc(100vw - 32px))',
                  maxHeight: 360,
                  overflowY: 'auto',
                  borderRadius: `${radii.container}px`,
                  backgroundColor: colors.surfaceRaised,
                  backgroundImage: 'none',
                  color: colors.text,
                  boxShadow: theme.shadows[8],
                };
              }}
            >
              <ClickAwayListener
                onClickAway={(event) => {
                  if (anchorRef.current?.contains(event.target as Node)) return;
                  close();
                }}
              >
                <Box>
                  <MenuList
                    id={listId}
                    aria-labelledby={buttonId}
                    autoFocusItem={pinned}
                    onKeyDown={handleListKeyDown}
                    sx={{ p: 0.5 }}
                  >
                    {options.length === 0 && emptyText ? (
                      <MenuItem disabled>{emptyText}</MenuItem>
                    ) : null}
                    {options.map((option) => {
                      const isSelected = option.value === value;
                      return (
                        <MenuItem
                          key={option.value}
                          role="menuitemradio"
                          aria-checked={isSelected}
                          selected={isSelected}
                          disabled={option.disabled}
                          title={option.label}
                          onClick={() => handleSelect(option.value)}
                          sx={(theme) => {
                            const colors = themeColors(theme);
                            return {
                              borderRadius: `${radii.control}px`,
                              minHeight: 44,
                              color: isSelected ? colors.info : colors.text,
                              '&.Mui-selected, &.Mui-selected:hover': {
                                backgroundColor: alpha(colors.text, 0.12),
                              },
                              '&:hover': { backgroundColor: alpha(colors.text, 0.08) },
                              '&.Mui-focusVisible': { backgroundColor: alpha(colors.text, 0.12) },
                            };
                          }}
                        >
                          <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                            {isSelected ? <Check fontSize="small" /> : null}
                          </ListItemIcon>
                          <ListItemText
                            primary={option.label}
                            slotProps={{
                              primary: {
                                variant: 'body2',
                                noWrap: true,
                                sx: { color: 'inherit' },
                              },
                            }}
                          />
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                  {menuFooter}
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
