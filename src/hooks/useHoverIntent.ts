import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';

/** Rest before a hover panel opens (ms). */
export const HOVER_OPEN_DELAY_MS = 120;
/** Grace after the mouse leaves before it closes (ms), so a diagonal move to the panel survives. */
export const HOVER_CLOSE_DELAY_MS = 250;

export interface UseHoverIntentOptions {
  /** Open on hover at all; off leaves only click/keyboard (`toggle`, `openPinned`). */
  enabled?: boolean;
  openDelay?: number;
  closeDelay?: number;
  onOpenChange?: (open: boolean) => void;
}

export interface HoverIntent {
  open: boolean;
  /** Opened by click or keyboard: stays open when the mouse leaves. */
  pinned: boolean;
  /** Pointer handlers for the control that opens the panel. */
  triggerProps: {
    onPointerEnter: (event: PointerEvent) => void;
    onPointerLeave: (event: PointerEvent) => void;
  };
  /** Pointer handlers for the panel, so moving into it keeps it open. */
  panelProps: {
    onPointerEnter: (event: PointerEvent) => void;
    onPointerLeave: (event: PointerEvent) => void;
  };
  /** A click on the trigger: pins a hover-opened panel, closes a pinned one, opens a closed one. */
  toggle: () => void;
  /** Open pinned now (keyboard: Enter, Space, ArrowDown), without a delay. */
  openPinned: () => void;
  close: () => void;
}

/**
 * Hover intent for quick choices attached to a control (device pickers, a layout selector, a
 * "more" menu): opens after the mouse rests on the control, closes a moment after it leaves both
 * the control and the panel, and only for a mouse; touch and pen use click. A click pins the panel
 * open. Focus handling (moving into the panel, Escape returning to the trigger) stays with the
 * component, which knows its own markup.
 */
export function useHoverIntent({
  enabled = true,
  openDelay = HOVER_OPEN_DELAY_MS,
  closeDelay = HOVER_CLOSE_DELAY_MS,
  onOpenChange,
}: UseHoverIntentOptions = {}): HoverIntent {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latest = useRef({ open, pinned, onOpenChange });
  useEffect(() => {
    latest.current = { open, pinned, onOpenChange };
  });

  const clearTimers = useCallback(() => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const set = useCallback((next: boolean, nextPinned = false) => {
    const changed = next !== latest.current.open;
    // Kept in step at once, not only after the next render, so quick events see the new state
    latest.current = { ...latest.current, open: next, pinned: next && nextPinned };
    setOpen(next);
    setPinned(next && nextPinned);
    if (changed) latest.current.onOpenChange?.(next);
  }, []);

  const scheduleClose = useCallback(
    (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      clearTimeout(openTimer.current);
      if (!latest.current.open || latest.current.pinned) return;
      closeTimer.current = setTimeout(() => set(false), closeDelay);
    },
    [closeDelay, set],
  );

  const triggerEnter = useCallback(
    (event: PointerEvent) => {
      if (!enabled || event.pointerType !== 'mouse') return;
      clearTimeout(closeTimer.current);
      if (latest.current.open) return;
      openTimer.current = setTimeout(() => set(true), openDelay);
    },
    [enabled, openDelay, set],
  );

  const panelEnter = useCallback((event: PointerEvent) => {
    if (event.pointerType === 'mouse') clearTimeout(closeTimer.current);
  }, []);

  const toggle = useCallback(() => {
    clearTimers();
    const { open: isOpen, pinned: isPinned } = latest.current;
    if (isOpen && !isPinned) set(true, true);
    else set(!isOpen, true);
  }, [clearTimers, set]);

  const openPinned = useCallback(() => {
    clearTimers();
    set(true, true);
  }, [clearTimers, set]);

  const close = useCallback(() => {
    clearTimers();
    set(false);
  }, [clearTimers, set]);

  return {
    open,
    pinned,
    triggerProps: { onPointerEnter: triggerEnter, onPointerLeave: scheduleClose },
    panelProps: { onPointerEnter: panelEnter, onPointerLeave: scheduleClose },
    toggle,
    openPinned,
    close,
  };
}
