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
    name: "Action",
    tagline: "Fights, sakuga and combat design",
    description:
      "Deep dives into action anime and action games: fight choreography, animation direction, combat systems and the artists behind them.",
    intro: [
      "Action is the category where craft is easiest to see and hardest to fake. A single cut of sakuga costs weeks; a single frame of hit-stop decides whether a combat system feels alive. Our action desk covers both sides of that line — the animators storyboarding a two-minute duel, and the designers tuning the parry window that makes a boss fight sing.",
      "You will find episode-level breakdowns, key-animator credits, weapon and technique explainers, and honest assessments of when spectacle stops serving story. Every piece is written by someone who watched the sequence frame by frame before writing a word about it.",
    ],
    gradient: g("#ef4444", "#7c1d1d"),
    accent: "#ef4444",
  },
  {
    slug: "rpg",
    name: "RPG",
    tagline: "Progression, party building and worldcraft",
    description:
      "Role-playing coverage: stat systems, progression curves, party composition, isekai power fantasies and the worlds worth losing a hundred hours in.",
    intro: [
      "RPGs — on screen and on controller — live or die on progression. The dopamine of a level-up, the arithmetic of a build, the slow reveal of a world map: these are engineering problems dressed as storytelling. Our RPG desk treats them as both.",
      "Expect build guides, systems analysis, isekai and dungeon-crawler criticism, and long reads about why some worlds feel lived-in while others feel like a spreadsheet with a sky box.",
    ],
    gradient: g("#7c5cff", "#1e1b4b"),
    accent: "#7c5cff",
  },
  {
    slug: "strategy",
    name: "Strategy",
    tagline: "Tactics, meta and the long game",
    description:
      "Strategy coverage: tactical breakdowns, meta shifts, army composition, mind-games in fiction, and the writers who make plans feel earned.",
    intro: [
      "A good strategy story and a good strategy game ask the same thing of you: hold three futures in your head and pick one. Our strategy desk covers tactical anime, war fiction, board-state analysis and the meta that forms around any system with enough players.",
      "We chart openings, count tempo, and explain why the smartest character in the room is only convincing when the writer respects the audience enough to show the working.",
    ],
    gradient: g("#0ea5e9", "#0c2340"),
    accent: "#0ea5e9",
  },
  {
    slug: "esports",
    name: "Esports",
    tagline: "Competition, rosters and the pro scene",
    description:
      "Esports and competitive coverage: tournament reports, roster moves, sports-anime crossovers, and the culture of high-level competition.",
    intro: [
      "Competition is narrative that writes itself — then gets rewritten every patch. Our esports desk covers tournaments, roster churn, coaching, burnout, and the sports anime that captures the feeling of a bracket better than most broadcasts do.",
      "We care about the human cost of peak performance as much as the highlight reel, and we say so.",
    ],
    gradient: g("#22c55e", "#052e16"),
    accent: "#22c55e",
  },
  {
    slug: "gaming-guides",
    name: "Gaming Guides",
    tagline: "Watch orders, walkthroughs and getting started",
    description:
      "Practical guides: watch orders, beginner routes, boss strategies, glossaries and the reference pages you bookmark and come back to.",
    intro: [
      "A guide has one job: get you unstuck without wasting your evening. Our guides desk writes the watch orders, the beginner routes, the boss strategies and the glossaries — tested, dated, and revised whenever the source material moves.",
      "No padding, no fake suspense, no twelve paragraphs before the answer.",
    ],
    gradient: g("#f59e0b", "#451a03"),
    accent: "#f59e0b",
  },
  {
    slug: "reviews",
    name: "Reviews",
    tagline: "Scored verdicts, written after finishing",
    description:
      "Full-length reviews of anime seasons, films and games — scored, argued, and written only after our critic reached the credits.",
    intro: [
      "We do not review from a press kit or a first episode. Every scored verdict here comes from someone who finished the thing, sat with it, and can defend the number.",
      "Scores are out of ten, with a plain-language verdict at the top for readers who only want the answer.",
    ],
    gradient: g("#e879f9", "#3b0764"),
    accent: "#e879f9",
  },
  {
    slug: "news",
    name: "News",
    tagline: "The daily beat",
    description:
      "Announcements, release dates, licensing, studio moves and patch notes — filed fast, sourced properly, updated when the story changes.",
    intro: [
      "News is the fastest-moving desk on the site. We file announcements, release dates, licensing shifts, studio hires and patch notes, and we mark every update with a timestamp so you know what changed.",
      "Rumours are labelled as rumours. Sources are named where naming them is safe.",
    ],
    gradient: g("#38bdf8", "#082f49"),
    accent: "#38bdf8",
  },
];

export const getCategory = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);

export const categorySlugs = (): CategorySlug[] => categories.map((c) => c.slug);
