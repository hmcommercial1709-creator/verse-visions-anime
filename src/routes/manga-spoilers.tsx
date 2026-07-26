import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";
import { articles } from "@/data/articles";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";
import { EyeOff, BookOpen, AlertTriangle } from "lucide-react";

const TITLE = "Manga Spoilers Hub — Chapter Breakdowns Ahead of the Anime";
const DESC =
  "Manga-ahead coverage for AnimeVerse: chapter-by-chapter breakdowns, adaptation gaps, and what anime-only viewers have not seen yet — every major reveal kept behind a spoiler gate.";
const URL = absoluteUrl("/manga-spoilers");

export const Route = createFileRoute("/manga-spoilers")({
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
        children: JSON.stringify(breadcrumbSchema([{ path: "/", name: "Home" }, { name: "Manga Spoilers" }])),
      },
    ],
  }),
  component: MangaSpoilersPage,
});

const picks = ["shibuya-incident-timeline", "three-great-sorcerer-families", "gojo-satoru-limitless-technique-explained", "one-piece-wano-recap"];

function MangaSpoilersPage() {
  const featured = picks.map((s) => articles.find((a) => a.slug === s)).filter(Boolean) as typeof articles;

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Manga Spoilers" }]} />
      <h1 className="font-display text-4xl lg:text-5xl font-bold">Manga Spoilers</h1>
      <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
        Where we write about what the manga has already shown and the anime has not. Every reveal that
        runs ahead of the broadcast sits behind a spoiler gate you have to open yourself.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-primary"><EyeOff className="h-4 w-4" /> Gated reveals</span>
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-1.5 text-muted-foreground"><BookOpen className="h-4 w-4" /> Chapter-sourced</span>
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-1.5 text-muted-foreground"><AlertTriangle className="h-4 w-4" /> No leaked scans</span>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {featured.map((a) => (
          <Link key={a.slug} to="/article/$slug" params={{ slug: a.slug }} className="rounded-2xl overflow-hidden border border-border/60 bg-card/40 transition-colors hover:border-primary/50">
            <div className="h-28" style={{ background: a.cover }} />
            <div className="p-5">
              <div className="text-[11px] uppercase tracking-[0.16em] text-primary">{a.tag}</div>
              <h2 className="mt-1 font-display text-lg font-bold">{a.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
          <h2 className="font-display text-2xl font-bold">How we handle spoilers</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>· Anything past the latest broadcast episode is wrapped in a spoiler control, labelled with its scope and severity.</li>
            <li>· Headlines and meta descriptions never spoil. You can share a link safely.</li>
            <li>· We cite published chapters only. We do not use, link to, or describe leaked raw scans.</li>
            <li>· Adaptation-gap notes explain what the anime cut, reordered, or has yet to reach.</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            The full standard is in our <Link to="/editorial-policy" className="text-primary hover:underline">editorial policy</Link>.
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
          <h2 className="font-display text-2xl font-bold">Continue from here</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/anime/$slug" params={{ slug: "jujutsu-kaisen" }} className="text-primary hover:underline">Jujutsu Kaisen hub</Link> — arcs, episodes, characters</li>
            <li><Link to="/power-scaling" className="text-primary hover:underline">Power Scaling</Link> — how the abilities actually rank</li>
            <li><Link to="/guides" className="text-primary hover:underline">Anime Guides</Link> — watch orders and beginner routes</li>
            <li><Link to="/watch-order" className="text-primary hover:underline">Watch orders</Link> — franchise-by-franchise routes</li>
            <li><Link to="/news" className="text-primary hover:underline">Industry news</Link> — announcements and release dates</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
