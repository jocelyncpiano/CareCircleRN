import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useStore } from '../models/store';
import {
  FunctioningLevel,
  cardResponseMeta,
  firstName,
  functioningLevelMeta,
} from '../models/types';
import { colors, font } from '../theme';
import { Card, Icon, PrimaryButton, Screen, T } from '../ui';

function startSubtitle(level: FunctioningLevel): string {
  switch (level) {
    case 'late':
      return 'Photos, songs, and quiet moments to share';
    case 'middle':
      return 'One gentle thing at a time';
    case 'early':
      return 'Photos, stories, and questions to explore';
  }
}

export function HomeScreen() {
  const store = useStore();
  const nav = useNavigation<any>();
  const first = firstName(store.profile);

  const hasFavorites = useMemo(
    () =>
      store.reviewSessions.some((s) =>
        s.outcomes.some((o) => o.response && cardResponseMeta[o.response].isPositive)
      ),
    [store.reviewSessions]
  );

  return (
    <Screen>
      <View className="mt-4">
        <T color={colors.secondary} size={font.callout}>
          Visiting
        </T>
        <T size={font.largeTitle} weight="800" className="mt-1">
          {first}
        </T>
        <T color={colors.secondary} size={font.body} className="mt-2 leading-6">
          {functioningLevelMeta[store.profile.level].caption}
        </T>
      </View>

      <View className="absolute top-6 right-6 flex-row items-center gap-4 z-10">
        <Pressable onPress={() => store.setWantsTour(true)} hitSlop={8}>
          <T color={colors.orange} weight="600">
            Intro
          </T>
        </Pressable>
        <Pressable onPress={() => nav.navigate('Profile')} hitSlop={8}>
          <Icon name="person-circle" size={26} color={colors.teal} />
        </Pressable>
      </View>

      <PrimaryButton
        title="Start a visit"
        subtitle={startSubtitle(store.profile.level)}
        icon="images"
        onPress={() => nav.navigate('Visit')}
        large
        className="mt-10"
      />

      {hasFavorites && (
        <Card onPress={() => nav.navigate('Favorites')} className="mt-8">
          <View className="flex-row items-center gap-3 py-1">
            <Icon name="heart-circle" size={34} color={colors.pink} />
            <View className="flex-1">
              <T weight="700" size={font.headline}>What does {first} like the most?</T>
              <T color={colors.secondary} size={font.subhead} className="mt-1">
                Ranked from what's landed in your visits
              </T>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.tertiary} />
          </View>
        </Card>
      )}
    </Screen>
  );
}
