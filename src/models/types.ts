// Core data models ported from CareCircleModels.swift.
// Swift enums with computed properties become string-literal unions plus
// lookup tables; Swift structs become interfaces with factory helpers.

export function uuid(): string {
  // RFC4122-ish v4, good enough for local IDs.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// MARK: - VisitMode

export type VisitMode = 'talk' | 'play' | 'remember' | 'comfort';

export const visitModeMeta: Record<
  VisitMode,
  { title: string; subtitle: string; icon: string; openingPhrase: string }
> = {
  talk: {
    title: 'Talk',
    subtitle: 'Conversation starters and story prompts',
    icon: 'chatbubbles',
    openingPhrase:
      'Sit down, settle in, and start with something easy you can both see or talk about.',
  },
  play: {
    title: 'Play',
    subtitle: 'Simple shared games and activities',
    icon: 'game-controller',
    openingPhrase:
      'Pick one small thing to do together. Taking turns matters more than doing it right.',
  },
  remember: {
    title: 'Remember',
    subtitle: 'Photos, songs, and familiar memories',
    icon: 'images',
    openingPhrase:
      'Bring out a photo or two and walk them through it. No quiz — just share the story.',
  },
  comfort: {
    title: 'Comfort',
    subtitle: 'Calm prompts for quiet or tired days',
    icon: 'heart',
    openingPhrase:
      'Quiet days are okay. Sit close, slow down, and let your presence do the work.',
  },
};

// MARK: - MemoryCategory

export type MemoryCategory =
  | 'photo'
  | 'song'
  | 'story'
  | 'place'
  | 'person'
  | 'hobby'
  | 'food';

export const memoryCategoryLabel: Record<MemoryCategory, string> = {
  photo: 'Photo',
  song: 'Song',
  story: 'Story',
  place: 'Place',
  person: 'Person',
  hobby: 'Hobby',
  food: 'Food',
};

export const memoryCategories = Object.keys(
  memoryCategoryLabel
) as MemoryCategory[];

// MARK: - ReactionType

export type ReactionType =
  | 'happy'
  | 'remember'
  | 'playSong'
  | 'tellStory'
  | 'more'
  | 'tired';

export const reactionMeta: Record<
  ReactionType,
  { label: string; icon: string; isPositive: boolean }
> = {
  happy: { label: 'Happy', icon: 'happy', isPositive: true },
  remember: { label: 'I remember', icon: 'heart', isPositive: true },
  playSong: { label: 'Play song', icon: 'musical-note', isPositive: true },
  tellStory: { label: 'Tell story', icon: 'chatbox', isPositive: true },
  more: { label: 'More', icon: 'add-circle', isPositive: true },
  tired: { label: 'Tired', icon: 'moon', isPositive: false },
};

// MARK: - MoodTag

export type MoodTag =
  | 'calm'
  | 'happy'
  | 'talkative'
  | 'quiet'
  | 'tired'
  | 'anxious';

export const moodLabel: Record<MoodTag, string> = {
  calm: 'Calm',
  happy: 'Happy',
  talkative: 'Talkative',
  quiet: 'Quiet',
  tired: 'Tired',
  anxious: 'Anxious',
};

// MARK: - StoryCapture

export interface StoryCapture {
  id: string;
  date: string; // ISO
  text: string;
  voiceMemoFileName?: string;
}

export function makeStoryCapture(
  text = '',
  voiceMemoFileName?: string
): StoryCapture {
  return { id: uuid(), date: new Date().toISOString(), text, voiceMemoFileName };
}

// MARK: - MemoryCard

export interface MemoryCard {
  id: string;
  title: string;
  category: MemoryCategory;
  story: string;
  prompt: string;
  photoFileName?: string;
  voiceMemoFileName?: string;
  captures: StoryCapture[];
  /** Seeded example content — shown as hints, never used in a real visit. */
  isSample?: boolean;
}

// MARK: - FamilyNote

export interface FamilyNote {
  id: string;
  date: string;
  author: string;
  text: string;
}

// MARK: - JournalEntry

export interface JournalEntry {
  id: string;
  date: string;
  mode: VisitMode;
  memoryTitle: string;
  activity: string;
  reactions: ReactionType[];
  mood?: MoodTag;
  note: string;
}

// MARK: - LifeCategory

export type LifeCategory =
  | 'family'
  | 'favorites'
  | 'food'
  | 'work'
  | 'places'
  | 'celebrations'
  | 'hobbies'
  | 'everyday';

export const lifeCategoryMeta: Record<
  LifeCategory,
  { label: string; icon: string }
> = {
  family: { label: 'Family', icon: 'people' },
  favorites: { label: 'Favorites', icon: 'star' },
  food: { label: 'Food', icon: 'restaurant' },
  work: { label: 'Work', icon: 'briefcase' },
  places: { label: 'Places', icon: 'map' },
  celebrations: { label: 'Celebrations', icon: 'sparkles' },
  hobbies: { label: 'Hobbies', icon: 'color-palette' },
  everyday: { label: 'Everyday Life', icon: 'sunny' },
};

export const lifeCategories = Object.keys(lifeCategoryMeta) as LifeCategory[];

// MARK: - LifeFact

export interface LifeFact {
  id: string;
  category: LifeCategory;
  question: string;
  answer: string;
  photoFileName?: string;
  voiceMemoFileName?: string;
  lastReviewedAt?: string;
  captures: StoryCapture[];
  /** Seeded example content — shown as hints, never used in a real visit. */
  isSample?: boolean;
}

// MARK: - CardResponse

export type CardResponse = 'litUp' | 'smiled' | 'quiet' | 'hardMoment';

export const cardResponseMeta: Record<
  CardResponse,
  { label: string; icon: string; isPositive: boolean }
> = {
  litUp: { label: 'Lit up', icon: 'sparkles', isPositive: true },
  smiled: { label: 'Smiled', icon: 'happy', isPositive: true },
  quiet: { label: 'Quiet', icon: 'moon', isPositive: false },
  hardMoment: { label: 'Hard moment', icon: 'cloud', isPositive: false },
};

// Running tally of how a visit-mode card has landed over time. Drives the
// adaptive ordering of the visit deck (liked cards float up, hard ones sink).
export interface VisitCardStat {
  pos: number;
  neg: number;
}

// Gentle visit history for encouragement on Home. These are moments the
// caregiver noticed, not scores or targets.
export interface VisitImpact {
  completedVisits: number;
  litUpMoments: number;
  niceMoments: number;
}

// MARK: - CardOutcome

export interface CardOutcome {
  id: string;
  factID: string;
  question: string;
  answer: string;
  response?: CardResponse;
}

// MARK: - ReviewSession

export interface ReviewSession {
  id: string;
  date: string;
  outcomes: CardOutcome[];
  durationMinutes?: number;
  note: string;
}

export function positiveCount(session: ReviewSession): number {
  return session.outcomes.filter(
    (o) => o.response && cardResponseMeta[o.response].isPositive
  ).length;
}

// MARK: - Insight

export type InsightTone = 'positive' | 'gentle' | 'neutral';

export interface Insight {
  id: string;
  icon: string;
  text: string;
  tone: InsightTone;
}

// MARK: - FunctioningLevel

export type FunctioningLevel = 'late' | 'middle' | 'early';

export const functioningLevelMeta: Record<
  FunctioningLevel,
  { label: string; capability: number; caption: string }
> = {
  late: {
    label: 'More support',
    capability: 0,
    caption:
      'You carry more of the visit with short stories and activities they can watch, hear, or join.',
  },
  middle: {
    label: 'Some support',
    capability: 1,
    caption:
      'Short answers and yes/no. One simple thing at a time works best.',
  },
  early: {
    label: 'Light support',
    capability: 2,
    caption:
      'They can lead parts of the conversation and take an active role in shared activities.',
  },
};

// Ordered as shown in onboarding (early → middle → late).
export const functioningLevels: FunctioningLevel[] = ['early', 'middle', 'late'];

// MARK: - RecallAbility

export type RecallAbility = 'intact' | 'fading' | 'unsure';

export const recallMeta: Record<
  RecallAbility,
  { label: string; caption: string }
> = {
  intact: {
    label: 'Remembers their past well',
    caption:
      'The story is theirs to tell — the app helps them share it, never tests them.',
  },
  fading: {
    label: 'Their memory is slipping',
    caption:
      "Familiar faces and stories to gently anchor them. Reflect, don't quiz.",
  },
  unsure: {
    label: 'Hard to tell',
    caption:
      'The app plays it safe — it invites, never asks “do you remember?”',
  },
};

export const recallOptions: RecallAbility[] = ['intact', 'unsure', 'fading'];

// MARK: - StoryStance

export type StoryStance = 'giveVoice' | 'remind' | 'converse';

// MARK: - LovedOneProfile

export interface LovedOneProfile {
  name: string;
  level: FunctioningLevel;
  recall: RecallAbility;
}

export function defaultProfile(): LovedOneProfile {
  return { name: 'Grandma Rose', level: 'middle', recall: 'unsure' };
}

export function storyStance(profile: LovedOneProfile): StoryStance {
  switch (profile.recall) {
    case 'fading':
      return 'remind';
    case 'intact':
      return profile.level === 'late' ? 'giveVoice' : 'converse';
    case 'unsure':
      return profile.level === 'late' ? 'remind' : 'converse';
  }
}

export function firstName(profile: LovedOneProfile): string {
  return profile.name.split(' ')[0] || profile.name;
}

// MARK: - Gallery & songs

export interface GalleryPhoto {
  id: string;
  photoFileName: string;
  caption: string;
  voiceMemoFileName?: string;
  dateAdded: string;
  captures: StoryCapture[];
}

export interface ComfortSong {
  id: string;
  title: string;
  artist: string;
  note: string;
  voiceMemoFileName?: string;
  dateAdded: string;
  isFavorite: boolean;
}

// MARK: - Discovery questions

export interface DiscoveryQuestion {
  id: string;
  text: string;
  followUps: string[];
}

export type DiscoveryTheme =
  | 'childhood'
  | 'youngerYears'
  | 'loveAndFamily'
  | 'workAndPride'
  | 'favoritesAndFun'
  | 'opinionsAndAdvice';

export const discoveryThemeMeta: Record<
  DiscoveryTheme,
  { label: string; icon: string; blurb: string }
> = {
  childhood: {
    label: 'Childhood',
    icon: 'happy',
    blurb: 'Where they grew up, and what it was like.',
  },
  youngerYears: {
    label: 'Younger years',
    icon: 'bicycle',
    blurb: 'Their teens and twenties — before all of us.',
  },
  loveAndFamily: {
    label: 'Love & family',
    icon: 'heart',
    blurb: 'How people met, and the family they built.',
  },
  workAndPride: {
    label: 'Work & pride',
    icon: 'briefcase',
    blurb: 'What they did, and what they were good at.',
  },
  favoritesAndFun: {
    label: 'Favorites & fun',
    icon: 'star',
    blurb: 'The small things they always loved.',
  },
  opinionsAndAdvice: {
    label: 'Opinions & advice',
    icon: 'chatbox-ellipses',
    blurb: "What they think, and what they'd tell you.",
  },
};

export const discoveryThemes = Object.keys(
  discoveryThemeMeta
) as DiscoveryTheme[];

// MARK: - Sensory & activities

export interface SensoryMoment {
  id: string;
  icon: string;
  line: string;
  coach: string;
  recapLabel: string;
  photoFileName?: string;
}

export function restfulMoment(
  first: string,
  photo?: string
): SensoryMoment {
  if (photo) {
    return {
      id: uuid(),
      icon: 'image',
      line: 'Nothing to answer here. Just look at this one together.',
      coach: `Hold it where ${first} can see it. Point to one thing, then let the quiet sit.`,
      recapLabel: 'a quiet moment together',
      photoFileName: photo,
    };
  }
  return {
    id: uuid(),
    icon: 'hand-left',
    line: `Take ${first}'s hand and slow down. No words needed.`,
    coach:
      "Watch for the grip softening, or the breathing easing. That's the visit working.",
    recapLabel: 'sitting together quietly',
  };
}

export function softenerMoment(first: string): SensoryMoment {
  return {
    id: uuid(),
    icon: 'musical-note',
    line: "That one was a lot. Let's switch to something easy.",
    coach:
      'Try a familiar song, or just sit close for a minute. Use the buttons below.',
    recapLabel: 'a calm reset',
  };
}

export type ActivityKind =
  | 'senses'
  | 'music'
  | 'comfort'
  | 'nature'
  | 'movement'
  | 'handsOn'
  | 'reminisce'
  | 'playful';

export const activityKindIcon: Record<ActivityKind, string> = {
  senses: 'hand-left',
  music: 'musical-note',
  comfort: 'heart',
  nature: 'leaf',
  movement: 'walk',
  handsOn: 'sparkles',
  reminisce: 'chatbubbles',
  playful: 'happy',
};

export interface ActivitySuggestion {
  id: string;
  kind: ActivityKind;
  title: string;
  coach: string;
  levels: FunctioningLevel[];
}

export interface SensoryIdea {
  id: string;
  icon: string;
  title: string;
  how: string;
}

export function sensoryIdeas(first: string): SensoryIdea[] {
  return [
    {
      id: uuid(),
      icon: 'hand-left',
      title: 'Hold their hand',
      how: `Take ${first}'s hand and let it rest. You don't have to say anything. Notice if the grip softens.`,
    },
    {
      id: uuid(),
      icon: 'sunny',
      title: 'Go to the window',
      how: `Open the blind or wheel ${first} over. Say what's out there — the trees, the weather, a bird.`,
    },
    {
      id: uuid(),
      icon: 'leaf',
      title: 'Slow it down',
      how: 'Sit shoulder to shoulder and breathe slower than usual. People often follow your pace without being asked.',
    },
    {
      id: uuid(),
      icon: 'sparkles',
      title: 'Something to hold',
      how: `Hand ${first} a warm mug, a soft blanket, a smooth stone — something with texture and weight.`,
    },
  ];
}
