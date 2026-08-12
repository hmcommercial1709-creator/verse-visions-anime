import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, ShoppingBag, Sparkles, Zap } from "lucide-react";
import { StoreProductImage } from "@/components/store-product-card";
import { storeProducts, type StoreProduct } from "@/data/store-products";

const HOME_STORE_SLUGS = [
  "my-dress-up-darling-taito-t-most-figure",
  "satoru-gojo-anime-heroes-jujutsu-kaisen-figure",
  "roronoa-zoro-funko-pop-one-piece",
  "steelseries-arctis-wireless-gaming-headset",
];

const homeStoreProducts = HOME_STORE_SLUGS.map((slug) =>
  storeProducts.find((product) => product.slug === slug),
).filter((product): product is StoreProduct => Boolean(product));

export function HomeStorePromo() {
  return (
    <section
      aria-labelledby="home-store-heading"
      className="relative overflow-hidden border-b border-[#ff9900]/20 bg-gradient-to-br from-[#ff9900]/10 via-background to-primary/10"
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#ff9900]/15 [mask-image:radial-gradient(circle,#000,transparent_70%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-7 px-4 py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:px-6 lg:py-10">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff9900]/40 bg-[#ff9900]/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#ffb84d]">
            <Sparkles className="h-3.5 w-3.5" />
            New · GameCastle Store
          </div>
          <h2
            id="home-store-heading"
            className="mt-4 font-display text-3xl font-black leading-tight sm:text-4xl"
          >
            Bring your favorite anime worlds home.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Discover anime figures, games, Nintendo accessories, regional gift
            cards and game top-ups. Search the catalog, then compare the latest
            price and availability on Amazon, Play-Asia or GAMIVO.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              to="/store"
              className="inline-flex items-center gap-2 rounded-xl bg-[#ff9900] px-5 py-3 font-extrabold text-[#111827] shadow-lg shadow-[#ff9900]/20 transition hover:bg-[#ffad33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9900]"
            >
              <ShoppingBag className="h-5 w-5" />
              Shop the collection
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/game-top-up"
              className="inline-flex items-center gap-2 rounded-xl border border-[#f47b25]/50 bg-[#f47b25]/10 px-5 py-3 font-extrabold text-[#ff9a51] transition hover:border-[#f47b25] hover:bg-[#f47b25]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47b25]"
            >
              <Zap className="h-5 w-5" />
              Instant game top-ups
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-sm font-semibold text-foreground/80">
              {storeProducts.length} curated catalog products
            </span>
          </div>
          <div className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <p>
              Checkout, delivery and applicable returns are handled by Amazon
              Play-Asia or GAMIVO. GameCastle may earn from qualifying purchases.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {homeStoreProducts.map((product) => (
            <Link
              key={product.slug}
              to="/store/$slug"
              params={{ slug: product.slug }}
              aria-label={`View ${product.shortTitle} in the GameCastle Store`}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-[#ff9900]/60"
            >
              <StoreProductImage
                product={product}
                className="aspect-square w-full"
              />
              <div className="p-3">
                <div className="line-clamp-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#ffb84d]">
                  {product.categories[0]}
                </div>
                <h3 className="mt-1 line-clamp-2 font-display text-sm font-bold leading-snug group-hover:text-[#ffb84d]">
                  {product.shortTitle}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
