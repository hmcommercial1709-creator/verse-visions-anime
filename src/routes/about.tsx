import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";
import { authors } from "@/data/articles";
import { ShieldCheck, PenLine, Scale, Users } from "lucide-react";

const TITLE = "About AnimeVerse — Our Anime Editorial Team & Analysis Mission";
const DESC =
  "Meet the AnimeVerse editorial team and read how we research, review, and analyse anime: independent long-form criticism, watch orders, and franchise deep dives written by humans.";
const URL = "https://verse-visions-anime.lovable.app/about";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `${TITLE} · AnimeVerse` },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
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
          publisher: {
            "@type": "Organization",
            name: "AnimeVerse",
            url: "https://verse-visions-anime.lovable.app/",
            employee: authors.map((a) => ({ "@type": "Person", name: a.name, jobTitle: a.role })),
          },
        }),
      },
    ],
  }),
  component: AboutPage,
});

const pillars = [
  { icon: PenLine, title: "Original writing only", body: "Every recap, review, and guide on AnimeVerse is written from scratch by a member of our team after watching the material. We do not republish synopses, subtitle scripts, or scraped summaries." },
  { icon: Scale, title: "Analysis over hype", body: "Our reviews argue a position and show the work: direction, storyboarding, adaptation choices, pacing against the source manga. Scores come last, not first." },
  { icon: ShieldCheck, title: "Corrections in the open", body: "When we get something wrong we fix it and say so at the bottom of the article. Facts are checked against primary sources — official sites, credited staff lists, and publisher announcements." },
  { icon: Users, title: "Reader-first monetisation", body: "We are funded by advertising and a small number of affiliate partnerships. Sponsored placements are always labelled, and no advertiser gets to review coverage before publication." },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-6 py-12">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "About Us" }]} />
      <h1 className="font-display text-4xl lg:text-5xl font-bold">About AnimeVerse</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        AnimeVerse is an independent anime publication. We write long-form criticism, franchise deep dives, episode
        analysis, and the practical guides — watch orders, arc breakdowns, beginner routes — that fans actually search
        for. No streams, no downloads: just editorial.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Our mission</h2>
        <div className="mt-4 space-y-4 text-foreground/85 leading-relaxed">
          <p>
            Anime coverage online splits into two piles: news aggregation that vanishes in a day, and forum arguments
            nobody can find twice. We built AnimeVerse for the middle — durable, structured analysis that is still
            useful three seasons later.
          </p>
          <p>
            That means a page for a franchise explains how its timeline actually fits together. It means a character
            page covers biography, personality, ability mechanics, and how their relationships change across arcs. And
            it means an episode recap tells you what the direction was doing, not only what happened.
          </p>
          <p>
            We treat the medium as worth arguing about seriously, and we treat readers as people who can handle a real
            argument.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">How we work</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <p.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          The full standards document — sourcing, spoiler handling, review scoring, affiliate disclosure — lives in our{" "}
          <Link to="/editorial-policy" className="text-primary hover:underline">editorial policy</Link>.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">The editorial team</h2>
        <p className="mt-2 text-muted-foreground">Every article carries a byline. These are the people behind them.</p>
        <div className="mt-5 space-y-3">
          {authors.map((a) => (
            <div key={a.slug} className="flex gap-4 rounded-2xl border border-border/60 bg-card/40 p-5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-lg font-bold text-primary-foreground">
                {a.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold">{a.name}</div>
                <div className="text-xs uppercase tracking-[0.16em] text-primary">{a.role}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.bio}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          See all bylines and archives on the <Link to="/authors" className="text-primary hover:underline">authors page</Link>.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">What we publish</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
          <li className="rounded-xl border border-border/60 bg-card/30 p-4"><Link to="/reviews" className="font-semibold text-foreground hover:text-primary">Reviews</Link><p className="mt-1 text-muted-foreground">Season and series reviews with a stated argument.</p></li>
          <li className="rounded-xl border border-border/60 bg-card/30 p-4"><Link to="/guides" className="font-semibold text-foreground hover:text-primary">Guides &amp; watch orders</Link><p className="mt-1 text-muted-foreground">Franchise routes, arc maps, beginner paths.</p></li>
          <li className="rounded-xl border border-border/60 bg-card/30 p-4"><Link to="/browse" className="font-semibold text-foreground hover:text-primary">Anime hubs</Link><p className="mt-1 text-muted-foreground">One structured hub per series, with episodes and characters.</p></li>
          <li className="rounded-xl border border-border/60 bg-card/30 p-4"><Link to="/news" className="font-semibold text-foreground hover:text-primary">Industry news</Link><p className="mt-1 text-muted-foreground">Studio, licensing, and release reporting.</p></li>
        </ul>
      </section>

      <section className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-6">
        <h2 className="font-display text-xl font-bold">Talk to us</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tips, corrections, pitches, and partnership enquiries all go through one place.
        </p>
        <Link to="/contact" className="mt-4 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-primary hover:brightness-110">
          Contact the team
        </Link>
      </section>
    </div>
  );
}
