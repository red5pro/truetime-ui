import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { Switch } from './Switch.js';

describe('Switch', () => {
  it('reports changes and can be disabled', () => {
    const onChange = vi.fn();
    renderWithTheme(
      <>
        <Switch inputProps={{ 'aria-label': 'Show Linus' }} onChange={onChange} />
        <Switch inputProps={{ 'aria-label': 'Show Grace' }} disabled />
      </>,
    );
    const toggle = screen.getByRole('switch', { name: 'Show Linus' });
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(expect.anything(), true);
    expect(screen.getByRole('switch', { name: 'Show Grace' })).toBeDisabled();
  });
});

it('turns the preview green when on, with tone="preview"', () => {
  const { container } = renderWithTheme(
    <Switch tone="preview" checked readOnly inputProps={{ 'aria-label': 'In the preview' }} />,
  );
  const track = container.querySelector('.MuiSwitch-track')!;
  expect(getComputedStyle(track).backgroundColor).toBe('rgb(31, 191, 91)');
});
