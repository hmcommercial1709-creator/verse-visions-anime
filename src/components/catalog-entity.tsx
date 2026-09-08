import { Link } from "@tanstack/react-router";
import { entityPath, type CatalogEntity } from "@/lib/entity-catalog";

export function CatalogEntityPage({ entity }: { entity: CatalogEntity }) {
  return <article className="mx-auto max-w-4xl px-4 py-12">
    <Link to="/browse" className="text-primary">Browse anime</Link>
    <h1 className="mt-6 font-display text-4xl font-bold">{entity.name}</h1>
    {entity.description?.split(/\n\s*\n/).map((paragraph, index) =>
      <p key={index} className="mt-5 whitespace-pre-line leading-8 text-muted-foreground">{paragraph}</p>)}
    <section className="mt-10" aria-labelledby="catalog-faq-heading">
      <h2 id="catalog-faq-heading" className="font-display text-2xl font-bold">Frequently asked questions</h2>
      <div className="mt-5 space-y-5">
        {entity.localized_faqs.map((faq) => <div key={faq.question}>
          <h3 className="font-semibold">{faq.question}</h3>
          <p className="mt-2 leading-7 text-muted-foreground">{faq.answer}</p>
        </div>)}
      </div>
    </section>
    {entity.source_name && <p className="mt-6 text-sm text-muted-foreground">Synopsis source: {entity.source_url && /^https:\/\//.test(entity.source_url) ? <a href={entity.source_url} rel="noopener noreferrer" className="underline">{entity.source_name}</a> : entity.source_name}</p>}
    <nav className="mt-10 flex flex-wrap gap-6" aria-label="Related sections">
      <Link to="/guides">Anime guides</Link><Link to="/store">Browse the store</Link>
      <Link to="/rewards/anime-wallpapers">Free anime wallpapers</Link>
    </nav>
  </article>;
}
export function CatalogIndex({
  title,
  entities,
  total,
  page,
  pageSize,
  basePath,
}: {
  title: string;
  entities: CatalogEntity[];
  total: number;
  page: number;
  pageSize: number;
  basePath: string;
}) {
  const totalPages = Math.ceil(total / pageSize);
  return <section className="mx-auto max-w-6xl px-4 py-12">
    <h1 className="font-display text-4xl font-bold">{title}</h1>
    <p className="mt-2 text-sm text-muted-foreground">{total.toLocaleString()} published entries · Page {page} of {totalPages || 1}</p>
    {entities.length === 0 ? <p className="mt-6">No published entries are available yet. <Link to="/browse">Browse anime</Link>.</p> :
      <div className="mt-8 grid gap-6 md:grid-cols-3">{entities.map((entity) =>
        <a key={entity.slug} href={entityPath(entity.entity_type, entity.slug)} className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">{entity.name}</h2><p className="mt-3 line-clamp-4 text-muted-foreground">{entity.description}</p>
        </a>)}</div>}
    <nav className="mt-8 flex items-center justify-between border-t border-border/60 pt-4" aria-label={`${title} pagination`}>
      {page > 1 ? <a href={`${basePath}?page=${page - 1}`} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:border-primary">Previous page</a> : <span />}
      <span className="text-sm text-muted-foreground">Page {page} of {totalPages || 1}</span>
      {page < totalPages ? <a href={`${basePath}?page=${page + 1}`} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:border-primary">Next page</a> : <span />}
    </nav>
  </section>;
}
