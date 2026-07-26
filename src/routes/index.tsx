import { createFileRoute, Link } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { genres } from "@/data/genres";
import { studios } from "@/data/studios";
import { articles } from "@/data/articles";
import { AnimeCard, AnimePoster } from "@/components/anime-card";
import { AdSlot, HeaderBannerAd, StickySidebarAd } from "@/components/ad-slot";
import { Section, StatPill } from "@/components/ui-bits";
import { HeroSlider } from "@/components/hero-slider";
import { FranchiseHubs } from "@/components/franchise-hubs";
import { EngagementWidget } from "@/components/engagement-poll";
import { LatestEpisodesSection } from "@/components/episode-streaming";
import { InfiniteArticleFeed } from "@/components/article-feed";
import { TrendingUp, Star, ArrowRight, Award } from "lucide-react";
import { hreflangLinks, SITE_URL } from "@/lib/i18n";

const HUB_SLUGS = ["jujutsu-kaisen", "one-piece", "attack-on-titan", "bleach"];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AnimeVerse — The Home of Anime Reviews, Guides & Culture" },
      { name: "description", content: "Discover the best anime with AnimeVerse: reviews, character deep-dives, watch orders, studio profiles, and long-form editorial from a fan-led editorial team." },
      { property: "og:title", content: "AnimeVerse — The Home of Anime Reviews, Guides & Culture" },
      { property: "og:description", content: "Discover the best anime with AnimeVerse: reviews, character deep-dives, watch orders, studio profiles, and long-form editorial from a fan-led editorial team." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }, ...hreflangLinks("/")],
  }),
  component: Home,
});

function Home() {
  const featuredArticles = articles.slice(0, 4);
  const hubs = HUB_SLUGS.map((s) => animes.find((a) => a.slug === s)).filter((a): a is (typeof animes)[number] => Boolean(a));
  const streamingPicks = animes.filter((a) => a.status === "Ongoing").slice(0, 5);
  const trending = animes.slice(0, 6);
  const newReleases = animes.filter((a) => a.year >= 2022);
  const classics = animes.filter((a) => a.year < 2015);
  const topRated = [...animes].sort((a, b) => b.rating - a.rating).slice(0, 8);

  return (
    <div>
      <HeaderBannerAd />

      <HeroSlider items={featuredArticles} />

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatPill label="Series covered" value={`${animes.length}+`} />
          <StatPill label="Genres" value={String(genres.length)} />
          <StatPill label="Studios" value={String(studios.length)} />
          <StatPill label="Long reads" value={String(articles.length)} />
        </div>

        {/* FRANCHISE HUBS */}
        <Section
          eyebrow="Franchise hubs"
          title="Deep coverage, one series at a time"
          subtitle="Lore, power scaling, watch orders, and episode reviews — switch tabs without leaving the page."
          action={<Link to="/browse" className="text-sm text-primary hover:underline flex items-center gap-1">All franchises <ArrowRight className="h-3 w-3" /></Link>}
        >
          <FranchiseHubs items={hubs} />
        </Section>

        {/* LATEST EPISODES + STREAMING */}
        <Section
          eyebrow="Currently airing"
          title="Latest episodes & where to watch"
          subtitle="Pick a series, jump to an episode recap, and switch between official streaming platforms."
        >
          <LatestEpisodesSection items={streamingPicks} />
        </Section>

        <AdSlot placement="between" label="Native · Sponsored" />

        {/* TRENDING NOW */}
        <Section
          eyebrow="What people are watching"
          title="Trending this week"
          subtitle="The shows dominating discussion, streaming charts, and our editors' group chat."
          action={<Link to="/trending" className="text-sm text-primary hover:underline flex items-center gap-1">See all <ArrowRight className="h-3 w-3" /></Link>}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trending.map((a) => <AnimeCard key={a.slug} anime={a} size="md" />)}
          </div>
        </Section>

        {/* ENGAGEMENT */}
        <Section
          eyebrow="Join in"
          title="Vote, argue, find your sorcerer"
          subtitle="Two quick interactions our readers keep coming back for."
        >
          <EngagementWidget />
        </Section>

        {/* GENRE MOSAIC */}
        <Section eyebrow="Every mood, every night" title="Browse by genre" subtitle="From tournament arcs to quiet grief, the medium is bigger than any single door.">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {genres.slice(0, 15).map((g) => (
              <Link
                key={g.slug}
                to="/genre/$slug"
                params={{ slug: g.slug }}
                className="relative overflow-hidden rounded-xl border border-border/60 p-4 h-28 flex flex-col justify-end group hover:border-primary/60 card-hover hover:!card-hover-active"
                style={{ background: `linear-gradient(135deg, ${g.hue}22, ${g.hue}08)` }}
              >
                <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 30% 20%, ${g.hue}88, transparent 60%)` }} />
                <div className="relative">
                  <div className="font-display text-lg font-bold">{g.name}</div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">{g.tagline}</div>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* TOP RATED */}
        <Section
          eyebrow="Reader-rated"
          title="Highest scored on AnimeVerse"
          subtitle="Aggregated from 40,000+ community ratings across the last twelve months."
        >
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {topRated.map((a) => <AnimePoster key={a.slug} anime={a} />)}
          </div>
        </Section>

        {/* EDITORIAL FEED — infinite scroll */}
        <Section
          eyebrow="Editorial"
          title="From the writers' room"
          subtitle="Reviews, essays, and guides that go past the first episode — keep scrolling for more."
          action={<Link to="/editorial" className="text-sm text-primary hover:underline flex items-center gap-1">All editorial <ArrowRight className="h-3 w-3" /></Link>}
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <InfiniteArticleFeed items={articles} />
            <StickySidebarAd />
          </div>
        </Section>

        {/* STUDIOS */}
        <Section eyebrow="The people behind the frames" title="Studios shaping the medium">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {studios.slice(0, 8).map((s) => (
              <Link key={s.slug} to="/studio/$slug" params={{ slug: s.slug }}
                className="rounded-xl border border-border/60 p-5 hover:border-primary/60 card-hover hover:!card-hover-active"
                style={{ background: `linear-gradient(135deg, ${s.accent}18, transparent 70%)` }}>
                <div className="flex items-center justify-between">
                  <div className="font-display text-lg font-bold">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.founded}</div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{s.blurb}</p>
              </Link>
            ))}
          </div>
        </Section>

        <AdSlot placement="inline" />

        {/* NEW & CLASSIC */}
        <div className="grid gap-10 lg:grid-cols-2 my-16">
          <div>
            <div className="flex items-center gap-2 mb-4"><TrendingUp className="h-4 w-4 text-accent" /><h3 className="font-display text-2xl font-bold">New this era</h3></div>
            <div className="space-y-3">
              {newReleases.slice(0, 4).map((a) => (
                <Link key={a.slug} to="/anime/$slug" params={{ slug: a.slug }} className="flex gap-3 rounded-xl border border-border/60 p-3 hover:border-primary/60 bg-card/40">
                  <div className="h-16 w-12 shrink-0 rounded" style={{ background: a.cover }} />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{a.tagline}</div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1 text-gold"><Star className="h-3 w-3 fill-current" />{a.rating}</span>
                      <span>{a.year}</span>
                      <span>{a.status}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4"><Award className="h-4 w-4 text-gold" /><h3 className="font-display text-2xl font-bold">The classics</h3></div>
            <div className="space-y-3">
              {classics.map((a) => (
                <Link key={a.slug} to="/anime/$slug" params={{ slug: a.slug }} className="flex gap-3 rounded-xl border border-border/60 p-3 hover:border-primary/60 bg-card/40">
                  <div className="h-16 w-12 shrink-0 rounded" style={{ background: a.cover }} />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{a.tagline}</div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1 text-gold"><Star className="h-3 w-3 fill-current" />{a.rating}</span>
                      <span>{a.year}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Watch order banner */}
        <section className="my-16 rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/10 via-background to-primary/10 p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-accent font-semibold mb-3">The ultimate roadmap</div>
              <h3 className="font-display text-3xl lg:text-4xl font-bold max-w-xl">Never watch a series in the wrong order again.</h3>
              <p className="mt-3 text-muted-foreground max-w-2xl">Every franchise gets a canonical watch order, a movie-canon note, and a filler guide. From Naruto to Demon Slayer to Fate — we do the homework so you don't miss the payoff.</p>
            </div>
            <Link to="/watch-order" className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-semibold text-accent-foreground hover:brightness-110">
              Open watch orders <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
