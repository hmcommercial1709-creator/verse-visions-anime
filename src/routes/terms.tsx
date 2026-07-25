import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [
    { title: "Terms of Service · AnimeVerse" },
    { name: "description", content: "The terms governing your use of AnimeVerse." },
    { property: "og:title", content: "Terms of Service · AnimeVerse" },
    { property: "og:description", content: "Terms of use." },
  ], links: [{ rel: "canonical", href: "/terms" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-12">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Terms of Service" }]} />
      <h1 className="font-display text-5xl font-bold">Terms of Service</h1>
      <div className="mt-6 space-y-4 text-foreground/85 leading-relaxed">
        <p>By accessing AnimeVerse you agree to these terms. Content is provided for informational and editorial purposes.</p>
        <p>All anime titles, character names, and imagery are trademarks of their respective owners. AnimeVerse claims no ownership of underlying franchise IP.</p>
        <p>Editorial reviews and rankings are the opinion of the individual writer. Affiliate links may earn AnimeVerse a commission at no additional cost to you.</p>
      </div>
    </div>
  ),
});
