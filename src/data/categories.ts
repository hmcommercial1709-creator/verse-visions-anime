/**
 * Editorial categories powering the multi-category navigation, the /blog
 * archive filters and the /category/$slug hubs.
 *
 * Every article carries a `category` (see src/data/articles.ts). Legacy
 * articles without one are mapped from their `section` by `categoryForArticle`.
 */
export type CategorySlug =
  | "action"
  | "rpg"
  | "strategy"
  | "esports"
  | "gaming-guides"
  | "reviews"
  | "news";

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  /** Long-form intro shown above the archive grid. */
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
      "Anime-only analysis of fight choreography, animation direction, techniques and the storytelling behind memorable action.",
    intro: [
      "Action is where animation craft becomes visible. We break down timing, impact frames, spatial clarity and the character choices underneath the spectacle.",
      "Every published guide focuses on the anime itself and links readers to related watch orders, characters and power-system explainers.",
    ],
    gradient: g("#ef4444", "#7c1d1d"),
    accent: "#ef4444",
  },
  {
    slug: "rpg",
    name: "Isekai & Game Worlds",
    tagline: "Progression fantasy and world systems",
    description:
      "Anime guides to isekai, dungeon stories, level systems and game-inspired fantasy worlds.",
    intro: [
      "These stories borrow levels, quests and party roles from games, but their best ideas are about identity, power and belonging.",
      "Our coverage explains the rules clearly, then follows the characters and consequences that make those rules matter.",
    ],
    gradient: g("#7c5cff", "#1e1b4b"),
    accent: "#7c5cff",
  },
  {
    slug: "strategy",
    name: "Strategy & Mind Games",
    tagline: "Tactics, plans and psychological battles",
    description:
      "Anime analysis of tactical conflicts, clever power use, political manoeuvres and earned outsmarting.",
    intro: [
      "A convincing strategy story shows its working. We trace the information, constraints and trade-offs behind a plan instead of declaring a character a genius.",
      "Expect clear breakdowns of battlefield tactics, ability counters and psychological games across anime.",
    ],
    gradient: g("#0ea5e9", "#0c2340"),
    accent: "#0ea5e9",
  },
  {
    slug: "esports",
    name: "Sports & Competition",
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
    slug: "gaming-guides",
    name: "Anime Guides",
    tagline: "Watch orders, explainers and getting started",
    description:
      "Practical anime watch orders, beginner routes, glossaries and reference guides designed to answer the question quickly.",
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
      "English anime reviews that explain the verdict through direction, writing, pacing, performance and adaptation choices.",
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

export const categorySlugs = (): CategorySlug[] => categories.map((c) => c.slug);
