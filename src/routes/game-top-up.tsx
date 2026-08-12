import { createFileRoute, Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  Bolt,
  ExternalLink,
  Gamepad2,
  Globe2,
  ShieldCheck,
  Sparkles,
  WalletCards,
  Zap,
} from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

const title = "Game Top Up - Instant Digital Game Credits Recharge";
const description =
  "Recharge PUBG, Free Fire, Roblox, Fortnite and more games instantly with secure digital top-up services.";

const GAMIVO_TOP_UP_URL = "https://www.gamivo.com/direct-top-ups";
const secureExternalRel = "nofollow noopener noreferrer";

type Service = {
  name: string;
  category: "Direct top-up" | "Gift card";
  description: string;
  href: string;
  glyph: string;
  visual: string;
  icon: LucideIcon;
};

const services: Service[] = [
  {
    name: "PUBG Mobile",
    category: "Direct top-up",
    description: "Choose PUBG Mobile UC options and confirm the correct account and region on GAMIVO.",
    href: "https://www.gamivo.com/direct-top-ups/pubg-mobile",
    glyph: "PUBG",
    visual: "linear-gradient(135deg, #db8c1f 0%, #7c2d12 52%, #1e1e1e 100%)",
    icon: Gamepad2,
  },
  {
    name: "Free Fire",
    category: "Direct top-up",
    description: "Browse Free Fire top-up choices, then review delivery and activation details on GAMIVO.",
    href: "https://www.gamivo.com/direct-top-ups/free-fire",
    glyph: "FF",
    visual: "linear-gradient(135deg, #f59e0b 0%, #b91c1c 52%, #1e1e1e 100%)",
    icon: Bolt,
  },
  {
    name: "Fortnite",
    category: "Gift card",
    description: "Explore Fortnite digital credit listings and verify the platform, value and region before purchase.",
    href: "https://www.gamivo.com/search/fortnite",
    glyph: "FN",
    visual: "linear-gradient(135deg, #4f46e5 0%, #7e22ce 52%, #1e1e1e 100%)",
    icon: Sparkles,
  },
  {
    name: "Roblox",
    category: "Gift card",
    description: "Compare Roblox gift card offers and continue to the matching regional listing on GAMIVO.",
    href: "https://www.gamivo.com/store/gift-cards/roblox",
    glyph: "RBLX",
    visual: "linear-gradient(135deg, #ef4444 0%, #374151 52%, #111827 100%)",
    icon: WalletCards,
  },
  {
    name: "Valorant",
    category: "Direct top-up",
    description: "Find Valorant top-up options and check account, currency and regional requirements on GAMIVO.",
    href: "https://www.gamivo.com/direct-top-ups/valorant",
    glyph: "V",
    visual: "linear-gradient(135deg, #fb7185 0%, #881337 52%, #1e1e1e 100%)",
    icon: Zap,
  },
  {
    name: "League of Legends",
    category: "Direct top-up",
    description: "Browse GAMIVO's current top-up catalog and select a League of Legends offer for your region.",
    href: GAMIVO_TOP_UP_URL,
    glyph: "LoL",
    visual: "linear-gradient(135deg, #0e7490 0%, #164e63 52%, #1e1e1e 100%)",
    icon: Sparkles,
  },
  {
    name: "Mobile Legends",
    category: "Direct top-up",
    description: "View Mobile Legends: Bang Bang diamond options and confirm player details on GAMIVO.",
    href: "https://www.gamivo.com/direct-top-ups/mobile-legends-bang-bang",
    glyph: "MLBB",
    visual: "linear-gradient(135deg, #2563eb 0%, #312e81 52%, #1e1e1e 100%)",
    icon: Gamepad2,
  },
  {
    name: "Steam Wallet",
    category: "Gift card",
    description: "Compare Steam Wallet gift cards by currency and region before continuing to GAMIVO checkout.",
    href: "https://www.gamivo.com/store/gift-cards/steam",
    glyph: "STEAM",
    visual: "linear-gradient(135deg, #0891b2 0%, #0f172a 58%, #1e1e1e 100%)",
    icon: WalletCards,
  },
  {
    name: "PlayStation Store",
    category: "Gift card",
    description: "Find PlayStation Store credit and select the correct account country and denomination on GAMIVO.",
    href: "https://www.gamivo.com/store/gift-cards/psn",
    glyph: "PS",
    visual: "linear-gradient(135deg, #2563eb 0%, #172554 58%, #1e1e1e 100%)",
    icon: WalletCards,
  },
  {
    name: "Xbox Gift Cards",
    category: "Gift card",
    description: "Browse Xbox gift card listings and verify platform, currency and activation region on GAMIVO.",
    href: "https://www.gamivo.com/store/gift-cards/xbox-live",
    glyph: "XBOX",
    visual: "linear-gradient(135deg, #16a34a 0%, #14532d 58%, #1e1e1e 100%)",
    icon: WalletCards,
  },
  {
    name: "Nintendo eShop",
    category: "Gift card",
    description: "Choose Nintendo eShop credit for the correct store region and continue securely to GAMIVO.",
    href: "https://www.gamivo.com/store/gift-cards/nintendo",
    glyph: "N",
    visual: "linear-gradient(135deg, #ef4444 0%, #7f1d1d 58%, #1e1e1e 100%)",
    icon: WalletCards,
  },
];

const trustItems: Array<{ icon: LucideIcon; title: string; text: string }> = [
  {
    icon: Bolt,
    title: "Instant Digital Delivery",
    text: "Delivery methods and estimated timing are displayed by GAMIVO for each selected offer.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    text: "Selection, payment and account handling take place on GAMIVO, not on GameCastle.",
  },
  {
    icon: Globe2,
    title: "Worldwide Gaming Services",
    text: "Browse global and regional offers, then verify local availability before completing an order.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Gaming Marketplace",
    text: "Every action button leads directly to a relevant page on the GAMIVO marketplace.",
  },
];

export const Route = createFileRoute("/game-top-up")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/game-top-up") },
      {
        property: "og:image",
        content: absoluteUrl("/gamivo/direct-top-ups-hero.webp"),
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      {
        name: "twitter:image",
        content: absoluteUrl("/gamivo/direct-top-ups-hero.webp"),
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/game-top-up") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url: absoluteUrl("/game-top-up"),
          isPartOf: { "@id": `${absoluteUrl("/")}#website` },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: absoluteUrl("/"),
              },
              { "@type": "ListItem", position: 2, name: "Instant Game Top Up" },
            ],
          },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: services.length,
            itemListElement: services.map((service, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: service.name,
              url: service.href,
            })),
          },
        }),
      },
    ],
  }),
  component: GameTopUpPage,
});

function GameTopUpPage() {
  return (
    <div className="gamivo-page min-h-screen overflow-x-clip bg-[#1e1e1e] text-white">
      <style>{`
        @font-face {
          font-family: "Gamivo Roboto";
          src: url("/gamivo/Roboto-Regular.ttf") format("truetype");
          font-display: swap;
          font-weight: 400;
        }
        @font-face {
          font-family: "Gamivo Montserrat";
          src: url("/gamivo/Montserrat-ExtraBold.ttf") format("truetype");
          font-display: swap;
          font-weight: 800;
        }
        .gamivo-page { font-family: "Gamivo Roboto", Roboto, system-ui, sans-serif; }
        .gamivo-page h1,
        .gamivo-page h2,
        .gamivo-page h3,
        .gamivo-heading { font-family: "Gamivo Montserrat", Montserrat, system-ui, sans-serif; }
      `}</style>

      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-20 bg-[#1e1e1e]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(244,123,37,.24),transparent_34%),radial-gradient(circle_at_82%_25%,rgba(126,34,206,.25),transparent_38%)]" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:grid lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:gap-12 lg:pb-24 lg:pt-16">
          <div className="relative z-10">
            <Link
              to="/store"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#e5e5e5] transition hover:text-[#f47b25]"
            >
              <ArrowRight className="h-4 w-4 rotate-180" /> Back to GameCastle Store
            </Link>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#f47b25]/40 bg-[#f47b25]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f47b25]">
              <Zap className="h-4 w-4" /> Instant Game Top Up
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
              Instant Game Top Up &amp; Digital Credits
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#e5e5e5] sm:text-lg">
              Recharge your favorite games quickly with secure digital top-ups from trusted gaming services.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={GAMIVO_TOP_UP_URL}
                target="_blank"
                rel={secureExternalRel}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f47b25] px-6 py-3 font-extrabold text-white shadow-[0_12px_34px_rgba(244,123,37,.28)] transition hover:-translate-y-0.5 hover:bg-[#dd3b10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47b25] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1e1e]"
              >
                Start Recharge <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="#recharge-services"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/[.04] px-6 py-3 font-bold text-white transition hover:border-[#f47b25]/70 hover:bg-[#f47b25]/10"
              >
                Browse services
              </a>
            </div>
            <p className="mt-5 max-w-xl text-xs leading-5 text-[#a7a7a7]">
              Independent GameCastle discovery page. Product selection, payment, delivery and support are completed on GAMIVO. Check platform, account region and activation rules before purchase.
            </p>
          </div>

          <div className="relative mt-10 lg:mt-0">
            <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-[#f47b25]/15 blur-3xl" />
            <a
              href={GAMIVO_TOP_UP_URL}
              target="_blank"
              rel={secureExternalRel}
              aria-label="View game top-up offers on GAMIVO"
              className="group block overflow-hidden rounded-3xl border border-white/10 bg-[#2f2f2f] p-2 shadow-2xl shadow-black/40"
            >
              <img
                src="/gamivo/direct-top-ups-hero.webp"
                width="1200"
                height="630"
                alt="GAMIVO direct game top-up offers"
                fetchPriority="high"
                className="aspect-[40/21] w-full rounded-[1.15rem] object-cover transition duration-500 group-hover:scale-[1.015]"
              />
            </a>
            <div className="mx-auto -mt-5 flex w-[88%] items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#2f2f2f]/95 px-5 py-4 shadow-xl backdrop-blur">
              <img
                src="/gamivo/gamivo-logo.svg"
                width="180"
                height="45"
                alt="GAMIVO"
                className="h-auto w-28 sm:w-36"
              />
              <span className="text-right text-xs leading-5 text-[#a7a7a7]">
                External marketplace checkout
              </span>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Service benefits" className="border-b border-white/10 bg-[#252525]">
        <div className="mx-auto grid max-w-7xl gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ icon: Icon, title: itemTitle, text }) => (
            <article key={itemTitle} className="bg-[#252525] px-5 py-7 sm:px-6">
              <Icon className="h-6 w-6 text-[#f47b25]" aria-hidden="true" />
              <h2 className="mt-4 text-base font-extrabold">{itemTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-[#a7a7a7]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <div id="recharge-services" className="scroll-mt-24">
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f47b25]">
                Choose your destination
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Popular Game Top-Ups &amp; Digital Credit
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#a7a7a7]">
                Select a game or platform below. GameCastle does not collect game IDs or payment details; the button takes you to the matching GAMIVO page.
              </p>
            </div>
            <a
              href={GAMIVO_TOP_UP_URL}
              target="_blank"
              rel={secureExternalRel}
              className="inline-flex shrink-0 items-center gap-2 font-bold text-[#f47b25] hover:text-[#ff9a51]"
            >
              View all GAMIVO top-ups <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.name} service={service} />
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#252525]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f47b25]">
                  Three clear steps
                </p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                  Recharge without an extra checkout
                </h2>
                <p className="mt-4 leading-7 text-[#a7a7a7]">
                  GameCastle helps you find the correct destination. GAMIVO handles the offer details and transaction.
                </p>
              </div>
              <ol className="grid gap-4 sm:grid-cols-3">
                {[
                  ["01", "Choose a service", "Pick the game, wallet or platform you need."],
                  ["02", "Verify the details", "On GAMIVO, check region, platform, value and activation method."],
                  ["03", "Complete on GAMIVO", "Use the marketplace checkout and follow its delivery instructions."],
                ].map(([number, stepTitle, text]) => (
                  <li key={number} className="rounded-2xl border border-white/10 bg-[#1e1e1e] p-5">
                    <span className="text-sm font-extrabold text-[#f47b25]">{number}</span>
                    <h3 className="mt-5 text-lg font-extrabold">{stepTitle}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#a7a7a7]">{text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="relative overflow-hidden rounded-3xl border border-[#f47b25]/40 bg-[#2f2f2f] p-7 sm:p-10 lg:p-12">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_100%_50%,rgba(244,123,37,.28),transparent_68%)]" />
            <div className="relative max-w-3xl">
              <img
                src="/gamivo/gamivo-logo.svg"
                width="180"
                height="45"
                alt="GAMIVO"
                loading="lazy"
                className="h-auto w-32"
              />
              <h2 className="mt-7 text-3xl font-extrabold sm:text-4xl">
                Ready to find your game credit?
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#e5e5e5]">
                Open GAMIVO's current direct top-up catalog to see available games, regions, denominations and delivery details.
              </p>
              <a
                href={GAMIVO_TOP_UP_URL}
                target="_blank"
                rel={secureExternalRel}
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f47b25] px-6 py-3 font-extrabold text-white transition hover:bg-[#dd3b10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47b25]"
              >
                Start Recharge <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <p className="mt-8 text-center text-xs leading-5 text-[#a7a7a7]">
            Affiliate disclosure: GameCastle may earn a commission when visitors use qualifying outbound links. GAMIVO controls product availability, prices, payment, delivery, returns and customer support.
          </p>
        </section>
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  const buttonLabel = service.category === "Direct top-up" ? "Recharge on GAMIVO" : "Buy on GAMIVO";

  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#2f2f2f] shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-[#f47b25]/70 hover:shadow-[0_18px_45px_rgba(0,0,0,.35)]">
      <div
        role="img"
        aria-label={`${service.name} digital credit artwork`}
        className="relative aspect-[16/9] overflow-hidden"
        style={{ background: service.visual }}
      >
        <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border-[22px] border-white/10 transition duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,.08)_35%,rgba(255,255,255,.08)_42%,transparent_42%)]" />
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
          <span className="gamivo-heading text-3xl font-extrabold tracking-tight text-white drop-shadow-lg">
            {service.glyph}
          </span>
          <span className="rounded-xl border border-white/20 bg-black/25 p-2.5 backdrop-blur-sm">
            <Icon className="h-6 w-6 text-white" aria-hidden="true" />
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#f47b25]">
          {service.category}
        </p>
        <h3 className="mt-2 text-xl font-extrabold leading-tight">{service.name}</h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-[#a7a7a7]">{service.description}</p>
        <a
          href={service.href}
          target="_blank"
          rel={secureExternalRel}
          aria-label={`${buttonLabel}: ${service.name}`}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#f47b25] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#dd3b10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47b25]"
        >
          {buttonLabel} <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
