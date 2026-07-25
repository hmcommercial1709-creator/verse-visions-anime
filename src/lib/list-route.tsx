import { createFileRoute } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";
import { AdSlot } from "@/components/ad-slot";

type Cfg = {
  slug: string;
  path: string;
  title: string;
  eyebrow: string;
  intro: string;
  meta: string;
  filter: (a: typeof animes[number]) => boolean;
  sort?: (a: typeof animes[number], b: typeof animes[number]) => number;
};

export function makeListRoute(cfg: Cfg) {
  return createFileRoute(cfg.path as any)({
    head: () => ({
      meta: [
        { title: `${cfg.title} · AnimeVerse` },
        { name: "description", content: cfg.meta },
        { property: "og:title", content: `${cfg.title} · AnimeVerse` },
        { property: "og:description", content: cfg.meta },
      ],
      links: [{ rel: "canonical", href: cfg.path }],
    }),
    component: () => {
      const list = animes.filter(cfg.filter);
      if (cfg.sort) list.sort(cfg.sort);
      return (
        <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
          <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: cfg.title }]} />
          <div className="text-xs uppercase tracking-[0.22em] text-primary font-semibold">{cfg.eyebrow}</div>
          <h1 className="mt-2 font-display text-5xl font-bold">{cfg.title}</h1>
          <p className="mt-3 max-w-3xl text-lg text-muted-foreground leading-relaxed">{cfg.intro}</p>
          <AdSlot placement="between" />
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {list.map(a => <AnimeCard key={a.slug} anime={a} />)}
          </div>
        </div>
      );
    },
  });
}
