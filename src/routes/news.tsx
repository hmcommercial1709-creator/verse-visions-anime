import { createFileRoute, Link } from "@tanstack/react-router";
import { articles, listArticles } from "@/data/articles";
import { Breadcrumbs } from "@/components/ui-bits";
import { AdSlot } from "@/components/ad-slot";

function ArticleGrid({ list }: { list: typeof articles }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {list.map(a => (
        <Link key={a.slug} to="/article/$slug" params={{ slug: a.slug }} className="rounded-2xl overflow-hidden border border-border/60 bg-card/40 card-hover hover:!card-hover-active">
          <div className="h-36" style={{ background: a.cover }} />
          <div className="p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">{a.tag}</div>
            <h3 className="mt-1 font-display text-lg font-bold">{a.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
            <div className="mt-3 text-xs text-muted-foreground">{a.date}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function makeIndex(path: string, title: string, section: any, intro: string, meta: string) {
  return createFileRoute(path as any)({
    head: () => ({
      meta: [
        { title: `${title} · AnimeVerse` },
        { name: "description", content: meta },
        { property: "og:title", content: `${title} · AnimeVerse` },
        { property: "og:description", content: meta },
      ],
      links: [{ rel: "canonical", href: path }],
    }),
    component: () => (
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: title }]} />
        <h1 className="font-display text-5xl font-bold">{title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{intro}</p>
        <AdSlot placement="between" />
        <div className="mt-8"><ArticleGrid list={section === "all" ? listArticles() : listArticles(section)} /></div>
      </div>
    ),
  });
}

export const Route = makeIndex(
  "/news",
  "Anime News",
  "news",
  "Studio announcements, licensing news, and the daily beat on the industry.",
  "The latest anime news — studios, licensing, streaming, and industry updates."
);
