import React, { useState } from 'react';
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
import { Acorn } from '../mascot/Acorn';
import { colors, font } from '../theme';
import { Icon, PrimaryButton, Screen, SecondaryButton, T } from '../ui';

type Step = 'welcome' | 'intro' | 'name' | 'level' | 'recall';
// 'recall' is intentionally omitted from the flow for now — the memory page is
// hidden (kept in the codebase) and the app stays in the safe default 'unsure'
// ("Hard to tell") recall mode. Re-add 'recall' below to restore the page.
const order: Step[] = ['welcome', 'intro', 'name', 'level'];

export function OnboardingScreen() {
  const store = useStore();
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [level, setLevel] = useState<FunctioningLevel>('early');
  const [levelChosen, setLevelChosen] = useState(false);
  const [recall, setRecall] = useState<RecallAbility>('unsure');

  const first = name.trim().split(' ')[0] || 'them';
  const idx = order.indexOf(step);

  const goNext = () => {
    if (idx < order.length - 1) setStep(order[idx + 1]);
    else finish();
  };
  const goBack = () => {
    if (idx > 0) setStep(order[idx - 1]);
  };

  const finish = () => {
    store.setProfile({ name: name.trim() || 'Rose', level, recall });
    store.setHasOnboarded(true);
    store.setWantsTour(true);
  };

  const canContinue =
    step === 'name' ? name.trim().length > 0 : step === 'level' ? levelChosen : true;

  const primaryTitle =
    step === 'welcome'
      ? 'Continue'
      : step === 'intro'
      ? 'Get started'
      : step === 'level'
      ? 'Finish setup'
      : 'Continue';

  return (
    <Screen scroll={false}>
      <View className="px-6 pt-2 h-10 justify-center">
        <View className="flex-row items-center justify-center" style={{ gap: 6 }}>
          {order.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === idx ? 20 : 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: i === idx ? colors.teal : colors.hairline,
              }}
            />
          ))}
        </View>
        {idx > 0 ? (
          <Pressable
            onPress={goBack}
            hitSlop={12}
            className="absolute left-6 top-0 bottom-0 flex-row items-center gap-0.5"
          >
            <Icon name="chevron-back" size={22} color={colors.secondary} />
            <T color={colors.secondary}>Back</T>
          </Pressable>
        ) : null}
      </View>

      <View
        className={`flex-1 px-6 ${
          step === 'welcome' ? 'justify-center' : 'justify-start pt-2'
        }`}
      >
        {step === 'welcome' && (
          <View className="items-center">
            <SquirrelMascot size={130} />
            <T size={font.largeTitle} weight="700" center className="mt-8">
              Welcome to CareCircle
            </T>
            <T
              size={26}
              weight="500"
              color={colors.secondaryStrong}
              center
              className="mt-6"
              style={{ lineHeight: 38 }}
            >
              We're so glad you're here. Visiting an aging loved one can be
                hard — you sit down, and the words don't come. CareCircle gives
                you a concrete question, activity, or story whenever you need a
                place to start.
            </T>

            {/* Bookend flourish matching the visit Opener/End screens. */}
            <View style={{ marginTop: 28, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 28, height: 1, backgroundColor: colors.hairline }} />
              <Acorn size={28} />
              <View style={{ width: 28, height: 1, backgroundColor: colors.hairline }} />
            </View>
          </View>
        )}

        {step === 'intro' && (
          <View>
            <T size={font.section} weight="700">
              How it helps
            </T>
            <View className="mt-6 gap-3">
              {[
                ['Built from real visits', 'It grew out of visits with older adults and their families, where a well-chosen photo, question, or activity gave both people an easier place to start.'],
                ['It gives you something to say', "One idea at a time — a question, an activity, or a story to share — so you always have a next thing to try."],
                ['Tailored to how they communicate', 'Tell us how your loved one communicates with you today, and the visit ideas will adjust to match.'],
              ].map(([title, body]) => (
                <View key={title} className="bg-teal-soft rounded-md p-4">
                  <T weight="700">{title}</T>
                  <T
                    size={font.body}
                    color={colors.secondaryStrong}
                    className="mt-1"
                    style={{ lineHeight: 26 }}
                  >
                    {body}
                  </T>
                </View>
              ))}
            </View>
          </View>
        )}

        {step === 'name' && (
          <View>
            <T size={font.section} weight="700">
              Who are you visiting?
            </T>
            <T
              size={font.body}
              color={colors.secondaryStrong}
              className="mt-3"
              style={{ lineHeight: 26 }}
            >
              The first name or nickname you use for them — “Mom,” “Papa,” “Rose,” whatever feels natural.
            </T>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Rose"
              placeholderTextColor={colors.tertiary}
              className="mt-6 border-b-2 border-hairline text-headline text-ink py-3"
              autoFocus
            />
          </View>
        )}

        {step === 'level' && (
          <View>
            <T size={font.section} weight="700">
              How does {first} communicate right now?
            </T>
            <View className="mt-6 gap-3">
              {/* 'middle' (Some support) is hidden for now — remove the filter to restore it. */}
              {functioningLevels.filter((l) => l !== 'middle').map((l) => (
                <OptionCard
                  key={l}
                  selected={levelChosen && level === l}
                  title={levelTitle(l)}
                  caption={functioningLevelMeta[l].caption}
                  onPress={() => {
                    setLevel(l);
                    setLevelChosen(true);
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {step === 'recall' && (
          <View>
            <T size={font.section} weight="700">
              Can {first} still recall their own past?
            </T>
            <T
              size={font.body}
              color={colors.secondaryStrong}
              className="mt-3"
              style={{ lineHeight: 26 }}
            >
              Memory and speech aren't the same — someone can remember everything yet struggle to say it. If you're not sure, just leave it.
            </T>
            <View className="mt-6 gap-3">
              {recallOptions.map((r) => (
                <OptionCard
                  key={r}
                  selected={recall === r}
                  title={recallMeta[r].label}
                  caption={recallMeta[r].caption}
                  onPress={() => setRecall(r)}
                />
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 28, paddingTop: 4, gap: 10 }}>
        <PrimaryButton
          title={primaryTitle}
          height={68}
          titleSize={24}
          onPress={goNext}
          disabled={!canContinue}
        />
        {/* Invisible placeholder matching the in-visit footer's secondary button,
            so the primary button sits at the exact same level as the visit flow. */}
        <View pointerEvents="none" style={{ opacity: 0 }}>
          <SecondaryButton title=" " titleSize={17} onPress={() => {}} />
        </View>
      </View>
    </Screen>
  );
}

function levelTitle(l: FunctioningLevel): string {
  switch (l) {
    case 'early':
      return 'They can lead parts of the visit';
    case 'middle':
      return 'Short answers, one thing at a time';
    case 'late':
      return 'I carry more of the visit';
  }
}

function OptionCard({
  selected,
  title,
  caption,
  onPress,
}: {
  selected: boolean;
  title: string;
  caption: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`border-2 rounded-md p-4 ${
        selected ? 'border-teal bg-teal-soft' : 'border-hairline bg-card'
      }`}
    >
      <View className="flex-row gap-3 items-start">
        <Icon
          name={selected ? 'radio-button-on' : 'radio-button-off'}
          size={22}
          color={selected ? colors.teal : colors.tertiary}
        />
        <View className="flex-1">
          <T weight="700">{title}</T>
          {selected ? (
            <T
              color={colors.secondaryStrong}
              size={font.body}
              className="mt-1"
              style={{ lineHeight: 26 }}
            >
              {caption}
            </T>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

