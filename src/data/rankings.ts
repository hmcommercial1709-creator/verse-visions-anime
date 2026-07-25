/**
 * Rankings
 * --------
 * Editorial rankings and comparison guides. Each ranking is a small
 * data record; the presentation is a shared template so an editor can
 * add a new ranking without touching a route file.
 *
 * IMPORTANT: rankings here are EDITORIAL — do not present them as
 * absolute review scores or user-voted rankings. Copy should use
 * language such as "editor's pick" or "featured", never fabricated
 * user ratings.
 */

export type RankingEntry = {
  animeSlug?: string;
  articleSlug?: string;
  characterSlug?: string;
  title: string;
  note: string; // one-paragraph editorial justification
};

export type Ranking = {
  slug: string;
  title: string;
  summary: string;
  category: "anime" | "character" | "article" | "mixed";
  entries: RankingEntry[];
  author?: string; // author slug
  updatedAt?: string;
  publicationStatus?: "draft" | "review" | "published" | "archived";
};

export const rankings: Ranking[] = [
  {
    slug: "editor-picks-modern-shonen",
    title: "Editor's picks — modern shonen entry points",
    summary:
      "If you have not watched anime in a decade and want to know what changed, start here. These are the shows we recommend most often when readers ask 'where do I begin now.'",
    category: "anime",
    entries: [
      { animeSlug: "frieren", title: "Frieren", note: "The show that reframed what a post-quest fantasy can be. Slow, deliberate, and one of the best-directed anime of the last five years." },
      { animeSlug: "jujutsu-kaisen", title: "Jujutsu Kaisen", note: "MAPPA at full budget. Season 2's Shibuya arc is the modern benchmark for shonen action direction." },
      { animeSlug: "demon-slayer", title: "Demon Slayer", note: "ufotable's compositing pipeline set a new visual bar. Its lower-stakes character work is what keeps readers hooked between fights." },
      { animeSlug: "spy-x-family", title: "Spy x Family", note: "The rare family sitcom that treats espionage and assassination as domestic problems. A perfect first anime for a lapsed viewer." },
    ],
    updatedAt: "2026-03-01",
  },
  {
    slug: "editor-picks-fantasy-worldbuilding",
    title: "Editor's picks — fantasy worldbuilding we keep coming back to",
    summary:
      "Anime whose worldbuilding rewards a second watch. Not a definitive list — a working set of the shows we point to when readers ask about magic systems, politics, and lore.",
    category: "anime",
    entries: [
      { animeSlug: "frieren", title: "Frieren", note: "A magic system where suppression matters as much as raw power, and where the exam arc treats bureaucracy like a boss." },
      { animeSlug: "attack-on-titan", title: "Attack on Titan", note: "One of the most successful bait-and-switch premises in television. Read it as a political drama, not a monster show." },
      { animeSlug: "hunter-x-hunter", title: "Hunter x Hunter", note: "Nen is the reason every power system since 2011 gets compared to it. The Chimera Ant arc still has no peer for structural ambition." },
    ],
    updatedAt: "2026-02-14",
  },
  {
    slug: "best-action-entry-points",
    title: "Best Action Anime for Newcomers",
    summary: "Editor's picks for someone starting the action/shonen genre in 2026.",
    category: "anime",
    entries: [
      { animeSlug: "demon-slayer", title: "Demon Slayer", note: "The clearest modern showcase of what ufotable can do; short arcs, high production floor." },
      { animeSlug: "my-hero-academia", title: "My Hero Academia", note: "A structured shonen with a beginning, middle, and now an announced ending." },
      { animeSlug: "jujutsu-kaisen", title: "Jujutsu Kaisen", note: "Combat choreography as its own thesis." },
      { animeSlug: "one-punch-man", title: "One-Punch Man", note: "A one-season entry point; watch Madhouse's S1 first." },
    ],
    updatedAt: "2026-07-25",
  },
];

