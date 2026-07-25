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
];
