import { createFileRoute, notFound } from "@tanstack/react-router";
import { ComparisonPage } from "@/components/comparison-page";
import { loadComparison, comparisonPath, parsePair } from "@/lib/catalog/comparison";
import { CATALOG_HEADERS } from "@/lib/catalog/http";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/compare/games/$pair")({
  loader: async ({ params }) => {
    const data = await loadComparison("game", params.pair);
    if (!data) throw notFound();
    return data;
  },
  headers: () => CATALOG_HEADERS,
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const heading = `${loaderData.a.name} vs ${loaderData.b.name}`;
    // The canonical comes from the ordered pair, not from params: a request
    // for the reverse order renders the same page and must point at the one
    // address rather than becoming a second URL for it.
    const url = absoluteUrl(loaderData.canonical);
    const requested = parsePair(params.pair);
    const description = `${heading} compared on ${loaderData.rows.length} stored figures${
      loaderData.shared.length ? ` — both are ${loaderData.shared.join(" and ")} titles.` : "."
    }`;
    return {
      meta: [
        { title: `${heading} | GameCastle` },
        { name: "description", content: description },
        { property: "og:title", content: heading },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        ...(requested && comparisonPath("game", requested[0], requested[1]) !== loaderData.canonical
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
  component: GameComparisonRoute,
});

function GameComparisonRoute() {
  const data = Route.useLoaderData();
  return <ComparisonPage type="game" data={data} />;
}
