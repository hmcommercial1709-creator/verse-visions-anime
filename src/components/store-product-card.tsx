import { Link } from "@tanstack/react-router";
import { ExternalLink, ShoppingBag } from "lucide-react";
import type { StoreProduct } from "@/data/store-products";

export function StoreProductImage({
  product,
  eager = false,
  className = "",
}: {
  product: StoreProduct;
  eager?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-white via-white to-slate-100 ${className}`}
    >
      <img
        src={product.imageUrl}
        alt={product.imageAlt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-[1.04]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  );
}

export function AmazonButton({
  product,
  className = "",
}: {
  product: StoreProduct;
  className?: string;
}) {
  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      aria-label={`Buy ${product.shortTitle} on Amazon`}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff9900] px-4 py-2.5 text-sm font-extrabold text-[#111827] transition hover:bg-[#ffad33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9900] focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
    >
      Buy Now <ExternalLink className="h-4 w-4" />
    </a>
  );
}

export function StoreProductCard({ product }: { product: StoreProduct }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/70 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-primary/10">
      <Link
        to="/store/$slug"
        params={{ slug: product.slug }}
        aria-label={`View ${product.shortTitle}`}
      >
        <StoreProductImage product={product} className="aspect-square w-full" />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
          {product.categories[0]}
        </div>
        <Link
          to="/store/$slug"
          params={{ slug: product.slug }}
          className="mt-2 font-display text-lg font-bold leading-snug transition-colors hover:text-primary"
        >
          {product.shortTitle}
        </Link>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-auto pt-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShoppingBag className="h-4 w-4 text-accent" /> Check latest price
            on Amazon
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Link
              to="/store/$slug"
              params={{ slug: product.slug }}
              className="inline-flex items-center justify-center rounded-xl border border-border px-3 py-2.5 text-sm font-semibold transition hover:border-primary/60 hover:text-primary"
            >
              Details
            </Link>
            <AmazonButton product={product} />
          </div>
        </div>
      </div>
    </article>
  );
}

export function StoreProductGrid({ products }: { products: StoreProduct[] }) {
  if (products.length === 0) return null;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <StoreProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
