/**
 * Automated internal linking network.
 *
 * Builds a link graph across anime, articles, characters, genres, studios and
 * category hubs, then hands each page a deterministic set of related links.
 *
 * Dead-link pruning: every candidate target is validated against the content
 * registry before it is returned, so a removed or unpublished record can never
 * leave a 404 behind in the crawler path.
 */
import {
  publishedAnime,
  publishedArticles,
  publishedCharacters,
  allGenres,
  allStudios,
} from "@/lib/content-registry";
import { categorySlugs } from "@/data/categories";

export interface LinkNode {
  path: string;
  label: string;
  kind: "anime" | "article" | "character" | "genre" | "studio" | "category" | "hub";
  /** Tokens used for relatedness scoring (genres, tags, franchise, studio). */
  topics: string[];
}

const STATIC_HUBS: LinkNode[] = [
  { path: "/browse", label: "All Anime", kind: "hub", topics: ["browse", "catalog"] },
  { path: "/explore", label: "Explore & Filter", kind: "hub", topics: ["browse", "filter"] },
  { path: "/trending", label: "Trending Now", kind: "hub", topics: ["trending"] },
  { path: "/top-rated", label: "Top Rated Anime", kind: "hub", topics: ["ranking", "top"] },
  { path: "/seasonal", label: "Seasonal Simulcasts", kind: "hub", topics: ["seasonal"] },
  { path: "/watch-order", label: "Watch Orders", kind: "hub", topics: ["guide", "watch-order"] },
  { path: "/power-scaling", label: "Power Scaling", kind: "hub", topics: ["power", "analysis"] },
  { path: "/recommendations", label: "Recommendations", kind: "hub", topics: ["recommendation"] },
  { path: "/guides", label: "Anime Guides", kind: "hub", topics: ["guide"] },
  { path: "/reviews", label: "Reviews", kind: "hub", topics: ["review"] },
  { path: "/rewards/anime-wallpapers", label: "Free Anime Wallpapers", kind: "hub", topics: ["wallpaper", "art", "download"] },
  { path: "/anime/dandadan", label: "Dandadan Complete Guide", kind: "hub", topics: ["dandadan", "yokai", "aliens", "episodes"] },
  { path: "/anime/dandadan/episode-guide", label: "Dandadan Episode Guide", kind: "hub", topics: ["dandadan", "episodes", "arcs"] },
  { path: "/anime/dandadan/characters", label: "Dandadan Characters", kind: "hub", topics: ["dandadan", "characters", "relationships"] },
  { path: "/anime/dandadan/occult-world", label: "Dandadan Powers Explained", kind: "hub", topics: ["dandadan", "yokai", "aliens", "powers"] },
  { path: "/anime/dandadan/watch-guide", label: "How to Watch Dandadan", kind: "hub", topics: ["dandadan", "watch-order", "beginner"] },
  { path: "/anime/sakamoto-days", label: "Sakamoto Days Complete Guide", kind: "hub", topics: ["sakamoto days", "assassins", "episodes"] },
  { path: "/anime/sakamoto-days/episode-guide", label: "Sakamoto Days Episode Guide", kind: "hub", topics: ["sakamoto days", "episodes", "missions"] },
  { path: "/anime/sakamoto-days/characters", label: "Sakamoto Days Characters", kind: "hub", topics: ["sakamoto days", "characters", "order"] },
  { path: "/anime/sakamoto-days/assassin-world", label: "Sakamoto Days Assassin World", kind: "hub", topics: ["sakamoto days", "jaa", "order", "powers"] },
  { path: "/anime/sakamoto-days/watch-guide", label: "How to Watch Sakamoto Days", kind: "hub", topics: ["sakamoto days", "watch-order", "beginner"] },
  { path: "/gaming-hub/ultimate-gaming-secrets-guide", label: "Gaming Secrets, Settings & Walkthrough Guide", kind: "hub", topics: ["anime games", "nintendo", "settings", "walkthrough", "puzzles"] },
  { path: "/gaming-hub/genshin-impact-ultimate-guide", label: "Genshin Impact Ultimate Guide", kind: "hub", topics: ["genshin impact", "spiral abyss", "settings", "walkthrough", "farming"] },
  { path: "/gaming-hub/honkai-star-rail-ultimate-guide", label: "Honkai Star Rail Ultimate Guide", kind: "hub", topics: ["honkai star rail", "endgame", "builds", "settings", "farming"] },
  { path: "/gaming-hub/ultimate-anime-gaming-hub-2026", label: "Ultimate Anime and Gaming Hub 2026", kind: "hub", topics: ["anime streaming", "episode schedules", "receivers", "game walkthroughs", "hardware troubleshooting"] },
];

let cache: { nodes: LinkNode[]; valid: Set<string> } | null = null;

function norm(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, "-");
}

/** Full, validated node list for the site. Computed once per runtime. */
export function linkGraph(): { nodes: LinkNode[]; valid: Set<string> } {
  if (cache) return cache;

  const nodes: LinkNode[] = [...STATIC_HUBS];

  for (const a of publishedAnime()) {
    const rec = a as unknown as { genres?: string[]; studio?: string; franchise?: string };
    nodes.push({
      path: `/anime/${a.slug}`,
      label: a.title,
      kind: "anime",
      topics: [
        ...(rec.genres ?? []).map(norm),
        ...(rec.studio ? [norm(rec.studio)] : []),
        ...(rec.franchise ? [norm(rec.franchise)] : []),
        norm(a.title),
      ],
    });
  }

  for (const art of publishedArticles()) {
    const rec = art as unknown as { tags?: string[]; category?: string; section?: string; title: string };
    nodes.push({
      path: `/article/${art.slug}`,
      label: rec.title,
      kind: "article",
      topics: [
        ...(rec.tags ?? []).map(norm),
        ...(rec.category ? [norm(rec.category)] : []),
        ...(rec.section ? [norm(rec.section)] : []),
      ],
    });
  }

  for (const c of publishedCharacters()) {
    const rec = c as unknown as { name: string; animeSlug?: string; anime?: string };
    nodes.push({
      path: `/character/${c.slug}`,
      label: rec.name,
      kind: "character",
      topics: [norm(rec.animeSlug ?? rec.anime ?? ""), norm(rec.name)].filter(Boolean),
    });
  }

  for (const g of allGenres())
    nodes.push({ path: `/genre/${g.slug}`, label: `${g.name} Anime`, kind: "genre", topics: [norm(g.slug), norm(g.name)] });

  for (const s of allStudios())
    nodes.push({ path: `/studio/${s.slug}`, label: s.name, kind: "studio", topics: [norm(s.slug), norm(s.name)] });

  for (const slug of categorySlugs())
    nodes.push({ path: `/category/${slug}`, label: `${slug.replace(/-/g, " ")} hub`, kind: "category", topics: [norm(slug)] });

  const valid = new Set(nodes.map((n) => n.path));
  cache = { nodes, valid };
  return cache;
}

/** True when a path resolves to a live, published page in the graph. */
export function isLiveLink(path: string): boolean {
  return linkGraph().valid.has(path.replace(/\/+$/, "") || "/");
}

/** Removes any link whose target no longer exists (auto dead-link pruning). */
export function pruneDeadLinks<T extends { to: string }>(links: T[]): T[] {
  return links.filter((l) => l.to.startsWith("/") && (isLiveLink(l.to) || !l.to.match(/^\/(anime|article|character|genre|studio|category)\//)));
}

export interface RelatedLink {
  to: string;
  label: string;
  kind: LinkNode["kind"];
}

/**
 * Deterministic related-link set for a page: highest topic overlap first,
 * diversified across content kinds so every page links out to at least one
 * anime, one article and one taxonomy hub where possible.
 */
export function relatedLinks(
  currentPath: string,
  topics: string[],
  limit = 8,
): RelatedLink[] {
  const { nodes } = linkGraph();
  const wanted = new Set(topics.map(norm).filter(Boolean));

  const scored = nodes
    .filter((n) => n.path !== currentPath)
    .map((n) => {
      let score = n.topics.reduce((acc, t) => acc + (wanted.has(t) ? 2 : 0), 0);
      if (n.kind === "hub") score += 0.5;
      return { node: n, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.node.path.localeCompare(b.node.path));

  const out: RelatedLink[] = [];
  const perKind = new Map<LinkNode["kind"], number>();
  for (const { node } of scored) {
    const used = perKind.get(node.kind) ?? 0;
    if (used >= 3) continue;
    perKind.set(node.kind, used + 1);
    out.push({ to: node.path, label: node.label, kind: node.kind });
    if (out.length >= limit) break;
  }

  // Backfill with evergreen hubs so no page is a crawl dead end.
  for (const hub of STATIC_HUBS) {
    if (out.length >= limit) break;
    if (hub.path === currentPath || out.some((l) => l.to === hub.path)) continue;
    out.push({ to: hub.path, label: hub.label, kind: "hub" });
  }

  return out;
}
