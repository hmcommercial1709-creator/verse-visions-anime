/**
 * Cornerstone guides.
 *
 * The pages we actively want to rank, in one place, so the hubs
 * (/guides, /watch-order, /power-scaling, /characters) can link to them
 * with varied, contextual anchors instead of duplicated boilerplate.
 *
 * `slug` values are verified against the article records in src/data —
 * do not add an entry here without a published article behind it.
 */
export type Cornerstone = {
  slug: string;
  /** Short contextual anchor text. Vary it per placement, never stuff. */
  anchor: string;
  blurb: string;
  /** Which hub this guide primarily belongs to. */
  hub: "watch-order" | "power-scaling" | "recap";
  /** Series hub slug for the related /anime/$slug page, when there is one. */
  animeSlug?: string;
};

export const CORNERSTONES: Cornerstone[] = [
  {
    slug: "jujutsu-kaisen-watch-order-and-manga-jump",
    anchor: "Jujutsu Kaisen watch order",
    blurb:
      "Season order, where Jujutsu Kaisen 0 belongs, and the exact chapter to start from if you want to keep going in the manga.",
    hub: "watch-order",
    animeSlug: "jujutsu-kaisen",
  },
  {
    slug: "attack-on-titan-complete-watch-order",
    anchor: "Attack on Titan complete watch order",
    blurb: "Every season and part in order, including the split final chapters and the recap films.",
    hub: "watch-order",
    animeSlug: "attack-on-titan",
  },
  {
    slug: "solo-leveling-system-progression-explained",
    anchor: "Solo Leveling System explained",
    blurb: "Stats, levels, daily quests, penalties and rank progression, and why Jinwoo was chosen.",
    hub: "power-scaling",
    animeSlug: "solo-leveling",
  },
  {
    slug: "gojo-satoru-limitless-technique-explained",
    anchor: "Gojo's Limitless technique",
    blurb: "Infinity, Blue, Red and Purple broken down by the rules the series states for them.",
    hub: "power-scaling",
    animeSlug: "jujutsu-kaisen",
  },
  {
    slug: "hunter-x-hunter-nen-strategy-rules",
    anchor: "Hunter x Hunter Nen explained",
    blurb: "All six Nen categories, how Nen is learned, and why conditions and vows decide fights.",
    hub: "power-scaling",
    animeSlug: "hunter-x-hunter",
  },
  {
    slug: "dr-stone-science-tech-tree-guide",
    anchor: "Dr. Stone inventions list",
    blurb: "Senku's full science roadmap in story order, with purpose and materials for each build.",
    hub: "power-scaling",
    animeSlug: "dr-stone",
  },
  {
    slug: "one-piece-devil-fruit-system-explained",
    anchor: "One Piece Devil Fruits explained",
    blurb: "Paramecia, Zoan, Logia, awakening, Haki interaction and the rules that keep the system coherent.",
    hub: "power-scaling",
    animeSlug: "one-piece",
  },
  {
    slug: "frieren-magic-system-deep-dive",
    anchor: "Frieren magic system explained",
    blurb: "Mana suppression, spell analysis, Zoltraak, visualisation and the First-Class Mage Exam.",
    hub: "power-scaling",
    animeSlug: "frieren",
  },
  {
    slug: "attack-on-titan-odm-gear-tactics-analysis",
    anchor: "Attack on Titan ODM gear explained",
    blurb: "What ODM means, how the equipment works and why gas, anchors and terrain decide every route.",
    hub: "power-scaling",
    animeSlug: "attack-on-titan",
  },
  {
    slug: "one-piece-wano-recap",
    anchor: "One Piece Wano recap",
    blurb: "The arc's turning points in order, so you can go into what follows without a rewatch.",
    hub: "recap",
    animeSlug: "one-piece",
  },
  {
    slug: "shibuya-incident-timeline",
    anchor: "Shibuya Incident timeline",
    blurb: "The arc reconstructed hour by hour, with each fight placed against the others.",
    hub: "recap",
    animeSlug: "jujutsu-kaisen",
  },
];

export const cornerstonesForHub = (hub: Cornerstone["hub"]) =>
  CORNERSTONES.filter((c) => c.hub === hub);

export const cornerstoneForAnime = (animeSlug: string) =>
  CORNERSTONES.filter((c) => c.animeSlug === animeSlug);
