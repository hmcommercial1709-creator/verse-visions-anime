import { Link } from "@tanstack/react-router";
import { BookOpen, Compass, Flame, Rss } from "lucide-react";
import { LanguageSelector } from "./language-selector";

const footerCols = [
  {
    title: "Discover",
    links: [
      { to: "/browse", label: "Browse Anime" },
      { to: "/trending", label: "Popular Anime" },
      { to: "/top-rated", label: "Top Rated" },
      { to: "/seasonal", label: "Seasonal Anime" },
      { to: "/watch-order", label: "Watch Orders" },
      { to: "/recommendations", label: "Recommendations" },
    ],
  },
  {
    title: "Genres",
    links: [
      { to: "/genre/action", label: "Action" },
      { to: "/genre/adventure", label: "Adventure" },
      { to: "/genre/romance", label: "Romance" },
      { to: "/genre/fantasy", label: "Fantasy" },
      { to: "/genre/isekai", label: "Isekai" },
      { to: "/genre/psychological", label: "Psychological" },
      { to: "/genre/slice-of-life", label: "Slice of Life" },
      { to: "/genre/sci-fi", label: "Sci-Fi" },
    ],
  },
  {
    title: "Editorial",
    links: [
      { to: "/blog", label: "All Articles" },
      { to: "/guides", label: "Anime Guides" },
      { to: "/reviews", label: "Reviews" },
      { to: "/power-scaling", label: "Power Scaling" },
      { to: "/manga-spoilers", label: "Manga Spoilers" },
      { to: "/authors", label: "Authors" },
      { to: "/editorial-policy", label: "Editorial Policy" },
    ],
  },
  {
    title: "Anime culture",
    links: [
      { to: "/characters", label: "Characters" },
      { to: "/studios", label: "Studios" },
      { to: "/quotes", label: "Quotes" },
      { to: "/facts", label: "Facts" },
      { to: "/openings", label: "Openings" },
      { to: "/soundtracks", label: "Soundtracks" },
      { to: "/store", label: "Anime Collectibles & Gaming Gear" },
      { to: "/wallpapers", label: "Artwork Gallery" },
      { to: "/streaming", label: "Legal Streaming" },
    ],
  },
  {
    title: "About & Legal",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/contact", label: "Contact" },
      { to: "/faq", label: "FAQ" },
      { to: "/privacy-policy", label: "Privacy Policy" },
      { to: "/terms-of-service", label: "Terms of Service" },
      { to: "/cookies", label: "Cookie Policy" },
      { to: "/dmca", label: "DMCA & Copyright" },
      { to: "/sitemap-page", label: "HTML Sitemap" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="mb-12 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-accent/5 to-background p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold lg:text-3xl">
                Keep exploring GameCastle Anime.
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Follow the RSS feed for every published guide, or jump straight
                into the searchable anime library.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/rss.xml"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/70 px-5 py-3 text-sm font-semibold hover:border-primary/60"
              >
                <Rss className="h-4 w-4" /> Follow RSS
              </a>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110"
              >
                <Compass className="h-4 w-4" /> Browse anime
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          <div>
            <Link
              to="/"
              aria-label="GameCastle Anime home"
              className="mb-4 flex items-center gap-2"
            >
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Flame className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">
                Game<span className="text-gradient">Castle</span> Anime
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Anime guides, watch orders and power systems — written for fans
              and edited like a magazine.
            </p>
            <div className="mt-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Language
              </p>
              <LanguageSelector variant="footer" align="start" />
            </div>
            <Link
              to="/guides"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <BookOpen className="h-4 w-4" /> Start with the guides
            </Link>
          </div>
          {footerCols.map((c) => (
            <div key={c.title}>
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {c.title}
              </div>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm text-foreground/80 hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>
            © {new Date().getFullYear()} GameCastle Anime Media. GameCastle
            Anime does not host or stream episodes. All titles and trademarks
            belong to their respective owners.
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/about" className="hover:text-primary">
              About
            </Link>
            <Link to="/contact" className="hover:text-primary">
              Contact
            </Link>
            <Link to="/privacy-policy" className="hover:text-primary">
              Privacy
            </Link>
            <Link to="/terms-of-service" className="hover:text-primary">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-primary">
              Cookies
            </Link>
            <Link to="/dmca" className="hover:text-primary">
              DMCA
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
