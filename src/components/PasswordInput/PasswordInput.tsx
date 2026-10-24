import { forwardRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { createSvgIcon } from '@mui/material/utils';
import { Input, type InputProps } from '../Input/Input.js';
import { focusRingStyle } from '../styleUtils.js';
import { useUiText } from '../../text/UiText.js';

// Paths from @mui/icons-material Visibility / VisibilityOff, inlined to avoid the icons dependency
const VisibilityIcon = createSvgIcon(
  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3" />,
  'Visibility',
);
const VisibilityOffIcon = createSvgIcon(
  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7M2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2m4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3z" />,
  'VisibilityOff',
);

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  /** Accessible name of the reveal toggle; override for localisation. */
  showPasswordLabel?: string;
}

/** Password Input with a show/hide toggle. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ showPasswordLabel, disabled, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    const text = useUiText();

    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        disabled={disabled}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={showPasswordLabel ?? text.showPassword}
              aria-pressed={visible}
              onClick={() => setVisible((v) => !v)}
              // Keep focus (and the caret) in the input when toggling with the mouse
              onMouseDown={(event) => event.preventDefault()}
              disabled={disabled}
              edge="end"
              sx={(theme) => ({
                mr: '-4px',
                color: theme.palette.text.secondary,
                '&:hover': { backgroundColor: 'transparent', color: theme.palette.text.primary },
                '&.Mui-focusVisible': focusRingStyle(theme),
              })}
            >
              {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        }
        {...props}
      />
    );
  },
);
