import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Gamepad2,
  Headphones,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";
import { StoreProductGrid } from "@/components/store-product-card";
import { storeCategories, storeProducts, storeRetailer } from "@/data/store-products";
import { absoluteUrl, breadcrumbSchema, collectionSchema } from "@/lib/seo";

const title = "Anime Collectibles, Games & Gaming Gear Store | GameCastle";
const description =
  "Explore GameCastle's curated anime figures, Japanese music, PlayStation and PC games, Nintendo collectibles, controllers and gaming gear through Amazon and Play-Asia.";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/store") },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/store") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          collectionSchema({
            path: "/store",
            name: "GameCastle Anime, Games & Collectibles Store",
            description,
            items: storeProducts.map((product) => ({
              path: `/store/${product.slug}`,
              name: product.shortTitle,
            })),
          }),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([{ path: "/", name: "Home" }, { name: "Store" }]),
        ),
      },
    ],
  }),
  component: Storefront,
});

function Storefront() {
  const animeFigures = storeProducts.filter(
    (product) => product.collection === "Anime Collectibles",
  );
  const gamingGear = storeProducts.filter(
    (product) => product.collection === "Gaming Gear",
  );
  const playAsiaProducts = storeProducts.filter(
    (product) => storeRetailer(product) === "Play-Asia",
  );
  const featuredFigures = animeFigures
    .filter((product) => product.featured)
    .slice(0, 4);
  const featuredPicks = [
    storeProducts[2],
    storeProducts[3],
    storeProducts[5],
    storeProducts[6],
  ];
  const newArrivals = storeProducts
    .filter((product) => product.newArrival)
    .slice(-8);

  return (
    <div className="pb-12">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(236,72,153,.22),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(34,211,238,.18),transparent_35%),linear-gradient(135deg,rgba(15,10,35,.98),rgba(7,18,30,.98))]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.3fr_.7fr] lg:items-center lg:px-6 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <Store className="h-3.5 w-3.5" /> GameCastle Store
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Anime collectibles, Japanese media and games.{" "}
              <span className="text-gradient">
                One curated store, two trusted retailers.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Browse anime figures, Japanese CDs and vinyl, physical and
              digital games, Nintendo collectibles, controllers and setup
              accessories. Every purchase continues securely on Amazon or
              Play-Asia.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#featured-anime-figures"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground glow-primary"
              >
                <Sparkles className="h-4 w-4" /> Shop anime collectibles
              </a>
              <a
                href="#new-from-play-asia"
                className="inline-flex items-center gap-2 rounded-xl border border-sky-400/50 bg-sky-400/10 px-5 py-3 font-bold text-sky-300"
              >
                <Gamepad2 className="h-4 w-4" /> New from Play-Asia
              </a>
              <a
                href="#trending-gaming-gear"
                className="inline-flex items-center gap-2 rounded-xl border border-accent/50 bg-accent/10 px-5 py-3 font-bold text-accent"
              >
                <Headphones className="h-4 w-4" /> Explore gaming gear
              </a>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <TrustCard
              icon={ShieldCheck}
              title="Trusted partner checkout"
              text="Orders, payment, delivery and applicable returns are handled by Amazon, Play-Asia and their selected sellers."
            />
            <TrustCard
              icon={Headphones}
              title="Curated, not crowded"
              text="A focused catalog with clear categories, useful descriptions and no invented ratings or prices."
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <section className="mt-10 rounded-2xl border border-[#ff9900]/30 bg-[#ff9900]/5 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Affiliate disclosure:</strong>{" "}
          GameCastle may earn a commission from qualifying purchases made
          through Amazon or Play-Asia links. Prices, stock, delivery and
          regional availability are controlled by each retailer and may change.
        </section>

        <nav
          aria-label="Store quick links"
          className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {[
            { href: "#featured-anime-figures", label: "Anime figures" },
            { href: "#new-from-play-asia", label: "New from Play-Asia" },
            { href: "#trending-gaming-gear", label: "Gaming gear" },
            { href: "#japanese-music", label: "Japanese music" },
            { href: "#playstation-games", label: "PlayStation games" },
            { href: "#nintendo-collectibles", label: "Nintendo collectibles" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-xs font-bold text-foreground/85 transition hover:border-primary/60 hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <section id="popular-anime-collections" className="scroll-mt-32 py-14">
          <SectionHeading
            eyebrow="Shop by category"
            title="Shop Every GameCastle Collection"
            description="Jump directly to anime figures, games, Japanese music, Nintendo collectibles or setup gear. Only categories with listed products are linked."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {storeCategories.map((category) => (
              <article
                key={category.name}
                className="rounded-2xl border border-border/60 bg-card/60 p-6"
              >
                <h3 className="font-display text-2xl font-bold">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {category.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {category.children.map((child) => (
                    <a
                      key={child}
                      href={`#${slugify(child)}`}
                      className="rounded-full border border-border/60 bg-background/50 px-3 py-1.5 text-xs font-semibold text-foreground/85 transition hover:border-primary/60 hover:text-primary"
                    >
                      {child}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <StoreSection
          id="featured-anime-figures"
          eyebrow="Display-ready picks"
          title="Featured Anime Figures"
          description="Character-focused collectibles selected for Demon Slayer, Jujutsu Kaisen, One Piece and My Dress-Up Darling shelves."
          products={featuredFigures}
        />
        <StoreSection
          id="trending-gaming-gear"
          eyebrow="Setup upgrades"
          title="Trending Gaming Gear"
          description="Headsets, controllers and charging accessories from Amazon and Play-Asia."
          products={gamingGear}
        />
        <StoreSection
          id="new-from-play-asia"
          eyebrow="New affiliate partner"
          title="New from Play-Asia"
          description="Eight verified games, Japanese music releases, Nintendo accessories and collectibles with direct Play-Asia affiliate links."
          products={playAsiaProducts}
        />
        <StoreSection
          id="featured-picks"
          eyebrow="GameCastle selection"
          title="Featured Picks"
          description="A focused set of products selected for prominent placement in the GameCastle store. Check the retailer for live stock and price."
          products={featuredPicks}
        />
        <StoreSection
          id="new-arrivals"
          eyebrow="Just added"
          title="New Arrivals"
          description="The eight latest products added to the GameCastle affiliate catalog."
          products={newArrivals}
        />

        {storeCategories
          .flatMap((category) => category.children)
          .map((categoryName) => {
            const products = storeProducts.filter((product) =>
              product.categories.includes(categoryName),
            );
            if (products.length === 0) return null;
            return (
              <StoreSection
                key={categoryName}
                id={slugify(categoryName)}
                eyebrow="Browse collection"
                title={categoryName}
                description={`Explore every ${categoryName.toLowerCase()} product currently listed by GameCastle.`}
                products={products}
              />
            );
          })}

        <section className="mt-10 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/70 to-accent/10 p-7 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Keep exploring
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold">
            Know the series behind the shelf.
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Move from collectibles to GameCastle's anime guides, watch orders
            and character analysis without leaving the platform.
          </p>
          <Link
            to="/browse"
            className="mt-5 inline-flex items-center gap-2 font-bold text-primary hover:underline"
          >
            Browse the anime library <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
        {title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
}

function StoreSection({
  id,
  eyebrow,
  title,
  description,
  products,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  products: typeof storeProducts;
}) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-border/50 py-14">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <StoreProductGrid products={products} />
    </section>
  );
}

function TrustCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof ShieldCheck;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[.045] p-5 shadow-xl shadow-black/10">
      <Icon className="h-6 w-6 text-accent" />
      <h2 className="mt-3 font-display text-lg font-bold text-white">
        {title}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-slate-300">{text}</p>
    </div>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
