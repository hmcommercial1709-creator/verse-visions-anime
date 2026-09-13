import { createFileRoute, notFound } from "@tanstack/react-router";
import { FacetPage } from "@/components/facet-page";
import { loadFacetPageData } from "@/lib/catalog/facet-loader";
import { CATALOG_HEADERS } from "@/lib/catalog/http";
import { facetHead } from "@/lib/catalog/facet-seo";

/**
 * The anime side of the combinatorial matrix.
 *
 * A splat route rather than one file per dimension, because the dimensions
 * combine: /anime/browse/genre-action, /anime/browse/genre-action/year-2020,
 * /anime/browse/genre-action/studio-madhouse/year-2020 are all this page. A
 * route per shape would be a dozen near-identical files that drift.
 *
 * What is NOT here is any decision about which intersections exist. That was
 * settled once, at ingest, by scripts/facet-index.mjs and its inventory
 * thresholds; this loader reads the verdict and 404s anything the index does
 * not carry. So the matrix cannot quietly grow a tail of two-item pages,
 * which is the failure mode that gets programmatic SEO penalised rather than
 * ranked.
 */
export const Route = createFileRoute("/anime/browse/$")({
  loader: async ({ params }) => {
    const data = await loadFacetPageData("anime", params._splat ?? "");
    if (!data) throw notFound();
    return data;
  },
  headers: () => CATALOG_HEADERS,
  head: ({ loaderData }) => facetHead("anime", loaderData),
  component: AnimeFacetRoute,
});

function AnimeFacetRoute() {
  const data = Route.useLoaderData();
  return <FacetPage type="anime" data={data} />;
}
