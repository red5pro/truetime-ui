import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import type { SxProps, Theme } from '@mui/material/styles';

export interface TruncatedTextProps {
  children: string;
  sx?: SxProps<Theme>;
}

/**
 * One line of text cut short with "…" when it doesn't fit its container, with a tooltip showing
 * all of it, only while it's cut short. Put it inside the element that sets the font and width,
 * e.g. a `Text` or `StatusBadge` that can shrink in a flex row.
 */
export function TruncatedText({ children, sx }: TruncatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const truncated = () => {
    const el = ref.current;
    return el !== null && el.scrollWidth > el.clientWidth;
  };

  return (
    <Tooltip
      title={children}
      describeChild
      open={open}
      onOpen={() => setOpen(truncated())}
      onClose={() => setOpen(false)}
    >
      <Box
        ref={ref}
        component="span"
        sx={[
          {
            display: 'block',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {children}
      </Box>
    </Tooltip>
  );
}
