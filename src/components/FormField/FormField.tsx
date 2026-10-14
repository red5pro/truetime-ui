import { useId, type ReactNode } from 'react';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import type { SxProps, Theme } from '@mui/material/styles';
import { Label } from '../Label/Label.js';
import { FormFieldContext } from './FormFieldContext.js';

export interface FormFieldProps {
  label: ReactNode;
  /** Hint or validation message shown under the control; rendered in the error color when `error`. */
  helperText?: ReactNode;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** id for the input; generated when omitted. */
  id?: string;
  className?: string;
  sx?: SxProps<Theme>;
  /** The control, typically an Input or PasswordInput. */
  children: ReactNode;
}

/**
 * Label + control + helper text. Error, disabled and required state flow to the control through
 * MUI's FormControl; ids are wired up so the label and message are announced with the input.
 */
export function FormField({
  label,
  helperText,
  error = false,
  required = false,
  disabled = false,
  fullWidth = true,
  id,
  className,
  sx,
  children,
}: FormFieldProps) {
  const generatedId = useId();
  const inputId = id ?? `tt-field-${generatedId}`;
  const helperTextId = helperText ? `${inputId}-helper` : undefined;

  return (
    <FormControl
      error={error}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
      sx={sx}
    >
      <FormFieldContext.Provider value={{ inputId, helperTextId }}>
        <Label htmlFor={inputId}>{label}</Label>
        {children}
        {helperText && (
          <FormHelperText id={helperTextId} sx={{ mx: 0, mt: '6px', fontSize: 14 }}>
            {helperText}
          </FormHelperText>
        )}
      </FormFieldContext.Provider>
    </FormControl>
  );
}
