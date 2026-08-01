import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getEpisode, episodesFor, type Episode } from "@/data/episodes";
import { getAnime } from "@/data/animes";
import type { Anime } from "@/data/animes";
import { Breadcrumbs } from "@/components/ui-bits";
import { BelowTitleAd, HeaderBannerAd, InArticleAd, PostContentAd,
  MultiplexAd, StickySidebarAd } from "@/components/ad-slot";
import { planInArticleAds } from "@/lib/ads-layout";
import {
  AffiliateProductWidget,
  InlineAffiliateCard,
  productsForContext,
} from "@/components/affiliate-products";
import { recommendAnime } from "@/lib/recommendations";
import { AnimeRecRail } from "@/components/recommendations";
import { ArticleComments } from "@/components/article-comments";
import { VideoEmbed } from "@/components/media";
import { VideoSummaryCard } from "@/components/video-summary";
import { getVideoSummary, episodeVideoCopy, KIND_LABEL } from "@/data/video-summaries";
import { backdropFor } from "@/lib/media";
import { ArrowLeft, ArrowRight, Calendar, Clock, Download, Play } from "lucide-react";

export const Route = createFileRoute("/anime_/$slug/episode/$num")({
  loader: ({ params }): { ep: Episode; anime: Anime } => {
    const number = parseInt(params.num, 10);
    const ep = getEpisode(params.slug, number);
    const anime = getAnime(params.slug);
    if (!ep || !anime) throw notFound();
    return { ep, anime };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    const { ep, anime } = loaderData;
    const title = `${anime.title} Episode ${ep.number}: ${ep.title} — Recap & Analysis · AnimeVerse`;
    const desc = ep.synopsis;
    return {
      meta: [
        { property: "og:url", content: `https://gamecastle.store/anime/${anime.slug}/episode/${ep.number}` },
        { name: "twitter:card", content: "summary_large_image" },
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: `https://gamecastle.store/anime/${anime.slug}/episode/${ep.number}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TVEpisode",
          episodeNumber: ep.number,
          name: ep.title,
          partOfSeries: { "@type": "TVSeries", name: anime.title },
          datePublished: ep.airDate,
          description: ep.synopsis,
        }),
      }],
    };
  },
  component: EpisodePage,
});

function EpisodePage() {
  const data = Route.useLoaderData() as { ep: Episode; anime: Anime };
  const { ep, anime } = data;
  const siblings = episodesFor(anime.slug);
  const idx = siblings.findIndex((s) => s.number === ep.number);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;
  const animeRecs = recommendAnime(anime.slug, 4);
  const episodeVideo = getVideoSummary(anime.slug);
  const merch = productsForContext(anime, anime.title);
  // Native units injected every 4 recap paragraphs (slot 1 is above the fold).
  const recapAdPlan = planInArticleAds([ep.recap.length], { interval: 2, startAt: 2, max: 14 });

  return (
    <article>
      <HeaderBannerAd />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: anime.cover }}>
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 lg:px-6 pt-14 pb-10">
          <Breadcrumbs items={[
            { to: "/", label: "Home" },
            { to: `/anime/${anime.slug}`, label: anime.title },
            { label: `Episode ${ep.number}` },
          ]} />
          <div className="mt-4 text-xs uppercase tracking-[0.22em] text-primary font-semibold">
            {anime.title} · {ep.arc} · Episode {ep.number}
          </div>
          <h1 className="mt-2 font-display text-4xl lg:text-5xl font-bold">{ep.title}</h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-3xl">{ep.synopsis}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {ep.airDate}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {ep.runtime}</span>
          </div>

          {/* Primary actions */}
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
            <Link
              to="/watch/$slug"
              params={{ slug: anime.slug }}
              search={{ ep: ep.number }}
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground glow-primary transition-transform hover:scale-[1.02] hover:brightness-110"
            >
              <Play className="h-5 w-5 fill-current" /> Play / Stream
            </Link>
            <Link
              to="/streaming"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-accent/50 bg-accent/10 px-6 py-4 text-base font-bold text-accent transition-colors hover:bg-accent/20"
            >
              <Download className="h-5 w-5" /> Download options
            </Link>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            AnimeVerse links to official streaming platforms only — 1080p and 4K where available.
          </p>
        </div>
      </section>


      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-6">

        <div className="min-w-0 max-w-3xl">
        {/* Below-title billboard (Below_Title_Ad) */}
        <BelowTitleAd />

        <InArticleAd
          index={1}
          unitId={`av-ep-${anime.slug}-${ep.number}-top`}
          adId="InArticle_Ad_1"
        />

        <div id="episode-preview" className="scroll-mt-24" />
        {episodeVideo ? (
          <Block title="Video summary">
            <VideoSummaryCard
              animeSlug={anime.slug}
              animeTitle={anime.title}
              youtubeId={episodeVideo.youtubeId}
              title={`${KIND_LABEL[episodeVideo.kind]} · ${anime.title} — Episode ${ep.number}`}
              kindLabel={KIND_LABEL[episodeVideo.kind]}
              paragraphs={episodeVideoCopy(anime.slug, anime.title, ep.number, anime.year)}
              episodeNumber={ep.number}
            />
          </Block>
        ) : (
          <Block title="Watch the episode preview">
            <VideoEmbed
              art={backdropFor(anime.slug)}
              title={`${anime.title} Episode ${ep.number} — ${ep.title}`}
              subtitle={`${ep.arc} · ${ep.runtime}`}
              searchQuery={anime.slug}
            />
          </Block>
        )}

        <Block title="Recap">
          <div className="prose prose-invert max-w-none space-y-5 text-lg leading-relaxed">
            {ep.recap.map((p, i) => {
              const ad = recapAdPlan.get(`0:${i}`);
              return (
              <div key={i}>
                <p>{p}</p>
                {ad && (
                  <InArticleAd
                    index={ad.index}
                    unitId={`av-ep-${anime.slug}-${ep.number}-recap-${i}`}
                    adId={ad.adId}
                  />
                )}
                {i === 4 && merch[0] && (
                  <InlineAffiliateCard
                    product={merch[0]}
                    note={`Collector pick for readers following the ${ep.arc}.`}
                  />
                )}
              </div>
              );
            })}
          </div>
        </Block>


        <Block title="Major events">
          <ul className="space-y-2">
            {ep.majorEvents.map((e, i) => (
              <li key={i} className="flex gap-3 rounded-lg border border-border/60 bg-card/50 p-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-primary text-xs font-bold">{i + 1}</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Character development">
          <div className="grid gap-3 sm:grid-cols-2">
            {ep.characterDevelopment.map((c, i) => (
              <div key={i} className="rounded-lg border border-border/60 bg-card/50 p-4">
                <div className="font-semibold">{c.character}</div>
                <p className="mt-1 text-sm text-muted-foreground">{c.note}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Themes">
          <div className="flex flex-wrap gap-2">
            {ep.themes.map((t) => (
              <span key={t} className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs text-accent">{t}</span>
            ))}
          </div>
        </Block>


        <AffiliateProductWidget
          products={merch}
          title={`Featured Merchandise & Manga · ${anime.title}`}
        />

        <Block title="Best moments">
          <ul className="space-y-2">
            {ep.bestMoments.map((m, i) => (
              <li key={i} className="rounded-lg border border-border/60 bg-card/50 p-3 text-sm">{m}</li>
            ))}
          </ul>
        </Block>

        <div className="grid gap-6 md:grid-cols-2 my-10">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
            <h3 className="font-display text-lg font-bold mb-3">Questions answered</h3>
            <ul className="space-y-2 text-sm">
              {ep.answered.map((a, i) => <li key={i} className="flex gap-2"><span className="text-primary">✓</span>{a}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
            <h3 className="font-display text-lg font-bold mb-3">Questions remaining</h3>
            <ul className="space-y-2 text-sm">
              {ep.remaining.map((a, i) => <li key={i} className="flex gap-2"><span className="text-accent">?</span>{a}</li>)}
            </ul>
          </div>
        </div>

        <Block title="Trivia & hidden details">
          <ul className="space-y-2">
            {ep.trivia.map((t, i) => (
              <li key={i} className="rounded-lg border border-border/60 bg-card/50 p-3 text-sm">{t}</li>
            ))}
          </ul>
        </Block>

        {(ep.connectionsPrev.length > 0 || ep.connectionsNext.length > 0) && (
          <Block title="Connections">
            {ep.connectionsPrev.length > 0 && (
              <>
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">To previous episodes</div>
                <ul className="mb-4 space-y-2">{ep.connectionsPrev.map((c, i) => <li key={i} className="rounded-lg border border-border/60 bg-card/50 p-3 text-sm">{c}</li>)}</ul>
              </>
            )}
            {ep.connectionsNext.length > 0 && (
              <>
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">To future episodes</div>
                <ul className="space-y-2">{ep.connectionsNext.map((c, i) => <li key={i} className="rounded-lg border border-border/60 bg-card/50 p-3 text-sm">{c}</li>)}</ul>
              </>
            )}
          </Block>
        )}

        {ep.related.length > 0 && (
          <Block title="Continue reading">
            <div className="grid gap-3 sm:grid-cols-2">
              {ep.related.map((r, i) => (
                <Link
                  key={i}
                  to={r.kind === "character" ? "/character/$slug" : r.kind === "article" ? "/article/$slug" : "/anime/$slug"}
                  params={{ slug: r.slug }}
                  className="rounded-xl border border-border/60 bg-card/50 p-4 hover:border-primary/60"
                >
                  <div className="text-[10px] uppercase tracking-[0.22em] text-primary">{r.kind}</div>
                  <div className="mt-1 font-semibold">{r.label}</div>
                </Link>
              ))}
            </div>
          </Block>
        )}

        <div className="my-12 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link to="/anime/$slug/episode/$num" params={{ slug: anime.slug, num: String(prev.number) }} className="rounded-xl border border-border/60 bg-card/50 p-4 hover:border-primary/60">
              <div className="text-xs text-muted-foreground flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Previous episode</div>
              <div className="mt-1 font-semibold">Ep {prev.number}: {prev.title}</div>
            </Link>
          ) : <div />}
          {next ? (
            <Link to="/anime/$slug/episode/$num" params={{ slug: anime.slug, num: String(next.number) }} className="rounded-xl border border-border/60 bg-card/50 p-4 hover:border-primary/60 text-right">
              <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">Next episode <ArrowRight className="h-3 w-3" /></div>
              <div className="mt-1 font-semibold">Ep {next.number}: {next.title}</div>
            </Link>
          ) : <div />}
        </div>

        <Block title="Characters in this episode">
          <div className="grid gap-3 sm:grid-cols-2">
            {ep.characterDevelopment.map((c, i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-card/50 p-4">
                <div className="font-semibold">{c.character}</div>
                <p className="mt-1 text-sm text-muted-foreground">{c.note}</p>
              </div>
            ))}
          </div>
        </Block>

        {next && (
          <Block title="Next episode preview">
            <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-primary">
                Up next · Episode {next.number}
              </div>
              <h3 className="mt-1 font-display text-xl font-bold">{next.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">{next.synopsis}</p>
              <Link
                to="/anime/$slug/episode/$num"
                params={{ slug: anime.slug, num: String(next.number) }}
                className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Read the Episode {next.number} deep-dive
              </Link>
            </div>
          </Block>
        )}

        <ArticleComments slug={`episode-${anime.slug}-${ep.number}`} />

        <AnimeRecRail
          items={animeRecs}
          eyebrow="Continue exploring"
          title={`If ${anime.title} is your lane…`}
        />

        {/* Post-article banner (Post_Content_Ad) */}
        <PostContentAd />
            <MultiplexAd />
        </div>

        <aside className="hidden lg:block">
          <StickySidebarAd unitId={`av-ep-${anime.slug}-${ep.number}-rail`} />
        </aside>
      </div>
    </article>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="my-10">
      <h2 className="font-display text-2xl font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
}
