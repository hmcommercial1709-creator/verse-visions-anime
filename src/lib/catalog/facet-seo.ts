import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";
import type { CatalogType, FacetEntry } from "./matrix";
import type { FacetPageData } from "./facet-loader";
import { parseMeta } from "./catalog-facts";
import { hasArabicEdition } from "./facet-i18n";

/**
 * Titles, descriptions and on-page text for an intersection.
 *
 * The risk a matrix carries is that 400 pages share one sentence with the
 * nouns swapped — which reads as templated to a person and as scaled content
 * to Google. The defence is the same one the detail pages use: say things
 * computed from what is actually in this intersection. The row count, the
 * score range, the span of years, the studios that recur, the longest and
 * shortest entry — those differ per page because the contents differ, and
 * they cannot be produced by filling a blank.
 *
 * Every statement is omitted when its input is missing. A facet whose rows
 * carry no scores gets no score sentence.
 */

const label = (part: { dim: string; value: string }) => {
  if (part.dim === "platform") {
    return { windows: "Windows", mac: "macOS", linux: "Linux" }[part.value] ?? part.value;
  }
  if (part.dim === "season") {
    const [season, year] = part.value.split(" ");
    const seasons: Record<string, string> = {
      WINTER: "Winter",
      SPRING: "Spring",
      SUMMER: "Summer",
      FALL: "Autumn",
    };
    return `${seasons[season] ?? season} ${year}`;
  }
  return part.value;
};

/** "Action anime from Madhouse, 2020" — reads as a phrase, not a path. */
export function facetTitle(type: CatalogType, entry: FacetEntry): string {
  const noun = type === "game" ? "games" : type === "manga" ? "manga" : "anime";
  const by = (dim: string) => entry.parts.find((p) => p.dim === dim);
  const genre = by("genre");
  const studio = by("studio");
  const platform = by("platform");
  const year = by("year");
  const season = by("season");
  const format = by("format");

  let head = genre ? `${label(genre)} ${noun}` : noun.charAt(0).toUpperCase() + noun.slice(1);
  if (format) head = `${label(format)} ${head}`;
  const tail: string[] = [];
  if (studio) tail.push(type === "game" ? `by ${label(studio)}` : `from ${label(studio)}`);
  if (platform) tail.push(`on ${label(platform)}`);
  if (season) tail.push(`— ${label(season)}`);
  else if (year) tail.push(`(${label(year)})`);

  return [head, ...tail].join(" ");
}

/**
 * The computed paragraph. Same rule as everywhere else in this pipeline: each
 * clause is produced only when the rows support it.
 */
export function facetStatements(type: CatalogType, data: FacetPageData): string[] {
  const noun = type === "game" ? "games" : type === "manga" ? "series" : "titles";
  const out: string[] = [];
  const metas = data.rows.map((r) => parseMeta(r.metadata)).filter(Boolean);

  out.push(
    `This intersection holds ${data.total.toLocaleString()} ${noun} in the GameCastle catalog.`,
  );

  const scores = metas
    .map((m) => m?.averageScore ?? m?.metacritic ?? null)
    .filter((s): s is number => typeof s === "number" && s > 0);
  if (scores.length >= 3) {
    const sorted = [...scores].sort((a, b) => a - b);
    const mid = sorted[sorted.length >> 1];
    out.push(
      `Scores across the ${scores.length} rated entries on this page run from ${sorted[0]} to ${sorted[sorted.length - 1]}, with a median of ${mid}.`,
    );
  }

  const years = metas
    .map((m) => m?.seasonYear ?? m?.releaseYear ?? m?.startYear ?? null)
    .filter((y): y is number => typeof y === "number");
  if (years.length >= 3) {
    const min = Math.min(...years);
    const max = Math.max(...years);
    if (min !== max) out.push(`They span ${min} to ${max}.`);
  }

  const makers = new Map<string, number>();
  for (const m of metas) {
    const primary = (m?.studios ?? []).find((s) => s.isMain) ?? m?.studios?.[0];
    const name = primary?.name ?? m?.developers?.[0];
    if (name) makers.set(name, (makers.get(name) ?? 0) + 1);
  }
  const top = [...makers].sort((a, b) => b[1] - a[1]).slice(0, 3);
  if (top.length >= 2 && top[0][1] > 1) {
    const word = type === "game" ? "developers" : type === "manga" ? "authors" : "studios";
    out.push(
      `The most frequent ${word} here are ${top.map(([n, c]) => `${n} (${c})`).join(", ")}.`,
    );
  }

  return out;
}

export function facetHead(type: CatalogType, data: FacetPageData | undefined) {
  if (!data) return { meta: [] };
  const title = facetTitle(type, data.entry);
  const url = absoluteUrl(data.canonical);
  const statements = facetStatements(type, data);
  const description = statements.slice(0, 2).join(" ").slice(0, 300);
  const parentPath = type === "game" ? "/catalog/games" : type === "manga" ? "/manga" : "/anime";
  const parentName =
    type === "game" ? "Game Catalog" : type === "manga" ? "Manga Catalog" : "Anime Catalog";

  return {
    meta: [
      { title: `${title} | GameCastle` },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
    ],
    links: [
      // One canonical, built from the index's own ordering, so every spelling
      // of this intersection points at the same URL.
      { rel: "canonical", href: url },
      // The Arabic alternate is declared only where an Arabic page actually
      // exists — an hreflang pointing at a 404 drops the whole cluster, and
      // one declared from only one side is ignored anyway. Anime only: there
      // is no /ar games edition.
      ...(type === "anime" && hasArabicEdition(data.entry)
        ? [
            { rel: "alternate", hrefLang: "ar", href: absoluteUrl(`/ar${data.canonical}`) },
            { rel: "alternate", hrefLang: "en", href: url },
            { rel: "alternate", hrefLang: "x-default", href: url },
          ]
        : []),
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { path: "/", name: "Home" },
            { path: parentPath, name: parentName },
            { name: title },
          ]),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          url,
          description,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: data.total,
            itemListElement: data.rows.slice(0, 20).map((row, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: row.name,
              url: absoluteUrl(
                type === "game"
                  ? `/catalog/games/${row.slug}`
                  : type === "manga"
                    ? `/catalog/manga/${row.slug}`
                    : `/catalog/anime/${row.slug}`,
              ),
            })),
          },
        }),
      },
    ],
  };
}
