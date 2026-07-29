import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useStore } from '../models/store';
import { firstName } from '../models/types';
import { colors, font } from '../theme';
import { Icon, PrimaryButton, Screen, T } from '../ui';
import { SquirrelMascot } from '../mascot/SquirrelMascot';

export function HomeScreen() {
  const store = useStore();
  const nav = useNavigation<any>();
  const first = firstName(store.profile);
  const visitCount = store.visitImpact.completedVisits;
  const isFirstTime = visitCount === 0;

  return (
    <Screen>
      <View className="mt-4">
        <T color={colors.secondary} size={font.callout}>
          Visiting
        </T>
        <T size={font.largeTitle} weight="800" className="mt-1">
          {first}
        </T>
      </View>

      <View className="flex-row items-center gap-3 mt-4 bg-teal-soft rounded-2xl p-4">
        <SquirrelMascot size={64} />
        <T
          color={colors.secondaryStrong}
          size={font.body}
          style={{ flex: 1, lineHeight: 26 }}
        >
          {isFirstTime
            ? "Welcome! Whenever you're ready, prepare first or jump right into a visit. CareCircle will guide you from there."
            : `Welcome back! That's ${visitCount} ${
                visitCount === 1 ? 'visit' : 'visits'
              } with ${first} so far — ready for another whenever you are.`}
        </T>
      </View>

      <View className="absolute top-6 right-6 flex-row items-center gap-4 z-10">
        <Pressable
          onPress={() => nav.navigate('Profile')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Profile"
          className="flex-row items-center gap-1"
        >
          <Icon name="person-circle" size={26} color={colors.teal} />
          <T color={colors.teal} weight="600" size={font.footnote}>
            Profile
          </T>
        </Pressable>
      </View>

      <PrimaryButton
        title="Prepare for a visit"
        icon="document-text"
        color={colors.orange}
        onPress={() => nav.navigate('PrepareVisit')}
        large
        alignLeft
        height={132}
        className="mt-10 active:scale-[0.98]"
      />

      <PrimaryButton
        title="Start a visit"
        icon="chatbubbles"
        onPress={() => nav.navigate('Visit')}
        large
        alignLeft
        height={132}
        className="mt-4 active:scale-[0.98]"
      />
    </Screen>
  );
}
