import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import { Breadcrumbs } from "@/components/ui-bits";
import { TasteCardTool } from "@/components/taste-card-tool";
import { MAX_PICKS, MIN_PICKS } from "@/lib/gamer-card";

const TITLE = "Anime Taste Card — Build and Download a Shareable Card of Your Picks";
const DESC =
  "Pick three to six anime, manga or games from the GameCastle catalog and get a card that states what your picks actually have in common — signature genre, range, focus — then download it as a PNG or share the link.";
const URL = "https://gamecastle.store/gamer-card";

/** Comma-separated slugs in the URL, bounded and cleaned. */
function parsePicks(raw: unknown): string[] {
  if (typeof raw !== "string" || !raw) return [];
  return (
    raw
      .split(",")
      .map((part) => part.trim().toLowerCase())
      // Slugs only: anything else in this parameter is either a typo or someone
      // probing, and neither should reach a database query.
      .filter((part) => /^[a-z0-9][a-z0-9-]{0,120}$/.test(part))
      .slice(0, MAX_PICKS)
  );
}

export const Route = createFileRoute("/gamer-card")({
  validateSearch: (search: Record<string, unknown>): { picks?: string } => {
    const picks = parsePicks(search.picks);
    return picks.length ? { picks: picks.join(",") } : {};
  },
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
    // One canonical, with no query string. The picks parameter produces an
    // unbounded number of URLs for one page, and every one of them would be a
    // near-duplicate competing with the others; the canonical collapses them
    // back to the single page that should be indexed.
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "GameCastle Anime Taste Card",
          url: URL,
          applicationCategory: "EntertainmentApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript",
          description: DESC,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: {
            "@type": "Organization",
            name: "GameCastle Anime",
            url: "https://gamecastle.store/",
          },
        }),
      },
    ],
  }),
  component: GamerCardPage,
});

function GamerCardPage() {
  const { picks } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  // Mirror the picks into the URL so the card is a link someone can send.
  // replace, not push: otherwise every keystroke of picking buries the back
  // button under a dozen states of a half-built card.
  const onPicksChange = useCallback(
    (slugs: string[]) => {
      const next = slugs.join(",");
      navigate({
        search: next ? { picks: next } : {},
        replace: true,
      });
    },
    [navigate],
  );

  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-6 py-12">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Taste Card" }]} />

      <h1 className="font-display text-4xl lg:text-5xl font-bold">Your Anime Taste Card</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Pick {MIN_PICKS}–{MAX_PICKS} titles from our catalog and this builds a card that says what
        those picks have in common — your signature genre, how far you range, how concentrated your
        taste is. Download it as an image, or copy the link and let someone else open the same card.
      </p>

      <div className="mt-8">
        <TasteCardTool initialSlugs={picks ? picks.split(",") : []} onPicksChange={onPicksChange} />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">How the card is calculated</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-foreground/85">
          <p>
            Every line on the card comes from the genre tags on the titles you picked, and nothing
            else. There is no personality quiz behind it and no scoring table: if your six picks
            carry eleven distinct genre tags between them, the card says eleven, because that is
            what is there.
          </p>
          <p>
            <strong>Signature genre</strong> is simply the genre tag that appears on the most of
            your picks, and the card prints the count alongside it so you can check the claim.{" "}
            <strong>Range</strong> is how many distinct genres your picks cover in total.{" "}
            <strong>Focus</strong> is the share of all your genre mentions taken by that top genre:
            100% means every pick shares one genre, and a low number means your picks have little in
            common with each other.
          </p>
          <p>
            <strong>Shape</strong> reads those two numbers back in plain words. What it deliberately
            does not do is tell you that you are rarer than 92% of viewers. Nothing here knows what
            anyone else picked, so that number would be invented — and a made-up statistic is worse
            than no statistic, because you would have no way to tell. Where the picks do not support
            a statement, the card leaves the statement out.
          </p>
          <p>
            Below three picks there is no pattern to describe at all, which is why the card waits
            until you have three.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">What you can do with it</h2>
        <ul className="mt-4 space-y-3 text-foreground/85 leading-relaxed">
          <li>
            <strong>Download it.</strong> The card saves as a 1200×630 PNG — the same shape as a
            link preview, so it posts to X, Discord or WhatsApp without being recropped.
          </li>
          <li>
            <strong>Share the link.</strong> Your picks are stored in the URL itself, so anyone who
            opens your link sees the same card built from the same titles.
          </li>
          <li>
            <strong>Follow your own picks.</strong> Each title on the card links to its catalog page
            here, with the details, tags and related titles for it.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Where to find more</h2>
        <p className="mt-4 leading-relaxed text-foreground/85">
          If the card gave you a genre to chase, these are the places to go next.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          <li>
            <Link to="/catalog/anime" className="text-neon hover:underline">
              Browse the anime catalog
            </Link>
          </li>
          <li>
            <Link to="/catalog/games" className="text-neon hover:underline">
              Browse the games catalog
            </Link>
          </li>
          <li>
            <Link to="/explore" className="text-neon hover:underline">
              Explore by theme
            </Link>
          </li>
          <li>
            <Link to="/watch-order" className="text-neon hover:underline">
              Watch orders and viewing guides
            </Link>
          </li>
          <li>
            <Link to="/trending" className="text-neon hover:underline">
              What is trending right now
            </Link>
          </li>
          <li>
            <Link to="/recommendations" className="text-neon hover:underline">
              Recommendations
            </Link>
          </li>
        </ul>
      </section>

      <p className="mt-10 text-sm text-muted-foreground">
        Your picks are not tied to an account and no profile is kept of them. The lookup that finds
        a title runs against our public catalog, the card itself is drawn in your browser, and the
        only lasting record of it is the link you choose to share.
      </p>
    </div>
  );
}
