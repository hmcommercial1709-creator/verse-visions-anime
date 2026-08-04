import { ExternalLink, BookOpen, Package, Star } from "lucide-react";
import type { Anime } from "@/data/animes";

export interface AffiliateProduct {
  id: string;
  kind: "figure" | "manga" | "merch";
  title: string;
  subtitle: string;
  price: string;
  rating?: number;
  retailer: string;
  href: string;
  cta?: string;
}

const KIND_META: Record<AffiliateProduct["kind"], { label: string; Icon: typeof Package }> = {
  figure: { label: "Official Figure", Icon: Package },
  manga: { label: "Manga Volume", Icon: BookOpen },
  merch: { label: "Merchandise", Icon: Package },
};

/**
 * Deterministic starter catalogue derived from the anime in context so every
 * article template can show relevant merch without hand-authoring rows.
 */
export function productsForContext(anime?: Anime | null, fallbackTitle = "GameCastle Anime Picks"): AffiliateProduct[] {
  const name = anime?.title ?? fallbackTitle;
  const slug = anime?.slug ?? "animeverse";
  return [
    {
      id: `${slug}-figure`,
      kind: "figure",
      title: `${name} — 1/7 Scale Figure`,
      subtitle: "Licensed scale statue, sculpted display base",
      price: "$149.99",
      rating: 4.8,
      retailer: "Amazon",
      href: "https://www.amazon.com",
      cta: "Buy Official Figure",
    },
    {
      id: `${slug}-manga`,
      kind: "manga",
      title: `${name} — Manga Box Set`,
      subtitle: "Official English edition, complete first arc",
      price: "$64.99",
      rating: 4.9,
      retailer: "Bookshop",
      href: "https://bookshop.org",
      cta: "Shop Manga",
    },
    {
      id: `${slug}-merch`,
      kind: "merch",
      title: `${name} — Art Print Set`,
      subtitle: "Studio-approved key art, museum-grade paper",
      price: "$32.00",
      rating: 4.6,
      retailer: "Crunchyroll Store",
      href: "https://store.crunchyroll.com",
      cta: "View Deal",
    },
  ];
}

function Row({ product }: { product: AffiliateProduct }) {
  const { label, Icon } = KIND_META[product.kind];
  return (
    <div className="group flex gap-3 rounded-xl border border-border/60 bg-background/40 p-3 transition-colors hover:border-primary/50">
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
        <div className="mt-0.5 truncate text-sm font-semibold">{product.title}</div>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{product.subtitle}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-display text-base font-bold text-primary">{product.price}</span>
          {product.rating && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Star className="h-3 w-3 fill-accent text-accent" />
              {product.rating.toFixed(1)}
            </span>
          )}
          <span className="ml-auto text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80">
            {product.retailer}
          </span>
        </div>
        <a
          href={product.href}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
        >
          {product.cta ?? "View Deal"} <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

/** Embedded (in-flow) merchandise widget for article bodies. */
export function AffiliateProductWidget({
  products,
  title = "Featured Merchandise & Manga",
  limit = 3,
}: {
  products: AffiliateProduct[];
  title?: string;
  limit?: number;
}) {
  if (products.length === 0) return null;
  return (
    <aside
      data-affiliate-widget="embedded"
      className="not-prose my-8 overflow-hidden rounded-2xl border border-border/60 bg-card/50"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/50 bg-primary/5 px-4 py-3">
        <h3 className="font-display text-sm font-bold">{title}</h3>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Affiliate</span>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, limit).map((p) => (
          <Row key={p.id} product={p} />
        ))}
      </div>
      <p className="border-t border-border/50 px-4 py-2 text-[11px] text-muted-foreground">
        GameCastle Anime may earn a commission on purchases made through these links. Prices are indicative.
      </p>
    </aside>
  );
}

/** Sticky sidebar variant that follows the reader down long articles. */
export function StickyAffiliateRail({
  products,
  title = "Featured Merchandise",
  limit = 2,
}: {
  products: AffiliateProduct[];
  title?: string;
  limit?: number;
}) {
  if (products.length === 0) return null;
  return (
    <div
      data-affiliate-widget="sticky"
      className="sticky top-28 overflow-hidden rounded-2xl border border-border/60 bg-card/50"
    >
      <div className="border-b border-border/50 bg-primary/5 px-4 py-3">
        <h3 className="font-display text-sm font-bold">{title}</h3>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Reader picks · Affiliate</span>
      </div>
      <div className="space-y-3 p-3">
        {products.slice(0, limit).map((p) => (
          <Row key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

/**
 * Compact single-product card for weaving directly into long-form paragraph
 * flow. Reads as part of the editorial rather than as a banner.
 */
export function InlineAffiliateCard({ product, note }: { product: AffiliateProduct; note?: string }) {
  const { label, Icon } = KIND_META[product.kind];
  return (
    <aside
      data-affiliate-widget="inline"
      className="not-prose my-8 flex flex-col gap-3 rounded-2xl border border-primary/25 bg-primary/[0.04] p-4 sm:flex-row sm:items-center"
    >
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label} · Affiliate
        </div>
        <div className="mt-0.5 text-sm font-semibold">{product.title}</div>
        <p className="mt-0.5 text-xs text-muted-foreground">{note ?? product.subtitle}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="font-display text-lg font-bold text-primary">{product.price}</span>
        <a
          href={product.href}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
        >
          {product.cta ?? "View Deal"} <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </aside>
  );
}
