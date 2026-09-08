import { createFileRoute } from "@tanstack/react-router";
import { collectionSchema } from "@/lib/seo";
import { useMemo } from "react";
import {
  populatedGenres,
  populatedStudios,
  publishedAnime,
} from "@/lib/content-registry";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";
import { AdSlot } from "@/components/ad-slot";
import { Filter, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Sort = "rating" | "year" | "popularity" | "title";
type BrowseSearch = {
  page?: number;
  q?: string;
  genre?: string;
  studio?: string;
  status?: string;
  decade?: string;
  sort?: Sort;
};

type ProgrammaticPage = { slug: string; title: string | null };

const parseSort = (value: unknown): Sort | undefined =>
  value === "year" || value === "popularity" || value === "title"
    ? value
    : undefined;

const parseSearch = (search: Record<string, unknown>): BrowseSearch => ({
  page: Math.max(1, Number(search.page) || 1),
  q: typeof search.q === "string" && search.q.trim() ? search.q : undefined,
  genre:
    typeof search.genre === "string" && search.genre !== "all"
      ? search.genre
      : undefined,
  studio:
    typeof search.studio === "string" && search.studio !== "all"
      ? search.studio
      : undefined,
  status:
    typeof search.status === "string" && search.status !== "all"
      ? search.status
      : undefined,
  decade:
    typeof search.decade === "string" && search.decade !== "all"
      ? search.decade
      : undefined,
  sort: parseSort(search.sort),
});

export const Route = createFileRoute("/browse")({
  validateSearch: parseSearch,
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ deps }) => {
    const page = deps.page ?? 1;
    const pageSize = 36;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    try {
      const { data, count } = await supabase
        .from("generated_pages")
        .select("slug, title", { count: "exact" })
        .order("slug", { ascending: true })
        .range(from, to);

      return {
        programmaticPages: (data || []) as ProgrammaticPage[],
        totalProgrammaticPages: count || 0,
        page,
        pageSize,
      };
    } catch (error) {
      console.error("Browse catalog error:", error);
      return {
        programmaticPages: [],
        totalProgrammaticPages: 0,
        page,
        pageSize,
      };
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/browse" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        title:
          "Browse Anime by Genre, Studio, Year & Status · GameCastle Anime",
      },
      {
        name: "description",
        content:
          "Search the GameCastle Anime library and filter published anime guides by genre, studio, status, decade, rating and title.",
      },
      { property: "og:title", content: "Browse Anime · GameCastle Anime" },
      {
        property: "og:description",
        content:
          "Search and filter GameCastle Anime's published series guides.",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `https://gamecastle.store/browse${(loaderData?.page ?? 1) > 1 ? `?page=${loaderData?.page}` : ""}`,
      },
      ...((loaderData?.page ?? 1) > 1
        ? [{ rel: "prev", href: `https://gamecastle.store/browse?page=${(loaderData?.page ?? 1) - 1}` }]
        : []),
      ...((loaderData?.page ?? 1) < Math.ceil((loaderData?.totalProgrammaticPages ?? 0) / (loaderData?.pageSize ?? 36))
        ? [{ rel: "next", href: `https://gamecastle.store/browse?page=${(loaderData?.page ?? 1) + 1}` }]
        : []),
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          collectionSchema({
            path: "/browse",
            name: "Browse Anime — GameCastle Anime Library",
            description:
              "Search and filter published anime guides by genre, studio, status and decade.",
          }),
        ),
      },
    ],
  }),
  component: Browse,
});

function Browse() {
  const search = Route.useSearch();
  const {
    programmaticPages,
    totalProgrammaticPages,
    page,
    pageSize,
  } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const anime = publishedAnime();
  const genres = populatedGenres();
  const studios = populatedStudios();

  const q = search.q ?? "";
  const genre = search.genre ?? "all";
  const studio = search.studio ?? "all";
  const status = search.status ?? "all";
  const decade = search.decade ?? "all";
  const sort = search.sort ?? "rating";
  const totalPages = Math.ceil(totalProgrammaticPages / pageSize);

  const decades = useMemo(
    () =>
      Array.from(
        new Set(anime.map((item) => Math.floor(item.year / 10) * 10)),
      ).sort((a, b) => b - a),
    [anime],
  );

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return anime
      .filter((item) => {
        if (
          needle &&
          !`${item.title} ${item.japaneseTitle ?? ""} ${item.tagline}`
            .toLowerCase()
            .includes(needle)
        )
          return false;
        if (genre !== "all" && !item.genres.includes(genre)) return false;
        if (studio !== "all" && item.studio !== studio) return false;
        if (status !== "all" && item.status !== status) return false;
        if (
          decade !== "all" &&
          Math.floor(item.year / 10) * 10 !== Number(decade)
        )
          return false;
        return true;
      })
      .sort((a, b) =>
        sort === "year"
          ? b.year - a.year
          : sort === "popularity"
            ? a.popularity - b.popularity
            : sort === "title"
              ? a.title.localeCompare(b.title)
              : b.rating - a.rating,
      );
  }, [anime, q, genre, studio, status, decade, sort]);

  const update = (patch: Partial<BrowseSearch>) =>
    navigate({
      search: (previous: BrowseSearch) => ({ ...previous, ...patch }),
      replace: true,
    });

  const active =
    [genre, studio, status, decade].filter((value) => value !== "all").length +
    (q ? 1 : 0);

  const selectClass =
    "rounded-lg border border-border bg-secondary/60 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Browse" }]} />
      <h1 className="font-display text-4xl font-bold sm:text-5xl">
        Find your next anime
      </h1>
      <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
        Search every published GameCastle guide, then combine genre, studio,
        status and decade filters. Your selections stay in the URL, so you can
        bookmark or share the result.
      </p>

      <div className="mt-8 rounded-2xl border border-border/60 bg-card/50 p-4 shadow-sm">
        <label className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
          <Search
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="sr-only">Search anime</span>
          <input
            value={q}
            onChange={(event) => update({ q: event.target.value || undefined })}
            placeholder="Search titles, Japanese names and taglines…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Filter
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <select
            value={genre}
            onChange={(event) =>
              update({
                genre:
                  event.target.value === "all" ? undefined : event.target.value,
              })
            }
            className={selectClass}
            aria-label="Genre"
          >
            <option value="all">All genres</option>
            {genres.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            value={studio}
            onChange={(event) =>
              update({
                studio:
                  event.target.value === "all" ? undefined : event.target.value,
              })
            }
            className={selectClass}
            aria-label="Studio"
          >
            <option value="all">All studios</option>
            {studios.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) =>
              update({
                status:
                  event.target.value === "all" ? undefined : event.target.value,
              })
            }
            className={selectClass}
            aria-label="Status"
          >
            <option value="all">Any status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
          </select>
          <select
            value={decade}
            onChange={(event) =>
              update({
                decade:
                  event.target.value === "all" ? undefined : event.target.value,
              })
            }
            className={selectClass}
            aria-label="Decade"
          >
            <option value="all">Any decade</option>
            {decades.map((value) => (
              <option key={value} value={value}>
                {value}s
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(event) =>
              update({
                sort:
                  event.target.value === "rating"
                    ? undefined
                    : parseSort(event.target.value),
              })
            }
            className={selectClass}
            aria-label="Sort order"
          >
            <option value="rating">Sort: Rating</option>
            <option value="year">Sort: Newest</option>
            <option value="popularity">Sort: Popularity</option>
            <option value="title">Sort: A–Z</option>
          </select>
          {active > 0 && (
            <button
              type="button"
              onClick={() => navigate({ search: {}, replace: true })}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" /> Clear filters
            </button>
          )}
          <div
            className="ml-auto text-sm text-muted-foreground"
            aria-live="polite"
          >
            {list.length} {list.length === 1 ? "result" : "results"}
          </div>
        </div>
      </div>

      <div
        className="mt-6 flex flex-wrap gap-2"
        aria-label="Popular genre filters"
      >
        {genres.slice(0, 12).map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() =>
              update({ genre: genre === item.slug ? undefined : item.slug })
            }
            className={`rounded-full border px-3 py-1 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              genre === item.slug
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-secondary/50 hover:border-primary/60"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <AdSlot placement="between" />

      <section className="mt-8" aria-labelledby="programmatic-catalog-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="programmatic-catalog-heading" className="font-display text-2xl font-bold">
              Full anime catalog
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {totalProgrammaticPages.toLocaleString()} published pages, listed alphabetically.
            </p>
          </div>
          <span className="text-sm text-muted-foreground" aria-live="polite">
            Page {page} of {totalPages || 1}
          </span>
        </div>

        {programmaticPages.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {programmaticPages.map((item) => (
              <a
                key={item.slug}
                href={`/${item.slug}`}
                className="rounded-xl border border-border/60 bg-card/50 p-4 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                {item.title || item.slug}
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-border/60 bg-card/50 p-6 text-sm text-muted-foreground">
            The full catalog is temporarily unavailable. Please try again shortly.
          </p>
        )}

        <nav className="mt-6 flex items-center justify-between border-t border-border/60 pt-4" aria-label="Full catalog pagination">
          <div className="flex items-center gap-2">
            {page > 2 ? <a href="/browse" className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:border-primary hover:text-primary">First</a> : null}
            {page > 1 ? <a href={`/browse?page=${page - 1}`} className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:border-primary hover:text-primary">Previous</a> : null}
          </div>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages || 1}</span>
          <div className="flex items-center gap-2">
            {page < totalPages ? <a href={`/browse?page=${page + 1}`} className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:border-primary hover:text-primary">Next</a> : null}
            {page < totalPages - 1 ? <a href={`/browse?page=${totalPages}`} className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:border-primary hover:text-primary">Last</a> : null}
          </div>
        </nav>
      </section>

      {list.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {list.map((item) => (
            <AnimeCard key={item.slug} anime={item} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-border/60 bg-card/50 p-10 text-center">
          <p className="text-lg font-semibold">
            No published guides match those filters.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Clear one or more filters to return to the full library.
          </p>
          <button
            type="button"
            onClick={() => navigate({ search: {}, replace: true })}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Show all anime
          </button>
        </div>
      )}
    </div>
  );
}
