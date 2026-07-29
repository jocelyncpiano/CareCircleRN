import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { colors } from '../theme';

// A friendly squirrel mascot. The SwiftUI original is built from many custom
// Bezier paths; this is a clean, recognizable stylized version in the same
// teal/ink palette used across the app. It does a gentle idle bob so the app
// feels a little more alive (automatically stilled when the OS "reduce motion"
// setting is on).
export function SquirrelMascot({
  size = 120,
  animated = true,
  celebrate = false,
}: {
  size?: number;
  animated?: boolean;
  celebrate?: boolean;
}) {
  const fur = colors.teal;
  const furDark = colors.tealDark;
  const belly = '#F4E9D8';
  const ink = colors.ink;

  const bob = useRef(new Animated.Value(0)).current;
  const entrance = useRef(new Animated.Value(celebrate ? 0 : 1)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (mounted) setReduceMotion(v);
    });
    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion
    );
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  useEffect(() => {
    if (!animated || reduceMotion) {
      bob.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [animated, reduceMotion, bob]);

  useEffect(() => {
    if (!celebrate) return;
    if (reduceMotion) {
      entrance.setValue(1);
      return;
    }
    entrance.setValue(0);
    Animated.spring(entrance, {
      toValue: 1,
      friction: 5,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [celebrate, reduceMotion, entrance]);

  const idleTranslateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });
  const entranceTranslateY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [22, 0],
  });
  const translateY = Animated.add(idleTranslateY, entranceTranslateY);
  const scale = entrance.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] });
  const rotate = bob.interpolate({
    inputRange: [0, 1],
    outputRange: ['-2deg', '2deg'],
  });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        opacity: entrance,
        transform: [{ translateY }, { rotate }, { scale }],
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 120 120">
      {/* Big bushy tail — solid plume tucked behind the body, curling up */}
      <Path
        d="M62 96 C102 98 118 58 106 34 C98 18 74 18 68 36 C63 50 66 68 62 80 C60 88 60 92 62 96 Z"
        fill={furDark}
      />
      <Path
        d="M67 90 C96 91 108 58 99 38 C92 24 77 26 73 40 C70 51 71 66 68 78 C66 84 66 87 67 90 Z"
        fill={fur}
      />

      {/* Feet */}
      <Ellipse cx="36" cy="107" rx="7" ry="4.5" fill={furDark} />
      <Ellipse cx="56" cy="107" rx="7" ry="4.5" fill={furDark} />

      {/* Body */}
      <Ellipse cx="46" cy="80" rx="22" ry="26" fill={fur} />
      <Ellipse cx="45" cy="85" rx="13" ry="16" fill={belly} />

      {/* Little paws resting on the tummy */}
      <Ellipse cx="35" cy="80" rx="5" ry="6" fill={furDark} />
      <Ellipse cx="57" cy="80" rx="5" ry="6" fill={furDark} />

      {/* Ears (behind head) */}
      <Path d="M28 12 C21 21 25 30 34 28 C38 23 34 14 28 12 Z" fill={fur} />
      <Path d="M64 12 C71 21 67 30 58 28 C54 23 58 14 64 12 Z" fill={fur} />
      <Path d="M30 17 C27 22 30 26 34 25 C36 21 33 17 30 17 Z" fill={belly} />
      <Path d="M62 17 C65 22 62 26 58 25 C56 21 59 17 62 17 Z" fill={belly} />

      {/* Head */}
      <Circle cx="46" cy="42" r="24" fill={fur} />

      {/* Muzzle */}
      <Ellipse cx="46" cy="53" rx="11" ry="7.5" fill={belly} />

      {/* Eyes */}
      <Circle cx="38" cy="41" r="4.8" fill={ink} />
      <Circle cx="54" cy="41" r="4.8" fill={ink} />
      <Circle cx="39.6" cy="39.4" r="1.8" fill={colors.white} />
      <Circle cx="55.6" cy="39.4" r="1.8" fill={colors.white} />

      {/* Nose + happy split smile */}
      <Ellipse cx="46" cy="49" rx="2.7" ry="2.1" fill={ink} />
      <Path d="M46 51 V54" stroke={ink} strokeWidth={1.6} strokeLinecap="round" />
      <Path
        d="M46 54 Q42 58 39 54"
        stroke={ink}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M46 54 Q50 58 53 54"
        stroke={ink}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      </Svg>
    </Animated.View>
  );
}
