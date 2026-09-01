import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { isLocaleCode } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/$")({
  beforeLoad: ({ params }) => {
    if (!isLocaleCode(params.locale)) throw notFound();
    const path = `/${params._splat ?? ""}`;
    if (params.locale === "en") {
      throw redirect({ href: path, statusCode: 301 });
    }
    if (params.locale === "ar" && path === "/") {
      throw redirect({ href: "/ar/anime", statusCode: 301 });
    }
    throw notFound();
  },
  head: () => ({ meta: [{ title: "Page not found · GameCastle Anime" }, { name: "robots", content: "noindex, follow" }] }),
});
