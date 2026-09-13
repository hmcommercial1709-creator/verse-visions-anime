import { createFileRoute, notFound } from "@tanstack/react-router";
import { FacetPage } from "@/components/facet-page";
import { loadFacetPageData } from "@/lib/catalog/facet-loader";
import { CATALOG_HEADERS } from "@/lib/catalog/http";
import { facetHead } from "@/lib/catalog/facet-seo";

/**
 * The games side of the matrix. Same engine as /anime/browse, different
 * dimensions: platform replaces season, and there is no format.
 */
export const Route = createFileRoute("/games/browse/$")({
  loader: async ({ params }) => {
    const data = await loadFacetPageData("game", params._splat ?? "");
    if (!data) throw notFound();
    return data;
  },
  headers: () => CATALOG_HEADERS,
  head: ({ loaderData }) => facetHead("game", loaderData),
  component: GameFacetRoute,
});

function GameFacetRoute() {
  const data = Route.useLoaderData();
  return <FacetPage type="game" data={data} />;
}
