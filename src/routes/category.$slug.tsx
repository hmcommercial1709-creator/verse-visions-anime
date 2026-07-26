import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  articles,
  articleParagraphs,
  categoryForArticle,
  getAuthor,
  type Article,
} from "@/data/articles";
import { categories, getCategory } from "@/data/categories";
import { Breadcrumbs } from "@/components/ui-bits";
import { HeaderBannerAd, InArticleAd, PostContentAd, StickySidebarAd } from "@/components/ad-slot";
import { MediaImage } from "@/components/media";
import { backdropFor, artAlt } from "@/lib/media";
import { readingLabel } from "@/lib/reading";
import { breadcrumbSchema } from "@/lib/seo";
import { Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ params, loaderData }) => {
    const url = `https://gamecastle.store/category/${params.slug}`;
    if (!loaderData) {
      return { meta: [{ title: "Category not found · AnimeVerse" }, { name: "robots", content: "noindex" }] };
    }
    const c = loaderData.category;
    const title = `${c.name} — ${c.tagline} · AnimeVerse`;
    return {
      meta: [
        { title },
        { name: "description", content: c.description },
        { property: "og:title", content: title },
        { property: "og:description", content: c.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description: c.description,
            url,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: c.name, path: `/category/${c.slug}` },
            ]),
          ),
        },
      ],
    };
  },
  component: CategoryPage,
});

function Card({ a, featured = false }: { a: Article; featured?: boolean }) {
  const author = getAuthor(a.author);
  return (
    <Link
      to="/article/$slug"
      params={{ slug: a.slug }}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 card-hover hover:border-primary/50 ${
        featured ? "sm:col-span-2" : ""
      }`}
    >
      <div style={{ background: a.cover }}>
        <MediaImage
          art={backdropFor(a.slug, [a.title, a.tag])}
          alt={artAlt(a.title)}
          ratio="16/9"
          sizes={featured ? "(max-width:768px) 100vw, 66vw" : "(max-width:768px) 100vw, 33vw"}
          priority={featured}
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{a.tag}</div>
        <h3 className={`mt-1.5 font-display font-bold leading-snug group-hover:text-gradient ${featured ? "text-2xl" : "text-lg"}`}>
          {a.title}
        </h3>
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

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const list = articles.filter((a) => categoryForArticle(a) === category.slug);
  const [lead, ...rest] = list;

  return (
    <div>
      <HeaderBannerAd />
      <section className="relative overflow-hidden border-b border-border/60" style={{ background: category.gradient }}>
        <div className="bg-background/70">
          <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
            <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/blog", label: "Blog" }, { label: category.name }]} />
            <div className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: category.accent }}>
              {category.tagline}
            </div>
            <h1 className="mt-2 font-display text-5xl font-bold lg:text-6xl">{category.name}</h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{category.description}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
              {(category.intro as string[]).map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <h2 className="mt-10 font-display text-2xl font-bold">
              {list.length} {list.length === 1 ? "article" : "articles"} in {category.name}
            </h2>

            {list.length === 0 ? (
              <p className="mt-4 text-muted-foreground">This desk is publishing soon.</p>
            ) : (
              <>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {lead && <Card a={lead} featured />}
                  {rest.slice(0, 3).map((a) => (
                    <Card key={a.slug} a={a} />
                  ))}
                </div>
                {/* In-feed responsive unit between content blocks */}
                <InArticleAd index={2} unitId={`av-cat-${category.slug}`} adId="InArticle_Ad_2" />
                {rest.length > 3 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {rest.slice(3).map((a) => (
                      <Card key={a.slug} a={a} />
                    ))}
                  </div>
                )}
              </>
            )}

            <h2 className="mt-12 font-display text-2xl font-bold">Other desks</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {categories
                .filter((c) => c.slug !== category.slug)
                .map((c) => (
                  <Link
                    key={c.slug}
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className="group flex items-center justify-between rounded-xl border border-border/60 bg-card/40 px-4 py-3 hover:border-primary/50"
                  >
                    <span>
                      <span className="font-display font-bold group-hover:text-gradient">{c.name}</span>
                      <span className="block text-xs text-muted-foreground">{c.tagline}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
            </div>

            <PostContentAd />
          </div>

          <aside className="hidden lg:block">
            <StickySidebarAd unitId={`av-cat-rail-${category.slug}`} />
          </aside>
        </div>
      </div>
    </div>
  );
}
