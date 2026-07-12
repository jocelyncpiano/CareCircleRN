// Design tokens ported from the SwiftUI app.
// careInk / careBackground mirror the Color(red:green:blue:) constants.

export const colors = {
  /** Dark teal — all primary text. RGB(0.10, 0.22, 0.20). */
  ink: 'rgb(26, 56, 51)',
  /** Near-white — all backgrounds. RGB(0.96, 0.98, 0.96). */
  background: 'rgb(245, 250, 245)',
  /** Primary tint. */
  teal: '#2E8B8B',
  tealDark: '#1F6F6F',
  tealSoft: 'rgba(46, 139, 139, 0.12)',
  pink: '#E5739A',
  pinkSoft: 'rgba(229, 115, 154, 0.14)',
  indigo: '#5A5AC5',
  indigoSoft: 'rgba(90, 90, 197, 0.12)',
  orange: '#E08A3C',
  card: '#FFFFFF',
  secondary: 'rgba(26, 56, 51, 0.55)',
  /** Higher-contrast subtext — for body copy that must stay readable. */
  secondaryStrong: 'rgba(26, 56, 51, 0.82)',
  tertiary: 'rgba(26, 56, 51, 0.35)',
  hairline: 'rgba(26, 56, 51, 0.10)',
  white: '#FFFFFF',
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const font = {
  // Rounded, bold system look. RN maps to the platform system font.
  largeTitle: 40,
  title: 30,
  section: 26,
  headline: 20,
  body: 17,
  callout: 16,
  subhead: 15,
  footnote: 13,
  caption: 12,
};

// Comfortaa font families, one per weight (custom fonts don't honor fontWeight).
export const fontFamilies = {
  '300': 'Comfortaa_300Light',
  '400': 'Comfortaa_400Regular',
  '500': 'Comfortaa_500Medium',
  '600': 'Comfortaa_600SemiBold',
  '700': 'Comfortaa_700Bold',
} as const;

/** Map a fontWeight value to the matching Comfortaa family. */
export function fontFamilyForWeight(weight?: string | number): string {
  const w = String(weight ?? '400');
  if (w === 'bold') return fontFamilies['700'];
  if (w === 'normal') return fontFamilies['400'];
  if (w === '100' || w === '200' || w === '300') return fontFamilies['300'];
  if (w === '500') return fontFamilies['500'];
  if (w === '600') return fontFamilies['600'];
  if (w === '800' || w === '900') return fontFamilies['700'];
  return fontFamilies[(w as keyof typeof fontFamilies)] ?? fontFamilies['400'];
}

