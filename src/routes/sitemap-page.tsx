import { createFileRoute, Link } from "@tanstack/react-router";
import { animes } from "@/data/animes";
import { genres } from "@/data/genres";
import { studios } from "@/data/studios";
import { characters } from "@/data/characters";
import { articles } from "@/data/articles";
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
        <Section title="Anime">{animes.map(a => <Item key={a.slug} to="/anime/$slug" params={{ slug: a.slug }}>{a.title}</Item>)}</Section>
        <Section title="Genres">{genres.map(g => <Item key={g.slug} to="/genre/$slug" params={{ slug: g.slug }}>{g.name}</Item>)}</Section>
        <Section title="Studios">{studios.map(s => <Item key={s.slug} to="/studio/$slug" params={{ slug: s.slug }}>{s.name}</Item>)}</Section>
        <Section title="Characters">{characters.map(c => <Item key={c.slug} to="/character/$slug" params={{ slug: c.slug }}>{c.name}</Item>)}</Section>
        <Section title="Articles">{articles.map(a => <Item key={a.slug} to="/article/$slug" params={{ slug: a.slug }}>{a.title}</Item>)}</Section>
        <Section title="Pages">
          {["/","/browse","/trending","/top","/upcoming","/new-releases","/completed","/classic","/news","/reviews","/guides","/top-lists","/editorial","/authors","/manga-spoilers","/power-scaling","/watch-order","/timeline","/recommendations","/quotes","/facts","/soundtracks","/openings","/wallpapers","/merch","/events","/streaming","/awards","/statistics","/about","/contact","/faq","/privacy-policy","/terms-of-service","/cookies","/dmca","/editorial-policy"].map(p => (
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
function Item({ to, params, children }: any) {
  return <li><Link to={to} params={params} className="text-sm text-foreground/85 hover:text-primary">{children}</Link></li>;
}
