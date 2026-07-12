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
  uuid,
} from '../models/types';
import { SquirrelMascot } from '../mascot/SquirrelMascot';
import { colors, font } from '../theme';
import { Icon, PrimaryButton, Screen, SecondaryButton, T } from '../ui';

type Step = 'welcome' | 'intro' | 'name' | 'level' | 'recall' | 'firstThing';
// 'recall' is intentionally omitted from the flow for now — the memory page is
// hidden (kept in the codebase) and the app stays in the safe default 'unsure'
// ("Hard to tell") recall mode. Re-add 'recall' below to restore the page.
const order: Step[] = ['welcome', 'intro', 'name', 'level', 'firstThing'];

export function OnboardingScreen() {
  const store = useStore();
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [level, setLevel] = useState<FunctioningLevel>('early');
  const [levelChosen, setLevelChosen] = useState(false);
  const [recall, setRecall] = useState<RecallAbility>('unsure');
  const [firstThing, setFirstThing] = useState('');

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
    store.setProfile({ name: name.trim() || 'Grandma Rose', level, recall });
    const seed = firstThing.trim();
    if (seed) {
      store.addLifeFact({
        id: uuid(),
        category: 'favorites',
        question: 'Something about them',
        answer: seed,
        captures: [],
      });
    }
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
      : step === 'firstThing'
      ? 'Start'
      : 'Continue';

  return (
    <Screen scroll={false}>
      <View className="px-6 pt-2 h-10 justify-center">
        {idx > 0 ? (
          <Pressable onPress={goBack} hitSlop={12} className="flex-row items-center gap-0.5">
            <Icon name="chevron-back" size={22} color={colors.secondary} />
            <T color={colors.secondary}>Back</T>
          </Pressable>
        ) : (
          <View />
        )}
      </View>

      <View className={`flex-1 px-6 ${step === 'welcome' ? 'justify-start' : 'justify-center'}`}>
        {step === 'welcome' && (
          <View className="items-center">
            <SquirrelMascot size={130} />
            <T size={font.largeTitle} weight="700" center className="mt-6">
              Welcome to CareCircle
            </T>
            <T size={24} color={colors.secondaryStrong} className="mt-[51px] leading-8">
              Visiting an aging loved one can be hard — you sit down, and the
              words don't come. CareCircle is a guide that helps you feel
              confident during your visits with your loved one, so every visit
              feels like a real conversation.
            </T>
          </View>
        )}

        {step === 'intro' && (
          <View>
            <T size={font.section} weight="700" className="mb-4">
              How it helps
            </T>
            {[
              ['Built from real visits', "It grew out of time spent beside seniors, where the right photo or question turned silence into a real conversation."],
              ['It gives you something to say', "One gentle suggestion/activity at a time, drawn from you tell us about your loved one's own life — so you always have a next thing."],
              ['Tailored to how they communicate', 'Tell us how your loved one talks with you today, and the whole visit reshapes to match.'],
            ].map(([title, body]) => (
              <View key={title} className="bg-teal-soft rounded-md p-4 mb-3">
                <T weight="700">{title}</T>
                <T size={18} color={colors.secondaryStrong} className="mt-1 leading-6">
                  {body}
                </T>
              </View>
            ))}
          </View>
        )}

        {step === 'name' && (
          <View>
            <T size={font.section} weight="700">
              Who are you visiting?
            </T>
            <T size={18} color={colors.secondaryStrong} className="mt-2">
              The first name, or nickname — whatever you feel comfortable calling them. For example: “Grandma.”
            </T>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Grandma"
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
            <View className="mt-4 gap-3">
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
            <T size={18} color={colors.secondaryStrong} className="mt-2">
              Memory and speech aren't the same — someone can remember everything yet struggle to say it. If you're not sure, just leave it.
            </T>
            <View className="mt-4 gap-3">
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

        {step === 'firstThing' && (
          <View>
            <T size={font.section} weight="700">
              Tell me something about {first}
            </T>
            <T size={18} color={colors.secondaryStrong} className="mt-2">
              This adds a talking point of conversation for your visit.
            </T>
            <TextInput
              value={firstThing}
              onChangeText={setFirstThing}
              placeholder="e.g. Their sister Ruth · The lake house · Frank Sinatra"
              placeholderTextColor={colors.tertiary}
              className="mt-6 border-b-2 border-hairline text-headline text-ink py-3"
              multiline
            />
          </View>
        )}
      </View>

      <View className="px-6 pb-[35px] pt-2">
        <PrimaryButton title={primaryTitle} onPress={goNext} disabled={!canContinue} />
      </View>
    </Screen>
  );
}

function levelTitle(l: FunctioningLevel): string {
  switch (l) {
    case 'early':
      return 'We can still have real conversations';
    case 'middle':
      return 'Short answers, one thing at a time';
    case 'late':
      return 'Mostly through presence — touch, faces, music';
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
            <T color={colors.secondaryStrong} size={font.body} className="mt-1 leading-6">
              {caption}
            </T>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

