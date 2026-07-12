import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  sampleLifeFacts,
  sampleMemoryCards,
} from './content';
import {
  CardResponse,
  ComfortSong,
  FamilyNote,
  GalleryPhoto,
  Insight,
  JournalEntry,
  LifeCategory,
  LifeFact,
  LovedOneProfile,
  MemoryCard,
  ReviewSession,
  cardResponseMeta,
  defaultProfile,
  firstName,
  lifeCategoryMeta,
} from './types';

const KEYS = {
  memories: 'cc.memories',
  journal: 'cc.journal',
  familyNotes: 'cc.familyNotes',
  profile: 'cc.profile',
  lifeFacts: 'cc.lifeFacts',
  reviews: 'cc.reviews',
  gallery: 'cc.gallery',
  songs: 'cc.songs',
  hasOnboarded: 'cc.hasOnboarded',
  hasDismissedSampleHint: 'cc.hasDismissedSampleHint',
  hasSeededSamplesRemaining: 'cc.hasSeededSamplesRemaining',
};

export interface Store {
  ready: boolean;

  memoryCards: MemoryCard[];
  journalEntries: JournalEntry[];
  familyNotes: FamilyNote[];
  profile: LovedOneProfile;
  lifeFacts: LifeFact[];
  reviewSessions: ReviewSession[];
  galleryPhotos: GalleryPhoto[];
  comfortSongs: ComfortSong[];

  hasOnboarded: boolean;
  wantsTour: boolean;
  hasDismissedSampleHint: boolean;
  hasSeededSamplesRemaining: boolean;

  setProfile: (p: LovedOneProfile) => void;
  setHasOnboarded: (v: boolean) => void;
  setWantsTour: (v: boolean) => void;
  setHasDismissedSampleHint: (v: boolean) => void;

  addMemory: (m: MemoryCard) => void;
  updateMemory: (m: MemoryCard) => void;
  deleteMemory: (m: MemoryCard) => void;

  addJournalEntry: (e: JournalEntry) => void;
  addFamilyNote: (n: FamilyNote) => void;

  addLifeFact: (f: LifeFact) => void;
  updateLifeFact: (f: LifeFact) => void;
  deleteLifeFact: (f: LifeFact) => void;
  factCount: (c: LifeCategory) => number;
  reviewSelection: (count?: number) => LifeFact[];
  addReviewSession: (s: ReviewSession) => void;

  addGalleryPhoto: (p: GalleryPhoto) => void;
  updateGalleryPhoto: (p: GalleryPhoto) => void;
  deleteGalleryPhoto: (p: GalleryPhoto) => void;

  addComfortSong: (s: ComfortSong) => void;
  updateComfortSong: (s: ComfortSong) => void;
  deleteComfortSong: (s: ComfortSong) => void;

  journalInsights: () => Insight[];
}

const StoreContext = createContext<Store | null>(null);

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [familyNotes, setFamilyNotes] = useState<FamilyNote[]>([]);
  const [profile, setProfileState] = useState<LovedOneProfile>(defaultProfile());
  const [lifeFacts, setLifeFacts] = useState<LifeFact[]>([]);
  const [reviewSessions, setReviewSessions] = useState<ReviewSession[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [comfortSongs, setComfortSongs] = useState<ComfortSong[]>([]);

  const [hasOnboarded, setHasOnboardedState] = useState(false);
  const [wantsTour, setWantsTour] = useState(true);
  const [hasDismissedSampleHint, setHasDismissedSampleHintState] =
    useState(false);
  const [hasSeededSamplesRemaining, setHasSeededSamplesRemaining] =
    useState(false);

  // Persist helper — writes JSON whenever a slice changes, but not before the
  // initial load has populated state (mirrors Swift's didSet-after-init).
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      const [
        mem,
        jr,
        notes,
        prof,
        facts,
        reviews,
        gallery,
        songs,
        onboarded,
        dismissedHint,
        seedRemaining,
      ] = await Promise.all([
        loadJSON<MemoryCard[] | null>(KEYS.memories, null),
        loadJSON<JournalEntry[]>(KEYS.journal, []),
        loadJSON<FamilyNote[]>(KEYS.familyNotes, []),
        loadJSON<LovedOneProfile | null>(KEYS.profile, null),
        loadJSON<LifeFact[] | null>(KEYS.lifeFacts, null),
        loadJSON<ReviewSession[]>(KEYS.reviews, []),
        loadJSON<GalleryPhoto[]>(KEYS.gallery, []),
        loadJSON<ComfortSong[]>(KEYS.songs, []),
        loadJSON<boolean>(KEYS.hasOnboarded, false),
        loadJSON<boolean>(KEYS.hasDismissedSampleHint, false),
        loadJSON<boolean | null>(KEYS.hasSeededSamplesRemaining, null),
      ]);

      // First launch seeds samples so the app isn't empty.
      const firstLaunchMemories = mem == null;
      const firstLaunchFacts = facts == null;

      setMemoryCards(mem ?? sampleMemoryCards());
      setJournalEntries(jr);
      setFamilyNotes(notes);
      setProfileState(prof ?? defaultProfile());
      setLifeFacts(facts ?? sampleLifeFacts());
      setReviewSessions(reviews);
      setGalleryPhotos(gallery);
      setComfortSongs(songs);
      setHasOnboardedState(onboarded);
      setHasDismissedSampleHintState(dismissedHint);
      setHasSeededSamplesRemaining(
        seedRemaining ?? (firstLaunchMemories || firstLaunchFacts)
      );

      loaded.current = true;
      setReady(true);
    })();
  }, []);

  // Generic persistence effects.
  const persist = useCallback((key: string, value: unknown) => {
    if (!loaded.current) return;
    AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
  }, []);

  useEffect(() => persist(KEYS.memories, memoryCards), [memoryCards, persist]);
  useEffect(() => persist(KEYS.journal, journalEntries), [journalEntries, persist]);
  useEffect(() => persist(KEYS.familyNotes, familyNotes), [familyNotes, persist]);
  useEffect(() => persist(KEYS.profile, profile), [profile, persist]);
  useEffect(() => persist(KEYS.lifeFacts, lifeFacts), [lifeFacts, persist]);
  useEffect(() => persist(KEYS.reviews, reviewSessions), [reviewSessions, persist]);
  useEffect(() => persist(KEYS.gallery, galleryPhotos), [galleryPhotos, persist]);
  useEffect(() => persist(KEYS.songs, comfortSongs), [comfortSongs, persist]);
  useEffect(() => persist(KEYS.hasOnboarded, hasOnboarded), [hasOnboarded, persist]);
  useEffect(
    () => persist(KEYS.hasDismissedSampleHint, hasDismissedSampleHint),
    [hasDismissedSampleHint, persist]
  );
  useEffect(
    () => persist(KEYS.hasSeededSamplesRemaining, hasSeededSamplesRemaining),
    [hasSeededSamplesRemaining, persist]
  );

  const api = useMemo<Store>(() => {
    const factCount = (c: LifeCategory) =>
      lifeFacts.filter((f) => f.category === c).length;

    const reviewSelection = (count = 7): LifeFact[] => {
      const hardFactIDs = new Set(
        reviewSessions
          .flatMap((s) => s.outcomes)
          .filter((o) => o.response === 'hardMoment')
          .map((o) => o.factID)
      );

      // Group by category, least-recently-reviewed first.
      const grouped = new Map<LifeCategory, LifeFact[]>();
      for (const f of lifeFacts) {
        const arr = grouped.get(f.category) ?? [];
        arr.push(f);
        grouped.set(f.category, arr);
      }
      const queues: LifeFact[][] = [...grouped.values()].map((facts) =>
        [...facts].sort((a, b) => {
          const at = a.lastReviewedAt ? Date.parse(a.lastReviewedAt) : 0;
          const bt = b.lastReviewedAt ? Date.parse(b.lastReviewedAt) : 0;
          return at - bt;
        })
      );

      // Round-robin across categories for variety.
      const picked: LifeFact[] = [];
      let madeProgress = true;
      while (picked.length < count && madeProgress) {
        madeProgress = false;
        for (const q of queues) {
          if (picked.length < count && q.length > 0) {
            picked.push(q.shift()!);
            madeProgress = true;
          }
        }
      }

      const gentle = picked.filter((f) => !hardFactIDs.has(f.id));
      return gentle.length >= Math.min(count, lifeFacts.length)
        ? gentle
        : picked;
    };

    const addReviewSession = (session: ReviewSession) => {
      setReviewSessions((prev) => [session, ...prev]);
      setLifeFacts((prev) =>
        prev.map((f) =>
          session.outcomes.some((o) => o.factID === f.id)
            ? { ...f, lastReviewedAt: session.date }
            : f
        )
      );
    };

    const mostCommonQuestion = (
      outcomes: { question: string }[]
    ): { question: string; count: number } | null => {
      const counts = new Map<string, number>();
      for (const o of outcomes)
        counts.set(o.question, (counts.get(o.question) ?? 0) + 1);
      let best: { question: string; count: number } | null = null;
      for (const [question, count] of counts)
        if (!best || count > best.count) best = { question, count };
      return best;
    };

    const staleCategory = (): LifeCategory | null => {
      const categoriesWithFacts = new Set(lifeFacts.map((f) => f.category));
      if (categoriesWithFacts.size === 0) return null;
      if (reviewSessions.length === 0) return null;

      let oldest: { category: LifeCategory; date: number } | null = null;
      for (const category of categoriesWithFacts) {
        const facts = lifeFacts.filter((f) => f.category === category);
        const mostRecent = Math.max(
          0,
          ...facts.map((f) =>
            f.lastReviewedAt ? Date.parse(f.lastReviewedAt) : 0
          )
        );
        if (!oldest || mostRecent < oldest.date)
          oldest = { category, date: mostRecent };
      }
      if (!oldest) return null;
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return oldest.date < weekAgo ? oldest.category : null;
    };

    const journalInsights = (): Insight[] => {
      const insights: Insight[] = [];
      const outcomes = reviewSessions.flatMap((s) => s.outcomes);
      const first = firstName(profile);

      const positive = outcomes.filter(
        (o) => o.response && cardResponseMeta[o.response].isPositive
      );
      const topPos = mostCommonQuestion(positive);
      if (topPos && topPos.count >= 2) {
        insights.push({
          id: 'pos',
          icon: 'sparkles',
          text: `${first} lights up at “${topPos.question}” — a lovely place to start.`,
          tone: 'positive',
        });
      }

      const hard = outcomes.filter((o) => o.response === 'hardMoment');
      const topHard = mostCommonQuestion(hard);
      if (topHard && topHard.count >= 2) {
        insights.push({
          id: 'hard',
          icon: 'cloud',
          text: `“${topHard.question}” has felt hard lately — maybe save it for another day.`,
          tone: 'gentle',
        });
      }

      const stale = staleCategory();
      if (stale) {
        insights.push({
          id: 'stale',
          icon: 'time',
          text: `You haven't touched ${lifeCategoryMeta[stale].label.toLowerCase()} in a while — worth revisiting.`,
          tone: 'neutral',
        });
      }

      const durations = reviewSessions
        .slice(0, 4)
        .map((s) => s.durationMinutes)
        .filter((d): d is number => d != null);
      if (durations.length >= 2) {
        const average = Math.floor(
          durations.reduce((a, b) => a + b, 0) / durations.length
        );
        if (average >= 20) {
          insights.push({
            id: 'short',
            icon: 'timer',
            text: `Recent visits ran about ${average} min — shorter sessions often land better.`,
            tone: 'neutral',
          });
        }
      }

      return insights.slice(0, 3);
    };

    return {
      ready,
      memoryCards,
      journalEntries,
      familyNotes,
      profile,
      lifeFacts,
      reviewSessions,
      galleryPhotos,
      comfortSongs,
      hasOnboarded,
      wantsTour,
      hasDismissedSampleHint,
      hasSeededSamplesRemaining,

      setProfile: setProfileState,
      setHasOnboarded: setHasOnboardedState,
      setWantsTour,
      setHasDismissedSampleHint: setHasDismissedSampleHintState,

      addMemory: (m) => setMemoryCards((prev) => [m, ...prev]),
      updateMemory: (m) =>
        setMemoryCards((prev) => prev.map((x) => (x.id === m.id ? m : x))),
      deleteMemory: (m) =>
        setMemoryCards((prev) => prev.filter((x) => x.id !== m.id)),

      addJournalEntry: (e) => setJournalEntries((prev) => [e, ...prev]),
      addFamilyNote: (n) => setFamilyNotes((prev) => [n, ...prev]),

      addLifeFact: (f) => setLifeFacts((prev) => [f, ...prev]),
      updateLifeFact: (f) =>
        setLifeFacts((prev) => prev.map((x) => (x.id === f.id ? f : x))),
      deleteLifeFact: (f) =>
        setLifeFacts((prev) => prev.filter((x) => x.id !== f.id)),
      factCount,
      reviewSelection,
      addReviewSession,

      addGalleryPhoto: (p) => setGalleryPhotos((prev) => [p, ...prev]),
      updateGalleryPhoto: (p) =>
        setGalleryPhotos((prev) => prev.map((x) => (x.id === p.id ? p : x))),
      deleteGalleryPhoto: (p) =>
        setGalleryPhotos((prev) => prev.filter((x) => x.id !== p.id)),

      addComfortSong: (s) => setComfortSongs((prev) => [s, ...prev]),
      updateComfortSong: (s) =>
        setComfortSongs((prev) => prev.map((x) => (x.id === s.id ? s : x))),
      deleteComfortSong: (s) =>
        setComfortSongs((prev) => prev.filter((x) => x.id !== s.id)),

      journalInsights,
    };
  }, [
    ready,
    memoryCards,
    journalEntries,
    familyNotes,
    profile,
    lifeFacts,
    reviewSessions,
    galleryPhotos,
    comfortSongs,
    hasOnboarded,
    wantsTour,
    hasDismissedSampleHint,
    hasSeededSamplesRemaining,
  ]);

  return (
    <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
  );
}
