import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { Anime } from "@/data/animes";
import { MediaImage } from "@/components/media";
import { posterFor, artAlt } from "@/lib/media";

export function AnimeCard({ anime, size = "md" }: { anime: Anime; size?: "sm" | "md" | "lg" }) {
  const heights = { sm: "h-48", md: "h-64", lg: "h-80" };
  return (
    <Link
      to="/anime/$slug"
      params={{ slug: anime.slug }}
      className="group block card-hover hover:!card-hover-active"
    >
      <div
        className={`relative ${heights[size]} overflow-hidden rounded-2xl border border-border/60`}
        style={{ background: anime.cover }}
      >
        <MediaImage
          art={posterFor(anime.slug, [anime.title, ...anime.genres])}
          alt={artAlt(anime.title, "poster")}
          ratio="2/3"
          className="absolute inset-0 h-full w-full"
          sizes="(min-width: 1024px) 320px, 50vw"
          overlay={false}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.15),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            {anime.status}
          </span>
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-bold text-gold">
          <Star className="h-3 w-3 fill-current" />
          <span title="GameCastle Anime editorial score">{anime.rating.toFixed(1)}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/90">{anime.year} · {anime.studio}</div>
          <div className="font-display text-lg font-bold text-white leading-tight group-hover:text-gradient">
            {anime.title}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function AnimePoster({ anime }: { anime: Anime }) {
  return (
    <Link to="/anime/$slug" params={{ slug: anime.slug }} className="group">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border/60" style={{ background: anime.cover }}>
        <MediaImage
          art={posterFor(anime.slug, [anime.title, ...anime.genres])}
          alt={artAlt(anime.title, "poster")}
          ratio="2/3"
          className="absolute inset-0 h-full w-full"
          sizes="(min-width: 1024px) 220px, 45vw"
          overlay={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-2.5">
          <div className="text-[9px] uppercase tracking-widest text-white/90">{anime.year}</div>
          <div className="font-display text-sm font-bold text-white leading-tight line-clamp-2">{anime.title}</div>
        </div>
      </div>
    </Link>
  );
}
