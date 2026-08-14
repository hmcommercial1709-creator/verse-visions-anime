import { createFileRoute } from "@tanstack/react-router";
import { RewardWallpaperGallery } from "@/components/reward-wallpaper-gallery";
import { rewardWallpaperSchema } from "@/lib/reward-wallpaper-seo";
import { absoluteUrl } from "@/lib/seo";

const PATH = "/rewards/anime-wallpapers";
const TITLE = "Free Anime Wallpapers HD | GameCastle Reward";
const DESCRIPTION =
  "Download 40 free HD anime wallpapers for desktop and mobile, including original art inspired by One Piece, Naruto, Demon Slayer and more.";
const OG_IMAGE = absoluteUrl("/rewards/wallpapers/pirate-ocean-sunset-hd.webp");

export const Route = createFileRoute("/rewards/anime-wallpapers")({
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
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/webp" },
      { property: "og:image:width", content: "1600" },
      { property: "og:image:height", content: "900" },
      {
        property: "og:image:alt",
        content: "Original pirate ocean sunset anime wallpaper by GameCastle",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
      {
        name: "twitter:image:alt",
        content: "Original pirate ocean sunset anime wallpaper by GameCastle",
      },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl(PATH) },
      { rel: "alternate", hreflang: "en", href: absoluteUrl(PATH) },
      { rel: "alternate", hreflang: "x-default", href: absoluteUrl(PATH) },
      { rel: "preload", as: "image", href: OG_IMAGE, type: "image/webp" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(rewardWallpaperSchema("en")),
      },
    ],
  }),
  component: EnglishWallpaperRewards,
});

function EnglishWallpaperRewards() {
  return (
    <>
      <section
        className="gamecastle-product-box mx-auto my-5 max-w-7xl rounded-2xl border border-pink-500/40 bg-[#1a1a1a] px-6 py-7 text-center shadow-xl"
        aria-labelledby="samurai-wallpaper-pack-title"
      >
        <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-400">
          Premium Wallpaper Pack
        </p>
        <h2
          id="samurai-wallpaper-pack-title"
          className="mt-3 text-2xl font-black text-white sm:text-3xl"
        >
          Ultimate Anime Samurai 4K Wallpapers
        </h2>
        <p className="mx-auto mt-3 max-w-2xl leading-7 text-[#cccccc]">
          Get a premium collection of cinematic anime samurai wallpapers in
          crisp 4K resolution for desktop and mobile.
        </p>
        <a
          href="https://lamadventure4.gumroad.com/l/fovib"
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="mt-6 inline-flex rounded-lg bg-[#ff3366] px-7 py-3 text-base font-black text-white shadow-lg transition hover:bg-[#ff1f57] focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
          aria-label="Buy and download the Ultimate Anime Samurai 4K Wallpapers pack for $5.99 on Gumroad"
        >
          Buy &amp; Download Now — $5.99
        </a>
        <p className="mt-3 text-xs text-neutral-400">
          Secure checkout and digital delivery are handled by Gumroad.
        </p>
      </section>
      <RewardWallpaperGallery language="en" />
    </>
  );
}
