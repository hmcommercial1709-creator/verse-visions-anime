import { createFileRoute, notFound } from "@tanstack/react-router";
import { ExploreTopicPage } from "@/components/explore-topic-page";
import { explorePageBySlug } from "@/data/explore-pages";
import { absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/explore/$slug")({
  loader: ({ params }) => {
    const page = explorePageBySlug(params.slug);
    if (!page) throw notFound();
    return page;
  },
  // @ts-expect-error Loader data is present after the not-found boundary.
  head: ({ loaderData: page }) => ({ meta: [{ title: `${page.en.title} | GameCastle Anime` }, { name: "description", content: page.en.description }, { property: "og:title", content: page.en.title }, { property: "og:description", content: page.en.description }], links: [{ rel: "canonical", href: absoluteUrl(`/explore/${page.slug}`) }, { rel: "alternate", hreflang: "en", href: absoluteUrl(`/explore/${page.slug}`) }, { rel: "alternate", hreflang: "ar", href: absoluteUrl(`/ar/explore/${page.slug}`) }, { rel: "alternate", hreflang: "x-default", href: absoluteUrl(`/explore/${page.slug}`) }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": page.category === "rankings" ? "ItemList" : "Article", headline: page.en.title, description: page.en.description, inLanguage: "en", url: absoluteUrl(`/explore/${page.slug}`) }, { "@type": "BreadcrumbList", itemListElement: ["Home", "Explore", page.en.title].map((name, i) => ({ "@type": "ListItem", position: i + 1, name })) }, { "@type": "FAQPage", mainEntity: page.en.faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }] }) }] }),
  component: () => <ExploreTopicPage page={Route.useLoaderData()} language="en" />,
});
