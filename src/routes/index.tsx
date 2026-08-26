import { createFileRoute, Link } from "@tanstack/react-router";
import { getAnime } from "@/data/animes";
import { videoSummaries, KIND_LABEL } from "@/data/video-summaries";
import { VideoSummaryCard } from "@/components/video-summary";
import {
  populatedGenres,
  populatedStudios,
  publishedAnime,
  publishedArticles,
} from "@/lib/content-registry";
import { AdSlot, MultiplexAd, StickySidebarAd, DisplayAd } from "@/components/ad-slot";
import { Rail, PosterRail } from "@/components/streaming-rails";
import { Section, StatPill } from "@/components/ui-bits";
import { HeroSlider } from "@/components/hero-slider";
import { HomeStage } from "@/components/home-stage";
import { HomeStorePromo } from "@/components/home-store-promo";
import { FeaturedProducts } from "@/components/featured-products";
import DownloadBanner from "@/components/DownloadBanner";

import { FranchiseHubs } from "@/components/franchise-hubs";
import { EngagementWidget } from "@/components/engagement-poll";
import { InfiniteArticleFeed } from "@/components/article-feed";
import { LazySection } from "@/components/lazy-section";
import { MediaImage, VideoEmbed } from "@/components/media";
import { backdrops, backdropFor, artAlt } from "@/lib/media";
import { ArrowRight, BookOpen, Compass } from "lucide-react";
import { hreflangLinks, SITE_URL } from "@/lib/i18n";

const HOME_OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e9cd417b-e16a-4090-b662-44bab1f1acea/id-preview-1f3f96cb--de879c4f-dc90-4b0b-beba-7d068ab16cd3.lovable.app-1784963580036.png";

const HERO_SLUGS = [
  "one-piece",
  "jujutsu-kaisen",
  "solo-leveling",
  "demon-slayer",
  "attack-on-titan",
];

const HUB_SLUGS = ["bleach", "naruto", "hunter-x-hunter", "my-hero-academia"];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "GameCastle Anime | Anime Guides & Watch Orders" },
      {
        name: "description",
        content:
          "Explore clear anime guides, watch orders, power systems, character abilities and timelines at GameCastle Anime.",
      },
      { property: "og:title", content: "GameCastle Anime | Anime Guides & Watch Orders" },
      {
        property: "og:description",
        content:
          "Explore clear anime guides, watch orders, power systems, character abilities and timelines at GameCastle Anime.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: HOME_OG_IMAGE },
      { name: "twitter:title", content: "GameCastle Anime | Anime Guides & Watch Orders" },
      {
        name: "twitter:description",
        content:
          "Explore clear anime guides, watch orders, power systems, character abilities and timelines at GameCastle Anime.",
      },
      { name: "twitter:image", content: HOME_OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      ...hreflangLinks("/"),
    ],
    scripts: [
      {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=G-RLW5JD3SM1",
      },
      {
        children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RLW5JD3SM1');
        `,
      },
    ],
  }),

  component: Home,
});

function Home() {
  const liveAnime = publishedAnime();
  const liveArticles = publishedArticles();
  const visibleGenres = populatedGenres();
  const visibleStudios = populatedStudios();

  /**
   * Every rail below draws from a shared pool and removes what it takes, so no
   * anime card and no article card is ever rendered twice on this page.
   */
  type Anime = (typeof liveAnime)[number];
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

  const hubs = take(
    HUB_SLUGS.map((s) => liveAnime.find((a) => a.slug === s)).filter((a): a is Anime => Boolean(a)),
    HUB_SLUGS.length,
  );
  const trending = take(liveAnime, 6);
  const topRated = take(
    [...liveAnime].sort((a, b) => b.rating - a.rating),
    6,
  );
  const newReleases = take(
    liveAnime.filter((a) => a.year >= 2022),
    3,
  );
  const classics = take(
    liveAnime.filter((a) => a.year < 2015),
    3,
  );

  // Articles: hero slides, the screening-room list and the editorial feed never overlap.
  const uniqueArticles = liveArticles.filter(
    (a, i) => liveArticles.findIndex((b) => b.slug === a.slug) === i,
  );
  const priorityGuideSlugs = [
    "dr-stone-science-tech-tree-guide",
    "solo-leveling-system-progression-explained",
    "jujutsu-kaisen-watch-order-and-manga-jump",
    "gojo-satoru-limitless-technique-explained",
    "hunter-x-hunter-nen-strategy-rules",
    "attack-on-titan-odm-gear-tactics-analysis",
  ];
  const priorityGuides = priorityGuideSlugs
    .map((slug) => uniqueArticles.find((article) => article.slug === slug))
    .filter((article): article is (typeof uniqueArticles)[number] => Boolean(article));
  const priorityGuideSet = new Set(priorityGuideSlugs);
  const remainingArticles = uniqueArticles.filter((article) => !priorityGuideSet.has(article.slug));
  const featuredArticles = remainingArticles.slice(0, 4);
  const spotlightArticles = remainingArticles.slice(4, 7);
  const feedArticles = remainingArticles.slice(7);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-primary/15 via-background to-accent/10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/20 [mask-image:radial-gradient(circle,#000,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:px-6 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Independent anime encyclopedia
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Find your next anime — then understand every world behind it.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Explore spoiler-aware watch orders, power-system explainers, character guides, episode
              recaps and studio coverage written for anime fans worldwide.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground glow-primary hover:brightness-110"
              >
                <Compass className="h-4 w-4" /> Explore anime
              </Link>
              <Link
                to="/guides"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/70 px-5 py-3 font-semibold hover:border-primary/60"
              >
                <BookOpen className="h-4 w-4" /> Read anime guides
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 lg:min-w-[360px]">
            <StatPill label="Anime" value={String(liveAnime.length)} />
            <StatPill label="Guides" value={String(liveArticles.length)} />
            <StatPill label="Genres" value={String(visibleGenres.length)} />
          </div>
        </div>
      </section>

      <FeaturedProducts limit={12} />
      <HomeStorePromo />
      <DownloadBanner />
      <HomeStage trending={trending} />

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Anime summaries, AMVs &amp; reviews
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Watch the summary or review right here, read the full breakdown, then continue the full
            episode on the official platform.
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {videoSummaries.slice(0, 2).map((v) => {
              const a = getAnime(v.animeSlug);
              if (!a) return null;
              return (
                <VideoSummaryCard
                  key={`${v.animeSlug}-${v.kind}`}
                  animeSlug={v.animeSlug}
                  animeTitle={a.title}
                  youtubeId={v.youtubeId}
                  title={v.title}
                  kindLabel={KIND_LABEL[v.kind]}
                  paragraphs={v.paragraphs}
                />
              );
            })}
          </div>
        </section>

        <DisplayAd className="my-8" minHeight={280} />

        <Rail
          title="Trending this week"
          subtitle="The shows dominating streaming charts and fan discussion right now."
          action={
            <Link
              to="/trending"
              className="flex shrink-0 items-center gap-1 text-sm text-primary hover:underline"
            >
              See all trending <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <PosterRail items={trending} />
        </Rail>

        <Rail
          title="Top rated on GameCastle Anime"
          subtitle="The series our editors rate highest across the GameCastle Anime library."
          action={
            <Link
              to="/top-rated"
              className="flex shrink-0 items-center gap-1 text-sm text-primary hover:underline"
            >
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

        <section className="my-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Essential reading
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                Answers anime fans are searching for
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Clear watch orders, power-system rules and equipment guides built for quick answers
                first — with the deeper analysis waiting underneath.
              </p>
            </div>
            <Link
              to="/guides"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Browse every guide <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {priorityGuides.map((article) => (
              <Link
                key={article.slug}
                to="/article/$slug"
                params={{ slug: article.slug }}
                className="group rounded-2xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/60 hover:bg-card/70"
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                  {article.tag}
                </div>
                <h3 className="mt-2 font-display text-lg font-bold leading-snug group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Read the guide <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <Section
          eyebrow="Browse by category"
          title="Every mood, every night"
          subtitle="Jump straight into a shelf: tournament arcs, isekai, quiet grief — the medium is bigger than any single door."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {visibleGenres.slice(0, 15).map((g) => (
              <Link
                key={g.slug}
                to="/genre/$slug"
                params={{ slug: g.slug }}
                className="group relative flex h-24 flex-col justify-end overflow-hidden rounded-xl border border-border/60 p-4 hover:border-primary/60"
                style={{ background: `linear-gradient(135deg, ${g.hue}22, ${g.hue}08)` }}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${g.hue}88, transparent 60%)`,
                  }}
                />
                <div className="relative">
                  <div className="font-display text-lg font-bold">{g.name}</div>
                  <div className="line-clamp-1 text-[11px] text-muted-foreground">{g.tagline}</div>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatPill label="Series covered" value={`${liveAnime.length}+`} />
          <StatPill label="Genres" value={String(visibleGenres.length)} />
          <StatPill label="Studios" value={String(visibleStudios.length)} />
          <StatPill label="Long reads" value={String(liveArticles.length)} />
        </div>

        <Section
          eyebrow="Franchise hubs"
          title="Deep coverage, one series at a time"
          subtitle="Lore, power scaling, watch orders, and episode reviews — switch tabs without leaving the page."
          action={
            <Link
              to="/browse"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Browse all anime franchises <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <FranchiseHubs items={hubs} />
        </Section>

        <LazySection minHeight={620}>
          <Section
            eyebrow="Screening room"
            title="Featured video: this season's must-watch cut"
            subtitle="Our editors' pick of the trailer worth breaking down frame by frame — plus the reads that go deeper."
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <VideoEmbed
                art={backdrops.trailer}
                title="GameCastle Anime Screening Room — Season Trailer Breakdown"
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
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                        {a.tag}
                      </span>
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
          <Section
            eyebrow="Editorial"
            title="From the writers' room"
            subtitle="Reviews, essays, and guides that go past the first episode — keep scrolling for more."
            action={
              <Link
                to="/editorial"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Read all editorial features <ArrowRight className="h-3 w-3" />
              </Link>
            }
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
              <InfiniteArticleFeed items={feedArticles} />
              <StickySidebarAd />
            </div>
          </Section>
          <MultiplexAd title="More from GameCastle Anime" />
        </LazySection>

        <Section eyebrow="The people behind the frames" title="Studios shaping the medium">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleStudios.slice(0, 8).map((s) => (
              <Link
                key={s.slug}
                to="/studio/$slug"
                params={{ slug: s.slug }}
                className="rounded-xl border border-border/60 p-5 hover:border-primary/60 card-hover hover:!card-hover-active"
                style={{ background: `linear-gradient(135deg, ${s.accent}18, transparent 70%)` }}
              >
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

        <section className="my-16 rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/10 via-background to-primary/10 p-8 lg:p-12 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/25 [mask-image:radial-gradient(circle,#000,transparent_70%)]" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent/25 [mask-image:radial-gradient(circle,#000,transparent_70%)]" />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-accent font-semibold mb-3">
                The ultimate roadmap
              </div>
              <h3 className="font-display text-3xl lg:text-4xl font-bold max-w-xl">
                Never watch a series in the wrong order again.
              </h3>
              <p className="mt-3 text-muted-foreground max-w-2xl">
                Every franchise gets a canonical watch order, a movie-canon note, and a filler
                guide. From Naruto to Demon Slayer to Fate — we do the homework so you don't miss
                the payoff.
              </p>
            </div>
            <Link
              to="/watch-order"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-semibold text-accent-foreground hover:brightness-110"
            >
              Open watch orders <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
