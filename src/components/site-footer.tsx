import { Link } from "@tanstack/react-router";
import { Flame, Twitter, Youtube, Twitch, Rss } from "lucide-react";

const footerCols = [
  { title: "Discover", links: [
    { to: "/browse", label: "Browse Anime" },
    { to: "/trending", label: "Trending" },
    { to: "/top", label: "Top 100" },
    { to: "/upcoming", label: "Upcoming" },
    { to: "/new-releases", label: "New Releases" },
    { to: "/completed", label: "Completed" },
    { to: "/timeline", label: "Anime Timeline" },
    { to: "/watch-order", label: "Watch Order" },
  ]},
  { title: "Genres", links: [
    { to: "/genre/action", label: "Action" },
    { to: "/genre/adventure", label: "Adventure" },
    { to: "/genre/romance", label: "Romance" },
    { to: "/genre/fantasy", label: "Fantasy" },
    { to: "/genre/isekai", label: "Isekai" },
    { to: "/genre/psychological", label: "Psychological" },
    { to: "/genre/slice-of-life", label: "Slice of Life" },
    { to: "/genre/sci-fi", label: "Sci-Fi" },
  ]},
  { title: "Editorial", links: [
    { to: "/news", label: "News" },
    { to: "/reviews", label: "Reviews" },
    { to: "/top-lists", label: "Top Lists" },
    { to: "/guides", label: "Guides" },
    { to: "/editorial", label: "Editorial" },
    { to: "/authors", label: "Authors" },
    { to: "/editorial-policy", label: "Editorial Policy" },
  ]},
  { title: "Culture", links: [
    { to: "/quotes", label: "Quotes" },
    { to: "/facts", label: "Facts" },
    { to: "/openings", label: "Openings" },
    { to: "/soundtracks", label: "Soundtracks" },
    { to: "/wallpapers", label: "Wallpapers" },
    { to: "/merch", label: "Merchandise" },
    { to: "/events", label: "Events" },
    { to: "/streaming", label: "Streaming" },
  ]},
  { title: "About & Legal", links: [
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
    { to: "/faq", label: "FAQ" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms of Service" },
    { to: "/cookies", label: "Cookie Policy" },
    { to: "/dmca", label: "DMCA & Copyright" },
    { to: "/sitemap-page", label: "HTML Sitemap" },
  ]},

];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/60">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-14">
        {/* CTA */}
        <div className="mb-12 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-accent/5 to-background p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] items-center">
            <div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold">Get the AnimeVerse Weekly Brief.</h3>
              <p className="mt-2 text-muted-foreground max-w-2xl">
                One email every Friday. New releases, quiet gems the algorithm misses, and the review our editors are arguing about that week.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-2 sm:min-w-[380px]">
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="flex-1 rounded-lg border border-border bg-input/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-primary hover:brightness-110">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Flame className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">Anime<span className="text-gradient">Verse</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The independent home for anime reviews, guides, and culture. Written by fans, edited like a magazine.
            </p>
            <div className="mt-4 flex gap-2 text-muted-foreground">
              <a href="#" aria-label="Twitter" className="rounded-md p-2 hover:bg-secondary hover:text-foreground"><Twitter className="h-4 w-4" /></a>
              <a href="#" aria-label="YouTube" className="rounded-md p-2 hover:bg-secondary hover:text-foreground"><Youtube className="h-4 w-4" /></a>
              <a href="#" aria-label="Twitch" className="rounded-md p-2 hover:bg-secondary hover:text-foreground"><Twitch className="h-4 w-4" /></a>
              <a href="/rss.xml" aria-label="RSS" className="rounded-md p-2 hover:bg-secondary hover:text-foreground"><Rss className="h-4 w-4" /></a>
            </div>
          </div>
          {footerCols.map((c) => (
            <div key={c.title}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">{c.title}</div>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-foreground/80 hover:text-primary">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} AnimeVerse Media. All illustrations, titles, and trademarks belong to their respective owners.</div>
          <div className="flex gap-4">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/cookies">Cookies</Link>
            <Link to="/dmca">DMCA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
