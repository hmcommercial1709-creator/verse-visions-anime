import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { loadCatalogItemFromDb } from "@/lib/catalog/db-catalog";
import { parseMeta, generatedFaq, type CatalogMeta } from "@/lib/catalog/catalog-facts";
import { CatalogSections } from "@/components/catalog-sections";
import { CatalogRewards } from "@/components/catalog-rewards";
import { CATALOG_HEADERS } from "@/lib/catalog/http";
import { absoluteUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";

/**
 * A manga detail page.
 *
 * Database only, with no live upstream call. That is the difference from the
 * anime and game routes, and it is deliberate: Jikan serves one manga per
 * request at roughly three per second, so enriching on render would put a
 * rate-limited third party in the path of every page view. Everything worth
 * showing is already stored by scripts/ingest-manga.mjs, including the
 * derived cross-catalog facts that the API could not supply anyway.
 */
export const Route = createFileRoute("/catalog/manga/$slug")({
  loader: async ({ params }) => {
    const row = await loadCatalogItemFromDb("manga", params.slug);
    if (!row) throw notFound();
    return { row, meta: parseMeta(row.metadata) };
  },
  headers: () => CATALOG_HEADERS,
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const { row, meta } = loaderData;
    const url = absoluteUrl(`/catalog/manga/${params.slug}`);
    const year = meta?.publishedFrom?.slice(0, 4);
    const faq = generatedFaq(meta, row.name, "manga");
    const description =
      row.description?.slice(0, 300) ??
      `${row.name}${year ? ` (${year})` : ""} — chapters, volumes, authors and where it ranks.`;

    return {
      meta: [
        { title: `${row.name}${year ? ` (${year})` : ""} | GameCastle Manga Catalog` },
        { name: "description", content: description },
        { property: "og:title", content: row.name },
        { property: "og:description", content: description },
        { property: "og:type", content: "book" },
        ...(row.image_url ? [{ property: "og:image", content: row.image_url }] : []),
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            // schema.org has no "Manga" type; a serialised comic is a Book
            // with a ComicSeries-shaped body, and Book is the one search
            // engines actually consume.
            "@type": "Book",
            name: row.name,
            alternateName: meta?.titles?.native || undefined,
            url,
            description,
            image: row.image_url ?? undefined,
            ...(meta?.authors?.length
              ? { author: meta.authors.map((n) => ({ "@type": "Person", name: n })) }
              : {}),
            ...(meta?.volumes ? { numberOfPages: undefined } : {}),
            ...(year ? { datePublished: year } : {}),
            genre: row.categories ?? [],
            ...(meta?.malScore && meta?.scoredBy
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: meta.malScore,
                    ratingCount: meta.scoredBy,
                    bestRating: 10,
                    worstRating: 1,
                  },
                }
              : {}),
            sameAs: row.source_url ?? undefined,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { path: "/", name: "Home" },
              { path: "/manga", name: "Manga Catalog" },
              { name: row.name },
            ]),
          ),
        },
        ...(faq.length > 0
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify(
                  faqSchema(faq.map((item) => ({ q: item.question, a: item.answer }))),
                ),
              },
            ]
          : []),
      ],
    };
  },
  component: MangaDetail,
});

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-border/60 px-3 py-1 text-xs">{children}</span>;
}

function MangaDetail() {
  const { row, meta } = Route.useLoaderData();
  const m: CatalogMeta | null = meta;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        <span className="mx-1">/</span>
        <Link to="/manga" className="hover:text-foreground">
          Manga Catalog
        </Link>{" "}
        <span className="mx-1">/</span> {row.name}
      </nav>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        {row.image_url && (
          <img
            src={row.image_url}
            alt={row.name}
            width={425}
            height={600}
            className="w-full rounded-2xl border border-border/60 object-cover"
          />
        )}
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{row.name}</h1>
          {m?.titles?.native && (
            <p className="mt-1 text-sm text-muted-foreground">{m.titles.native}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {m?.chapters ? <Badge>{m.chapters} chapters</Badge> : null}
            {m?.volumes ? <Badge>{m.volumes} volumes</Badge> : null}
            {m?.status ? <Badge>{m.status}</Badge> : null}
            {m?.malScore ? (
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
                ⭐ {m.malScore}
              </span>
            ) : null}
          </div>

          {row.description && (
            <p className="mt-5 leading-relaxed text-muted-foreground">{row.description}</p>
          )}

          {(m?.authors?.length || m?.serializations?.length) && (
            <dl className="mt-6 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              {m?.authors?.length ? (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Author</dt>
                  <dd className="font-semibold">{m.authors.join(", ")}</dd>
                </div>
              ) : null}
              {m?.serializations?.length ? (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                    Serialised in
                  </dt>
                  <dd className="font-semibold">{m.serializations.join(", ")}</dd>
                </div>
              ) : null}
            </dl>
          )}
        </div>
      </div>

      <CatalogSections meta={m} name={row.name} kind="manga" />

      <CatalogRewards />

      <p className="mt-10 text-xs text-muted-foreground">
        Catalog entry from the GameCastle catalog
        {row.source_name ? `, sourced from ${row.source_name}` : ""}. Placement, cohort and
        similarity figures on this page are computed across the GameCastle catalog.
      </p>
    </div>
  );
}
