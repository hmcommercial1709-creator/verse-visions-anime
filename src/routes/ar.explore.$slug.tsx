import { createFileRoute, notFound } from "@tanstack/react-router";
import { ExploreTopicPage } from "@/components/explore-topic-page";
import { explorePageBySlug } from "@/data/explore-pages";
import { absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/ar/explore/$slug")({
  loader: ({ params }) => {
    const page = explorePageBySlug(params.slug);
    if (!page) throw notFound();
    return page;
  },
  // @ts-expect-error Loader data is present after the not-found boundary.
  head: ({ loaderData: page }) => ({ meta: [{ title: `${page.ar.title} | GameCastle Anime` }, { name: "description", content: page.ar.description }, { property: "og:title", content: page.ar.title }, { property: "og:description", content: page.ar.description }], links: [{ rel: "canonical", href: absoluteUrl(`/ar/explore/${page.slug}`) }, { rel: "alternate", hreflang: "ar", href: absoluteUrl(`/ar/explore/${page.slug}`) }, { rel: "alternate", hreflang: "en", href: absoluteUrl(`/explore/${page.slug}`) }, { rel: "alternate", hreflang: "x-default", href: absoluteUrl(`/explore/${page.slug}`) }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": page.category === "rankings" ? "ItemList" : "Article", headline: page.ar.title, description: page.ar.description, inLanguage: "ar", url: absoluteUrl(`/ar/explore/${page.slug}`) }, { "@type": "BreadcrumbList", itemListElement: ["الرئيسية", "استكشف", page.ar.title].map((name, i) => ({ "@type": "ListItem", position: i + 1, name })) }, { "@type": "FAQPage", mainEntity: page.ar.faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }] }) }] }),
  component: () => <ExploreTopicPage page={Route.useLoaderData()} language="ar" />,
});
