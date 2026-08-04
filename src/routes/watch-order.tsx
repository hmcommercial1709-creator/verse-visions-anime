import { createFileRoute, Link } from "@tanstack/react-router";
import { ListOrdered, Film, Info } from "lucide-react";
import { animes } from "@/data/animes";
import { franchises, watchOrders } from "@/data/franchises";
import { Breadcrumbs } from "@/components/ui-bits";
import { AdSlot } from "@/components/ad-slot";
import { CORNERSTONES } from "@/lib/cornerstones";
import { absoluteUrl, breadcrumbSchema, collectionSchema } from "@/lib/seo";

const TITLE = "Anime Watch Order Guide — Every Series in the Right Order";
const DESC =
  "Anime watch order guides for long-running series: season order, where the movies fit, and which stretches are filler. Franchise-by-franchise, with detailed guides for the big ones.";
const URL = absoluteUrl("/watch-order");

export const Route = createFileRoute("/watch-order")({
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
        children: JSON.stringify(
          breadcrumbSchema([{ path: "/", name: "Home" }, { name: "Watch Order" }]),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          collectionSchema({
            path: "/watch-order",
            name: "Anime Watch Order Guides",
            description: DESC,
            items: CORNERSTONES.filter((c) => c.hub === "watch-order").map((c) => ({
              path: `/article/${c.slug}`,
              name: c.anchor,
            })),
          }),
        ),
      },
    ],
  }),
  component: WatchOrderHub,
});

const AUDIENCE_LABEL: Record<string, string> = {
  beginner: "Best for first-time viewers",
  chronological: "Chronological order",
  release: "Release order",
  completionist: "Completionist order",
};

function WatchOrderHub() {
  const detailed = CORNERSTONES.filter((c) => c.hub === "watch-order");

  // Franchises that have at least one editorial watch order behind them.
  const franchiseSections = franchises
    .map((f) => ({ franchise: f, orders: watchOrders.filter((w) => w.franchiseSlug === f.slug) }))
    .filter((s) => s.orders.length > 0);

  const covered = new Set(franchiseSections.map((s) => s.franchise.slug));
  // Series with a stored order but no long-form franchise guide yet.
  const quickOrders = animes.filter((a) => a.watchOrder.length > 1 && !covered.has(a.slug));

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-6 py-10">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Watch Order" }]} />
      <h1 className="font-display text-4xl lg:text-5xl font-bold">Anime watch order guide</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Long-running anime rarely air in the order they should be watched. Movies get slotted between seasons,
        recap films duplicate episodes, and filler stretches sit in the middle of the best arcs. These are our
        watch orders: what to play, in what order, and what you can safely skip.
      </p>

      <nav aria-label="On this page" className="mt-8 rounded-2xl border border-border/60 bg-card/40 p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">On this page</div>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <li><a href="#detailed-guides" className="text-primary hover:underline">Detailed watch-order guides</a></li>
          <li><a href="#franchise-orders" className="text-primary hover:underline">Franchise watch orders</a></li>
          <li><a href="#quick-orders" className="text-primary hover:underline">Quick season orders</a></li>
          <li><a href="#how-we-build" className="text-primary hover:underline">How we build a watch order</a></li>
        </ul>
      </nav>

      <section id="detailed-guides" className="mt-14 scroll-mt-24">
        <h2 className="font-display text-2xl font-bold">Detailed watch-order guides</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          The franchises people get stuck on most often, each with a full walkthrough of season order, movie
          placement and where to continue in the manga.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {detailed.map((c) => (
            <div key={c.slug} className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <ListOrdered className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-display text-lg font-bold">
                <Link to="/article/$slug" params={{ slug: c.slug }} className="hover:text-primary">
                  {c.anchor}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
              {c.animeSlug && (
                <Link
                  to="/anime/$slug"
                  params={{ slug: c.animeSlug }}
                  className="mt-3 inline-block text-sm text-primary hover:underline"
                >
                  Series hub, arcs and characters
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <AdSlot placement="between" />

      <section id="franchise-orders" className="mt-14 scroll-mt-24">
        <h2 className="font-display text-2xl font-bold">Franchise watch orders</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Multi-entry franchises where sequels, recuts and alternate adaptations change the answer. Notes come
          from the franchise records in our library, not from guesswork.
        </p>
        <div className="mt-6 space-y-6">
          {franchiseSections.map(({ franchise, orders }) => {
            const hubEntry = franchise.entries.find((e) => e.animeSlug);
            return (
              <article key={franchise.slug} className="rounded-2xl border border-border/60 bg-card/40 p-6">
                <h3 className="font-display text-xl font-bold">{franchise.name} watch order</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{franchise.summary}</p>

                {orders.map((order) => (
                  <div key={order.slug} className="mt-5">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                      {AUDIENCE_LABEL[order.audience] ?? order.audience}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{order.summary}</p>
                    <ol className="mt-3 space-y-2">
                      {order.steps.map((step, i) => (
                        <li
                          key={step.label}
                          className="flex gap-3 rounded-lg border border-border/60 bg-background/40 p-3"
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                            {i + 1}
                          </span>
                          <span className="min-w-0">
                            <span className="font-medium">{step.label}</span>
                            {step.note && (
                              <span className="mt-0.5 block text-sm text-muted-foreground">{step.note}</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}

                {franchise.entries.some((e) => e.kind === "movie" || e.optional) && (
                  <div className="mt-5 rounded-lg border border-border/60 bg-background/40 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Film className="h-4 w-4 text-accent" /> Movies and optional entries
                    </div>
                    <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                      {franchise.entries
                        .filter((e) => e.kind === "movie" || e.optional)
                        .map((e) => (
                          <li key={e.title}>
                            <span className="text-foreground/85">{e.title}</span> ({e.year})
                            {e.optional ? " — optional" : ""}
                            {e.note ? ` · ${e.note}` : ""}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {hubEntry?.animeSlug && (
                  <Link
                    to="/anime/$slug"
                    params={{ slug: hubEntry.animeSlug }}
                    className="mt-4 inline-block text-sm text-primary hover:underline"
                  >
                    Open the {franchise.name} series hub
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section id="quick-orders" className="mt-14 scroll-mt-24">
        <h2 className="font-display text-2xl font-bold">Quick season orders</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Series with a straightforward running order. Each links through to the full hub, where the arc
          breakdown and character pages live.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {quickOrders.map((a) => (
            <div key={a.slug} className="rounded-2xl border border-border/60 bg-card/40 p-5">
              <h3 className="font-display text-lg font-bold">
                <Link to="/anime/$slug" params={{ slug: a.slug }} className="hover:text-primary">
                  {a.title}
                </Link>
              </h3>
              <ol className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {a.watchOrder.map((w: string, i: number) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-mono text-xs text-primary">{i + 1}.</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section id="how-we-build" className="mt-14 scroll-mt-24 rounded-2xl border border-border/60 bg-card/30 p-6">
        <h2 className="font-display text-2xl font-bold">How we build a watch order</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
          <li>
            <strong>Release order is the default.</strong> It is what the creators wrote for, and it keeps
            reveals in the order they were meant to land.
          </li>
          <li>
            <strong>Chronological order is offered, not pushed.</strong> Watching a prequel first usually
            spoils the reveal it was written to explain.
          </li>
          <li>
            <strong>Movies are placed, not listed.</strong> A film that recaps a season is marked as skippable;
            one that continues the plot is placed in the sequence.
          </li>
          <li>
            <strong>Filler notes stay honest.</strong> Where a filler stretch is well documented we say so,
            and we point you at a filler list rather than inventing episode numbers.
          </li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link to="/guides" className="text-primary hover:underline">All anime guides</Link>
          <Link to="/power-scaling" className="text-primary hover:underline">Power systems explained</Link>
          <Link to="/characters" className="text-primary hover:underline">Character profiles</Link>
          <Link to="/browse" className="text-primary hover:underline">Browse every series</Link>
        </div>
        <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          GameCastle Anime does not host or stream episodes. Watch-order pages link to official series hubs and
          licensed streaming services only.
        </p>
      </section>
    </div>
  );
}
