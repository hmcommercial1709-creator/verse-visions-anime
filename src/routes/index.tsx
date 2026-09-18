import { createFileRoute, Link } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { Sparkles, Gamepad2, BookOpen, ArrowRight } from "lucide-react";
import { publishedAnime } from "@/lib/content-registry";
import { publishedArticleList } from "@/data/articles";
import { canonicalMeta, websiteSchema, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import { MysteryVault } from "@/components/mystery-vault/MysteryVault";

const ANIME_PREVIEW_LIMIT = 6;
const STORIES_PREVIEW_LIMIT = 6;

export const Route = createFileRoute("/")({
  head: () => {
    const { link, meta: canonicalOg } = canonicalMeta("/");
    return {
      meta: [
        { title: `${SITE_NAME} — Anime Guides, Characters & Watch Orders` },
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
    accent:
      "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30 hover:border-purple-500/60",
    description: "Guides, watch orders, characters and reviews for every series we cover.",
  },
  {
    // Was /games, which listed the redemption-codes table under the heading
    // "Games" and now redirects here anyway. This points at the real games
    // catalog, and the description finally matches what the tile opens.
    to: "/catalog/games" as const,
    label: "Games",
    icon: Gamepad2,
    accent:
      "from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/30 hover:border-cyan-500/60",
    description: "Hundreds of free-to-play PC and browser games, with details for each one.",
  },
  {
    to: "/blog" as const,
    label: "Stories",
    icon: BookOpen,
    accent:
      "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30 hover:border-amber-500/60",
    description: "Long-form analysis, lore breakdowns and news from the editorial desk.",
  },
];

/** Live catalogs backed by the public Jikan and FreeToGame APIs. */
const CATALOG_LINKS = [
  {
    to: "/anime" as const,
    label: "Anime Catalog",
    blurb: "Top-rated series with scores, studios and genres — linked to our guides",
  },
  {
    to: "/catalog/games" as const,
    label: "Free-to-Play Games",
    blurb: "Free games with platforms, developers and system requirements",
  },
];

function HomePage() {
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

      <section aria-label="CryptoPulse Pro promotion" className="border-b border-border bg-[#08090d] px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-7 text-white sm:p-10">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="relative grid gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Sponsored partner</span>
                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">CryptoPulse Pro × GameCastle</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">From player to network builder: explore crypto intelligence, Telegram Stars rewards and a referral center with a personal link, network statistics, leaderboard, milestones and VIP levels.</p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-white/80">
                  {["💰 Stars earned","👥 Referred users","📈 Network activity","🏆 Global leaderboard","🎯 Milestones","👑 VIP levels"].map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-2">{item}</span>)}
                </div>
              </div>
              <div className="lg:text-right">
                <p className="text-sm font-semibold text-cyan-300">PLAY. SHARE. GROW.</p>
                <a href="https://t.me/CryptoPulseHubBot" target="_blank" rel="noopener noreferrer sponsored" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black transition-transform hover:scale-[1.03]">ENTER CRYPTOPULSE PRO <ArrowRight className="h-4 w-4" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>
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

        {/* Live catalogs */}
        <nav aria-label="Live catalogs" className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CATALOG_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/40 px-5 py-4 card-hover hover:border-primary/50"
            >
              <span>
                <span className="block font-semibold group-hover:text-primary">{item.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{item.blurb}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
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

        {/* A "Latest Game Codes" rail stood here, listing six rows straight
            from game_nexus_matrix — the fabricated table. It is gone with the
            pages it linked to. */}

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
