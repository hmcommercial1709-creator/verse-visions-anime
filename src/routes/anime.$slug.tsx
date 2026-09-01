import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { hreflangLinks } from "@/lib/i18n";
import { getAnime, animes } from "@/data/animes";
import { getGenre } from "@/data/genres";
import { getStudio } from "@/data/studios";
import { charactersByAnime, characters } from "@/data/characters";
import { episodesFor } from "@/data/episodes";
import { Breadcrumbs, Section } from "@/components/ui-bits";
import { AdSlot, TopBannerAd } from "@/components/ad-slot";
import { AnimeCard } from "@/components/anime-card";
import { recommendAnime } from "@/lib/recommendations";
import { AnimeRecRail } from "@/components/recommendations";
import { InternalLinkNetwork } from "@/components/internal-link-network";
import { absoluteUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { AnimeLiveData } from "@/components/live-data";
import { UserReviews } from "@/components/user-reviews";
import { ArticleComments } from "@/components/article-comments";
import { MediaImage, VideoEmbed } from "@/components/media";
import { artAlt, backdropFor, posterFor } from "@/lib/media";
import { Star, Calendar, Tv, Building2, Award, Play, Music, Users, HelpCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/anime/$slug")({
  loader: ({ params }) => {
    const anime = getAnime(params.slug);
    if (!anime) throw notFound();
    return { anime };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    const a = loaderData.anime;
    const title = `${a.title} — Story, Characters, Watch Order & Review · GameCastle Anime`;
    const desc = `The complete GameCastle Anime guide to ${a.title}: synopsis, arcs, characters, power system, watch order, soundtrack, fun facts and FAQ.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: absoluteUrl(`/anime/${a.slug}`) },
        { property: "og:image", content: posterFor(a.slug).src },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: posterFor(a.slug).src },
      ],
      links: [{ rel: "canonical", href: absoluteUrl(`/anime/${a.slug}`) }, ...hreflangLinks(`/anime/${a.slug}`)],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TVSeries",
          name: a.title,
          alternateName: a.japaneseTitle,
          datePublished: String(a.year),
          ...(typeof a.episodes === "number" ? { numberOfEpisodes: a.episodes } : {}),
          numberOfSeasons: a.seasons,
          genre: a.genres,
          url: absoluteUrl(`/anime/${a.slug}`),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema([
          { path: "/", name: "Home" },
          { path: "/browse", name: "Anime" },
          { name: a.title },
        ])),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(faqSchema([
          ...(typeof a.episodes === "number"
            ? [{ q: `How many episodes does ${a.title} have?`, a: `${a.title} runs for ${a.episodes} episodes across ${a.seasons} season(s).` }]
            : []),
          { q: `What is the best watch order for ${a.title}?`, a: `Our watch-order section breaks down both the release order and the chronological order for ${a.title}, including which filler you can safely skip.` },
          { q: `Is ${a.title} worth watching?`, a: `${a.tagline} This page covers the premise, arcs, characters and watch order so you can decide before you start.` },
        ])),
      }],
    };
  },
  component: AnimeDetail,
});

function AnimeDetail() {
  const { anime } = Route.useLoaderData();
  const cast = charactersByAnime(anime.slug);
  const studio = getStudio(anime.studio);
  const eps = episodesFor(anime.slug);
  const similar = anime.similar.map((s: string) => animes.find(a => a.slug === s)).filter(Boolean) as typeof animes;
  const alsoEnjoyed = recommendAnime(anime.slug, 4).filter((a) => !anime.similar.includes(a.slug));
  const pageSections = [
    { id: "overview", label: "Overview" },
    { id: "arcs", label: "Arcs" },
    { id: "power-world", label: "Power & World" },
    { id: "watch-order", label: "Watch Order" },
    ...(eps.length > 0 ? [{ id: "episodes", label: "Episodes" }] : []),
    ...(cast.length > 0 ? [{ id: "characters", label: "Characters" }] : []),
    ...(anime.themes.length > 0 ? [{ id: "themes", label: "Themes" }] : []),
    ...(anime.quotes.length > 0 ? [{ id: "quotes", label: "Quotes" }] : []),
    ...(anime.facts.length > 0 ? [{ id: "facts", label: "Facts" }] : []),
    ...(anime.soundtrack.length > 0 ? [{ id: "soundtrack", label: "Soundtrack" }] : []),
    ...(anime.voiceActors.length > 0 ? [{ id: "voice-actors", label: "Voice Actors" }] : []),
    ...(anime.awards.length > 0 ? [{ id: "awards", label: "Awards" }] : []),
    ...(anime.faq.length > 0 ? [{ id: "faq", label: "FAQ" }] : []),
    { id: "conclusion", label: "Conclusion" },
    ...(similar.length > 0 ? [{ id: "similar", label: "Similar" }] : []),
  ];

  return (
    <article>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: anime.cover }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6 pt-10 pb-16">
          <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/browse", label: "Anime" }, { label: anime.title }]} />
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] items-start">
            <MediaImage
              art={posterFor(anime.slug, [anime.title, ...anime.genres])}
              alt={artAlt(anime.title, "poster")}
              ratio="2/3"
              className="w-full rounded-2xl border-2 border-primary/40 glow-primary"
              sizes="(min-width: 1024px) 280px, 80vw"
              priority
              overlay={false}
            />
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-primary font-semibold">{anime.status} · {anime.year}</div>
              <h1 className="mt-2 font-display text-4xl lg:text-6xl font-bold tracking-tight">{anime.title}</h1>
              {anime.japaneseTitle && <div className="mt-1 text-lg text-muted-foreground">{anime.japaneseTitle}</div>}
              <p className="mt-4 text-xl text-gradient font-semibold">{anime.tagline}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {anime.genres.map((g: string) => {
                  const genre = getGenre(g);
                  return (
                    <Link key={g} to="/genre/$slug" params={{ slug: g }} className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs hover:border-primary hover:text-primary">
                      {genre?.name || g}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
                <Stat icon={Star} label="Editorial score" value={`${anime.rating.toFixed(1)}/10`} />
                <Stat icon={Tv} label="Episodes" value={typeof anime.episodes === "number" ? String(anime.episodes) : "TBA"} />
                <Stat icon={Calendar} label="Seasons" value={String(anime.seasons)} />
                <Stat icon={Building2} label="Studio" value={studio?.name || anime.studio} />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link to="/watch/$slug" params={{ slug: anime.slug }} search={{ ep: undefined }} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground glow-primary"><Play className="h-4 w-4" /> Where to watch legally</Link>
                <a href="#trailer" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm">Watch trailer</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-6 mt-6">
        <TopBannerAd />
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-6 grid gap-10 lg:grid-cols-[1fr_320px] mt-10">
        <div className="min-w-0">
          {/* Trailer */}
          <SectionBlock id="trailer" title="Official trailer">
            <VideoEmbed
              art={backdropFor(anime.slug)}
              title={`${anime.title} — official trailer`}
              subtitle={anime.tagline}
              searchQuery={anime.slug}
            />
          </SectionBlock>

          {/* Overview */}
          <SectionBlock id="overview" title="Overview">
            <p className="text-lg leading-relaxed text-foreground/90">{anime.synopsis}</p>
          </SectionBlock>

          <AdSlot placement="inline" />

          {/* Live release schedule, cast gallery + episode directory */}
          <AnimeLiveData title={anime.title} year={anime.year} slug={anime.slug} />

          {/* Story arcs */}
          <SectionBlock id="arcs" title="Every arc, explained">
            <div className="space-y-3">
              {anime.arcs.map((arc, i) => (
                <div key={i} className="rounded-xl border border-border/60 bg-card/50 p-5">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <h3 className="font-display text-lg font-bold">{arc.title}</h3>
                    <span className="text-xs text-muted-foreground shrink-0">Episodes {arc.episodes}</span>
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed">{arc.summary}</p>
                </div>
              ))}
            </div>
          </SectionBlock>

          {/* Power / World */}
          <section id="power-world" className="grid scroll-mt-24 gap-4 md:grid-cols-2 my-10">
            <div className="rounded-2xl border border-border/60 bg-card/50 p-6">
              <div className="flex items-center gap-2 text-primary mb-2"><Sparkles className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-[0.22em]">Power System</span></div>
              <p className="text-sm leading-relaxed">{anime.powerSystem}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/50 p-6">
              <div className="flex items-center gap-2 text-accent mb-2"><Building2 className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-[0.22em]">World Building</span></div>
              <p className="text-sm leading-relaxed">{anime.worldBuilding}</p>
            </div>
          </section>

          {/* Watch Order */}
          <SectionBlock id="watch-order" title="Watch order">
            <ol className="space-y-2">
              {anime.watchOrder.map((w: string, i: number) => (
                <li key={i} className="flex items-center gap-4 rounded-lg border border-border/60 bg-card/50 p-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/20 text-primary font-bold text-sm">{i+1}</span>
                  <span>{w}</span>
                </li>
              ))}
            </ol>
          </SectionBlock>

          {/* Episode guides */}
          {eps.length > 0 && (
            <SectionBlock id="episodes" title={<span className="flex items-center gap-2"><Tv className="h-5 w-5 text-primary" /> Episode guides</span>}>
              <div className="grid gap-3 sm:grid-cols-2">
                {eps.map((e) => (
                  <Link
                    key={e.number}
                    to="/anime/$slug/episode/$num"
                    params={{ slug: anime.slug, num: String(e.number) }}
                    className="group rounded-xl border border-border/60 bg-card/50 p-4 hover:border-primary/60"
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-primary">Episode {e.number} · {e.arc}</div>
                    <div className="mt-1 font-display text-lg font-bold group-hover:text-gradient">{e.title}</div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{e.synopsis}</p>
                  </Link>
                ))}
              </div>
            </SectionBlock>
          )}

          {/* Characters */}
          {cast.length > 0 && (
            <SectionBlock id="characters" title="Characters">
              <div className="grid gap-3 sm:grid-cols-2">
                {cast.map((c) => (
                  <Link key={c.slug} to="/character/$slug" params={{ slug: c.slug }} className="rounded-xl border border-border/60 p-4 hover:border-primary/60 bg-card/50">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full shrink-0" style={{ background: `linear-gradient(135deg, ${c.accent}, #000)` }} />
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.role}</div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{c.bio}</p>
                  </Link>
                ))}
              </div>
            </SectionBlock>
          )}

          {/* Themes */}
          {anime.themes.length > 0 && (
            <SectionBlock id="themes" title="Themes">
              <div className="flex flex-wrap gap-2">
                {anime.themes.map((t: string) => (<span key={t} className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs text-accent">{t}</span>))}
              </div>
            </SectionBlock>
          )}

          {/* Quotes */}
          {anime.quotes.length > 0 && (
            <SectionBlock id="quotes" title="Quotes to remember">
              <div className="space-y-3">
                {anime.quotes.map((q, i) => (
                  <blockquote key={i} className="border-l-2 border-primary pl-4 py-1">
                    <div className="italic text-lg text-foreground/90">"{q.line}"</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">— {q.character}</div>
                  </blockquote>
                ))}
              </div>
            </SectionBlock>
          )}

          <AdSlot placement="between" />

          {/* Facts */}
          {anime.facts.length > 0 && (
            <SectionBlock id="facts" title="Fun facts, hidden details & easter eggs">
              <ul className="space-y-2">
                {anime.facts.map((f, i) => (
                  <li key={i} className="flex gap-3 rounded-lg border border-border/60 bg-card/50 p-3">
                    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-primary text-xs font-bold">{i+1}</div>
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </SectionBlock>
          )}

          {/* Soundtrack */}
          {anime.soundtrack.length > 0 && (
            <SectionBlock id="soundtrack" title={<span className="flex items-center gap-2"><Music className="h-5 w-5 text-accent" /> Soundtrack & openings</span>}>
              <div className="grid gap-2 sm:grid-cols-2">
                {anime.soundtrack.map((s, i) => (
                  <div key={i} className="rounded-lg border border-border/60 bg-card/50 p-3 flex items-center gap-3">
                    <span className="rounded bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5">{s.type}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">{s.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{s.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionBlock>
          )}

          {/* Voice cast */}
          {anime.voiceActors.length > 0 && (
            <SectionBlock id="voice-actors" title={<span className="flex items-center gap-2"><Users className="h-5 w-5 text-accent" /> Voice cast</span>}>
              <div className="overflow-x-auto rounded-xl border border-border/60">
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase text-muted-foreground bg-secondary/40">
                    <tr><th className="text-left p-3">Role</th><th className="text-left p-3">Japanese</th><th className="text-left p-3">English</th></tr>
                  </thead>
                  <tbody>
                    {anime.voiceActors.map((v, i) => (
                      <tr key={i} className="border-t border-border/60">
                        <td className="p-3 font-medium">{v.role}</td>
                        <td className="p-3 text-foreground/80">{v.jp}</td>
                        <td className="p-3 text-muted-foreground">{v.en || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionBlock>
          )}

          {/* Awards */}
          {anime.awards.length > 0 && (
            <SectionBlock id="awards" title={<span className="flex items-center gap-2"><Award className="h-5 w-5 text-gold" /> Awards</span>}>
              <ul className="grid gap-2 sm:grid-cols-2">
                {anime.awards.map((a, i) => (
                  <li key={i} className="rounded-lg border border-gold/30 bg-gold/5 p-3 text-sm">{a}</li>
                ))}
              </ul>
            </SectionBlock>
          )}

          {/* FAQ */}
          {anime.faq.length > 0 && (
            <SectionBlock id="faq" title={<span className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-primary" /> Frequently asked questions</span>}>
              <div className="space-y-2">
                {anime.faq.map((f, i) => (
                  <details key={i} className="group rounded-xl border border-border/60 bg-card/50 p-4">
                    <summary className="cursor-pointer font-semibold list-none flex justify-between items-center">
                      <span>{f.q}</span>
                      <span className="text-primary text-xl group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="mt-3 text-sm text-foreground/85 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </SectionBlock>
          )}

          {/* Reader reviews + discussion */}
          <UserReviews slug={anime.slug} title={anime.title} editorialScore={anime.rating} />
          <ArticleComments slug={`anime-${anime.slug}`} />

          {/* Conclusion */}
          <SectionBlock id="conclusion" title="Conclusion">
            <p className="text-lg leading-relaxed">
              {anime.title} earned its spot in the GameCastle Anime library because it did what most anime doesn't: it kept its promises. The arcs paid off. The characters grew. The world got bigger the longer we sat with it. If you're picking your next weekend of viewing, this is one worth clearing the calendar for.
            </p>
          </SectionBlock>

          {/* Similar */}
          {similar.length > 0 && (
            <SectionBlock id="similar" title="Similar anime you'll enjoy">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {similar.map((s) => <AnimeCard key={s.slug} anime={s} size="sm" />)}
              </div>
            </SectionBlock>
          )}

          <AnimeRecRail
            items={alsoEnjoyed}
            eyebrow="Readers also enjoyed"
            title={`If you liked ${anime.title}…`}
          />

          <InternalLinkNetwork
            className="mt-8"
            path={`/anime/${anime.slug}`}
            topics={[...(anime.genres ?? []), anime.title, (anime as { studio?: string }).studio ?? ""]}
          />
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-5 sticky top-24">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-3">On this page</div>
            <ul className="space-y-2 text-sm">
              {pageSections.map((section) => (
                <li key={section.id}><a href={`#${section.id}`} className="text-muted-foreground hover:text-primary">{section.label}</a></li>
              ))}
            </ul>
          </div>
          <AdSlot placement="sidebar" />
          <AdSlot placement="native" />
        </aside>
      </div>
    </article>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1"><Icon className="h-3 w-3" /> {label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}

function SectionBlock({ id, title, children }: { id?: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="my-10 scroll-mt-24">
      <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-2">{title}</h2>
      {children}
    </section>
  );
}
