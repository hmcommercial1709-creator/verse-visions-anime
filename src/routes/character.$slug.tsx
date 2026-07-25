import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getCharacter, characters } from "@/data/characters";
import { getAnime } from "@/data/animes";
import { Breadcrumbs } from "@/components/ui-bits";
import { AdSlot } from "@/components/ad-slot";

export const Route = createFileRoute("/character/$slug")({
  loader: ({ params }) => {
    const character = getCharacter(params.slug);
    if (!character) throw notFound();
    return { character };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    const c = loaderData.character;
    return {
      meta: [
        { title: `${c.name} — Character Guide · AnimeVerse` },
        { name: "description", content: `${c.name} from ${c.anime}: full biography, personality, arcs, quotes, and power analysis.` },
        { property: "og:title", content: `${c.name} · Character Guide` },
        { property: "og:description", content: c.bio },
      ],
      links: [{ rel: "canonical", href: `/character/${c.slug}` }],
    };
  },
  component: CharacterPage,
});

function CharacterPage() {
  const { character: c } = Route.useLoaderData();
  const anime = getAnime(c.anime);
  const related = characters.filter(x => x.anime === c.anime && x.slug !== c.slug);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(700px 500px at 20% 10%, ${c.accent}77, transparent 60%)` }} />
        <div className="relative mx-auto max-w-5xl px-4 lg:px-6 py-14">
          <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/characters", label: "Characters" }, { label: c.name }]} />
          <div className="grid gap-8 md:grid-cols-[220px_1fr] items-start">
            <div className="aspect-[3/4] rounded-2xl border-2" style={{ borderColor: c.accent, background: `linear-gradient(135deg, ${c.accent}, #111)` }} />
            <div>
              {anime && <Link to="/anime/$slug" params={{ slug: anime.slug }} className="text-xs uppercase tracking-[0.22em] text-primary">{anime.title}</Link>}
              <h1 className="mt-1 font-display text-5xl font-bold">{c.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground">{c.role}</p>
              <p className="mt-4 leading-relaxed">{c.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.personality.map(p => <span key={p} className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs text-accent">{p}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 lg:px-6">
        <Block title="Powers & abilities"><p className="leading-relaxed">{c.power}</p></Block>
        <Block title="Arcs featured">
          <ul className="grid gap-2 sm:grid-cols-2">
            {c.arcs.map(a => (<li key={a} className="rounded-lg border border-border/60 bg-card/50 p-3">{a}</li>))}
          </ul>
        </Block>
        {c.quotes.length > 0 && (
          <Block title="Iconic quotes">
            <div className="space-y-3">
              {c.quotes.map((q,i)=>(<blockquote key={i} className="border-l-2 pl-4 py-1 italic text-lg" style={{ borderColor: c.accent }}>"{q}"</blockquote>))}
            </div>
          </Block>
        )}
        <AdSlot placement="between" />
        {related.length > 0 && (
          <Block title="Related characters">
            <div className="grid gap-2 sm:grid-cols-2">
              {related.map(r => (
                <Link key={r.slug} to="/character/$slug" params={{ slug: r.slug }} className="rounded-lg border border-border/60 bg-card/50 p-3 hover:border-primary/60">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </Link>
              ))}
            </div>
          </Block>
        )}
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="my-10">
      <h2 className="font-display text-2xl font-bold mb-3">{title}</h2>
      {children}
    </section>
  );
}
