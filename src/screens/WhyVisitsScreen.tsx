import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { colors, font } from '../theme';
import { Card, Icon, IconBubble, Row, Screen, T } from '../ui';

type Page = { body: string; note?: string };
type Topic = { title: string; icon: string; color: string; pages: Page[] };

const TOPICS: Topic[] = [
  {
    title: 'Why regular contact matters',
    icon: 'people',
    color: colors.teal,
    pages: [
      {
        body:
          'Conversation is how we include someone in our lives. It can be as ordinary as sharing family news, laughing at an old story, or asking what they think. The subject does not have to be important for the exchange to matter.',
      },
      {
        body:
          'Calls and messages help us stay in touch, but being in the same room gives you more to work with. You can notice a smile, a change in posture, or when someone is ready to move on \u2014 and respond right then.',
      },
    ],
  },
  {
    title: "Loneliness isn't just sad \u2014 it's harmful",
    icon: 'heart',
    color: colors.pink,
    pages: [
      {
        body:
          'Loneliness is more than an unpleasant feeling. Research has associated chronic loneliness with poorer physical health, depression, anxiety, and a higher risk of early death. Regular contact is one practical way families can push back against isolation.',
        note: 'Source: Acta Biomedica, vol. 89, no. 2. DOI: 10.23750/abm.v89i2.7404',
      },
      {
        body:
          'One visit cannot solve loneliness, and that is not a burden you need to carry. What a visit can do is interrupt an isolated day: someone came, brought news, listened, and included them in family life.',
      },
    ],
  },
  {
    title: 'When responses are limited',
    icon: 'chatbubble-ellipses',
    color: colors.indigo,
    pages: [
      {
        body:
          'It is easy to judge a visit by how much someone talks back. On some days, replies may be short, delayed, or absent. That changes how you carry the conversation, but it does not mean you should stop including them.',
      },
      {
        body:
          'Tell a short story, name the people in a photo, or describe what is happening around you. Then pause and watch their expression, eyes, and posture. You do not need to know exactly what they understand to keep speaking to them as part of the conversation.',
      },
    ],
  },
  {
    title: 'One small moment at a time',
    icon: 'leaf',
    color: colors.orange,
    pages: [
      {
        body:
          'Do not plan every minute or expect one visit to produce a breakthrough. Choose one starting point: a photograph, a song, a snack, or a story from your week. If it works, stay with it. If it does not, try something else.',
      },
      {
        body:
          'Make the next visit manageable: choose one day, one starting idea, and a length you can realistically repeat. A workable plan makes returning easier.',
      },
    ],
  },
];

function TopicReader({ topic, onBack }: { topic: Topic; onBack: () => void }) {
  const [page, setPage] = React.useState(0);
  const total = topic.pages.length;
  const current = topic.pages[page];

  return (
    <Screen>
      <Row between style={{ marginTop: 24 }}>
        <Pressable onPress={onBack} hitSlop={10}>
          <Row gap={4}>
            <Icon name="chevron-back" size={20} color={colors.teal} />
            <T color={colors.teal} weight="700">
              Back
            </T>
          </Row>
        </Pressable>
        <T color={colors.tertiary} weight="700" size={font.footnote}>
          {page + 1} of {total}
        </T>
      </Row>

      <Row gap={12} align="center" style={{ marginTop: 24 }}>
        <IconBubble name={topic.icon} color={topic.color} size={44} iconSize={24} />
        <T weight="800" size={font.title} style={{ flex: 1, lineHeight: font.title + 4 }}>
          {topic.title}
        </T>
      </Row>

      <Row gap={8} style={{ marginTop: 24 }}>
        {topic.pages.map((_, i) => (
          <Pressable
            key={i}
            onPress={() => setPage(i)}
            className="h-1.5 flex-1 rounded-full"
            style={{ backgroundColor: i === page ? topic.color : colors.hairline }}
          />
        ))}
      </Row>

      <Card className="mt-6">
        <T color={colors.secondaryStrong} size={font.body} style={{ lineHeight: 26 }}>
          {current.body}
        </T>
        {current.note && (
          <T color={colors.secondary} size={font.footnote} style={{ lineHeight: 22, marginTop: 12 }}>
            {current.note}
          </T>
        )}
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
              <T color={topic.color} weight="700">
                Next
              </T>
              <Icon name="chevron-forward" size={20} color={topic.color} />
            </Row>
          </Pressable>
        ) : (
          <Pressable onPress={onBack} hitSlop={10}>
            <Row gap={4}>
              <T color={topic.color} weight="700">
                Done
              </T>
              <Icon name="checkmark" size={20} color={topic.color} />
            </Row>
          </Pressable>
        )}
      </Row>
    </Screen>
  );
}

export function WhyVisitsScreen() {
  const nav = useNavigation<any>();
  const [active, setActive] = React.useState<number | null>(null);

  if (active !== null) {
    return <TopicReader topic={TOPICS[active]} onBack={() => setActive(null)} />;
  }

  return (
    <Screen>
      <Row between align="flex-start" style={{ marginTop: 24 }}>
        <T
          size={font.title}
          weight="800"
          style={{ flex: 1, marginRight: 16, lineHeight: font.title + 4 }}
        >
          The power of a visit
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
        A visit does not need a perfect conversation. Learn what regular,
        face-to-face time can offer and what to expect when responses are limited.
      </T>

      {TOPICS.map((topic, i) => (
        <Card key={topic.title} className="mb-3" onPress={() => setActive(i)}>
          <Row gap={12} align="center">
            <IconBubble name={topic.icon} color={topic.color} size={40} iconSize={22} />
            <T weight="800" size={font.headline} style={{ flex: 1, lineHeight: font.headline + 4 }}>
              {topic.title}
            </T>
            <Icon name="chevron-forward" size={20} color={colors.tertiary} />
          </Row>
        </Card>
      ))}
    </Screen>
  );
}
