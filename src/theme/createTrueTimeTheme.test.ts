import { createTrueTimeTheme } from './createTrueTimeTheme.js';
import { bluePalette, blackPalette } from '../tokens/palettes.js';

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
});
