import { createFileRoute } from "@tanstack/react-router";
import { VideoDiscovery } from "@/components/video-discovery";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/")({
  loader: async () => {
    const { data: animeData } = await supabase
      .from("generated_pages")
      .select("slug, title")
      .limit(8);

    const { data: gamesData } = await supabase
      .from("game_nexus_matrix")
      .select("slug, title")
      .limit(8);

    return {
      animePages: animeData || [],
      gamePages: gamesData || [],
    };
  },
  head: () => ({
    meta: [
      { title: "GameCastle Anime | Anime, Gaming Videos & Live Channels" },
      { name: "description", content: "Discover anime trailers, gaming videos and Twitch live channels. Swipe through previews, explore anime guides and watch videos using the original YouTube player." },
      { property: "og:title", content: "GameCastle Anime | Anime, Gaming Videos & Live Channels" },
      { property: "og:description", content: "Explore anime trailers and gaming videos in a swipeable feed." },
      { property: "og:url", content: "https://gamecastle.store/" },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/" }],
  }),
  component: Home,
});

function Home() {
  const { animePages, gamePages } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <VideoDiscovery />

      {/* Gaming Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-900">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-purple-400">🎮 Latest Gaming Guides & Hubs</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {gamePages.map((page) => (
            <a
              key={page.slug}
              href={`/${page.slug}`}
              className="p-4 bg-slate-900/80 border border-slate-800 rounded-lg hover:border-purple-500 transition-all text-sm font-medium line-clamp-2"
            >
              {page.title}
            </a>
          ))}
        </div>
      </div>

      {/* Anime Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-900">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-pink-400">🌸 Latest Anime Guides & Reviews</h2>
          <a href="/anime" className="text-xs text-slate-400 hover:text-white transition">View All (31,000+) ←</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {animePages.map((page) => (
            <a
              key={page.slug}
              href={`/${page.slug}`}
              className="p-4 bg-slate-900/80 border border-slate-800 rounded-lg hover:border-pink-500 transition-all text-sm font-medium line-clamp-2"
            >
              {page.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
