/**
 * Story Arcs
 * ----------
 * Structured records for named story arcs, linking anime + episode
 * ranges + relevant characters + related articles.  Anime and episode
 * pages read this via the content registry so an editor can add an arc
 * once and see it appear everywhere it belongs.
 *
 * Do NOT invent arcs.  Add records only for arcs that are recognised
 * by the source material or the anime adaptation itself.
 */

export type StoryArc = {
  slug: string;
  animeSlug: string;
  title: string;
  episodes: string; // e.g. "1–19"
  characters: string[]; // character slugs prominently featured
  majorEvents: string[];
  summary: string;
  relatedArticles?: string[]; // article slugs
  publicationStatus?: "draft" | "review" | "published" | "archived";
};

export const storyArcs: StoryArc[] = [
  {
    slug: "land-of-waves",
    animeSlug: "naruto",
    title: "Land of Waves",
    episodes: "1–19",
    characters: ["naruto-uzumaki", "sasuke-uchiha", "sakura-haruno", "kakashi-hatake"],
    majorEvents: [
      "Team 7's first C-rank mission escalates into A-rank territory.",
      "Kakashi teaches tree-walking chakra control.",
      "Haku and Zabuza become the show's template for tragic antagonists.",
    ],
    summary:
      "The arc that turns Naruto from a school comedy into a shinobi story. Its tragedy is unusually earned for episode-teen material.",
  },
  {
    slug: "chunin-exams",
    animeSlug: "naruto",
    title: "Chunin Exams",
    episodes: "20–67",
    characters: ["naruto-uzumaki", "sasuke-uchiha", "sakura-haruno"],
    majorEvents: [
      "The Forest of Death introduces Orochimaru and the Curse Mark.",
      "The tournament arc bleeds into Konoha's invasion.",
      "The Third Hokage falls in defence of the village.",
    ],
    summary:
      "A tournament arc that pivots into political tragedy. Almost every future antagonist and alliance is seeded here.",
  },
  {
    slug: "prologue-frieren",
    animeSlug: "frieren",
    title: "Prologue — After the Journey",
    episodes: "1–4",
    characters: ["frieren-elf"],
    majorEvents: [
      "The hero party returns victorious.",
      "Himmel dies of old age; Frieren commits to a new journey.",
      "Fern is introduced as Heiter's apprentice.",
    ],
    summary:
      "The show's premise arc — the ending we never saw, and the mourning that becomes the story.",
  },
  {
    slug: "saiyan-saga",
    animeSlug: "dragon-ball-z",
    title: "Saiyan Saga",
    episodes: "1–35",
    characters: ["goku", "vegeta"],
    majorEvents: [
      "Raditz reveals Goku's Saiyan origin and Goku dies stopping him.",
      "Nappa and Vegeta arrive; several Earth defenders are killed.",
      "Goku returns from King Kai's training and fights Vegeta on Earth.",
    ],
    summary:
      "The arc that resets Dragon Ball's scale from martial arts tournament to interplanetary war.",
  },
  {
    slug: "frieza-saga",
    animeSlug: "dragon-ball-z",
    title: "Frieza Saga",
    episodes: "36–107",
    characters: ["goku", "vegeta"],
    majorEvents: [
      "The Namek journey to gather the Dragon Balls before Frieza does.",
      "Vegeta's arc pivot begins as he fights alongside Goku's allies.",
      "Goku transforms into a Super Saiyan for the first time.",
    ],
    summary:
      "The multi-episode boss battle that became the template for the modern shonen finale.",
  },
  {
    slug: "soul-society",
    animeSlug: "bleach",
    title: "Soul Society",
    episodes: "21–63",
    characters: ["ichigo-kurosaki"],
    majorEvents: [
      "Ichigo's rescue mission enters the Soul Society.",
      "The Gotei 13 is introduced captain by captain.",
      "Aizen's betrayal reframes the entire series.",
    ],
    summary:
      "The arc where Bleach commits to its structure: named weapons, ranks, and long-planned betrayals.",
  },
  {
    slug: "sports-festival-mha",
    animeSlug: "my-hero-academia",
    title: "U.A. Sports Festival",
    episodes: "S2 E1–13",
    characters: ["izuku-midoriya", "katsuki-bakugo"],
    majorEvents: [
      "Class 1-A is publicly introduced to the wider hero ecosystem.",
      "Todoroki confronts his father's expectations mid-match.",
      "Bakugo wins the tournament but leaves it unresolved with Deku.",
    ],
    summary:
      "MHA's version of a tournament arc — used for identity, not for winners.",
  },
  {
    slug: "stardust-crusaders",
    animeSlug: "jojos-bizarre-adventure",
    title: "Stardust Crusaders",
    episodes: "27–74",
    characters: ["jotaro-kujo", "dio-brando"],
    majorEvents: [
      "Stands are introduced as the series' permanent power system.",
      "Jotaro and his allies travel from Japan to Egypt to reach DIO.",
      "The final confrontation ends the DIO plotline the series opened with.",
    ],
    summary:
      "The part that turned JoJo from a cult item into a franchise.",
  },
  {
    slug: "shiratorizawa",
    animeSlug: "haikyuu",
    title: "Shiratorizawa Match",
    episodes: "S3",
    characters: ["hinata-shoyo"],
    majorEvents: [
      "Karasuno reaches the final of the Miyagi Spring Tournament qualifier.",
      "Ushijima and Karasuno's setter dynamic drives every set.",
      "Karasuno qualifies for nationals.",
    ],
    summary:
      "Ten episodes of a single match — Production I.G at its most focused.",
  },
];

