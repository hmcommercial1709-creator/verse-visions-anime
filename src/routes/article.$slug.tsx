import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getArticle, articles, getAuthor } from "@/data/articles";
import { Breadcrumbs } from "@/components/ui-bits";
import { AdSlot, InArticleAd, StickySidebarAd } from "@/components/ad-slot";
import { recommendArticles, articleAnimeRecs } from "@/lib/recommendations";
import { ArticleRecRail, AnimeRecRail } from "@/components/recommendations";
import { ReadingProgressBar } from "@/components/reading-progress";
import { TableOfContents } from "@/components/table-of-contents";
import { Spoiler } from "@/components/spoiler";
import { deriveSections, readingLabel, wordCount } from "@/lib/reading";
import { getAnime } from "@/data/animes";
import { Clock, FileText } from "lucide-react";

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
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.excerpt,
            datePublished: a.date,
            articleSection: a.section,
            wordCount: wordCount(a.body),
            author: { "@type": "Person", name: getAuthor(a.author)?.name },
            publisher: { "@type": "Organization", name: "AnimeVerse" },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `How long does it take to read "${a.title}"?`,
                acceptedAnswer: { "@type": "Answer", text: `About ${readingLabel(a.body)} at an average reading pace.` },
              },
              {
                "@type": "Question",
                name: "Does this article contain spoilers?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Any major plot details are placed behind clearly labelled spoiler gates you can choose to open.",
                },
              },
            ],
          }),
        },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article: a } = Route.useLoaderData();
  const author = getAuthor(a.author);
  const sections = deriveSections(a.body);
  const relatedAnime = articleAnimeRecs(a.slug, 4);
  const alsoEnjoyed = recommendArticles(a.slug, 3);
  const sectionMates = articles.filter((x) => x.slug !== a.slug && x.section === a.section).slice(0, 3);
  const articleRail = alsoEnjoyed.length > 0 ? alsoEnjoyed : sectionMates;
  const inlineLinks = alsoEnjoyed.length > 0 ? alsoEnjoyed : sectionMates;
  const loreAnime = relatedAnime[0] ?? getAnime(a.related[0]);

  return (
    <div>
      <ReadingProgressBar />

      <section className="relative">
        <div className="h-64 lg:h-80" style={{ background: a.cover }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="relative -mt-24 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)_300px]">
          {/* Sticky TOC (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents sections={sections} />
            </div>
          </aside>

          <article className="min-w-0">
            <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: `/${a.section}`, label: a.section }, { label: a.title }]} />
            <div className="text-xs uppercase tracking-[0.22em] text-primary font-semibold">{a.tag}</div>
            <h1 className="mt-2 font-display text-4xl lg:text-5xl font-bold">{a.title}</h1>
            <p className="mt-4 text-xl text-muted-foreground">{a.excerpt}</p>

            <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-y border-border/60 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{author?.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{author?.role} · {a.date}</div>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-1.5 text-[11px]">
                <span className="flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                  <Clock className="h-3 w-3" /> {readingLabel(a.body)}
                </span>
                <span className="flex items-center gap-1 rounded-full border border-border/60 px-2.5 py-1 text-muted-foreground">
                  <FileText className="h-3 w-3" /> {wordCount(a.body).toLocaleString()} words
                </span>
              </div>
            </div>

            {/* Mobile TOC */}
            <div className="mt-6 lg:hidden">
              <TableOfContents sections={sections} />
            </div>

            <div className="prose prose-invert mt-8 max-w-none text-lg leading-relaxed">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-28">
                  {s.paragraphs.map((p, j) => (
                    <p key={j} className="mb-6">{p}</p>
                  ))}

                  {/* Contextual internal link card, woven into the flow */}
                  {inlineLinks[i] && i % 2 === 1 && (
                    <aside className="my-8 not-prose rounded-2xl border border-primary/30 bg-primary/5 p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Read next</div>
                      <Link
                        to="/article/$slug"
                        params={{ slug: inlineLinks[i].slug }}
                        className="mt-1.5 block font-display text-lg font-bold hover:text-gradient"
                      >
                        {inlineLinks[i].title}
                      </Link>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{inlineLinks[i].excerpt}</p>
                    </aside>
                  )}

                  {/* Native ad every third section */}
                  {i > 0 && (i + 1) % 3 === 0 && (
                    <div className="not-prose">
                      <InArticleAd index={Math.ceil((i + 1) / 3)} unitId={`av-article-${i + 1}`} />
                    </div>
                  )}

                  {/* Spoiler / lore accordion mid-article */}
                  {i === 1 && loreAnime && (
                    <div className="not-prose">
                      <Spoiler level="major" scope={loreAnime.title}>
                        <div className="space-y-2 text-base">
                          <p className="text-muted-foreground">{loreAnime.worldBuilding}</p>
                          <ul className="space-y-1">
                            {loreAnime.arcs.slice(0, 3).map((arc) => (
                              <li key={arc.title} className="text-sm">
                                <span className="font-semibold">{arc.title}</span>{" "}
                                <span className="text-muted-foreground">— {arc.summary}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Spoiler>
                    </div>
                  )}
                </section>
              ))}
            </div>

            <AdSlot placement="inline" />

            <AnimeRecRail items={relatedAnime} eyebrow="Related anime" title="Anime featured in this piece" />

            <ArticleRecRail
              items={articleRail}
              eyebrow="Readers also enjoyed"
              title={alsoEnjoyed.length > 0 ? "More like this" : `More in ${a.section}`}
            />
          </article>

          <aside className="hidden lg:block">
            <StickySidebarAd />
          </aside>
        </div>
      </div>
    </div>
  );
}
