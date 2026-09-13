import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  positioningStatements,
  groupedTags,
  orderedFranchise,
  sortedCharacters,
  generatedFaq,
  relationLabel,
  type CatalogMeta,
  type CatalogKind,
} from "@/lib/catalog/catalog-facts";

/**
 * The generated sections, shared by the anime and game detail routes.
 *
 * These mirror the structure of the 23 hand-built guides — a placement, a
 * chronology, a cast, a theme profile, an FAQ, a set of onward links — so an
 * imported title gets the same shape without the same prose. What fills them
 * is computed at ingest time across the whole catalog, which is what makes
 * each page different from every other and different from its source.
 */
function SectionBlock({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="my-10 scroll-mt-24">
      <h2 className="mb-4 font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      {children}
    </section>
  );
}

/**
 * The sections an imported title earns from its own data.
 *
 * Each one renders only when its inputs exist. A title with no cast has no
 * cast section rather than an empty heading, because an empty section is a
 * thin-content signal and a heading with nothing under it is worse than no
 * heading at all.
 */
export function CatalogSections({
  meta,
  name,
  kind = "anime",
}: {
  meta: CatalogMeta | null;
  name: string;
  kind?: CatalogKind;
}) {
  const detailRoute = kind === "game" ? "/catalog/games/$slug" : "/catalog/anime/$slug";
  const statements = positioningStatements(meta, name, kind);
  const tagGroups = groupedTags(meta);
  const chain = orderedFranchise(meta?.derived);
  const cast = sortedCharacters(meta);
  const faq = generatedFaq(meta, name, kind);
  const similar = meta?.derived?.similar ?? [];

  return (
    <>
      {statements.length > 0 && (
        <SectionBlock id="placement" title="Where it sits in this catalog">
          {/* Computed across the whole catalog at ingest time, so the numbers
              are specific to this collection and exist on no other site. */}
          <ul className="space-y-2 text-muted-foreground">
            {statements.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </SectionBlock>
      )}

      {chain.length > 0 && (
        <SectionBlock
          id="chronology"
          title={kind === "game" ? "Related releases" : "Franchise chronology"}
        >
          <p className="mb-4 text-sm text-muted-foreground">
            {kind === "game"
              ? "Every related release this catalog holds."
              : "Every related entry this catalog holds, in watch order."}
          </p>
          <ol className="space-y-2">
            {chain.map((entry) => (
              <li key={entry.slug}>
                <Link
                  to={detailRoute}
                  params={{ slug: entry.slug }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/40 px-4 py-3 hover:border-primary/60"
                >
                  <span className="font-semibold">{entry.title}</span>
                  <span className="shrink-0 rounded-full border border-border/60 px-2.5 py-0.5 text-xs text-muted-foreground">
                    {relationLabel(entry.relation)}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </SectionBlock>
      )}

      {cast.length > 0 && (
        <SectionBlock id="characters" title="Characters">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cast.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3"
              >
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                )}
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{c.name}</div>
                  {c.native && (
                    <div className="truncate text-xs text-muted-foreground">{c.native}</div>
                  )}
                  {c.role && (
                    <div className="text-xs uppercase tracking-wider text-primary">
                      {c.role.toLowerCase()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>
      )}

      {tagGroups.length > 0 && (
        <SectionBlock
          id="themes"
          title={kind === "game" ? "Features and content profile" : "Themes and content profile"}
        >
          <p className="mb-4 text-sm text-muted-foreground">
            {kind === "game"
              ? "Store features and categories as Steam lists them."
              : "Percentages are AniList community tag rankings — how strongly voters associate each theme with this title."}
          </p>
          <div className="space-y-5">
            {tagGroups.map((group) => (
              <div key={group.category}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.category}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {group.tags.map((tag) => (
                    <span
                      key={tag.name}
                      className="rounded-full border border-border/60 px-3 py-1 text-xs"
                    >
                      {tag.name}
                      {tag.rank !== null && (
                        <span className="ml-1.5 text-muted-foreground">{tag.rank}%</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>
      )}

      {faq.length > 0 && (
        <SectionBlock id="faq" title="Frequently asked questions">
          {/* Answers are read out of stored values, never generated prose, so
              the FAQ schema below never publishes a guess. */}
          <div className="space-y-4">
            {faq.map((item) => (
              <div
                key={item.question}
                className="rounded-xl border border-border/60 bg-card/40 p-4"
              >
                <h3 className="font-semibold">{item.question}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </SectionBlock>
      )}

      {similar.length > 0 && (
        <SectionBlock
          id="similar"
          title={
            kind === "game" ? "Closest games by shared features" : "Closest titles by shared themes"
          }
        >
          <p className="mb-4 text-sm text-muted-foreground">
            Ranked by how many {kind === "game" ? "features" : "tags"} and genres they share with{" "}
            {name} in this catalog.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((s) => (
              <Link
                key={s.slug}
                to={detailRoute}
                params={{ slug: s.slug }}
                className="rounded-xl border border-border/60 bg-card/40 p-3 hover:border-primary/60"
              >
                <div className="line-clamp-2 text-sm font-semibold">{s.name ?? s.slug}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {s.shared} shared{" "}
                  {s.shared === 1
                    ? kind === "game"
                      ? "feature"
                      : "theme"
                    : kind === "game"
                      ? "features"
                      : "themes"}
                </div>
              </Link>
            ))}
          </div>
        </SectionBlock>
      )}
    </>
  );
}
