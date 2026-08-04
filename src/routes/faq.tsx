import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";

const faqs = [
  { q: "What is GameCastle Anime?", a: "An independent editorial site covering anime reviews, guides, and industry news." },
  { q: "How do you pick which anime to cover?", a: "Editorial priority follows what fans are watching now, plus the classics newcomers should not miss." },
  { q: "Do you write for kids or adults?", a: "Both. We label mature content and keep our beginner guides safe for all-ages readers." },
  { q: "How can I contribute?", a: "Send a pitch through the contact form with a link to prior work." },
  { q: "Do you offer a newsletter?", a: "Yes. One email every Friday. Subscribe from the footer." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [
      { property: "og:url", content: "https://gamecastle.store/faq" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    { title: "GameCastle Anime FAQ · GameCastle Anime" },
    { name: "description", content: "Frequently asked questions about GameCastle Anime: coverage, contributions, and the newsletter." },
    { property: "og:title", content: "FAQ · GameCastle Anime" },
    { property: "og:description", content: "Frequently asked questions." },
  ], links: [{ rel: "canonical", href: "https://gamecastle.store/faq" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    }) }],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-12">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "FAQ" }]} />
      <h1 className="font-display text-5xl font-bold">FAQ</h1>
      <div className="mt-8 space-y-3">
        {faqs.map((f,i) => (
          <details key={i} className="group rounded-xl border border-border/60 bg-card/40 p-4">
            <summary className="cursor-pointer font-semibold list-none flex justify-between">{f.q}<span className="text-primary group-open:rotate-45 transition-transform">+</span></summary>
            <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  ),
});
