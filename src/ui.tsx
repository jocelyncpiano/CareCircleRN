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
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const inner = scroll ? (
    <ScrollView
      contentContainerClassName={`p-6 pb-16 ${contentClassName ?? ''}`}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${contentClassName ?? ''}`}>{children}</View>
  );
  return (
    <SafeAreaView
      className={`flex-1 bg-background ${className ?? ''}`}
      edges={edges ?? ['top', 'left', 'right']}
    >
      {inner}
    </SafeAreaView>
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
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-2xl items-center justify-center active:opacity-85 ${
        large ? 'py-6 px-7' : 'py-4 px-6'
      } ${disabled ? 'opacity-40' : ''} ${className ?? ''}`}
      style={{ backgroundColor: color }}
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
              className={`text-white ${large ? 'text-3xl' : 'text-xl'}`}
              style={{ fontFamily: fontFamilyForWeight('700') }}
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

export function SecondaryButton({
  title,
  onPress,
  color = colors.secondary,
  className,
}: {
  title: string;
  onPress: () => void;
  color?: string;
  className?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`py-3 items-center active:opacity-60 ${className ?? ''}`}
    >
      <Text className="text-base" style={{ color, fontFamily: fontFamilyForWeight('600') }}>
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
