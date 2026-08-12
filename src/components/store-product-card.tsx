import { Link } from "@tanstack/react-router";
import { ExternalLink, ShoppingBag } from "lucide-react";
import {
  storeRetailer,
  type StoreProduct,
} from "@/data/store-products";

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
        referrerPolicy="no-referrer"
        className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-[1.04]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  );
}

export function StoreBuyButton({
  product,
  className = "",
}: {
  product: StoreProduct;
  className?: string;
}) {
  const retailer = storeRetailer(product);
  const retailerStyle =
    retailer === "Amazon"
      ? "bg-[#ff9900] text-[#111827] hover:bg-[#ffad33] focus-visible:ring-[#ff9900]"
      : "bg-sky-500 text-white hover:bg-sky-400 focus-visible:ring-sky-400";

  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      aria-label={`Buy ${product.shortTitle} on ${retailer}`}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${retailerStyle} ${className}`}
    >
      Buy on {retailer} <ExternalLink className="h-4 w-4" />
    </a>
  );
}

export function StoreProductCard({ product }: { product: StoreProduct }) {
  const retailer = storeRetailer(product);

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
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
          <span>{product.categories[0]}</span>
          <span className="rounded-full border border-border/60 bg-background/60 px-2 py-0.5 text-[9px] tracking-[0.12em] text-muted-foreground">
            {retailer}
          </span>
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
            on {retailer}
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Link
              to="/store/$slug"
              params={{ slug: product.slug }}
              className="inline-flex items-center justify-center rounded-xl border border-border px-3 py-2.5 text-sm font-semibold transition hover:border-primary/60 hover:text-primary"
            >
              Details
            </Link>
            <StoreBuyButton product={product} className="w-full" />
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
