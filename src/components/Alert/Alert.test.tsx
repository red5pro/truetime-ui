import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { Alert } from './Alert.js';

describe('Alert', () => {
  it('announces errors as alerts', () => {
    renderWithTheme(<Alert title="Sign-in failed">Invalid email or password</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Sign-in failedInvalid email or password');
  });

  it('uses a polite status role for info', () => {
    renderWithTheme(<Alert severity="info">Saved</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });
});
