import { Link } from "@tanstack/react-router";
import { ExternalLink, ShieldAlert, ShoppingBag } from "lucide-react";
import {
  storeRetailer,
  type StoreProduct,
} from "@/data/store-products";
import {
  formatStorePriceAmount,
  storePriceCheckedLabel,
  storePriceLabel,
} from "@/data/store-pricing";

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

export function StorePriceDisplay({
  product,
  className = "",
  compact = false,
}: {
  product: StoreProduct;
  className?: string;
  compact?: boolean;
}) {
  const retailer = storeRetailer(product);
  const { price } = product;
  const isOutOfStock = price.availability === "OutOfStock";

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span
          className={`inline-flex items-center gap-2 font-black text-foreground ${
            compact ? "text-lg" : "text-2xl"
          }`}
        >
          <ShoppingBag className="h-4 w-4 text-accent" />
          {storePriceLabel(price)}
        </span>
        {price.originalAmount && !isOutOfStock ? (
          <span className="text-sm font-semibold text-muted-foreground line-through">
            {formatStorePriceAmount(price.originalAmount)}
          </span>
        ) : null}
        {price.discountPercent && !isOutOfStock ? (
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-emerald-300">
            Save {price.discountPercent}%
          </span>
        ) : null}
        {isOutOfStock ? (
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-amber-300">
            Currently sold out
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
        Checked {storePriceCheckedLabel(price.checkedAt)}. Price and availability
        may change at {retailer}.
      </p>
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
  const actionLabel =
    product.price.availability === "OutOfStock"
      ? `Check on ${retailer}`
      : `Buy on ${retailer}`;
  const retailerStyle =
    retailer === "Amazon"
      ? "bg-[#ff9900] text-[#111827] hover:bg-[#ffad33] focus-visible:ring-[#ff9900]"
      : "bg-sky-500 text-white hover:bg-sky-400 focus-visible:ring-sky-400";

  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      aria-label={`${actionLabel}: ${product.shortTitle}`}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${retailerStyle} ${className}`}
    >
      {actionLabel} <ExternalLink className="h-4 w-4" />
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
          {product.purchaseNotice && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[9px] tracking-[0.08em] text-amber-300">
              <ShieldAlert className="h-3 w-3" /> Check details
            </span>
          )}
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
          <StorePriceDisplay product={product} compact className="mb-3" />
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
