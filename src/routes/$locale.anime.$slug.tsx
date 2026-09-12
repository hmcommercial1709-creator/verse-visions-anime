import { createFileRoute, notFound } from "@tanstack/react-router";
import { supabase } from '@/integrations/supabase/client';

type AnimeMatrixItem = {
  slug: string;
  title: string;
  target_language: string;
  target_market: string;
  status: string | null;
};

export const Route = createFileRoute("/$locale/anime/$slug")({
  loader: async ({ params }): Promise<AnimeMatrixItem> => {
    const { locale, slug } = params;

    const { data, error } = await supabase
      .from('anime_nexus_matrix')
      .select('slug, title, target_language, target_market, status')
      .eq('slug', slug)
      .eq('target_language', locale)
      .single();

    if (error || !data) throw notFound();
    return data;
  },
  headers: () => ({
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  }),
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `${loaderData.title} | GameCastle Anime` }] : [],
  }),
  component: function AnimeMatrixRoute() {
    const anime = Route.useLoaderData();

    return (
      <div className="min-h-screen bg-background text-foreground py-12 px-4 max-w-3xl mx-auto">
        <div className="mb-4 text-xs font-mono text-cyan-400">
          {anime.target_language.toUpperCase()} · {anime.status || "Active"}
        </div>
        <h1 className="text-4xl font-black mb-6 bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          {anime.title}
        </h1>
        <p className="text-muted-foreground">
          Market: {anime.target_market}
        </p>
      </div>
    );
  },
});
