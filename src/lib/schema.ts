/**
 * Programmatic JSON-LD builders.
 *
 * Every dynamic template composes its structured data from these helpers so
 * the emitted schema stays valid and consistent across thousands of pages.
 */
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";

const ORG_ID = `${SITE_URL}/#organization`;

export function articleSchema(input: {
  path: string;
  headline: string;
  description: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  wordCount?: number;
  section?: string;
  keywords?: string[];
  inLanguage?: string;
}) {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: input.headline.slice(0, 110),
    description: input.description,
    inLanguage: input.inLanguage ?? "en",
    ...(input.image ? { image: [input.image] } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.wordCount ? { wordCount: input.wordCount } : {}),
    ...(input.section ? { articleSection: input.section } : {}),
    ...(input.keywords?.length ? { keywords: input.keywords.join(", ") } : {}),
    author: { "@type": "Person", name: input.author ?? `${SITE_NAME} Editorial` },
    publisher: { "@id": ORG_ID },
  };
}

export function reviewSchema(input: {
  path: string;
  itemName: string;
  itemType?: "TVSeries" | "Movie" | "Book" | "SoftwareApplication";
  rating: number;
  bestRating?: number;
  author?: string;
  body?: string;
  datePublished?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    url: absoluteUrl(input.path),
    itemReviewed: { "@type": input.itemType ?? "TVSeries", name: input.itemName },
    reviewRating: {
      "@type": "Rating",
      ratingValue: input.rating,
      bestRating: input.bestRating ?? 10,
      worstRating: 1,
    },
    author: { "@type": "Person", name: input.author ?? `${SITE_NAME} Editorial` },
    ...(input.body ? { reviewBody: input.body } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    publisher: { "@id": ORG_ID },
  };
}

export function softwareApplicationSchema(input: {
  path: string;
  name: string;
  description: string;
  category?: string;
  operatingSystem?: string;
  rating?: { value: number; count: number };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    applicationCategory: input.category ?? "EntertainmentApplication",
    operatingSystem: input.operatingSystem ?? "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    ...(input.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: input.rating.value,
            ratingCount: input.rating.count,
            bestRating: 10,
          },
        }
      : {}),
    publisher: { "@id": ORG_ID },
  };
}

export function collectionPageSchema(input: {
  path: string;
  name: string;
  description: string;
  items: { path: string; name: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: input.items.length,
      itemListElement: input.items.slice(0, 50).map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(item.path),
        name: item.name,
      })),
    },
  };
}
