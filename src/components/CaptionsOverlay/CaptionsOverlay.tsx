import Box, { type BoxProps } from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { readableOn } from '../../tokens/contrast.js';
import { radii, typography } from '../../tokens/tokens.js';
import { useUiText } from '../../text/UiText.js';
import { themeColors } from '../styleUtils.js';
import { enterAnimation } from '../../motion/motion.js';

export interface Caption {
  /** Stable key for the line. */
  id: string;
  text: string;
  /** Who said it; shown before the text when set. */
  speaker?: string;
}

export interface CaptionsOverlayProps extends Omit<BoxProps, 'children'> {
  /** Captions in the order they were spoken; only the last `maxLines` are shown. */
  captions: Caption[];
  /** How many of the latest lines to show. */
  maxLines?: number;
}

/**
 * Live captions over video: the latest lines on a dark band, bottom-centred in the nearest
 * positioned parent. A polite live region, so screen readers read new lines as they arrive.
 * Renders the region (empty) even with no captions, so the first line is announced too.
 */
export function CaptionsOverlay({ captions, maxLines = 3, sx, ...props }: CaptionsOverlayProps) {
  const text = useUiText();
  const lines = captions.slice(-maxLines);
  return (
    <Box
      role="log"
      aria-live="polite"
      aria-label={text.captions}
      {...props}
      sx={[
        {
          position: 'absolute',
          left: '50%',
          bottom: '6%',
          transform: 'translateX(-50%)',
          width: 'min(90%, 960px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          pointerEvents: 'none',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {lines.map((caption) => (
        <Box
          key={caption.id}
          sx={(theme) => {
            const { monitor } = themeColors(theme);
            return {
              maxWidth: '100%',
              px: 1.5,
              py: 0.5,
              borderRadius: `${radii.control}px`,
              backgroundColor: alpha(monitor, 0.8),
              color: readableOn(monitor),
              fontSize: typography.body1.fontSize,
              lineHeight: 1.4,
              textAlign: 'center',
              overflowWrap: 'anywhere',
              ...enterAnimation({ variant: 'up', duration: 'fast' }),
            };
          }}
        >
          {caption.speaker && (
            <Box component="span" sx={{ fontWeight: 600, mr: 0.75 }}>
              {caption.speaker}:
            </Box>
          )}
          {caption.text}
        </Box>
      ))}
    </Box>
  );
}
