import {
  ActivitySuggestion,
  DiscoveryQuestion,
  DiscoveryTheme,
  FunctioningLevel,
  LifeFact,
  MemoryCard,
  uuid,
} from './types';

// MARK: - Activity bank (ported from ActivityBank.all)

function act(
  kind: ActivitySuggestion['kind'],
  title: string,
  coach: string,
  levels: FunctioningLevel[]
): ActivitySuggestion {
  return { id: uuid(), kind, title, coach, levels };
}

export const activityBank: ActivitySuggestion[] = [
  // Senses
  act('senses', 'Hand them a soft blanket to hold', 'Let them feel the weight and warmth of it in their lap.', ['late', 'middle']),
  act('senses', 'Pass them something fragrant to smell', 'A sprig of rosemary, lavender, or a flower — hold it close and watch their face.', ['late', 'middle']),
  act('senses', 'Let them feel a few different fabrics', 'Velvet, wool, silk — slow, one at a time, no rush.', ['late', 'middle']),
  act('senses', 'Peel an orange nearby', 'Let the scent fill the air, then offer a segment to share.', ['late', 'middle']),
  act('senses', 'Offer a small taste of something sweet', 'A little chocolate or honey — watch their face light up.', ['late', 'middle']),
  act('senses', 'Bring a smooth stone or seashell to hold', 'Guide their fingers over it and let them explore the shape.', ['late', 'middle']),
  act('senses', 'Look through a magazine and point at pictures', 'No need to read — just enjoy the colors and images together.', ['late', 'middle']),
  act('senses', 'Share a warm drink, hands wrapped around the cup', 'Tea or cocoa — let them feel the warmth before the first sip.', ['late', 'middle']),
  // Music
  act('music', 'Hum an old tune and see if they join in', "Start softly — a hymn or a song they'd know — and leave room.", ['late', 'middle']),
  act('music', 'Play a song from their younger years', 'Put it on low, sit close, and watch for a foot tapping.', ['late', 'middle']),
  act('music', 'Sway gently together to a slow song', 'Hold their hands and move just a little — the swaying is enough.', ['late', 'middle']),
  act('music', 'Tap a simple rhythm on the table together', 'Start a slow beat and see if they follow along.', ['late', 'middle']),
  act('music', 'Play music from their faith, if they had one', "A familiar hymn can reach somewhere words can't.", ['late', 'middle']),
  act('music', 'Sing the first line of a well-known song and pause', 'Leave a beat — they may fill in the rest without thinking.', ['middle']),
  // Comfort
  act('comfort', 'Give a slow hand massage with a little lotion', 'Warm your hands first, then work gently, one hand at a time.', ['late', 'middle']),
  act('comfort', 'Gently brush or stroke their hair', 'Slow, steady strokes — soothing more than tidy.', ['late']),
  act('comfort', 'Hold their hand and match your breathing to theirs', 'Slow your own breath and let them settle into the calm.', ['late']),
  act('comfort', 'Rest a warm hand on their shoulder and just sit', 'No words needed — the steady presence is the whole thing.', ['late']),
  act('comfort', 'Sit close in comfortable silence for a while', 'Let the quiet be okay. Being there is the point.', ['late', 'middle']),
  // Nature
  act('nature', 'Sit by a window and watch the birds together', 'Point out what you see and let them take it in.', ['late', 'middle']),
  act('nature', 'Bring a potted plant close to touch the leaves', 'Let them feel the texture and smell the soil or blooms.', ['late', 'middle']),
  act('nature', 'Feel the sun or a breeze on your faces', 'Step near an open window or door and just be in it together.', ['late', 'middle']),
  act('nature', 'Watch the rain and listen to it together', 'Let the sound and the movement do the work.', ['late', 'middle']),
  act('nature', "Take a slow walk outside if the weather's kind", 'Arm in arm, no destination — just the fresh air.', ['middle']),
  // Movement
  act('movement', 'Do a few gentle arm stretches together', 'Reach up slow, then rest — follow their lead, never force.', ['late', 'middle']),
  act('movement', 'Rock gently in chairs side by side', 'Match their pace and let the rhythm settle you both.', ['late', 'middle']),
  act('movement', 'Toss a soft balloon back and forth', 'Slow and easy — the gentle reach is the fun of it.', ['middle']),
  act('movement', 'Roll a soft ball slowly across the table', 'Send it over, wait, and let them send it back.', ['middle']),
  // Hands-on
  act('handsOn', 'Fold a small basket of towels together', 'Hand them one at a time — the familiar motion feels good.', ['middle']),
  act('handsOn', 'Sort buttons or coins by color together', 'Tip them out and sort slowly, side by side.', ['middle']),
  act('handsOn', 'Wind a ball of yarn together', 'You hold, they wind — or the other way around.', ['middle']),
  act('handsOn', 'Arrange a few flowers in a vase together', 'Hand them one stem at a time and let them place it.', ['middle']),
  act('handsOn', 'Look through a box of small trinkets together', 'Pick things up, turn them over, see what sparks a story.', ['middle']),
  act('handsOn', 'Stack or nest cups or bowls together', 'A simple, satisfying motion you can do side by side.', ['late', 'middle']),
  act('handsOn', 'Shell peas or snap beans into a bowl', 'An old, easy rhythm many hands still remember.', ['middle']),
  // Reminisce
  act('reminisce', 'Ask what their favorite meal was growing up', 'If words are hard, offer two choices and let them point.', ['middle']),
  act('reminisce', 'Ask if they were an early bird or a night owl', 'A simple either-or they can answer with a nod.', ['middle']),
  act('reminisce', 'Ask what they loved to do on a summer day as a kid', 'Give them time — one memory is plenty.', ['middle']),
  act('reminisce', 'Ask about their first pet', 'Name, color, whatever comes — follow wherever it goes.', ['middle']),
  act('reminisce', 'Ask which season they love most, and why', 'Let them picture it — no wrong answers here.', ['middle']),
  act('reminisce', 'Ask what job they were proudest of', 'Let them tell it their way, at their own pace.', ['middle']),
  act('reminisce', 'Ask about the town they grew up in', 'Streets, shops, neighbors — small details often come easiest.', ['middle']),
  // Playful
  act('playful', 'Share a corny old joke and see if they smile', 'Deliver it slow, then wait for the grin.', ['middle']),
  act('playful', 'Say an old saying and let them finish it', '“A penny saved is a penny…” — pause and see.', ['middle']),
  act('playful', 'Blow some bubbles and watch them drift', 'Simple and delightful — follow them across the room together.', ['late', 'middle']),
  act('playful', 'Look at a picture book of animals together', 'Point, name them out loud, and enjoy the reactions.', ['late', 'middle']),
  act('playful', 'Play “would you rather” with two easy choices', 'Tea or coffee? Beach or mountains? Keep it light.', ['middle']),
  act('playful', 'Watch a short, gentle clip together', 'Old-timey footage or calm nature — nothing to follow closely.', ['late', 'middle']),
  act('playful', 'Name colors you can both see in the room', 'A quiet, easy back-and-forth with no pressure.', ['middle']),
  act('playful', 'Guess the smell with eyes closed', 'Coffee, cinnamon, an orange — a playful little game of senses.', ['middle']),
];

export function activityDeck(level: FunctioningLevel): ActivitySuggestion[] {
  return activityBank
    .filter((a) => a.levels.includes(level))
    .sort(() => Math.random() - 0.5);
}

// MARK: - Discovery question bank

function dq(text: string, followUps: string[] = []): DiscoveryQuestion {
  return { id: uuid(), text, followUps };
}

const discoveryBank: Record<DiscoveryTheme, DiscoveryQuestion[]> = {
  childhood: [
    dq('What was the house you grew up in like?', ['Did you share a room?', 'What was the kitchen like?', 'Who else lived there?']),
    dq('What did you get up to after school?', ['Were you out till dark?', 'Who were you with?', 'Did you have chores first?']),
    dq('Were you the oldest, youngest, or in the middle?', ['Did you get on?', 'Who was the troublemaker?', 'Who were you closest to?']),
    dq('What did your family do on the weekends?', ['Was Sunday different?', 'Did you visit relatives?', 'Any special meals?']),
  ],
  youngerYears: [
    dq('What was your first job?', ['What did it pay?', 'What did you spend it on?', 'Did you like it?']),
    dq('What did you and your friends do for fun?', ['Where did you go?', 'Any music you loved?', 'Did you dance?']),
    dq('What was the first car you remember?', ['Whose was it?', 'Where did you drive?', 'Did it ever break down?']),
    dq('Did you ever get into any trouble back then?', ['Did you get caught?', 'Was it worth it?', 'Who was with you?']),
  ],
  loveAndFamily: [
    dq('How did you and Grandpa first meet?', ['What did you think of him?', 'Who made the first move?', 'Where was your first date?']),
    dq('What were your kids like when they were little?', ['Who was the handful?', 'Who was easy?', 'What made you laugh?']),
    dq('Who in the family are you most like?', ['In what way?', 'Did people say so?', 'Is that a good thing?']),
    dq("What's a tradition you always kept?", ['How did it start?', 'Who looked forward to it most?', 'Do we still do it?']),
  ],
  workAndPride: [
    dq('What kind of work did you do?', ['How did you get into it?', 'What was a normal day?', 'Who did you work with?']),
    dq('What were you really good at?', ['Who taught you?', 'Did people come to you for it?', 'Do you miss it?']),
    dq('Is there something you made or built you were proud of?', ['How long did it take?', 'Is it still around?', 'Would you do it again?']),
    dq('What\'s the hardest job you ever had?', ['What made it hard?', 'How did you get through it?', 'What did it teach you?']),
  ],
  favoritesAndFun: [
    dq('What meal could you eat any day of the week?', ['Who made it best?', 'Sweet or savory?', 'Do we have the recipe?']),
    dq('What music always gets you?', ['Who did you listen to?', 'Did you dance to it?', 'Should we put some on?']),
    dq('Where\'s the best place you ever traveled?', ['Who did you go with?', 'What did you see?', 'Would you go back?']),
    dq('What did you do to relax?', ['Was it on your own or with others?', 'Do you still like it?', 'Could we do it together?']),
  ],
  opinionsAndAdvice: [
    dq("What's something you wish you'd known earlier?", ["Who could've told you?", 'Would you have listened?', 'Did you pass it on?']),
    dq('What makes a good life, do you think?', ['Has that changed over time?', 'Did you find it?', 'What matters most now?']),
    dq('What would you tell your younger self?', ['At what age?', 'Would it have helped?', 'What would you not change?']),
    dq("What's changed the most in your lifetime?", ['For better or worse?', 'What do you miss?', "What's better now?"]),
  ],
};

export function discoveryQuestions(theme: DiscoveryTheme): DiscoveryQuestion[] {
  return discoveryBank[theme];
}

// MARK: - Sample seed data

export function sampleMemoryCards(): MemoryCard[] {
  return [
    { id: uuid(), title: 'Rose Garden', category: 'place', story: 'She planted pink roses by the porch every spring.', prompt: 'Would you like to look at the roses together?', captures: [], isSample: true },
    { id: uuid(), title: 'Sunday Jazz', category: 'song', story: 'He loved playing jazz while cooking Sunday dinner.', prompt: 'Should we listen to a familiar song for a moment?', captures: [], isSample: true },
    { id: uuid(), title: 'Lake House', category: 'photo', story: 'Family summers were spent by the lake with long porch evenings.', prompt: 'Does this place feel familiar or peaceful today?', captures: [], isSample: true },
  ];
}

export function sampleLifeFacts(): LifeFact[] {
  return [
    { id: uuid(), category: 'family', question: 'How many children do you have?', answer: 'Three — Maria, Tom, and Susan.', captures: [], isSample: true },
    { id: uuid(), category: 'favorites', question: "What's your favorite color?", answer: 'A soft rose pink, like the roses by the porch.', captures: [], isSample: true },
    { id: uuid(), category: 'food', question: 'What did you love to cook?', answer: 'Sunday roast with all the trimmings, every week.', captures: [], isSample: true },
    { id: uuid(), category: 'celebrations', question: 'Where did you get married?', answer: 'In the little church in town, on a sunny day in June.', captures: [], isSample: true },
  ];
}

// Content signatures of the seeded examples, so we can recognize them even when
// they were persisted before the isSample flag existed.
const sampleMemoryTitles = new Set(sampleMemoryCards().map((m) => m.title));
const sampleFactQuestions = new Set(sampleLifeFacts().map((f) => f.question));

/** True when a memory card is seeded example content (by flag or signature). */
export function isSampleMemory(m: MemoryCard): boolean {
  return m.isSample === true || sampleMemoryTitles.has(m.title);
}

/** True when a life fact is seeded example content (by flag or signature). */
export function isSampleFact(f: LifeFact): boolean {
  return f.isSample === true || sampleFactQuestions.has(f.question);
}
