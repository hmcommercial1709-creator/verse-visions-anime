import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";

export const Route = createFileRoute("/dmca")({
  head: () => ({ meta: [
    { title: "DMCA Policy · AnimeVerse" },
    { name: "description", content: "How to submit a DMCA takedown request to AnimeVerse." },
    { property: "og:title", content: "DMCA · AnimeVerse" },
    { property: "og:description", content: "DMCA takedown process." },
  ], links: [{ rel: "canonical", href: "/dmca" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-12">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "DMCA" }]} />
      <h1 className="font-display text-5xl font-bold">DMCA Policy</h1>
      <div className="mt-6 space-y-4 text-foreground/85 leading-relaxed">
        <p>AnimeVerse respects intellectual property rights. If you believe content on our site infringes your copyright, contact dmca@animeverse.example with:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Identification of the copyrighted work</li>
          <li>Location of the allegedly infringing material</li>
          <li>Your contact information</li>
          <li>A good-faith statement and signature</li>
        </ul>
      </div>
    </div>
  ),
});
