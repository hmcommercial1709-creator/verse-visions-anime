import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getArticle, articles, getAuthor } from "@/data/articles";
import { getAnime } from "@/data/animes";
import { Breadcrumbs } from "@/components/ui-bits";
import { AnimeCard } from "@/components/anime-card";
import { AdSlot } from "@/components/ad-slot";

export const Route = createFileRoute("/article/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    const a = loaderData.article;
    return {
      meta: [
        { title: `${a.title} · AnimeVerse` },
        { name: "description", content: a.excerpt },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.excerpt },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: `/article/${a.slug}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          datePublished: a.date,
          author: { "@type": "Person", name: getAuthor(a.author)?.name },
        }),
      }],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article: a } = Route.useLoaderData();
  const author = getAuthor(a.author);
  const related = a.related.map(s => getAnime(s)).filter(Boolean) as ReturnType<typeof getAnime>[];
  const more = articles.filter(x => x.slug !== a.slug && x.section === a.section).slice(0, 3);

  return (
    <div>
      <section className="relative">
        <div className="h-64 lg:h-80" style={{ background: a.cover }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 lg:px-6 -mt-24 relative">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: `/${a.section}`, label: a.section }, { label: a.title }]} />
        <div className="text-xs uppercase tracking-[0.22em] text-primary font-semibold">{a.tag}</div>
        <h1 className="mt-2 font-display text-4xl lg:text-5xl font-bold">{a.title}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{a.excerpt}</p>
        <div className="mt-6 flex items-center gap-3 border-y border-border/60 py-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent" />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm">{author?.name}</div>
            <div className="text-xs text-muted-foreground">{author?.role} · {a.date}</div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none mt-8 space-y-6 text-lg leading-relaxed">
          {a.body.map((p, i) => (<p key={i}>{p}</p>))}
        </div>

        <AdSlot placement="inline" />

        {related.length > 0 && (
          <div className="my-12">
            <h2 className="font-display text-2xl font-bold mb-4">Related anime</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {related.map(r => r && <AnimeCard key={r.slug} anime={r} size="sm" />)}
            </div>
          </div>
        )}

        {more.length > 0 && (
          <div className="my-12">
            <h2 className="font-display text-2xl font-bold mb-4">More in {a.section}</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {more.map(m => (
                <Link key={m.slug} to="/article/$slug" params={{ slug: m.slug }} className="rounded-xl border border-border/60 overflow-hidden bg-card/40 hover:border-primary/60">
                  <div className="h-24" style={{ background: m.cover }} />
                  <div className="p-4">
                    <div className="font-semibold line-clamp-2">{m.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{m.date}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
