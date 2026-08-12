import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";
import {
  GamingHubPage,
  HubLinkGrid,
  PlatformGrid,
  SourceDisclosure,
} from "@/components/gaming-hub-components";
import { hubLinks, platformGuides } from "@/data/gaming-hub";
import { gamingHubHead } from "@/lib/gaming-hub-seo";

const title = "Gaming Hub: Game Codes, Deals & Gift Card Guides";
const description =
  "Research game codes, digital gift cards, account regions, currency conversion and safe game credit buying in GameCastle's global gaming hub.";

export const Route = createFileRoute("/gaming-hub/")({
  head: () =>
    gamingHubHead({
      path: "/gaming-hub",
      title,
      description,
      schemas: [
        {
          "@type": "ItemList",
          name: "GameCastle Gaming Resource Center",
          numberOfItems: hubLinks.length - 1,
          itemListElement: hubLinks.slice(1).map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            url: `https://gamecastle.store${item.to}`,
          })),
        },
      ],
    }),
  component: GamingHubIndex,
});

function GamingHubIndex() {
  return (
    <GamingHubPage
      eyebrow="Global gaming resource center"
      title="Game Codes, Gift Cards, Regions & Safe Digital Credit"
      intro="Use one structured resource center to compare gaming gift cards, understand country restrictions, estimate currency conversion, evaluate anime game editions and reach current marketplace listings."
    >
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            {
              icon: SearchCheck,
              title: "No invented deal claims",
              text: "The hub links to current marketplace catalogs but never fabricates active coupon codes, stock levels or percentage discounts.",
            },
            {
              icon: ShieldCheck,
              title: "Official regional rules",
              text: "Platform restrictions are summarized from official Steam, PlayStation, Xbox, Nintendo, Roblox and PUBG support resources.",
            },
            {
              icon: Calculator,
              title: "Transparent calculations",
              text: "The currency tool uses values you enter, so it never presents a stale exchange rate as live financial data.",
            },
          ].map(({ icon: Icon, title: itemTitle, text }) => (
            <article
              key={itemTitle}
              className="rounded-2xl border border-white/10 bg-[#111827] p-6"
            >
              <Icon className="h-7 w-7 text-cyan-300" />
              <h2 className="mt-5 font-display text-2xl font-black">
                {itemTitle}
              </h2>
              <p className="mt-3 leading-7 text-slate-400">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e1422]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
            Start with your platform
          </p>
          <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">
            Digital Gift Card Region Checks
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            Each platform handles account countries and digital codes
            differently. Open the official support link before using a
            marketplace listing.
          </p>
          <div className="mt-9">
            <PlatformGrid platforms={platformGuides} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div>
            <BadgeCheck className="h-8 w-8 text-[#f47b25]" />
            <h2 className="mt-5 font-display text-3xl font-black">
              How this gaming hub turns research into action
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              Information pages answer the question first. Contextual links then
              lead to the exact GameCastle comparison page or the closest
              relevant live GAMIVO catalog.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3">
            {[
              [
                "01",
                "Choose a guide",
                "Start with deals, regions, safe credit or anime games.",
              ],
              [
                "02",
                "Verify compatibility",
                "Match account country, currency, platform and edition.",
              ],
              [
                "03",
                "Open current listings",
                "Review live price and seller details on GAMIVO before payment.",
              ],
            ].map(([number, step, text]) => (
              <li
                key={number}
                className="rounded-2xl border border-white/10 bg-[#111827] p-5"
              >
                <span className="font-black text-[#f47b25]">{number}</span>
                <h3 className="mt-5 font-display text-lg font-bold">{step}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-10">
          <SourceDisclosure>
            Platform facts are linked to official publisher support. Marketplace
            buttons are affiliate links and current commercial details must be
            checked on the destination page.
          </SourceDisclosure>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/gaming-hub/safe-game-credits-guide"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-black text-[#07111d]"
          >
            Start the safety checklist <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/gaming-hub/region-currency-guide"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-bold"
          >
            Open the currency calculator <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <HubLinkGrid exclude="/gaming-hub" />
    </GamingHubPage>
  );
}
