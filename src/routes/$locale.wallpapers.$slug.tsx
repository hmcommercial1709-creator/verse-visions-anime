import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { getAnime } from "@/data/animes";
import { isLocaleCode } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/wallpapers/$slug")({
  beforeLoad: ({ params }) => {
    if (!isLocaleCode(params.locale) || !getAnime(params.slug)) throw notFound();
    throw redirect({ href: "/rewards/anime-wallpapers", statusCode: 301 });
  },
});
