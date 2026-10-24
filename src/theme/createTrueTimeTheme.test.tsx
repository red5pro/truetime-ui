import { screen } from '@testing-library/react';
import { Heading, Text } from '../components/Typography/Typography.js';
import { renderWithTheme } from '../test/render.js';
import { createTrueTimeTheme } from './createTrueTimeTheme.js';
import { auroraPalette, bluePalette, blackPalette, palettes } from '../tokens/palettes.js';

describe('createTrueTimeTheme', () => {
  it('builds the named palette', () => {
    const theme = createTrueTimeTheme('blue');
    expect(theme.palette.primary.main).toBe(bluePalette.primaryColor);
    expect(theme.palette.themeColor[80]).toBe(bluePalette.themeColor80);
    expect(theme.truetime.name).toBe('blue');
    expect(theme.truetime.colors.mutedText).toBe(bluePalette.secondaryText);
  });

  it('falls back to black for unknown names', () => {
    expect(createTrueTimeTheme('magenta').truetime.name).toBe('black');
    expect(createTrueTimeTheme('toString').truetime.name).toBe('black');
    expect(createTrueTimeTheme().palette.background.default).toBe(blackPalette.themeColor80);
  });

  it('gives every palette dark scrollbars', () => {
    for (const [name, palette] of Object.entries(palettes)) {
      const css = String(createTrueTimeTheme(name).components?.MuiCssBaseline?.styleOverrides);
      expect(css).toContain(`scrollbar-color: ${palette.themeColor60} ${palette.themeColor90}`);
      expect(css).toContain('color-scheme: dark');
    }
  });

  it('draws a gradient palette’s gradient behind the page', () => {
    const aurora = createTrueTimeTheme('aurora');
    expect(aurora.truetime.colors.backgroundImage).toBe(auroraPalette.backgroundGradient);
    expect(String(aurora.components?.MuiCssBaseline?.styleOverrides)).toContain(
      `background-image: ${auroraPalette.backgroundGradient}`,
    );
    // Flat palettes keep a plain page
    expect(createTrueTimeTheme('purple').truetime.colors.backgroundImage).toBe('none');
    expect(
      String(createTrueTimeTheme('black').components?.MuiCssBaseline?.styleOverrides),
    ).toContain('background-image: none');
  });

  it('colors menu icons like the menu item’s text', () => {
    const overrides = createTrueTimeTheme('blue').components?.MuiListItemIcon?.styleOverrides;
    expect(overrides?.root).toMatchObject({ color: 'inherit' });
  });

  it('sets text in Inter with the interface typeface, keeping the brand face for headings', () => {
    const brand = createTrueTimeTheme('broadcast');
    const ui = createTrueTimeTheme('broadcast', { typeface: 'interface' });
    expect(String(brand.components?.MuiCssBaseline?.styleOverrides)).toContain("'ClashDisplay'");
    expect(String(ui.components?.MuiCssBaseline?.styleOverrides)).toContain("'Inter'");
    expect(String(ui.typography.body1.fontFamily)).toContain('Inter');
    expect(String(ui.typography.h6.fontFamily)).toContain('ClashDisplay');
  });

  it('keeps headings in the brand face over the text face', () => {
    renderWithTheme(
      <>
        <Heading level={1} variant="h5">
          Sign in
        </Heading>
        <Text>Body</Text>
      </>,
      'interface',
    );
    expect(getComputedStyle(screen.getByText('Sign in')).fontFamily).toContain('ClashDisplay');
    expect(getComputedStyle(screen.getByText('Body')).fontFamily).toContain('Inter');
  });
});
