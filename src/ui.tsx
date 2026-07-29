import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { cssInterop } from 'nativewind';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font, fontFamilyForWeight } from './theme';

// Allow SafeAreaView to accept a Tailwind className.
cssInterop(SafeAreaView, { className: 'style' });

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export function Icon({
  name,
  size = 20,
  color = colors.ink,
  style,
}: {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Ionicons name={name as IoniconName} size={size} color={color} style={style} />
  );
}

export function Screen({
  children,
  scroll = true,
  className,
  contentClassName,
  edges,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  className?: string;
  contentClassName?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}) {
  // Read insets from the hook (seeded synchronously by initialWindowMetrics)
  // instead of the SafeAreaView component, which re-measures natively and can
  // flash a 0 inset on the first frame of a freshly presented modal — that was
  // the "title too high, then snaps down" bug.
  const insets = useSafeAreaInsets();
  const active = edges ?? ['top', 'left', 'right'];
  const safePadding = {
    paddingTop: active.includes('top') ? insets.top : 0,
    paddingBottom: active.includes('bottom') ? insets.bottom : 0,
    paddingLeft: active.includes('left') ? insets.left : 0,
    paddingRight: active.includes('right') ? insets.right : 0,
  };

  const inner = scroll ? (
    <ScrollView
      contentContainerStyle={{ padding: 24, paddingBottom: 64 }}
      contentContainerClassName={contentClassName ?? ''}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${contentClassName ?? ''}`}>{children}</View>
  );
  return (
    <View className={`flex-1 bg-background ${className ?? ''}`} style={safePadding}>
      {inner}
    </View>
  );
}

export function T({
  children,
  size = font.body,
  weight = '400',
  color = colors.ink,
  center,
  className,
  style,
  numberOfLines,
}: {
  children: React.ReactNode;
  size?: number;
  weight?: TextStyle['fontWeight'];
  color?: string;
  center?: boolean;
  className?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}) {
  return (
    <Text
      numberOfLines={numberOfLines}
      className={`${center ? 'text-center' : ''} ${className ?? ''}`}
      style={[{ fontSize: size, fontFamily: fontFamilyForWeight(weight), color }, style]}
    >
      {children}
    </Text>
  );
}

// Inline-styled flex row. Uses plain RN styles (not NativeWind className) so the
// layout is applied synchronously on first mount — avoids the "too tall then
// snaps into place" flicker when a screen is presented.
export function Row({
  children,
  gap,
  between,
  align = 'center',
  style,
}: {
  children: React.ReactNode;
  gap?: number;
  between?: boolean;
  align?: ViewStyle['alignItems'];
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: align,
          ...(gap != null ? { gap } : null),
          ...(between ? { justifyContent: 'space-between' } : null),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// Inline-styled circular icon container (replaces w-N h-N rounded-full className).
export function IconBubble({
  name,
  color,
  size = 40,
  iconSize = 22,
}: {
  name: string;
  color: string;
  size?: number;
  iconSize?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color + '22',
      }}
    >
      <Icon name={name} size={iconSize} color={color} />
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  icon,
  subtitle,
  disabled,
  loading,
  color = colors.teal,
  className,
  large,
  alignLeft,
  height,
  titleSize,
}: {
  title: string;
  onPress: () => void;
  icon?: string;
  subtitle?: string;
  disabled?: boolean;
  loading?: boolean;
  color?: string;
  className?: string;
  large?: boolean;
  alignLeft?: boolean;
  height?: number;
  titleSize?: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      accessibilityState={{ disabled: !!(disabled || loading) }}
      className={`rounded-2xl justify-center active:opacity-85 ${
        alignLeft ? 'items-start' : 'items-center'
      } ${large ? 'px-7' : 'px-6'} ${disabled ? 'opacity-40' : ''} ${className ?? ''}`}
      style={{
        backgroundColor: color,
        ...(height != null
          ? { height }
          : { paddingVertical: large ? 24 : 16 }),
      }}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <View className="flex-row items-center gap-3">
          {icon ? (
            <Icon name={icon} size={large ? 38 : subtitle ? 30 : 20} color={colors.white} />
          ) : null}
          <View className="shrink">
            <Text
              className="text-white"
              style={{
                fontFamily: fontFamilyForWeight('700'),
                fontSize: titleSize ?? (large ? 30 : 20),
                lineHeight: (titleSize ?? (large ? 30 : 20)) * 1.15,
                textAlign: alignLeft ? 'left' : 'center',
                includeFontPadding: false,
              }}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                className={`text-white/85 mt-0.5 ${large ? 'text-[17px]' : 'text-[15px]'}`}
                style={{ fontFamily: fontFamilyForWeight('400') }}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
      )}
    </Pressable>
  );
}

export function GradientButton({
  title,
  subtitle,
  onPress,
  icon,
  color,
  className,
}: {
  title: string;
  subtitle?: string;
  onPress: () => void;
  icon?: string;
  color: string;
  className?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      className={`rounded-2xl overflow-hidden active:opacity-85 ${className ?? ''}`}
      style={{ backgroundColor: color, height: 96, paddingHorizontal: 22, justifyContent: 'center' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {icon ? <Icon name={icon} size={28} color={colors.white} /> : null}
        <View style={{ flexShrink: 1 }}>
          <Text
            style={{
              fontFamily: fontFamilyForWeight('700'),
              color: colors.white,
              fontSize: 24,
              lineHeight: 28,
            }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={{
                fontFamily: fontFamilyForWeight('400'),
                color: 'rgba(255,255,255,0.85)',
                fontSize: 15,
                lineHeight: 19,
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export function SecondaryButton({
  title,
  onPress,
  color = colors.secondary,
  className,
  titleSize,
}: {
  title: string;
  onPress: () => void;
  color?: string;
  className?: string;
  titleSize?: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      className={`py-3 items-center active:opacity-60 ${className ?? ''}`}
    >
      <Text
        style={{
          color,
          fontFamily: fontFamilyForWeight('600'),
          fontSize: titleSize ?? 16,
          lineHeight: (titleSize ?? 16) * 1.2,
          textAlign: 'center',
          includeFontPadding: false,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function Card({
  children,
  onPress,
  className,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const cardClass = `bg-card rounded-lg p-4 shadow-sm shadow-ink/10 ${className ?? ''}`;
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        className={`${cardClass} active:opacity-90`}
        style={style}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View className={cardClass} style={style}>
      {children}
    </View>
  );
}

export function Badge({ label, color = colors.teal }: { label: string; color?: string }) {
  return (
    <View
      className="self-start rounded-full px-3 py-1"
      style={{ backgroundColor: color + '22' }}
    >
      <Text className="text-[13px]" style={{ color, fontFamily: fontFamilyForWeight('700') }}>
        {label}
      </Text>
    </View>
  );
}
