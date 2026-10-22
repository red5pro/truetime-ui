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
});
