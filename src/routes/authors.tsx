import { createFileRoute, Link } from "@tanstack/react-router";
import { authors } from "@/data/articles";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/authors")({
  head: () => ({
    meta: [
      { property: "og:url", content: "https://gamecastle.store/authors" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "The GameCastle Anime Editorial Team · GameCastle Anime" },
      { name: "description", content: "Meet the writers and editors behind GameCastle Anime. Fifteen combined years covering the anime industry." },
      { property: "og:title", content: "GameCastle Anime Editorial Team" },
      { property: "og:description", content: "Meet the GameCastle Anime writers." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/authors" }],
  }),
  component: () => (
    <div className="mx-auto max-w-5xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Authors" }]} />
      <h1 className="font-display text-5xl font-bold">The editorial team</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">Writers, editors, and reporters who take anime seriously enough to argue about it in public.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {authors.map(a => (
          <div key={a.slug} className="rounded-2xl border border-border/60 bg-card/40 p-6 flex gap-4">
            <div className="h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent" />
            <div>
              <div className="font-display text-xl font-bold">{a.name}</div>
              <div className="text-xs text-primary uppercase tracking-[0.2em]">{a.role}</div>
              <p className="mt-2 text-sm text-muted-foreground">{a.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
});
