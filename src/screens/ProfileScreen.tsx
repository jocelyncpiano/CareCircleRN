import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useStore } from '../models/store';
import {
  FunctioningLevel,
  RecallAbility,
  functioningLevelMeta,
  functioningLevels,
  recallMeta,
  recallOptions,
} from '../models/types';
import { SquirrelMascot } from '../mascot/SquirrelMascot';
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
          "Remember who you are." -- Kate DiCamillo, Flora & Ulysses
        </T>
      </View>

      <Section title="Who you're visiting">
        <TextInput
          value={profile.name}
          onChangeText={(name) => update({ name })}
          className="text-body text-ink py-3"
          placeholder="Name"
          placeholderTextColor={colors.tertiary}
        />
      </Section>

      <Section title="Support level">
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

      <Pressable
        className="flex-row gap-2 items-center justify-center mt-6 p-4"
        onPress={() => {
          store.setWantsTour(true);
          nav.goBack();
        }}
      >
        <Icon name="sparkles" size={18} color={colors.teal} />
        <T color={colors.teal} weight="700">
          Show me around again
        </T>
      </Pressable>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mt-6">
      <T color={colors.secondary} weight="700" size={font.footnote} className="mb-2 tracking-[0.5px]">
        {title.toUpperCase()}
      </T>
      <View className="bg-card rounded-md px-4 py-1 gap-1">{children}</View>
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
