import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { isLocaleCode, READY_LOCALES } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

/**
 * Catch-all for /$locale/* once no more specific route (e.g. ar.anime.$slug)
 * has matched. Only "ar" has real translated content beyond English; every
 * other locale prefix — including unmatched paths under /ar/ — falls back
 * to the English original rather than fabricating a page, so an unknown
 * slug 404s instead of always returning something.
 */
export const Route = createFileRoute("/$locale/$")({
  beforeLoad: ({ params }) => {
    if (!isLocaleCode(params.locale)) throw notFound();
    const path = `/${params._splat ?? ""}`;
    if (!READY_LOCALES.includes(params.locale)) {
      throw redirect({ href: path, statusCode: 301 });
    }
    if (params.locale === "ar" && path === "/") {
      throw redirect({ href: "/ar/anime", statusCode: 301 });
    }
  },
  loader: async ({ params }) => {
    const splat = params._splat ?? "";
    if (!splat) throw redirect({ href: "/ar/anime", statusCode: 301 });

    const segments = splat.split("/");
    const slug = segments[segments.length - 1];

    const { data, error } = await supabase
      .from("anime_nexus_matrix")
      .select("slug, title, target_language, target_market, status")
      .eq("slug", slug)
      .eq("target_language", params.locale)
      .single();

    if (error || !data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `${loaderData.title} | GameCastle Store` }] : [],
  }),
  component: function LocaleMatrixFallback() {
    const item = Route.useLoaderData();
    return (
      <div className="min-h-screen bg-background text-foreground py-12 px-4 max-w-3xl mx-auto">
        <div className="mb-4 text-xs font-mono text-cyan-400">
          {item.target_language.toUpperCase()} · {item.status || "Active"}
        </div>
        <h1 className="text-4xl font-black mb-6 bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          {item.title}
        </h1>
        <p className="text-muted-foreground">Market: {item.target_market}</p>
      </div>
    );
  },
});
