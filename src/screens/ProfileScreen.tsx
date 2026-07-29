import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useStore } from '../models/store';
import {
  FunctioningLevel,
  RecallAbility,
  firstName,
  functioningLevelMeta,
  functioningLevels,
  recallMeta,
  recallOptions,
} from '../models/types';
import { SquirrelMascot } from '../mascot/SquirrelMascot';
import { Acorn } from '../mascot/Acorn';
import { colors, font } from '../theme';
import { Icon, Screen, T } from '../ui';

export function ProfileScreen() {
  const store = useStore();
  const nav = useNavigation<any>();
  const { profile } = store;

  const update = (patch: Partial<typeof profile>) =>
    store.setProfile({ ...profile, ...patch });

  return (
    <Screen>
      <View className="flex-row justify-between items-center">
        <T size={font.title} weight="800">
          Profile
        </T>
        <Pressable onPress={() => nav.goBack()} hitSlop={10}>
          <T color={colors.teal} weight="700">
            Done
          </T>
        </Pressable>
      </View>

      <View className="items-center mt-4">
        <SquirrelMascot size={90} />
        <T color={colors.secondary} center className="mt-2">
          Visiting {firstName(profile)}
        </T>
        {/* Bookend flourish matching the visit Opener/End screens. */}
        <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 26, height: 1, backgroundColor: colors.hairline }} />
          <Acorn size={26} />
          <View style={{ width: 26, height: 1, backgroundColor: colors.hairline }} />
        </View>
      </View>

      <Section title="Who you're visiting" accent={colors.teal} tint={colors.tealSoft}>
        <TextInput
          value={profile.name}
          onChangeText={(name) => update({ name })}
          className="text-body text-ink py-3"
          placeholder="Name"
          placeholderTextColor={colors.tertiary}
        />
      </Section>

      <Section title="Support level" accent={colors.orange} tint={colors.orangeSoft}>
        {/* 'middle' (Some support) is hidden for now — remove the filter to restore it. */}
        {functioningLevels.filter((l) => l !== 'middle').map((l) => (
          <Row
            key={l}
            label={functioningLevelMeta[l].label}
            caption={functioningLevelMeta[l].caption}
            selected={profile.level === l}
            onPress={() => update({ level: l as FunctioningLevel })}
          />
        ))}
      </Section>
      <T color={colors.tertiary} size={font.footnote} className="mt-2 px-1" style={{ lineHeight: 18 }}>
        Changing this reshapes what your visits suggest.
      </T>

      {/* Memory section hidden for now — recall stays at its safe default.
          Keep this block to restore the picker later. */}
      {false && (
        <Section title="Memory">
          {recallOptions.map((r) => (
            <Row
              key={r}
              label={recallMeta[r].label}
              caption={recallMeta[r].caption}
              selected={profile.recall === r}
              onPress={() => update({ recall: r as RecallAbility })}
            />
          ))}
        </Section>
      )}

    </Screen>
  );
}

function Section({
  title,
  children,
  accent = colors.teal,
  tint = colors.card,
}: {
  title: string;
  children: React.ReactNode;
  accent?: string;
  tint?: string;
}) {
  return (
    <View className="mt-6">
      {/* TRYOUT (color personality): colored accent bar + tinted label instead of
          the gray uppercase caption. Revert = restore the single <T> line. */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <View style={{ width: 3, height: 14, borderRadius: 2, backgroundColor: accent }} />
        <T color={accent} weight="800" size={font.footnote} className="tracking-[0.5px]">
          {title.toUpperCase()}
        </T>
      </View>
      {/* TRYOUT (color personality): soft category wash instead of a flat white card.
          Revert = change style back to className="bg-card". */}
      <View className="rounded-md px-4 py-1 gap-1" style={{ backgroundColor: tint }}>
        {children}
      </View>
    </View>
  );
}

function Row({
  label,
  caption,
  selected,
  onPress,
}: {
  label: string;
  caption: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row gap-3 items-start py-3">
      <Icon
        name={selected ? 'checkmark-circle' : 'ellipse-outline'}
        size={22}
        color={selected ? colors.teal : colors.tertiary}
      />
      <View className="flex-1">
        <T weight="600">{label}</T>
        <T color={colors.secondary} size={font.subhead} className="mt-0.5">
          {caption}
        </T>
      </View>
    </Pressable>
  );
}
