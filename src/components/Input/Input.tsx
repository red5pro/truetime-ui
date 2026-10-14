import { forwardRef } from 'react';
import OutlinedInput, { type OutlinedInputProps } from '@mui/material/OutlinedInput';
import { radii } from '../../tokens/tokens.js';
import { themeColors } from '../styleUtils.js';
import { useFormField } from '../FormField/FormFieldContext.js';

export type InputProps = OutlinedInputProps;

/**
 * Text input with the Meetings TextField look. Inside a FormField its id and aria-describedby
 * are set automatically; error/disabled/required come from the field.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, inputProps, fullWidth = true, sx, ...props },
  ref,
) {
  const field = useFormField();
  const describedBy =
    [field?.helperTextId, inputProps?.['aria-describedby']].filter(Boolean).join(' ') || undefined;

  return (
    <OutlinedInput
      inputRef={ref}
      id={id ?? field?.inputId}
      fullWidth={fullWidth}
      inputProps={{ ...inputProps, 'aria-describedby': describedBy }}
      sx={[
        (theme) => {
          const colors = themeColors(theme);
          return {
            borderRadius: `${radii.control}px`,
            backgroundColor: colors.surfaceRaised,
            '&:hover': { backgroundColor: colors.surfaceHover },
            '&.Mui-focused': { backgroundColor: colors.surfaceHover },
            '&.Mui-disabled': { opacity: 0.6 },
            '& input:-webkit-autofill': {
              WebkitBoxShadow: `0 0 0 100px ${colors.surfaceRaised} inset`,
              WebkitTextFillColor: colors.text,
              caretColor: colors.text,
            },
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
});
