import { createFileRoute, Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  ExternalLink,
  Gamepad2,
  Globe2,
  Languages,
  MapPinCheck,
  ShieldCheck,
  Sparkles,
  WalletCards,
  Zap,
} from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

const title = "Gaming Gift Cards & Digital Codes | GameCastle";
const description =
  "Compare Steam, PlayStation, Xbox, Nintendo, Roblox and Fortnite gift cards, then buy digital codes securely on GAMIVO through GameCastle.";
const pagePath = "/gaming-gift-cards";
const pageUrl = absoluteUrl(pagePath);
const heroImage = absoluteUrl("/gamivo/direct-top-ups-hero.webp");
const GAMIVO_AFFILIATE_ID = "gkphy5wy";
const secureExternalRel = "sponsored nofollow noopener noreferrer";

function gamivoAffiliateUrl(url: string) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}glv=${GAMIVO_AFFILIATE_ID}`;
}

const allGiftCardsUrl = gamivoAffiliateUrl(
  "https://www.gamivo.com/store/gift-cards",
);

type GiftCard = {
  slug: string;
  name: string;
  shortName: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  icon: LucideIcon;
};

const giftCards: GiftCard[] = [
  {
    slug: "steam-wallet-gift-cards",
    name: "Steam Wallet Gift Cards",
    shortName: "Steam Wallet",
    brand: "Steam",
    category: "PC gaming credit",
    description:
      "Compare Steam Wallet digital code listings by currency and activation region before continuing to the marketplace.",
    image: "/gamivo/cards/steam.webp",
    imageAlt: "Steam Wallet gift card digital code",
    href: gamivoAffiliateUrl("https://www.gamivo.com/store/gift-cards/steam"),
    icon: WalletCards,
  },
  {
    slug: "playstation-store-gift-cards",
    name: "PlayStation Store Gift Cards",
    shortName: "PlayStation Store",
    brand: "PlayStation",
    category: "Console store credit",
    description:
      "Find PlayStation Store credit for the correct account country, currency and denomination before purchase.",
    image: "/gamivo/cards/playstation.webp",
    imageAlt: "PlayStation Store gift card digital code",
    href: gamivoAffiliateUrl("https://www.gamivo.com/store/gift-cards/psn"),
    icon: Gamepad2,
  },
  {
    slug: "xbox-gift-cards",
    name: "Xbox Gift Cards",
    shortName: "Xbox",
    brand: "Xbox",
    category: "Console store credit",
    description:
      "Browse Xbox digital gift card listings and verify the platform, currency and activation territory on GAMIVO.",
    image: "/gamivo/cards/xbox.svg",
    imageAlt: "Xbox gift card digital store credit",
    href: gamivoAffiliateUrl(
      "https://www.gamivo.com/store/gift-cards/xbox-live",
    ),
    icon: Gamepad2,
  },
  {
    slug: "nintendo-eshop-gift-cards",
    name: "Nintendo eShop Gift Cards",
    shortName: "Nintendo eShop",
    brand: "Nintendo",
    category: "Console store credit",
    description:
      "Choose Nintendo eShop credit that matches the country and currency configured on the receiving Nintendo account.",
    image: "/gamivo/cards/nintendo.webp",
    imageAlt: "Nintendo eShop gift card digital code",
    href: gamivoAffiliateUrl(
      "https://www.gamivo.com/store/gift-cards/nintendo",
    ),
    icon: Gamepad2,
  },
  {
    slug: "roblox-gift-cards",
    name: "Roblox Gift Cards",
    shortName: "Roblox",
    brand: "Roblox",
    category: "Gaming gift card",
    description:
      "Compare Roblox gift card listings and confirm the applicable currency, region and redemption details before checkout.",
    image: "/gamivo/cards/roblox.webp",
    imageAlt: "Roblox gift card digital code",
    href: gamivoAffiliateUrl("https://www.gamivo.com/store/gift-cards/roblox"),
    icon: WalletCards,
  },
  {
    slug: "fortnite-digital-credit",
    name: "Fortnite Digital Credit",
    shortName: "Fortnite",
    brand: "Fortnite",
    category: "Game content and credit",
    description:
      "Explore current Fortnite digital listings and verify the game platform, region and included content on GAMIVO.",
    image: "/gamivo/cards/fortnite.webp",
    imageAlt: "Fortnite digital game credit listing",
    href: gamivoAffiliateUrl("https://www.gamivo.com/search/fortnite"),
    icon: Sparkles,
  },
  {
    slug: "league-of-legends-riot-points",
    name: "League of Legends Riot Points",
    shortName: "League of Legends",
    brand: "League of Legends",
    category: "PC game credit",
    description:
      "Review League of Legends Riot Points options and confirm the correct server, account and regional requirements.",
    image: "/gamivo/cards/league-of-legends.webp",
    imageAlt: "League of Legends Riot Points digital credit",
    href: gamivoAffiliateUrl(
      "https://www.gamivo.com/direct-top-ups/league-of-legends-pc-id",
    ),
    icon: Zap,
  },
];

const faqItems = [
  {
    question: "Are gaming gift cards region locked?",
    answer:
      "Some digital codes work only with accounts, stores or currencies from a specific country or region. Read the product page and activation restrictions on GAMIVO before purchasing.",
  },
  {
    question: "Does GameCastle process the gift card payment?",
    answer:
      "No. GameCastle is an independent discovery page. Product selection, payment, code delivery, returns and customer support are handled by GAMIVO and the seller shown there.",
  },
  {
    question: "How do I choose the correct digital code?",
    answer:
      "Match the code's platform, currency and activation country to the recipient account. Check the live listing because availability and redemption conditions can change.",
  },
];

export const Route = createFileRoute("/gaming-gift-cards")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: pageUrl },
      { property: "og:image", content: heroImage },
      {
        property: "og:image:alt",
        content: "Gaming gift cards and digital game credit on GAMIVO",
      },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: heroImage },
      {
        name: "twitter:image:alt",
        content: "Gaming gift cards and digital game credit on GAMIVO",
      },
    ],
    links: [
      { rel: "canonical", href: pageUrl },
      { rel: "alternate", hrefLang: "en", href: pageUrl },
      { rel: "alternate", hrefLang: "x-default", href: pageUrl },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${pageUrl}#page`,
              url: pageUrl,
              name: title,
              headline: "Gaming Gift Cards & Digital Codes",
              description,
              inLanguage: "en",
              primaryImageOfPage: {
                "@type": "ImageObject",
                url: heroImage,
                width: 1200,
                height: 630,
              },
              isPartOf: { "@id": `${absoluteUrl("/")}#website` },
              publisher: { "@id": `${absoluteUrl("/")}#organization` },
              breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
              mainEntity: { "@id": `${pageUrl}#gift-card-list` },
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${pageUrl}#breadcrumb`,
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: absoluteUrl("/"),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Store",
                  item: absoluteUrl("/store"),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Gaming Gift Cards",
                  item: pageUrl,
                },
              ],
            },
            {
              "@type": "ItemList",
              "@id": `${pageUrl}#gift-card-list`,
              name: "Gaming gift cards and digital codes",
              numberOfItems: giftCards.length,
              itemListElement: giftCards.map((card, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Product",
                  "@id": `${pageUrl}#${card.slug}`,
                  name: card.name,
                  description: card.description,
                  category: card.category,
                  image: absoluteUrl(card.image),
                  brand: { "@type": "Brand", name: card.brand },
                  url: `${pageUrl}#${card.slug}`,
                },
              })),
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }),
      },
    ],
  }),
  component: GamingGiftCardsPage,
});

function GamingGiftCardsPage() {
  return (
    <div className="gamivo-gift-page min-h-screen overflow-x-clip bg-[#1e1e1e] text-white">
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
        .gamivo-gift-page { font-family: "Gamivo Roboto", Roboto, system-ui, sans-serif; }
        .gamivo-gift-page h1,
        .gamivo-gift-page h2,
        .gamivo-gift-page h3,
        .gamivo-gift-heading { font-family: "Gamivo Montserrat", Montserrat, system-ui, sans-serif; }
      `}</style>

      <header className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-20 bg-[#1e1e1e]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_16%,rgba(244,123,37,.26),transparent_33%),radial-gradient(circle_at_84%_18%,rgba(37,99,235,.25),transparent_38%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-9 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:pb-24 lg:pt-16">
          <div>
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-sm text-[#a7a7a7]"
            >
              <Link to="/" className="transition hover:text-[#f47b25]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link to="/store" className="transition hover:text-[#f47b25]">
                Store
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-[#e5e5e5]">
                Gaming Gift Cards
              </span>
            </nav>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#f47b25]/40 bg-[#f47b25]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f47b25]">
              <WalletCards className="h-4 w-4" /> Global digital credit guide
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
              Gaming Gift Cards &amp; Digital Codes
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#e5e5e5] sm:text-lg">
              Compare popular PC, console and game credit options, check
              regional requirements, and continue to matching GAMIVO listings.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={allGiftCardsUrl}
                target="_blank"
                rel={secureExternalRel}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f47b25] px-6 py-3 font-extrabold text-white shadow-[0_12px_34px_rgba(244,123,37,.28)] transition hover:-translate-y-0.5 hover:bg-[#dd3b10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47b25]"
              >
                Browse gift cards on GAMIVO <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="#gift-card-directory"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/[.04] px-6 py-3 font-bold transition hover:border-[#f47b25]/70 hover:bg-[#f47b25]/10"
              >
                Compare platforms
              </a>
            </div>
            <p className="mt-5 max-w-xl text-xs leading-5 text-[#a7a7a7]">
              Affiliate disclosure: GameCastle may earn a commission from
              qualifying outbound visits. GAMIVO controls prices, stock,
              payment, delivery, refunds and customer support.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-[#f47b25]/15 blur-3xl" />
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#2f2f2f] p-3 shadow-2xl shadow-black/40">
              <div className="mb-3 flex items-center justify-between gap-4 px-2 py-1">
                <img
                  src="/gamivo/gamivo-logo.svg"
                  width="180"
                  height="45"
                  alt="GAMIVO"
                  className="h-auto w-32"
                />
                <span className="text-xs text-[#a7a7a7]">
                  Regional codes &amp; digital credit
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-2xl">
                {giftCards.slice(0, 4).map((card, index) => (
                  <a
                    key={card.slug}
                    href={card.href}
                    target="_blank"
                    rel={secureExternalRel}
                    aria-label={`View ${card.name} on GAMIVO`}
                    className="group relative block overflow-hidden bg-[#111]"
                  >
                    <img
                      src={card.image}
                      width="342"
                      height="240"
                      alt={card.imageAlt}
                      loading="eager"
                      decoding="async"
                      fetchPriority={index === 0 ? "high" : "auto"}
                      className="aspect-[342/240] h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-3 pb-3 pt-8 text-sm font-extrabold">
                      {card.shortName}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section
        aria-labelledby="gift-card-benefits"
        className="border-b border-white/10 bg-[#252525]"
      >
        <h2 id="gift-card-benefits" className="sr-only">
          Why use the GameCastle gift card directory
        </h2>
        <div className="mx-auto grid max-w-7xl gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              Globe2,
              "Global marketplace",
              "Compare international and regional listings in one marketplace.",
            ],
            [
              MapPinCheck,
              "Region checks",
              "Review country, currency and account restrictions before purchase.",
            ],
            [
              ShieldCheck,
              "Marketplace checkout",
              "Payments and digital delivery are completed securely on GAMIVO.",
            ],
            [
              BadgeCheck,
              "Clear destinations",
              "Each card links to the closest relevant GAMIVO catalog page.",
            ],
          ].map(([Icon, itemTitle, text]) => {
            const BenefitIcon = Icon as LucideIcon;
            return (
              <article
                key={itemTitle as string}
                className="bg-[#252525] px-5 py-7 sm:px-6"
              >
                <BenefitIcon
                  className="h-6 w-6 text-[#f47b25]"
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-base font-extrabold">
                  {itemTitle as string}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#a7a7a7]">
                  {text as string}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="gift-card-directory" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f47b25]">
                Choose your platform
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Popular Gaming Gift Cards Worldwide
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#a7a7a7]">
                Use these cards to reach relevant digital-code listings. Always
                verify the live product title, platform, currency and activation
                region on GAMIVO.
              </p>
            </div>
            <a
              href={allGiftCardsUrl}
              target="_blank"
              rel={secureExternalRel}
              className="inline-flex shrink-0 items-center gap-2 font-bold text-[#f47b25] hover:text-[#ff9a51]"
            >
              View all gaming gift cards <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {giftCards.map((card) => (
              <GiftCardCard key={card.slug} card={card} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#252525]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f47b25]">
              Buy the correct code
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              How to check a regional gaming gift card
            </h2>
            <p className="mt-4 leading-7 text-[#a7a7a7]">
              Digital codes can have platform and country restrictions. These
              three checks help reduce activation problems without making
              assumptions about a live listing.
            </p>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              [
                "01",
                "Match the platform",
                "Confirm that the code is for the exact PC, console or game account that will redeem it.",
              ],
              [
                "02",
                "Match country and currency",
                "Compare the account country with the region and currency stated in the live product description.",
              ],
              [
                "03",
                "Read activation details",
                "Review redemption steps, delivery method and any account requirements before checkout.",
              ],
            ].map(([number, stepTitle, text]) => (
              <article
                key={number}
                className="rounded-2xl border border-white/10 bg-[#1e1e1e] p-6"
              >
                <span className="text-sm font-extrabold text-[#f47b25]">
                  {number}
                </span>
                <h3 className="mt-5 text-xl font-extrabold">{stepTitle}</h3>
                <p className="mt-3 text-sm leading-6 text-[#a7a7a7]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <div className="inline-flex items-center gap-2 text-[#f47b25]">
              <Languages className="h-5 w-5" /> Global buyer guide
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
              Gaming gift card FAQ
            </h2>
            <p className="mt-4 leading-7 text-[#a7a7a7]">
              Straight answers for international shoppers comparing digital game
              codes.
            </p>
          </div>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <article
                key={item.question}
                className="rounded-2xl border border-white/10 bg-[#252525] p-6"
              >
                <h3 className="text-lg font-extrabold">{item.question}</h3>
                <p className="mt-3 leading-7 text-[#a7a7a7]">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#252525]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="relative overflow-hidden rounded-3xl border border-[#f47b25]/40 bg-[#1e1e1e] p-7 sm:p-10">
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
                Ready to compare digital game credit?
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#e5e5e5]">
                Browse current GAMIVO gift card listings, then verify the exact
                platform, region and redemption requirements shown there.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={allGiftCardsUrl}
                  target="_blank"
                  rel={secureExternalRel}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#f47b25] px-6 py-3 font-extrabold transition hover:bg-[#dd3b10]"
                >
                  Browse GAMIVO gift cards <ExternalLink className="h-4 w-4" />
                </a>
                <Link
                  to="/game-top-up"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/20 px-6 py-3 font-bold transition hover:border-[#f47b25]/70 hover:bg-[#f47b25]/10"
                >
                  Explore direct game top-ups <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/store"
                  className="inline-flex min-h-12 items-center gap-2 px-2 py-3 font-bold text-[#f47b25] hover:text-[#ff9a51]"
                >
                  Visit the GameCastle store <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function GiftCardCard({ card }: { card: GiftCard }) {
  const Icon = card.icon;
  return (
    <article
      id={card.slug}
      className="group flex scroll-mt-28 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#2f2f2f] shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-[#f47b25]/70 hover:shadow-[0_18px_45px_rgba(0,0,0,.35)]"
    >
      <div className="relative aspect-[342/240] overflow-hidden bg-[#111]">
        <img
          src={card.image}
          alt={card.imageAlt}
          width="342"
          height="240"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
        <span className="absolute bottom-4 right-4 rounded-xl border border-white/20 bg-black/45 p-2.5 shadow-lg backdrop-blur-sm">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#f47b25]">
          {card.category}
        </p>
        <h3 className="mt-2 text-xl font-extrabold leading-tight">
          {card.name}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-[#a7a7a7]">
          {card.description}
        </p>
        <a
          href={card.href}
          target="_blank"
          rel={secureExternalRel}
          aria-label={`View ${card.name} on GAMIVO`}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#f47b25] px-4 py-2.5 text-sm font-extrabold transition hover:bg-[#dd3b10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47b25]"
        >
          View on GAMIVO <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
