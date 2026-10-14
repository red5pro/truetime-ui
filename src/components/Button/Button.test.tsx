import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { Button } from './Button.js';

describe('Button', () => {
  it('renders a contained button that handles clicks', () => {
    const onClick = vi.fn();
    renderWithTheme(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('MuiButton-contained');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled and busy while loading', () => {
    const onClick = vi.fn();
    renderWithTheme(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: /save/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('Button as a link', () => {
  it('renders the given component', () => {
    renderWithTheme(
      <Button component="a" href="/studios" variant="text">
        Studios
      </Button>,
    );
    expect(screen.getByRole('link', { name: 'Studios' })).toHaveAttribute('href', '/studios');
  });
});
