import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getArticle, articles, getAuthor, articleParagraphs } from "@/data/articles";
import type { ArticleBlock, ArticleSection } from "@/data/articles";
import { Breadcrumbs } from "@/components/ui-bits";
import {
  AdSlot,
  BelowTitleAd,
  HeaderBannerAd,
  InArticleAd,
  PostContentAd,
  StickySidebarAd,
} from "@/components/ad-slot";
import { planInArticleAds } from "@/lib/ads-layout";
import { recommendArticles, articleAnimeRecs } from "@/lib/recommendations";
import { ArticleRecRail, AnimeRecRail } from "@/components/recommendations";
import { ReadingProgressBar } from "@/components/reading-progress";
import { TableOfContents } from "@/components/table-of-contents";
import { Spoiler } from "@/components/spoiler";
import { ComparisonTable } from "@/components/comparison-table";
import { ArticlePoll } from "@/components/article-poll";
import { deriveSections, readingLabel, slugifyHeading, wordCount } from "@/lib/reading";
import { getAnime } from "@/data/animes";
import { ArrowRight, Clock, FileText } from "lucide-react";
import { absoluteUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";
import {
  AffiliateProductWidget,
  InlineAffiliateCard,
  StickyAffiliateRail,
  productsForContext,
} from "@/components/affiliate-products";
import { VipUpgradeCard } from "@/components/vip-banner";

/** Renders an editor-authored rich block inside the article body. */
function ArticleBlockView({ block }: { block: ArticleBlock }) {
  if (block.type === "table") {
    return <ComparisonTable columns={block.columns} rows={block.rows} caption={block.caption} />;
  }
  if (block.type === "poll") {
    return <ArticlePoll question={block.question} options={block.options} />;
  }
  if (block.type === "link") {
    return (
      <aside className="not-prose my-8 rounded-2xl border border-primary/30 bg-primary/5 p-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Read next</div>
        <Link to={block.to} className="mt-1.5 flex items-start gap-2 font-display text-lg font-bold hover:text-gradient">
          <span>{block.label}</span>
          <ArrowRight className="mt-1 h-4 w-4 shrink-0" />
        </Link>
        {block.note && <p className="mt-1 text-sm text-muted-foreground">{block.note}</p>}
      </aside>
    );
  }
  if (block.type === "spoiler") {
    return (
      <div className="not-prose my-8">
        {block.heading && (
          <h3 className="mb-2 font-display text-xl font-bold">{block.heading}</h3>
        )}
        <Spoiler level={block.level ?? "major"} scope={block.scope}>
          <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
            {block.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Spoiler>
      </div>
    );
  }
  return (
    <div className="not-prose my-8">
      <InlineAffiliateCard
        product={{
          id: "editorial-affiliate",
          kind: "figure",
          title: block.title,
          subtitle: `${block.subtitle} · ${block.offer}`,
          price: block.price,
          rating: 4.9,
          retailer: block.retailer,
          href: block.href,
          cta: block.cta,
        }}
        note={block.note}
      />
    </div>
  );
}


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
        { property: "og:url", content: absoluteUrl(`/article/${a.slug}`) },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: absoluteUrl(`/article/${a.slug}`) }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.excerpt,
            datePublished: a.date,
            dateModified: a.date,
            mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/article/${a.slug}`) },
            articleSection: a.section,
            wordCount: wordCount(articleParagraphs(a)),
            author: { "@type": "Person", name: getAuthor(a.author)?.name },
            publisher: { "@type": "Organization", name: "AnimeVerse" },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(faqSchema([
            {
              q: `How long does it take to read "${a.title}"?`,
              a: `About ${readingLabel(articleParagraphs(a))} at an average reading pace.`,
            },
            {
              q: "Does this article contain spoilers?",
              a: "Any major plot details are placed behind clearly labelled spoiler gates you can choose to open.",
            },
            {
              q: "Who wrote this analysis?",
              a: `${getAuthor(a.author)?.name ?? "The AnimeVerse editorial team"} wrote and fact-checked this piece for AnimeVerse.`,
            },
          ])),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbSchema([
            { path: "/", name: "Home" },
            { path: "/editorial", name: "Editorial" },
            { name: a.title },
          ])),
        },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article: a } = Route.useLoaderData();
  const author = getAuthor(a.author);
  const paragraphs = articleParagraphs(a);
  const authored = Boolean(a.sections && a.sections.length > 0);
  const sections: { id: string; heading: string; paragraphs: string[]; blocks?: ArticleBlock[] }[] =
    authored
      ? (a.sections as ArticleSection[]).map((s: ArticleSection, i: number) => ({
          id: slugifyHeading(s.heading, i),
          heading: s.heading,
          paragraphs: s.paragraphs,
          blocks: s.blocks,
        }))
      : deriveSections(a.body);
  const relatedAnime = articleAnimeRecs(a.slug, 4);
  const alsoEnjoyed = recommendArticles(a.slug, 3);
  const sectionMates = articles.filter((x) => x.slug !== a.slug && x.section === a.section).slice(0, 3);
  const articleRail = alsoEnjoyed.length > 0 ? alsoEnjoyed : sectionMates;
  const inlineLinks = alsoEnjoyed.length > 0 ? alsoEnjoyed : sectionMates;
  const loreAnime = relatedAnime[0] ?? getAnime(a.related[0]);
  const merchProducts = productsForContext(loreAnime, a.title);
  // In-body native units land every 4 paragraphs; slot 1 is the guaranteed
  // above-the-fold unit, so the body plan starts at InArticle_Ad_2.
  const adPlan = planInArticleAds(sections.map((s) => s.paragraphs.length), { startAt: 2, max: 2 });

  return (
    <div>
      <ReadingProgressBar />
      <HeaderBannerAd />


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
                  <Clock className="h-3 w-3" /> {readingLabel(paragraphs)}
                </span>
                <span className="flex items-center gap-1 rounded-full border border-border/60 px-2.5 py-1 text-muted-foreground">
                  <FileText className="h-3 w-3" /> {wordCount(paragraphs).toLocaleString()} words
                </span>
              </div>
            </div>

            {/* Below-title billboard (Below_Title_Ad) */}
            <BelowTitleAd />

            {/* Mobile TOC */}
            <div className="mt-6 lg:hidden">
              <TableOfContents sections={sections} />
            </div>

            {/* Guaranteed top-of-article AdSense unit (InArticle_Ad_1) */}
            <InArticleAd index={1} unitId="av-article-top" adId="InArticle_Ad_1" />

            <div className="prose prose-invert mt-8 max-w-none text-lg leading-relaxed">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-28">
                  {authored && (
                    <h2 className="mb-4 mt-10 font-display text-2xl font-bold lg:text-3xl">{s.heading}</h2>
                  )}
                  {s.paragraphs.map((p, j) => {
                    const ad = adPlan.get(`${i}:${j}`);
                    return (
                      <div key={j}>
                        <p className="mb-6">{p}</p>
                        {/* Native unit injected every few paragraphs */}
                        {ad && (
                          <div className="not-prose">
                            <InArticleAd
                              index={ad.index}
                              unitId={`av-article-${i}-${j}`}
                              adId={ad.adId}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Editor-authored rich blocks: tables, spoilers, links, affiliate, poll */}
                  {s.blocks?.map((block, bi) => (
                    <ArticleBlockView key={bi} block={block} />
                  ))}

                  {/* Contextual internal link card, woven into the flow */}
                  {!authored && inlineLinks[i] && i % 2 === 1 && (
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


                  {/* Embedded merchandise + manga affiliate widget */}
                  {!authored && i === 2 && (
                    <AffiliateProductWidget
                      products={merchProducts}
                      title={`Featured Merchandise & Manga${loreAnime ? ` · ${loreAnime.title}` : ""}`}
                    />
                  )}

                  {/* Spoiler / lore accordion mid-article */}
                  {!authored && i === 1 && loreAnime && (
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

            <AnimeRecRail items={relatedAnime} eyebrow="Related anime" title="Anime featured in this piece" />

            <ArticleRecRail
              items={articleRail}
              eyebrow="Readers also enjoyed"
              title={alsoEnjoyed.length > 0 ? "More like this" : `More in ${a.section}`}
            />

            {/* Post-article banner (Post_Content_Ad) */}
            <PostContentAd />
          </article>

          <aside className="hidden space-y-6 lg:block">
            <StickySidebarAd />
            <VipUpgradeCard />
            <StickyAffiliateRail products={merchProducts} />
          </aside>
        </div>
      </div>
    </div>
  );
}
