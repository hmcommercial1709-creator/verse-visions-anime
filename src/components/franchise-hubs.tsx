import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Gauge, ListOrdered, Tv } from "lucide-react";
import { MediaImage } from "@/components/media";
import { backdropFor, artAlt } from "@/lib/media";
import type { Anime } from "@/data/animes";
import { episodesFor } from "@/data/episodes";

const TABS = [
  { id: "lore", label: "Lore", icon: BookOpen },
  { id: "power", label: "Power Scaling", icon: Gauge },
  { id: "order", label: "Watch Order", icon: ListOrdered },
  { id: "episodes", label: "Episode Reviews", icon: Tv },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** Franchise hub card: one series, four editorial entry points. */
function Hub({ anime }: { anime: Anime }) {
  const [tab, setTab] = useState<TabId>("lore");
  const eps = episodesFor(anime.slug);

  return (
    <article className="overflow-hidden rounded-2xl border border-border/60 bg-card/40">
      <div className="relative h-28" style={{ background: anime.cover }}>
        <MediaImage
          art={backdropFor(anime.slug, [anime.title, ...anime.genres])}
          alt={artAlt(anime.title)}
          ratio="3/1"
          className="absolute inset-0 h-full w-full"
          sizes="(min-width: 1024px) 420px, 100vw"
          overlay={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/95 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 p-4">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">Franchise hub</div>
            <h3 className="truncate font-display text-xl font-bold">{anime.title}</h3>
          </div>
          <Link
            to="/anime/$slug"
            params={{ slug: anime.slug }}
            className="shrink-0 rounded-md border border-border/60 bg-background/50 px-2.5 py-1 text-xs backdrop-blur hover:border-primary/60"
          >
            Hub
          </Link>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-border/50 px-2 py-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              tab === t.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary/60"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      <div className="p-4 text-sm">
        {tab === "lore" && (
          <div className="space-y-3">
            <p className="text-muted-foreground">{anime.worldBuilding}</p>
            <ul className="space-y-1.5">
              {anime.arcs.slice(0, 3).map((arc) => (
                <li key={arc.title} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <span className="font-semibold">{arc.title}</span>{" "}
                    <span className="text-muted-foreground">— {arc.summary}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "power" && (
          <div className="space-y-3">
            <p className="text-muted-foreground">{anime.powerSystem}</p>
            <div className="flex flex-wrap gap-1.5">
              {anime.themes.map((t) => (
                <span key={t} className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {tab === "order" && (
          <ol className="space-y-2">
            {anime.watchOrder.map((step, i) => (
              <li key={step} className="flex gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 font-mono text-[10px] text-primary">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        )}

        {tab === "episodes" && (
          <div className="space-y-2">
            {eps.length > 0 ? (
              eps.slice(0, 4).map((e) => (
                <Link
                  key={e.number}
                  to="/anime/$slug/episode/$num"
                  params={{ slug: anime.slug, num: String(e.number) }}
                  className="block rounded-lg border border-border/60 px-3 py-2 hover:border-primary/60"
                >
                  <span className="font-mono text-[11px] text-muted-foreground">EP {e.number}</span>{" "}
                  <span className="font-semibold">{e.title}</span>
                </Link>
              ))
            ) : (
              <p className="text-muted-foreground">
                Episode-by-episode reviews for {anime.title} are in production. Start with the series deep-dive while we
                publish the recaps.
              </p>
            )}
            <Link
              to="/anime/$slug"
              params={{ slug: anime.slug }}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              All coverage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

export function FranchiseHubs({ items }: { items: Anime[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((a) => (
        <Hub key={a.slug} anime={a} />
      ))}
    </div>
  );
}
