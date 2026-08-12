import { useMemo, useState } from "react";
import { Search, ShieldAlert, X } from "lucide-react";
import { StoreProductGrid } from "@/components/store-product-card";
import {
  storeCategories,
  type StoreCollection,
  type StoreProduct,
} from "@/data/store-products";

type CollectionFilter = "All products" | StoreCollection;

export function StoreCatalog({ products }: { products: StoreProduct[] }) {
  const [query, setQuery] = useState("");
  const [collection, setCollection] =
    useState<CollectionFilter>("All products");

  const filters: CollectionFilter[] = [
    "All products",
    ...storeCategories.map((category) => category.name),
  ];

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCollection =
        collection === "All products" || product.collection === collection;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          product.title,
          product.shortTitle,
          product.description,
          product.collection,
          product.categories.join(" "),
          product.productCode ?? "",
          product.asin ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesCollection && matchesQuery;
    });
  }, [collection, products, query]);

  return (
    <section id="catalog" className="scroll-mt-32 border-t border-border/50 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Search the complete catalog
      </p>
      <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            All GameCastle Store Products
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Search by product, franchise, category or item code, then filter by
            collection. Every purchase continues on Amazon or Play-Asia.
          </p>
        </div>
        <div className="text-sm font-bold text-foreground">
          {filteredProducts.length} of {products.length} products
        </div>
      </div>

      <div className="mt-7 rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5">
        <label htmlFor="store-search" className="sr-only">
          Search store products
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id="store-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search games, gift cards, anime figures, item codes…"
            className="h-12 w-full rounded-xl border border-border bg-background pl-12 pr-12 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear store search"
              className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div
          aria-label="Filter products by collection"
          className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {filters.map((filter) => {
            const active = filter === collection;
            const count =
              filter === "All products"
                ? products.length
                : products.filter((product) => product.collection === filter)
                    .length;
            return (
              <button
                key={filter}
                type="button"
                aria-pressed={active}
                onClick={() => setCollection(filter)}
                className={
                  active
                    ? "shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-extrabold text-primary-foreground"
                    : "shrink-0 rounded-full border border-border bg-background px-4 py-2 text-xs font-bold text-foreground/85 transition hover:border-primary/60 hover:text-primary"
                }
              >
                {filter} · {count}
              </button>
            );
          })}
        </div>
      </div>

      {(collection === "All products" ||
        collection === "Gift Cards & Digital Credit") && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <p>
            Gift cards and top-ups can be restricted by account country, game
            server or platform. Open the product details and verify the warning
            before continuing to Play-Asia.
          </p>
        </div>
      )}

      <div className="mt-7">
        {filteredProducts.length > 0 ? (
          <StoreProductGrid products={filteredProducts} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 px-5 py-12 text-center">
            <h3 className="font-display text-xl font-bold">
              No matching products
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a shorter search or choose another collection.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCollection("All products");
              }}
              className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
