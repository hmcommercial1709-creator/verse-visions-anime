import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";
import { AffiliateBox, AdSlot } from "@/components/ad-slot";

export const Route = createFileRoute("/merch")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/merch" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Anime Merchandise — Figures, Manga & Collectibles · GameCastle Anime" },
      { name: "description", content: "The best places to buy authentic anime merchandise: figures, manga, Blu-rays, apparel, and collectibles." },
      { property: "og:title", content: "Anime Merchandise · GameCastle Anime" },
      { property: "og:description", content: "Figures, manga, Blu-ray and more." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/merch" }],
  }),
  component: () => (
    <div className="mx-auto max-w-6xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Merch" }]} />
      <h1 className="font-display text-5xl font-bold">Anime merchandise</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">Handpicked figures, Blu-ray box sets, manga volumes, and apparel — sourced from stores we trust.</p>
      <AdSlot placement="between" label="Affiliate Feature" />
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AffiliateBox title="Attack on Titan — Complete Blu-ray" subtitle="All 4 seasons + specials" price="$249" />
        <AffiliateBox title="Demon Slayer Figure — Tanjiro" subtitle="ufotable licensed · 1/8 scale" price="$189" />
        <AffiliateBox title="One Piece Vol. 1–100 Box" subtitle="Official English manga" price="$799" />
        <AffiliateBox title="Chainsaw Man Vol. 1" subtitle="English paperback" price="$9.99" />
        <AffiliateBox title="Jujutsu Kaisen Poster Set" subtitle="6 posters · A3 · officially licensed" price="$39" />
        <AffiliateBox title="Frieren Art Book" subtitle="Hardcover · English translation" price="$45" />
      </div>
    </div>
  ),
});
