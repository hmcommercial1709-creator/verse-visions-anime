import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Play, Star } from "lucide-react";
import { animes, type Anime } from "@/data/animes";
import { episodes } from "@/data/episodes";
import { getAnime } from "@/data/animes";
import { MediaImage } from "@/components/media";
import { posterFor, artAlt } from "@/lib/media";

/**
 * Streaming-service layout primitives: horizontally scrolling rails with
 * snap points, exactly like Netflix / Crunchyroll rows. Every card is a real
 * link, so the rails stay crawlable and keyboard-navigable.
 */

export function Rail({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="my-10">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold leading-tight sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4 -mx-4 px-4 lg:-mx-6 lg:px-6">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:thin]">
          {children}
        </div>
      </div>
    </section>
  );
}

/** Landscape "episode" tile — the primary watch entry point. */
export function EpisodeRail({ limit = 12 }: { limit?: number }) {
  const cards = episodes
    .map((ep) => ({ ep, anime: getAnime(ep.animeSlug) }))
    .filter((c): c is { ep: (typeof episodes)[number]; anime: Anime } => Boolean(c.anime))
    .sort((a, b) => (a.ep.airDate < b.ep.airDate ? 1 : -1))
    .slice(0, limit);

  return (
    <>
      {cards.map(({ ep, anime }) => (
        <Link
          key={`${anime.slug}-${ep.number}`}
          to="/watch/$slug"
          params={{ slug: anime.slug }}
          search={{ ep: ep.number }}
          className="group relative w-[248px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border/60 bg-card/40 hover:border-primary/60 sm:w-[288px]"
        >
          <div className="relative">
            <MediaImage
              art={posterFor(anime.slug, [anime.title])}
              alt={artAlt(anime.title, "poster")}
              ratio="16/9"
              imgClassName="object-cover object-top"
              sizes="288px"
              overlay={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
            <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              EP {ep.number}
            </span>
            <span className="absolute bottom-2 right-2 grid h-10 w-10 place-items-center rounded-full bg-primary/90 text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
              <Play className="h-4 w-4 fill-current" />
            </span>
          </div>
          <div className="p-3">
            <div className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              {anime.title}
            </div>
            <div className="mt-1 line-clamp-1 font-display text-sm font-bold">{ep.title}</div>
            <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {ep.runtime}
              </span>
              <span>{ep.airDate}</span>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}

/** Portrait poster tile that links straight into the player. */
export function PosterRail({ items }: { items: Anime[] }) {
  return (
    <>
      {items.map((a) => (
        <Link
          key={a.slug}
          to="/watch/$slug"
          params={{ slug: a.slug }}
          search={{ ep: undefined }}
          className="group w-[132px] shrink-0 snap-start sm:w-[156px]"
        >
          <div className="relative overflow-hidden rounded-xl border border-border/60 group-hover:border-primary/60">
            <MediaImage
              art={posterFor(a.slug, [a.title])}
              alt={artAlt(a.title, "poster")}
              ratio="2/3"
              sizes="156px"
              overlay={false}
            />
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-background to-transparent px-2 pb-2 pt-6 text-[11px] font-semibold">
              <span className="flex items-center gap-1 text-gold">
                <Star className="h-3 w-3 fill-current" />
                {a.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">{a.year}</span>
            </span>
          </div>
          <div className="mt-2 line-clamp-2 text-xs font-semibold leading-snug">{a.title}</div>
        </Link>
      ))}
    </>
  );
}

/** Small helper for the "see all" rail action. */
export function RailAction({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex shrink-0 items-center gap-1 text-sm text-primary hover:underline"
    >
      {label} <ArrowRight className="h-3 w-3" />
    </Link>
  );
}

export const allAnimes = animes;
