import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { isLocaleCode } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/store")({
  beforeLoad: ({ params }) => {
    if (!isLocaleCode(params.locale)) throw notFound();
    if (params.locale === "en") throw redirect({ href: "/store", statusCode: 301 });
    throw notFound();
  },
  head: () => ({ meta: [{ name: "robots", content: "noindex, follow" }] }),
});
