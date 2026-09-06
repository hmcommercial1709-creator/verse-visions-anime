import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/anime")({
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search?.page ?? 1),
  }),
  loader: async ({ search }) => {
    const page = Number(search.page) || 1;
    const pageSize = 36;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    try {
      const { data, count } = await supabase
        .from("generated_pages")
        .select("slug, title", { count: "exact" })
        .range(from, to);

      return {
        pages: data || [],
        total: count || 0,
        page,
        pageSize,
      };
    } catch (error) {
      console.error("Anime archive error:", error);
      return { pages: [], total: 0, page, pageSize };
    }
  },
  head: () => ({
    meta: [
      { title: "Anime Guides & Hubs Archive | GameCastle" },
      { name: "description", content: "Explore the comprehensive archive of 31,000+ anime guides, reviews, and character hubs." },
      { property: "og:title", content: "Anime Guides & Hubs Archive | GameCastle" },
      { property: "og:url", content: "https://gamecastle.store/anime" },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/anime" }],
  }),
  component: AnimeArchive,
});

function AnimeArchive() {
  const { pages, total, page, pageSize } = Route.useLoaderData();
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-pink-400">🌸 Anime Guides Archive</h1>
          <p className="text-sm text-slate-400 mt-1">Total indexed pages: {total.toLocaleString()}</p>
        </div>
        <a href="/" className="text-xs bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg hover:border-pink-500 transition">← Back to Home</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {pages.map((p) => (
          <a
            key={p.slug}
            href={`/${p.slug}`}
            className="p-4 bg-slate-900/80 border border-slate-800 rounded-lg hover:border-pink-500 transition-all text-sm font-medium line-clamp-2"
          >
            {p.title}
          </a>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-900">
        {page > 1 ? (
          <a href={`/anime?page=${page - 1}`} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-pink-500 text-sm">
            ← Previous
          </a>
        ) : <div />}
        <span className="text-sm text-slate-400">Page {page} of {totalPages || 1}</span>
        {page < totalPages ? (
          <a href={`/anime?page=${page + 1}`} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-pink-500 text-sm">
            Next →
          </a>
        ) : <div />}
      </div>
    </div>
  );
}
