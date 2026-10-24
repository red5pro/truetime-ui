import MuiSwitch, { type SwitchProps as MuiSwitchProps } from '@mui/material/Switch';
import { focusRingStyle, themeColors } from '../styleUtils.js';

export interface SwitchProps extends MuiSwitchProps {
  /** `preview`: on is the preview tally green, for a switch that puts something in the preview. */
  tone?: 'default' | 'preview';
}

/** On/off toggle for settings that apply immediately (e.g. a source shown or hidden). */
export function Switch({ tone = 'default', sx, inputProps, ...props }: SwitchProps) {
  return (
    <MuiSwitch
      // Announced as on/off rather than checked/unchecked
      inputProps={{ role: 'switch', ...inputProps }}
      sx={[
        (theme) => {
          const colors = themeColors(theme);
          return {
            width: 52,
            height: 32,
            p: 0,
            '& .MuiSwitch-switchBase': {
              p: '4px',
              color: colors.text,
              '&.Mui-checked': {
                transform: 'translateX(20px)',
                color: colors.text,
                '& + .MuiSwitch-track': {
                  backgroundColor: tone === 'preview' ? colors.preview : colors.info,
                  opacity: 1,
                },
              },
              '&.Mui-focusVisible + .MuiSwitch-track': focusRingStyle(theme),
              '&.Mui-disabled + .MuiSwitch-track': { opacity: 0.4 },
              '&.Mui-disabled .MuiSwitch-thumb': { opacity: 0.7 },
            },
            '& .MuiSwitch-thumb': { width: 24, height: 24, boxShadow: 'none' },
            '& .MuiSwitch-track': {
              borderRadius: 16,
              backgroundColor: colors.surfaceHover,
              opacity: 1,
              transition: theme.transitions.create('background-color'),
            },
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}
