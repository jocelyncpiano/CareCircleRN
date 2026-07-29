import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useStore } from '../models/store';
import { colors, font } from '../theme';
import { Card, Icon, IconBubble, Row, Screen, T } from '../ui';

type Support = 'less' | 'more';
type Page = { tab: string; label?: string; labelColor?: string; body: string };
type Step = { title: string; icon: string; color: string; pages: Page[] };

const LIGHT = colors.teal;
const MORE = colors.indigo;

const STEPS: Step[] = [
  {
    title: 'Read the room',
    icon: 'eye',
    color: colors.teal,
    pages: [
      {
        tab: 'Overview',
        body:
          'Before you launch into what you brought or planned, notice what they are already doing. Do they look ready to talk, absorbed in a show, or just settling in? Let the first minute tell you whether to jump into conversation or ease into it.',
      },
      {
        tab: 'Light',
        label: 'With light support',
        labelColor: LIGHT,
        body:
          'Listen to the length and pace of their answers. If they are chatty, give them room and ask follow-up questions. If their answers are short or they seem tired, slow down and ask less of them.',
      },
      {
        tab: 'More',
        label: 'With more support',
        labelColor: MORE,
        body:
          'Watch their eyes, breathing, hands, and posture. If they are turning away, fidgeting, or tense, use fewer words and leave more time between them. If they look settled, begin with one simple observation: \u201CIt\u2019s nice by this window today.\u201D',
      },
    ],
  },
  {
    title: 'Start with what is in front of you',
    icon: 'hand-left',
    color: colors.pink,
    pages: [
      {
        tab: 'Overview',
        body:
          'Greet them as you normally would, then comment on something you both can see or share one thing from your day. Starting with shared ground gives the conversation somewhere to go.',
      },
      {
        tab: 'Light',
        label: 'With light support',
        labelColor: LIGHT,
        body:
          'Greet them as you normally would: \u201CI\u2019m happy to see you.\u201D Then use something in front of you: \u201CThose flowers look great,\u201D or \u201CIt finally stopped raining.\u201D Save questions about their week until the conversation is moving.',
      },
      {
        tab: 'More',
        label: 'With more support',
        labelColor: MORE,
        body:
          'Greet them by name and introduce yourself even if they do not answer: \u201CHi, it\u2019s me. I came to see you.\u201D Give them a few seconds, then sit down and begin with a short comment or story. You do not need a big reaction before continuing.',
      },
    ],
  },
  {
    title: 'Get curious',
    icon: 'heart-circle',
    color: colors.indigo,
    pages: [
      {
        tab: 'Overview',
        body:
          'A common mistake is planning your next question while they are still answering. Listen for one detail you can follow instead. If they mention a person, place, or opinion, ask about that before changing the subject.',
      },
      {
        tab: 'Light',
        label: 'With light support',
        labelColor: LIGHT,
        body:
          'Ask one open question, then build from their answer: \u201CWhat have you been watching lately?\u201D If they mention a show, ask what they like about it. Current opinions, family news, and older stories can all lead somewhere.',
      },
      {
        tab: 'More',
        label: 'With more support',
        labelColor: MORE,
        body:
          'Take more responsibility for carrying the conversation. Tell one short story from your week or share a memory of them: \u201CI still remember you teaching me to bake bread in your kitchen.\u201D Pause afterward. If they smile, look toward you, or make a sound, respond to that; if not, finish the story without turning it into a question.',
      },
    ],
  },
  {
    title: 'Respond before the next question',
    icon: 'repeat',
    color: colors.orange,
    pages: [
      {
        tab: 'Overview',
        body:
          'Before asking another question, respond to one detail or opinion they just shared. Repeat the important part, add your own reaction, then give them room to continue.',
      },
      {
        tab: 'Light',
        label: 'With light support',
        labelColor: LIGHT,
        body:
          'Respond to one part of their answer: \u201CYou went dancing every Saturday? That sounds like so much fun.\u201D Then pause. They may add more without another question; if they do, keep listening.',
      },
      {
        tab: 'More',
        label: 'With more support',
        labelColor: MORE,
        body:
          'Respond to what you can observe without guessing too much: \u201CYou\u2019re smiling at this song,\u201D or \u201CYou looked right at that photo.\u201D If their expression changes, pause or ask, \u201CShould we stay with this one?\u201D',
      },
    ],
  },
  {
    title: 'Follow their energy',
    icon: 'pulse',
    color: colors.pink,
    pages: [
      {
        tab: 'Overview',
        body:
          'Notice whether they are still adding to the conversation, asking questions, or paying attention to the activity. If a topic has energy, stay with it. If their attention moves elsewhere, let the visit move with it instead of forcing your original plan.',
      },
      {
        tab: 'Light',
        label: 'With light support',
        labelColor: LIGHT,
        body:
          'If they repeat a story, respond as you would the first time or pick up one detail from it. If they seem tired or less interested, stop adding questions. Offer a drink, change activities, or leave a little quiet.',
      },
      {
        tab: 'More',
        label: 'With more support',
        labelColor: MORE,
        body:
          'Watch for turning away, tensing, closing their eyes, fidgeting, or sudden agitation. First lower your voice, stop asking questions, and remove extra noise if you can. If the signs continue, pause the activity or end the visit rather than trying harder.',
      },
    ],
  },
  {
    title: 'Close it well',
    icon: 'sunny',
    color: colors.teal,
    pages: [
      {
        tab: 'Overview',
        body:
          'End while the conversation still feels comfortable instead of waiting for it to run out completely. Name one thing you enjoyed, say that you need to go, and close without introducing a new topic on your way to the door.',
      },
      {
        tab: 'Light',
        label: 'With light support',
        labelColor: LIGHT,
        body:
          'Try: \u201CI loved hearing about your first job. I have to head home now, but I\u2019ll call you this week.\u201D Make only the plans you can keep; a clear goodbye is more reassuring than a vague promise.',
      },
      {
        tab: 'More',
        label: 'With more support',
        labelColor: MORE,
        body:
          'Say the goodbye out loud: \u201CI\u2019m heading home now. I liked listening to music with you. I\u2019ll come see you again.\u201D Offer a hug or a hand on the shoulder only if they welcome touch, then leave without stretching the goodbye into another conversation.',
      },
    ],
  },
];

function StepReader({
  step,
  support,
  onBack,
}: {
  step: Step;
  support: Support;
  onBack: () => void;
}) {
  // Show only the Overview plus the page matching the loved one's support level
  // (they already chose during onboarding — no need to toggle less/more here).
  const detailTab = support === 'less' ? 'Light' : 'More';
  const pages = React.useMemo(
    () =>
      step.pages.filter(
        (p) => p.tab === 'Overview' || p.tab === detailTab
      ),
    [step, detailTab]
  );
  const [page, setPage] = React.useState(0);
  const total = pages.length;
  const current = pages[page];

  return (
    <Screen>
      <Row between style={{ marginTop: 24 }}>
        <Pressable onPress={onBack} hitSlop={10}>
          <Row gap={4}>
            <Icon name="chevron-back" size={20} color={colors.teal} />
            <T color={colors.teal} weight="700">
              Steps
            </T>
          </Row>
        </Pressable>
        <T color={colors.tertiary} weight="700" size={font.footnote}>
          {page + 1} of {total}
        </T>
      </Row>

      <Row gap={12} align="center" style={{ marginTop: 24 }}>
        <IconBubble name={step.icon} color={step.color} size={44} iconSize={24} />
        <T weight="800" size={font.title} style={{ flex: 1, lineHeight: font.title + 4 }}>
          {step.title}
        </T>
      </Row>

      <Row gap={8} style={{ marginTop: 24 }}>
        {pages.map((_, i) => (
          <Pressable
            key={i}
            onPress={() => setPage(i)}
            style={{
              height: 6,
              flex: 1,
              borderRadius: 999,
              backgroundColor: i === page ? step.color : colors.hairline,
            }}
          />
        ))}
      </Row>

      {!!current.label && (
        <T weight="700" size={font.footnote} color={current.labelColor ?? step.color} style={{ marginTop: 16 }}>
          {current.label}
        </T>
      )}

      <Card className="mt-3">
        <T color={colors.secondaryStrong} size={font.body} style={{ lineHeight: 26 }}>
          {current.body}
        </T>
      </Card>

      <Row between align="center" style={{ marginTop: 32 }}>
        {page > 0 ? (
          <Pressable onPress={() => setPage(page - 1)} hitSlop={10}>
            <Row gap={4}>
              <Icon name="chevron-back" size={20} color={colors.secondary} />
              <T color={colors.secondary} weight="700">
                Previous
              </T>
            </Row>
          </Pressable>
        ) : (
          <View />
        )}
        {page < total - 1 ? (
          <Pressable onPress={() => setPage(page + 1)} hitSlop={10}>
            <Row gap={4}>
              <T color={step.color} weight="700">
                Next
              </T>
              <Icon name="chevron-forward" size={20} color={step.color} />
            </Row>
          </Pressable>
        ) : (
          <Pressable onPress={onBack} hitSlop={10}>
            <Row gap={4}>
              <T color={step.color} weight="700">
                Done
              </T>
              <Icon name="checkmark" size={20} color={step.color} />
            </Row>
          </Pressable>
        )}
      </Row>
    </Screen>
  );
}

export function VisitFlowScreen() {
  const nav = useNavigation<any>();
  const { profile } = useStore();
  const support: Support = profile.level === 'late' ? 'more' : 'less';
  const [active, setActive] = React.useState<number | null>(null);

  if (active !== null) {
    return (
      <StepReader
        step={STEPS[active]}
        support={support}
        onBack={() => setActive(null)}
      />
    );
  }

  return (
    <Screen>
      <Row between align="flex-start" style={{ marginTop: 24 }}>
        <T
          size={font.title}
          weight="800"
          style={{ flex: 1, marginRight: 16, lineHeight: font.title + 4 }}
        >
          What a visit looks like
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
        A visit does not need a script, but it helps to know how to begin, how
        to respond, and when to wrap up. Tap any step to read more.
      </T>

      {STEPS.map((step, i) => (
        <Card key={step.title} className="mb-3" onPress={() => setActive(i)}>
          <Row gap={12} align="center">
            <IconBubble name={step.icon} color={step.color} size={40} iconSize={22} />
            <View style={{ flex: 1 }}>
              <T color={step.color} weight="700" size={font.footnote}>
                Step {i + 1}
              </T>
              <T weight="800" size={font.headline} style={{ lineHeight: font.headline + 4 }}>
                {step.title}
              </T>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.tertiary} />
          </Row>
        </Card>
      ))}
    </Screen>
  );
}
