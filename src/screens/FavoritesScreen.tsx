import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useStore } from '../models/store';
import { firstName } from '../models/types';
import { colors, font } from '../theme';
import { Card, Icon, Screen, T } from '../ui';

interface Ranked {
  key: string;
  title: string;
  isMemory: boolean;
  litUp: number;
  smiled: number;
  score: number;
}

export function FavoritesScreen() {
  const store = useStore();
  const nav = useNavigation<any>();
  const first = firstName(store.profile);

  const ranked = useMemo<Ranked[]>(() => {
    const map = new Map<string, Ranked>();
    for (const s of store.reviewSessions) {
      for (const o of s.outcomes) {
        if (o.response !== 'litUp' && o.response !== 'smiled') continue;
        const key = o.question;
        const cur =
          map.get(key) ??
          { key, title: o.question, isMemory: !!o.answer, litUp: 0, smiled: 0, score: 0 };
        if (o.response === 'litUp') cur.litUp += 1;
        else cur.smiled += 1;
        cur.score = cur.litUp * 2 + cur.smiled;
        map.set(key, cur);
      }
    }
    return [...map.values()].sort((a, b) => b.score - a.score);
  }, [store.reviewSessions]);

  return (
    <Screen>
      <View className="flex-row justify-between items-center">
        <T size={font.title} weight="800">
          {first}'s favorites
        </T>
        <Pressable onPress={() => nav.goBack()} hitSlop={10}>
          <T color={colors.teal} weight="700">
            Done
          </T>
        </Pressable>
      </View>
      <T color={colors.secondary} className="mt-2 mb-4">
        Ranked from the moments that have landed best in your visits.
      </T>

      {ranked.map((item, i) => (
        <Card key={item.key} className="mb-3 rounded-md">
          <View className="flex-row gap-4 items-center">
            <T size={22} weight="800" color={colors.teal}>
              {i + 1}
            </T>
            <View className="flex-1">
              <T weight="700">{item.title}</T>
              <View className="flex-row items-center gap-1 mt-1">
                <Icon name="heart" size={13} color={colors.pink} />
                <T color={colors.pink} size={font.footnote} weight="600">
                  {item.litUp > 0 ? `${item.litUp}× lit up` : ''}
                  {item.litUp > 0 && item.smiled > 0 ? ' · ' : ''}
                  {item.smiled > 0 ? `${item.smiled}× smiled` : ''}
                </T>
              </View>
            </View>
          </View>
        </Card>
      ))}

      {ranked.length === 0 && (
        <T color={colors.secondary} center className="mt-8">
          Nothing yet — finish a visit and the things that light {first} up will
          show up here.
        </T>
      )}
    </Screen>
  );
}
