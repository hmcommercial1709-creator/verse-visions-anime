import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BadgePercent,
  Clock3,
  ExternalLink,
  SearchCheck,
} from "lucide-react";
import {
  GamingHubPage,
  HubLinkGrid,
  PlatformGrid,
  SourceDisclosure,
} from "@/components/gaming-hub-components";
import { gamivoUrl, platformGuides, sponsoredRel } from "@/data/gaming-hub";
import { faqSchema, gamingHubHead } from "@/lib/gaming-hub-seo";

const title = "Game Codes & Deals Hub | Digital Gaming Offers";
const description =
  "Find current game code, gift card and digital credit destinations for Steam, PlayStation, Xbox, Nintendo, Roblox and PUBG without fake promo codes.";

const faqs = [
  {
    question: "Does GameCastle publish active coupon codes?",
    answer:
      "GameCastle does not label a coupon as active unless a verifiable current source provides it. This page links to live marketplace catalogs where price and promotion details can be checked directly.",
  },
  {
    question: "Why can the final game code price change?",
    answer:
      "Digital product price, seller availability, taxes, payment fees, currency conversion and regional eligibility can change. The live marketplace page is the authoritative commercial source.",
  },
  {
    question: "What should I compare before buying a game deal?",
    answer:
      "Compare the exact product title, platform, edition, activation region, currency, delivery method, seller terms and total checkout cost.",
  },
];

export const Route = createFileRoute("/gaming-hub/game-codes-deals")({
  head: () =>
    gamingHubHead({
      path: "/gaming-hub/game-codes-deals",
      title,
      description,
      schemas: [
        {
          "@type": "ItemList",
          name: "Gaming gift card and digital code destinations",
          numberOfItems: platformGuides.length,
          itemListElement: platformGuides.map((platform, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: platform.name,
            description: platform.summary,
            image: `https://gamecastle.store${platform.image}`,
            url: `https://gamecastle.store/gaming-hub/game-codes-deals#${platform.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          })),
        },
        faqSchema(faqs),
      ],
    }),
  component: GameCodesDealsHub,
});

function GameCodesDealsHub() {
  return (
    <GamingHubPage
      eyebrow="Live catalog destinations"
      title="Global Game Codes, Gift Cards & Deal-Finding Hub"
      intro="Reach current digital gaming catalogs for major platforms, then use a disciplined comparison process to separate a genuine compatible offer from an attractive but unusable code."
    >
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            [
              SearchCheck,
              "Live listing over copied price",
              "Open the destination to verify today's product, seller, stock and total cost.",
            ],
            [
              BadgePercent,
              "Discount evidence required",
              "A crossed-out price or coupon should be visible and applicable on the live marketplace page.",
            ],
            [
              Clock3,
              "Time-sensitive by nature",
              "Promotions can end by inventory, date, region or seller, so static savings claims age quickly.",
            ],
          ].map(([Icon, itemTitle, text]) => {
            const ItemIcon = Icon as typeof SearchCheck;
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

        <div className="mt-10">
          <SourceDisclosure>
            This page is a discovery index, not a promise that every linked
            listing is discounted. It intentionally avoids fabricated “working
            codes” and stale copied prices.
          </SourceDisclosure>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e1422]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
            Platform directories
          </p>
          <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">
            Browse Current Digital Gaming Categories
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            Each card combines a relevant marketplace destination with an
            official help link for redemption or account-region questions.
          </p>
          <div className="mt-9">
            <PlatformGrid platforms={platformGuides} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <AlertTriangle className="h-8 w-8 text-amber-300" />
            <h2 className="mt-5 font-display text-3xl font-black">
              Seven checks for any “cheap game code” result
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              A low headline price has little value if the code is for the wrong
              platform, edition or country.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {[
              [
                "Exact title",
                "Match the complete title, not only the franchise name.",
              ],
              [
                "Platform",
                "Confirm Steam, PlayStation, Xbox, Nintendo or account top-up.",
              ],
              [
                "Edition",
                "Check Standard, Deluxe, Ultimate, DLC or wallet credit.",
              ],
              [
                "Region",
                "Read activation countries and account-region requirements.",
              ],
              ["Currency", "Estimate conversion and payment-provider costs."],
              [
                "Delivery",
                "Review delivery method and any identity or account steps.",
              ],
              [
                "Final total",
                "Judge the checkout total, not the first number shown.",
              ],
              [
                "Support path",
                "Know which marketplace or platform handles a failed activation.",
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
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-black">
            High-intent game deal paths
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["PC game codes", "/search/pc-games"],
              ["PlayStation games", "/search/playstation"],
              ["Xbox games", "/search/xbox"],
              ["Nintendo games", "/search/nintendo"],
            ].map(([label, path]) => (
              <article
                key={label}
                className="rounded-2xl border border-white/10 bg-[#111827] p-5"
              >
                <h3 className="font-display text-xl font-bold">{label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Open the live search, then filter by platform, region and
                  edition.
                </p>
                <a
                  href={gamivoUrl(path)}
                  target="_blank"
                  rel={sponsoredRel}
                  className="mt-5 inline-flex items-center gap-2 font-black text-[#f47b25]"
                >
                  View current listings <ExternalLink className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
          <Link
            to="/gaming-hub/safe-game-credits-guide"
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 font-black text-cyan-200"
          >
            Use the complete buying checklist <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="font-display text-3xl font-black">
          Game Code Deals FAQ
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

      <HubLinkGrid exclude="/gaming-hub/game-codes-deals" />
    </GamingHubPage>
  );
}
