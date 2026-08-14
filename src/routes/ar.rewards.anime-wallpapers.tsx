import { createFileRoute } from "@tanstack/react-router";
import { RewardWallpaperGallery } from "@/components/reward-wallpaper-gallery";
import { rewardWallpaperSchema } from "@/lib/reward-wallpaper-seo";
import { absoluteUrl } from "@/lib/seo";

const PATH = "/ar/rewards/anime-wallpapers";
const EN_PATH = "/rewards/anime-wallpapers";
const TITLE = "خلفيات أنمي مجانية HD | هدية GameCastle";
const DESCRIPTION =
  "حمّل 40 خلفية أنمي مجانية عالية الدقة للجوال والكمبيوتر، برسومات أصلية مستوحاة من ون بيس وناروتو وقاتل الشياطين والمزيد.";
const OG_IMAGE = absoluteUrl("/rewards/wallpapers/pirate-ocean-sunset-hd.webp");

export const Route = createFileRoute("/ar/rewards/anime-wallpapers")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "robots",
        content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },
      {
        name: "googlebot",
        content: "index, follow, max-snippet:-1, max-image-preview:large",
      },
      { name: "bingbot", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl(PATH) },
      { property: "og:site_name", content: "GameCastle Anime" },
      { property: "og:locale", content: "ar_AR" },
      { property: "og:locale:alternate", content: "en_US" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/webp" },
      { property: "og:image:width", content: "1600" },
      { property: "og:image:height", content: "900" },
      {
        property: "og:image:alt",
        content: "خلفية أنمي أصلية لمغامرة قراصنة وقت الغروب من GameCastle",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
      {
        name: "twitter:image:alt",
        content: "خلفية أنمي أصلية لمغامرة قراصنة وقت الغروب من GameCastle",
      },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl(PATH) },
      { rel: "alternate", hreflang: "ar", href: absoluteUrl(PATH) },
      { rel: "alternate", hreflang: "en", href: absoluteUrl(EN_PATH) },
      { rel: "alternate", hreflang: "x-default", href: absoluteUrl(EN_PATH) },
      { rel: "preload", as: "image", href: OG_IMAGE, type: "image/webp" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(rewardWallpaperSchema("ar")),
      },
    ],
  }),
  component: () => <RewardWallpaperGallery language="ar" />,
});
