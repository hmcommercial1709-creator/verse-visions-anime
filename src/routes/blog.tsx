import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  articles,
  articleTags,
  categoryForArticle,
  getAuthor,
  articleParagraphs,
  type Article,
} from "@/data/articles";
import { categories } from "@/data/categories";
import { Breadcrumbs } from "@/components/ui-bits";
import { HeaderBannerAd, InArticleAd, PostContentAd, StickySidebarAd } from "@/components/ad-slot";
import { MediaImage } from "@/components/media";
import { backdropFor, artAlt } from "@/lib/media";
import { readingLabel } from "@/lib/reading";
import { Clock, Search, ChevronLeft, ChevronRight } from "lucide-react";

const TITLE = "Blog & News Archive";
const META =
  "Search the full AnimeVerse archive: reviews, guides, action breakdowns, RPG systems, strategy analysis, esports and daily news.";
const PER_PAGE = 9;

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: `${TITLE} — Every Article, Searchable · AnimeVerse` },
      { name: "description", content: META },
      { property: "og:title", content: `${TITLE} · AnimeVerse` },
      { property: "og:description", content: META },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://gamecastle.store/blog" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/blog" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${TITLE} · AnimeVerse`,
          description: META,
          url: "https://gamecastle.store/blog",
        }),
      },
    ],
  }),
  component: BlogArchive,
});

function ArticleGridCard({ a }: { a: Article }) {
  const author = getAuthor(a.author);
  return (
    <Link
      to="/article/$slug"
      params={{ slug: a.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 card-hover hover:border-primary/50"
    >
      <div className="relative" style={{ background: a.cover }}>
        <MediaImage art={backdropFor(a.slug, [a.title, a.tag])} alt={artAlt(a.title)} ratio="16/9" sizes="(max-width:768px) 100vw, 33vw" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{a.tag}</div>
        <h3 className="mt-1.5 font-display text-lg font-bold leading-snug group-hover:text-gradient">{a.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 text-xs text-muted-foreground">
          <span>{author?.name}</span>
          <span>{a.date}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {readingLabel(articleParagraphs(a))}
          </span>
        </div>
      </div>
    </Link>
  );
}

function BlogArchive() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (cat !== "all" && categoryForArticle(a) !== cat) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        articleTags(a).some((t) => t.includes(q))
      );
    });
  }, [query, cat]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const reset = (fn: () => void) => {
    fn();
    setPage(1);
  };

  return (
    <div>
      <HeaderBannerAd />
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Blog" }]} />
        <h1 className="font-display text-5xl font-bold">Blog &amp; News Archive</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
          Every piece we have published — {articles.length} articles across seven desks. Search by title, topic or tag,
          filter by category, and page through the full archive.
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-3">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  id="blog-search"
                  value={query}
                  onChange={(e) => reset(() => setQuery(e.target.value))}
                  placeholder="Search 50+ articles — try 'watch order', 'sakuga', 'esports'"
                  className="w-full bg-transparent py-2.5 text-sm outline-none"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => reset(() => setCat("all"))}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    cat === "all" ? "border-primary bg-primary/15 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => reset(() => setCat(c.slug))}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      cat === c.slug ? "border-primary bg-primary/15 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-5 text-sm text-muted-foreground" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
              {pages > 1 ? ` · page ${current} of ${pages}` : ""}
            </p>

            {slice.length === 0 ? (
              <p className="mt-8 rounded-2xl border border-border/60 bg-card/40 p-6 text-muted-foreground">
                Nothing matched that search. Try a broader term, or browse a category above.
              </p>
            ) : (
              <>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {slice.map((a) => (
                    <ArticleGridCard key={a.slug} a={a} />
                  ))}
                </div>
                {/* In-feed responsive unit, below the fold and outside the grid flow */}
                <InArticleAd index={2} unitId="av-blog-infeed" adId="InArticle_Ad_2" />
              </>
            )}

            {pages > 1 && (
              <nav className="mt-8 flex flex-wrap items-center gap-2" aria-label="Archive pagination">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(1, current - 1))}
                  disabled={current === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-border/60 px-3 py-2 text-sm disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    aria-current={n === current ? "page" : undefined}
                    className={`h-9 w-9 rounded-lg border text-sm font-semibold ${
                      n === current ? "border-primary bg-primary/15 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage(Math.min(pages, current + 1))}
                  disabled={current === pages}
                  className="inline-flex items-center gap-1 rounded-lg border border-border/60 px-3 py-2 text-sm disabled:opacity-40"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            )}

            <PostContentAd />
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
              <h2 className="font-display text-lg font-bold">Browse by desk</h2>
              <ul className="mt-3 space-y-1.5 text-sm">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to="/category/$slug"
                      params={{ slug: c.slug }}
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    >
                      <span>{c.name}</span>
                      <span className="text-xs">{c.tagline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden lg:block">
              <StickySidebarAd unitId="av-blog-rail" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
