import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { useStore } from '../models/store';
import { firstName } from '../models/types';
import { colors, font } from '../theme';
import { Card, Icon, Screen, T } from '../ui';

export function LifeStoryScreen() {
  const store = useStore();
  const nav = useNavigation<any>();
  const first = firstName(store.profile);
  const showQuestions = store.profile.level !== 'late';

  return (
    <Screen>
      <T size={font.largeTitle} weight="800">
        Their story
      </T>
      <T color={colors.secondary} className="mt-1 mb-6">
        Everything you add here becomes something warm to share on your next
        visit with {first}.
      </T>

      <LinkCard
        icon="sparkles"
        title="Facts about them"
        count={`${store.lifeFacts.length} saved`}
        onPress={() => nav.navigate('Facts')}
      />
      <LinkCard
        icon="book"
        title="Memories"
        count={`${store.memoryCards.length} saved`}
        onPress={() => nav.navigate('Memories')}
      />
      {showQuestions && (
        <LinkCard
          icon="chatbubbles"
          title="Questions to ask"
          count="Browse conversation starters"
          onPress={() => nav.navigate('QuestionBank')}
        />
      )}
      <LinkCard
        icon="musical-notes"
        title={`Songs ${first} knows`}
        count={`${store.comfortSongs.length} saved`}
        onPress={() => nav.navigate('Songs')}
      />
    </Screen>
  );
}

function LinkCard({
  icon,
  title,
  count,
  onPress,
}: {
  icon: string;
  title: string;
  count: string;
  onPress: () => void;
}) {
  return (
    <Card onPress={onPress} className="mb-3 rounded-lg">
      <View className="flex-row items-center gap-4">
        <View className="w-11 h-11 rounded-md bg-teal-soft items-center justify-center">
          <Icon name={icon} size={22} color={colors.teal} />
        </View>
        <View className="flex-1">
          <T weight="700">{title}</T>
          <T color={colors.secondary} size={font.subhead} className="mt-0.5">
            {count}
          </T>
        </View>
        <Icon name="chevron-forward" size={20} color={colors.tertiary} />
      </View>
    </Card>
  );
}
