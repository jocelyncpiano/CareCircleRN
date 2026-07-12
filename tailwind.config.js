/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Ported from src/theme.ts (careInk / careBackground and accents).
        ink: 'rgb(26, 56, 51)',
        background: 'rgb(245, 250, 245)',
        teal: {
          DEFAULT: '#2E8B8B',
          dark: '#1F6F6F',
          soft: 'rgba(46, 139, 139, 0.12)',
        },
        pink: {
          DEFAULT: '#E5739A',
          soft: 'rgba(229, 115, 154, 0.14)',
        },
        indigo: {
          DEFAULT: '#5A5AC5',
          soft: 'rgba(90, 90, 197, 0.12)',
        },
        orange: '#E08A3C',
        card: '#FFFFFF',
        secondary: 'rgba(26, 56, 51, 0.55)',
        tertiary: 'rgba(26, 56, 51, 0.35)',
        hairline: 'rgba(26, 56, 51, 0.10)',
      },
      borderRadius: {
        sm: '10px',
        md: '16px',
        lg: '22px',
      },
      fontSize: {
        footnote: '13px',
        subhead: '15px',
        callout: '16px',
        body: '17px',
        headline: '20px',
        section: '26px',
        title: '30px',
        largeTitle: '40px',
      },
    },
  },
  plugins: [],
};
