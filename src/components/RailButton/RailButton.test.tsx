import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { RailButton } from './RailButton.js';

describe('RailButton', () => {
  it('shows its label, selection and badge', () => {
    const onClick = vi.fn();
    renderWithTheme(
      <>
        <RailButton icon={<span>i</span>} label="Design" selected onClick={onClick} />
        <RailButton icon={<span>i</span>} label="Chat" badge={3} aria-label="Chat, 3 new" />
      </>,
    );
    const design = screen.getByRole('button', { name: 'Design' });
    expect(design).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(design);
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Chat, 3 new' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
