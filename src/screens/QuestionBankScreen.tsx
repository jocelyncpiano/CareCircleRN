import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { discoveryQuestions } from '../models/content';
import {
  DiscoveryTheme,
  discoveryThemeMeta,
  discoveryThemes,
} from '../models/types';
import { colors, font } from '../theme';
import { Card, Icon, Screen, T } from '../ui';

export function QuestionBankScreen() {
  const nav = useNavigation<any>();
  const [open, setOpen] = useState<DiscoveryTheme | null>(null);

  return (
    <Screen>
      <View className="flex-row items-center">
        <Pressable onPress={() => nav.goBack()} hitSlop={10} className="flex-row items-center">
          <Icon name="chevron-back" size={22} color={colors.teal} />
          <T color={colors.teal}>Story</T>
        </Pressable>
      </View>

      <T size={font.title} weight="800" className="mt-2">
        Questions to ask
      </T>
      <T color={colors.secondary} className="mt-1 mb-4">
        Good open questions, grouped by theme. No right answers — just threads to
        pull.
      </T>

      {discoveryThemes.map((theme) => {
        const meta = discoveryThemeMeta[theme];
        const expanded = open === theme;
        return (
          <Card key={theme} className="mb-3 rounded-md">
            <Pressable
              className="flex-row items-center gap-3"
              onPress={() => setOpen(expanded ? null : theme)}
            >
              <View className="w-10 h-10 rounded-md bg-teal-soft items-center justify-center">
                <Icon name={meta.icon} size={20} color={colors.teal} />
              </View>
              <View className="flex-1">
                <T weight="700">{meta.label}</T>
                <T color={colors.secondary} size={font.subhead}>
                  {meta.blurb}
                </T>
              </View>
              <Icon
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.tertiary}
              />
            </Pressable>

            {expanded && (
              <View className="mt-3 border-t border-hairline pt-3 gap-3">
                {discoveryQuestions(theme).map((q) => (
                  <View key={q.id}>
                    <T weight="600">{q.text}</T>
                    {q.followUps.length > 0 && (
                      <T color={colors.secondary} size={font.subhead} className="mt-1">
                        {q.followUps.join(' · ')}
                      </T>
                    )}
                  </View>
                ))}
              </View>
            )}
          </Card>
        );
      })}
    </Screen>
  );
}
