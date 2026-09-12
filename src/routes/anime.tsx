import { createFileRoute, Link } from "@tanstack/react-router";
import { publishedAnime } from "@/lib/content-registry";

const PAGE_SIZE = 36;
/** Defensive ceiling so a single archive page never has to render an unbounded list. */
const MAX_ANIME = 1000;

const allAnime = publishedAnime().slice(0, MAX_ANIME);

export const Route = createFileRoute("/anime")({
  validateSearch: (search: Record<string, unknown>) => ({
    page: Math.max(1, Number(search?.page) || 1),
  }),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => {
    const page = deps.page;
    const from = (page - 1) * PAGE_SIZE;
    return {
      items: allAnime.slice(from, from + PAGE_SIZE),
      total: allAnime.length,
      page,
      pageSize: PAGE_SIZE,
    };
  },
  head: () => ({
    meta: [
      { title: "Anime Archive | GameCastle Anime" },
      {
        name: "description",
        content: `Browse the full GameCastle Anime archive — ${allAnime.length} series with watch orders, characters and reviews.`,
      },
      { property: "og:title", content: "Anime Archive | GameCastle Anime" },
      { property: "og:url", content: "https://gamecastle.store/anime" },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/anime" }],
  }),
  component: AnimeArchive,
});

function AnimeArchive() {
  const { items, total, page, pageSize } = Route.useLoaderData();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-pink-400">🌸 Anime Archive</h1>
          <p className="text-sm text-slate-400 mt-1">{total.toLocaleString()} series indexed</p>
        </div>
        <a href="/" className="text-xs bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg hover:border-pink-500 transition">← Back to Home</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {items.map((a) => (
          <Link
            key={a.slug}
            to="/anime/$slug"
            params={{ slug: a.slug }}
            className="p-4 bg-slate-900/80 border border-slate-800 rounded-lg hover:border-pink-500 transition-all"
          >
            <div className="text-sm font-medium line-clamp-2">{a.title}</div>
            <div className="mt-1 text-xs text-slate-500">
              {a.status} · ⭐ {a.rating.toFixed(1)}
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-900">
        {page > 1 ? (
          <a href={`/anime?page=${page - 1}`} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-pink-500 text-sm">
            ← Previous
          </a>
        ) : <div />}
        <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
        {page < totalPages ? (
          <a href={`/anime?page=${page + 1}`} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-pink-500 text-sm">
            Next →
          </a>
        ) : <div />}
      </div>
    </div>
  );
}
