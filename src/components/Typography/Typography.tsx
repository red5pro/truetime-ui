import Typography, { type TypographyProps } from '@mui/material/Typography';
import type { Theme } from '@mui/material/styles';
import { monoText } from '../../tokens/tokens.js';
import { themeColors } from '../styleUtils.js';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends Omit<TypographyProps<'h2'>, 'component'> {
  /** Semantic level; renders the matching <h1>-<h6> element. */
  level?: HeadingLevel;
}

/**
 * Semantic heading. The visual style defaults to the matching theme variant and can be decoupled
 * with `variant` (Meetings page titles use `h5` styling on a top-level heading).
 */
export function Heading({ level = 2, variant, ...props }: HeadingProps) {
  return <Typography component={`h${level}`} variant={variant ?? `h${level}`} {...props} />;
}

export type TextTone = 'default' | 'muted' | 'error' | 'success';

export interface TextProps extends TypographyProps {
  tone?: TextTone;
  /** Mono face with tabular digits, for timecodes, durations and measurements. */
  mono?: boolean;
}

const toneColor: Record<Exclude<TextTone, 'default'>, (theme: Theme) => string> = {
  muted: (theme) => themeColors(theme).mutedText,
  error: (theme) => themeColors(theme).error,
  success: (theme) => themeColors(theme).success,
};

/** Body text; defaults to `body1` rendered as a paragraph. */
export function Text({
  tone = 'default',
  variant = 'body1',
  mono = false,
  sx,
  ...props
}: TextProps) {
  return (
    <Typography
      variant={variant}
      sx={[
        tone !== 'default' && { color: toneColor[tone] },
        mono && monoText,
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}
