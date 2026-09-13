import { createFileRoute } from "@tanstack/react-router";
import { CodePage } from "@/components/code-page";
import { codePageHead, loadCodeItem } from "@/lib/code-page";

/**
 * Canonical code page. The default locale carries no prefix (see
 * localizePath), so this is the URL the sitemap advertises and the one
 * Google should index. It mirrors anime.$slug.tsx, which already pairs a
 * canonical route with its /$locale/ variant.
 */
export const Route = createFileRoute("/codes/$slug")({
  loader: ({ params }) => loadCodeItem(params.slug),
  headers: () => ({
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  }),
  head: ({ loaderData, params }) => codePageHead(loaderData, params.slug),
  component: function CanonicalCodePage() {
    return <CodePage item={Route.useLoaderData()} />;
  },
});
