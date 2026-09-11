import { createFileRoute } from "@tanstack/react-router";
import { HomeStage } from "@/components/home-stage";
import { HeroSlider } from "@/components/hero-slider";
import { HomeStorePromo } from "@/components/home-store-promo";
import { publishedAnime, publishedArticles } from "@/lib/content-registry";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const { data: animeData } = await supabase
        .from("anime_nexus_matrix")
        .select("slug, title, name, image")
        .limit(8);

      const { data: gamesData } = await supabase
        .from("game_nexus_matrix")
        .select("slug, slug_ar, title, title_ar, description_ar")
        .limit(8);

      const { data: storiesData } = await supabase
        .from("anime_content_drafts")
        .select("slug, title, description, image")
        .limit(8);

      return {
        animePages: animeData || [],
        gamePages: gamesData || [],
        storiesPages: storiesData || [],
      };
    } catch (error) {
      console.error("Home loader error:", error);
      return {
        animePages: [],
        gamePages: [],
        storiesPages: [],
      };
    }
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
  const { animePages, gamePages, storiesPages } = Route.useLoaderData();
  const trending = publishedAnime()
    .slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
  const featuredArticles = publishedArticles().slice(0, 5);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HomeStage trending={trending} />

      <div className="border-b border-border/50 bg-background">
        <HeroSlider items={featuredArticles} />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6" aria-labelledby="home-trending-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Your next watch</p>
            <h2 id="home-trending-heading" className="mt-2 font-display text-2xl font-bold sm:text-3xl">Trending anime, ranked for tonight</h2>
          </div>
          <a href="/trending" className="text-sm font-semibold text-primary hover:underline">View all</a>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {trending.slice(0, 5).map((anime, index) => (
            <a key={anime.slug} href={`/anime/${anime.slug}`} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:-translate-y-1 hover:border-primary/60">
              <div className="aspect-[4/5] bg-secondary/60">
                <img src={anime.image} alt={anime.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/90 to-transparent p-3 pt-12">
                <span className="text-3xl font-black text-primary/80">0{index + 1}</span>
                <h3 className="mt-1 line-clamp-2 font-display text-sm font-bold">{anime.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      <HomeStorePromo />

      <div className="mx-auto max-w-7xl border-t border-border/60 px-4 py-12 lg:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Exclusive Stories & Drafts</p>
            <h2 className="mt-1 font-display text-2xl font-bold">Latest programmatic stories & drafts</h2>
          </div>
          <a href="/anime" className="text-sm font-semibold text-primary hover:underline">View all</a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {storiesPages.map((story) => (
            <a
              key={story.slug}
              href={`/anime/${story.slug}`}
              className="group rounded-2xl border border-border/60 bg-card/70 p-4 transition hover:border-primary/60 hover:bg-card flex flex-col justify-between"
            >
              <div>
                {story.image && (
                  <div className="mb-3 aspect-video overflow-hidden rounded-xl bg-secondary/60">
                    <img src={story.image} alt={story.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                )}
                <h3 className="font-display text-base font-bold line-clamp-2 text-foreground group-hover:text-primary transition">{story.title}</h3>
                {story.description && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{story.description}</p>
                )}
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-primary">
                Read story &larr;
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-border/60 px-4 py-12 lg:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-bold text-accent">Latest gaming guides & hubs</h2>
          <a href="/gaming-hub" className="text-sm font-semibold text-accent hover:underline">Explore games</a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gamePages.map((game) => {
            const gameTitle = game.title_ar || game.title;
            const gameSlug = game.slug_ar || game.slug;
            return (
              <a
                key={game.slug}
                href={`/games/${gameSlug}`}
                className="rounded-2xl border border-border/60 bg-card/70 p-5 transition hover:border-accent/60 hover:bg-card flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-display text-base font-bold line-clamp-1">{gameTitle}</h3>
                  {game.description_ar && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{game.description_ar}</p>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-border/60 px-4 py-12 lg:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-bold text-primary">Latest anime guides & reviews</h2>
          <a href="/anime" className="text-sm font-semibold text-primary hover:underline">Browse all</a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {animePages.map((page) => (
            <a
              key={page.slug}
              href={`/anime/${page.slug}`}
              className="rounded-2xl border border-border/60 bg-card/70 p-5 text-sm font-semibold transition hover:border-primary/60 hover:bg-card"
            >
              {page.title || page.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
