import { createContext, useContext, useMemo, type ReactNode } from 'react';

/** Text the components show or announce themselves, for apps that translate their UI. */
export interface UiText {
  /** Spinner's default label. */
  loading: string;
  /** Announced on a Button with `holdMs`. */
  pressAndHold: string;
  /** VideoTile's tally, for screen readers. */
  onTheProgram: string;
  inThePreview: string;
  microphoneOff: string;
  /** VolumeControl's mute button; `name` is its label. */
  mute: (name: string) => string;
  unmute: (name: string) => string;
  /** ChatPanel. */
  chatMessages: string;
  noMessagesYet: string;
  sendAMessage: string;
  sendMessage: string;
  /** Shown instead of your own name on your messages. */
  you: string;
  /** PasswordInput's show/hide toggle. */
  showPassword: string;
  /** DeviceSelector. */
  camera: string;
  microphone: string;
  speaker: string;
  frontCamera: string;
  backCamera: string;
  noDeviceSelected: string;
}

export const defaultUiText: UiText = {
  loading: 'Loading',
  pressAndHold: 'Press and hold',
  onTheProgram: 'On the program',
  inThePreview: 'In the preview',
  microphoneOff: 'Microphone off',
  mute: (name) => `Mute ${name}`,
  unmute: (name) => `Unmute ${name}`,
  chatMessages: 'Chat messages',
  noMessagesYet: 'No messages yet',
  sendAMessage: 'Send a message',
  sendMessage: 'Send message',
  you: 'You',
  showPassword: 'Show password',
  camera: 'Camera',
  microphone: 'Microphone',
  speaker: 'Speaker',
  frontCamera: 'Front Camera',
  backCamera: 'Back Camera',
  noDeviceSelected: 'No device selected',
};

const UiTextContext = createContext<UiText>(defaultUiText);

export interface UiTextProviderProps {
  /** Replacements for the English defaults; anything left out stays English. */
  text: Partial<UiText>;
  children: ReactNode;
}

/** Translates the components' own text (labels, announcements) below it. */
export function UiTextProvider({ text, children }: UiTextProviderProps) {
  const value = useMemo(() => ({ ...defaultUiText, ...text }), [text]);
  return <UiTextContext.Provider value={value}>{children}</UiTextContext.Provider>;
}

/** The components' text: English unless an app's UiTextProvider says otherwise. */
export function useUiText(): UiText {
  return useContext(UiTextContext);
}
