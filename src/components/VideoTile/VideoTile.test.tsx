import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { VideoTile } from './VideoTile.js';

describe('VideoTile', () => {
  it('shows initials instead of video without a stream', () => {
    const { container } = renderWithTheme(<VideoTile stream={null} name="Ada Lovelace" />);
    expect(screen.getByText('AL')).toBeInTheDocument();
    expect(container.querySelector('video')).not.toBeVisible();
  });

  it('shows a custom avatar instead of initials', () => {
    renderWithTheme(<VideoTile stream={null} name="Not connected" avatar={<span>?</span>} />);
    expect(screen.getByText('?')).toBeInTheDocument();
    expect(screen.queryByText('NC')).not.toBeInTheDocument();
  });

  it('attaches the stream muted and labels the tile', () => {
    const stream = {} as MediaStream;
    const { container } = renderWithTheme(
      <VideoTile stream={stream} name="Ada" audioEnabled={false} />,
    );
    const video = container.querySelector('video')!;
    expect(video.srcObject).toBe(stream);
    expect(video.muted).toBe(true);
    expect(screen.getByRole('group', { name: 'Ada' })).toBeInTheDocument();
    expect(screen.getByLabelText('Microphone off')).toBeInTheDocument();
  });

  it('drops the stream when the camera is off', () => {
    const { container } = renderWithTheme(
      <VideoTile stream={{} as MediaStream} name="Ada" videoEnabled={false} />,
    );
    expect(container.querySelector('video')!.srcObject).toBeNull();
  });

  it('sets the video element id for SDK lookups', () => {
    const { container } = renderWithTheme(
      <VideoTile stream={null} name="Me" videoId="red5pro-publisher" />,
    );
    expect(container.querySelector('video#red5pro-publisher')).toBeInTheDocument();
  });

  it('renders hover actions', () => {
    renderWithTheme(<VideoTile stream={null} name="Ada" actions={<button>Add to Room</button>} />);
    expect(screen.getByRole('button', { name: 'Add to Room' })).toBeInTheDocument();
  });

  it('fills the whole tile with the avatar when asked, instead of a circle in the middle', () => {
    const { rerender } = renderWithTheme(<VideoTile stream={null} name="Ada Lovelace" />);
    const circle = () => screen.getByText('AL').parentElement!;
    expect(getComputedStyle(circle()).width).toBe('28%');
    rerender(<VideoTile stream={null} name="Ada Lovelace" avatarFill />);
    expect(getComputedStyle(circle()).width).toBe('100%');
    expect(getComputedStyle(circle()).height).toBe('100%');
  });
});
