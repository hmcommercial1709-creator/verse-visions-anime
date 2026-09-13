import { createFileRoute, notFound } from "@tanstack/react-router";
import { FacetPage } from "@/components/facet-page";
import { loadFacetPageData } from "@/lib/catalog/facet-loader";
import { CATALOG_HEADERS } from "@/lib/catalog/http";
import { facetHead } from "@/lib/catalog/facet-seo";

/**
 * The manga side of the matrix. Same engine and the same inventory gate as
 * anime and games; `studio` carries the author here, which is why the shared
 * facet code names that dimension generically.
 */
export const Route = createFileRoute("/manga/browse/$")({
  loader: async ({ params }) => {
    const data = await loadFacetPageData("manga", params._splat ?? "");
    if (!data) throw notFound();
    return data;
  },
  headers: () => CATALOG_HEADERS,
  head: ({ loaderData }) => facetHead("manga", loaderData),
  component: MangaFacetRoute,
});

function MangaFacetRoute() {
  const data = Route.useLoaderData();
  return <FacetPage type="manga" data={data} />;
}
