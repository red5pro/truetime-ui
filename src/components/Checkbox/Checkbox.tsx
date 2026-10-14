import type { ReactNode } from 'react';
import MuiCheckbox, { type CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { typography } from '../../tokens/tokens.js';
import { focusRingStyle, themeColors } from '../styleUtils.js';

export interface CheckboxProps extends MuiCheckboxProps {
  /** Visible label; clicking it toggles the checkbox. */
  label?: ReactNode;
}

/** Checkbox, optionally with a clickable label. */
export function Checkbox({ label, sx, ...props }: CheckboxProps) {
  const checkbox = (
    <MuiCheckbox
      sx={[
        // Align the box with the edge of neighbouring fields. Set on the checkbox rather than the
        // FormControlLabel because Stack and other spacing containers reset child margins.
        Boolean(label) && { ml: '-12px' },
        (theme) => ({
          color: themeColors(theme).border,
          '&.Mui-checked': { color: themeColors(theme).text },
          '&.Mui-focusVisible': { ...focusRingStyle(theme), outlineOffset: -6 },
          '&:hover': { backgroundColor: 'transparent' },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );

  if (!label) return checkbox;

  return (
    <FormControlLabel
      control={checkbox}
      label={label}
      disabled={props.disabled}
      sx={(theme) => ({
        ml: 0,
        mr: 0,
        '& .MuiFormControlLabel-label': {
          fontSize: typography.label.fontSize,
          color: themeColors(theme).mutedText,
        },
      })}
    />
  );
}
