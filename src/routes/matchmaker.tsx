import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Gamepad2, Radio, Swords, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Breadcrumbs } from "@/components/ui-bits";
import { CommunityPoll } from "@/components/community-poll";
import { QuickReactions } from "@/components/quick-reactions";
import { ParticleBurst, type BurstHandle } from "@/components/particle-burst";
import { ShareBar } from "@/components/share-bar";
import { searchCatalogByTags, type CatalogPickRow } from "@/lib/catalog/db-catalog";
import {
  MOODS,
  daySeed,
  gameTagsFor,
  matchAnime,
  matchEditorial,
  matchFranchiseGame,
  type AnimePick,
  type BundleSlot,
  type EditorialPick,
  type Mood,
} from "@/lib/matchmaker";
import { bandFor, readRank, recordAction, RANK_EVENT, type RankState } from "@/lib/battle-rank";
import { feedback, setSoundEnabled, soundEnabled } from "@/lib/hype";
import type { AnimeGame } from "@/data/gaming-hub";

const TITLE = "Mission Loadout — Your Daily Anime, Game & Lore Pack";
const DESC =
  "Pick a vibe and deploy a Daily Battle Pack: an anime we have written a guide for, a game that genuinely matches it, and the editorial to read alongside. Every pairing shows the tag it was matched on.";
const URL = "https://gamecastle.store/matchmaker";

export const Route = createFileRoute("/matchmaker")({
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
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "GameCastle Mission Loadout",
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
  component: MatchmakerPage,
});

interface Bundle {
  mood: Mood;
  anime: BundleSlot<AnimePick>;
  editorial: BundleSlot<EditorialPick>;
  franchiseGame: BundleSlot<AnimeGame>;
  catalogGame: CatalogPickRow | null;
  catalogMatchedOn: string | null;
  loadingGame: boolean;
}

function SlotShell({
  icon,
  kicker,
  children,
}: {
  icon: React.ReactNode;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-primary/25 bg-card/50 p-5 shadow-[0_0_28px_-16px_var(--primary)]">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {icon}
        {kicker}
      </p>
      {children}
    </section>
  );
}

/** "matched on X" — the line that makes a pairing checkable instead of magic. */
function MatchedOn({ tags, noun }: { tags: string[]; noun: string }) {
  if (!tags.length) return null;
  return (
    <p className="mt-3 text-xs text-muted-foreground">
      Matched on {noun}: <span className="font-semibold text-foreground">{tags.join(", ")}</span>
    </p>
  );
}

function MatchmakerPage() {
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [rank, setRank] = useState<RankState>({ points: 0, actions: {} });
  const [sound, setSound] = useState(false);
  const burst = useRef<BurstHandle>(null);

  const syncRank = useCallback(() => setRank(readRank()), []);

  useEffect(() => {
    syncRank();
    setSound(soundEnabled());
    window.addEventListener(RANK_EVENT, syncRank);
    return () => window.removeEventListener(RANK_EVENT, syncRank);
  }, [syncRank]);

  const grant = useCallback(
    (action: Parameters<typeof recordAction>[0], el?: HTMLElement | null) => {
      const { promoted } = recordAction(action);
      if (promoted) {
        // A boom and a burst are reserved for crossing a band. Firing them on
        // every tap is how an effect stops meaning anything.
        feedback("boom", [18, 40, 22]);
        burst.current?.fire(window.innerWidth / 2, window.innerHeight / 3);
      } else if (el) {
        burst.current?.fireAt(el);
      }
    },
    [],
  );

  const deploy = useCallback(
    async (mood: Mood, el: HTMLElement | null) => {
      feedback("whoosh", 16);
      const seed = daySeed();
      const anime = matchAnime(mood.tags, seed);
      const editorial = matchEditorial(anime.item, seed);
      const franchiseGame = matchFranchiseGame(anime.item);

      setBundle({
        mood,
        anime,
        editorial,
        franchiseGame,
        catalogGame: null,
        catalogMatchedOn: null,
        loadingGame: !franchiseGame.item,
      });
      grant("deploy", el);

      // Only look in the catalog when no licensed game of this series exists:
      // a game OF the anime always beats a game that shares a genre with it.
      if (franchiseGame.item) return;
      const tags = gameTagsFor(mood.tags);
      const rows = await searchCatalogByTags(tags, { entityType: "game", limit: 12 });
      const chosen = rows.length ? rows[Math.abs(seed) % rows.length] : null;
      setBundle((current) =>
        current && current.mood.id === mood.id
          ? {
              ...current,
              catalogGame: chosen,
              catalogMatchedOn: chosen?.categories?.find((c) => tags.includes(c)) ?? null,
              loadingGame: false,
            }
          : current,
      );
    },
    [grant],
  );

  const band = bandFor(rank.points);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      <ParticleBurst ref={burst} />

      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Mission Loadout" }]} />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold lg:text-5xl">Mission Loadout</h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Pick a vibe and deploy a Daily Battle Pack — an anime we have written a guide for, a
            game that genuinely matches it, and the lore to read alongside. Every slot shows the tag
            it was matched on, so you can check the pairing rather than take it on trust.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const next = !sound;
            setSoundEnabled(next);
            setSound(next);
            if (next) feedback("pop", 10);
          }}
          aria-pressed={sound}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-4 text-sm font-semibold hover:border-primary/60"
        >
          {sound ? (
            <Volume2 className="h-4 w-4" aria-hidden="true" />
          ) : (
            <VolumeX className="h-4 w-4" aria-hidden="true" />
          )}
          {sound ? "Sound on" : "Sound off"}
        </button>
      </div>

      {/* Battle rank */}
      <div className="mt-6 rounded-2xl border border-border/60 bg-card/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-lg font-bold">
            <span className="text-primary">{band.name}</span>{" "}
            <span className="text-sm font-medium text-muted-foreground">
              · {rank.points} {rank.points === 1 ? "point" : "points"}
            </span>
          </p>
          {band.next && (
            <p className="text-xs text-muted-foreground">
              {band.next.at - rank.points} to {band.next.name}
            </p>
          )}
        </div>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={rank.points}
          aria-valuemin={0}
          aria-valuemax={band.next?.at ?? rank.points}
          aria-label="Battle rank progress"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500"
            style={{
              width: `${band.next ? Math.min(100, (rank.points / band.next.at) * 100) : 100}%`,
            }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Earned by what you do here, counted in this browser. There is no leaderboard, because
          there is no shared score store to build one from.
        </p>
      </div>

      {/* Loadout picker */}
      <h2 className="mt-10 font-display text-2xl font-bold">Choose your vibe</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            type="button"
            onClick={(event) => void deploy(mood, event.currentTarget)}
            aria-pressed={bundle?.mood.id === mood.id}
            className={`min-h-11 rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
              bundle?.mood.id === mood.id
                ? "border-primary bg-primary/15 shadow-[0_0_30px_-12px_var(--primary)]"
                : "border-border/60 bg-card/40 hover:border-primary/60"
            }`}
          >
            <span className="text-2xl" aria-hidden="true">
              {mood.face}
            </span>
            <span className="mt-2 block font-display font-bold">{mood.label}</span>
            <span className="mt-1 block text-xs text-muted-foreground">{mood.blurb}</span>
          </button>
        ))}
      </div>

      {bundle && (
        <div className="mt-10 space-y-4">
          <h2 className="font-display text-2xl font-bold">
            Your Daily Battle Pack <span className="text-primary">·</span>{" "}
            <span className="text-base font-medium text-muted-foreground">{bundle.mood.label}</span>
          </h2>

          {/* Anime slot */}
          <SlotShell icon={<Swords className="h-4 w-4" aria-hidden="true" />} kicker="The mission">
            {bundle.anime.item ? (
              <>
                <h3 className="mt-2 font-display text-2xl font-bold">{bundle.anime.item.title}</h3>
                <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                  {bundle.anime.item.synopsis}
                </p>
                <MatchedOn tags={bundle.anime.allMatched ?? []} noun="genre" />
                <Link
                  to="/anime/$slug"
                  params={{ slug: bundle.anime.item.slug }}
                  onClick={() => feedback("pop", 8)}
                  className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
                >
                  Open the guide
                </Link>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">{bundle.anime.emptyReason}</p>
            )}
          </SlotShell>

          {/* Game slot */}
          <SlotShell icon={<Gamepad2 className="h-4 w-4" aria-hidden="true" />} kicker="The game">
            {bundle.franchiseGame.item ? (
              <>
                <h3 className="mt-2 font-display text-xl font-bold">
                  {bundle.franchiseGame.item.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {bundle.franchiseGame.item.format} · {bundle.franchiseGame.item.platforms}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  The licensed game of this series — the strongest pairing there is.
                </p>
                <a
                  href={bundle.franchiseGame.item.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => feedback("pop", 8)}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
                >
                  Official page
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </>
            ) : bundle.loadingGame ? (
              <p className="mt-2 text-sm text-muted-foreground">Searching the catalog…</p>
            ) : bundle.catalogGame ? (
              <>
                <h3 className="mt-2 font-display text-xl font-bold">{bundle.catalogGame.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {bundle.catalogGame.description}
                </p>
                <MatchedOn
                  tags={bundle.catalogMatchedOn ? [bundle.catalogMatchedOn] : []}
                  noun="catalog tag"
                />
                <Link
                  to="/catalog/games/$slug"
                  params={{ slug: bundle.catalogGame.slug }}
                  onClick={() => feedback("pop", 8)}
                  className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
                >
                  Open the game page
                </Link>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                {bundle.franchiseGame.emptyReason} Nothing in the catalog shares this vibe&apos;s
                tags either, so this slot stays empty rather than showing you a game that does not
                fit.
              </p>
            )}
          </SlotShell>

          {/* Editorial slot */}
          <SlotShell icon={<Radio className="h-4 w-4" aria-hidden="true" />} kicker="The lore">
            {bundle.editorial.item ? (
              <>
                <h3 className="mt-2 font-display text-xl font-bold">
                  {bundle.editorial.item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {bundle.editorial.item.excerpt}
                </p>
                {bundle.editorial.item.kind === "article" ? (
                  <Link
                    to="/article/$slug"
                    params={{ slug: bundle.editorial.item.slug }}
                    onClick={() => feedback("pop", 8)}
                    className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-primary/50 px-5 text-sm font-semibold text-primary"
                  >
                    Read it
                  </Link>
                ) : (
                  <Link
                    to="/anime/$slug/$section"
                    params={{
                      slug: bundle.editorial.item.slug,
                      section: bundle.editorial.item.section,
                    }}
                    onClick={() => feedback("pop", 8)}
                    className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-primary/50 px-5 text-sm font-semibold text-primary"
                  >
                    Read it
                  </Link>
                )}
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">{bundle.editorial.emptyReason}</p>
            )}
          </SlotShell>

          <CommunityPoll
            poll={{
              id: `pack-fit-${bundle.mood.id}`,
              question: "Does this pack hang together?",
              options: [
                { id: "yes", label: "Yes — these belong together" },
                { id: "anime-only", label: "The anime, not the rest" },
                { id: "no", label: "No, this is a mismatch" },
              ],
            }}
            onVoted={() => grant("vote")}
          />

          <QuickReactions topic={`pack-${bundle.mood.id}`} onReact={() => grant("react")} />

          <ShareBar
            url={URL}
            text={
              bundle.anime.item
                ? `My Daily Battle Pack: ${bundle.anime.item.title}${bundle.franchiseGame.item ? ` + ${bundle.franchiseGame.item.name}` : ""}`
                : "My Daily Battle Pack on GameCastle"
            }
            label="Share your pack"
          />

          <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
            <h3 className="font-display text-lg font-bold">The War Chest</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Every action here builds your rank. The Mystery Vault opens once every 24 hours and
              hands over a real file — a wallpaper that exists in this repo, not a code or a
              voucher.
            </p>
            <Link
              to="/rewards/anime-wallpapers"
              onClick={() => feedback("pop", 10)}
              className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              Open the vault
            </Link>
          </div>
        </div>
      )}

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">How the pack is built</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-foreground/85">
          <p>
            Each vibe maps to genre tags taken from the anime data itself, and the mission slot is
            whichever of our written guides shares the MOST of them — not merely one. Matching on
            any single tag put a volleyball series under &ldquo;unsettle me&rdquo; because it
            carries <em>drama</em>: technically true, and a bad recommendation.
          </p>
          <p>
            The game slot prefers the licensed game OF that series, because pairing Dragon Ball with
            its own fighting game is a recommendation while pairing it with any other action game is
            a coincidence. Only when no such game exists does it fall back to a catalog title
            sharing a tag — and when neither exists, the slot stays empty and says so. A matchmaker
            that always returns three things is a shuffler with a nicer label.
          </p>
          <p>
            The lore slot is tied to the anime already chosen rather than to the vibe, because three
            things that each fit a mood but not each other are not a bundle.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">More to do</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          <li>
            <Link to="/gamer-card" className="text-primary hover:underline">
              Build your Taste Card
            </Link>
          </li>
          <li>
            <Link to="/character-quiz" className="text-primary hover:underline">
              Which character are you?
            </Link>
          </li>
          <li>
            <Link to="/my-list" className="text-primary hover:underline">
              Your watchlist
            </Link>
          </li>
          <li>
            <Link to="/anime" className="text-primary hover:underline">
              Browse every guide
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
