import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../models/store';
import {
  CardOutcome,
  CardResponse,
  FunctioningLevel,
  ReviewSession,
  firstName,
  lifeCategoryMeta,
  storyStance,
  uuid,
} from '../models/types';
import {
  VisitCard,
  buildDeck,
  cardIcon,
  makeOutcome,
  reshapeDeck,
} from '../visit/deck';
import { colors, font } from '../theme';
import { Icon, PrimaryButton, SecondaryButton, T } from '../ui';

type Stage = 'opener' | 'card' | 'recap';

export function VisitScreen() {
  const store = useStore();
  const nav = useNavigation<any>();
  const level = store.profile.level;
  const first = firstName(store.profile);

  const [stage, setStage] = useState<Stage>('opener');
  const [minutes, setMinutes] = useState(15);
  const [deck, setDeck] = useState<VisitCard[]>([]);
  const [outcomes, setOutcomes] = useState<CardOutcome[]>([]);
  const [index, setIndex] = useState(0);
  const [rating, setRating] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [created, setCreated] = useState<string[]>([]);
  const [recapNote, setRecapNote] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [showWrapUp, setShowWrapUp] = useState(false);
  const startedAt = useRef<number>(0);
  const wrapFired = useRef(false);

  const isLast = index >= deck.length - 1;
  const card = deck[index];

  useEffect(() => {
    if (stage !== 'card') return;
    const t = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
      const left = Math.max(0, minutes * 60 - elapsed);
      setSecondsLeft(left);
      if (left === 0 && !wrapFired.current) {
        wrapFired.current = true;
        setShowWrapUp(true);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [stage, minutes]);

  const begin = () => {
    const built = buildDeck(store, level, first, {
      includeFacts: true,
      includeMemories: true,
      includePhotos: true,
    });
    setDeck(built);
    setOutcomes(built.map(makeOutcome));
    setIndex(0);
    setSecondsLeft(minutes * 60);
    startedAt.current = Date.now();
    wrapFired.current = false;
    setShowWrapUp(false);
    setStage('card');
  };

  const react = (response: CardResponse) => {
    setOutcomes((prev) =>
      prev.map((o, i) => (i === index ? { ...o, response } : o))
    );
    const reshaped = reshapeDeck(deck, index, response, card, first);
    if (reshaped.length !== deck.length) {
      setDeck(reshaped);
      setOutcomes((prev) => {
        const next = [...prev];
        while (next.length < reshaped.length)
          next.push(makeOutcome(reshaped[next.length]));
        return next;
      });
    } else {
      setDeck(reshaped);
    }
    setRating(false);
    advance();
  };

  const advance = () => {
    if (isLast) setStage('recap');
    else setIndex((i) => i + 1);
  };

  const saveCapture = (text: string) => {
    const trimmed = text.trim();
    setCapturing(false);
    if (!trimmed) return;
    if (card.kind === 'question') {
      store.addLifeFact({
        id: uuid(),
        category: 'favorites',
        question: card.question.text,
        answer: trimmed,
        captures: [],
      });
      setCreated((c) => [...c, `“${trimmed}”`]);
    } else if (card.kind === 'fact') {
      const f = card.fact;
      store.updateLifeFact({
        ...f,
        captures: [
          { id: uuid(), date: new Date().toISOString(), text: trimmed },
          ...f.captures,
        ],
      });
      setCreated((c) => [...c, `Note on “${f.question}”`]);
    } else {
      setCreated((c) => [...c, trimmed]);
    }
  };

  const saveAndClose = (save: boolean) => {
    if (save) {
      const dur = Math.max(1, Math.floor((Date.now() - startedAt.current) / 60000));
      const session: ReviewSession = {
        id: uuid(),
        date: new Date().toISOString(),
        outcomes,
        durationMinutes: dur,
        note: recapNote.trim(),
      };
      store.addReviewSession(session);
    }
    nav.goBack();
  };

  if (stage === 'opener') {
    return (
      <Opener
        first={first}
        level={level}
        stance={storyStance(store.profile)}
        minutes={minutes}
        setMinutes={setMinutes}
        onBegin={begin}
        onCancel={() => nav.goBack()}
      />
    );
  }

  if (stage === 'recap') {
    return (
      <Recap
        first={first}
        outcomes={outcomes}
        created={created}
        note={recapNote}
        setNote={setRecapNote}
        onSave={() => saveAndClose(true)}
        onDiscard={() => saveAndClose(false)}
      />
    );
  }

  // Card stage
  const mm = Math.floor(secondsLeft / 60);
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row justify-between items-center px-6 py-3">
        <Pressable onPress={() => setStage('recap')} hitSlop={8}>
          <T color={colors.secondary} weight="600">
            End visit
          </T>
        </Pressable>
        <View className="flex-row items-center gap-1">
          <Icon
            name="hourglass-outline"
            size={16}
            color={secondsLeft === 0 ? colors.teal : colors.tertiary}
          />
          <T color={secondsLeft === 0 ? colors.teal : colors.tertiary} weight="600">
            {mm}:{ss}
          </T>
        </View>
      </View>

      {showWrapUp && (
        <View className="flex-row items-center gap-3 mx-4 p-4 rounded-md bg-teal-soft">
          <Icon name="notifications" size={18} color={colors.teal} />
          <View className="flex-1">
            <T weight="700">Nice place to pause?</T>
            <T color={colors.secondary} size={font.subhead}>
              You've been visiting a while. No rush — stay as long as you like.
            </T>
          </View>
          <Pressable onPress={() => setShowWrapUp(false)} hitSlop={8}>
            <Icon name="close" size={18} color={colors.tertiary} />
          </Pressable>
        </View>
      )}

      <ScrollView
        contentContainerClassName="p-6 grow justify-center"
        showsVerticalScrollIndicator={false}
      >
        {card && <CardBody card={card} level={level} first={first} />}
      </ScrollView>

      <View className="px-6 pb-4 pt-2 gap-1">
        <PrimaryButton
          title={isLast ? 'Finish' : 'Next'}
          onPress={() => setRating(true)}
        />
        {isCaptureable(card) && (
          <SecondaryButton
            title={captureLabel(card)}
            color={colors.teal}
            onPress={() => setCapturing(true)}
          />
        )}
      </View>

      <Modal visible={rating} animationType="fade" transparent>
        <Handover
          first={first}
          onRespond={react}
          onSkip={() => {
            setRating(false);
            advance();
          }}
        />
      </Modal>

      <CaptureSheet
        visible={capturing}
        first={first}
        subject={captureSubject(card)}
        onCancel={() => setCapturing(false)}
        onSave={saveCapture}
      />
    </SafeAreaView>
  );
}

// MARK: - Opener

function Opener({
  first,
  level,
  stance,
  minutes,
  setMinutes,
  onBegin,
  onCancel,
}: {
  first: string;
  level: FunctioningLevel;
  stance: ReturnType<typeof storyStance>;
  minutes: number;
  setMinutes: (n: number) => void;
  onBegin: () => void;
  onCancel: () => void;
}) {
  const opener =
    stance === 'giveVoice'
      ? `${first} remembers — show one thing at a time, then follow their lead.`
      : stance === 'remind'
      ? 'Name the faces and tell the stories. Gently anchor, never quiz.'
      : level === 'late'
      ? 'Sit close and show one thing at a time.'
      : level === 'middle'
      ? 'One thing at a time. Give them room to answer.'
      : 'A few photos and questions — follow wherever it goes.';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-6 justify-center items-center">
        <Icon name="images" size={44} color={colors.teal} />
        <T size={font.section} weight="800" center className="mt-4">
          Sitting down with {first}
        </T>
        <T color={colors.secondary} center className="mt-3 leading-6">
          {opener}
        </T>

        <View className="flex-row items-center gap-3 mt-8 p-4 rounded-md bg-card self-stretch">
          <Icon name="hourglass-outline" size={18} color={colors.teal} />
          <T weight="700" className="flex-1">
            Visit length
          </T>
          <Pressable
            onPress={() => setMinutes(Math.max(5, minutes - 5))}
            className="w-[34px] h-[34px] rounded-sm bg-teal-soft items-center justify-center"
          >
            <Icon name="remove" size={18} color={colors.teal} />
          </Pressable>
          <T weight="700">{minutes} min</T>
          <Pressable
            onPress={() => setMinutes(Math.min(60, minutes + 5))}
            className="w-[34px] h-[34px] rounded-sm bg-teal-soft items-center justify-center"
          >
            <Icon name="add" size={18} color={colors.teal} />
          </Pressable>
        </View>
      </View>

      <View className="px-6 pb-4 pt-2 gap-1">
        <PrimaryButton title="Begin" onPress={onBegin} />
        <SecondaryButton title="Not now" onPress={onCancel} />
      </View>
    </SafeAreaView>
  );
}

// MARK: - Card body (per kind + level)

function CardBody({
  card,
  level,
  first,
}: {
  card: VisitCard;
  level: FunctioningLevel;
  first: string;
}) {
  const label = cardLabel(card);
  const answerSize = level === 'late' ? 28 : level === 'middle' ? 26 : 24;

  return (
    <View>
      <View className="flex-row items-center gap-1.5 mb-4">
        <Icon name={cardIcon(card)} size={16} color={colors.teal} />
        <T color={colors.teal} weight="700" size={font.footnote}>
          {label.toUpperCase()}
        </T>
      </View>

      {card.kind === 'fact' && (
        <View>
          {!!card.fact.question && (
            <T color={colors.secondary} className="mb-2">
              {card.fact.question}
            </T>
          )}
          <T size={answerSize} weight="800">
            {card.fact.answer}
          </T>
          <Coach text={factCoach(level)} />
        </View>
      )}

      {card.kind === 'memory' && (
        <View>
          <T size={answerSize} weight="800">
            {card.memory.title}
          </T>
          <T className="mt-2" size={font.headline}>
            {card.memory.story}
          </T>
          {!!card.memory.prompt && <Coach text={card.memory.prompt} />}
        </View>
      )}

      {card.kind === 'photo' && (
        <View>
          <View className="h-[220px] rounded-lg bg-hairline items-center justify-center">
            <Icon name="image" size={40} color={colors.tertiary} />
          </View>
          {!!card.photo.caption && (
            <T size={font.headline} className="mt-3">
              {card.photo.caption}
            </T>
          )}
          <Coach text={`Look at it together. Point to who's in it and name them.`} />
        </View>
      )}

      {card.kind === 'song' && (
        <View>
          <T size={answerSize} weight="800">
            {card.song.title}
          </T>
          {!!card.song.artist && (
            <T color={colors.secondary} className="mt-1">
              {card.song.artist}
            </T>
          )}
          <Coach
            text={card.song.note || 'Hum it, or play it low. Watch for a foot tapping.'}
          />
        </View>
      )}

      {card.kind === 'sensory' && (
        <View>
          <T size={answerSize} weight="800">
            {card.moment.line}
          </T>
          <Coach text={card.moment.coach} />
        </View>
      )}

      {card.kind === 'activity' && (
        <View>
          <T size={answerSize} weight="800">
            {card.activity.title}
          </T>
          <Coach text={card.activity.coach} />
        </View>
      )}

      {card.kind === 'question' && (
        <View>
          <T size={answerSize} weight="800">
            {card.question.text}
          </T>
          {card.question.followUps.length > 0 && (
            <View className="mt-4">
              {card.question.followUps.map((f) => (
                <T key={f} color={colors.secondary} className="mb-1">
                  • {f}
                </T>
              ))}
            </View>
          )}
          <Coach text="No right answer — tap “Save a quote” to grow their story." />
        </View>
      )}
    </View>
  );
}

function Coach({ text }: { text: string }) {
  return (
    <View className="flex-row gap-2 mt-6 p-3 border-l-[3px] border-teal-soft">
      <Icon name="chatbubble-ellipses-outline" size={16} color={colors.secondary} />
      <T color={colors.secondary} size={font.subhead} className="flex-1 italic">
        {text}
      </T>
    </View>
  );
}

// MARK: - Handover reaction overlay

function Handover({
  first,
  onRespond,
  onSkip,
}: {
  first: string;
  onRespond: (r: CardResponse) => void;
  onSkip: () => void;
}) {
  return (
    <View className="flex-1 bg-background p-6 justify-center gap-8">
      <View className="items-center">
        <T size={font.title} weight="800" center>
          How did {first} take that?
        </T>
        <T color={colors.secondary} center className="mt-2">
          This helps CareCircle suggest what to try next.
        </T>
      </View>

      <View className="gap-3 w-full">
        <FeelingButton
          label="They loved it"
          icon="heart"
          color={colors.pink}
          onPress={() => onRespond('litUp')}
        />
        <FeelingButton
          label="That was nice"
          icon="happy"
          color={colors.teal}
          onPress={() => onRespond('smiled')}
        />
        <FeelingButton
          label="Didn't land"
          icon="cloud"
          color={colors.indigo}
          onPress={() => onRespond('hardMoment')}
        />
      </View>

      <SecondaryButton title="Skip" onPress={onSkip} />
    </View>
  );
}

function FeelingButton({
  label,
  icon,
  color,
  onPress,
}: {
  label: string;
  icon: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 p-6 rounded-lg"
      style={({ pressed }) => ({
        backgroundColor: color + '18',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Icon name={icon} size={26} color={color} />
      <T size={font.headline} weight="700" color={color}>
        {label}
      </T>
    </Pressable>
  );
}

// MARK: - Capture sheet

function CaptureSheet({
  visible,
  first,
  subject,
  onCancel,
  onSave,
}: {
  visible: boolean;
  first: string;
  subject: string;
  onCancel: () => void;
  onSave: (text: string) => void;
}) {
  const [text, setText] = useState('');
  useEffect(() => {
    if (visible) setText('');
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-row justify-between p-6">
          <Pressable onPress={onCancel} hitSlop={10}>
            <T color={colors.secondary}>Cancel</T>
          </Pressable>
          <Pressable onPress={() => onSave(text)} hitSlop={10} disabled={!text.trim()}>
            <T color={text.trim() ? colors.teal : colors.tertiary} weight="700">
              Save
            </T>
          </Pressable>
        </View>
        <View className="p-6">
          {!!subject && (
            <T color={colors.secondary} className="mb-3">
              {subject}
            </T>
          )}
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={`What ${first} said…`}
            placeholderTextColor={colors.tertiary}
            className="bg-card rounded-md p-4 text-headline text-ink min-h-[120px]"
            style={{ textAlignVertical: 'top' }}
            multiline
            autoFocus
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

// MARK: - Recap

function Recap({
  first,
  outcomes,
  created,
  note,
  setNote,
  onSave,
  onDiscard,
}: {
  first: string;
  outcomes: CardOutcome[];
  created: string[];
  note: string;
  setNote: (s: string) => void;
  onSave: () => void;
  onDiscard: () => void;
}) {
  const litUps = outcomes.filter((o) => o.response === 'litUp');
  const headline =
    litUps.length === 1
      ? `${first} lit up at “${litUps[0].question}”`
      : litUps.length >= 2
      ? `${first} lit up a few times today`
      : 'You spent some quiet time together';
  const subline =
    litUps.length >= 1
      ? 'Worth coming back to next time.'
      : "Some days are quieter — and that's okay.";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-6 pb-8">
        <View className="items-center mt-6">
          <Icon name="heart" size={46} color={colors.teal} />
          <T size={font.section} weight="800" center className="mt-3">
            {headline}
          </T>
          <T color={colors.secondary} center className="mt-2">
            {subline}
          </T>
        </View>

        {litUps.length > 0 && (
          <View className="bg-card rounded-md p-4 mt-6">
            <T weight="700" className="mb-2">
              What lit up
            </T>
            {litUps.map((o) => (
              <View key={o.id} className="flex-row items-center gap-2 mb-1.5">
                <Icon name="sparkles" size={15} color={colors.pink} />
                <T className="flex-1">{o.question}</T>
              </View>
            ))}
          </View>
        )}

        {created.length > 0 && (
          <View className="bg-card rounded-md p-4 mt-6">
            <T weight="700" className="mb-2">
              Added to their story
            </T>
            {created.map((c, i) => (
              <View key={i} className="flex-row items-center gap-2 mb-1.5">
                <Icon name="add-circle" size={15} color={colors.teal} />
                <T className="flex-1">{c}</T>
              </View>
            ))}
            <T color={colors.secondary} size={font.subhead} className="mt-2">
              It'll be waiting in Their Story next time.
            </T>
          </View>
        )}

        <T color={colors.secondary} weight="700" size={font.footnote} className="mt-6 mb-2 tracking-[0.5px]">
          FOR NEXT TIME
        </T>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="e.g. Wedding photo got the biggest smile. Skip work questions."
          placeholderTextColor={colors.tertiary}
          className="bg-card rounded-md p-4 text-headline text-ink min-h-[120px]"
          style={{ textAlignVertical: 'top' }}
          multiline
        />
      </ScrollView>

      <View className="px-6 pb-4 pt-2 gap-1">
        <PrimaryButton title="Save this visit" onPress={onSave} />
        <SecondaryButton title="Don't save this one" onPress={onDiscard} />
      </View>
    </SafeAreaView>
  );
}

// MARK: - helpers

function cardLabel(c: VisitCard): string {
  switch (c.kind) {
    case 'fact':
      return lifeCategoryMeta[c.fact.category].label;
    case 'memory':
      return 'A memory';
    case 'photo':
      return 'A photo';
    case 'song':
      return 'A song they know';
    case 'sensory':
      return 'Just be together';
    case 'activity':
      return 'Something to try';
    case 'question':
      return 'Something new';
  }
}

function factCoach(level: FunctioningLevel): string {
  switch (level) {
    case 'late':
      return 'Hold the phone where they can see, read it out, and wait.';
    case 'middle':
      return 'Tell it as a reminder — point to faces and name them.';
    case 'early':
      return 'A talking point, not a test. Follow wherever it goes.';
  }
}

function isCaptureable(c: VisitCard): boolean {
  return (
    c?.kind === 'fact' ||
    c?.kind === 'memory' ||
    c?.kind === 'photo' ||
    c?.kind === 'question'
  );
}

function captureLabel(c: VisitCard): string {
  if (c.kind === 'question') return 'Save a quote';
  if (c.kind === 'fact') return 'Note this';
  return 'Write it down';
}

function captureSubject(c: VisitCard): string {
  switch (c?.kind) {
    case 'fact':
      return c.fact.question;
    case 'memory':
      return c.memory.title;
    case 'photo':
      return c.photo.caption;
    case 'question':
      return c.question.text;
    default:
      return '';
  }
}
