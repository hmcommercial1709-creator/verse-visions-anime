import { Link } from "@tanstack/react-router";
import { entityPath, type CatalogEntity } from "@/lib/entity-catalog";

export function CatalogEntityPage({ entity }: { entity: CatalogEntity }) {
  return <article className="mx-auto max-w-4xl px-4 py-12">
    <Link to="/browse" className="text-primary">Browse anime</Link>
    <h1 className="mt-6 font-display text-4xl font-bold">{entity.name}</h1>
    {entity.description?.split(/\n\s*\n/).map((paragraph, index) =>
      <p key={index} className="mt-5 whitespace-pre-line leading-8 text-muted-foreground">{paragraph}</p>)}
    {entity.source_name && <p className="mt-6 text-sm text-muted-foreground">Synopsis source: {entity.source_url && /^https:\/\//.test(entity.source_url) ? <a href={entity.source_url} rel="noopener noreferrer" className="underline">{entity.source_name}</a> : entity.source_name}</p>}
    <nav className="mt-10 flex flex-wrap gap-6" aria-label="Related sections">
      <Link to="/guides">Anime guides</Link><Link to="/store">Browse the store</Link>
      <Link to="/rewards/anime-wallpapers">Free anime wallpapers</Link>
    </nav>
  </article>;
}
export function CatalogIndex({ title, entities }: { title: string; entities: CatalogEntity[] }) {
  return <section className="mx-auto max-w-6xl px-4 py-12">
    <h1 className="font-display text-4xl font-bold">{title}</h1>
    {entities.length === 0 ? <p className="mt-6">No published entries are available yet. <Link to="/browse">Browse anime</Link>.</p> :
      <div className="mt-8 grid gap-6 md:grid-cols-3">{entities.map((entity) =>
        <a key={entity.slug} href={entityPath(entity.entity_type, entity.slug)} className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">{entity.name}</h2><p className="mt-3 line-clamp-4 text-muted-foreground">{entity.description}</p>
        </a>)}</div>}
  </section>;
}
