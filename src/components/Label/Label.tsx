import FormLabel, { type FormLabelProps } from '@mui/material/FormLabel';
import { typography } from '../../tokens/tokens.js';
import { themeColors } from '../styleUtils.js';

export type LabelProps = FormLabelProps<'label'>;

/**
 * Form label styled like the Meetings InputLabel. Inside a FormField it picks up the field's
 * required, error and disabled state.
 */
export function Label({ sx, ...props }: LabelProps) {
  return (
    <FormLabel
      sx={[
        (theme) => ({
          display: 'block',
          mb: '8px',
          fontSize: typography.label.fontSize,
          color: themeColors(theme).mutedText,
          '&.Mui-focused': { color: themeColors(theme).text },
          '&.Mui-error': { color: themeColors(theme).error },
          '&.Mui-disabled': { color: themeColors(theme).disabledText },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}
