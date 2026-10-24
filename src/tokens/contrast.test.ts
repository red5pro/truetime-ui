import { contrastRatio, looksLikeTally, readableOn, relativeLuminance } from './contrast.js';
import { broadcastColors, palettes, semanticColors } from './palettes.js';

describe('contrast helpers', () => {
  it('measures WCAG contrast', () => {
    expect(relativeLuminance('#000')).toBe(0);
    expect(relativeLuminance('#FFFFFF')).toBe(1);
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBe(1);
    // Order doesn't matter
    expect(contrastRatio('#E5252A', '#FFFFFF')).toBe(contrastRatio('#FFFFFF', '#E5252A'));
  });

  it('rejects colors it can’t read', () => {
    expect(() => relativeLuminance('red')).toThrow();
  });

  it('picks the text color that reads on a background', () => {
    expect(readableOn('#1FBF5B')).toBe('#0B0D10');
    expect(readableOn('#2A6FDB')).toBe('#FFFFFF');
  });

  it('tells colors that look like a tally from those that don’t', () => {
    expect(looksLikeTally('#FF0000')).toBe(true);
    expect(looksLikeTally('#22C55E')).toBe(true);
    expect(looksLikeTally('#2A6FDB')).toBe(false);
    expect(looksLikeTally('#A855F7')).toBe(false);
    // Greys have no hue to confuse
    expect(looksLikeTally('#8A8A8A')).toBe(false);
  });
});

describe('every palette', () => {
  it.each(Object.entries(palettes))('%s keeps text readable', (_, palette) => {
    const colors = semanticColors(palette);
    expect(contrastRatio(colors.text, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(colors.text, colors.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(colors.mutedText, colors.surface)).toBeGreaterThanOrEqual(4.5);
    // Focus rings and the error/warning states are UI parts against the page
    for (const part of [colors.focus, colors.error, colors.warning]) {
      expect(contrastRatio(part, colors.background)).toBeGreaterThanOrEqual(3);
    }
  });

  it('shares the tally colors, each readable with its text', () => {
    for (const palette of Object.values(palettes)) {
      const colors = semanticColors(palette);
      expect(colors.program).toBe(broadcastColors.program);
      expect(colors.preview).toBe(broadcastColors.preview);
    }
    expect(
      contrastRatio(broadcastColors.program, broadcastColors.onProgram),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(broadcastColors.preview, broadcastColors.onPreview),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('broadcast keeps its brand color off the tally hues, readable with white text', () => {
    const { broadcast } = palettes;
    expect(looksLikeTally(broadcast.primaryColor)).toBe(false);
    expect(contrastRatio(broadcast.primaryColor, broadcast.themeColor99)).toBeGreaterThanOrEqual(
      4.5,
    );
  });
});
