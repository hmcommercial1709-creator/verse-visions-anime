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
  {
    slug: "dragon-ball",
    name: "Dragon Ball",
    summary:
      "Akira Toriyama's flagship: the original 1986 series, Z, GT (non-canon), Kai (a recut), and the ongoing Super continuation.",
    entries: [
      { title: "Dragon Ball (1986)", kind: "series", year: 1986, chronologicalOrder: 1, releaseOrder: 1, note: "Toriyama's original — young Goku, Journey to the West bones." },
      { title: "Dragon Ball Z (1989)", kind: "sequel", year: 1989, chronologicalOrder: 2, releaseOrder: 2, animeSlug: "dragon-ball-z" },
      { title: "Dragon Ball GT (1996)", kind: "alternate", year: 1996, chronologicalOrder: 3, releaseOrder: 3, optional: true, note: "Non-manga sequel; treated as non-canon after Super." },
      { title: "Dragon Ball Z: Kai (2009)", kind: "alternate", year: 2009, chronologicalOrder: 2, releaseOrder: 4, optional: true, note: "A faster recut of Z; use in place of Z for a first watch." },
      { title: "Dragon Ball Super (2015)", kind: "sequel", year: 2015, chronologicalOrder: 4, releaseOrder: 5 },
    ],
  },
  {
    slug: "jojos-bizarre-adventure",
    name: "JoJo's Bizarre Adventure",
    summary:
      "David Production has adapted Parts 1–6 in release order. Every part changes protagonist; start from Part 1.",
    entries: [
      { title: "Phantom Blood & Battle Tendency (2012)", kind: "series", year: 2012, chronologicalOrder: 1, releaseOrder: 1, animeSlug: "jojos-bizarre-adventure" },
      { title: "Stardust Crusaders (2014)", kind: "sequel", year: 2014, chronologicalOrder: 2, releaseOrder: 2 },
      { title: "Diamond is Unbreakable (2016)", kind: "sequel", year: 2016, chronologicalOrder: 3, releaseOrder: 3 },
      { title: "Golden Wind (2018)", kind: "sequel", year: 2018, chronologicalOrder: 4, releaseOrder: 4 },
      { title: "Stone Ocean (2021)", kind: "sequel", year: 2021, chronologicalOrder: 5, releaseOrder: 5 },
    ],
  },
  {
    slug: "bleach",
    name: "Bleach",
    summary:
      "The original 2004 series, a filler-heavy but consequential run, followed by the 2022 Thousand-Year Blood War adaptation that finally covered the manga's final arc.",
    entries: [
      { title: "Bleach (2004)", kind: "series", year: 2004, chronologicalOrder: 1, releaseOrder: 1, animeSlug: "bleach" },
      { title: "Bleach: Thousand-Year Blood War (2022)", kind: "sequel", year: 2022, chronologicalOrder: 2, releaseOrder: 2 },
    ],
  },
  {
    slug: "my-hero-academia",
    name: "My Hero Academia",
    summary: "Seven television seasons plus three feature films, all set inside the same continuity.",
    entries: [
      { title: "My Hero Academia (2016)", kind: "series", year: 2016, chronologicalOrder: 1, releaseOrder: 1, animeSlug: "my-hero-academia" },
      { title: "Two Heroes (film, 2018)", kind: "movie", year: 2018, chronologicalOrder: 2, releaseOrder: 2, optional: true },
      { title: "Heroes Rising (film, 2019)", kind: "movie", year: 2019, chronologicalOrder: 3, releaseOrder: 3, optional: true },
      { title: "World Heroes' Mission (film, 2021)", kind: "movie", year: 2021, chronologicalOrder: 4, releaseOrder: 4, optional: true },
    ],
  },
  {
    slug: "haikyuu",
    name: "Haikyuu!!",
    summary: "Four TV seasons across Production I.G, plus a series of theatrical continuations beginning with Dumpster Battle (2024).",
    entries: [
      { title: "Haikyuu!! (2014)", kind: "series", year: 2014, chronologicalOrder: 1, releaseOrder: 1, animeSlug: "haikyuu" },
      { title: "Haikyuu!! Season 2 (2015)", kind: "sequel", year: 2015, chronologicalOrder: 2, releaseOrder: 2 },
      { title: "Haikyuu!! Season 3 (2016)", kind: "sequel", year: 2016, chronologicalOrder: 3, releaseOrder: 3 },
      { title: "Haikyuu!! To the Top (2020)", kind: "sequel", year: 2020, chronologicalOrder: 4, releaseOrder: 4 },
      { title: "Dumpster Battle (film, 2024)", kind: "movie", year: 2024, chronologicalOrder: 5, releaseOrder: 5 },
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
  {
    slug: "dragon-ball-complete",
    franchiseSlug: "dragon-ball",
    title: "Dragon Ball — complete watch order",
    audience: "beginner",
    summary:
      "Release order with Kai substituted for Z. GT is optional and treated as non-canon by Dragon Ball Super.",
    steps: [
      { label: "Dragon Ball (1986)", note: "Optional for newcomers, but Z assumes you know the cast." },
      { label: "Dragon Ball Z: Kai (2009)", note: "The trimmed recut of Z — better first-watch pacing than the 1989 original." },
      { label: "Dragon Ball Super (2015)", note: "The post-Buu continuation. Skip GT unless you're completionist." },
    ],
  },
  {
    slug: "jojo-part-order",
    franchiseSlug: "jojos-bizarre-adventure",
    title: "JoJo's Bizarre Adventure — part-by-part order",
    audience: "release",
    summary:
      "Every part changes protagonist and setting, but each part references the last. Start at Part 1 and go in order.",
    steps: [
      { label: "Phantom Blood (Part 1)", note: "Sets up DIO and the Joestar bloodline." },
      { label: "Battle Tendency (Part 2)", note: "The Pillar Men; introduces Hamon fully." },
      { label: "Stardust Crusaders (Part 3)", note: "Stands are introduced — the mechanic every later part uses." },
      { label: "Diamond is Unbreakable (Part 4)", note: "Small-town mystery arc, tonal reset." },
      { label: "Golden Wind (Part 5)", note: "Italian mafia arc; strongest ensemble in the series." },
      { label: "Stone Ocean (Part 6)", note: "Ends the original continuity." },
    ],
  },
  {
    slug: "bleach-tybw-order",
    franchiseSlug: "bleach",
    title: "Bleach — watch order including Thousand-Year Blood War",
    audience: "beginner",
    summary:
      "Watch the original series through Fullbring, then jump to the 2022 TYBW anime for the manga's final arc.",
    steps: [
      { label: "Bleach (2004), episodes 1–366", note: "Community filler guides identify large skippable stretches — the Bount and Zanpakuto Rebellion arcs are commonly skipped." },
      { label: "Bleach: Thousand-Year Blood War (2022– )", note: "Adapts the manga's final arc, ten years after the original series ended." },
    ],
  },
  {
    slug: "haikyuu-full",
    franchiseSlug: "haikyuu",
    title: "Haikyuu!! — full watch order",
    audience: "release",
    summary:
      "Four seasons of the TV anime, then the theatrical continuations that adapt the remainder of the manga.",
    steps: [
      { label: "Haikyuu!! Season 1 (2014)", note: "Karasuno's rebuild; introduces Kageyama and Hinata." },
      { label: "Haikyuu!! Season 2 (2015)", note: "Aoba Johsai and the summer training camp." },
      { label: "Haikyuu!! Season 3 (2016)", note: "The Shiratorizawa match — ten episodes, one game." },
      { label: "Haikyuu!! To the Top (2020)", note: "Season 4, split cour." },
      { label: "Dumpster Battle (film, 2024)", note: "The Nekoma match; first of the announced theatrical continuations." },
    ],
  },
];

