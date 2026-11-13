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
import { useUiText } from '../../text/UiText.js';

export interface ChatMessage {
  id: string;
  author: string;
  text: string;
  /** When it was sent; a string that isn't a date (e.g. "14:05") is shown as given. */
  timestamp: Date | string | number;
  /** Sent by the current user. */
  mine?: boolean;
  /** Marked for review (e.g. reported); outlined and announced as flagged. */
  flagged?: boolean;
  /**
   * Shown under the text, e.g. files sent with the message. A message with attachments and no text
   * shows no empty bubble.
   */
  attachments?: ReactNode;
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
  /** How a message's text is shown, e.g. with links made clickable. Plain text by default. */
  renderText?: (text: string, message: ChatMessage) => ReactNode;
  /** Before the text field, e.g. a button to attach files. */
  composerStart?: ReactNode;
  /** Above the text field, e.g. the files about to be sent. */
  composerAbove?: ReactNode;
  /** Allow sending with an empty text field, e.g. when files are attached. */
  canSendWithoutText?: boolean;
}

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });

/** A date as hours and minutes; a string that isn't a date is taken as already formatted. */
function formatTime(timestamp: ChatMessage['timestamp']) {
  const date = new Date(timestamp);
  if (!Number.isNaN(date.getTime())) return timeFormat.format(date);
  return typeof timestamp === 'string' ? timestamp : '';
}

/** Message log with a composer. Enter sends, Shift+Enter adds a line break. */
export function ChatPanel({
  messages,
  onSend,
  unavailable,
  header,
  renderMessageActions,
  renderAuthorBadge,
  emptyText: emptyTextProp,
  placeholder: placeholderProp,
  maxLength = 1000,
  sendLabel: sendLabelProp,
  renderText,
  composerStart,
  composerAbove,
  canSendWithoutText = false,
}: ChatPanelProps) {
  const text = useUiText();
  const emptyText = emptyTextProp ?? text.noMessagesYet;
  const placeholder = placeholderProp ?? text.sendAMessage;
  const sendLabel = sendLabelProp ?? text.sendMessage;
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
    if ((!text && !canSendWithoutText) || sending) return;
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
        aria-label={text.chatMessages}
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
                <span>{message.mine ? text.you : message.author}</span>
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
              {message.text && (
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
                  {renderText ? renderText(message.text, message) : message.text}
                </Box>
              )}
              {message.attachments && (
                <Box
                  sx={{
                    maxWidth: '85%',
                    mt: message.text ? 0.75 : 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.mine ? 'flex-end' : 'flex-start',
                    gap: 0.75,
                  }}
                >
                  {message.attachments}
                </Box>
              )}
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
          <Box component="form" onSubmit={send}>
            {composerAbove}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              {composerStart}
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
                disabled={(!draft.trim() && !canSendWithoutText) || sending}
                sx={(theme) => ({
                  color: themeColors(theme).text,
                  '&:hover': { backgroundColor: themeColors(theme).surfaceHover },
                  '&.Mui-focusVisible': focusRingStyle(theme),
                })}
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
