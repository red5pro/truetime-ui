import { useEffect, useRef, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { MicOff } from '@mui/icons-material';
import { radii } from '../../tokens/tokens.js';
import { themeColors, visuallyHidden } from '../styleUtils.js';

export interface VideoTileProps {
  /** Live media; null renders the avatar placeholder. */
  stream: MediaStream | null;
  name: string;
  /** False when the participant turned their camera off. */
  videoEnabled?: boolean;
  /** False shows a muted-microphone indicator. */
  audioEnabled?: boolean;
  /** Mirror horizontally (local camera preview). */
  mirrored?: boolean;
  /**
   * Play the stream's audio from this element. Off by default: when a stream is shown in several
   * tiles, play its audio from exactly one place.
   */
  playAudio?: boolean;
  fit?: 'cover' | 'contain';
  /** Fill the parent instead of keeping a 16:9 box. */
  fill?: boolean;
  showName?: boolean;
  /** Top-left status (e.g. a StatusBadge). */
  status?: ReactNode;
  /** Actions revealed on hover or keyboard focus (always visible on touch screens). */
  actions?: ReactNode;
  highlighted?: boolean;
  /**
   * Broadcast tally: an inset border and a PGM / PVW chip in the tally color, for a source that's
   * on the program or in the preview. Program wins when it's both.
   */
  tally?: 'program' | 'preview' | null;
  /** Shown instead of the name's initials when there's no video (e.g. an icon for "offline"). */
  avatar?: ReactNode;
  /**
   * Without video, the avatar (or initials) fills the whole tile instead of a circle in its
   * middle; for small round tiles such as a participant's circle in a list.
   */
  avatarFill?: boolean;
  /**
   * id of the <video> element, for SDKs that look it up (red5pro-webrtc-sdk publishes through
   * `#red5pro-publisher`). Must be unique on the page.
   */
  videoId?: string;
  className?: string;
  sx?: SxProps<Theme>;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (
    parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2)
  ).toUpperCase();
}

/** One participant's video with name label, mic state and optional hover actions. */
export function VideoTile({
  stream,
  name,
  videoEnabled = true,
  audioEnabled = true,
  mirrored = false,
  playAudio = false,
  fit = 'cover',
  fill = false,
  showName = true,
  status,
  actions,
  highlighted = false,
  tally = null,
  avatar,
  avatarFill = false,
  videoId,
  className,
  sx,
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const showVideo = Boolean(stream) && videoEnabled;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = showVideo ? stream : null;
    if (showVideo) video.play?.()?.catch(() => {});
  }, [stream, showVideo]);

  return (
    <Box
      className={className}
      role="group"
      aria-label={name}
      sx={[
        (theme) => {
          const colors = themeColors(theme);
          return {
            position: 'relative',
            overflow: 'hidden',
            borderRadius: `${radii.control}px`,
            backgroundColor: colors.surfaceRaised,
            outline: highlighted ? `2px solid ${colors.text}` : 'none',
            outlineOffset: -2,
            ...(fill
              ? { width: '100%', height: '100%' }
              : { width: '100%', aspectRatio: '16 / 9' }),
            '& [data-tile-actions]': {
              opacity: 0,
              transition: 'opacity 0.15s ease-in-out',
            },
            '&:hover [data-tile-actions], &:focus-within [data-tile-actions]': { opacity: 1 },
            '@media (hover: none)': { '& [data-tile-actions]': { opacity: 1 } },
            // Drawn over the video, which would cover a border on the tile itself
            '&::after': tally
              ? {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'inherit',
                  boxShadow: `inset 0 0 0 3px ${colors[tally]}`,
                  pointerEvents: 'none',
                }
              : undefined,
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        component="video"
        id={videoId}
        ref={videoRef}
        autoPlay
        playsInline
        muted={!playAudio}
        sx={{
          display: showVideo ? 'block' : 'none',
          width: '100%',
          height: '100%',
          objectFit: fit,
          transform: mirrored ? 'scaleX(-1)' : 'none',
          backgroundColor: '#000',
        }}
      />

      {!showVideo && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <Box
            aria-hidden
            sx={(theme) => ({
              ...(avatarFill
                ? { width: '100%', height: '100%' }
                : { width: '28%', maxWidth: 96, aspectRatio: '1' }),
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 600,
              // The circle is the size container its initials are measured against
              containerType: 'inline-size',
              color: themeColors(theme).text,
              backgroundColor: themeColors(theme).surfaceHover,
            })}
          >
            {/* Initials are 35% of the circle, whatever the tile or window size */}
            <Box
              component="span"
              sx={{
                width: '100%',
                height: '100%',
                display: 'grid',
                placeItems: 'center',
                fontSize: '35cqi',
                lineHeight: 1,
              }}
            >
              {avatar ?? initials(name)}
            </Box>
          </Box>
        </Box>
      )}

      {(status || tally) && (
        <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 0.5 }}>
          {tally && (
            <Box
              component="span"
              data-tally={tally}
              sx={(theme) => {
                const colors = themeColors(theme);
                return {
                  px: 0.75,
                  borderRadius: '4px',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  lineHeight: '16px',
                  color: tally === 'program' ? colors.onProgram : colors.onPreview,
                  backgroundColor: colors[tally],
                };
              }}
            >
              <span aria-hidden>{tally === 'program' ? 'PGM' : 'PVW'}</span>
              <Box component="span" sx={visuallyHidden}>
                {tally === 'program' ? 'On the program' : 'In the preview'}
              </Box>
            </Box>
          )}
          {status}
        </Box>
      )}

      {showName && (
        <Box
          sx={(theme) => ({
            position: 'absolute',
            left: 8,
            bottom: 8,
            maxWidth: 'calc(100% - 16px)',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.25,
            borderRadius: `${radii.control}px`,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: themeColors(theme).text,
            fontSize: 13,
            lineHeight: '20px',
          })}
        >
          {!audioEnabled && <MicOff aria-label="Microphone off" sx={{ fontSize: 16 }} />}
          <Box
            component="span"
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {name}
          </Box>
        </Box>
      )}

      {actions && (
        <Box
          data-tile-actions
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
          }}
        >
          {actions}
        </Box>
      )}
    </Box>
  );
}
