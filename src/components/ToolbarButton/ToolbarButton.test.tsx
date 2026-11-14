import type { ReactElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TrueTimeThemeProvider } from '../../theme/TrueTimeThemeProvider.js';
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

describe('ToolbarButton tooltip', () => {
  it('can keep a short name and describe the action in the tooltip', async () => {
    renderWithTheme(
      <ToolbarButton icon={<svg />} label="Camera" tooltip="Turn camera off" pressed />,
    );
    const button = screen.getByRole('button', { name: 'Camera' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    fireEvent.mouseOver(button);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Turn camera off');
  });
});

describe('ToolbarButton element', () => {
  it('keeps the same element when it is disabled and enabled again', () => {
    const themed = (ui: ReactElement) => <TrueTimeThemeProvider>{ui}</TrueTimeThemeProvider>;
    const { rerender } = render(themed(<ToolbarButton icon={<svg />} label="Record" />));
    const before = screen.getByRole('button', { name: 'Record' });
    rerender(themed(<ToolbarButton icon={<svg />} label="Record" disabled />));
    rerender(themed(<ToolbarButton icon={<svg />} label="Record" pressed />));
    expect(screen.getByRole('button', { name: 'Record' })).toBe(before);
    expect(before).toHaveAttribute('aria-pressed', 'true');
  });
});
