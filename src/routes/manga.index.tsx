import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { loadCatalogFromDb } from "@/lib/catalog/db-catalog";
import { CATALOG_HEADERS } from "@/lib/catalog/http";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

/**
 * The manga archive. Pagination is bounded by the actual database catalog so
 * crawlers cannot manufacture thousands of theoretical page URLs. Manga
 * detail pages remain untouched.
 */
const PAGE_SIZE = 36;

export const Route = createFileRoute("/manga/")({
  validateSearch: (search: Record<string, unknown>): { page?: number } => {
    const raw = Number(search?.page);
    const page = Number.isFinite(raw) && raw > 1 ? Math.floor(raw) : 1;
    return page > 1 ? { page } : {};
  },
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: async ({ deps }) => {
    const db = await loadCatalogFromDb("manga", deps.page, PAGE_SIZE);
    if (!db || db.items.length === 0 || deps.page > db.totalPages) throw notFound();
    return { items: db.items, page: deps.page, totalPages: db.totalPages, total: db.total };
  },
  headers: () => CATALOG_HEADERS,
  head: ({ loaderData }) => {
    const page = loaderData?.page ?? 1;
    const total = loaderData?.total ?? 0;
    const title = page > 1 ? `Manga — Page ${page} | GameCastle` : "Manga | GameCastle";
    const description =
      page > 1
        ? `Manga with chapter counts, volumes, authors and where each ranks — page ${page}.`
        : `Browse ${total > 0 ? `${total.toLocaleString()} ` : ""}manga series with chapter counts, volumes, authors and serialisation history.`;
    const url = page > 1 ? `${absoluteUrl("/manga")}?page=${page}` : absoluteUrl("/manga");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([{ path: "/", name: "Home" }, { name: "Manga" }]),
          ),
        },
      ],
    };
  },
  component: MangaArchive,
});

function MangaArchive() {
  const { items, page, totalPages, total } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        <span className="mx-1">/</span> Manga
      </nav>

      <h1 className="font-display text-4xl font-bold">Manga</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Chapter counts, volumes, authors and serialisation history, with each series placed against
        the rest of this catalog.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.slug}
            to="/catalog/manga/$slug"
            params={{ slug: item.slug }}
            className="group overflow-hidden rounded-2xl border border-border/60 bg-card/40 card-hover"
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                loading="lazy"
                width={225}
                height={320}
                className="aspect-[225/320] w-full object-cover"
              />
            )}
            <div className="p-3">
              <h2 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
                {item.name}
              </h2>
              {item.categories?.length ? (
                <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {item.categories.slice(0, 3).join(" · ")}
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>

      <nav
        className="mt-10 flex items-center justify-between border-t border-border/60 pt-5"
        aria-label="Pagination"
      >
        {page > 1 ? (
          <Link
            to="/manga"
            search={page - 1 > 1 ? { page: page - 1 } : {}}
            className="text-sm font-semibold text-primary hover:underline"
          >
            ← Previous
          </Link>
        ) : (
          <span />
        )}
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
          {total > 0 ? ` · ${total.toLocaleString()} series` : ""}
        </span>
        {page < totalPages ? (
          <Link
            to="/manga"
            search={{ page: page + 1 }}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Next →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
