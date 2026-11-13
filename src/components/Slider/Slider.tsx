import MuiSlider, { type SliderProps as MuiSliderProps } from '@mui/material/Slider';
import { focusRingStyle, themeColors } from '../styleUtils.js';

export type SliderProps = MuiSliderProps;

/**
 * Track for picking a value in a range (a level, a strength). Name it with `aria-label` /
 * `aria-labelledby`, and give `getAriaValueText` when the number alone doesn't say what it means
 * (e.g. "60% of background noise removed").
 */
export function Slider({ sx, ...props }: SliderProps) {
  return (
    <MuiSlider
      sx={[
        (theme) => {
          const colors = themeColors(theme);
          return {
            color: colors.info,
            '& .MuiSlider-rail': { backgroundColor: colors.surfaceHover, opacity: 1 },
            '& .MuiSlider-thumb': {
              color: colors.text,
              boxShadow: 'none',
              '&:hover, &.Mui-active': { boxShadow: 'none' },
              '&.Mui-focusVisible': { boxShadow: 'none', ...focusRingStyle(theme) },
            },
            '& .MuiSlider-mark': { backgroundColor: colors.mutedText, opacity: 0.6 },
            '& .MuiSlider-markLabel': { color: colors.mutedText, fontSize: 12 },
            '& .MuiSlider-markLabelActive': { color: colors.text },
            '& .MuiSlider-valueLabel': {
              backgroundColor: colors.surfaceRaised,
              color: colors.text,
            },
            '&.Mui-disabled': {
              color: colors.disabledText,
              '& .MuiSlider-thumb': { color: colors.disabledText },
            },
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}
