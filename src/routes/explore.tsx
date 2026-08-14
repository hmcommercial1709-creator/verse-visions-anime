import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { EXPLORE_PAGES } from "@/data/explore-pages";
export const Route = createFileRoute("/explore")({ head: () => ({ meta: [{ title: "Explore Anime Guides, Rankings, Releases & Wallpapers" }, { name: "description", content: "Explore bilingual anime wallpapers, watch orders, rankings, release trackers, streaming and gaming safety guides." }] }), component: ExploreHub });
function ExploreHub() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname.replace(/\/$/, "") !== "/explore") return <Outlet />;
  return <main className="mx-auto max-w-7xl px-4 py-12 lg:px-6"><h1 className="font-display text-5xl font-black">Explore anime</h1><p className="mt-4 max-w-3xl text-lg text-muted-foreground">Wallpapers, watch orders, character rankings, verified release trackers, legal streaming and gaming guides.</p><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{EXPLORE_PAGES.map((p) => <Link key={p.slug} to="/explore/$slug" params={{ slug: p.slug }} className="rounded-2xl border border-border bg-card/40 p-6 hover:border-primary"><span className="text-xs uppercase tracking-wider text-primary">{p.category}</span><h2 className="mt-2 font-display text-xl font-bold">{p.en.title}</h2><p className="mt-2 text-sm text-muted-foreground">{p.en.description}</p></Link>)}</div></main>;
}
