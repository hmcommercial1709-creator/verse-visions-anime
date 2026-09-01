import { absoluteUrl } from "@/lib/seo";

export function gamingHubHead({
  path,
  title,
  description,
  image = "/gamivo/direct-top-ups-hero.svg",
  schemas = [],
}: {
  path: string;
  title: string;
  description: string;
  image?: string;
  schemas?: unknown[];
}) {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: imageUrl },
      { property: "og:image:alt", content: `${title} — GameCastle` },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "en", href: url },
      { rel: "alternate", hrefLang: "x-default", href: url },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${url}#page`,
          url,
          name: title,
          description,
          inLanguage: "en",
          image: imageUrl,
          isPartOf: { "@id": `${absoluteUrl("/")}#website` },
          publisher: { "@id": `${absoluteUrl("/")}#organization` },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: absoluteUrl("/"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Gaming Hub",
                item: absoluteUrl("/gaming-hub"),
              },
              ...(path === "/gaming-hub"
                ? []
                : [
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: title.split("|")[0].trim(),
                      item: url,
                    },
                  ]),
            ],
          },
        }),
      },
      ...schemas.map((schema) => ({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          ...(schema as object),
        }),
      })),
    ],
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function howToSchema({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
