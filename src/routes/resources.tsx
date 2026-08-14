import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock3, Download, FileText, Image as ImageIcon, Table2 } from "lucide-react";
import DownloadBanner from "@/components/DownloadBanner";
import EmailSignup from "@/components/EmailSignup";
import WhereToBuy, { type RetailerLink } from "@/components/WhereToBuy";
import { Breadcrumbs } from "@/components/ui-bits";
import { absoluteUrl, breadcrumbSchema, collectionSchema } from "@/lib/seo";

const PAGE_PATH = "/resources";
const TITLE = "Free Anime Watchlist & Tracker | GameCastle";
const DESCRIPTION =
  "Download a free 23-title anime watchlist PDF, editable episode tracker CSV and high-resolution starter-picks infographic from GameCastle Anime.";
const OG_IMAGE = absoluteUrl("/downloads/top-50-anime-infographic.png");

const resources = [
  {
    title: "Anime Starter Watchlist 2026",
    description:
      "A 15-page, spoiler-light roadmap built from 23 real titles in the GameCastle catalog, with genres, episode counts and concise overviews.",
    href: "/downloads/ultimate-anime-watchlist-2026.pdf",
    format: "PDF",
    detail: "15 pages",
    icon: FileText,
  },
  {
    title: "Editable Anime Tracker",
    description:
      "A clean CSV prefilled with the same 23 titles and columns for watched episodes, status, dates, personal ratings and notes.",
    href: "/downloads/anime-tracker-template.csv",
    format: "CSV",
    detail: "23 prefilled titles",
    icon: Table2,
  },
  {
    title: "23 Must-Watch Starter Picks",
    description:
      "A high-resolution visual snapshot ordered by GameCastle editorial rating. Ratings are editorial scores, not live third-party rankings.",
    href: "/downloads/top-50-anime-infographic.png",
    format: "PNG",
    detail: "1800 × 3200",
    icon: ImageIcon,
    preview: "/downloads/top-50-anime-infographic.png",
  },
] as const;

const partnerLinks: RetailerLink[] = [
  {
    name: "Amazon anime figure pick",
    url: "https://amzn.to/4wqhuYD",
    note: "Open the Amazon listing and verify the seller, current price and delivery region.",
    accent: "#ffb347",
  },
  {
    name: "Play-Asia gaming pick",
    url: "https://www.play-asia.com/ar/like-a-dragon-gaiden-the-man-who-erased-his-name-multi-language/13/70gpd7?affiliate_id=6821075",
    note: "Open the Play-Asia listing and confirm the platform, language and region before buying.",
    accent: "#56d9d1",
  },
];

const plannedResources = [
  {
    title: "Seasonal anime calendar",
    description: "A release-planning tool based only on verified seasonal schedule data.",
  },
  {
    title: "Collector budget planner",
    description: "A practical sheet for tracking merchandise budgets and purchase dates.",
  },
  {
    title: "Personal tier-list worksheet",
    description: "A reusable worksheet for recording your own rankings without fabricated votes.",
  },
];

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl(PAGE_PATH) },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1800" },
      { property: "og:image:height", content: "3200" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: absoluteUrl(PAGE_PATH) }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([{ path: "/", name: "Home" }, { name: "Free Anime Resources" }]),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          collectionSchema({
            path: PAGE_PATH,
            name: "Free Anime Resources",
            description: DESCRIPTION,
            items: resources.map((resource) => ({
              path: resource.href,
              name: resource.title,
            })),
          }),
        ),
      },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  return (
    <div>
      <header className="border-b border-border/60 bg-gradient-to-br from-primary/15 via-background to-accent/10">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
          <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Free Resources" }]} />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            GameCastle download library
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Free anime watchlist, tracker and starter-picks guide
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Download practical resources made from GameCastle's published anime catalog. Every
            listed file is available now, contains real catalog data and opens without an email
            gate.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-foreground/80">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" /> 3 verified files
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" /> No broken buttons
            </span>
          </div>
        </div>
      </header>

      <DownloadBanner />

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <section aria-labelledby="available-downloads">
          <h2 id="available-downloads" className="font-display text-3xl font-bold sm:text-4xl">
            Available downloads
          </h2>
          <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">
            The watchlist and infographic use a catalog snapshot dated August 14, 2026. Ongoing
            episode totals can change, so verify current information before planning a long series.
          </p>

          <div className="mt-7 grid gap-6 lg:grid-cols-3">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <article
                  key={resource.href}
                  className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/40"
                >
                  {"preview" in resource ? (
                    <div className="aspect-[16/9] overflow-hidden border-b border-border/70 bg-[#0f0f1a]">
                      <img
                        src={resource.preview}
                        alt="Preview of the GameCastle 23 must-watch anime starter picks infographic"
                        width={1800}
                        height={3200}
                        loading="lazy"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div className="grid aspect-[16/9] place-items-center border-b border-border/70 bg-gradient-to-br from-primary/15 to-accent/10">
                      <Icon className="h-14 w-14 text-primary" aria-hidden="true" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                        FREE · {resource.format}
                      </span>
                      <span className="text-xs text-muted-foreground">{resource.detail}</span>
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold">{resource.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {resource.description}
                    </p>
                    <a
                      href={resource.href}
                      download
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground hover:brightness-110"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Download {resource.format}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="use-resources">
          <h2 id="use-resources" className="font-display text-3xl font-bold">
            How to use the free anime resources
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              [
                "1",
                "Choose a starting point",
                "Use the PDF roadmap to match a title to your preferred genre and time commitment.",
              ],
              [
                "2",
                "Track your progress",
                "Open the CSV in your preferred spreadsheet tool and record episodes, dates and your own rating.",
              ],
              [
                "3",
                "Explore the full guide",
                "Continue to GameCastle's anime and editorial pages for watch orders, characters and related titles.",
              ],
            ].map(([step, title, copy]) => (
              <article key={step} className="rounded-2xl border border-border/70 bg-card/30 p-6">
                <span className="text-sm font-bold text-primary">STEP {step}</span>
                <h3 className="mt-2 font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
          <Link
            to="/browse"
            className="mt-5 inline-flex items-center font-semibold text-primary hover:underline"
          >
            Browse every published anime page →
          </Link>
        </section>

        <div className="mt-14">
          <EmailSignup />
        </div>

        <div className="mt-14">
          <WhereToBuy links={partnerLinks} />
        </div>

        <section className="mt-14" aria-labelledby="planned-resources">
          <div className="flex items-center gap-3">
            <Clock3 className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 id="planned-resources" className="font-display text-3xl font-bold">
              Planned resources
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            These ideas are not downloadable yet, so they are labeled clearly and contain no dead
            notification buttons.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {plannedResources.map((resource) => (
              <article
                key={resource.title}
                className="rounded-2xl border border-dashed border-border bg-card/20 p-6"
              >
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Planned
                </span>
                <h3 className="mt-3 font-display text-xl font-bold">{resource.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {resource.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
