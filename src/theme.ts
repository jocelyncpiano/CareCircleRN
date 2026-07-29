// Design tokens ported from the SwiftUI app.
// careInk / careBackground mirror the Color(red:green:blue:) constants.

export const colors = {
  /** Dark teal — all primary text. RGB(0.10, 0.22, 0.20). */
  ink: 'rgb(26, 56, 51)',
  /** Near-white app background with a faint cool cast. Was rgb(245,250,245). */
  background: '#F0F4F3',
  /** Primary tint. */
  teal: '#2E8B8B',
  tealDark: '#1F6F6F',
  tealSoft: 'rgba(46, 139, 139, 0.12)',
  pink: '#E5739A',
  pinkSoft: 'rgba(229, 115, 154, 0.14)',
  indigo: '#5A5AC5',
  indigoSoft: 'rgba(90, 90, 197, 0.12)',
  orange: '#CE7A2E',
  orangeSoft: 'rgba(206, 122, 46, 0.10)',
  card: '#FFFFFF',
  secondary: 'rgba(26, 56, 51, 0.55)',
  /** Higher-contrast subtext — for body copy that must stay readable. */
  secondaryStrong: 'rgba(26, 56, 51, 0.82)',
  tertiary: 'rgba(26, 56, 51, 0.45)',
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
  // Rounded system look. Sizes bumped up for Nunito, which renders a touch
  // smaller / more compact than Comfortaa did.
  largeTitle: 44,
  title: 34,
  section: 30,
  headline: 23,
  body: 20,
  callout: 19,
  subhead: 16,
  footnote: 14,
  caption: 13,
};

// Nunito font families, one per weight (custom fonts don't honor fontWeight).
export const fontFamilies = {
  '300': 'Nunito_300Light',
  '400': 'Nunito_400Regular',
  '500': 'Nunito_500Medium',
  '600': 'Nunito_600SemiBold',
  '700': 'Nunito_700Bold',
} as const;

/** Map a fontWeight value to the matching Nunito family. */
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

