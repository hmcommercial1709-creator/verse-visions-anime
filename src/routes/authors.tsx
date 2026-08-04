import { createFileRoute, Link } from "@tanstack/react-router";
import { EDITORIAL_DESK } from "@/data/articles";
import { Breadcrumbs } from "@/components/ui-bits";

const TITLE = "GameCastle Anime Editorial Team — How We Write and Check Our Guides";
const DESC =
  "GameCastle Anime publishes under one organisational byline. Here is how our anime guides, watch orders and power-system explainers are researched, written and corrected.";
const URL = "https://gamecastle.store/authors";

export const Route = createFileRoute("/authors")({
  head: () => ({
    meta: [
      { title: `${TITLE} · GameCastle Anime` },
      { name: "description", content: DESC },
      { property: "og:title", content: "GameCastle Anime Editorial Team" },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          url: URL,
          name: TITLE,
          description: DESC,
          mainEntity: {
            "@type": "Organization",
            name: EDITORIAL_DESK.name,
            description: EDITORIAL_DESK.bio,
            url: URL,
            parentOrganization: { "@id": "https://gamecastle.store/#organization" },
          },
        }),
      },
    ],
  }),
  component: AuthorsPage,
});

const practices = [
  {
    title: "One byline, no invented staff",
    body: "Every article is credited to the GameCastle Anime Editorial Team. We do not publish personal profiles, job histories or years-of-experience claims, because we would rather show our working than assert authority.",
  },
  {
    title: "Sources we actually use",
    body: "Broadcast episodes and published manga volumes first, then official sites, credited staff lists and publisher announcements. Fan wikis are a starting point for finding a source, never the source itself.",
  },
  {
    title: "Scores are editorial, not aggregated",
    body: "Any score you see on the site is our own editorial judgement. We do not collect community ratings, and we do not publish rating counts or review totals we cannot stand behind.",
  },
  {
    title: "Corrections in the open",
    body: "If we get a fact, date or timeline wrong, we fix the page and note it. Send anything you spot through the contact form and it reaches the desk directly.",
  },
];

function AuthorsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Editorial Team" }]} />
      <h1 className="font-display text-4xl lg:text-5xl font-bold">The GameCastle Anime Editorial Team</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">{EDITORIAL_DESK.bio}</p>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">How we work</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {practices.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-border/60 bg-card/30 p-6">
        <h2 className="font-display text-2xl font-bold">Read more</h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link to="/editorial-policy" className="text-primary hover:underline">Editorial policy</Link> — sourcing,
            spoiler handling and affiliate disclosure in full
          </li>
          <li>
            <Link to="/about" className="text-primary hover:underline">About GameCastle Anime</Link> — what we publish
            and why
          </li>
          <li>
            <Link to="/power-scaling" className="text-primary hover:underline">Power scaling methodology</Link> — how we
            rank anime abilities
          </li>
          <li>
            <Link to="/contact" className="text-primary hover:underline">Contact the desk</Link> — corrections,
            questions and pitches
          </li>
        </ul>
      </section>
    </div>
  );
}
