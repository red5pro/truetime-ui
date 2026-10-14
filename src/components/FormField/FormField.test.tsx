import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { Input } from '../Input/Input.js';
import { FormField } from './FormField.js';

describe('FormField', () => {
  it('labels the input and describes it with the helper text', () => {
    renderWithTheme(
      <FormField label="Email" helperText="We never share it">
        <Input name="email" />
      </FormField>,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAccessibleDescription('We never share it');
    expect(input).not.toBeInvalid();
  });

  it('passes error, required and disabled state to the input', () => {
    renderWithTheme(
      <FormField label="Email" helperText="Enter your email" error required disabled>
        <Input name="email" />
      </FormField>,
    );
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeInvalid();
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
  });

  it('respects an explicit id', () => {
    renderWithTheme(
      <FormField label="Name" id="display-name">
        <Input />
      </FormField>,
    );
    expect(screen.getByLabelText('Name')).toHaveAttribute('id', 'display-name');
  });
});
