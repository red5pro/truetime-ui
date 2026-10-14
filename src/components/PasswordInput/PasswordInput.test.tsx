import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { FormField } from '../FormField/FormField.js';
import { PasswordInput } from './PasswordInput.js';

describe('PasswordInput', () => {
  it('toggles password visibility', () => {
    renderWithTheme(
      <FormField label="Password">
        <PasswordInput />
      </FormField>,
    );
    const input = screen.getByLabelText('Password');
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(input).toHaveAttribute('type', 'password');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('disables the toggle with the input', () => {
    renderWithTheme(<PasswordInput disabled aria-label="Password" />);
    expect(screen.getByRole('button', { name: 'Show password' })).toBeDisabled();
  });
});
