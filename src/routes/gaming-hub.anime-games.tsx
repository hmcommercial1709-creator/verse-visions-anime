import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ExternalLink,
  Gamepad2,
  Layers3,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  GamingHubPage,
  HubLinkGrid,
  SourceDisclosure,
} from "@/components/gaming-hub-components";
import { animeGames, sponsoredRel } from "@/data/gaming-hub";
import { faqSchema, gamingHubHead } from "@/lib/gaming-hub-seo";

const title = "Best Anime Games: Editions, Platforms & Safe Buying";
const description =
  "Compare popular anime games, platforms and editions, then use safe buying checks for Dragon Ball, Naruto, One Piece and other licensed anime titles.";

const faqs = [
  {
    question: "How do I choose the correct anime game edition?",
    answer:
      "Compare the exact edition name and included content on the publisher page and marketplace listing. Do not assume that Deluxe, Ultimate or season-pass content is identical across games.",
  },
  {
    question: "Can one anime game code work on every platform?",
    answer:
      "No. A PC key, PlayStation code, Xbox code and Nintendo code are distinct products. Match the platform and, where relevant, the console generation and account region.",
  },
  {
    question: "Where should I verify anime game platforms?",
    answer:
      "Use the official publisher page for supported platforms and the live marketplace page for the specific key, edition, region and seller terms.",
  },
];

export const Route = createFileRoute("/gaming-hub/anime-games")({
  head: () =>
    gamingHubHead({
      path: "/gaming-hub/anime-games",
      title,
      description,
      image: "/gaming-hub/dragon-ball-sparking-zero.webp",
      schemas: [
        {
          "@type": "ItemList",
          name: "Popular licensed anime games",
          numberOfItems: animeGames.length,
          itemListElement: animeGames.map((game, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Product",
              name: game.name,
              description: `${game.format}. ${game.buyerQuestion}`,
              image: `https://gamecastle.store${game.image}`,
              category: "Anime video game",
              url: `https://gamecastle.store/gaming-hub/anime-games#anime-game-${index + 1}`,
            },
          })),
        },
        faqSchema(faqs),
      ],
    }),
  component: AnimeGamesHub,
});

function AnimeGamesHub() {
  return (
    <GamingHubPage
      eyebrow="Licensed anime game buyer guides"
      title="Popular Anime Games: Platforms, Editions & Safe Buying"
      intro="Start with official publisher facts, compare the exact edition and platform, then open relevant marketplace results without confusing a franchise name with a compatible digital game key."
    >
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            [
              Layers3,
              "Edition-first comparison",
              "Compare base games, Deluxe bundles, season passes and DLC as different products.",
            ],
            [
              Gamepad2,
              "Platform-specific keys",
              "Steam, PlayStation, Xbox and Nintendo codes are not interchangeable.",
            ],
            [
              ShieldCheck,
              "Official facts first",
              "Use publisher pages for supported platforms and the live listing for commercial details.",
            ],
          ].map(([Icon, itemTitle, text]) => {
            const ItemIcon = Icon as typeof Layers3;
            return (
              <article
                key={itemTitle as string}
                className="rounded-2xl border border-white/10 bg-[#111827] p-6"
              >
                <ItemIcon className="h-7 w-7 text-cyan-300" />
                <h2 className="mt-5 font-display text-2xl font-black">
                  {itemTitle as string}
                </h2>
                <p className="mt-3 leading-7 text-slate-400">
                  {text as string}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e1422]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
            Officially verified titles
          </p>
          <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">
            Anime Game Edition & Platform Directory
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            These titles are linked to their official Bandai Namco pages.
            Marketplace buttons open current searches; availability, price and
            compatible regions must be verified there.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {animeGames.map((game, index) => (
              <article
                id={`anime-game-${index + 1}`}
                key={game.name}
                className="flex scroll-mt-28 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111827] transition hover:-translate-y-1 hover:border-cyan-400/40"
              >
                <img
                  src={game.image}
                  width="800"
                  height="450"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  alt={game.imageAlt}
                  className="aspect-video w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-black uppercase tracking-[.18em] text-[#f47b25]">
                    {game.format}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-black">
                    {game.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {game.platforms}
                  </p>
                  <p className="mt-4 flex-1 rounded-xl border border-cyan-400/15 bg-cyan-400/[.04] p-4 text-sm leading-6 text-slate-400">
                    {game.buyerQuestion}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={game.marketplaceUrl}
                      target="_blank"
                      rel={sponsoredRel}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#f47b25] px-4 py-2 text-sm font-black"
                    >
                      Find current listings <ExternalLink className="h-4 w-4" />
                    </a>
                    <a
                      href={game.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-2 py-2 text-sm font-bold text-cyan-300"
                    >
                      Official game page <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-7">
            <SourceDisclosure>
              Game titles, formats and platform notes come from the linked
              official publisher pages. Official artwork is locally optimized
              for performance and used to identify the referenced title.
            </SourceDisclosure>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <SearchCheck className="h-9 w-9 text-cyan-300" />
            <h2 className="mt-5 font-display text-3xl font-black">
              How to buy an anime game code safely
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              Licensed anime franchises often have multiple games, editions and
              DLC packs with similar names. Search intent must resolve to the
              exact product.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {[
              [
                "Identify the exact title",
                "Copy the full game title from the official publisher page.",
              ],
              [
                "Choose the platform",
                "Confirm PC storefront or the exact console family.",
              ],
              [
                "Compare editions",
                "List included base game, DLC, season pass and cosmetic content.",
              ],
              [
                "Check activation region",
                "Match the key restrictions with the receiving account.",
              ],
              [
                "Review language support",
                "Use the live product specification rather than guessing from region.",
              ],
              [
                "Inspect the total",
                "Compare the final price after currency and payment costs.",
              ],
            ].map(([step, text], index) => (
              <li
                key={step}
                className="rounded-2xl border border-white/10 bg-[#111827] p-5"
              >
                <span className="text-xs font-black text-[#f47b25]">
                  CHECK {index + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold">{step}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e1422]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
            Continue inside GameCastle
          </p>
          <h2 className="mt-3 font-display text-3xl font-black">
            Connect Games to Anime Guides & Collectibles
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Dragon Ball anime", "/anime/dragon-ball-super"],
              ["Naruto anime", "/anime/naruto-shippuden"],
              ["One Piece anime", "/anime/one-piece"],
              ["Anime collectibles", "/store"],
            ].map(([label, to]) => (
              <article
                key={label}
                className="rounded-2xl border border-white/10 bg-[#111827] p-5"
              >
                <Sparkles className="h-5 w-5 text-cyan-300" />
                <h3 className="mt-4 font-display text-lg font-bold">{label}</h3>
                <Link
                  to={to}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-black text-cyan-300"
                >
                  Explore <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="font-display text-3xl font-black">
          Anime Game Buying FAQ
        </h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="rounded-2xl border border-white/10 bg-[#111827] p-6"
            >
              <h3 className="font-display text-xl font-bold">{faq.question}</h3>
              <p className="mt-3 leading-7 text-slate-400">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <HubLinkGrid exclude="/gaming-hub/anime-games" />
    </GamingHubPage>
  );
}
