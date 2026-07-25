import { Link } from "@tanstack/react-router";
import { AnimeCard } from "@/components/anime-card";
import type { Anime } from "@/data/animes";
import type { Article } from "@/data/articles";
import type { Character } from "@/data/characters";
import { Sparkles } from "lucide-react";

function RailHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <div className="text-[10px] uppercase tracking-[0.24em] text-primary font-semibold flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" /> {eyebrow}
        </div>
        <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold">{title}</h2>
      </div>
    </div>
  );
}

export function AnimeRecRail({
  items,
  eyebrow = "Recommended",
  title,
}: {
  items: Anime[];
  eyebrow?: string;
  title: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className="my-12">
      <RailHeader eyebrow={eyebrow} title={title} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((a) => (
          <AnimeCard key={a.slug} anime={a} size="sm" />
        ))}
      </div>
    </section>
  );
}

export function CharacterRecRail({
  items,
  eyebrow = "Continue exploring",
  title,
}: {
  items: Character[];
  eyebrow?: string;
  title: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className="my-12">
      <RailHeader eyebrow={eyebrow} title={title} />
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {items.map((c) => (
          <Link
            key={c.slug}
            to="/character/$slug"
            params={{ slug: c.slug }}
            className="group rounded-xl border border-border/60 bg-card/50 p-4 hover:border-primary/60"
          >
            <div
              className="h-1 w-8 rounded-full mb-2"
              style={{ background: c.accent }}
            />
            <div className="font-semibold group-hover:text-primary">{c.name}</div>
            <div className="text-xs text-muted-foreground">{c.role}</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {c.personality.slice(0, 3).map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] text-accent"
                >
                  {p}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ArticleRecRail({
  items,
  eyebrow = "Readers also enjoyed",
  title,
}: {
  items: Article[];
  eyebrow?: string;
  title: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className="my-12">
      <RailHeader eyebrow={eyebrow} title={title} />
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((a) => (
          <Link
            key={a.slug}
            to="/article/$slug"
            params={{ slug: a.slug }}
            className="group rounded-xl border border-border/60 bg-card/40 overflow-hidden hover:border-primary/60"
          >
            <div className="h-24" style={{ background: a.cover }} />
            <div className="p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary">
                {a.tag}
              </div>
              <div className="mt-1 font-semibold line-clamp-2 group-hover:text-primary">
                {a.title}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{a.date}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
