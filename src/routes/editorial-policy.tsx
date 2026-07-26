import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/editorial-policy")({
  head: () => ({ meta: [
      { property: "og:url", content: "https://gamecastle.store/editorial-policy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    { title: "Editorial Policy · AnimeVerse" },
    { name: "description", content: "How AnimeVerse's editorial team works: reviews, corrections, and affiliate disclosures." },
    { property: "og:title", content: "Editorial Policy · AnimeVerse" },
    { property: "og:description", content: "How we edit and score." },
  ], links: [{ rel: "canonical", href: "https://gamecastle.store/editorial-policy" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-12">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Editorial Policy" }]} />
      <h1 className="font-display text-5xl font-bold">Editorial Policy</h1>
      <div className="mt-6 space-y-4 text-foreground/85 leading-relaxed">
        <p>Reviews on AnimeVerse are written by a single editor after watching the full available run of a series. Scores are the editor's opinion, not an aggregate.</p>
        <p>We disclose all affiliate partnerships in the article. Product placement and paid coverage are labeled "Sponsored" without exception.</p>
        <p>Corrections are appended to the article and dated. We do not silently edit factual claims.</p>
      </div>
    </div>
  ),
});
