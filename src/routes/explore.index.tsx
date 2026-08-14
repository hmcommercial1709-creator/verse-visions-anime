import { createFileRoute, Link } from "@tanstack/react-router";
import { EXPLORE_PAGES } from "@/data/explore-pages";
import { absoluteUrl } from "@/lib/seo";

const TITLE = "Explore Anime Guides, Rankings, Releases & Wallpapers";
const DESCRIPTION =
  "Explore anime wallpapers, watch orders, character rankings, release trackers, legal streaming services and gaming safety guides.";

export const Route = createFileRoute("/explore/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/explore") },
      { rel: "alternate", hreflang: "en", href: absoluteUrl("/explore") },
      { rel: "alternate", hreflang: "ar", href: absoluteUrl("/ar/explore") },
      { rel: "alternate", hreflang: "x-default", href: absoluteUrl("/explore") },
    ],
  }),
  component: ExploreHub,
});

function ExploreHub() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <h1 className="font-display text-5xl font-black">Explore anime</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        Wallpapers, watch orders, character rankings, verified release trackers, legal streaming and gaming guides.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {EXPLORE_PAGES.map((page) => (
          <Link
            key={page.slug}
            to="/explore/$slug"
            params={{ slug: page.slug }}
            className="rounded-2xl border border-border bg-card/40 p-6 hover:border-primary"
          >
            <span className="text-xs uppercase tracking-wider text-primary">{page.category}</span>
            <h2 className="mt-2 font-display text-xl font-bold">{page.en.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{page.en.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
