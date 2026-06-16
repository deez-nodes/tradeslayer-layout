/**
 * Typography tokens. Body/label text uses DM Sans; numeric & data readouts use
 * JetBrains Mono (the spec's --font-display) so figures align in tabular columns
 * and don't reflow as live values change. Centralizes the font-family string
 * literals that were previously scattered across every component.
 */
export const Fonts = {
  body: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  bold: 'DMSans_700Bold',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
} as const;

/** Type scale mirroring the design spec (px). */
export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 18,
  xl: 24,
  hero: 32,
} as const;
