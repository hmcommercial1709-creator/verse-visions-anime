import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";
import { DisplayAd } from "@/components/ad-slot";
import {
  STORE_CATEGORIES,
  productsByCategory,
  storeProducts,
  type StoreProduct,
} from "@/data/store-products";
import { Bitcoin, Check, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { buildMaypalCheckoutUrl } from "@/lib/maypal";

const SITE = "https://gamecastle.store";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "Digital Phone Wallpapers Store — 4K Anime & Dark Aesthetic Packs" },
      {
        name: "description",
        content:
          "Buy premium 4K phone wallpaper packs: high-quality anime wallpapers and dark aesthetic AMOLED backgrounds. Instant download delivery, one-time price of $1.99, secure Maypal crypto checkout.",
      },
      { property: "og:title", content: "Digital Phone Wallpapers Store · AnimeVerse" },
      {
        property: "og:description",
        content: "500+ 4K anime and dark aesthetic phone wallpapers. Instant delivery, $1.99 per pack, Maypal crypto checkout.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/store` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/store` }],
  }),
  component: StorePage,
});

function ProductCard({ p }: { p: StoreProduct }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-black/60">
      <div className="relative aspect-[16/10] overflow-hidden" style={{ background: p.gradient }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        {/* Phone mockups hint at the product without shipping heavy imagery. */}
        <div className="absolute inset-0 flex items-end justify-center gap-2 pb-0">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[68%] w-[18%] translate-y-3 rounded-t-xl border border-white/15"
              style={{ background: p.gradient, opacity: 0.5 + i * 0.2 }}
            />
          ))}
        </div>
        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
          {p.count} wallpapers
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug">{p.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>
        <ul className="mt-4 space-y-1.5">
          {p.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-xs text-foreground/80">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: p.accent }} />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-border/60 pt-4">
          <div>
            <div className="font-display text-2xl font-bold text-gradient">{p.price}</div>
            {p.originalPrice && (
              <div className="text-xs text-muted-foreground line-through">{p.originalPrice}</div>
            )}
          </div>
          <button
            type="button"
            onClick={() =>
              window.open(
                buildMaypalCheckoutUrl({ productId: p.id, title: p.title, amount: p.amount }),
                "_blank",
                "noopener,noreferrer",
              )
            }
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110"
          >
            <Bitcoin className="h-4 w-4" /> Pay with Maypal
          </button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Secure Maypal crypto checkout — once payment confirms you land on your instant Google
          Drive delivery link.
        </p>
      </div>
    </article>
  );
}

function StorePage() {
  return (
    <div className="bg-black">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Digital store" }]} />

        {/* STORE HERO */}
        <header className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-black to-black p-8 lg:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/25 [mask-image:radial-gradient(circle,#000,transparent_70%)]" />
          <div className="relative max-w-3xl">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AnimeVerse digital store
            </div>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Premium phone wallpapers, delivered the second you buy
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Two curated collections — high-quality anime artwork and deep-black aesthetic
              backgrounds — cropped for real phone screens in 4K. One-time price, lifetime files,
              no subscription and no app to install. Every pack is just $1.99, paid securely with Maypal
              crypto checkout.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Zap, label: "Instant delivery", note: "Download link opens immediately" },
                { icon: ShieldCheck, label: "Lifetime access", note: "Re-download any time, free updates" },
                { icon: Bitcoin, label: "Crypto checkout", note: "Pay securely with Maypal — $1.99 a pack" },
              ].map((f) => (
                <div key={f.label} className="rounded-xl border border-border/60 bg-card/40 p-4">
                  <f.icon className="h-4 w-4 text-primary" />
                  <div className="mt-2 text-sm font-semibold">{f.label}</div>
                  <div className="text-xs text-muted-foreground">{f.note}</div>
                </div>
              ))}
            </div>
          </div>
        </header>

        <WalletPanel />

        {STORE_CATEGORIES.map((c, i) => (
          <section key={c.slug} id={c.slug} className="mt-16 scroll-mt-24">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {c.tagline}
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {c.name}
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">{c.description}</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {productsByCategory(c.slug).map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
            {i === 0 && <DisplayAd className="my-10" minHeight={280} />}
          </section>
        ))}

        {/* HOW IT WORKS */}
        <section className="my-16 rounded-3xl border border-border/60 bg-card/30 p-8 lg:p-12">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">How delivery works</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              ["01", "Pick your pack", "Choose an anime or dark aesthetic collection — every pack is a one-time $1.99 payment."],
              ["02", "Pay with Maypal", "Choose your coin in Maypal's secure crypto checkout — confirmation takes seconds, no account needed."],
              ["03", "Open your link", "Your Google Drive delivery link unlocks straight away — download the full pack in 4K."],
            ].map(([n, t, d]) => (
              <div key={n}>
                <div className="font-display text-3xl font-bold text-gradient">{n}</div>
                <div className="mt-1 font-semibold">{t}</div>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            {storeProducts.length} packs available · files are personal-use digital downloads.
          </p>
        </section>
      </div>
    </div>
  );
}
