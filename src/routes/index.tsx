import { createFileRoute, Link } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { Sparkles, Gamepad2, BookOpen, ArrowRight } from "lucide-react";
import { publishedAnime } from "@/lib/content-registry";
import { publishedArticleList } from "@/data/articles";
import { supabase } from "@/integrations/supabase/client";
import { canonicalMeta, websiteSchema, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import { MysteryVault } from "@/components/mystery-vault/MysteryVault";

const ANIME_PREVIEW_LIMIT = 6;
const GAMES_PREVIEW_LIMIT = 6;
const STORIES_PREVIEW_LIMIT = 6;

type GamePreview = { slug: string; title: string };

export const Route = createFileRoute("/")({
  loader: async (): Promise<{ games: GamePreview[] }> => {
    try {
      const { data } = await supabase
        .from("game_nexus_matrix")
        .select("slug, title")
        .order("updated_at", { ascending: false })
        .range(0, GAMES_PREVIEW_LIMIT - 1);
      return { games: data ?? [] };
    } catch (error) {
      console.error("Homepage games preview error:", error);
      return { games: [] };
    }
  },
  head: () => {
    const { link, meta: canonicalOg } = canonicalMeta("/");
    return {
      meta: [
        { title: `${SITE_NAME} — Anime Guides, Game Codes & Stories` },
        { name: "description", content: SITE_DESCRIPTION },
        { property: "og:title", content: SITE_NAME },
        { property: "og:description", content: SITE_DESCRIPTION },
        { property: "og:type", content: "website" },
        canonicalOg,
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [link],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(websiteSchema()),
        },
      ],
    };
  },
  component: HomePage,
});

const CATEGORY_TABS = [
  {
    to: "/anime" as const,
    label: "Anime",
    icon: Sparkles,
    accent: "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30 hover:border-purple-500/60",
    description: "Guides, watch orders, characters and reviews for every series we cover.",
  },
  {
    to: "/games" as const,
    label: "Games",
    icon: Gamepad2,
    accent: "from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/30 hover:border-cyan-500/60",
    description: "Digital gift cards, top-up codes and activation guides, updated regularly.",
  },
  {
    to: "/blog" as const,
    label: "Stories",
    icon: BookOpen,
    accent: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30 hover:border-amber-500/60",
    description: "Long-form analysis, lore breakdowns and news from the editorial desk.",
  },
];

function HomePage() {
  const { games } = Route.useLoaderData();
  const anime = publishedAnime().slice(0, ANIME_PREVIEW_LIMIT);
  const stories = publishedArticleList().slice(0, STORIES_PREVIEW_LIMIT);

  return (
    <div>
      <header className="border-b border-border/60 bg-gradient-to-b from-primary/10 via-background to-background px-4 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-3xl space-y-5">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            GameCastle Anime
          </span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
            Anime, Games &amp; Stories — all in one place
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Watch-order guides, character deep dives, real gaming gift-card codes, and long-form
            editorial coverage of the series you care about.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="mb-12">
          <MysteryVault />
        </div>

        {/* Category tabs */}
        <nav aria-label="Browse by category" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CATEGORY_TABS.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className={`group flex flex-col rounded-2xl border bg-gradient-to-br p-6 transition-all ${tab.accent}`}
            >
              <tab.icon className="h-7 w-7" />
              <span className="mt-4 text-xl font-bold text-foreground">{tab.label}</span>
              <span className="mt-1.5 text-sm text-muted-foreground">{tab.description}</span>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                Browse {tab.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </nav>

        {/* Anime preview */}
        <section className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Popular Anime</h2>
            <Link to="/anime" className="text-sm font-semibold text-primary hover:underline">
              View all anime →
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {anime.map((a) => (
              <Link
                key={a.slug}
                to="/anime/$slug"
                params={{ slug: a.slug }}
                className="group rounded-xl border border-border/60 bg-card/40 p-4 card-hover"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-purple-400">
                  {a.status}
                </div>
                <div className="mt-1 font-semibold leading-snug group-hover:text-primary">
                  {a.title}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">⭐ {a.rating.toFixed(1)}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Games preview */}
        {games.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Latest Game Codes</h2>
              <Link to="/games" className="text-sm font-semibold text-primary hover:underline">
                View all games →
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {games.map((g) => (
                <Link
                  key={g.slug}
                  to="/$locale/codes/$slug"
                  params={{ locale: "en", slug: g.slug }}
                  className="group rounded-xl border border-border/60 bg-card/40 p-4 card-hover"
                >
                  <div className="font-semibold leading-snug line-clamp-2 group-hover:text-primary">
                    {g.title}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Stories preview */}
        <section className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Latest Stories</h2>
            <Link to="/blog" className="text-sm font-semibold text-primary hover:underline">
              View all stories →
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((s) => (
              <Link
                key={s.slug}
                to="/article/$slug"
                params={{ slug: s.slug }}
                className="group rounded-xl border border-border/60 bg-card/40 p-4 card-hover"
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400">
                  {s.tag}
                </div>
                <div className="mt-1.5 font-semibold leading-snug group-hover:text-primary">
                  {s.title}
                </div>
                <div className="mt-2 line-clamp-2 text-xs text-muted-foreground">{s.excerpt}</div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
