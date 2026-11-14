import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { motion } from '../../tokens/tokens.js';
import { enterAnimation, transition } from '../../motion/motion.js';
import { Reveal } from './Reveal.js';

describe('Reveal', () => {
  it('renders its content with an enter animation', () => {
    renderWithTheme(<Reveal data-testid="reveal">Hello</Reveal>);
    const el = screen.getByTestId('reveal');
    expect(el).toHaveTextContent('Hello');
    expect(getComputedStyle(el).animation).toContain(`${motion.duration.enter}ms`);
  });

  it('staggers by index and caps long lists', () => {
    renderWithTheme(
      <>
        <Reveal data-testid="third" index={2} />
        <Reveal data-testid="far" index={50} />
      </>,
    );
    expect(getComputedStyle(screen.getByTestId('third')).animation).toContain(
      `${2 * motion.stagger}ms backwards`,
    );
    expect(getComputedStyle(screen.getByTestId('far')).animation).toContain(
      `${8 * motion.stagger}ms backwards`,
    );
  });
});

describe('motion helpers', () => {
  it('builds transitions from the tokens', () => {
    expect(transition(['opacity', 'transform'], { duration: 'fast', delay: 20 })).toBe(
      `opacity 150ms ${motion.easing.standard} 20ms, transform 150ms ${motion.easing.standard} 20ms`,
    );
    expect(transition('color', { duration: 90, easing: 'decelerate' })).toBe(
      `color 90ms ${motion.easing.decelerate}`,
    );
  });

  it('turns the enter animation off for reduced motion', () => {
    const style = enterAnimation({ variant: 'pop' });
    expect(style.animation).toContain(motion.easing.spring);
    expect(style['@media (prefers-reduced-motion: reduce)']).toEqual({ animation: 'none' });
  });
});
