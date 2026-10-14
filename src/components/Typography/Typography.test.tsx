import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { Heading, Text } from './Typography.js';

describe('Typography', () => {
  it('renders semantic headings independent of visual variant', () => {
    renderWithTheme(
      <Heading level={1} variant="h5">
        Sign in
      </Heading>,
    );
    const heading = screen.getByRole('heading', { level: 1, name: 'Sign in' });
    expect(heading).toHaveClass('MuiTypography-h5');
  });

  it('renders body text as a paragraph', () => {
    renderWithTheme(<Text tone="muted">Hello</Text>);
    expect(screen.getByText('Hello').tagName).toBe('P');
  });
});
