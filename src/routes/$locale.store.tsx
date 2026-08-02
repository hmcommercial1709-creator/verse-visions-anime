import { createFileRoute, notFound } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";
import { DisplayAd } from "@/components/ad-slot";
import { productsByCategory, STORE_CATEGORIES, type StoreProduct } from "@/data/store-products";
import {
  getStoreLocale,
  isStoreLocale,
  SITE,
  storeHreflangLinks,
  storeJsonLd,
  storePath,
  storeSocialMeta,
  type StoreLocaleSeo,
} from "@/lib/store-seo";
import { Bitcoin, Check, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";

export const Route = createFileRoute("/$locale/store")({
  beforeLoad: ({ params }) => {
    if (!isStoreLocale(params.locale) || params.locale === "en") throw notFound();
  },
  loader: ({ params }) => ({ code: params.locale }),
  head: ({ params }) => {
    const locale = getStoreLocale(params.locale);
    return {
      meta: storeSocialMeta(locale),
      links: [
        { rel: "canonical", href: `${SITE}${storePath(locale.code)}` },
        ...storeHreflangLinks(),
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(storeJsonLd(locale)) },
      ],
    };
  },
  component: LocalizedStorePage,
});

function ProductCard({ p, locale }: { p: StoreProduct; locale: StoreLocaleSeo }) {
  return (
    <article
      id={p.id}
      className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-black/60"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-black">
        <img
          src={p.image}
          alt={`${p.title} preview`}
          loading="lazy"
          width={1200}
          height={752}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
          {p.countLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug">{p.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-border/60 pt-4">
          <div>
            <div className="font-display text-2xl font-bold text-gradient">{p.price}</div>
            <div className="text-[11px] text-muted-foreground">{locale.priceNote}</div>
          </div>
          <a
            href={`/store/checkout?p=${p.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110"
          >
            <Lock className="h-4 w-4" /> {locale.cta}
          </a>
        </div>
      </div>
    </article>
  );
}

function LocalizedStorePage() {
  const { code } = Route.useLoaderData();
  const locale = getStoreLocale(code);

  return (
    <div className="bg-black" lang={locale.hrefLang}>
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Store" }]} />

        <header className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-black to-black p-8 lg:p-12">
          <div className="relative max-w-3xl">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AnimeVerse · {locale.language}
            </div>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {locale.heading}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{locale.intro}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[Zap, ShieldCheck, Bitcoin].map((Icon, i) => (
                <div key={i} className="rounded-xl border border-border/60 bg-card/40 p-4">
                  <Icon className="h-4 w-4 text-primary" />
                  <div className="mt-2 text-sm font-semibold">$1.99</div>
                  <div className="text-xs text-muted-foreground">{locale.priceNote}</div>
                </div>
              ))}
            </div>
            <a
              href="/store"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              English edition <Check className="h-4 w-4" />
            </a>
          </div>
        </header>

        {STORE_CATEGORIES.map((c, i) => (
          <section key={c.slug} id={c.slug} className="mt-16 scroll-mt-24">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {locale.sections[i === 0 ? 0 : 1]}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {productsByCategory(c.slug).map((p) => (
                <ProductCard key={p.id} p={p} locale={locale} />
              ))}
            </div>
            {i === 0 && <DisplayAd className="my-10" minHeight={280} />}
          </section>
        ))}
      </div>
    </div>
  );
}
