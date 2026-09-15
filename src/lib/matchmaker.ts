import { publishedAnime } from "@/lib/content-registry";
import { publishedArticleList } from "@/data/articles";
import { SECTION_META, sectionsFor, type SectionKey } from "@/lib/anime-sections";
import { animeGames, type AnimeGame } from "@/data/gaming-hub";

/**
 * The Cross-Media Matchmaker.
 *
 * Picks a mood, gets a bundle: an anime we have written a guide for, a game
 * from the catalog, and an editorial piece to read. The whole value of it is
 * that the three belong together — so every slot in a bundle carries the tag
 * it was matched on, and a slot with no genuine match is left empty rather
 * than filled.
 *
 * That is not a style choice. A matchmaker that always returns three things
 * is a random shuffler with a nicer label: the reader cannot tell a real
 * pairing from a filler one, so none of them mean anything. An empty game
 * slot that says "no game in the catalog shares these tags" is worth more
 * than a game that does not fit.
 *
 * MOOD_TAGS is constrained to the genre vocabulary the anime data actually
 * uses. check-matchmaker.mjs fails the build on a tag no anime carries,
 * because a mood mapped to an invented genre matches nothing and silently
 * makes its whole bundle empty.
 */

export interface Mood {
  id: string;
  label: string;
  blurb: string;
  /** Genres from the real anime vocabulary. Never invented. */
  tags: string[];
  /** Emoji used as the button's face; decorative only. */
  face: string;
}

export const MOODS: Mood[] = [
  {
    id: "adrenaline",
    label: "I want adrenaline",
    blurb: "Fights, stakes, momentum. Nothing contemplative.",
    tags: ["action", "shonen", "sports"],
    face: "⚡",
  },
  {
    id: "wonder",
    label: "Take me somewhere else",
    blurb: "Other worlds, magic systems, things that could not happen here.",
    tags: ["fantasy", "magic", "adventure", "supernatural"],
    face: "🌍",
  },
  {
    id: "unsettle",
    label: "Unsettle me",
    blurb: "Dread, mind games, endings you argue about afterwards.",
    tags: ["psychological", "horror", "mystery", "drama"],
    face: "🌑",
  },
  {
    id: "lighten",
    label: "Something lighter",
    blurb: "Warmth, jokes, low stakes. A day off from plot armour.",
    tags: ["comedy", "slice-of-life", "school", "family"],
    face: "🌤️",
  },
  {
    id: "think",
    label: "Make me think",
    blurb: "Ideas, consequences, worlds built on a premise.",
    tags: ["sci-fi", "historical", "psychological", "drama"],
    face: "🧠",
  },
];

/** Every tag any mood can ask for — the guard checks these are all real. */
export const MOOD_TAGS: string[] = [...new Set(MOODS.flatMap((m) => m.tags))];

export interface BundleSlot<T> {
  item: T | null;
  /** Which tag put it here, so the pairing is never something to take on trust. */
  matchedOn: string | null;
  /** Every tag shared with the mood, so a one-tag match reads as the weak
   *  match it is rather than looking the same as a four-tag one. */
  allMatched?: string[];
  /** Said out loud when the slot is empty, instead of leaving a gap. */
  emptyReason?: string;
}

export interface AnimePick {
  slug: string;
  title: string;
  synopsis: string;
  genres: string[];
}

/**
 * The editorial slot is either a published article or one of our own guide
 * sections for the chosen series.
 *
 * Both are real editorial and both are tied to the anime in the same bundle;
 * the article is preferred because it is long-form. The section fallback
 * exists because articles mentioning a specific series covered only about a
 * quarter of the possible bundles, and an empty slot three times out of four
 * is a worse answer than a watch-order guide that definitely exists.
 */
export type EditorialPick =
  | { kind: "article"; slug: string; title: string; excerpt: string }
  | { kind: "section"; slug: string; section: SectionKey; title: string; excerpt: string };

/** Deterministic pick from a list, so a given mood+day is stable for everyone. */
export function pickFrom<T>(items: T[], seed: number): T | null {
  if (!items.length) return null;
  return items[Math.abs(seed) % items.length];
}

/** A day number, so the bundle rotates daily rather than on every render. */
export function daySeed(now = new Date()): number {
  return Math.floor(now.getTime() / 86_400_000);
}

/**
 * The anime slot: one of our own guides carrying a tag this mood asked for.
 *
 * Restricted to guides we wrote, not the whole 7,000-row catalog. The bundle
 * promises "with watch-order guides and details", and only these 23 have one.
 */
export function matchAnime(tags: string[], seed: number): BundleSlot<AnimePick> {
  const scored = publishedAnime()
    .map((a) => {
      const genres = (a.genres ?? []).map((g) => g.toLowerCase());
      return {
        pick: { slug: a.slug, title: a.title, synopsis: a.synopsis ?? "", genres },
        shared: genres.filter((g) => tags.includes(g)),
      };
    })
    .filter((row) => row.shared.length > 0);

  if (!scored.length) {
    return {
      item: null,
      matchedOn: null,
      emptyReason: "No guide we have written carries these genres yet.",
    };
  }

  // Only the strongest overlap is eligible, not everything with one tag in
  // common. Matching on ANY tag put Haikyuu!! under "Unsettle me" because it
  // carries `drama` — technically true, and a bad recommendation. Ranking by
  // how many of the mood's tags a title carries is what makes the pairing
  // mean something.
  const best = Math.max(...scored.map((row) => row.shared.length));
  const top = scored.filter((row) => row.shared.length === best);
  const chosen = pickFrom(top, seed);
  if (!chosen) {
    return { item: null, matchedOn: null, emptyReason: "No guide matched this mood." };
  }
  return { item: chosen.pick, matchedOn: chosen.shared[0], allMatched: chosen.shared };
}

/**
 * The editorial slot, matched on the anime actually chosen rather than on the
 * mood.
 *
 * Matching it to the mood independently produces three items that each fit the
 * mood and have nothing to do with each other. Tying the article to the anime
 * in the same bundle is what makes it a bundle.
 */
export function matchEditorial(anime: AnimePick | null, seed: number): BundleSlot<EditorialPick> {
  if (!anime) {
    return { item: null, matchedOn: null, emptyReason: "Nothing to pair an article with." };
  }

  const key = anime.title.toLowerCase();
  const about = publishedArticleList()
    .map((a) => ({
      kind: "article" as const,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt ?? "",
    }))
    .filter((a) => a.title.toLowerCase().includes(key) || a.excerpt.toLowerCase().includes(key));

  const article = pickFrom(about, seed);
  if (article) return { item: article, matchedOn: anime.title };

  // sectionsFor only returns sections this series genuinely has content for,
  // so this fallback can never advertise a page that is not written.
  const sections = sectionsFor(anime.slug);
  const section = pickFrom(sections, seed);
  if (!section) {
    return {
      item: null,
      matchedOn: null,
      emptyReason: `We have no article or guide section for ${anime.title} yet.`,
    };
  }
  const meta = SECTION_META[section];
  return {
    item: {
      kind: "section",
      slug: anime.slug,
      section,
      title: meta.heading(anime.title),
      excerpt: meta.description(anime.title),
    },
    matchedOn: anime.title,
  };
}

/** Catalog tags to try for the game slot, widest first. */
export function gameTagsFor(tags: string[]): string[] {
  // The catalog stores a game's genre and platform in `categories`, written by
  // the upstream APIs with initial capitals ("Fantasy", "Shooter"). Our anime
  // vocabulary is lowercase, so the two only meet through this normalisation.
  return [...new Set(tags.map((t) => t.charAt(0).toUpperCase() + t.slice(1)))];
}

/**
 * The game slot, strongest pairing first.
 *
 * A game OF the anime in the bundle beats a game that merely shares a genre
 * with it, and it is not close: pairing Dragon Ball Z with DRAGON BALL:
 * Sparking! ZERO is a recommendation, while pairing it with any other action
 * game is a coincidence dressed as one. src/data/gaming-hub.ts carries three
 * such licensed titles with their official publisher URLs, so the franchise
 * check runs first and the catalog is the fallback.
 *
 * The catalog half happens at request time in the route, because it is a
 * database query; this returns the franchise match or null so the caller knows
 * whether it still needs to look.
 */
export function matchFranchiseGame(anime: AnimePick | null): BundleSlot<AnimeGame> {
  if (!anime) return { item: null, matchedOn: null, emptyReason: "No series to match a game to." };

  const words = anime.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    // Short words match everything: "z" from "Dragon Ball Z" and "x" from
    // "Spy x Family" would pair almost any title with almost any game.
    .filter((w) => w.length >= 4);

  for (const game of animeGames) {
    const haystack = game.name.toLowerCase().replace(/[^a-z0-9]+/g, " ");
    // Two words in common, so "One Piece" matches ONE PIECE ODYSSEY but a
    // single shared word cannot carry a pairing on its own.
    const hits = words.filter((w) => haystack.includes(w));
    if (hits.length >= 2 || (words.length === 1 && hits.length === 1)) {
      return { item: game, matchedOn: hits.join(" "), allMatched: hits };
    }
  }
  return {
    item: null,
    matchedOn: null,
    emptyReason: `We have no licensed ${anime.title} game written up.`,
  };
}
