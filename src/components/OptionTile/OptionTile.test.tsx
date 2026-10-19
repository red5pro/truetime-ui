import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { OptionTile } from './OptionTile.js';

describe('OptionTile', () => {
  it('is a labelled toggle with a hidden preview', () => {
    const onClick = vi.fn();
    renderWithTheme(
      <>
        <OptionTile preview={<span>swatch</span>} label="Midnight" selected onClick={onClick} />
        <OptionTile preview={<span>swatch</span>} label="Sunset" />
      </>,
    );
    const midnight = screen.getByRole('button', { name: 'Midnight' });
    expect(midnight).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Sunset' })).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(midnight);
    expect(onClick).toHaveBeenCalled();
  });
});
