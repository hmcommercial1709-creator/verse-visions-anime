/**
 * Editorial categories for GameCastle Anime articles.
 * These are editorial desks, not video-game categories.
 */
export type CategorySlug =
  | "action"
  | "fantasy"
  | "analysis"
  | "sports"
  | "anime-guides"
  | "reviews"
  | "news";

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  intro: string[];
  gradient: string;
  accent: string;
};

const g = (a: string, b: string) => `linear-gradient(135deg, ${a}, ${b})`;

export const categories: Category[] = [
  {
    slug: "action",
    name: "Action Anime",
    tagline: "Fights, sakuga and combat craft",
    description:
      "Anime analysis of fight choreography, animation direction, techniques and the storytelling behind memorable action.",
    intro: [
      "Action is where animation craft becomes visible. We break down timing, impact frames, spatial clarity and the character choices underneath the spectacle.",
      "Every guide stays focused on anime and connects readers to relevant watch orders, characters and power-system explainers.",
    ],
    gradient: g("#ef4444", "#7c1d1d"),
    accent: "#ef4444",
  },
  {
    slug: "fantasy",
    name: "Fantasy & Isekai",
    tagline: "Worldbuilding, magic and progression",
    description:
      "Anime guides to fantasy worlds, isekai, dungeon stories, magic systems and character progression.",
    intro: [
      "The strongest fantasy anime makes its world rules matter to character choices, not just spectacle.",
      "Our coverage explains those rules clearly, then follows the consequences that make each world worth exploring.",
    ],
    gradient: g("#7c5cff", "#1e1b4b"),
    accent: "#7c5cff",
  },
  {
    slug: "analysis",
    name: "Anime Analysis",
    tagline: "Tactics, themes and psychological battles",
    description:
      "Close analysis of tactical conflicts, clever power use, political manoeuvres, themes and earned outsmarting in anime.",
    intro: [
      "A convincing analysis shows its working. We trace the information, constraints and trade-offs behind a plan or theme.",
      "Expect clear breakdowns of battlefield tactics, ability counters, direction and character decisions.",
    ],
    gradient: g("#0ea5e9", "#0c2340"),
    accent: "#0ea5e9",
  },
  {
    slug: "sports",
    name: "Sports Anime",
    tagline: "Teams, rivals and tournament pressure",
    description:
      "Anime coverage of sports series, tournament arcs, rivalries, teamwork and the cost of competition.",
    intro: [
      "Competition gives anime a natural clock, clear stakes and room for rivals to grow together.",
      "Our guides focus on character development, tactics and the moments that turn a match into a story worth revisiting.",
    ],
    gradient: g("#22c55e", "#052e16"),
    accent: "#22c55e",
  },
  {
    slug: "anime-guides",
    name: "Anime Guides",
    tagline: "Watch orders, explainers and getting started",
    description:
      "Practical anime watch orders, beginner routes, glossaries and reference guides designed to answer questions quickly.",
    intro: [
      "A useful guide gives the answer early, explains the reasoning and helps you choose what to read or watch next.",
      "Published pages are reviewed for clarity and connected to relevant anime, character and franchise hubs.",
    ],
    gradient: g("#f59e0b", "#451a03"),
    accent: "#f59e0b",
  },
  {
    slug: "reviews",
    name: "Anime Reviews",
    tagline: "Clear verdicts with supporting analysis",
    description:
      "English anime reviews covering direction, writing, pacing, performance and adaptation choices.",
    intro: [
      "A review should help you decide whether a series is worth your time and show enough evidence for you to disagree intelligently.",
      "We publish focused criticism only after the page has enough substance to stand on its own.",
    ],
    gradient: g("#e879f9", "#3b0764"),
    accent: "#e879f9",
  },
  {
    slug: "news",
    name: "Anime News",
    tagline: "Verified announcements and release updates",
    description:
      "Sourced anime announcements, release dates, licensing updates and production news.",
    intro: [
      "News pages remain unpublished until the central claim, date and primary source have been checked.",
      "Corrections and material updates are dated so readers can see what changed.",
    ],
    gradient: g("#38bdf8", "#082f49"),
    accent: "#38bdf8",
  },
];

export const getCategory = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);

export const categorySlugs = (): CategorySlug[] =>
  categories.map((c) => c.slug);
