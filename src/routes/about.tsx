import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AnimeVerse — Independent Anime Editorial · AnimeVerse" },
      { name: "description", content: "AnimeVerse is an independent editorial team covering anime reviews, guides, and industry news since 2016." },
      { property: "og:title", content: "About AnimeVerse" },
      { property: "og:description", content: "An independent anime editorial." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-12">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "About" }]} />
      <h1 className="font-display text-5xl font-bold">About AnimeVerse</h1>
      <div className="mt-6 space-y-5 text-lg leading-relaxed text-foreground/85">
        <p>AnimeVerse is an independent editorial site covering anime reviews, guides, and the culture around the medium. We started as a group of writers who wanted a place to publish long-form anime writing without an algorithm pruning the middle.</p>
        <p>Every article we publish is written by a human. Every review is scored by a person who watched the show. Every recommendation is one we'd give a friend at a party.</p>
        <p>We are supported by a mix of reader-first advertising, affiliate partnerships with stores we already shop at, and a small membership program.</p>
        <p>If you have a tip, a correction, or a pitch: <a className="text-primary" href="/contact">get in touch</a>.</p>
      </div>
    </div>
  ),
});
