import { createFileRoute, notFound } from "@tanstack/react-router";
import { FacetPage } from "@/components/facet-page";
import { loadFacetPageData } from "@/lib/catalog/facet-loader";
import { hasArabicEdition, facetTitleAr, facetStatementsAr } from "@/lib/catalog/facet-i18n";
import { CATALOG_HEADERS } from "@/lib/catalog/http";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

/**
 * The Arabic edition of the anime matrix.
 *
 * Only intersections whose every dimension is in the translated vocabulary
 * are served. A studio name has no Arabic form we could publish without
 * inventing one, so /ar/anime/browse/studio-madhouse 404s rather than
 * rendering English text under hreflang="ar" — which would tell Google there
 * is an Arabic edition and then hand it the English page.
 *
 * The sibling rail is filtered the same way, so the Arabic edition never
 * links at a URL that only exists in English.
 */
export const Route = createFileRoute("/ar/anime/browse/$")({
  loader: async ({ params }) => {
    const data = await loadFacetPageData("anime", params._splat ?? "");
    if (!data || !hasArabicEdition(data.entry)) throw notFound();
    return { ...data, siblings: data.siblings.filter(hasArabicEdition) };
  },
  headers: () => CATALOG_HEADERS,
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const title = facetTitleAr("anime", loaderData.entry);
    const arPath = `/ar${loaderData.canonical}`;
    const url = absoluteUrl(arPath);
    const description = facetStatementsAr("anime", loaderData).slice(0, 2).join(" ").slice(0, 300);

    return {
      meta: [
        { title: `${title} | GameCastle` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:locale", content: "ar" },
        { property: "og:url", content: url },
      ],
      links: [
        { rel: "canonical", href: url },
        // Both directions, and x-default at the English original. A one-sided
        // pair is ignored, so declaring it here only works because the
        // English route declares the matching alternate back.
        { rel: "alternate", hrefLang: "ar", href: url },
        { rel: "alternate", hrefLang: "en", href: absoluteUrl(loaderData.canonical) },
        { rel: "alternate", hrefLang: "x-default", href: absoluteUrl(loaderData.canonical) },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([{ path: "/ar/anime", name: "أنمي" }, { name: title }]),
          ),
        },
      ],
    };
  },
  component: ArabicAnimeFacetRoute,
});

function ArabicAnimeFacetRoute() {
  const data = Route.useLoaderData();
  return <FacetPage type="anime" data={data} locale="ar" />;
}
