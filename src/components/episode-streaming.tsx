import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Download, ExternalLink, MonitorPlay, Play, Server } from "lucide-react";
import type { Anime } from "@/data/animes";
import { episodesFor } from "@/data/episodes";

/**
 * Latest episodes + "where to watch" switcher.
 * AnimeVerse links to official platforms only — no hosted video, no piracy links.
 */
const PROVIDERS = [
  { id: "crunchyroll", label: "Crunchyroll", quality: "1080p · Sub & Dub", url: "https://www.crunchyroll.com" },
  { id: "netflix", label: "Netflix", quality: "1080p · Dub", url: "https://www.netflix.com" },
  { id: "hidive", label: "HIDIVE", quality: "1080p · Sub", url: "https://www.hidive.com" },
  { id: "prime", label: "Prime Video", quality: "1080p · Sub & Dub", url: "https://www.primevideo.com" },
] as const;

export function LatestEpisodesSection({ items }: { items: Anime[] }) {
  const [activeAnime, setActiveAnime] = useState(items[0]?.slug ?? "");
  const [provider, setProvider] = useState<string>(PROVIDERS[0].id);

  const anime = items.find((a) => a.slug === activeAnime) ?? items[0];
  if (!anime) return null;

  const eps = episodesFor(anime.slug);
  const activeProvider = PROVIDERS.find((p) => p.id === provider) ?? PROVIDERS[0];
  const episodeNumbers =
    eps.length > 0
      ? eps.map((e) => e.number)
      : Array.from({ length: Math.min(12, typeof anime.episodes === "number" ? anime.episodes : 12) }, (_, i) => i + 1);

  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/40">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 p-5 lg:p-6">
          <div className="flex flex-wrap gap-1.5">
            {items.map((a) => (
              <button
                key={a.slug}
                type="button"
                onClick={() => setActiveAnime(a.slug)}
                aria-pressed={a.slug === anime.slug}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  a.slug === anime.slug
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border/60 text-muted-foreground hover:border-primary/40"
                }`}
              >
                {a.title}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-16 w-12 shrink-0 rounded-lg" style={{ background: anime.cover }} />
            <div className="min-w-0">
              <h3 className="truncate font-display text-2xl font-bold">{anime.title}</h3>
              <p className="text-xs text-muted-foreground">
                {anime.status} · {anime.seasons} season{anime.seasons > 1 ? "s" : ""} ·{" "}
                {typeof anime.episodes === "number" ? `${anime.episodes} episodes` : "episode count TBC"}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Episode selector
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
              {episodeNumbers.map((n) => {
                const hasReview = eps.some((e) => e.number === n);
                return hasReview ? (
                  <Link
                    key={n}
                    to="/anime/$slug/episode/$num"
                    params={{ slug: anime.slug, num: String(n) }}
                    className="grid h-10 place-items-center rounded-lg border border-primary/40 bg-primary/10 font-mono text-xs text-primary hover:bg-primary/20"
                  >
                    {n}
                  </Link>
                ) : (
                  <span
                    key={n}
                    className="grid h-10 place-items-center rounded-lg border border-border/60 font-mono text-xs text-muted-foreground"
                  >
                    {n}
                  </span>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Highlighted episodes have a full editorial recap. The rest are on the publishing schedule.
            </p>
          </div>
        </div>

        <div className="border-t border-border/50 bg-background/40 p-5 lg:border-l lg:border-t-0">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            <Server className="h-3.5 w-3.5" /> Where to watch
          </div>
          <div className="mt-3 space-y-1.5">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProvider(p.id)}
                aria-pressed={p.id === activeProvider.id}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  p.id === activeProvider.id ? "border-accent bg-accent/10" : "border-border/60 hover:border-accent/50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <MonitorPlay className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  <span className="min-w-0 flex-1 truncate">{p.label}</span>
                </span>
                <span className="mt-0.5 block pl-5 text-[11px] text-muted-foreground">{p.quality}</span>
              </button>
            ))}
          </div>

          <a
            href={activeProvider.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:brightness-110"
          >
            <Play className="h-4 w-4" /> Watch on {activeProvider.label}
          </a>
          <Link
            to="/anime/$slug"
            params={{ slug: anime.slug }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20"
          >
            <Download className="h-3.5 w-3.5" /> HD wallpapers
          </Link>
          <Link
            to="/streaming"
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground"
          >
            Compare all platforms <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
