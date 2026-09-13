import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getAnimeBySlug, charactersForAnime, animeByGenre } from "@/lib/content-registry";
import { isSectionKey, hasSection, sectionsFor, SECTION_META, type SectionKey } from "@/lib/anime-sections";
import { absoluteUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";

/**
 * Per-series section pages: /anime/:slug/:section
 *
 * Hand-written section pages (e.g. anime.dandadan_.characters.tsx) are
 * static routes and therefore still win the match — this only fills in the
 * series that never got bespoke pages. A section with no underlying data
 * 404s rather than rendering an empty shell.
 */
export const Route = createFileRoute("/anime/$slug_/$section")({
  loader: ({ params }) => {
    const { slug, section } = params;
    if (!isSectionKey(section)) throw notFound();

    const anime = getAnimeBySlug(slug);
    if (!anime) throw notFound();
    if (!hasSection(slug, section)) throw notFound();

    return {
      anime,
      section: section as SectionKey,
      characters: section === "characters" ? charactersForAnime(slug) : [],
      siblings: sectionsFor(slug).filter((s) => s !== section),
      related: anime.genres.flatMap((g) => animeByGenre(g)).filter((a) => a.slug !== slug).slice(0, 6),
    };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const { anime, section } = loaderData;
    const meta = SECTION_META[section];
    const title = meta.heading(anime.title);
    const description = meta.description(anime.title);
    const url = absoluteUrl(`/anime/${params.slug}/${params.section}`);

    const schemas: object[] = [
      breadcrumbSchema([
        { path: "/", name: "Home" },
        { path: "/browse", name: "Anime" },
        { path: `/anime/${anime.slug}`, name: anime.title },
        { name: meta.label },
      ]),
    ];
    // Only emit FAQPage where the questions are actually rendered below.
    if (section === "faq" && anime.faq?.length) schemas.push(faqSchema(anime.faq));

    return {
      meta: [
        { title: `${title} | GameCastle Anime` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: schemas.map((schema) => ({
        type: "application/ld+json",
        children: JSON.stringify(schema),
      })),
    };
  },
  component: AnimeSection,
});

function AnimeSection() {
  const { anime, section, characters, siblings, related } = Route.useLoaderData();
  const meta = SECTION_META[section];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> <span className="mx-1">/</span>
        <Link to="/browse" className="hover:text-foreground">Anime</Link> <span className="mx-1">/</span>
        <Link to="/anime/$slug" params={{ slug: anime.slug }} className="hover:text-foreground">{anime.title}</Link>{" "}
        <span className="mx-1">/</span> {meta.label}
      </nav>

      <h1 className="font-display text-4xl font-bold">{meta.heading(anime.title)}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{meta.description(anime.title)}</p>

      {section === "watch-order" && (
        <ol className="mt-8 space-y-3">
          {anime.watchOrder.map((entry, i) => (
            <li key={entry} className="flex gap-4 rounded-2xl border border-border/60 bg-card/40 p-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                {i + 1}
              </span>
              <span className="pt-1 font-medium">{entry}</span>
            </li>
          ))}
        </ol>
      )}

      {section === "characters" && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {characters.map((c) => (
            <Link
              key={c.slug}
              to="/character/$slug"
              params={{ slug: c.slug }}
              className="rounded-2xl border border-border/60 bg-card/40 p-4 card-hover hover:border-primary/50"
            >
              <div className="font-display text-lg font-bold">{c.name}</div>
              {c.role && <div className="mt-0.5 text-xs uppercase tracking-wide text-primary">{c.role}</div>}
              {c.bio && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{c.bio}</p>}
            </Link>
          ))}
        </div>
      )}

      {section === "story-arcs" && (
        <div className="mt-8 space-y-4">
          {anime.arcs.map((arc) => (
            <article key={arc.title} className="rounded-2xl border border-border/60 bg-card/40 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-xl font-bold">{arc.title}</h2>
                <span className="text-xs text-muted-foreground">{arc.episodes}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{arc.summary}</p>
            </article>
          ))}
        </div>
      )}

      {section === "soundtrack" && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Title</th>
                <th className="py-2">Artist</th>
              </tr>
            </thead>
            <tbody>
              {anime.soundtrack.map((track) => (
                <tr key={`${track.type}-${track.title}`} className="border-b border-border/40">
                  <td className="py-2.5 pr-4 font-mono text-xs text-primary">{track.type}</td>
                  <td className="py-2.5 pr-4 font-medium">{track.title}</td>
                  <td className="py-2.5 text-muted-foreground">{track.artist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section === "faq" && (
        <div className="mt-8 space-y-4">
          {anime.faq.map((item) => (
            <details key={item.q} className="rounded-2xl border border-border/60 bg-card/40 p-5">
              <summary className="cursor-pointer font-semibold">{item.q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      )}

      {siblings.length > 0 && (
        <section className="mt-12 border-t border-border/60 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            More on {anime.title}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/anime/$slug"
              params={{ slug: anime.slug }}
              className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary"
            >
              Full guide
            </Link>
            {siblings.map((s) => (
              <Link
                key={s}
                to="/anime/$slug_/$section"
                params={{ slug: anime.slug, section: s }}
                className="rounded-full border border-border/60 px-4 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-foreground"
              >
                {SECTION_META[s].label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Similar series
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <Link
                key={a.slug}
                to="/anime/$slug"
                params={{ slug: a.slug }}
                className="rounded-xl border border-border/60 bg-card/40 p-3 text-sm font-medium card-hover"
              >
                {a.title}
                <span className="mt-0.5 block text-xs text-muted-foreground">{a.year} · ⭐ {a.rating.toFixed(1)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
