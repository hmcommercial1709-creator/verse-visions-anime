import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/cookies")({
  head: () => ({ meta: [
      { property: "og:url", content: "https://gamecastle.store/cookies" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    { title: "Cookie Policy · AnimeVerse" },
    { name: "description", content: "What cookies AnimeVerse uses and how to opt out." },
    { property: "og:title", content: "Cookie Policy · AnimeVerse" },
    { property: "og:description", content: "Cookie practices." },
  ], links: [{ rel: "canonical", href: "https://gamecastle.store/cookies" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-12">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Cookies" }]} />
      <h1 className="font-display text-5xl font-bold">Cookie Policy</h1>
      <div className="mt-6 space-y-4 text-foreground/85 leading-relaxed">
        <p>AnimeVerse uses a small number of first-party and analytics cookies. Essential cookies keep the site running; analytics cookies help us understand what to write next.</p>
        <p>You can manage cookie preferences from your browser at any time.</p>
      </div>
    </div>
  ),
});
