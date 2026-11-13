import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { ToolbarButton } from './ToolbarButton.js';

describe('ToolbarButton', () => {
  it('is named by its label and reports a toggle state', () => {
    const onClick = vi.fn();
    renderWithTheme(
      <ToolbarButton icon={<svg />} label="Raise hand" pressed={false} onClick={onClick} />,
    );
    const button = screen.getByRole('button', { name: 'Raise hand' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('uses its visible text as the name when it has some', () => {
    renderWithTheme(
      <ToolbarButton label="Blur background" size="chip" pressed>
        Blur background
      </ToolbarButton>,
    );
    expect(screen.getByRole('button', { name: 'Blur background' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('leaves aria-pressed off plain actions', () => {
    renderWithTheme(<ToolbarButton icon={<svg />} label="Leave call" tone="danger" />);
    expect(screen.getByRole('button', { name: 'Leave call' })).not.toHaveAttribute('aria-pressed');
  });
});
