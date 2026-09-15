import { characters, type Character } from "@/data/characters";

/**
 * "Which anime character are you?" — without inventing the answer.
 *
 * The usual version of this quiz is a lookup table someone wrote in an
 * afternoon: pick four answers, get told you are Goku. It tells you nothing,
 * it is the same for everyone who taps the same buttons, and there is no way
 * to check it.
 *
 * This one scores against real data. src/data/characters.ts carries a
 * `personality` array for all 42 characters, written by the editorial desk
 * alongside their biographies — "Loyal", "Blunt", "Analytical", "Reckless".
 * Every answer below is tagged with traits taken from THAT vocabulary, and
 * the result is whichever character shares the most of them.
 *
 * So the result card can show its working: not "you are Levi" but "you match
 * Levi on Precise, Blunt and Loyal — 3 of the 6 traits you picked". That is
 * checkable against the character's own page, and it is the difference
 * between a quiz worth sharing and a random number generator.
 *
 * The constraint that keeps it honest: every trait named here must exist in
 * characters.ts. check-engagement.mjs fails the build if one does not, so a
 * trait invented for a nice-sounding answer cannot ship.
 */

export interface QuizOption {
  id: string;
  label: string;
  /** Traits from the characters.ts vocabulary. Never invented here. */
  traits: string[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
}

export const QUIZ: QuizQuestion[] = [
  {
    id: "conflict",
    prompt: "A fight you cannot avoid is starting. What happens first?",
    options: [
      { id: "charge", label: "You are already moving", traits: ["Reckless", "Fearless", "Loud"] },
      {
        id: "read",
        label: "You read the room and find the opening",
        traits: ["Analytical", "Tactical", "Precise"],
      },
      {
        id: "shield",
        label: "You put yourself between it and someone else",
        traits: ["Protective", "Loyal", "Devoted"],
      },
      {
        id: "wait",
        label: "You wait. Most fights end themselves",
        traits: ["Patient", "Composed", "Detached"],
      },
    ],
  },
  {
    id: "people",
    prompt: "Someone you barely know is having the worst day of their life.",
    options: [
      {
        id: "sit",
        label: "You sit with them and say very little",
        traits: ["Quiet", "Gentle", "Empathetic"],
      },
      {
        id: "fix",
        label: "You start solving it whether they asked or not",
        traits: ["Stubborn", "Determined", "Kind"],
      },
      {
        id: "blunt",
        label: "You tell them the truth they are avoiding",
        traits: ["Blunt", "Sharp", "Righteous"],
      },
      {
        id: "lift",
        label: "You make them laugh until it is bearable",
        traits: ["Playful", "Bright", "Cheerful"],
      },
    ],
  },
  {
    id: "work",
    prompt: "How do you actually get good at something?",
    options: [
      {
        id: "grind",
        label: "Repetition. Thousands of hours of it",
        traits: ["Disciplined", "Relentless", "Focused"],
      },
      {
        id: "study",
        label: "Take it apart until you understand every piece",
        traits: ["Curious", "Rigorous", "Brilliant"],
      },
      {
        id: "spar",
        label: "Throw yourself at people better than you",
        traits: ["Combat-obsessed", "Proud", "Never satisfied"],
      },
      {
        id: "natural",
        label: "Honestly? It comes easier to you than to most",
        traits: ["Confident", "Instinctive", "Quick"],
      },
    ],
  },
  {
    id: "authority",
    prompt: "The people in charge are wrong, and you can prove it.",
    options: [
      {
        id: "say",
        label: "You say so, out loud, to their face",
        traits: ["Loud", "Righteous", "Stubbornly moral"],
      },
      {
        id: "plan",
        label: "You say nothing and start building the alternative",
        traits: ["Political", "Long-view schemer", "Pragmatic"],
      },
      {
        id: "leave",
        label: "You stop caring what they think and go your own way",
        traits: ["Free", "Aloof", "Selfish"],
      },
      {
        id: "obey",
        label: "You follow orders. The system holds for a reason",
        traits: ["Disciplined", "Steady", "Stoic"],
      },
    ],
  },
  {
    id: "loss",
    prompt: "You lost someone. A year later, what does that look like?",
    options: [
      {
        id: "carry",
        label: "You carry it quietly and let almost no one see",
        traits: ["Grieving quietly", "Reserved", "Haunted"],
      },
      {
        id: "burn",
        label: "It turned into something sharper than grief",
        traits: ["Furious", "Bitter", "Ruthless"],
      },
      {
        id: "honour",
        label: "You live in a way they would recognise",
        traits: ["Devoted", "Warm", "Anchored"],
      },
      {
        id: "forward",
        label: "You keep moving. Stopping is what hurts",
        traits: ["Determined", "Relentless", "Adaptive"],
      },
    ],
  },
  {
    id: "self",
    prompt: "What do people get wrong about you?",
    options: [
      {
        id: "underrated",
        label: "They count you out early",
        traits: ["Underestimated", "Terrible at self-promotion", "Naive"],
      },
      {
        id: "cold",
        label: "They read you as cold when you are just quiet",
        traits: ["Cold", "Reserved", "Loyal (privately)"],
      },
      {
        id: "joke",
        label: "They think the joking means you are not serious",
        traits: ["Sarcastic", "Playful", "Insecure under the noise"],
      },
      {
        id: "scary",
        label: "They are a little afraid of how far you will go",
        traits: ["Obsessive", "Terrifyingly focused", "Prideful"],
      },
    ],
  },
];

/** Every trait the quiz can award, for the guard that checks they are real. */
export const QUIZ_TRAITS: string[] = [
  ...new Set(QUIZ.flatMap((q) => q.options.flatMap((o) => o.traits))),
];

export interface QuizResult {
  character: Character;
  /** The traits this character actually shares with the answers given. */
  matched: string[];
  /** How many traits this character carries in total, so the share is checkable. */
  outOf: number;
  /** Runners-up, so a close call does not read as a verdict. */
  alternatives: { character: Character; matched: number }[];
}

/** The traits behind a set of answers, in question order and de-duplicated. */
export function traitsForAnswers(answers: Record<string, string>): string[] {
  const out: string[] = [];
  for (const question of QUIZ) {
    const chosen = question.options.find((o) => o.id === answers[question.id]);
    if (!chosen) continue;
    for (const trait of chosen.traits) if (!out.includes(trait)) out.push(trait);
  }
  return out;
}

/**
 * The closest character, or null when the answers support no one.
 *
 * Returning null matters. With a partial set of answers, or a combination no
 * character shares a single trait with, the honest output is "no match yet"
 * — not the alphabetically first character with a score of zero.
 */
export function scoreQuiz(answers: Record<string, string>): QuizResult | null {
  const traits = traitsForAnswers(answers);
  if (!traits.length) return null;

  const scored = characters
    .map((character) => ({
      character,
      matched: traits.filter((trait) => character.personality.includes(trait)),
    }))
    // Most matches first; ties broken by name so the same answers always give
    // the same result rather than depending on array order.
    // Most matches first. Ties go to the character with the SHORTER trait
    // list: matching 3 of someone's 4 traits is a closer read than matching 3
    // of 9, and without this a character with a long personality array wins
    // by having more chances rather than by fitting better. Name last, so the
    // same answers always give the same result instead of depending on the
    // order of the array.
    .sort(
      (a, b) =>
        b.matched.length - a.matched.length ||
        a.character.personality.length - b.character.personality.length ||
        a.character.name.localeCompare(b.character.name),
    );

  const best = scored[0];
  if (!best || best.matched.length === 0) return null;

  return {
    character: best.character,
    matched: best.matched,
    outOf: best.character.personality.length,
    alternatives: scored
      .slice(1, 4)
      .filter((row) => row.matched.length > 0)
      .map((row) => ({ character: row.character, matched: row.matched.length })),
  };
}

/** Share text that states the basis rather than a bare claim. */
export function quizShareText(result: QuizResult): string {
  // The denominator is the CHARACTER's trait count, not the reader's. "3 of
  // Levi's 5 traits" is a claim anyone can check on his page; "3 of 16" is a
  // ratio against a number no character has, which reads as a weak match and
  // means nothing.
  return `I matched ${result.character.name} on ${result.matched.slice(0, 3).join(", ")} — ${result.matched.length} of their ${result.outOf} traits.`;
}
