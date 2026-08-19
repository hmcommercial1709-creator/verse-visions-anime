import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Flame, Gamepad2, Loader2, ShieldCheck, X, Zap } from "lucide-react";
import { getFeaturedProducts } from "@/lib/brolexy.functions";
import type { FeaturedProduct } from "@/lib/brolexy-types";

const WHOP_CHECKOUT_BASE = "https://whop.com/gamecastle/checkout";

const CATEGORY_THEME: Record<string, string> = {
  PSN: "from-[#0070d1]/70 via-[#003791]/50 to-[#050b17]",
  STEAM: "from-[#1b2838]/90 via-[#2a475e]/60 to-[#050b17]",
  XBOX: "from-[#107c10]/70 via-[#0b5d0b]/50 to-[#050b17]",
  ROBLOX: "from-[#e2231a]/60 via-[#7a1210]/50 to-[#050b17]",
  NETFLIX: "from-[#e50914]/60 via-[#5c0409]/50 to-[#050b17]",
  NINTENDO: "from-[#e60012]/60 via-[#5c0007]/50 to-[#050b17]",
  SPOTIFY: "from-[#1db954]/60 via-[#0b5c2a]/50 to-[#050b17]",
  PUBG: "from-[#f2a900]/60 via-[#6b4a00]/50 to-[#050b17]",
};

function themeFor(category: string) {
  return (
    CATEGORY_THEME[category.toUpperCase()] ??
    "from-primary/50 via-primary/20 to-[#050b17]"
  );
}

function formatPrice(product: FeaturedProduct) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: product.currency || "USD",
    }).format(product.price);
  } catch {
    return `${product.price.toFixed(2)} ${product.currency}`;
  }
}

function CheckoutModal({
  product,
  onClose,
}: {
  product: FeaturedProduct;
  onClose: () => void;
}) {
  const [frameLoaded, setFrameLoaded] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Secure checkout for ${product.name}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-primary/30 bg-[#0a1120] shadow-2xl shadow-primary/20">
        <header className="flex items-start justify-between gap-4 border-b border-white/10 bg-[#0e1728] px-5 py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Secure checkout · gamecastle.store
            </p>
            <h3 className="mt-1 truncate font-display text-lg font-black text-white">
              {product.name}
            </h3>
            <p className="mt-0.5 text-sm font-bold text-emerald-400">
              {formatPrice(product)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="rounded-xl border border-white/15 p-2 text-slate-300 transition hover:border-white/40 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="relative flex-1 bg-[#050b17]">
          {!frameLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm font-semibold">Loading secure checkout…</p>
            </div>
          )}
          <iframe
            title={`Checkout for ${product.name}`}
            src={`${WHOP_CHECKOUT_BASE}/${encodeURIComponent(product.id)}`}
            onLoad={() => setFrameLoaded(true)}
            className="h-full w-full border-0"
            allow="payment *; clipboard-write"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <footer className="flex items-center gap-2 border-t border-white/10 bg-[#0e1728] px-5 py-3 text-[11px] text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Payments are processed securely. You stay on gamecastle.store the whole
          time — instant digital delivery after payment.
        </footer>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onBuy,
}: {
  product: FeaturedProduct;
  onBuy: (product: FeaturedProduct) => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c1424] shadow-lg shadow-black/30 transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-primary/10">
      <div
        className={`relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br ${themeFor(product.category)}`}
      >
        <Gamepad2 className="h-12 w-12 text-white/80" />
        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-white">
          {product.category}
        </span>
        <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white/90">
          {product.region}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-white">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-black text-emerald-400">
            {formatPrice(product)}
          </span>
          <span
            className={`text-[11px] font-bold ${product.inStock > 0 ? "text-slate-400" : "text-amber-400"}`}
          >
            {product.inStock > 0 ? `${product.inStock} in stock` : "Sold out"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onBuy(product)}
          disabled={product.inStock <= 0}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Zap className="h-4 w-4" />
          Buy Now
        </button>
      </div>
    </article>
  );
}

function CardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-white/10 bg-[#0c1424]">
      <div className="aspect-[16/10] w-full animate-pulse bg-white/5" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-4/5 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-white/10" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-white/5" />
      </div>
    </div>
  );
}

export function FeaturedProducts({ limit = 12 }: { limit?: number }) {
  const fetchFeatured = useServerFn(getFeaturedProducts);
  const [active, setActive] = useState<FeaturedProduct | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["brolexy-featured", limit],
    queryFn: () => fetchFeatured({ data: { limit } }),
    staleTime: 5 * 60 * 1000,
  });

  const products = data ?? [];

  return (
    <section
      aria-labelledby="featured-products-heading"
      className="relative border-y border-white/10 bg-[#070d18]"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-primary">
              <Flame className="h-3.5 w-3.5" />
              Featured &amp; Best Sellers
            </p>
            <h2
              id="featured-products-heading"
              className="mt-4 font-display text-3xl font-black leading-tight text-white sm:text-4xl"
            >
              Instant game keys, gift cards &amp; top-ups
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-slate-400">
              Live wholesale catalog with real-time pricing and stock. Checkout
              happens right here on gamecastle.store with instant digital
              delivery.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Secure on-site checkout
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: Math.min(limit, 8) }).map((_, index) => (
                <CardSkeleton key={index} />
              ))
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onBuy={setActive}
                />
              ))}
        </div>
      </div>

      {active && (
        <CheckoutModal product={active} onClose={() => setActive(null)} />
      )}
    </section>
  );
}
