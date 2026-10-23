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
  /** Marked for review (e.g. reported); outlined and announced as flagged. */
  flagged?: boolean;
}

export interface ChatPanelProps {
  messages: ChatMessage[];
  /**
   * Return false (or a promise of false) when the message could not be sent; the draft is kept.
   * While a returned promise is pending, sending again is disabled.
   */
  onSend: (text: string) => boolean | void | Promise<boolean | void>;
  /** Replaces the composer with this explanation (e.g. chat not available). */
  unavailable?: ReactNode;
  /** Shown above the log, e.g. a notice or controls for the whole chat. */
  header?: ReactNode;
  /** Controls beside a message's author line, e.g. a menu of actions on it. */
  renderMessageActions?: (message: ChatMessage) => ReactNode;
  /** Shown right after a message's author name, e.g. an icon for the sender's role. */
  renderAuthorBadge?: (message: ChatMessage) => ReactNode;
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
  header,
  renderMessageActions,
  renderAuthorBadge,
  emptyText = 'No messages yet',
  placeholder = 'Send a message',
  maxLength = 1000,
  sendLabel = 'Send message',
}: ChatPanelProps) {
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages.length]);

  const send = (event?: FormEvent) => {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    const result = onSend(text);
    if (!(result instanceof Promise)) {
      if (result !== false) setDraft('');
      return;
    }
    setSending(true);
    result
      .then((sent) => {
        // Text typed meanwhile is kept
        if (sent !== false) setDraft((current) => (current.trim() === text ? '' : current));
      })
      .catch(() => {})
      .finally(() => setSending(false));
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) send(event);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
      {header}
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
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  maxWidth: '100%',
                  fontSize: 12,
                  color: themeColors(theme).mutedText,
                  mb: 0.5,
                })}
              >
                <span>{message.mine ? 'You' : message.author}</span>
                {renderAuthorBadge?.(message)}
                <span>
                  {' '}
                  · {formatTime(message.timestamp)}
                  {message.flagged && (
                    <Box component="span" sx={(theme) => ({ color: themeColors(theme).warning })}>
                      {' '}
                      · Flagged
                    </Box>
                  )}
                </span>
                {renderMessageActions?.(message)}
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
                  outline: message.flagged ? `1px solid ${themeColors(theme).warning}` : 'none',
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
              disabled={!draft.trim() || sending}
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
