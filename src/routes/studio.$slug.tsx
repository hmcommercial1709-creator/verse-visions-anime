import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getStudio, studios } from "@/data/studios";
import { animes } from "@/data/animes";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/studio/$slug")({
  loader: ({ params }) => {
    const studio = getStudio(params.slug);
    if (!studio) throw notFound();
    return { studio };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    const s = loaderData.studio;
    return {
      meta: [
        { property: "og:url", content: `https://gamecastle.store/studio/${s.slug}` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title: `${s.name} — Anime Studio Profile · GameCastle Anime` },
        { name: "description", content: `${s.name}: history, notable works, and everything you need to know about the studio.` },
        { property: "og:title", content: `${s.name} — Anime Studio · GameCastle Anime` },
        { property: "og:description", content: s.blurb },
      ],
      links: [{ rel: "canonical", href: `https://gamecastle.store/studio/${s.slug}` }],
    };
  },
  component: StudioPage,
});

function StudioPage() {
  const { studio } = Route.useLoaderData();
  const works = animes.filter(a => a.studio === studio.slug);
  const others = studios.filter(s => s.slug !== studio.slug).slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(900px 500px at 10% 0%, ${studio.accent}55, transparent 60%)` }} />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6 py-16">
          <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Studios" }, { label: studio.name }]} />
          <div className="text-xs uppercase tracking-[0.22em] font-semibold" style={{ color: studio.accent }}>Studio · {studio.country} · est. {studio.founded}</div>
          <h1 className="mt-2 font-display text-5xl lg:text-6xl font-bold">{studio.name}</h1>
          <p className="mt-4 max-w-3xl text-lg text-foreground/85 leading-relaxed">{studio.blurb}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <h2 className="font-display text-3xl font-bold mb-6">Selected works</h2>
        {works.length === 0 ? (
          <p className="text-muted-foreground">Titles coming soon.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {works.map(a => <AnimeCard key={a.slug} anime={a} />)}
          </div>
        )}
        <h3 className="font-display text-2xl font-bold mb-4">Other studios</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-16">
          {others.map(s => (
            <Link key={s.slug} to="/studio/$slug" params={{ slug: s.slug }} className="rounded-xl border border-border/60 p-4 hover:border-primary/60 bg-card/40">
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-muted-foreground">est. {s.founded}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
