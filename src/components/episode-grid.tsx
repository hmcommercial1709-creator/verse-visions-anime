import { Link } from "@tanstack/react-router";
import { Calendar, Clock, Play } from "lucide-react";
import { episodes } from "@/data/episodes";
import { getAnime } from "@/data/animes";
import { MediaImage } from "@/components/media";
import { posterFor, artAlt } from "@/lib/media";

/** Quality badge is derived from the parent series' release era. */
const qualityFor = (year: number) => (year >= 2022 ? "4K UHD" : year >= 2015 ? "1080p" : "1080p HD");

/**
 * Latest-episodes grid — poster art, episode number, runtime and quality tags
 * with a smooth hover reveal. Two columns on mobile, four on desktop.
 */
export function EpisodeGrid({ limit = 8 }: { limit?: number }) {
  const cards = episodes
    .map((ep) => ({ ep, anime: getAnime(ep.animeSlug) }))
    .filter((c): c is { ep: (typeof episodes)[number]; anime: NonNullable<ReturnType<typeof getAnime>> } => Boolean(c.anime))
    .sort((a, b) => (a.ep.airDate < b.ep.airDate ? 1 : -1))
    .slice(0, limit);

  if (cards.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {cards.map(({ ep, anime }) => (
        <Link
          key={`${anime.slug}-${ep.number}`}
          to="/anime/$slug/episode/$num"
          params={{ slug: anime.slug, num: String(ep.number) }}
          className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 card-hover hover:!card-hover-active hover:border-primary/60"
        >
          <div className="relative">
            <MediaImage
              art={posterFor(anime.slug, [anime.title])}
              alt={artAlt(anime.title, "poster")}
              ratio="16/9"
              imgClassName="object-cover object-top transition-transform duration-500 group-hover:scale-110"
              sizes="(min-width: 1024px) 300px, 50vw"
              overlay={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

            <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              EP {ep.number}
            </span>
            <span className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
              {qualityFor(anime.year)}
            </span>

            <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/90 text-primary-foreground glow-primary">
                <Play className="h-5 w-5 fill-current" />
              </span>
            </span>
          </div>

          <div className="p-3">
            <div className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">{anime.title}</div>
            <div className="mt-1 line-clamp-2 font-display text-sm font-bold leading-snug group-hover:text-gradient">
              {ep.title}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {ep.runtime}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {ep.airDate}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
