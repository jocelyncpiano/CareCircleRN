import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useStore } from '../models/store';
import { colors, font } from '../theme';
import { Card, Icon, IconBubble, Row, Screen, T } from '../ui';

type Support = 'less' | 'more';

type Activity = {
  title: string;
  icon: string;
  supplies: string;
  // Matches a card id in the more-support visit deck. When set, the caregiver
  // can add it to their visit and Visit Mode will bring it up first.
  cardId?: string;
};

// Ideas that work at any support level.
const UNIVERSAL_ACTIVITIES: Activity[] = [
  {
    title: 'Play a favorite game',
    icon: 'game-controller',
    supplies: 'A deck of cards, dominoes, or a simple board game they enjoy.',
    cardId: 'game',
  },
  {
    title: 'Color together',
    icon: 'brush',
    supplies: 'Coloring pages and a set of colored pencils or markers.',
    cardId: 'color',
  },
  {
    title: 'Crossword or word search',
    icon: 'grid',
    supplies: 'A few printed crossword or word-search sheets and a pen.',
    cardId: 'word-puzzle',
  },
  {
    title: 'Do a puzzle',
    icon: 'extension-puzzle',
    supplies: 'A jigsaw puzzle \u2014 pick one with larger, easy-to-handle pieces.',
    cardId: 'jigsaw',
  },
  {
    title: 'Look through photos',
    icon: 'images',
    supplies: 'A photo album or a few labeled family pictures to talk about.',
    cardId: 'photos',
  },
  {
    title: 'Listen to music',
    icon: 'musical-notes',
    supplies: 'A playlist of songs they love, plus a speaker or headphones.',
    cardId: 'music',
  },
  {
    title: 'Share a treat',
    icon: 'cafe',
    supplies: 'A favorite snack, dessert, or drink to enjoy together.',
    cardId: 'treat',
  },
  {
    title: 'Browse a magazine or picture book',
    icon: 'book',
    supplies: 'A magazine or picture book about something they love.',
    cardId: 'look-at',
  },
  {
    title: 'Read aloud',
    icon: 'reader',
    supplies: 'A short story, some poems, or a chapter of a favorite book.',
    cardId: 'read-aloud',
  },
];

// Extra ideas for when they can still do more (less support).
const LESS_SUPPORT_ACTIVITIES: Activity[] = [
  {
    title: 'Take a walk',
    icon: 'walk',
    supplies: 'Comfortable shoes, or a blanket if they use a wheelchair.',
    cardId: 'walk',
  },
  {
    title: 'Bake or cook something',
    icon: 'restaurant',
    supplies: 'A simple recipe and ingredients, or treats to decorate together.',
    cardId: 'bake',
  },
  {
    title: 'Tend plants or flowers',
    icon: 'flower',
    supplies: 'Fresh flowers to arrange, or a small potted plant.',
    cardId: 'plants',
  },
  {
    title: 'Sort through keepsakes',
    icon: 'file-tray-full',
    supplies: 'Old letters, recipe cards, or mementos to go through together.',
    cardId: 'keepsakes',
  },
  {
    title: 'Watch a favorite show or movie',
    icon: 'film',
    supplies: 'A beloved old film or TV show queued up, and some popcorn.',
    cardId: 'watch-show',
  },
  {
    title: 'Do a simple craft',
    icon: 'cut',
    supplies: 'A knitting or scrapbook project, or a seasonal craft kit.',
    cardId: 'craft',
  },
  {
    title: 'Write letters or cards',
    icon: 'create',
    supplies: 'Blank cards, stamps, and a list of people they\u2019d like to reach.',
    cardId: 'write-letters',
  },
  {
    title: 'Play or sing music',
    icon: 'mic',
    supplies: 'A songbook of old favorites, or an instrument they used to play.',
    cardId: 'sing',
  },
  {
    title: 'Reminisce over a map',
    icon: 'map',
    supplies: 'A map or photos of places they\u2019ve lived, worked, or traveled.',
    cardId: 'map',
  },
  {
    title: 'Play trivia or word games',
    icon: 'help-circle',
    supplies: 'Trivia cards, or classics like Scrabble, Boggle, or hangman.',
    cardId: 'trivia',
  },
];

// Extra ideas for more support \u2014 gentle, hands-on things you lead while they
// take part however they can (matches the more-support visit cards).
const MORE_SUPPORT_ACTIVITIES: Activity[] = [
  {
    title: 'Bake something together',
    icon: 'restaurant',
    supplies: 'Something simple to make \u2014 boxed cookies, muffins, anything easy.',
    cardId: 'bake',
  },
  {
    title: 'Put a scrapbook together',
    icon: 'images',
    supplies: 'A few photos, an album or paper, and some glue or tape.',
    cardId: 'scrapbook',
  },
  {
    title: 'Write a card to family',
    icon: 'create',
    supplies: 'A blank card or sheet of paper and a pen.',
    cardId: 'write-card',
  },
  {
    title: 'Press some flowers',
    icon: 'flower',
    supplies: 'A few fresh flowers and a heavy book to press them in.',
    cardId: 'press-flowers',
  },
  {
    title: 'Make a life-story page',
    icon: 'document-text',
    supplies: 'A sheet of paper and a pen.',
    cardId: 'life-story-page',
  },
  {
    title: 'Read old letters aloud',
    icon: 'mail',
    supplies: 'Old letters, cards, or notes from people who love them.',
    cardId: 'old-letters',
  },
];

// Mindset content is an adaptive prompt list (questions to ask vs. things to share).
const MINDSET_INTRO =
  'You don\u2019t need to plan the whole conversation. Bring a question, a family update, or one memory you can start with. Once you\u2019re there, Visit Mode will keep the ideas coming so you don\u2019t have to figure out what to say next.';

type Prompt = { title: string; icon: string; detail: string };

const MINDSET_PROMPTS: Record<
  Support,
  { heading: string; caption: string; prompts: Prompt[] }
> = {
  less: {
    heading: 'Questions to ask',
    caption:
      'Bring one or two questions, then build from the details they give you.',
    prompts: [
      {
        title: 'Their childhood',
        icon: 'happy',
        detail:
          'Start with \u201CWhat was your house like growing up?\u201D If they mention a person, place, or routine, ask about that next instead of moving down a list.',
      },
      {
        title: 'Family & love',
        icon: 'heart',
        detail:
          'Try \u201CHow did you and Dad meet?\u201D or \u201CWhat was your mother like?\u201D Let one person become the subject rather than asking about the whole family at once.',
      },
      {
        title: 'Work & pride',
        icon: 'briefcase',
        detail:
          'Ask \u201CWhat was your first job?\u201D Then follow the people and problems in the story: \u201CWho showed you what to do?\u201D or \u201CWhat happened next?\u201D',
      },
      {
        title: 'Fun & favorites',
        icon: 'musical-notes',
        detail:
          'Choose one subject they have enjoyed for years: music, travel, food, sports, or holidays. \u201CWhat music did you put on when friends came over?\u201D is easier to answer than \u201CWhat do you like?\u201D',
      },
      {
        title: 'Wisdom & advice',
        icon: 'bulb',
        detail:
          'Ask for advice about something real in your life: \u201CWhat helped you when work got difficult?\u201D A specific situation gives them more to respond to than a broad request for wisdom.',
      },
    ],
  },
  more: {
    heading: 'Things to share',
    caption:
      'Plan to carry more of the conversation with short stories they can listen or respond to.',
    prompts: [
      {
        title: 'Tell them about themselves',
        icon: 'person',
        detail:
          'Choose one specific example: \u201CYou made pancakes every Sunday, and you always gave me the first one.\u201D A real detail is easier to follow than a long summary of their life.',
      },
      {
        title: 'Share your life',
        icon: 'chatbubbles',
        detail:
          'Bring one update from work, the kids, or your day: \u201CSam started soccer this week and insisted on wearing his uniform to breakfast.\u201D Tell the story without requiring an answer.',
      },
      {
        title: 'Recall shared memories',
        icon: 'images',
        detail:
          'Pick one trip, holiday, or inside joke and tell the first part yourself: \u201CI was thinking about that drive to Colorado when we got caught in the rain.\u201D Add names and details instead of asking them to remember.',
      },
      {
        title: 'Say what you\u2019re grateful for',
        icon: 'gift',
        detail:
          'Thank them for one thing and say where it still shows up: \u201CYou taught me to call family when things get hard. I still do that.\u201D Keep it specific enough that they can picture what you mean.',
      },
    ],
  },
};

const ACTIVITIES = {
  title: 'Activities & what to bring',
  subtitle: 'Things to do together',
  icon: 'color-palette',
  color: colors.teal,
};

const MINDSET = {
  title: 'What to talk about',
  subtitle: 'Questions and stories to bring',
  icon: 'bulb',
  color: colors.orange,
};

function BackHeader({ onBack, counter }: { onBack: () => void; counter?: string }) {
  return (
    <Row between style={{ marginTop: 24 }}>
      <Pressable onPress={onBack} hitSlop={10}>
        <Row gap={4}>
          <Icon name="chevron-back" size={20} color={colors.teal} />
          <T color={colors.teal} weight="700">
            Back
          </T>
        </Row>
      </Pressable>
      {counter && (
        <T color={colors.tertiary} weight="700" size={font.footnote}>
          {counter}
        </T>
      )}
    </Row>
  );
}

function TopicHeading({ icon, color, title }: { icon: string; color: string; title: string }) {
  return (
    <Row gap={12} align="center" style={{ marginTop: 24 }}>
      <IconBubble name={icon} color={color} size={44} iconSize={24} />
      <T weight="800" size={font.title} style={{ flex: 1, lineHeight: font.title + 4 }}>
        {title}
      </T>
    </Row>
  );
}

function ActivitiesList({ support, onBack }: { support: Support; onBack: () => void }) {
  const [open, setOpen] = React.useState<number | null>(null);
  const { plannedActivities, togglePlannedActivity } = useStore();
  const activities =
    support === 'less'
      ? [...UNIVERSAL_ACTIVITIES, ...LESS_SUPPORT_ACTIVITIES]
      : [...UNIVERSAL_ACTIVITIES, ...MORE_SUPPORT_ACTIVITIES];
  const color = ACTIVITIES.color;
  const plannedCount = activities.filter(
    (a) => a.cardId && plannedActivities.includes(a.cardId)
  ).length;

  return (
    <Screen>
      <BackHeader onBack={onBack} />
      <TopicHeading icon={ACTIVITIES.icon} color={color} title={ACTIVITIES.title} />

      <T
        color={colors.secondaryStrong}
        size={font.body}
        style={{ marginTop: 12, marginBottom: plannedCount > 0 ? 12 : 24, lineHeight: 26 }}
      >
        {support === 'more'
          ? 'Pick a couple you can lead while they watch, listen, or join in — no need to plan the whole visit. '
          : 'Pick a couple that sound like them — no need to plan the whole visit. '}
        Tap the <T weight="800" color={color}>+</T> to add one, or tap the activity
        to see what to bring. Visit Mode will bring your picks up first and help
        you from there.
      </T>

      {plannedCount > 0 && (
        <Row gap={6} align="center" style={{ marginBottom: 24 }}>
          <Icon name="checkmark-circle" size={18} color={color} />
          <T color={color} weight="700" size={font.subhead}>
            {plannedCount} added to your visit
          </T>
        </Row>
      )}

      {activities.map((a, i) => {
        const isOpen = open === i;
        const isPlanned = !!a.cardId && plannedActivities.includes(a.cardId);
        return (
          <Card key={a.title} className="mb-3" onPress={() => setOpen(isOpen ? null : i)}>
            <Row gap={12} align="center">
              <IconBubble name={a.icon} color={color} size={40} iconSize={22} />
              <T weight="800" size={font.headline} style={{ flex: 1, lineHeight: font.headline + 4 }}>
                {a.title}
              </T>
              {a.cardId && (
                <Pressable
                  onPress={() => togglePlannedActivity(a.cardId!)}
                  hitSlop={10}
                  style={{ padding: 2, marginRight: 4 }}
                  className="active:opacity-80"
                  accessibilityRole="button"
                  accessibilityLabel={
                    isPlanned
                      ? `Remove ${a.title} from your visit`
                      : `Add ${a.title} to your visit`
                  }
                >
                  <Icon
                    name={isPlanned ? 'checkmark-circle' : 'add-circle-outline'}
                    size={26}
                    color={isPlanned ? color : colors.tertiary}
                  />
                </Pressable>
              )}
              <Icon
                name={isOpen ? 'chevron-down' : 'chevron-forward'}
                size={20}
                color={colors.tertiary}
              />
            </Row>
            {isOpen && (
              <View style={{ marginTop: 12, paddingLeft: 4 }}>
                <T color={color} weight="800" size={font.footnote} style={{ marginBottom: 4 }}>
                  BRING
                </T>
                <T color={colors.secondaryStrong} size={font.body} style={{ lineHeight: 26 }}>
                  {a.supplies}
                </T>
              </View>
            )}
          </Card>
        );
      })}
    </Screen>
  );
}

function MindsetList({ support, onBack }: { support: Support; onBack: () => void }) {
  const [open, setOpen] = React.useState<number | null>(null);
  const { heading, caption, prompts } = MINDSET_PROMPTS[support];
  const color = MINDSET.color;

  return (
    <Screen>
      <BackHeader onBack={onBack} />
      <TopicHeading icon={MINDSET.icon} color={color} title={MINDSET.title} />

      <Card className="mt-6">
        <T color={colors.secondaryStrong} size={font.body} style={{ lineHeight: 26 }}>
          {MINDSET_INTRO}
        </T>
      </Card>

      <T weight="800" size={font.headline} style={{ marginTop: 32, lineHeight: font.headline + 4 }}>
        {heading}
      </T>
      <T
        color={colors.secondary}
        size={font.subhead}
        style={{ marginTop: 4, marginBottom: 16, lineHeight: 22 }}
      >
        {caption}
      </T>

      {prompts.map((p, i) => {
        const isOpen = open === i;
        return (
          <Card key={p.title} className="mb-3" onPress={() => setOpen(isOpen ? null : i)}>
            <Row gap={12} align="center">
              <IconBubble name={p.icon} color={color} size={40} iconSize={22} />
              <T weight="800" size={font.headline} style={{ flex: 1, lineHeight: font.headline + 4 }}>
                {p.title}
              </T>
              <Icon
                name={isOpen ? 'chevron-down' : 'chevron-forward'}
                size={20}
                color={colors.tertiary}
              />
            </Row>
            {isOpen && (
              <View style={{ marginTop: 12, paddingLeft: 4 }}>
                <T color={colors.secondaryStrong} size={font.body} style={{ lineHeight: 26 }}>
                  {p.detail}
                </T>
              </View>
            )}
          </Card>
        );
      })}
    </Screen>
  );
}

export function HowToPrepScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { profile } = useStore();
  const support: Support = profile.level === 'late' ? 'more' : 'less';
  const deepLinked = route.params?.section as 'activities' | 'mindset' | undefined;
  const [active, setActive] = React.useState<'activities' | 'mindset' | null>(
    deepLinked ?? null
  );

  // When opened straight into a section (from the Prepare screen), Back should
  // dismiss rather than drop into the in-screen menu.
  const backFromSection = deepLinked ? () => nav.goBack() : () => setActive(null);

  if (active === 'activities') {
    return <ActivitiesList support={support} onBack={backFromSection} />;
  }
  if (active === 'mindset') {
    return <MindsetList support={support} onBack={backFromSection} />;
  }

  const topics = [
    { key: 'activities' as const, ...ACTIVITIES },
    { key: 'mindset' as const, ...MINDSET },
  ];

  return (
    <Screen>
      <Row between align="flex-start" style={{ marginTop: 24 }}>
        <T
          size={font.title}
          weight="800"
          style={{ flex: 1, marginRight: 16, lineHeight: font.title + 4 }}
        >
          How to prepare
        </T>
        <Pressable onPress={() => nav.goBack()} hitSlop={10}>
          <T color={colors.teal} weight="700">
            Done
          </T>
        </Pressable>
      </Row>

      <T
        color={colors.secondaryStrong}
        size={font.body}
        style={{ marginTop: 12, marginBottom: 24, lineHeight: 26 }}
      >
        Decide what you might do, what you need to bring, and one thing you can
        talk about. You only need a starting point; Visit Mode will help with
        what comes next.
      </T>

      {topics.map((topic) => (
        <Card key={topic.key} className="mb-3" onPress={() => setActive(topic.key)}>
          <Row gap={12} align="center">
            <IconBubble name={topic.icon} color={topic.color} size={40} iconSize={22} />
            <View style={{ flex: 1 }}>
              <T weight="800" size={font.headline} style={{ lineHeight: font.headline + 4 }}>
                {topic.title}
              </T>
              <T color={colors.secondary} size={font.subhead} style={{ marginTop: 2 }}>
                {topic.subtitle}
              </T>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.tertiary} />
          </Row>
        </Card>
      ))}
    </Screen>
  );
}
