import { createFileRoute, Link } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { genres } from "@/data/genres";
import { studios } from "@/data/studios";
import { articles } from "@/data/articles";
import { AnimeCard, AnimePoster } from "@/components/anime-card";
import { AdSlot } from "@/components/ad-slot";
import { Section, StatPill } from "@/components/ui-bits";
import { Sparkles, TrendingUp, Flame, Star, ArrowRight, Play, Clock, Award } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AnimeVerse — The Home of Anime Reviews, Guides & Culture" },
      { name: "description", content: "Discover the best anime with AnimeVerse: reviews, character deep-dives, watch orders, studio profiles, and long-form editorial from a fan-led editorial team." },
      { property: "og:title", content: "AnimeVerse — The Home of Anime Reviews, Guides & Culture" },
      { property: "og:description", content: "Discover the best anime with AnimeVerse: reviews, character deep-dives, watch orders, studio profiles, and long-form editorial from a fan-led editorial team." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = animes.find(a => a.slug === "frieren") ?? animes[0];
  const trending = animes.slice(0, 6);
  const newReleases = animes.filter(a => a.year >= 2022);
  const classics = animes.filter(a => a.year < 2015);
  const editorPicks = articles.slice(0, 3);
  const topRated = [...animes].sort((a,b) => b.rating - a.rating).slice(0, 8);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: featured.cover }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0),rgba(0,0,0,.6))]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary mb-4">
            <Sparkles className="h-3 w-3" /> Editor's Featured
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.02]">
            {featured.title}
            <span className="block text-gradient mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold">
              {featured.tagline}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/85 leading-relaxed">
            {featured.synopsis}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/anime/$slug" params={{ slug: featured.slug }} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground glow-primary hover:brightness-110">
              <Play className="h-4 w-4" /> Read the deep-dive
            </Link>
            <Link to="/browse" className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/40 backdrop-blur px-5 py-3 font-medium hover:bg-secondary">
              Browse the library <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            <StatPill label="Series covered" value="120+" />
            <StatPill label="Genres" value={String(genres.length)} />
            <StatPill label="Studios" value={String(studios.length)} />
            <StatPill label="Editors" value="5" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <AdSlot placement="top" label="Leaderboard · 970×90" />

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

        <AdSlot placement="between" label="Native · Sponsored" />

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

        {/* EDITORIAL */}
        <Section eyebrow="Editorial" title="From the writers' room" subtitle="Reviews, essays, and guides that go past the first episode." action={<Link to="/editorial" className="text-sm text-primary hover:underline flex items-center gap-1">All editorial <ArrowRight className="h-3 w-3" /></Link>}>
          <div className="grid gap-6 md:grid-cols-3">
            {editorPicks.map((a) => (
              <Link key={a.slug} to="/article/$slug" params={{ slug: a.slug }} className="group rounded-2xl overflow-hidden border border-border/60 bg-card/40 card-hover hover:!card-hover-active">
                <div className="h-40" style={{ background: a.cover }} />
                <div className="p-5">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">{a.tag}</div>
                  <h3 className="mt-2 font-display text-xl font-bold group-hover:text-gradient">{a.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
                  <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" /> {a.date}
                  </div>
                </div>
              </Link>
            ))}
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
