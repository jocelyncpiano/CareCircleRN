import React from 'react';
import Svg, { Path } from 'react-native-svg';

// A small acorn that matches the one the SquirrelMascot holds (same palette),
// so it reads as part of the same world rather than a stray icon. Used as a
// quiet decorative flourish, not a functional control.
export function Acorn({
  size = 22,
  nut = '#C98A4B',
  cap = '#8A5A2B',
}: {
  size?: number;
  nut?: string;
  cap?: string;
}) {
  const height = size * (28 / 24);
  return (
    <Svg width={size} height={height} viewBox="0 0 24 28">
      {/* stem */}
      <Path d="M12 2.5 V6" stroke={cap} strokeWidth={2.2} strokeLinecap="round" />
      {/* nut body */}
      <Path
        d="M5.6 12 C5.6 10.2 18.4 10.2 18.4 12 C18.4 20 14 25.5 12 25.5 C10 25.5 5.6 20 5.6 12 Z"
        fill={nut}
      />
      {/* cap */}
      <Path d="M4 11.4 C4.6 6 19.4 6 20 11.4 C20 12.9 4 12.9 4 11.4 Z" fill={cap} />
    </Svg>
  );
}
