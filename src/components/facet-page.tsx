import { Link } from "@tanstack/react-router";
import { facetTitle, facetStatements } from "@/lib/catalog/facet-seo";
import { facetTitleAr, facetStatementsAr } from "@/lib/catalog/facet-i18n";
import { CatalogRewards } from "@/components/catalog-rewards";
import type { CatalogType } from "@/lib/catalog/matrix";
import type { FacetPageData } from "@/lib/catalog/facet-loader";

/**
 * One intersection of the matrix.
 *
 * The sibling rail at the bottom is not decoration. Without it every facet
 * page links down into its own rows and nowhere sideways, so a crawler that
 * lands on one has no route to the other few hundred and they stay orphans —
 * which is precisely what happened to the rewards pages before this work.
 * Linking each intersection to its neighbours along the same dimensions is
 * what makes the matrix a graph instead of a pile.
 */
export function FacetPage({
  type,
  data,
  locale = "en",
}: {
  type: CatalogType;
  data: FacetPageData;
  locale?: "en" | "ar";
}) {
  const ar = locale === "ar";
  const title = ar ? facetTitleAr(type, data.entry) : facetTitle(type, data.entry);
  const statements = ar ? facetStatementsAr(type, data) : facetStatements(type, data);
  const detailRoute = type === "game" ? "/catalog/games/$slug" : "/catalog/anime/$slug";
  const parentPath = ar ? "/ar/anime" : type === "game" ? "/catalog/games" : "/anime";
  const parentName = ar ? "أنمي" : type === "game" ? "Games" : "Anime";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6" dir={ar ? "rtl" : "ltr"}>
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link to={ar ? "/ar/anime" : "/"} className="hover:text-foreground">
          {ar ? "الرئيسية" : "Home"}
        </Link>{" "}
        <span className="mx-1">/</span>
        <Link to={parentPath as "/anime"} className="hover:text-foreground">
          {parentName}
        </Link>{" "}
        <span className="mx-1">/</span> {title}
      </nav>

      <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>

      {/* Computed from the rows on this page, so no two intersections share
          this paragraph. */}
      <div className="mt-4 max-w-3xl space-y-2 text-muted-foreground">
        {statements.map((s) => (
          <p key={s}>{s}</p>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.rows.map((row) => (
          <Link
            key={row.slug}
            to={detailRoute as "/catalog/anime/$slug"}
            params={{ slug: row.slug }}
            className="group overflow-hidden rounded-2xl border border-border/60 bg-card/40 card-hover"
          >
            {row.image_url && (
              <img
                src={row.image_url}
                alt={row.name}
                loading="lazy"
                width={225}
                height={320}
                className="aspect-[225/320] w-full object-cover"
              />
            )}
            <div className="p-3">
              <h2 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
                {row.name}
              </h2>
              {row.categories?.length ? (
                <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {row.categories.slice(0, 3).join(" · ")}
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>

      {data.total > data.rows.length && (
        <p className="mt-6 text-sm text-muted-foreground">
          {ar
            ? `عرض ${data.rows.length} من ${data.total.toLocaleString("ar-EG")}.`
            : `Showing ${data.rows.length} of ${data.total.toLocaleString()}.`}
        </p>
      )}

      {data.siblings.length > 0 && (
        <section className="mt-12 border-t border-border/60 pt-8">
          <h2 className="font-display text-xl font-bold">
            {ar ? "تصنيفات ذات صلة" : "Related breakdowns"}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.siblings.map((sibling) => (
              <Link
                key={sibling.path}
                // Built at ingest time, so the path is a runtime string the
                // router's generated union cannot express.
                to={(ar ? `/ar${sibling.path}` : sibling.path) as "/anime/browse/$"}
                className="rounded-full border border-border/60 px-3 py-1.5 text-sm hover:border-primary/60"
              >
                {ar ? facetTitleAr(type, sibling) : facetTitle(type, sibling)}
                <span className="ml-1.5 text-xs text-muted-foreground">{sibling.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CatalogRewards />
    </div>
  );
}
