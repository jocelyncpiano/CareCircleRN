import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { colors } from '../theme';

// A friendly squirrel mascot. The SwiftUI original is built from many custom
// Bezier paths; this is a clean, recognizable stylized version in the same
// teal/ink palette used across the app.
export function SquirrelMascot({ size = 120 }: { size?: number }) {
  const fur = colors.teal;
  const furDark = colors.tealDark;
  const belly = '#F4E9D8';
  const ink = colors.ink;

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      {/* Big curled tail */}
      <Path
        d="M92 96 C120 92 118 44 90 34 C70 27 58 44 66 58 C72 48 86 46 92 58 C99 72 84 84 70 82 Z"
        fill={furDark}
      />
      <Path
        d="M92 92 C112 86 110 50 88 42 C74 37 66 50 72 60 C77 52 88 52 92 62 C97 74 86 80 76 78 Z"
        fill={fur}
      />

      {/* Body */}
      <Ellipse cx="54" cy="80" rx="26" ry="28" fill={fur} />
      <Ellipse cx="52" cy="86" rx="16" ry="18" fill={belly} />

      {/* Feet */}
      <Ellipse cx="40" cy="106" rx="7" ry="5" fill={furDark} />
      <Ellipse cx="64" cy="106" rx="7" ry="5" fill={furDark} />

      {/* Head */}
      <Circle cx="52" cy="46" r="26" fill={fur} />

      {/* Ears */}
      <Path d="M34 26 C30 12 40 14 44 26 Z" fill={fur} />
      <Path d="M70 26 C74 12 64 14 60 26 Z" fill={fur} />
      <Path d="M36 24 C34 17 39 18 42 25 Z" fill={belly} />
      <Path d="M68 24 C70 17 65 18 62 25 Z" fill={belly} />

      {/* Cheeks / muzzle */}
      <Ellipse cx="52" cy="54" rx="15" ry="12" fill={belly} />

      {/* Eyes */}
      <Circle cx="44" cy="44" r="4.2" fill={ink} />
      <Circle cx="60" cy="44" r="4.2" fill={ink} />
      <Circle cx="45.4" cy="42.6" r="1.4" fill={colors.white} />
      <Circle cx="61.4" cy="42.6" r="1.4" fill={colors.white} />

      {/* Nose + smile */}
      <Ellipse cx="52" cy="52" rx="2.6" ry="2" fill={ink} />
      <Path
        d="M46 56 C49 60 55 60 58 56"
        stroke={ink}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />

      {/* Little hands holding an acorn */}
      <Ellipse cx="52" cy="74" rx="7" ry="6" fill="#C98A4B" />
      <Path d="M45 70 h14 v3 h-14 Z" fill="#8A5A2B" />
    </Svg>
  );
}
