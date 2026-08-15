export type Episode = {
  animeSlug: string;
  number: number;
  title: string;
  arc: string;
  airDate: string;
  runtime: string;
  synopsis: string;
  recap: string[]; // paragraphs — original editorial, no copyrighted dialogue
  majorEvents: string[];
  characterDevelopment: { character: string; note: string }[];
  themes: string[];
  bestMoments: string[];
  trivia: string[];
  answered: string[];
  remaining: string[];
  connectionsPrev: string[];
  connectionsNext: string[];
  related: { slug: string; kind: "character" | "anime" | "article"; label: string }[];
};

export const episodes: Episode[] = [
  {
    animeSlug: "naruto",
    number: 1,
    title: "Enter: Naruto Uzumaki",
    arc: "Prologue",
    airDate: "2002-10-03",
    runtime: "23 min",
    synopsis:
      "A prank-obsessed orphan finally graduates from ninja school after his teacher risks his life to protect him — and the show's entire twenty-year emotional thesis clicks into place in a single conversation on a swing set.",
    recap: [
      "The premiere opens on a village still bruised by a disaster no one is allowed to name. Konoha has scars — literal ones, carved into the Hokage monument, and figurative ones, in the way adults look away whenever a specific blond twelve-year-old walks past. That boy is Naruto Uzumaki, and the episode's first job is not to make us like him but to make us understand him.",
      "Naruto fails the graduation exam for the third time. He fails it loudly, defiantly, and — the show quietly reveals — because the technique he's asked to perform is the one thing his sealed tenant makes impossible. The universe has stacked the deck against a child, and the child has responded by turning every classroom into a stage. It's easier to be hated for what you did than for what you are.",
      "The middle of the episode is a betrayal. Mizuki, one of the academy instructors, pretends to offer Naruto a second chance. Steal a forbidden scroll, learn one technique from it, and the village will accept you. It's the oldest trick in the shinobi playbook, and Naruto walks into it because he desperately wants to belong. The forest sequence that follows is the first time the show trusts us to sit inside its silence — the trees, the moonlight, the boy hunched over a scroll he cannot fully read.",
      "The scene most fans remember is the swing. Not the fight, not the transformation, not even the reveal of the Nine-Tails. The swing, where Iruka finds Naruto alone before the exam, sees through the mask, and treats him for the first time as a person instead of a problem. That moment is the whole show. Twenty years of arcs, tournaments, wars, and reincarnations flow out of the fact that one adult chose, one time, to look a lonely child in the eye.",
      "The climax gives us the Shadow Clone Jutsu and the first Rasengan-shaped hint of what Naruto's power actually is: not raw talent, but the ability to make copies of himself and refuse to give up before all of them do. Iruka is wounded protecting him. Mizuki loses. A headband changes hands. And a boy who spent twelve years being a punchline becomes, in the space of a single episode, the protagonist of one of anime's defining stories.",
    ],
    majorEvents: [
      "Naruto fails the academy graduation exam for the third time.",
      "Mizuki manipulates Naruto into stealing the Scroll of Sealing.",
      "Iruka reveals the truth about the Nine-Tails and defends Naruto with his own body.",
      "Naruto learns Shadow Clone Jutsu from the forbidden scroll and defeats Mizuki.",
      "Iruka gives Naruto his own forehead protector, effectively graduating him.",
    ],
    characterDevelopment: [
      { character: "Naruto Uzumaki", note: "Shifts from performative attention-seeker to a child who has, for the first time, been chosen." },
      { character: "Iruka Umino", note: "Moves past his own trauma over losing his parents to the Nine-Tails and separates the child from the beast." },
      { character: "Mizuki", note: "Establishes the first template for what the show later calls 'the adult who resents children for existing.'" },
    ],
    themes: [
      "Loneliness as a starting position",
      "The moral debt teachers owe their students",
      "Prejudice inherited from disaster",
      "Identity separated from what you carry",
    ],
    bestMoments: [
      "The swing scene — silent, unhurried, and the emotional anchor of the entire franchise.",
      "Iruka's speech to Mizuki about who Naruto is beneath the mask.",
      "Naruto's first Shadow Clone Jutsu, framed less as a power-up and more as a promise.",
    ],
    trivia: [
      "Kishimoto has said the swing was the first image he drew when planning the premiere.",
      "The original manga's opening chapter compresses the exam, the theft, and the reveal into a single sitting; the anime slows the swing scene down considerably.",
      "The English dub was one of Cartoon Network's Toonami cornerstones from 2005 onward and introduced most Western fans to the franchise.",
    ],
    answered: [
      "Why the village treats Naruto as an outsider.",
      "What is sealed inside him and by whom.",
      "Why Iruka, of all the adults, is the one who reaches him.",
    ],
    remaining: [
      "Who Naruto's parents actually were.",
      "Why the Nine-Tails attacked Konoha in the first place.",
      "What Mizuki was really working for.",
    ],
    connectionsPrev: [],
    connectionsNext: [
      "The Team 7 assignment in episode 3 pays off Iruka's speech: Kakashi immediately tests whether Naruto has internalized the lesson about teammates.",
      "The Land of Waves arc uses this episode's 'lonely child, wounded teacher' template as a scaffold for Haku and Zabuza's tragedy.",
    ],
    related: [
      { slug: "naruto-uzumaki", kind: "character", label: "Naruto Uzumaki" },
      { slug: "kakashi-hatake", kind: "character", label: "Kakashi Hatake" },
      { slug: "naruto", kind: "anime", label: "Naruto — full guide" },
    ],
  },
  {
    animeSlug: "frieren",
    number: 1,
    title: "The Journey's End",
    arc: "Prologue",
    airDate: "2023-09-29",
    runtime: "47 min",
    synopsis:
      "A double-length premiere that opens after the credits of a story we never got to see: the hero's party has already won, and the elf who survives them has to learn, decades too late, what human time meant.",
    recap: [
      "The episode begins with the ending. Himmel, Heiter, Eisen, and Frieren return from a ten-year quest, having defeated the Demon King, and the town explodes with a parade. It is the exact scene every fantasy anime spends dozens of episodes building toward, and the show gives it to us in the cold open. The bait is deliberate. What the premiere is actually about is the fifty years after the parade, and what it costs to be the only member of a party who does not age.",
      "Frieren, an elf, treats the decade-long quest as a short trip. She casually promises to see her friends again 'soon' and disappears into the forests for another fifty years of magic research. When she returns, Himmel is old. That's the twist the show constructs its entire premise around — not a battle, not a betrayal, but the realization that 'later' means something different depending on how long you live.",
      "Himmel dies. The funeral is the emotional core of the premiere, and it is filmed with an almost unbearable stillness. Frieren cries, and the show is careful to let us understand that she is not crying for Himmel so much as for the version of herself that failed to notice him. 'I hardly knew anything about him,' she says. It is one of the quietest, most devastating lines in modern anime.",
      "The back half of the episode is a montage that would be corny in any other show: Frieren begins collecting spells that seem useless. Spells to make a field of flowers. Spells to warm a cup of tea. Spells that Himmel once asked her to learn 'just because they were pretty.' The show is teaching us its grammar. Grief is not a scene. Grief is a decision to spend your immortality remembering someone who did not have theirs.",
      "By the time Frieren decides to travel again — this time deliberately, this time with the goal of understanding humans rather than outliving them — the premiere has re-genred itself. What looked like a post-quest epilogue is actually the beginning of a road story about mourning, and the road is going to be very, very long.",
    ],
    majorEvents: [
      "The heroes' party returns victorious to the royal capital.",
      "Frieren disappears for fifty years to research magic.",
      "Himmel dies of old age; the party reunites at his funeral.",
      "Frieren commits to a new journey to understand the humans she outlived.",
      "Fern is introduced as Heiter's ward, foreshadowing the new party structure.",
    ],
    characterDevelopment: [
      { character: "Frieren", note: "Shifts from a scholar who collects spells for their own sake to a mourner who collects them because Himmel liked them." },
      { character: "Himmel", note: "Reframed retroactively in every flashback — the show teaches us that his cheerfulness was a form of urgency Frieren failed to read." },
      { character: "Heiter", note: "Introduces the show's core question: what do you owe the people who outlive you?" },
    ],
    themes: ["Mourning as narrative fuel", "Time as an unequal resource", "The retroactive re-reading of ordinary moments", "Legacy through students"],
    bestMoments: [
      "The parade cold open, staged as a fake ending.",
      "Frieren's line at Himmel's funeral about how little she knew him.",
      "The wordless montage of Frieren gathering small, sentimental spells over decades.",
    ],
    trivia: [
      "The premiere aired as a theatrical-length special in Japan before the weekly broadcast began.",
      "Composer Evan Call scored the funeral with a solo cello motif that recurs throughout the season whenever Himmel is remembered.",
      "The manga by Kanehito Yamada and Tsukasa Abe opens with the same funeral scene — the anime's cold-open parade is an expansion, not an invention.",
    ],
    answered: [
      "Why Frieren travels alone at the start of the series.",
      "Who Himmel was and why his memory shapes the journey.",
      "Why Fern eventually joins Frieren.",
    ],
    remaining: [
      "What the Demon King's remnants are still doing in the world.",
      "Whether Frieren's mentor Flamme left more than one apprentice.",
      "What 'the resting place of souls' actually is.",
    ],
    connectionsPrev: [],
    connectionsNext: [
      "The convent arc pays off the funeral by asking whether prayers said for someone who is gone still mean anything.",
      "The First-Class Mage exam introduces the second generation of humans who will inherit Frieren's grief without having earned it.",
    ],
    related: [
      { slug: "frieren", kind: "anime", label: "Frieren — full guide" },
      { slug: "frieren", kind: "character", label: "Frieren" },
      { slug: "frieren-and-the-slow-fantasy-movement", kind: "article", label: "Frieren and the rise of slow fantasy" },
    ],
  },
];

export function getEpisode(animeSlug: string, number: number) {
  return episodes.find((e) => e.animeSlug === animeSlug && e.number === number);
}

export function episodesFor(animeSlug: string) {
  return episodes.filter((e) => e.animeSlug === animeSlug).sort((a, b) => a.number - b.number);
}
