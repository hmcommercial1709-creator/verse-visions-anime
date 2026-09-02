import { createFileRoute } from "@tanstack/react-router";
import { VideoDiscovery } from "@/components/video-discovery";

export const Route = createFileRoute("/")({
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
  component: VideoDiscovery,
});
