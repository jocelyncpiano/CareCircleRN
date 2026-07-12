import { activityDeck, discoveryQuestions, isSampleFact, isSampleMemory } from '../models/content';
import {
  ActivitySuggestion,
  CardResponse,
  ComfortSong,
  DiscoveryQuestion,
  DiscoveryTheme,
  FunctioningLevel,
  GalleryPhoto,
  LifeCategory,
  LifeFact,
  MemoryCard,
  SensoryMoment,
  activityKindIcon,
  discoveryThemes,
  lifeCategoryMeta,
  restfulMoment,
  softenerMoment,
  uuid,
} from '../models/types';
import { Store } from '../models/store';

// Discovery theme → life category, used to keep "lit up" threads together.
const themeToCategory: Record<DiscoveryTheme, LifeCategory> = {
  childhood: 'everyday',
  youngerYears: 'everyday',
  loveAndFamily: 'family',
  workAndPride: 'work',
  favoritesAndFun: 'favorites',
  opinionsAndAdvice: 'everyday',
};

export type VisitCard =
  | { kind: 'fact'; id: string; fact: LifeFact }
  | { kind: 'memory'; id: string; memory: MemoryCard }
  | { kind: 'photo'; id: string; photo: GalleryPhoto }
  | { kind: 'sensory'; id: string; moment: SensoryMoment }
  | { kind: 'song'; id: string; song: ComfortSong }
  | {
      kind: 'question';
      id: string;
      question: DiscoveryQuestion;
      theme: DiscoveryTheme;
    }
  | { kind: 'activity'; id: string; activity: ActivitySuggestion };

export function cardCategory(c: VisitCard): LifeCategory | undefined {
  if (c.kind === 'fact') return c.fact.category;
  if (c.kind === 'question') return themeToCategory[c.theme];
  return undefined;
}

export function cardActivityKind(c: VisitCard) {
  return c.kind === 'activity' ? c.activity.kind : undefined;
}

export function cardHasPhoto(c: VisitCard): boolean {
  if (c.kind === 'photo') return true;
  if (c.kind === 'fact') return !!c.fact.photoFileName;
  if (c.kind === 'memory') return !!c.memory.photoFileName;
  if (c.kind === 'sensory') return !!c.moment.photoFileName;
  return false;
}

export function cardIsSoft(c: VisitCard): boolean {
  return c.kind === 'sensory' || c.kind === 'photo' || c.kind === 'song';
}

export function cardIcon(c: VisitCard): string {
  switch (c.kind) {
    case 'fact':
      return lifeCategoryMeta[c.fact.category].icon;
    case 'memory':
      return 'book';
    case 'photo':
      return 'image';
    case 'sensory':
      return c.moment.icon;
    case 'song':
      return 'musical-notes';
    case 'question':
      return 'chatbubble-ellipses';
    case 'activity':
      return activityKindIcon[c.activity.kind];
  }
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export interface VisitDeckOptions {
  includeFacts: boolean;
  includeMemories: boolean;
  includePhotos: boolean;
}

// Ported from VisitView.begin().
export function buildDeck(
  store: Store,
  level: FunctioningLevel,
  first: string,
  opts: VisitDeckOptions
): VisitCard[] {
  const count = 40;

  // Seeded example content is for hints only — never bring it into a real visit.
  const realFacts = store.lifeFacts.filter((f) => !isSampleFact(f));
  const realMemories = store.memoryCards.filter((m) => !isSampleMemory(m));

  const hasStoryContent = realFacts.length > 0;
  const hasMemories = realMemories.length > 0;
  const hasPhotos = store.galleryPhotos.length > 0;
  // More/some support weave in activity ideas.
  const wantsActivities = level === 'late' || level === 'middle';

  const pools: VisitCard[][] = [];

  if (opts.includeFacts && (!wantsActivities || hasStoryContent)) {
    pools.push(
      store
        .reviewSelection(count)
        .filter((f) => !isSampleFact(f))
        .map((f) => ({ kind: 'fact', id: f.id, fact: f }))
    );
  }
  if (opts.includeMemories && hasMemories) {
    pools.push(
      realMemories
        .slice(0, count)
        .map((m) => ({ kind: 'memory', id: m.id, memory: m }))
    );
  }
  if (opts.includePhotos && hasPhotos) {
    pools.push(
      store.galleryPhotos
        .slice(0, count)
        .map((p) => ({ kind: 'photo', id: p.id, photo: p }))
    );
  }
  if (wantsActivities) {
    pools.push(
      activityDeck(level)
        .slice(0, count)
        .map((a) => ({ kind: 'activity', id: a.id, activity: a }))
    );
  }
  if (level === 'early') {
    const curated = discoveryThemes.flatMap((theme) =>
      discoveryQuestions(theme).map((q) => ({ q, theme }))
    );
    pools.push(
      shuffle(curated)
        .slice(0, count)
        .map(({ q, theme }) => ({
          kind: 'question',
          id: q.id,
          question: q,
          theme,
        }))
    );
  }
  if (pools.length === 0) {
    pools.push(
      store
        .reviewSelection(count)
        .filter((f) => !isSampleFact(f))
        .map((f) => ({ kind: 'fact', id: f.id, fact: f }))
    );
  }

  // Round-robin interleave.
  let cards: VisitCard[] = [];
  let row = 0;
  while (cards.length < count && pools.some((p) => p.length > row)) {
    for (const pool of pools) {
      if (pool.length > row && cards.length < count) cards.push(pool[row]);
    }
    row += 1;
  }

  // Some support: float photo-bearing cards to the front.
  if (level === 'middle') {
    const withPhoto = cards.filter(cardHasPhoto);
    const withoutPhoto = cards.filter((c) => !cardHasPhoto(c));
    cards = [...withPhoto, ...withoutPhoto];
  }

  // More support: weave in a wordless moment near the front.
  if (level === 'late') {
    const familiarPhoto = store.galleryPhotos[0]?.photoFileName;
    const moment = restfulMoment(first, familiarPhoto);
    const slot = Math.min(1, cards.length);
    cards.splice(slot, 0, { kind: 'sensory', id: moment.id, moment });
  }

  // A familiar song rides in as its own card at every level.
  const song = store.comfortSongs.find((s) => s.isFavorite) ?? store.comfortSongs[0];
  if (song) {
    const songSlot = Math.min(level === 'late' ? 2 : 1, cards.length);
    cards.splice(songSlot, 0, { kind: 'song', id: song.id, song });
  }

  return cards;
}

// Ported from VisitView.reshapeDeck().
export function reshapeDeck(
  deck: VisitCard[],
  index: number,
  response: CardResponse,
  card: VisitCard,
  first: string
): VisitCard[] {
  const next = index + 1;
  const out = [...deck];

  if (response === 'litUp') {
    if (next >= out.length) return out;
    const category = cardCategory(card);
    const kind = cardActivityKind(card);
    let found = -1;
    if (category) {
      found = out.findIndex(
        (c, i) => i >= next && cardCategory(c) === category
      );
    } else if (kind) {
      found = out.findIndex(
        (c, i) => i >= next && cardActivityKind(c) === kind
      );
    }
    if (found > next) {
      const [moved] = out.splice(found, 1);
      out.splice(next, 0, moved);
    }
  } else if (response === 'hardMoment') {
    const found = out.findIndex((c, i) => i >= next && cardIsSoft(c));
    if (found > next) {
      const [moved] = out.splice(found, 1);
      out.splice(next, 0, moved);
    } else {
      const moment = softenerMoment(first);
      out.splice(Math.min(next, out.length), 0, {
        kind: 'sensory',
        id: moment.id,
        moment,
      });
    }
  }
  return out;
}

export function makeOutcome(card: VisitCard) {
  let question = '';
  let answer = '';
  switch (card.kind) {
    case 'fact':
      question = card.fact.question;
      answer = card.fact.answer;
      break;
    case 'memory':
      question = card.memory.title;
      answer = card.memory.story;
      break;
    case 'photo':
      question = card.photo.caption || 'A photo';
      break;
    case 'song':
      question = card.song.title;
      break;
    case 'question':
      question = card.question.text;
      break;
    case 'activity':
      question = card.activity.title;
      break;
    case 'sensory':
      question = card.moment.recapLabel;
      break;
  }
  return { id: uuid(), factID: card.id, question, answer, response: undefined };
}
