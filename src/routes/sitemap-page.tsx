import { createFileRoute, Link } from "@tanstack/react-router";
import { publishedAnime, publishedArticles, publishedCharacters, populatedGenres, populatedStudios } from "@/lib/content-registry";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/sitemap-page")({
  head: () => ({ meta: [
      { property: "og:url", content: "https://gamecastle.store/sitemap-page" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    { title: "HTML Sitemap · GameCastle Anime" },
    { name: "description", content: "Every page on GameCastle Anime, organized by section." },
    { property: "og:title", content: "Sitemap · GameCastle Anime" },
    { property: "og:description", content: "All pages on GameCastle Anime." },
  ], links: [{ rel: "canonical", href: "https://gamecastle.store/sitemap-page" }] }),
  component: () => (
    <div className="mx-auto max-w-5xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Sitemap" }]} />
      <h1 className="font-display text-4xl font-bold">HTML Sitemap</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Section title="Anime">{publishedAnime().map(a => <li key={a.slug}><Link to="/anime/$slug" params={{ slug: a.slug }} className="text-sm text-foreground/85 hover:text-primary">{a.title}</Link></li>)}</Section>
        <Section title="Genres">{populatedGenres().map(g => <li key={g.slug}><Link to="/genre/$slug" params={{ slug: g.slug }} className="text-sm text-foreground/85 hover:text-primary">{g.name}</Link></li>)}</Section>
        <Section title="Studios">{populatedStudios().map(s => <li key={s.slug}><Link to="/studio/$slug" params={{ slug: s.slug }} className="text-sm text-foreground/85 hover:text-primary">{s.name}</Link></li>)}</Section>
        <Section title="Characters">{publishedCharacters().map(c => <li key={c.slug}><Link to="/character/$slug" params={{ slug: c.slug }} className="text-sm text-foreground/85 hover:text-primary">{c.name}</Link></li>)}</Section>
        <Section title="Articles">{publishedArticles().map(a => <li key={a.slug}><Link to="/article/$slug" params={{ slug: a.slug }} className="text-sm text-foreground/85 hover:text-primary">{a.title}</Link></li>)}</Section>
        <Section title="Pages">
          {["/","/browse","/trending","/top-rated","/upcoming","/new-releases","/completed","/classic","/news","/reviews","/guides","/top-lists","/editorial","/authors","/manga-spoilers","/power-scaling","/watch-order","/timeline","/recommendations","/quotes","/facts","/soundtracks","/openings","/wallpapers","/streaming","/statistics","/about","/contact","/faq","/privacy-policy","/terms-of-service","/cookies","/dmca","/editorial-policy"].map(p => (
            <li key={p}><Link to={p} className="text-sm text-foreground/85 hover:text-primary">{p}</Link></li>
          ))}
        </Section>
      </div>
    </div>
  ),
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">{title}</div>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}
