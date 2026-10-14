import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { Checkbox } from './Checkbox.js';

describe('Checkbox', () => {
  it('toggles from its label', () => {
    renderWithTheme(<Checkbox label="Remember me" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Remember me' });
    expect(checkbox).not.toBeChecked();
    fireEvent.click(screen.getByText('Remember me'));
    expect(checkbox).toBeChecked();
  });
});
