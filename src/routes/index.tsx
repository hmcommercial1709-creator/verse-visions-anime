import { createFileRoute, Link } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { genres } from "@/data/genres";
import { studios } from "@/data/studios";
import { articles } from "@/data/articles";
import { AdSlot, MultiplexAd, StickySidebarAd, DisplayAd } from "@/components/ad-slot";
import { Rail, EpisodeRail, PosterRail } from "@/components/streaming-rails";
import { Section, StatPill } from "@/components/ui-bits";
import { HeroSlider } from "@/components/hero-slider";
import { HomeStage } from "@/components/home-stage";
import { AnimeHero } from "@/components/anime-hero";

import { EpisodeGrid } from "@/components/episode-grid";
import { FranchiseHubs } from "@/components/franchise-hubs";
import { EngagementWidget } from "@/components/engagement-poll";
import { LatestEpisodesSection } from "@/components/episode-streaming";
import { InfiniteArticleFeed } from "@/components/article-feed";
import { LazySection } from "@/components/lazy-section";
import { MediaImage, VideoEmbed } from "@/components/media";
import { backdrops, backdropFor, posterFor, artAlt } from "@/lib/media";
import { ArrowRight } from "lucide-react";
import { hreflangLinks, SITE_URL } from "@/lib/i18n";


const HOME_OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e9cd417b-e16a-4090-b662-44bab1f1acea/id-preview-1f3f96cb--de879c4f-dc90-4b0b-beba-7d068ab16cd3.lovable.app-1784963580036.png";

const HERO_SLUGS = ["one-piece", "jujutsu-kaisen", "solo-leveling", "demon-slayer", "attack-on-titan"];

const HUB_SLUGS = ["bleach", "naruto", "hunter-x-hunter", "my-hero-academia"];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "AnimeVerse | Ultimate Anime Hub, Guides, and Character Database" },
      { name: "description", content: "Anime reviews, character deep-dives, watch orders, episode recaps and seasonal guides — updated daily by the AnimeVerse editorial team." },
      { property: "og:title", content: "AnimeVerse | The Ultimate Anime & Gaming Authority" },
      { property: "og:description", content: "Discover breaking anime news, guides, and interactive tools. Join millions of global fans today!" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: HOME_OG_IMAGE },
      { name: "twitter:title", content: "AnimeVerse | Global Anime & Gaming Hub" },
      { name: "twitter:description", content: "Your ultimate destination for anime guides, character databases, and gaming tools." },
      { name: "twitter:image", content: HOME_OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      ...hreflangLinks("/"),
      // LCP is the above-the-fold player poster — preload it at high priority.
      {
        rel: "preload",
        as: "image",
        href: posterFor(LCP_SLUG).src,
        imagesrcset: posterFor(LCP_SLUG).srcSet,
        fetchpriority: "high",
      },
    ],
  }),

  component: Home,
});

function Home() {
  /**
   * Every rail below draws from a shared pool and removes what it takes, so no
   * anime card and no article card is ever rendered twice on this page.
   */
  type Anime = (typeof animes)[number];
  const claimed = new Set<string>();
  const take = (pool: Anime[], count: number) => {
    const picked: Anime[] = [];
    for (const a of pool) {
      if (picked.length >= count) break;
      if (claimed.has(a.slug)) continue;
      claimed.add(a.slug);
      picked.push(a);
    }
    return picked;
  };

  const heroPicks = take(
    HERO_SLUGS.map((s) => animes.find((a) => a.slug === s)).filter((a): a is Anime => Boolean(a)),
    HERO_SLUGS.length,
  );
  const hubs = take(
    HUB_SLUGS.map((s) => animes.find((a) => a.slug === s)).filter((a): a is Anime => Boolean(a)),
    HUB_SLUGS.length,
  );
  const streamingPicks = take(animes.filter((a) => a.status === "Ongoing"), 4);
  const trending = take(animes, 6);
  const topRated = take([...animes].sort((a, b) => b.rating - a.rating), 6);
  const newReleases = take(animes.filter((a) => a.year >= 2022), 3);
  const classics = take(animes.filter((a) => a.year < 2015), 3);

  // Articles: hero slides, the screening-room list and the editorial feed never overlap.
  const uniqueArticles = articles.filter((a, i) => articles.findIndex((b) => b.slug === a.slug) === i);
  const featuredArticles = uniqueArticles.slice(0, 4);
  const spotlightArticles = uniqueArticles.slice(4, 7);
  const feedArticles = uniqueArticles.slice(7);


  return (
    <div>
      {/* ABOVE THE FOLD — inline player, latest-episode switcher and search.
          Rendered synchronously (no lazy gate, no overlay) so the first paint
          already contains a playable episode. */}
      <HomeStage trending={trending} />

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <Rail
          title="Latest episodes — start watching now"
          subtitle="Newest releases first. Tap any card to open the player with that episode preloaded."
          action={
            <Link to="/streaming" className="flex shrink-0 items-center gap-1 text-sm text-primary hover:underline">
              All episodes <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <EpisodeRail limit={12} />
        </Rail>

        {/* First display unit sits after the visitor has content, in the
            natural gap between rails — reserved height, so no shift. */}
        <DisplayAd className="my-8" minHeight={280} />

        <Rail
          title="Trending this week"
          subtitle="The shows dominating streaming charts and fan discussion right now."
          action={
            <Link to="/trending" className="flex shrink-0 items-center gap-1 text-sm text-primary hover:underline">
              See all trending <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <PosterRail items={trending} />
        </Rail>


        <Rail
          title="Top rated on AnimeVerse"
          subtitle="Aggregated from 40,000+ community ratings across the last twelve months."
          action={
            <Link to="/top-rated" className="flex shrink-0 items-center gap-1 text-sm text-primary hover:underline">
              Full leaderboard <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <PosterRail items={topRated} />
        </Rail>

        <Rail
          title="Continue the classics"
          subtitle="Foundational series worth a first — or fifth — rewatch."
        >
          <PosterRail items={[...classics, ...newReleases]} />
        </Rail>
      </div>

      {/* Featured spotlight carousel — demoted below the watch rails so the
          landing view is content, not marketing. */}
      <AnimeHero items={heroPicks} />

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <DisplayAd className="my-8" minHeight={280} />


        {/* GENRE SHELVES */}
        <Section eyebrow="Browse by category" title="Every mood, every night" subtitle="Jump straight into a shelf: tournament arcs, isekai, quiet grief — the medium is bigger than any single door.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {genres.slice(0, 15).map((g) => (
              <Link
                key={g.slug}
                to="/genre/$slug"
                params={{ slug: g.slug }}
                className="group relative flex h-24 flex-col justify-end overflow-hidden rounded-xl border border-border/60 p-4 hover:border-primary/60"
                style={{ background: `linear-gradient(135deg, ${g.hue}22, ${g.hue}08)` }}
              >
                <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 30% 20%, ${g.hue}88, transparent 60%)` }} />
                <div className="relative">
                  <div className="font-display text-lg font-bold">{g.name}</div>
                  <div className="line-clamp-1 text-[11px] text-muted-foreground">{g.tagline}</div>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
          action={<Link to="/browse" className="text-sm text-primary hover:underline flex items-center gap-1">Browse all anime franchises <ArrowRight className="h-3 w-3" /></Link>}
        >
          <FranchiseHubs items={hubs} />
        </Section>

        {/* LATEST EPISODES + STREAMING */}
        <Section
          eyebrow="Currently airing"
          title="Latest episodes & where to watch"
          subtitle="Pick a series, jump to an episode recap, and switch between official streaming platforms."
        >
          <EpisodeGrid limit={8} />
          <div className="mt-6">
            <LatestEpisodesSection items={streamingPicks} />
          </div>
        </Section>

        <LazySection minHeight={620}>
          {/* FEATURED VIDEO TRAILER */}
          <Section
            eyebrow="Screening room"
            title="Featured video: this season's must-watch cut"
            subtitle="Our editors' pick of the trailer worth breaking down frame by frame — plus the reads that go deeper."
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <VideoEmbed
                art={backdrops.trailer}
                title="AnimeVerse Screening Room — Season Trailer Breakdown"
                subtitle="Editors' cut · animation direction, sakuga highlights, and what the framing spoils"
                searchQuery="jujutsu kaisen official trailer"
              />
              <div className="space-y-3">
                {spotlightArticles.map((a) => (
                  <Link
                    key={a.slug}
                    to="/article/$slug"
                    params={{ slug: a.slug }}
                    className="group grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-border/60 bg-card/40 p-3 hover:border-primary/50"
                  >
                    <MediaImage
                      art={backdropFor(a.slug, [a.title, a.tag])}
                      alt={artAlt(a.title)}
                      ratio="16/9"
                      className="rounded-lg"
                      sizes="96px"
                      overlay={false}
                    />
                    <span className="min-w-0">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{a.tag}</span>
                      <span className="mt-1 block font-display text-sm font-bold leading-snug group-hover:text-gradient">
                        {a.title}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </Section>
        </LazySection>

        <AdSlot placement="between" label="Native · Sponsored" />


        <LazySection minHeight={520}>
          {/* ENGAGEMENT */}
          <Section
            eyebrow="Join in"
            title="Vote, argue, find your sorcerer"
            subtitle="Two quick interactions our readers keep coming back for."
          >
            <EngagementWidget />
          </Section>
        </LazySection>

        <Section
          eyebrow="Featured deep-dives"
          title="This week's long reads"
          subtitle="Editor-picked essays worth the full scroll."
        >
          <div className="overflow-hidden rounded-3xl border border-border/60">
            <HeroSlider items={featuredArticles} />
          </div>
        </Section>

        <LazySection minHeight={900}>
          {/* EDITORIAL FEED — infinite scroll */}
          <Section
            eyebrow="Editorial"
            title="From the writers' room"
            subtitle="Reviews, essays, and guides that go past the first episode — keep scrolling for more."
            action={<Link to="/editorial" className="text-sm text-primary hover:underline flex items-center gap-1">Read all editorial features <ArrowRight className="h-3 w-3" /></Link>}
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
              <InfiniteArticleFeed items={feedArticles} />
              <StickySidebarAd />
            </div>
          </Section>
          <MultiplexAd title="More from AnimeVerse" />
        </LazySection>


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

        {/* Watch order banner */}
        <section className="my-16 rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/10 via-background to-primary/10 p-8 lg:p-12 relative overflow-hidden">
          {/* Cheap masked glows: gradients/masks paint far faster than blur filters. */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/25 [mask-image:radial-gradient(circle,#000,transparent_70%)]" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent/25 [mask-image:radial-gradient(circle,#000,transparent_70%)]" />


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
