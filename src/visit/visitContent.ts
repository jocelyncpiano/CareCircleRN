// Content for the new Visit Mode ("more support" first).
//
// Each card is an activity or talking point, with one starting move and only
// the optional scenario branches that add useful coaching. The voice should
// feel like guidance from a caregiver who has done this before, not a manual.
//
// 41 cards. Designed for seniors who need MORE support: every
// card is receptive and low-demand. The loved one does NOT have to participate —
// the caregiver does the activity in their presence, narrating and telling
// stories while they do it. Voice + coaching mirror the congressional-app lesson
// content: warm, direct "you," the WHY behind each move, a concrete example
// quote, and reassurance that stopping or doing nothing is perfectly okay.

import { colors } from '../theme';
import { VisitCardStat } from '../models/types';

export type VisitCardKind = 'activity' | 'talk';

export interface VisitStep {
  /** Short label for the step (shown above the body). */
  heading: string;
  /** The guidance for this step. Keep it to 1–2 tight lines. */
  body: string;
}

export interface VisitDeckCard {
  id: string;
  kind: VisitCardKind;
  title: string;
  /** Optional "what you'll need" line. Omit for things that need nothing. */
  bring?: string;
  steps: VisitStep[];
}

export const visitKindMeta: Record<
  VisitCardKind,
  { label: string; icon: string; color: string }
> = {
  activity: { label: 'Do together', icon: 'color-palette', color: colors.teal },
  talk: { label: 'To talk about', icon: 'chatbubbles', color: colors.orange },
};

// A situational tip: "if X happens, try Y and Z." These are reactive help the
// caregiver reaches for mid-visit — not part of the linear deck.
export interface VisitTip {
  id: string;
  /** The situation — "If they get upset or agitated". */
  situation: string;
  icon: string;
  /** A few short things to try. Informative + warm, with the why. */
  moves: string[];
}

export const visitTips: VisitTip[] = [
  {
    id: 'agitated',
    situation: 'If they get upset, anxious, or agitated',
    icon: 'alert-circle',
      moves: [
      'Pause what you\u2019re doing and lower the stimulation: turn off the TV, ask extra people to step out, and slow your voice.',
      'Check for a practical cause: pain, hunger, thirst, temperature, or needing the bathroom. Fix that before trying another activity.',
      'Acknowledge the distress without guessing what caused it: \u201CI\u2019m here with you. Let\u2019s stop for a minute.\u201D If they settle, shift to one familiar song or object.',
    ],
  },
  {
    id: 'no-recognize',
    situation: 'If they don\u2019t recognize you',
    icon: 'person-circle',
    moves: [
      'Do not quiz them. Put your name and relationship into the greeting: \u201CHi, I\u2019m [your name], your [relationship]. I came to see you.\u201D',
      'If they mistake you for someone else, do not argue about your identity. Respond to the tone of what they\u2019re saying and keep your manner calm.',
      'If they seem wary, give them more space and use something familiar, such as your voice, a photo, or a song. Ask a familiar staff member to join you if needed.',
    ],
  },
  {
    id: 'repeating',
    situation: 'If they repeat the same thing',
    icon: 'repeat',
    moves: [
      'Answer without pointing out the repetition. \u201CYou already asked me\u201D usually adds embarrassment without stopping the loop.',
      'Listen for the worry underneath it and answer that: \u201CYes, I\u2019ll make sure you get home safely.\u201D',
      'For a fact they keep asking for, write the answer in large print. If the loop continues, change the setting or begin a familiar song or snack.',
    ],
  },
  {
    id: 'not-true',
    situation: 'If they say something that isn\u2019t true',
    icon: 'chatbubble-ellipses',
    moves: [
      'Do not correct a harmless detail. Ask about the person or place they mentioned, or continue the conversation from where they are.',
      'Answer the concern underneath the words: \u201CI need to pick up the kids\u201D may need \u201CThe kids are taken care of.\u201D',
      'When the literal truth would cause fresh grief, use a brief reassuring answer and redirect. You do not need to prove the facts.',
    ],
  },
  {
    id: 'withdraw',
    situation: 'If they get tired or withdraw',
    icon: 'moon',
    moves: [
      'Stop the activity and reduce the input around them. One quiet voice is easier to manage than more questions or instructions.',
      'Offer one low-effort choice: rest, listen to music, or end the visit. Do not persuade them to keep going.',
      'If the change is sudden or they seem unwell, tell staff or the person responsible for their care before you leave.',
    ],
  },
];


// ---------------------------------------------------------------------------
// MORE-SUPPORT DECK (42 cards — mixes doing + talking)
// ---------------------------------------------------------------------------

export const moreSupportDeck: VisitDeckCard[] = [
  {
    id: 'photos',
    kind: 'activity',
    title: 'Look through photos',
    bring: 'A photo album, loose prints, or your phone.',
    steps: [
      {
        heading: 'Start with the story',
        body: 'Open the album and point to one photo. Instead of asking \u201CDo you remember this?\u201D, just say who\u2019s in it: \u201CThat\u2019s you and Dad at the lake \u2014 I always loved this trip.\u201D',
      },
      {
        heading: 'If a photo catches their eye',
        body: 'Stay right there. Whether they start talking, smile, laugh, or simply keep looking at it, let that one photo be the conversation before you move on.',
      },
      {
        heading: 'If they don\u2019t recognize anyone',
        body: 'Name the people once, then talk about something visible: the lake, their clothes, or the weather. That keeps the photo enjoyable without asking them to place anyone.',
      },
    ],
  },
  {
    id: 'tell-them-who-they-are',
    kind: 'talk',
    title: 'Share something true about them',
    steps: [
      {
        heading: 'Start with something true',
        body: 'Share one specific part of who they are: \u201CYou always made Sunday breakfast for everyone.\u201D You\u2019re telling them something true, not asking them to prove they remember it.',
      },
      {
        heading: 'Add the detail that makes it theirs',
        body: 'Tell the next part yourself: \u201CI still think about your cinnamon rolls. You made them every Christmas morning.\u201D If that gets a smile, look, or word, add who was there or what happened next.',
      },
      {
        heading: 'If the story does not seem familiar',
        body: 'Drop questions about when or where it happened. Finish with one thing you want them to hear about themselves: \u201CYou made people feel welcome in that house.\u201D',
      },
    ],
  },
  {
    id: 'music',
    kind: 'activity',
    title: 'Listen to music',
    bring: 'A speaker or phone with songs they enjoy.',
    steps: [
      {
        heading: 'Start with a favorite',
        body: 'Put on one song they have loved for years. If the TV is on, turn it off so the song has a little room, then sit where they can see you.',
      },
      {
        heading: 'If they sing or tap along',
        body: 'Join in! Keep that song going or play another in the same style, rather than switching to something new.',
      },
      {
        heading: 'If the first song isn\u2019t clicking',
        body: 'Try another familiar favorite first. Sometimes it\u2019s simply the wrong song, not the wrong activity.',
      },
    ],
  },
  {
    id: 'share-your-life',
    kind: 'talk',
    title: 'Share your life',
    steps: [
      {
        heading: 'Start with one small story',
        body: 'Tell them one thing from your day \u2014 something funny at work, a new hobby, or what the kids did this week. Start at the beginning and keep the cast of characters small.',
      },
      {
        heading: 'Tell it like you normally would',
        body: 'Give them the funny part, what surprised you, or what happened next. If Ben or the flat cake gets a smile or look, add one more detail before finishing.',
      },
      {
        heading: 'If the story gets hard to follow',
        body: 'Bring it back to one person and one event: \u201CThe short version is, Ben tried to bake a cake and it came out flat.\u201D Finish there instead of adding another update.',
      },
    ],
  },
  {
    id: 'treat',
    kind: 'activity',
    title: 'Share a treat',
    bring: 'A favorite snack, dessert, or drink.',
    steps: [
      {
        heading: 'Share it together',
        body: 'Choose something they already eat or drink safely. Sit beside them, serve yourself too, and take the first bite or sip with them.',
      },
      {
        heading: 'If they seem to enjoy it',
        body: 'Stay with that flavor. Name what you notice about it, or tell a short story about who used to make it; they can enjoy listening without answering.',
      },
      {
        heading: 'If they\u2019d rather just eat',
        body: 'Eat alongside them and let the snack have their attention. Conversation can wait; watch only for the usual swallowing or dietary precautions already part of their care.',
      },
    ],
  },
  {
    id: 'recall-a-memory',
    kind: 'talk',
    title: 'Recall a memory together',
    steps: [
      {
        heading: 'Tell the story first',
        body: 'Start with what you remember instead of asking them to recall it: \u201CI was thinking about that summer we drove up the coast.\u201D That gives them a story to listen to instead of a question to answer.',
      },
      {
        heading: 'Fill in the small details',
        body: 'Describe who was there, what the place looked like, or the part that still makes you laugh. If one detail gets a smile, look, or word, repeat it and tell what happened next.',
      },
      {
        heading: 'If they remember it differently',
        body: 'Use the part from their version instead of settling the timeline: \u201CYou remember the red car. I want to hear about that.\u201D',
      },
    ],
  },
  {
    id: 'game',
    kind: 'activity',
    title: 'Play a favorite game',
    bring: 'Cards, dominoes, or a familiar board game.',
    steps: [
      {
        heading: 'Start a familiar game',
        body: 'Set up a game they\u2019ve played for years and start right in beside them, describing your own move as you go: \u201CI\u2019m turning over the blue card. Let\u2019s see what is underneath.\u201D',
      },
      {
        heading: 'If they watch or join in',
        body: 'Keep the game moving and say what is happening as you play. If they make a move, respond to it and give them time before taking the next turn.',
      },
      {
        heading: 'If the rules slip away',
        body: 'Change the game in front of them without pointing out a mistake: match cards, line up dominoes, or play with everyone\u2019s hand faceup. Keep only the rule that makes the next move clear.',
      },
    ],
  },
  {
    id: 'read-aloud',
    kind: 'activity',
    title: 'Read aloud',
    bring: 'A short story, poems, or a favorite book.',
    steps: [
      {
        heading: 'Start reading',
        body: 'Pick a short story, poem, or a few pages of a favorite book. Read the first paragraph slowly, then pause before continuing.',
      },
      {
        heading: 'If they keep listening',
        body: 'Keep the same pace and glance up at the end of each paragraph. If they look toward you or respond to a line, pause there before continuing.',
      },
      {
        heading: 'If they drift off',
        body: 'Finish the sentence you are on, then stop. If their eyes stay closed or their attention has moved, close the book instead of calling them back to it.',
      },
    ],
  },
  {
    id: 'grateful',
    kind: 'talk',
    title: 'Say what you\u2019re grateful for',
    steps: [
      {
        heading: 'Start with one specific thank-you',
        body: 'Choose one lesson, tradition, or memory: \u201CYou taught me how to stay patient when things get hard.\u201D One real example is easier to take in than a long speech.',
      },
      {
        heading: 'Say how it stayed with you',
        body: 'Tell them where that lesson still shows up in your life: \u201CI use that same recipe with my kids now.\u201D If they respond to one part, stay there; if not, finish the thought you came to share.',
      },
      {
        heading: 'If the thank-you feels too abstract',
        body: 'Replace the big message with one example: the meal they made, the ride they gave you, or the advice you still use. A concrete thank-you is easier to receive than a summary of their whole life.',
      },
    ],
  },
  {
    id: 'color',
    kind: 'activity',
    title: 'Color together',
    bring: 'Coloring pages and colored pencils or markers.',
    steps: [
      {
        heading: 'Start your own page',
        body: 'Put two simple pages side by side and start coloring one yourself. Leave a few pencils near their page so they can join if they feel like it.',
      },
      {
        heading: 'If they watch or pick up a pencil',
        body: 'Think out loud about your own page: \u201CI\u2019m using this blue for the sky.\u201D If they start coloring, work beside them and let their page be theirs.',
      },
      {
        heading: 'If they look away or set it down',
        body: 'Keep coloring your own page for another minute without offering the pencil again. If their attention stays elsewhere, put both pages away unfinished; there is nothing to explain or complete.',
      },
    ],
  },
  {
    id: 'look-at',
    kind: 'activity',
    title: 'Browse a magazine or picture book',
    bring: 'A magazine, nature book, or picture book.',
    steps: [
      {
        heading: 'Start flipping through',
        body: 'Choose a book or magazine with large, clear pictures. Turn one page at a time and name exactly what you see: \u201CThere\u2019s a red barn, and two horses by the fence.\u201D',
      },
      {
        heading: 'If they keep looking at one page',
        body: 'Stop turning pages and add one or two details about that picture. Give them time to look without asking what they see or whether they recognize it.',
      },
      {
        heading: 'If they keep looking away',
        body: 'Change the subject once before putting the book away: cars instead of nature, recipes instead of travel, or family photos instead of a magazine. One page is enough to see whether different pictures help.',
      },
    ],
  },
  {
    id: 'word-puzzle',
    kind: 'activity',
    title: 'Crossword or word search',
    bring: 'A printed puzzle and a pen.',
    steps: [
      {
        heading: 'Solve it as a team',
        body: 'Take the pen and read one easy clue aloud. Give it a moment, then offer the answer yourself so it feels shared rather than like a quiz.',
      },
      {
        heading: 'If they follow a clue',
        body: 'Talk through the letters as you write. If they offer a word, look toward an answer, or make a sound, pause and give them room to take that part.',
      },
      {
        heading: 'If the puzzle starts feeling tense',
        body: 'Say the answer yourself and fill it in without drawing attention to the missed clue. If the tension stays, close the puzzle and move to something without right answers.',
      },
    ],
  },
  {
    id: 'jigsaw',
    kind: 'activity',
    title: 'Do a puzzle',
    bring: 'A jigsaw puzzle with larger pieces.',
    steps: [
      {
        heading: 'Set it up first',
        body: 'Use a small puzzle with large pieces and set out only a few at first. Start an edge or color section beside them so there is an easy place to join.',
      },
      {
        heading: 'If they watch or reach for a piece',
        body: 'Talk through what you notice: \u201CThis blue piece belongs near the sky.\u201D If they reach for one, move the board closer and give them time; otherwise, keep placing pieces yourself.',
      },
      {
        heading: 'If they tense up or push it away',
        body: 'Move the loose pieces out of their space and set the puzzle aside. Do not offer another piece once they have pushed it away.',
      },
    ],
  },

  // --- Companionable doing (you do it, narrate, they receive) ---------------
  {
    id: 'crochet',
    kind: 'activity',
    title: 'Crochet or knit beside them',
    bring: 'Your yarn and project.',
    steps: [
      {
        heading: 'Start where they can see',
        body: 'Sit where they can see your hands and begin working. Tell them what you are making and who it is for.',
      },
      {
        heading: 'If they watch your hands or reach out',
        body: 'Tell them about the colors, the pattern, or who it\u2019s for \u2014 and if they reach for the yarn, let them hold it or wind it.',
      },
      {
        heading: 'If they\u2019d rather watch',
        body: 'Keep working and describe the next row, color, or part of the pattern. If they have not reached for the yarn, there is no need to keep offering it.',
      },
    ],
  },
  {
    id: 'bake',
    kind: 'activity',
    title: 'Bake something together',
    bring: 'A simple recipe or boxed mix.',
    steps: [
      {
        heading: 'Start it beside them',
        body: 'Choose a simple recipe with a familiar smell and make it beside them. You can handle the measuring, hot pans, and sharp tools, then offer an easy stir or sprinkle if it works for them.',
      },
      {
        heading: 'If they reach in to help',
        body: 'Give them one small step at a time while you keep narrating. You can steady the bowl or finish any measuring that gets tricky.',
      },
      {
        heading: 'If they\u2019d rather watch',
        body: 'Keep making it beside them and talk through only the interesting parts. Bring the finished bake close enough to smell, and serve it only if it fits their usual diet and swallowing plan.',
      },
    ],
  },
  {
    id: 'scrapbook',
    kind: 'activity',
    title: 'Put a scrapbook together',
    bring: 'Photos, paper or an album, tape or glue.',
    steps: [
      {
        heading: 'Lay the photos out',
        body: 'Spread a few photos where they\u2019re easy to see before you attach anything.',
      },
      {
        heading: 'If they point, smile, or start talking',
        body: 'Pause the scrapbook and stay with that photo. Name the people or add a detail if they need help carrying the story.',
      },
      {
        heading: 'If they look away or grow tired',
        body: 'The page can stay unfinished. Cover the loose photos, leave everything in one folder, and pick up there another day without starting over.',
      },
    ],
  },
  {
    id: 'write-card',
    kind: 'activity',
    title: 'Write a card to family',
    bring: 'A blank card and a pen.',
    steps: [
      {
        heading: 'Give it a purpose',
        body: 'Name who the card is for: \u201CLet\u2019s send Katie a card. I\u2019ll write, and we can tell her we\u2019re thinking about her.\u201D',
      },
      {
        heading: 'If the name gets their attention',
        body: 'Stay with that person and write one simple line about them. Add any word or gesture they offer, then read the message back aloud.',
      },
      {
        heading: 'If they mostly listen',
        body: 'Write the card yourself and read each sentence aloud as you go. Before sealing it, read the whole message once and tell them when you plan to send it.',
      },
    ],
  },
  {
    id: 'press-flowers',
    kind: 'activity',
    title: 'Press some flowers',
    bring: 'Fresh flowers and a heavy book.',
    steps: [
      {
        heading: 'Start with one flower',
        body: 'Hold up one bloom where they can see it and describe the color, shape, and scent. Then place it between the pages while you explain what you are doing.',
      },
      {
        heading: 'If they look at or reach for it',
        body: 'Keep it where they can see or smell it and tell them where it came from or who chose it. If they reach, let them touch a sturdy stem while you handle the book.',
      },
      {
        heading: 'If they turn away',
        body: 'Finish pressing one flower and set the rest aside. Bring it back after it dries and say, \u201CThis is the flower I pressed when we sat together.\u201D',
      },
    ],
  },

  // --- Storytelling (you lead, they receive) -------------------------------
  {
    id: 'today-around-you',
    kind: 'talk',
    title: 'Talk about what is happening today',
    steps: [
      {
        heading: 'Start with one thing from today',
        body: 'Share something happening now: who visited, what the weather is doing, or one small piece of family news. Keep it to one person or event at a time.',
      },
      {
        heading: 'Add what you noticed',
        body: 'Give your own reaction: \u201CThe rain finally stopped, and the garden smells good again.\u201D If they look toward something in the room, follow that instead of finishing your original topic.',
      },
      {
        heading: 'If the update is hard to follow',
        body: 'Shorten it to one clear sentence and point to what is present: \u201CIt is raining outside, so I brought the blue umbrella.\u201D Then leave space before adding anything else.',
      },
    ],
  },
  {
    id: 'map-stories',
    kind: 'talk',
    title: 'Trace a map of their life',
    bring: 'A map, atlas, or the map on your phone.',
    steps: [
      {
        heading: 'Start with one place',
        body: 'Point to a hometown, vacation spot, or somewhere they lived: \u201CHere\u2019s where you and Dad met. You were both working downtown.\u201D',
      },
      {
        heading: 'Tell what happened there',
        body: 'Describe who lived there and what happened nearby, pointing as you talk. If their attention stays on one place, add another detail before moving your finger somewhere new.',
      },
      {
        heading: 'If the map does not hold their attention',
        body: 'Put the map away and tell one short story about the place instead. Keep the town or person from the map, but drop the route and geography.',
      },
    ],
  },
  {
    id: 'life-story-page',
    kind: 'activity',
    title: 'Make a life-story page',
    bring: 'Paper and a pen.',
    steps: [
      {
        heading: 'Start with what you know',
        body: 'Write one short part of their life in large, clear print and read it aloud: \u201CYou grew up on Cedar Street with your two sisters.\u201D Keep the page so family can add to the same story later.',
      },
      {
        heading: 'If a name or place gets their attention',
        body: 'Pause there and say a little more about it. If they offer a word, add it to the page; otherwise, read the sentence back and leave it as written.',
      },
    ],
  },

  // --- Sensory & shared (receptive) ----------------------------------------
  {
    id: 'home-videos',
    kind: 'activity',
    title: 'Watch old home videos',
    bring: 'Old family videos on a phone, tablet, or TV.',
    steps: [
      {
        heading: 'Start with a short clip',
        body: 'Pick a short clip from a birthday, holiday, or family gathering. Sit beside them where you can both see the screen, then name the event before you press play.',
      },
      {
        heading: 'If they keep watching one scene',
        body: 'Replay it or pause on a familiar face. Name who is there and tell one short detail about what was happening.',
      },
      {
        heading: 'If they don\u2019t recognize anyone',
        body: 'Name each person once as they appear: \u201CThat\u2019s you and the grandkids at the lake.\u201D Then comment on what is happening instead of checking whether the faces are familiar.',
      },
    ],
  },
  {
    id: 'old-show',
    kind: 'activity',
    title: 'Watch a favorite old show',
    bring: 'A favorite TV show, movie, or musical.',
    steps: [
      {
        heading: 'Put on a familiar favorite',
        body: 'Choose a show they have watched before and start with one short scene. Sit beside them and turn off other background noise.',
      },
      {
        heading: 'If they laugh or keep watching',
        body: 'Let the scene play and watch with them. Name a familiar actor or comment on what just happened, then return your attention to the screen.',
      },
      {
        heading: 'If they look away or seem confused',
        body: 'Pause and summarize the scene in one sentence. If they keep looking away, turn it off rather than restarting or explaining the plot again.',
      },
    ],
  },

  // --- Outside & nature ----------------------------------------------------
  {
    id: 'sunshine',
    kind: 'activity',
    title: 'Sit outside or by a bright window',
    steps: [
      {
        heading: 'Find a comfy spot',
        body: 'Choose a shaded porch, patio, or bright window where they can sit comfortably. Avoid the hottest part of the day and bring whatever mobility support they normally use.',
      },
      {
        heading: 'If they look around or settle back',
        body: 'Point out one thing at a time: the breeze, a bird, or someone walking past. Leave space between comments instead of keeping up a running conversation.',
      },
      {
        heading: 'If they get restless',
        body: 'Move into the shade, head back inside, or switch activities. Once they start shifting, pulling at clothing, or looking for a way out, that is plenty for today.',
      },
    ],
  },
  {
    id: 'birds',
    kind: 'activity',
    title: 'Watch the birds',
    bring: 'A window, garden, or bird feeder.',
    steps: [
      {
        heading: 'Pick a good view',
        body: 'Sit somewhere you can comfortably watch the feeder, garden, or window together.',
      },
      {
        heading: 'If they look toward the window',
        body: 'Point out one bird at a time and describe its color or movement. You can keep sharing what you notice without waiting for an answer.',
      },
      {
        heading: 'If the birds stay away',
        body: 'Stay at the window and name one thing that is actually there: moving branches, rain on the glass, or people passing. If they keep looking elsewhere, leave the window without waiting for a bird to make the activity work.',
      },
    ],
  },
  {
    id: 'walk',
    kind: 'activity',
    title: 'Spend a little time outside',
    steps: [
      {
        heading: 'Choose an easy way outside',
        body: 'Use a porch, garden path, wheelchair, or nearby bench \u2014 whatever is safe and comfortable for them. You do not need to cover any distance.',
      },
      {
        heading: 'If they seem comfortable',
        body: 'Point out flowers, trees, or people passing by. They can walk, sit, look around, or simply listen while you describe what is nearby.',
      },
      {
        heading: 'If they seem tired or uncomfortable',
        body: 'Sit down, head back inside, or end the outing. A change in expression, posture, or breathing is enough reason to stop.',
      },
    ],
  },
  {
    id: 'garden',
    kind: 'activity',
    title: 'Look at the garden',
    bring: 'A garden, flower bed, or potted plants.',
    steps: [
      {
        heading: 'Start with one plant',
        body: 'Start from wherever they are comfortable, even if that means bringing one potted plant to their chair. Point out one flower, leaf, or vegetable instead of trying to tour the whole garden.',
      },
      {
        heading: 'If they look toward it or settle',
        body: 'Describe the color, texture, and scent. Bring it close enough to see or smell, without expecting them to touch it.',
      },
      {
        heading: 'If they turn away or seem uncomfortable',
        body: 'Move the plant away, find a seat, or head back inside. A few minutes is plenty; stop before the outing becomes tiring.',
      },
    ],
  },

  // --- Pets ----------------------------------------------------------------
  {
    id: 'pet-visit',
    kind: 'activity',
    title: 'Visit with a dog or cat',
    bring: 'A calm, friendly pet (if allowed).',
    steps: [
      {
        heading: 'Introduce the animal slowly',
        body: 'Bring an animal they have been comfortable around before, with another adult handling the lead if possible. Let the pet approach on its own and keep it off their lap unless they invite it closer.',
      },
      {
        heading: 'If they watch the animal',
        body: 'Keep the animal where they can see it and describe what it is doing. If they reach out, help the animal come closer rather than moving their hand for them.',
      },
      {
        heading: 'If they stiffen or pull away',
        body: 'Move the animal back and give them both some space. Leave it there for today rather than trying for another touch.',
      },
    ],
  },

  // --- Talks (you telling, not quizzing) -----------------------------------
  {
    id: 'where-grew-up',
    kind: 'talk',
    title: 'Where they grew up',
    steps: [
      {
        heading: 'Start with their old home',
        body: 'Name the place and one detail you know: \u201CYou grew up in that little house on Cedar Street, with the big oak out front.\u201D',
      },
      {
        heading: 'Bring in the familiar details',
        body: 'Add the street, neighbor, pet, or family tradition you know about. If one gets a smile, look, or word, tell the next story you know about it.',
      },
      {
        heading: 'If you only know a little',
        body: 'Stay with the facts you know and say where they came from: “This is the house Aunt June told me about.” When you run out, finish there instead of filling gaps or asking them to supply the story.',
      },
    ],
  },
  {
    id: 'their-work',
    kind: 'talk',
    title: 'The work they did',
    steps: [
      {
        heading: 'Start with the work they did',
        body: 'Name one role they knew well: \u201CYou ran the front office at Miller\u2019s for twenty years. Everyone came to you when they needed an answer.\u201D',
      },
      {
        heading: 'Give one example of their skill',
        body: 'Make it specific: \u201CYou could add up a whole column in your head.\u201D If that brings something up, tell one time you saw that skill in action.',
      },
      {
        heading: 'If the job does not seem familiar',
        body: 'Let the job title go and name the part of them you still know: \u201CYou were patient with people, and I learned that from you.\u201D',
      },
    ],
  },
  {
    id: 'how-they-met',
    kind: 'talk',
    title: 'How they met their partner',
    steps: [
      {
        heading: 'Tell the story from the beginning',
        body: 'Start where they met and how it all began: \u201CYou spotted Dad across the dance hall, and that was that!\u201D',
      },
      {
        heading: 'Bring in the details you know',
        body: 'Add the first date, wedding, song, or place that made the story theirs. If the song gets a smile, play it; if a person gets their attention, tell the next story you know about them.',
      },
      {
        heading: 'If they become quiet or emotional',
        body: 'Stop and give them a moment. If they seem upset, say, \u201CWe can leave that story there,\u201D then switch to a familiar song, photo, or object in the room.',
      },
    ],
  },
  {
    id: 'parents-siblings',
    kind: 'talk',
    title: 'Their parents & siblings',
    steps: [
      {
        heading: 'Introduce the people',
        body: 'Bring up their parents, brothers, sisters, and the family they came from: \u201CYour mother made the best pie, and Jack was always the troublemaker!\u201D',
      },
      {
        heading: 'Make one person easy to picture',
        body: 'Choose one name and share a habit, personality trait, or funny story about them. If that person seems familiar, keep going; otherwise, finish the story without asking who they remember.',
      },
      {
        heading: 'If the story becomes upsetting',
        body: 'Stop adding details and acknowledge what you can see: \u201CThis is bringing up a lot. We can stop.\u201D Sit quietly for a moment, then offer one familiar song or comment on something in the room instead of starting another family story.',
      },
    ],
  },
  {
    id: 'food-they-made',
    kind: 'talk',
    title: 'Food they used to make',
    steps: [
      {
        heading: 'Start with a favorite recipe',
        body: 'Bring up something everyone remembers them making: \u201CNobody\u2019s Sunday gravy ever beat yours!\u201D',
      },
      {
        heading: 'Describe the meal around it',
        body: 'Talk about the smell, taste, and the table where everyone ate it. A photo or safe small taste can help, but keep telling the story instead of asking them for the recipe.',
      },
      {
        heading: 'If the dish is not familiar to them',
        body: 'Tell one memory connected to the meal instead of trying to place the recipe. You might add who still makes it now: \u201CLisa uses your recipe every Christmas.\u201D',
      },
    ],
  },
  {
    id: 'family-news',
    kind: 'talk',
    title: 'Bring family news',
    steps: [
      {
        heading: 'Start with one update',
        body: 'Share one piece of happy family news at a time: \u201CKatie had her little girl, and they named her after you!\u201D A short story is easier to follow than a full family recap.',
      },
      {
        heading: 'Keep the update easy to follow',
        body: 'Name how the person is connected, then give the main part of the news. If that person catches their attention, show a photo or add one detail instead of moving through the rest of the family.',
      },
      {
        heading: 'If the names get hard to follow',
        body: 'Name the connection once: \u201CKatie is your granddaughter, Lisa\u2019s oldest.\u201D If that does not help, leave the update there and switch to a photo, song, or snack.',
      },
    ],
  },
  {
    id: 'grandkids-story',
    kind: 'talk',
    title: 'A story about the grandkids',
    steps: [
      {
        heading: 'Tell one story',
        body: 'Pick one funny or sweet moment instead of listing everything the kids have done: \u201CLittle Sam took his first steps this week \u2014 straight for the dog!\u201D',
      },
      {
        heading: 'Make the child easy to picture',
        body: 'Add one detail about the child\u2019s personality, then name everyone in any photo you show. If something catches their attention, stay there instead of adding more names.',
      },
      {
        heading: 'If the names get hard to follow',
        body: 'Explain the connection once: \u201CSam is Lisa\u2019s little boy.\u201D Then finish the story without adding more names.',
      },
    ],
  },
  {
    id: 'old-letters',
    kind: 'talk',
    title: 'Read old letters aloud',
    bring: 'Old letters, cards, or notes from people who love them.',
    steps: [
      {
        heading: 'Introduce the writer',
        body: 'Before you begin, say who wrote it and when: \u201CThis one\u2019s from your sister June, back in \u201962.\u201D Then read the first few lines.',
      },
      {
        heading: 'Read one short section at a time',
        body: 'Pause after a paragraph and briefly explain any unfamiliar name or event. If one line catches their attention, repeat it; otherwise, continue without checking whether they remember the writer.',
      },
      {
        heading: 'If they look tired or upset',
        body: 'Close the letter and name the writer once more: \u201CThat was from your sister, June.\u201D Set the letters out of sight, then return to something present and easy: a drink, the view outside, or a familiar song.',
      },
    ],
  },

  // --- Warmth --------------------------------------------------------------
  {
    id: 'faith',
    kind: 'talk',
    title: 'Sit in faith together',
    steps: [
      {
        heading: 'Choose something familiar',
        body: 'If faith is part of who they are, start with a prayer, hymn, or verse they have known for years. Use the version and pace that would sound familiar to them.',
      },
      {
        heading: 'Carry it at a familiar pace',
        body: 'Continue the words or melody without stopping to prompt them. If they join in by speaking, humming, or moving with the rhythm, match their pace rather than trying to complete it for them.',
      },
      {
        heading: 'If they pull away, tense, or grow restless',
        body: 'Stop the prayer or music and return to a quieter activity. Familiar does not always mean welcome in that moment.',
      },
    ],
  },

  // --- Light & playful -----------------------------------------------------
  {
    id: 'inside-joke',
    kind: 'talk',
    title: 'Share an inside joke',
    steps: [
      {
        heading: 'Bring back a familiar phrase',
        body: 'Pull up the joke or saying your family has laughed about for years: \u201CWell, like you always said \u2014 more butter never hurt anyone!\u201D',
      },
      {
        heading: 'Tell the short story behind it',
        body: 'Use the same delivery your family knows, then explain what happened in a sentence or two. If they laugh or repeat the phrase, do the bit again before adding another joke.',
      },
      {
        heading: 'If it doesn\u2019t get a laugh',
        body: 'Explain it once if the story is easy to tell, then let it go. There is no need to make them guess the punchline or remember why it was funny.',
      },
    ],
  },
  {
    id: 'season-holiday',
    kind: 'talk',
    title: 'The season or a holiday',
    steps: [
      {
        heading: 'Talk about what\u2019s coming up',
        body: 'Mention the season through something they can notice now: \u201CIt\u2019s almost Christmas; I brought one of the ornaments from home.\u201D Use a holiday only if it has been a comfortable tradition for them.',
      },
      {
        heading: 'Bring in one familiar tradition',
        body: 'Tell one story about a recipe, decoration, song, or person connected to the season. A photo, carol, or familiar taste can carry the topic even if they do not add to it.',
      },
      {
        heading: 'If the holiday seems confusing',
        body: 'Stop explaining the date and focus on one thing in the room: a decoration, song, or familiar food. If they become tense or sad, put it away and change the subject without correcting them.',
      },
    ],
  },
  {
    id: 'reminisce-trip',
    kind: 'talk',
    title: 'Reminisce about a trip',
    steps: [
      {
        heading: 'Pick one memorable trip',
        body: 'Choose a favorite vacation, road trip, or day out: \u201CThat drive up the coast \u2014 we stopped at every little diner!\u201D',
      },
      {
        heading: 'Tell the part you still talk about',
        body: 'Share the funny mishap, favorite stop, or person who made the trip memorable. If the diner, car, or traveling companion gets their attention, tell the next part about that.',
      },
      {
        heading: 'If the trip does not seem familiar',
        body: 'Finish one favorite scene yourself: “I still laugh about us stopping at every diner.” Then put away the photo or map and move on without trying to establish when the trip happened.',
      },
    ],
  },
  {
    id: 'end-positive',
    kind: 'talk',
    title: 'End with something positive',
    steps: [
      {
        heading: 'Signal that you are leaving',
        body: 'Sit where they can see you and say it plainly: \u201CI have to head home now.\u201D Pause before standing up so the goodbye does not feel abrupt.',
      },
      {
        heading: 'Name what comes next',
        body: 'Add one thing they can expect: \u201CI loved seeing you. I\u2019ll be back Sunday, and I\u2019ll bring those photos.\u201D Keep it to one plan once you are at the door.',
      },
      {
        heading: 'If they become upset when you leave',
        body: 'Keep the goodbye short and avoid arguing about why you have to go. Reassure them that they are safe, then ask a staff member or another familiar person to join them if one is available.',
      },
    ],
  },
];

// Light-support goodbye. NOT part of the shuffled deck — VisitModeScreen shows
// it as the wrap-up sheet for early/light visits, where the goodbye is an
// ordinary adult one (no reassuring-they're-safe / calling staff).
export const lightEndCard: VisitDeckCard = {
  id: 'light-end',
  kind: 'talk',
  title: 'Wrap up on a good note',
  steps: [
    {
      heading: 'Let them know you\u2019re heading out',
      body: 'Give a heads-up instead of leaving suddenly: \u201CI should get going soon.\u201D It lets you finish the thread you\u2019re on instead of cutting it off.',
    },
    {
      heading: 'Leave a thread for next time',
      body: 'Name when you\u2019ll be back and one thing to pick up then: \u201CI\u2019ll call Sunday \u2014 you have to tell me how the game ends.\u201D It gives you both something to look forward to.',
    },
    {
      heading: 'End on the high point',
      body: 'Mention one part you enjoyed: \u201CI liked hearing what you thought about that movie.\u201D Add a hug or a hand on the shoulder if that\u2019s usual between you.',
    },
  ],
};

// ---------------------------------------------------------------------------
// LIGHT SUPPORT DECK
//
// For higher-functioning seniors who can still take part: hold a real
// back-and-forth, do things with their hands, and — above all — tell their OWN
// stories instead of having them told. Every card assumes they can lead. Talk
// cards ASK (they answer) rather than TELL. Activity cards invite them to play,
// make, and do. The 24 "Ask & listen" cards are conversation guides built from
// the Their-story question bank (models/content.ts): open with the question,
// offer up to three threads, and respond to a detail they share.
// ---------------------------------------------------------------------------

export const lightSupportDeck: VisitDeckCard[] = [
  // --- Games & puzzles -----------------------------------------------------
  {
    id: 'game',
    kind: 'activity',
    title: 'Play a card game',
    bring: 'A deck of cards and any game you both know.',
    steps: [
      { heading: 'The idea', body: 'Rummy, gin, go fish, or another game you both know gives you an easy place to start. Play normally, enjoy the competition, and use a house rule if you remember one differently.' },
    ],
  },
  {
    id: 'board-game',
    kind: 'activity',
    title: 'Play a board game',
    bring: 'A board game or dominoes you both enjoy.',
    steps: [
      { heading: 'The idea', body: 'A familiar board game or dominoes gives you something easy to do while you catch up. Choose sides, play to win, and settle rule disagreements with a house rule.' },
    ],
  },
  {
    id: 'jigsaw',
    kind: 'activity',
    title: 'Do a jigsaw puzzle',
    bring: 'A jigsaw puzzle — a picture they will enjoy.',
    steps: [
      { heading: 'The idea', body: 'A puzzle you choose together gives each of you a color or section to work on. It can stay out for next time if you do not finish.' },
    ],
  },
  {
    id: 'word-puzzle',
    kind: 'activity',
    title: 'Crossword or word search',
    bring: 'A printed crossword or word-search and a pen.',
    steps: [
      { heading: 'The idea', body: 'A crossword or word search works well as a team activity, with one person reading and the other writing. Skipping a clue or looking up an answer is fair game.' },
    ],
  },
  {
    id: 'trivia',
    kind: 'activity',
    title: 'Quiz each other',
    bring: 'Some trivia questions — a book or your phone.',
    steps: [
      { heading: 'The idea', body: 'Trading questions about films, music, sports, or history gives both of you a turn to stump the other. A story or opinion may be more fun than keeping score.' },
    ],
  },
  {
    id: 'strategy-game',
    kind: 'activity',
    title: 'Checkers or chess',
    bring: 'A checkers or chess set.',
    steps: [
      { heading: 'The idea', body: 'If checkers or chess is already one of your games, choosing sides and getting right into it is enough. Give each other time to think and enjoy the rivalry.' },
    ],
  },
  {
    id: 'name-tune',
    kind: 'activity',
    title: 'Name that tune',
    bring: 'A playlist of songs from their era.',
    steps: [
      { heading: 'The idea', body: 'Taking turns with the opening of favorite songs gives you both a chance to guess the title or singer. A clue, the next lyric, or simply listening keeps it relaxed.' },
    ],
  },

  // --- Hands & home --------------------------------------------------------
  {
    id: 'bake',
    kind: 'activity',
    title: 'Bake something together',
    bring: 'Simple baking supplies — a mix is fine.',
    steps: [
      { heading: 'Choose one familiar bake', body: 'Use a recipe they know and divide the jobs before you begin. Decide who will handle hot pans and sharp tools.' },
      { heading: 'Decide who is doing what', body: 'One person can measure while the other mixes or prepares the pan. Their method does not need to match yours.' },
      { heading: 'If you disagree about a step', body: 'Check the recipe or try it their way if the stakes are low. Step in directly only around a hot pan, sharp tool, or allergy.' },
    ],
  },
  {
    id: 'cook',
    kind: 'activity',
    title: 'Cook a family recipe',
    bring: 'A family recipe and the ingredients.',
    steps: [
      { heading: 'Start with a familiar dish', body: 'A dish they know well is a good place to begin. The recipe can stay nearby while they tell you how they usually make it.' },
      { heading: 'Cook as partners', body: 'Ask which part they want and take another job for yourself. If they have a strong opinion about seasoning or technique, hear them out.' },
      { heading: 'Taste as you go', body: 'Tasting together lets you compare notes and adjust as you cook. If it is not how either of you remembers it, next time becomes part of the conversation.' },
    ],
  },
  {
    id: 'plants',
    kind: 'activity',
    title: 'Tend or repot plants',
    bring: 'A plant, some soil, and a pot.',
    steps: [
      { heading: 'The idea', body: 'One plant to repot, trim, or water makes a manageable job to share. Gardening opinions and where the plant should go give you plenty to discuss.' },
    ],
  },
  {
    id: 'craft',
    kind: 'activity',
    title: 'Do a simple craft',
    bring: 'A simple craft or kit.',
    steps: [
      { heading: 'The idea', body: 'Knitting, painting, or a simple kit gives you each something to make side by side. The instructions are only a suggestion, so skip any fussy part that is not fun.' },
    ],
  },
  {
    id: 'color',
    kind: 'activity',
    title: 'Color or paint together',
    bring: 'Coloring pages or paints and paper.',
    steps: [
      { heading: 'The idea', body: 'A page for each of you or some blank paper and paint leaves room to talk while you work. Postcards or another creative project may feel more natural if coloring is not their thing.' },
    ],
  },
  {
    id: 'scrapbook',
    kind: 'activity',
    title: 'Make a scrapbook together',
    bring: 'Photos, an album or paper, and glue or tape.',
    steps: [
      { heading: 'The idea', body: 'A few photos are enough to arrange one page together and add a short caption if one comes naturally. A good story is a fine reason to pause the scrapbook.' },
      { heading: 'If you disagree on a name or date', body: 'Leave the caption blank or pencil in a question mark. You can check with someone else later without stopping the scrapbook.' },
    ],
  },
  {
    id: 'arrange-flowers',
    kind: 'activity',
    title: 'Arrange some flowers',
    bring: 'Fresh flowers and a vase.',
    steps: [
      { heading: 'The idea', body: 'A small bunch of flowers gives you something simple to trim and arrange together. Try the vase in a few spots, and take a photo if it is a gift.' },
    ],
  },
  {
    id: 'small-task',
    kind: 'activity',
    title: 'A small task, together',
    steps: [
      { heading: 'The idea', body: 'Setting the table, prepping vegetables, sorting mail, or organizing a drawer can be an ordinary part of the visit. Split the real work, then have coffee or move on when it is done.' },
    ],
  },
  {
    id: 'fix-something',
    kind: 'activity',
    title: 'Fix or tinker with something',
    bring: 'Something small that needs mending.',
    steps: [
      { heading: 'The idea', body: 'A loose button, sticking drawer, or small item that needs glue gives you a real problem to solve together. Trade ideas, and set it aside if it needs a specialized tool.' },
    ],
  },
  {
    id: 'wrap-gift',
    kind: 'activity',
    title: 'Wrap a gift or prep a card',
    bring: 'A gift or card and wrapping supplies.',
    steps: [
      { heading: 'The idea', body: 'A real gift or card for someone you both know gives the project a purpose. One person can measure and hold the paper while the other cuts and tapes; a gift bag works too.' },
    ],
  },

  // --- Out & about / body --------------------------------------------------
  {
    id: 'walk',
    kind: 'activity',
    title: 'Take a walk together',
    steps: [
      { heading: 'Choose an easy route', body: 'Take a familiar loop with places to rest and follow their pace. Share whatever catches your eye and let the conversation come and go.' },
      { heading: 'If they start talking', body: 'Slow down while the story unfolds. There is no need to keep moving toward a destination while something important is being said.' },
      { heading: 'If they tire or become unsteady', body: 'A change in pace, breathing, or balance means it is time to sit or turn back. Ending early is always fine.' },
    ],
  },
  {
    id: 'sit-outside',
    kind: 'activity',
    title: 'Sit outside together',
    steps: [
      { heading: 'The idea', body: 'A shaded porch, bench, or bright window gives you a comfortable place to sit together. The weather, a neighbor, or a piece of your day may be plenty to talk about.' },
    ],
  },
  {
    id: 'dance',
    kind: 'activity',
    title: 'Dance to a favorite song',
    bring: 'A song they have always loved.',
    steps: [
      { heading: 'Put on a song you both like', body: 'Ask them to dance, or start moving where you are and see if they join in. Keep enough space around you to move safely.' },
      { heading: 'Follow the mood of the song', body: 'It can be a real dance, a few steps by the chair, or singing along. Match their pace instead of turning it into exercise.' },
      { heading: 'If either of you feels unsteady', body: 'Sit down or hold a stable surface and keep the song on. Do not push through dizziness, pain, or poor balance.' },
    ],
  },
  {
    id: 'stretch',
    kind: 'activity',
    title: 'Gentle stretches together',
    steps: [
      { heading: 'The idea', body: 'A few familiar shoulder rolls, ankle circles, or stretches can loosen you both up while you talk. Each of you chooses what feels comfortable.' },
      { heading: 'If anything hurts or feels wrong', body: 'Pain is the cue to stop that movement. Try another stretch or call it there for today.' },
    ],
  },
  {
    id: 'birds',
    kind: 'activity',
    title: 'Watch the birds',
    bring: 'A window with a view, or some birdseed.',
    steps: [
      { heading: 'The idea', body: 'A window or feeder gives you a place to compare what you notice about the birds. If it is quiet, the garden, weather, or a short walk may take the conversation somewhere else.' },
    ],
  },
  {
    id: 'drive',
    kind: 'activity',
    title: 'A short drive somewhere',
    steps: [
      { heading: 'Take one familiar route', body: 'An old house, neighborhood, or favorite view gives the drive a simple shape. Agreeing on the route beforehand keeps it easy.' },
      { heading: 'If a place starts a story', body: 'Slow down or pull over somewhere safe so you can listen. Ask what used to be there or who they visited nearby.' },
      { heading: 'If the route starts to feel unfamiliar', body: 'Say where you are and where you are going: “We’re on Oak Street, heading home.” Take the most familiar route back.' },
    ],
  },

  // --- Music & media -------------------------------------------------------
  {
    id: 'music',
    kind: 'activity',
    title: 'Listen to music together',
    bring: 'A playlist of their favorites.',
    steps: [
      { heading: 'The idea', body: 'A favorite song deserves your attention for a while. If it brings a person or story to mind, the music can pause while you follow the conversation.' },
    ],
  },
  {
    id: 'sing',
    kind: 'activity',
    title: 'Sing along to old favorites',
    bring: 'Song lyrics or a playlist of standards.',
    steps: [
      { heading: 'The idea', body: 'A song you both know makes it easy to join in on the chorus. Trading verses, humming, or stopping to talk about the singer works just as well.' },
    ],
  },
  {
    id: 'watch-show',
    kind: 'activity',
    title: 'Watch a favorite show',
    bring: 'A beloved show or film, ready to play.',
    steps: [
      { heading: 'The idea', body: 'A favorite episode or scene gives you something to enjoy together without needing to fill the time. If it sparks a story, the show can pause while you follow it.' },
      { heading: 'If the show is not holding attention', body: 'A favorite episode, shorter clip, or something with less going on may fit better. Turning it off is also fine.' },
    ],
  },
  {
    id: 'home-videos',
    kind: 'activity',
    title: 'Watch old home videos',
    bring: 'Old home videos on a phone or TV.',
    steps: [
      { heading: 'The idea', body: 'One short family clip is plenty: “Here’s Dad at the lake.” If it sparks a story, pause the video and listen.' },
      { heading: 'If you remember it differently', body: 'Different versions can sit side by side without settling who is right. The disagreement may be more entertaining than the video.' },
    ],
  },
  {
    id: 'faith-music',
    kind: 'activity',
    title: 'Faith music together',
    bring: 'Hymns or faith music they love.',
    steps: [
      { heading: 'The idea', body: 'If faith music is part of their life, a hymn or gospel song they love gives you something to sing or listen to together. It may bring a person, church, or occasion to mind.' },
      { heading: 'If they are not in the mood for it', body: 'You can ask what they would rather hear or turn it off. Faith music should always be their choice.' },
    ],
  },
  {
    id: 'magazine',
    kind: 'activity',
    title: 'Flip through a magazine',
    bring: 'A magazine about something they love.',
    steps: [
      { heading: 'The idea', body: 'A magazine about gardening, cooking, cars, sports, or another real interest gives you plenty to react to. Trade opinions about whatever catches either of you.' },
    ],
  },

  // --- Photos & keepsakes --------------------------------------------------
  {
    id: 'photos',
    kind: 'activity',
    title: 'Look through photos together',
    bring: 'A photo album or a box of prints.',
    steps: [
      { heading: 'The idea', body: 'One clear photo is enough to begin: “This was the lake trip with Dad.” Stay with any photo that starts a good story.' },
      { heading: 'If neither of you knows a name', body: 'Talk about what you can see instead: the place, clothes, or what was happening. You can ask another family member later.' },
    ],
  },
  {
    id: 'keepsakes',
    kind: 'activity',
    title: 'Go through keepsakes',
    bring: 'A box of old mementos and trinkets.',
    steps: [
      { heading: 'The idea', body: 'One keepsake can open a conversation about how it came into the family or why someone held onto it. If it is not interesting today, try another object.' },
    ],
  },
  {
    id: 'read-letters',
    kind: 'activity',
    title: 'Read old letters together',
    bring: 'Old letters, cards, or notes.',
    steps: [
      { heading: 'The idea', body: 'One short letter gives you enough to read aloud or trade paragraphs. Pause wherever either of you wants to talk.' },
      { heading: 'If the letter feels too personal', body: 'Stop reading and ask whether they want to continue. Old letters can be private even when family kept them.' },
    ],
  },
  {
    id: 'map',
    kind: 'activity',
    title: 'Reminisce over a map',
    bring: 'A map, atlas, or globe.',
    steps: [
      { heading: 'The idea', body: 'A town either of you lived in or visited gives you a place to compare routes and landmarks. A street view, old photo, or future drive may be even more fun than the map.' },
    ],
  },

  // --- Legacy & looking forward --------------------------------------------
  {
    id: 'record-story',
    kind: 'activity',
    title: 'Record them telling a story',
    bring: 'Your phone, to record.',
    steps: [
      { heading: 'Ask before you record', body: 'One story and a direct question keeps consent clear: “Would it be okay if I recorded you telling me about your wedding?” Recording starts only if they agree.' },
      { heading: 'If the story starts flowing', body: 'The phone sits nearby while your attention stays with them. A natural pause is the right time for one follow-up.' },
      { heading: 'If recording changes the conversation', body: 'Stop recording and keep talking normally. Their no is the end of the decision.' },
    ],
  },
  {
    id: 'teach-skill',
    kind: 'activity',
    title: 'Have them teach you',
    steps: [
      { heading: 'The idea', body: 'A recipe, card trick, knot, or household skill they know well gives them something real to show you. Follow their method and look it up together if you both get stuck.' },
    ],
  },
  {
    id: 'life-timeline',
    kind: 'activity',
    title: 'Build a life timeline',
    bring: 'A sheet of paper and a pen.',
    steps: [
      { heading: 'The idea', body: 'One event you know gives the timeline a starting point: “You moved to Chicago after school. What came next?” Add only the details that help connect the stories.' },
      { heading: 'If talking is better than writing', body: 'Put the pen down and follow the conversation. You can add notes afterward, with their permission, if the page still feels useful.' },
    ],
  },
  {
    id: 'plan-outing',
    kind: 'talk',
    title: 'Plan something to look forward to',
    steps: [
      { heading: 'Offer one realistic outing', body: 'Suggest a drive, meal, garden, or family visit: “Would you like to see the leaves next Saturday?”' },
      { heading: 'Make the plan together', body: 'Choose the place, time, transportation, and who else to invite. Put it on the calendar before the idea gets lost.' },
      { heading: 'Check the practical details', body: 'Talk through the drive, cost, weather, walking, and restroom access. Change the plan if one of those makes the outing less appealing.' },
    ],
  },
  {
    id: 'catch-up',
    kind: 'talk',
    title: 'Catch up, both ways',
    steps: [
      { heading: 'Share one update first', body: 'One short story from your week gives them an easy topic to respond to, without the broad pressure of “What’s new?”' },
      { heading: 'Make room for their news', body: 'Ask one follow-up about the person or event they mention, then share something related from your own life.' },
      { heading: 'If the conversation stalls', body: 'Share another small piece of your own news or ask about something specific: “Has Mary been by this week?” Catching up should go both ways.' },
    ],
  },
  {
    id: 'write-letters',
    kind: 'activity',
    title: 'Write cards to family',
    bring: 'Cards or paper and pens.',
    steps: [
      { heading: 'The idea', body: 'A birthday note, thank-you, or simple hello to someone you both know gives you a real reason to write. Trade the pen, keep the wording natural, and add one real question.' },
    ],
  },
  {
    id: 'grateful',
    kind: 'talk',
    title: 'Share what you are grateful for',
    steps: [
      { heading: 'Share something specific', body: 'Tell them one thing you appreciate about them: “I still make your soup whenever someone is sick.” Keep it honest and concrete.' },
      { heading: 'Trade everyday favorites', body: 'Talk about something good from the week, a person you were glad to see, or a small thing you are looking forward to.' },
      { heading: 'Do not force a positive answer', body: 'If they are having a hard day, listen to that instead. Gratitude is an invitation, not a way to talk someone out of how they feel.' },
    ],
  },

  // --- Ask & listen (conversation guides from the story bank) ---------------
  {
    id: 'q-house',
    kind: 'talk',
    title: 'The house they grew up in',
    steps: [
      { heading: 'Ask about the house', body: '“What was the house you grew up in like?” Start wherever they do: the neighborhood, a room, or the people who lived there.' },
      { heading: 'Pick one follow-up', body: '“Who was usually in that room?” “What do you remember about it?” “Where did everyone spend time together?”' },
      { heading: 'Stay with their answer', body: 'A simple reaction works: “Seven people in one kitchen sounds crowded.” Comparing it with the home you knew keeps the conversation two-way.' },
    ],
  },
  {
    id: 'q-after-school',
    kind: 'talk',
    title: 'What has their attention lately',
    steps: [
      { heading: 'Ask what they have been following', body: '“What have you been watching, reading, or paying attention to lately?” A show, team, book, or neighborhood story all count.' },
      { heading: 'Pick one follow-up', body: '“What do you like about it?” “Who do you talk about it with?” “What should I know before I try it?”' },
      { heading: 'Stay with their answer', body: 'Offer your actual view: “I have not seen that one, but now I am curious.” Share something you have been following too so either person can lead.' },
    ],
  },
  {
    id: 'q-siblings',
    kind: 'talk',
    title: 'Brothers and sisters',
    steps: [
      { heading: 'Ask about their place in the family', body: '“Were you the oldest, the youngest, or in the middle?” Then ask what that was like in their family.' },
      { heading: 'Pick one follow-up', body: '“What was Jack like?” “What did you do together?” “Which one of you usually got into trouble?”' },
      { heading: 'Stay with their answer', body: 'Reflect back what you heard: “So Jack was the one who talked you into it.” Add a story about a sibling or cousin they know.' },
    ],
  },
  {
    id: 'q-weekends',
    kind: 'talk',
    title: 'A good weekend now',
    steps: [
      { heading: 'Ask what sounds good now', body: '“If you could plan next weekend, what would you want to do?” Staying in, seeing someone, watching a game, or going out are all real answers.' },
      { heading: 'Pick one follow-up', body: '“Who would you want there?” “What would we eat?” “Would you rather go out or stay home?”' },
      { heading: 'Stay with their answer', body: 'Compare it with your own choice: “I would vote for staying in too, but I want takeout.” If the idea is workable, make one specific plan together.' },
    ],
  },
  {
    id: 'q-first-job',
    kind: 'talk',
    title: 'Their first job',
    steps: [
      { heading: 'Ask about their first job', body: '“What was your first job?” The pay, coworkers, uniform, or commute are often more interesting than the job title.' },
      { heading: 'Pick one follow-up', body: '“What did you do during a typical day?” “Who did you work with?” “What did you do with your first paycheck?”' },
      { heading: 'Stay with their answer', body: 'A surprising detail gives you the response: “You gave your whole first paycheck to your mother?” Sharing what you did with yours keeps it reciprocal.' },
    ],
  },
  {
    id: 'q-friends-fun',
    kind: 'talk',
    title: 'Fun with friends',
    steps: [
      { heading: 'Ask what they did for fun', body: '“What did you and your friends do for fun?” If they need a specific time, ask about high school or their twenties.' },
      { heading: 'Pick one follow-up', body: '“Who usually came along?” “Where was your favorite place to go?” “What music was playing?”' },
      { heading: 'Stay with their answer', body: 'What genuinely stands out gives you the response: “You drove all that way just to dance?” Your idea of a good night makes a fun comparison.' },
    ],
  },
  {
    id: 'q-first-car',
    kind: 'talk',
    title: 'What is changing nearby',
    steps: [
      { heading: 'Ask for their take', body: '“What has changed around here lately, for better or worse?” A new store, construction, traffic, or a neighborhood change gives them something current to weigh in on.' },
      { heading: 'Pick one follow-up', body: '“What was there before?” “Do you think it is an improvement?” “What would you change if you could?”' },
      { heading: 'Stay with their answer', body: 'Give your opinion too: “I like the new park, but the traffic is worse.” Agreement is optional; this is a real exchange about a shared place.' },
    ],
  },
  {
    id: 'q-trouble',
    kind: 'talk',
    title: 'A bit of trouble',
    steps: [
      { heading: 'Ask about a time they broke the rules', body: '“Did you ever get into trouble when you were young?” Your own harmless story helps show that this is meant to be fun.' },
      { heading: 'Pick one follow-up', body: '“Who was with you?” “Did you get caught?” “Would you do it again?”' },
      { heading: 'Stay with their answer', body: 'A laugh fits here: “I can’t believe you got away with that.” One of your own harmless stories often brings out another.' },
    ],
  },
  {
    id: 'q-how-met',
    kind: 'talk',
    title: 'How they met their partner',
    steps: [
      { heading: 'Ask for the beginning', body: '“How did you two first meet?” Let them decide whether the story begins with the place, the person, or their first impression.' },
      { heading: 'Pick one follow-up', body: '“What did you first notice about them?” “Who asked who out?” “Where did you go on your first date?”' },
      { heading: 'Stay with their answer', body: 'One detail makes a natural response: “So you noticed the red coat before you noticed her?” If the relationship was painful, they decide how far to take it.' },
    ],
  },
  {
    id: 'q-children',
    kind: 'talk',
    title: 'Their children',
    steps: [
      { heading: 'Ask about one child at a time', body: 'A name keeps the question specific: “What was Lisa like when she was little?” One person usually leads to a better story than everyone at once.' },
      { heading: 'Pick one follow-up', body: '“What always made her laugh?” “What was she stubborn about?” “What did the two of you do together?”' },
      { heading: 'Stay with their answer', body: 'Add what you know: “That sounds exactly like Lisa.” Share a recent example of the same trait if it fits.' },
    ],
  },
  {
    id: 'q-most-like',
    kind: 'talk',
    title: 'Who they take after',
    steps: [
      { heading: 'Ask who they take after', body: '“Who in the family are you most like?” Personality, looks, habits, or something else entirely all count.' },
      { heading: 'Pick one follow-up', body: '“What were they like?” “How are you alike?” “Did anyone else say you were alike?”' },
      { heading: 'Stay with their answer', body: 'Add your view: “I see that same stubborn streak in both of you.” A little disagreement makes this question more interesting.' },
    ],
  },
  {
    id: 'q-tradition',
    kind: 'talk',
    title: 'A tradition they kept',
    steps: [
      { heading: 'Ask about a family tradition', body: '“What did your family always do on birthdays or holidays?” A Sunday meal or another regular routine counts too.' },
      { heading: 'Pick one follow-up', body: '“Who was always there?” “How did it get started?” “Does anyone still do it?”' },
      { heading: 'Stay with their answer', body: 'Connect it to today: “We still use that recipe every Christmas.” Talk about which traditions the family kept, changed, or dropped.' },
    ],
  },
  {
    id: 'q-work',
    kind: 'talk',
    title: 'The work they did',
    steps: [
      { heading: 'Ask about the work they did', body: '“What kind of work did you do for most of your life?” Paid work, running a home, farming, raising a family, and volunteering all count.' },
      { heading: 'Pick one follow-up', body: '“What did you do during a typical day?” “What was the hardest part to learn?” “Who did you work with?”' },
      { heading: 'Stay with their answer', body: 'Something you genuinely did not know makes a good response: “You had to do all of that by hand?” The way the work is done now offers a comparison.' },
    ],
  },
  {
    id: 'q-good-at',
    kind: 'talk',
    title: 'What they were great at',
    steps: [
      { heading: 'Ask what they did well', body: '“What did people say you were good at?” It could be a skill, a recipe, fixing things, or helping people.' },
      { heading: 'Pick one follow-up', body: '“Who taught you?” “What was the secret to doing it well?” “Did people ask you for help with it?”' },
      { heading: 'Stay with their answer', body: 'Repeating the tip shows you followed: “So the trick was never rushing that first step?” One piece of advice you can actually use makes a good follow-up.' },
    ],
  },
  {
    id: 'q-built',
    kind: 'talk',
    title: 'Something they built',
    steps: [
      { heading: 'Ask about something they made', body: '“What is something you made that you were proud of?” It could be something they built, sewed, cooked, or grew.' },
      { heading: 'Pick one follow-up', body: '“What was the hardest part?” “What part were you most proud of?” “Is it still around?”' },
      { heading: 'Stay with their answer', body: 'The work involved is worth noticing: “You fitted every one of those pieces yourself?” What they would change next time is a useful follow-up.' },
    ],
  },
  {
    id: 'q-hardest-job',
    kind: 'talk',
    title: 'Their hardest job',
    steps: [
      { heading: 'Ask about their hardest job', body: 'When the mood has room for it, ask, “What was the hardest job you ever had?”' },
      { heading: 'Pick one follow-up', body: 'One question is plenty here: “What made it so hard?” “Who helped you through it?” “What kept you going?”' },
      { heading: 'Stay with their answer', body: 'A plain response is all this needs: “That sounds exhausting.” If it becomes painful, offer to leave it there without searching for a positive ending.' },
    ],
  },
  {
    id: 'q-meal',
    kind: 'talk',
    title: 'A meal they loved',
    steps: [
      { heading: 'Ask for an everyday favorite', body: '“What meal could you eat any day of the week?” An ordinary favorite is easier than choosing the best meal of their life.' },
      { heading: 'Pick one follow-up', body: '“Who made it best?” “How did they make it?” “When did your family usually eat it?”' },
      { heading: 'Stay with their answer', body: 'Your real reaction is enough: “Now I want to try it your way.” Comparing favorites or planning to cook it together keeps the topic going.' },
    ],
  },
  {
    id: 'q-music-loves',
    kind: 'talk',
    title: 'Music that moves them',
    steps: [
      { heading: 'Ask what they want to hear', body: '“What song or singer do you never get tired of?” Keep your phone ready so you can listen together.' },
      { heading: 'Pick one follow-up', body: '“When did you first hear this song?” “Did you dance to it?” “Who else loved it?”' },
      { heading: 'Stay with their answer', body: 'Your opinion belongs here too: “I love that trumpet part.” Another song by the same artist or one of your favorites fits next.' },
    ],
  },
  {
    id: 'q-travel',
    kind: 'talk',
    title: 'A favorite place they visited',
    steps: [
      { heading: 'Ask about a place they loved', body: '“Where was your favorite place to visit?” It could be a vacation spot, a day trip, or somewhere they once lived.' },
      { heading: 'Pick one follow-up', body: '“Who did you go with?” “What was your favorite part?” “Would you go back?”' },
      { heading: 'Stay with their answer', body: 'An honest reaction works: “The view sounds worth it, but that drive sounds miserable.” A trip you took together offers a comparison.' },
    ],
  },
  {
    id: 'q-relax',
    kind: 'talk',
    title: 'How they unwound',
    steps: [
      { heading: 'Ask how they relaxed', body: '“What did you do to relax after a long day?” They might name music, a hobby, time with someone, or time alone.' },
      { heading: 'Pick one follow-up', body: '“Did you do that alone or with someone?” “What did you like about it?” “Do you still enjoy it now?”' },
      { heading: 'Stay with their answer', body: 'Their answer may fit the visit: “Let’s make that tea now.” What helps you unwind keeps the conversation mutual.' },
    ],
  },
  {
    id: 'q-wish-known',
    kind: 'talk',
    title: 'Something they wish they knew',
    steps: [
      { heading: 'Ask what they wish they had known', body: '“What do you wish you had known when you were younger?” Give them time to think before adding another question.' },
      { heading: 'Pick one follow-up', body: '“When did you learn that?” “Would you have listened back then?” “Did you ever give that advice to someone else?”' },
      { heading: 'Stay with their answer', body: 'The story behind the advice is worth asking about: “When did you figure that out for yourself?” Your own take belongs here too.' },
    ],
  },
  {
    id: 'q-good-life',
    kind: 'talk',
    title: 'What makes a good life',
    steps: [
      { heading: 'Ask what makes a good life', body: '“What do you think makes life good?” Give them time; this question does not need a quick answer.' },
      { heading: 'Pick one follow-up', body: '“Has your answer changed over the years?” “Who taught you that?” “What matters most to you now?”' },
      { heading: 'Stay with their answer', body: 'Putting it in your own words checks that you understood: “For you, family mattered more than success.” There is room to agree or see it differently.' },
    ],
  },
  {
    id: 'q-younger-self',
    kind: 'talk',
    title: 'Advice to their younger self',
    steps: [
      { heading: 'Ask what they would tell their younger self', body: '“If you could tell your younger self one thing, what would it be?” An age or time in their life makes the question more specific.' },
      { heading: 'Pick one follow-up', body: '“What was going on in your life then?” “Do you think you would have listened?” “What were you already doing right?”' },
      { heading: 'Stay with their answer', body: 'A serious answer only needs to be heard: “You wish you had trusted yourself sooner.” Regret does not have to become a positive lesson.' },
    ],
  },
  {
    id: 'q-changed',
    kind: 'talk',
    title: 'How the world has changed',
    steps: [
      { heading: 'Ask what change stands out', body: '“What feels most different now from when you were young?” They can talk about technology, family, work, or daily life.' },
      { heading: 'Pick one follow-up', body: '“How did people do it before?” “Was the change mostly better or worse?” “What do you miss?”' },
      { heading: 'Stay with their answer', body: 'Your different experience gives you a response: “I never had to do it that way. What was it like?” Comparing which changes each of you welcomes keeps it two-way.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// ADAPTIVE ORDERING
//
// The deck should feel fresh each visit AND lean toward what has landed well.
// We do this in two places:
//   1. At the start of a visit, `orderVisitDeck` does a weighted shuffle:
//      cards with a positive history float toward the top, hard ones sink, and
//      randomness keeps the order from repeating.
//   2. Mid-visit, after each reaction, `rerankUpcoming` re-sorts the cards the
//      caregiver hasn't seen yet — nudging toward the kind of thing that's
//      landing right now, and away from what just fell flat.
// ---------------------------------------------------------------------------

/** Net-preference weight for a card from its lifetime reaction tally. */
function historyWeight(stat?: VisitCardStat): number {
  const net = stat ? stat.pos - stat.neg : 0;
  // Base 1 for an unseen card; each net "like" boosts, each net "miss" trims.
  // Floored so a disliked card can still occasionally surface.
  return Math.max(0.15, 1 + net * 0.6);
}

/**
 * Efraimidis–Spirakis weighted sampling key. Higher weight → tends to sort
 * earlier, but every card keeps a random chance, so the order varies.
 */
function shuffleKey(weight: number): number {
  return Math.random() ** (1 / weight);
}

/**
 * Would placing `card` next extend an unwanted run? We cap two things so a
 * visit never feels monotonous: no 3rd consecutive card of the same kind, and
 * no 3rd consecutive single-step "idea" card (relevant to light support, where
 * the lean one-liners can otherwise pile up).
 */
function extendsRun(placed: VisitDeckCard[], card: VisitDeckCard): boolean {
  const RUN = 2; // block the 3rd in a row
  const kindTail = placed.slice(-RUN);
  if (kindTail.length === RUN && kindTail.every((c) => c.kind === card.kind)) {
    return true;
  }
  if (card.steps.length === 1) {
    const stepTail = placed.slice(-RUN);
    if (stepTail.length === RUN && stepTail.every((c) => c.steps.length === 1)) {
      return true;
    }
  }
  return false;
}

/**
 * Smooth an already weight-sorted order so it never runs 3+ of the same kind or
 * 3+ single-step cards back-to-back. Greedy and stable: we always take the
 * highest-priority card that doesn't start a run, so the weighting/adaptive lean
 * is preserved — a card only gets nudged past when it would cluster. `seed` is
 * prior context (already-shown cards) used only for run-checking, not emitted.
 */
function declusterOrder(
  ordered: VisitDeckCard[],
  seed: VisitDeckCard[] = []
): VisitDeckCard[] {
  const pool = [...ordered];
  const history = [...seed];
  const result: VisitDeckCard[] = [];
  while (pool.length) {
    let idx = pool.findIndex((card) => !extendsRun(history, card));
    if (idx === -1) idx = 0; // nothing qualifies; keep top priority
    const [card] = pool.splice(idx, 1);
    result.push(card);
    history.push(card);
  }
  return result;
}

export function orderVisitDeck(
  deck: VisitDeckCard[],
  reactions: Record<string, VisitCardStat>,
  planned: string[] = []
): VisitDeckCard[] {
  const plannedSet = new Set(planned);
  const shuffled = [...deck]
    .map((card) => {
      const weight =
        historyWeight(reactions[card.id]) + (plannedSet.has(card.id) ? 50 : 0);
      return { card, key: shuffleKey(weight) };
    })
    .sort((a, b) => b.key - a.key)
    .map((x) => x.card);
  return declusterOrder(shuffled);
}

/**
 * Re-rank the not-yet-seen cards (everything after `seenThroughIndex`) based on
 * lifetime history plus a live, this-visit read of which KIND is landing.
 * `kindScore` is a running tally per kind: +1 for a positive reaction, -1 for a
 * hard one. Cards already shown stay put so the flow behind the caregiver never
 * changes.
 */
export function rerankUpcoming(
  order: VisitDeckCard[],
  seenThroughIndex: number,
  reactions: Record<string, VisitCardStat>,
  kindScore: Record<string, number>
): VisitDeckCard[] {
  const head = order.slice(0, seenThroughIndex + 1);
  const tail = order.slice(seenThroughIndex + 1);
  const reranked = tail
    .map((card) => {
      const live = kindScore[card.kind] ?? 0;
      // Blend lifetime history with the live kind signal.
      const weight = historyWeight(reactions[card.id]) + live * 0.8;
      return { card, key: shuffleKey(weight) };
    })
    .sort((a, b) => b.key - a.key)
    .map((x) => x.card);
  return [...head, ...declusterOrder(reranked, head)];
}
