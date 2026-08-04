import { createFileRoute, Link } from "@tanstack/react-router";
import { collectionSchema } from "@/lib/seo";
import { studios } from "@/data/studios";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/studios")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/studios" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Anime Studios — The Studios Behind the Medium · GameCastle Anime" },
      { name: "description", content: "MAPPA, ufotable, Madhouse, Bones, Toei, Pierrot — the studios shaping modern anime." },
      { property: "og:title", content: "Anime Studios · GameCastle Anime" },
      { property: "og:description", content: "Every major studio, profiled." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/studios" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(collectionSchema({ path: "/studios", name: 'Anime Studio Profiles', description: "Histories, notable works and staff behind the world's leading anime studios." })),
      },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Studios" }]} />
      <h1 className="font-display text-5xl font-bold">Anime studios</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">The names on the credit reel. The teams doing the actual work.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {studios.map(s => (
          <Link key={s.slug} to="/studio/$slug" params={{ slug: s.slug }} className="rounded-2xl border border-border/60 p-6 hover:border-primary/60 card-hover hover:!card-hover-active"
            style={{ background: `linear-gradient(135deg, ${s.accent}18, transparent 70%)` }}>
            <div className="flex items-center justify-between">
              <div className="font-display text-2xl font-bold">{s.name}</div>
              <div className="text-xs text-muted-foreground">est. {s.founded}</div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{s.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  ),
});
