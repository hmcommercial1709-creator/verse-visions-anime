import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/ui-bits";
import { publishedArticleList } from "@/data/articles";
import { absoluteUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { Gauge, Scale, Layers } from "lucide-react";

const TITLE = "Power Scaling Hub — How GameCastle Anime Ranks Anime Strength";
const DESC =
  "GameCastle Anime power scaling: a transparent methodology for ranking anime characters by feats, ability mechanics and in-series statements — plus our flagship technique breakdowns.";
const URL = absoluteUrl("/power-scaling");
const articles = publishedArticleList();

const faqs = [
  { q: "What counts as a valid feat?", a: "An on-screen or on-page action with a clear cause and effect, shown in canon material. Databook figures and author interviews are supporting evidence, not proof, and filler is excluded unless the original creator supervised it." },
  { q: "Do you rank across different anime?", a: "Only when both series share comparable, measurable feats. Cross-franchise verdicts are labelled as speculative because power systems are written to different internal rules." },
  { q: "How do you handle hype statements?", a: "Character claims are treated as opinions held by that character. They raise a ceiling, they do not set one, and they lose to a contradicting feat every time." },
  { q: "Do you use manga material?", a: "Yes, from published chapters, and any manga-ahead detail sits behind a spoiler gate so anime-only readers can opt out." },
];

export const Route = createFileRoute("/power-scaling")({
  head: () => ({
    meta: [
      { title: `${TITLE} · GameCastle Anime` },
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
        children: JSON.stringify(breadcrumbSchema([{ path: "/", name: "Home" }, { name: "Power Scaling" }])),
      },
      { type: "application/ld+json", children: JSON.stringify(faqSchema(faqs)) },
    ],
  }),
  component: PowerScalingPage,
});

const tiers = [
  { tier: "Tier 0", label: "Reality-warping", body: "Abilities that rewrite the rules of the setting itself rather than winning inside them." },
  { tier: "Tier 1", label: "Continental", body: "Feats measured in landscapes: terrain changed, cities levelled, weather rewritten." },
  { tier: "Tier 2", label: "City-block", body: "The upper bound of most shonen finales — devastation contained to districts." },
  { tier: "Tier 3", label: "Elite human+", body: "Superhuman speed and durability with no wide-area destruction." },
];

const method = [
  { icon: Gauge, title: "Feats first", body: "We start from what a character has demonstrably done in canon, timestamped to an episode or chapter, before anyone's opinion of them enters the argument." },
  { icon: Layers, title: "Mechanics second", body: "A technique's stated rules matter as much as its output. Costs, conditions, and counters decide most matchups more than raw ceiling does." },
  { icon: Scale, title: "Context always", body: "Author intent, adaptation changes, and the internal logic of the power system frame every verdict. We say when a comparison is speculative." },
];

const featuredSlugs = [
  "gojo-satoru-limitless-technique-explained",
  "hunter-x-hunter-nen-strategy-rules",
  "solo-leveling-system-progression-explained",
  "dr-stone-science-tech-tree-guide",
];

function PowerScalingPage() {
  const featured = featuredSlugs.map((s) => articles.find((a) => a.slug === s)).filter(Boolean) as typeof articles;

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Power Scaling" }]} />
      <h1 className="font-display text-4xl lg:text-5xl font-bold">Power Scaling</h1>
      <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
        Strength arguments, done properly. We rank characters from documented feats and stated ability
        mechanics — and we show the working, so you can disagree with the reasoning rather than the vibe.
      </p>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {method.map((m) => (
          <div key={m.title} className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <m.icon className="h-5 w-5 text-primary" />
            <h2 className="mt-3 font-display text-lg font-bold">{m.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Our destruction tiers</h2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left">
              <tr>
                <th className="p-3 font-semibold">Tier</th>
                <th className="p-3 font-semibold">Scale</th>
                <th className="p-3 font-semibold">What it means</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {tiers.map((t) => (
                <tr key={t.tier} className="border-t border-border/60">
                  <td className="p-3 font-semibold text-foreground">{t.tier}</td>
                  <td className="p-3">{t.label}</td>
                  <td className="p-3">{t.body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Flagship breakdowns</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((a) => (
            <Link key={a.slug} to="/article/$slug" params={{ slug: a.slug }} className="rounded-2xl overflow-hidden border border-border/60 bg-card/40 transition-colors hover:border-primary/50">
              <div className="h-28" style={{ background: a.cover }} />
              <div className="p-5">
                <h3 className="font-display text-lg font-bold">{a.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
          <h2 className="font-display text-2xl font-bold">Method FAQ</h2>
          <dl className="mt-4 space-y-4">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
          <h2 className="font-display text-2xl font-bold">Keep reading</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/guides" className="text-primary hover:underline">All anime guides</Link> — explainers, glossaries and beginner routes</li>
            <li><Link to="/watch-order" className="text-primary hover:underline">Anime watch orders</Link> — see a power system develop in the right order</li>
            <li><Link to="/characters" className="text-primary hover:underline">Character profiles</Link> — abilities and power evolution</li>
            <li><Link to="/manga-spoilers" className="text-primary hover:underline">Manga Spoilers</Link> — feats the anime hasn't reached</li>
            <li><Link to="/anime/$slug" params={{ slug: "jujutsu-kaisen" }} className="text-primary hover:underline">Jujutsu Kaisen hub</Link> — cursed technique mechanics</li>
            <li><Link to="/top-lists" className="text-primary hover:underline">Top lists</Link> — ranked rundowns</li>
            <li><Link to="/about" className="text-primary hover:underline">About our team</Link> — who writes these verdicts</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
