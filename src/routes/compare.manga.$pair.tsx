import { createFileRoute, notFound } from "@tanstack/react-router";
import { ComparisonPage } from "@/components/comparison-page";
import { loadComparison, comparisonPath, parsePair } from "@/lib/catalog/comparison";
import { CATALOG_HEADERS } from "@/lib/catalog/http";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/compare/manga/$pair")({
  loader: async ({ params }) => {
    const data = await loadComparison("manga", params.pair);
    if (!data) throw notFound();
    return data;
  },
  headers: () => CATALOG_HEADERS,
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const heading = `${loaderData.a.name} vs ${loaderData.b.name}`;
    const url = absoluteUrl(loaderData.canonical);
    const requested = parsePair(params.pair);
    const description = `${heading} compared on ${loaderData.rows.length} stored figures${
      loaderData.shared.length ? ` — both are ${loaderData.shared.join(" and ")} series.` : "."
    }`;
    return {
      meta: [
        { title: `${heading} | GameCastle` },
        { name: "description", content: description },
        { property: "og:title", content: heading },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        // The reverse spelling renders the same page, so it points at the one
        // canonical address and is kept out of the index.
        ...(requested &&
        comparisonPath("manga", requested[0], requested[1]) !== loaderData.canonical
          ? [{ name: "robots", content: "noindex, follow" }]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([{ path: "/", name: "Home" }, { name: heading }]),
          ),
        },
      ],
    };
  },
  component: MangaComparisonRoute,
});

function MangaComparisonRoute() {
  const data = Route.useLoaderData();
  return <ComparisonPage type="manga" data={data} />;
}
