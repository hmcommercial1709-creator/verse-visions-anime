/**
 * Franchises + Watch Orders
 * -------------------------
 * A franchise groups every related entry — main series, sequels, movies,
 * OVAs, specials, spin-offs — into one canonical record with both
 * chronological and release ordering.  Watch orders are editorial
 * recommendations built on top of that graph.
 *
 * Only add entries you can factually confirm.  If chronological order is
 * disputed among sources, prefer release order and note it in the guide.
 */

export type FranchiseEntryKind =
  | "series"
  | "sequel"
  | "prequel"
  | "movie"
  | "ova"
  | "special"
  | "spin-off"
  | "alternate";

export type FranchiseEntry = {
  title: string;
  kind: FranchiseEntryKind;
  year: number;
  chronologicalOrder: number;
  releaseOrder: number;
  optional?: boolean;
  animeSlug?: string; // if this entry has its own anime detail page
  note?: string;
};

export type Franchise = {
  slug: string;
  name: string;
  summary: string;
  entries: FranchiseEntry[];
  publicationStatus?: "draft" | "review" | "published" | "archived";
};

export const franchises: Franchise[] = [
  {
    slug: "naruto",
    name: "Naruto",
    summary:
      "The Masashi Kishimoto shinobi saga: the original 2002 series, its long-running Shippuden continuation, and the Boruto sequel generation.",
    entries: [
      { title: "Naruto (2002)", kind: "series", year: 2002, chronologicalOrder: 1, releaseOrder: 1, animeSlug: "naruto" },
      { title: "Naruto Shippuden", kind: "sequel", year: 2007, chronologicalOrder: 2, releaseOrder: 2 },
      { title: "Boruto: Naruto Next Generations", kind: "sequel", year: 2017, chronologicalOrder: 3, releaseOrder: 3 },
    ],
  },
  {
    slug: "attack-on-titan",
    name: "Attack on Titan",
    summary:
      "Hajime Isayama's contained saga: four seasons across Wit Studio and MAPPA, released in the order they should be watched.",
    entries: [
      { title: "Attack on Titan — Season 1", kind: "series", year: 2013, chronologicalOrder: 1, releaseOrder: 1, animeSlug: "attack-on-titan" },
      { title: "Attack on Titan — Season 2", kind: "sequel", year: 2017, chronologicalOrder: 2, releaseOrder: 2 },
      { title: "Attack on Titan — Season 3", kind: "sequel", year: 2018, chronologicalOrder: 3, releaseOrder: 3 },
      { title: "Attack on Titan — Final Season", kind: "sequel", year: 2020, chronologicalOrder: 4, releaseOrder: 4 },
    ],
  },
  {
    slug: "fullmetal-alchemist",
    name: "Fullmetal Alchemist",
    summary:
      "Two distinct anime adaptations of Hiromu Arakawa's manga. Brotherhood is the manga-faithful version; the 2003 series diverges after episode 25.",
    entries: [
      { title: "Fullmetal Alchemist (2003)", kind: "alternate", year: 2003, chronologicalOrder: 1, releaseOrder: 1, optional: true, note: "Diverges from the manga; separate ending." },
      { title: "Fullmetal Alchemist: Brotherhood", kind: "series", year: 2009, chronologicalOrder: 2, releaseOrder: 2, animeSlug: "fullmetal-alchemist-brotherhood" },
    ],
  },
];

// ---------------------------------------------------------------------

export type WatchOrder = {
  slug: string;
  franchiseSlug: string;
  title: string;
  audience: "beginner" | "chronological" | "release" | "completionist";
  summary: string;
  steps: { label: string; note?: string }[];
  publicationStatus?: "draft" | "review" | "published" | "archived";
};

export const watchOrders: WatchOrder[] = [
  {
    slug: "naruto-beginner",
    franchiseSlug: "naruto",
    title: "Naruto — beginner watch order",
    audience: "beginner",
    summary:
      "Straight-line release order with an honest note about which stretches most fans skim or skip.",
    steps: [
      { label: "Naruto (2002), episodes 1–135", note: "Skip nothing yet — the character work in the first arcs is what makes Shippuden land." },
      { label: "Naruto (2002), episodes 136–220", note: "Contains the original series' filler stretch; skimming episode summaries is common." },
      { label: "Naruto Shippuden, episodes 1–end", note: "Filler stretches are well-documented; consult a community filler guide before starting long arcs." },
      { label: "Boruto: Naruto Next Generations", note: "Optional — separate generation, distinct tone." },
    ],
  },
  {
    slug: "fullmetal-alchemist-brotherhood-only",
    franchiseSlug: "fullmetal-alchemist",
    title: "Fullmetal Alchemist — Brotherhood-first order",
    audience: "beginner",
    summary:
      "If you only watch one, watch Brotherhood. The 2003 series is a separate, self-contained interpretation.",
    steps: [
      { label: "Fullmetal Alchemist: Brotherhood, episodes 1–64", note: "The manga-faithful adaptation." },
      { label: "Fullmetal Alchemist (2003)", note: "Optional companion viewing — a distinct ending, not a prequel." },
    ],
  },
];
