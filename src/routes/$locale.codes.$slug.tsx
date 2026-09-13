import { createFileRoute } from "@tanstack/react-router";
import { CodePage } from "@/components/code-page";
import { codePageHead, loadCodePage } from "@/lib/code-page";

/**
 * Localized edition. Shares its loader, head and body with the canonical
 * /codes/:slug route, and points its canonical link there, so the two do not
 * compete in the index.
 */
export const Route = createFileRoute("/$locale/codes/$slug")({
  loader: ({ params }) => loadCodePage(params.slug),
  headers: () => ({
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  }),
  head: ({ loaderData, params }) => codePageHead(loaderData?.item, params.slug),
  component: function LocalizedCodePage() {
    const { item, related } = Route.useLoaderData();
    return <CodePage item={item} related={related} />;
  },
});
