import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getGenre, genres } from "@/data/genres";
import { animes } from "@/data/animes";
import { AnimeCard } from "@/components/anime-card";
import { Breadcrumbs } from "@/components/ui-bits";
import { AdSlot } from "@/components/ad-slot";

export const Route = createFileRoute("/genre/$slug")({
  loader: ({ params }) => {
    const genre = getGenre(params.slug);
    if (!genre) throw notFound();
    return { genre };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [
      { property: "og:url", content: `https://gamecastle.store/genre/${g.slug}` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    const g = loaderData.genre;
    const title = `Best ${g.name} Anime — Rankings, Reviews & Guides · AnimeVerse`;
    const desc = `The complete AnimeVerse guide to ${g.name} anime: the defining shows, why the genre works, and where to start.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
      links: [{ rel: "canonical", href: `https://gamecastle.store/genre/${g.slug}` }],
    };
  },
  component: GenrePage,
});

function GenrePage() {
  const { genre } = Route.useLoaderData();
  const shows = animes.filter(a => a.genres.includes(genre.slug));
  const related = genres.filter(g => g.slug !== genre.slug).slice(0, 8);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(1000px 500px at 20% 10%, ${genre.hue}55, transparent 60%), radial-gradient(800px 400px at 90% 0%, ${genre.hue}22, transparent 60%)` }} />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6 py-16">
          <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/browse", label: "Browse" }, { label: genre.name }]} />
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.22em] font-semibold" style={{ color: genre.hue }}>Genre</div>
            <h1 className="mt-2 font-display text-5xl lg:text-6xl font-bold">{genre.name} Anime</h1>
            <p className="mt-3 text-xl text-gradient font-semibold">{genre.tagline}</p>
            <p className="mt-5 text-lg text-foreground/85 leading-relaxed">{genre.description}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="my-8 flex flex-wrap gap-2">
          {genre.hallmarks.map((h: string) => (
            <span key={h} className="rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm">{h}</span>
          ))}
        </div>

        <h2 className="font-display text-3xl font-bold mb-6">Where to start</h2>
        {shows.length === 0 ? (
          <p className="text-muted-foreground">More {genre.name} entries coming soon.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {shows.map(a => <AnimeCard key={a.slug} anime={a} size="md" />)}
          </div>
        )}

        <AdSlot placement="between" />

        <div className="my-16 rounded-3xl border border-border/60 bg-card/40 p-8 lg:p-12">
          <h3 className="font-display text-2xl font-bold mb-3">What defines great {genre.name.toLowerCase()} anime?</h3>
          <p className="text-foreground/85 leading-relaxed max-w-3xl">
            The {genre.name.toLowerCase()} category isn't a checklist; it's a promise. Every show in this list keeps a version of that promise — sometimes by leaning into convention, sometimes by breaking it hard. If you're new to the genre, start with a gateway entry and let it tell you what kind of {genre.name.toLowerCase()} viewer you actually are.
          </p>
        </div>

        <h3 className="font-display text-2xl font-bold mb-4">Other genres</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16">
          {related.map(g => (
            <Link key={g.slug} to="/genre/$slug" params={{ slug: g.slug }} className="rounded-xl border border-border/60 p-4 hover:border-primary/60 bg-card/40">
              <div className="font-semibold">{g.name}</div>
              <div className="text-xs text-muted-foreground line-clamp-1">{g.tagline}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
