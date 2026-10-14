import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Send } from '@mui/icons-material';
import { Input } from '../Input/Input.js';
import { focusRingStyle, themeColors } from '../styleUtils.js';

export interface ChatMessage {
  id: string;
  author: string;
  text: string;
  timestamp: Date | string | number;
  /** Sent by the current user. */
  mine?: boolean;
}

export interface ChatPanelProps {
  messages: ChatMessage[];
  /** Return false when the message could not be sent; the draft is kept. */
  onSend: (text: string) => boolean | void;
  /** Replaces the composer with this explanation (e.g. chat not available). */
  unavailable?: ReactNode;
  emptyText?: ReactNode;
  placeholder?: string;
  maxLength?: number;
  sendLabel?: string;
}

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });

function formatTime(timestamp: ChatMessage['timestamp']) {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? '' : timeFormat.format(date);
}

/** Message log with a composer. Enter sends, Shift+Enter adds a line break. */
export function ChatPanel({
  messages,
  onSend,
  unavailable,
  emptyText = 'No messages yet',
  placeholder = 'Send a message',
  maxLength = 1000,
  sendLabel = 'Send message',
}: ChatPanelProps) {
  const [draft, setDraft] = useState('');
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages.length]);

  const send = (event?: FormEvent) => {
    event?.preventDefault();
    const text = draft.trim();
    if (!text) return;
    if (onSend(text) !== false) setDraft('');
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) send(event);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
      <Box
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        tabIndex={0}
        sx={(theme) => ({
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          p: 2,
          '&:focus-visible': focusRingStyle(theme),
        })}
      >
        {messages.length === 0 ? (
          <Box
            sx={(theme) => ({
              m: 'auto',
              fontSize: 14,
              color: themeColors(theme).mutedText,
              textAlign: 'center',
            })}
          >
            {emptyText}
          </Box>
        ) : (
          messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.mine ? 'flex-end' : 'flex-start',
              }}
            >
              <Box sx={(theme) => ({ fontSize: 12, color: themeColors(theme).mutedText, mb: 0.5 })}>
                {message.mine ? 'You' : message.author} · {formatTime(message.timestamp)}
              </Box>
              <Box
                sx={(theme) => ({
                  maxWidth: '85%',
                  px: 1.5,
                  py: 1,
                  borderRadius: '12px',
                  fontSize: 14,
                  lineHeight: 1.4,
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                  color: themeColors(theme).text,
                  backgroundColor: message.mine
                    ? themeColors(theme).secondary
                    : themeColors(theme).surfaceRaised,
                })}
              >
                {message.text}
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Box sx={(theme) => ({ p: 1.5, borderTop: `1px solid ${themeColors(theme).surfaceRaised}` })}>
        {unavailable ? (
          <Box
            sx={(theme) => ({
              fontSize: 13,
              color: themeColors(theme).mutedText,
              textAlign: 'center',
              py: 1,
            })}
          >
            {unavailable}
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={send}
            sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}
          >
            <Input
              multiline
              maxRows={4}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              inputProps={{ 'aria-label': placeholder, maxLength }}
              sx={{ '& textarea': { padding: '10px 14px' }, padding: 0 }}
            />
            <IconButton
              type="submit"
              aria-label={sendLabel}
              disabled={!draft.trim()}
              sx={(theme) => ({
                color: themeColors(theme).text,
                '&:hover': { backgroundColor: themeColors(theme).surfaceHover },
                '&.Mui-focusVisible': focusRingStyle(theme),
              })}
            >
              <Send />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}
