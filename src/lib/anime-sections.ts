import { getAnimeBySlug, charactersForAnime, publishedAnime } from "@/lib/content-registry";

/**
 * Per-series section pages (/anime/:slug/:section).
 *
 * The quality gate is the point of this module: a section only exists when
 * the series actually carries content for it. There is no template that
 * renders "no reviews yet" or an empty watch order — `sectionsFor` returns
 * only sections with real data behind them, and the route 404s on anything
 * else. That keeps the generated surface honest rather than multiplying
 * every series by every possible section.
 */

export const SECTION_KEYS = ["watch-order", "characters", "story-arcs", "soundtrack", "faq"] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export function isSectionKey(value: string): value is SectionKey {
  return (SECTION_KEYS as readonly string[]).includes(value);
}

export interface SectionMeta {
  key: SectionKey;
  label: string;
  /** Used in <title> and the H1, filled with the series title. */
  heading: (title: string) => string;
  description: (title: string) => string;
}

export const SECTION_META: Record<SectionKey, SectionMeta> = {
  "watch-order": {
    key: "watch-order",
    label: "Watch order",
    heading: (t) => `${t} watch order`,
    description: (t) => `The correct order to watch ${t}, including seasons, films and specials.`,
  },
  characters: {
    key: "characters",
    label: "Characters",
    heading: (t) => `${t} characters`,
    description: (t) => `Main and supporting characters in ${t}, with roles and background.`,
  },
  "story-arcs": {
    key: "story-arcs",
    label: "Story arcs",
    heading: (t) => `${t} story arcs`,
    description: (t) => `Every arc in ${t} in order, with episode ranges and spoiler-light summaries.`,
  },
  soundtrack: {
    key: "soundtrack",
    label: "Soundtrack",
    heading: (t) => `${t} soundtrack`,
    description: (t) => `Opening themes, ending themes and score from ${t}, with artists.`,
  },
  faq: {
    key: "faq",
    label: "FAQ",
    heading: (t) => `${t} FAQ`,
    description: (t) => `Common questions about ${t} answered by the GameCastle editorial desk.`,
  },
};

/** Sections this series genuinely has content for — never a guess. */
export function sectionsFor(slug: string): SectionKey[] {
  const anime = getAnimeBySlug(slug);
  if (!anime) return [];

  const available: SectionKey[] = [];
  if (anime.watchOrder?.length) available.push("watch-order");
  if (charactersForAnime(slug).length > 0) available.push("characters");
  if (anime.arcs?.length) available.push("story-arcs");
  if (anime.soundtrack?.length) available.push("soundtrack");
  if (anime.faq?.length) available.push("faq");
  return available;
}

export function hasSection(slug: string, section: SectionKey): boolean {
  return sectionsFor(slug).includes(section);
}

/** Every real (slug, section) pair across the catalogue — used by the sitemap. */
export function allSectionPaths(): { slug: string; section: SectionKey }[] {
  return publishedAnime().flatMap((anime) =>
    sectionsFor(anime.slug).map((section) => ({ slug: anime.slug, section })),
  );
}
