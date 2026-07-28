import type { CategorySlug } from "./categories";

/**
 * Rich in-body blocks an editor can drop between paragraphs of a
 * section-authored article. Rendered by src/routes/article.$slug.tsx.
 */
export type ArticleBlock =
  | { type: "table"; caption?: string; columns: string[]; rows: string[][] }
  | { type: "spoiler"; scope: string; level?: "minor" | "major" | "ending"; heading?: string; paragraphs: string[] }
  | { type: "link"; label: string; to: string; note?: string }
  | {
      type: "affiliate";
      title: string;
      subtitle: string;
      price: string;
      offer: string;
      cta: string;
      href: string;
      retailer: string;
      note?: string;
    }
  | { type: "poll"; question: string; options: string[] }
  /** Illustrated section header. `art` names a key from src/lib/media. */
  | { type: "image"; art: string; caption: string }
  /** Responsive trailer/clip card. Omit `youtubeId` for an official-channel facade. */
  | { type: "video"; art: string; title: string; subtitle?: string; youtubeId?: string; searchQuery?: string };

/** Editor-authored section with its own heading, TOC entry and optional blocks. */
export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  blocks?: ArticleBlock[];
};

export type Article = {
  slug: string;
  section: "news" | "reviews" | "guides" | "top-lists" | "editorial";
  /** Navigation category (see src/data/categories.ts). Falls back to `section`. */
  category?: CategorySlug;
  /** Free-form topical tags surfaced on detail pages and archive filters. */
  tags?: string[];
  title: string;
  excerpt: string;
  author: string; // slug
  date: string;
  tag: string;
  cover: string;
  body: string[];
  /** When present, replaces the auto-derived sections with editorial ones. */
  sections?: ArticleSection[];
  related: string[]; // slugs of anime
};

/** Flat paragraph list (inline link markup stripped) for reading-time, word count and schema. */
export const articleParagraphs = (a: Article): string[] =>
  (a.sections && a.sections.length > 0
    ? a.sections.flatMap((s) => [s.heading, ...s.paragraphs])
    : a.body
  ).map(plainText);


import { gojoLimitlessArticle } from "./article-gojo-limitless";
import { shibuyaIncidentArticle } from "./article-shibuya-incident";
import { sorcererFamiliesArticle } from "./article-sorcerer-families";
import { extraArticles } from "./articles-extra";
import { longformArticles } from "./articles-longform";

const g = (a: string, b: string) => `linear-gradient(135deg, ${a}, ${b})`;


export const authors = [
  { slug: "aiko-tanaka", name: "Aiko Tanaka", role: "Editor-in-Chief", bio: "Ten years covering the Japanese animation industry. Formerly Anime News Network, Otaquest, and a permanent seat at Anime Expo." },
  { slug: "rowan-fitzgerald", name: "Rowan Fitzgerald", role: "Senior Reviews Editor", bio: "Rowan writes the long reviews. Focus areas: seinen, mecha, and Studio Bones. Also a working translator." },
  { slug: "juno-park", name: "Juno Park", role: "Features Writer", bio: "Juno covers manhwa-to-anime crossover, idol shows, and everything the algorithm underrates." },
  { slug: "marcus-oduya", name: "Marcus Oduya", role: "News Reporter", bio: "Marcus files the daily beat on studios, licensing, and international streaming." },
  { slug: "hana-mori", name: "Hana Mori", role: "Guides Editor", bio: "Hana writes the watch orders, glossaries, and beginner explainers that get bookmarked." },
  { slug: "kenji-arata", name: "Kenji Arata", role: "Esports & Competitive Editor", bio: "Kenji covers competitive scenes, coaching and the sports anime that get training right. Former team analyst." },
  { slug: "lina-vasquez", name: "Lina Vasquez", role: "RPG & Systems Editor", bio: "Lina writes about progression systems, party theory and worldbuilding that survives a spreadsheet." },
];

const coreArticles: Article[] = [
  gojoLimitlessArticle,
  shibuyaIncidentArticle,
  sorcererFamiliesArticle,
  { slug: "why-frieren-won-2024", section: "editorial", title: "Why Frieren Won the Year: A Long Answer to a Short Question",
    excerpt: "The 2024 Anime of the Year didn't win because it was flashy. It won because it took the medium seriously.",
    author: "aiko-tanaka", date: "2026-03-14", tag: "Editorial",
    cover: g("#3a5a3a", "#0a1a2a"),
    body: [
      "Frieren won because it slowed down. In a year where every other shonen sprinted, Madhouse spent its entire opening arc telling us that the story we were watching was already over. The Demon King has been dead for a decade. Himmel is buried. Frieren is on the road again — and every episode makes that emptiness the thing we care about.",
      "The genius of the show is that it treats mourning as narrative fuel. Most fantasy anime is about the quest. Frieren is about the recovery.",
      "It also, quietly, has one of the best magic systems on television. Mana suppression, spell diversity that includes cosmetic and mundane spells, and an exam arc that treats bureaucracy like a boss fight — Frieren keeps rewarding fans who want to think as hard as they feel.",
    ],
    related: ["frieren", "hunter-x-hunter", "vinland-saga"] },
  { slug: "one-piece-wano-recap", section: "guides", title: "The Complete Wano Recap: What Actually Happened and Why It Mattered",
    excerpt: "A 200-episode arc, sixteen character resolutions, and the payoff Oda has been drawing since Skypiea.",
    author: "hana-mori", date: "2026-03-08", tag: "Guide",
    cover: g("#ef4444", "#facc15"),
    body: [
      "Wano is not a filler saga wearing samurai clothes. It is the closing of nearly every question the New World opened. Kaido is dead. Momonosuke is on the throne. The Ancient Weapons are one step less mythical. And the man in the straw hat is finally close enough to Laugh Tale that his crew can taste it.",
      "This guide covers the arc in six chunks: entry, the raid, Onigashima's roof, the Beast Pirates fall, the flashbacks, and the aftermath.",
      "If you've been putting off Wano because of its length, know this: it is the arc most fans point to as the moment One Piece became the most watched anime in the world for real, not just on paper.",
    ],
    related: ["one-piece"] },
  { slug: "beginner-guide-modern-shonen", section: "guides", title: "The Beginner's Guide to Modern Shonen (2026 Edition)",
    excerpt: "Five entry points, four studios, one very short list of shows you can start this weekend.",
    author: "hana-mori", date: "2026-02-27", tag: "Beginner",
    cover: g("#7c5cff", "#38bdf8"),
    body: [
      "The best time to start watching anime is when a strong show is currently airing and you can talk about it as it happens. Right now, that means Solo Leveling, Frieren, and Jujutsu Kaisen — all with active seasons, all binge-friendly, all wildly different.",
      "If you have never watched anime, start with Spy x Family. If you've seen a few, watch Demon Slayer. If you want a big commitment, One Piece is the answer and it always will be.",
    ],
    related: ["demon-slayer", "spy-x-family", "one-piece", "solo-leveling", "jujutsu-kaisen"] },
  { slug: "review-jujutsu-kaisen-s2", section: "reviews", title: "Jujutsu Kaisen Season 2 Is the Best-Directed Modern Shonen We've Had", 
    excerpt: "Shibuya is a nightmare, and MAPPA's staff makes you feel every hour of it.",
    author: "rowan-fitzgerald", date: "2026-02-10", tag: "Review",
    cover: g("#141b2d", "#3a1150"),
    body: [
      "Season 2 opens on Gojo's high school days and closes on the destruction of Shibuya. Between them: fifteen episodes that will define the studio for a decade.",
      "The Hidden Inventory arc reframes Gojo as a person, not a punchline. Shibuya reframes the entire cast as vulnerable in a way early Season 1 never let them be. Nanami, Nobara, Kento — none of these losses are cheap.",
      "9/10. Watch it with the Japanese track and the volume up.",
    ],
    related: ["jujutsu-kaisen"] },
  { slug: "top-10-anime-2026", section: "top-lists", title: "The 10 Best Anime Right Now (2026)",
    excerpt: "Every entry currently airing, streaming, or one click away.",
    author: "aiko-tanaka", date: "2026-01-18", tag: "Top List",
    cover: g("#ef4444", "#7c5cff"),
    body: [
      "This is not a nostalgia list. Every anime here is currently airing, currently streaming, or currently one movie away from being fully available.",
      "1. Frieren. 2. One Piece. 3. Attack on Titan. 4. Jujutsu Kaisen. 5. Demon Slayer. 6. Fullmetal Alchemist: Brotherhood. 7. Hunter x Hunter. 8. Chainsaw Man. 9. Solo Leveling. 10. Spy x Family.",
    ],
    related: ["frieren", "one-piece", "attack-on-titan", "jujutsu-kaisen", "demon-slayer", "fullmetal-alchemist-brotherhood", "hunter-x-hunter", "chainsaw-man", "solo-leveling", "spy-x-family"] },
  { slug: "chainsaw-man-reze-arc-preview", section: "news", title: "Chainsaw Man: Reze Arc Film Confirmed for Global IMAX",
    excerpt: "MAPPA and Sony's rollout plan is more aggressive than Mugen Train's.",
    author: "marcus-oduya", date: "2026-01-05", tag: "News",
    cover: g("#a11d1d", "#3a0a0a"),
    body: [
      "The Reze Arc film releases in a wider IMAX footprint than any prior MAPPA project. Global day-and-date is on the table.",
      "The film adapts a self-contained arc that many manga readers rank as Chainsaw Man's best. Expect one of the year's biggest weekend openings.",
    ],
    related: ["chainsaw-man"] },
  { slug: "solo-leveling-s2-review", section: "reviews", title: "Solo Leveling Season 2 Review: The Power Fantasy Grows Up",
    excerpt: "A-1 Pictures delivers the setpiece the first season promised.",
    author: "juno-park", date: "2025-12-14", tag: "Review",
    cover: g("#0a1030", "#5b1eab"),
    body: [
      "Jeju Island is what a Solo Leveling arc should look like at full budget: dozens of hunters, one Ant King, and a boss fight paced like a Hollywood third act.",
      "Sung Jinwoo is starting to feel less like a video-game character and more like a person carrying a family, a company, and a country. That's the difference between Season 1 and Season 2.",
      "8.4/10.",
    ],
    related: ["solo-leveling"] },
  { slug: "spy-x-family-cruise-arc", section: "editorial", title: "Yor Forger's Cruise Arc Is the Best Fight Choreography in Family Anime",
    excerpt: "The show plays its comedy straight until it can't, and then it plays it like a Hong Kong film.",
    author: "juno-park", date: "2025-11-22", tag: "Editorial",
    cover: g("#0a1a5b", "#8a2fc9"),
    body: [
      "The Cruise Adventure is a comedy arc that turns into a knife-fight arc without ever losing the tone that makes Spy x Family work.",
      "Yor's character is finally treated with the seriousness her occupation demands, and CloverWorks doesn't blink.",
    ],
    related: ["spy-x-family"] },
];

/** Legacy `section` → navigation category fallback. */
const SECTION_CATEGORY: Record<Article["section"], CategorySlug> = {
  news: "news",
  reviews: "reviews",
  guides: "gaming-guides",
  "top-lists": "gaming-guides",
  editorial: "action",
};

export const categoryForArticle = (a: Article): CategorySlug =>
  a.category ?? SECTION_CATEGORY[a.section];

/** Every published editorial item, newest first. */
export const articles: Article[] = [...coreArticles, ...longformArticles, ...extraArticles].sort((a, b) =>
  b.date.localeCompare(a.date),
);


export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const listArticles = (section?: Article["section"]) =>
  section ? articles.filter((a) => a.section === section) : articles;
export const listByCategory = (category: CategorySlug) =>
  articles.filter((a) => categoryForArticle(a) === category);
export const articleTags = (a: Article): string[] => a.tags ?? [a.tag.toLowerCase()];
export const listByTag = (tag: string) =>
  articles.filter((a) => articleTags(a).includes(tag.toLowerCase()));
/** All tags across the catalogue, most used first. */
export const allTags = (): { tag: string; count: number }[] => {
  const counts = new Map<string, number>();
  for (const a of articles) for (const t of articleTags(a)) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((x, y) => y.count - x.count || x.tag.localeCompare(y.tag));
};
export const getAuthor = (slug: string) => authors.find((a) => a.slug === slug);
