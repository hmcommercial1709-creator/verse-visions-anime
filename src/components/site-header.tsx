import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Menu, X, Sparkles, Flame, Compass, Tv, BookOpen, Users, Building2, ChevronDown } from "lucide-react";
import { SearchDialog } from "./search-dialog";
import { GlobalMenu } from "./global-menu";
import { LanguageSelector } from "./language-selector";
import { useUi, type UiKey } from "@/lib/i18n-ui";

/** Mega-menu label → translation key, so top nav follows the chosen language. */
const NAV_KEYS: Record<string, UiKey> = {
  Browse: "browse",
  Genres: "genres",
  Editorial: "editorial",
  Studios: "studios",
};
import { genres } from "@/data/genres";
import { studios } from "@/data/studios";
import { animes } from "@/data/animes";

const megaGroups = [
  {
    label: "Browse",
    icon: Compass,
    columns: [
      { title: "Discovery", links: [
        { to: "/browse", label: "All Anime" },
        { to: "/explore", label: "Explore & Filter" },
        { to: "/seasonal", label: "Seasonal" },
        { to: "/trending", label: "Trending" },
        { to: "/top", label: "Top 100" },
        { to: "/top-rated", label: "Top Rated" },
        { to: "/upcoming", label: "Upcoming" },
        { to: "/new-releases", label: "New Releases" },
        { to: "/completed", label: "Completed" },
      ]},
      { title: "By format", links: [
        { to: "/classic", label: "Classic & Retro" },
        { to: "/timeline", label: "Anime Timeline" },
        { to: "/watch-order", label: "Watch Orders" },
        { to: "/genre/family", label: "Kids & Family" },
      ]},

      { title: "Popular", links: animes.slice(0, 6).map(a => ({ to: `/anime/${a.slug}`, label: a.title })) },
    ],
  },
  {
    label: "Genres",
    icon: Sparkles,
    columns: [
      { title: "Action & Adventure", links: ["action","adventure","fantasy","shonen","mecha","sci-fi"].map(s => ({ to:`/genre/${s}`, label: genres.find(g=>g.slug===s)?.name || s })) },
      { title: "Story & Feels", links: ["drama","romance","slice-of-life","comedy","family","school"].map(s => ({ to:`/genre/${s}`, label: genres.find(g=>g.slug===s)?.name || s })) },
      { title: "Dark & Cerebral", links: ["mystery","psychological","horror","supernatural","historical","isekai"].map(s => ({ to:`/genre/${s}`, label: genres.find(g=>g.slug===s)?.name || s })) },
    ],
  },
  {
    label: "Editorial",
    icon: BookOpen,
    columns: [
      { title: "News & Reviews", links: [
        { to: "/news", label: "News" },
        { to: "/reviews", label: "Reviews" },
        { to: "/top-lists", label: "Top Lists" },
        { to: "/editorial", label: "Editorial" },
        { to: "/authors", label: "Our Writers" },
      ]},
      { title: "Hubs", links: [
        { to: "/guides", label: "Anime Guides" },
        { to: "/manga-spoilers", label: "Manga Spoilers" },
        { to: "/power-scaling", label: "Power Scaling" },
        { to: "/anime/jujutsu-kaisen", label: "Jujutsu Kaisen" },
        { to: "/watch-order", label: "Watch Order" },
        { to: "/recommendations", label: "Recommendations" },
      ]},

      { title: "Must-read deep dives", links: [
        { to: "/article/why-frieren-won-2024", label: "Why Frieren Won the Year" },
        { to: "/article/review-jujutsu-kaisen-s2", label: "Jujutsu Kaisen S2 Review" },
        { to: "/article/one-piece-wano-recap", label: "The Complete Wano Recap" },
        { to: "/article/top-10-anime-2026", label: "10 Best Anime Right Now" },
        { to: "/quotes", label: "Quotes" },
        { to: "/soundtracks", label: "Soundtracks" },
      ]},
    ],
  },

  {
    label: "Studios",
    icon: Building2,
    columns: [
      { title: "Studios", links: [{ to: "/studios", label: "All Studios" }, ...studios.slice(0,5).map(s => ({ to: `/studio/${s.slug}`, label: s.name }))] },
      { title: "Streaming", links: [
        { to: "/streaming", label: "Streaming Platforms" },
        { to: "/awards", label: "Anime Awards" },
        { to: "/statistics", label: "Statistics" },
        { to: "/events", label: "Events & Cons" },
      ]},
      { title: "AnimeVerse", links: [
        { to: "/about", label: "About Us" },
        { to: "/contact", label: "Contact" },
        { to: "/editorial-policy", label: "Editorial Policy" },
        { to: "/privacy-policy", label: "Privacy Policy" },
        { to: "/terms-of-service", label: "Terms of Service" },
        { to: "/faq", label: "FAQ" },
      ]},

    ],
  },

];

/** Direct category hubs surfaced in the main navigation. */
const categoryHubs = [
  { to: "/category/action", label: "Action" },
  { to: "/category/rpg", label: "RPG" },
  { to: "/category/strategy", label: "Strategy" },
  { to: "/category/esports", label: "Esports" },
  { to: "/category/gaming-guides", label: "Gaming Guides" },
  { to: "/category/reviews", label: "Reviews" },
  { to: "/category/news", label: "News" },
  { to: "/blog", label: "All Articles" },
];


export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globalOpen, setGlobalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const t = useUi();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-md bg-background/90 border-b border-border/60"
            : "bg-background/70"
        }`}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent glow-primary">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="leading-none">
              <div className="font-display text-lg font-bold tracking-tight">
                Anime<span className="text-gradient">Verse</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">The anime authority</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {megaGroups.map((g) => (
              <button
                key={g.label}
                onMouseEnter={() => setOpenMenu(g.label)}
                onClick={() => setOpenMenu(openMenu === g.label ? null : g.label)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  openMenu === g.label ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <g.icon className="h-3.5 w-3.5" />
                {NAV_KEYS[g.label] ? t(NAV_KEYS[g.label]) : g.label}
                <ChevronDown className="h-3 w-3 opacity-70" />
              </button>
            ))}
            <Link to="/characters" className="hidden xl:flex rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Characters
            </Link>
            <Link to="/blog" className="hidden xl:flex rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 items-center gap-1.5">
              <Tv className="h-3.5 w-3.5" /> Blog
            </Link>
          </nav>


          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors min-w-[240px]"
            >
              <Search className="h-4 w-4" />
              <span>{t("search")}…</span>
              <span className="ml-auto rounded border border-border/60 px-1.5 py-0.5 text-[10px] font-mono">⌘K</span>
            </button>
            <button onClick={() => setSearchOpen(true)} className="md:hidden rounded-md p-2 text-muted-foreground hover:text-foreground">
              <Search className="h-5 w-5" />
            </button>
            <LanguageSelector variant="header" />
            <button
              onClick={() => setGlobalOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={globalOpen}
              className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">{t("menu")}</span>
            </button>
            <button className="lg:hidden rounded-md p-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(true)} aria-label="Full navigation">
              <Compass className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Category hubs + quick genre filter strip */}
        <div className="border-t border-border/40 bg-background/40">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2 lg:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categoryHubs.map((h) => (
              <Link
                key={h.to}
                to={h.to}
                className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                {h.label}
              </Link>
            ))}
            <span className="h-4 w-px shrink-0 bg-border/70" aria-hidden="true" />
            <Link
              to="/browse"
              className="shrink-0 rounded-full border border-border/60 px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              All anime
            </Link>

            {genres.slice(0, 14).map((g) => (
              <Link
                key={g.slug}
                to="/genre/$slug"
                params={{ slug: g.slug }}
                className="shrink-0 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>



        {/* Mega menu */}
        {openMenu && (
          <div className="absolute inset-x-0 top-full hidden lg:block" onMouseEnter={() => {}}>
            <div className="mx-auto max-w-7xl px-4 lg:px-6 pb-6">
              <div className="rounded-2xl border border-border/60 bg-popover shadow-2xl p-6">
                <div className="grid grid-cols-3 gap-8">
                  {megaGroups.find(g => g.label === openMenu)!.columns.map((col) => (
                    <div key={col.title}>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">{col.title}</div>
                      <ul className="space-y-1.5">
                        {col.links.map((l) => (
                          <li key={l.to}>
                            <Link
                              to={l.to}
                              onClick={() => setOpenMenu(null)}
                              className="block text-sm text-foreground/90 hover:text-primary transition-colors"
                            >
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/90" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-card border-l border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="font-display text-lg font-bold">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="rounded-md p-2"><X className="h-5 w-5" /></button>
            </div>
            <nav className="space-y-6">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Category hubs</div>
                <ul className="space-y-1.5">
                  {categoryHubs.map((h) => (
                    <li key={h.to}>
                      <Link to={h.to} onClick={() => setMobileOpen(false)} className="block py-1 text-sm font-semibold text-primary">
                        {h.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {megaGroups.map((g) => (
                <div key={g.label}>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">{g.label}</div>
                  <ul className="space-y-1.5">
                    {g.columns.flatMap(c => c.links).slice(0, 8).map((l) => (
                      <li key={l.to}>
                        <Link to={l.to} onClick={() => setMobileOpen(false)} className="block py-1 text-sm">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">About &amp; legal</div>
                <ul className="space-y-1.5">
                  {[
                    { to: "/about", label: "About Us" },
                    { to: "/contact", label: "Contact" },
                    { to: "/privacy-policy", label: "Privacy Policy" },
                    { to: "/terms-of-service", label: "Terms of Service" },
                  ].map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} onClick={() => setMobileOpen(false)} className="block py-1 text-sm">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

          </div>
        </div>
      )}

      <GlobalMenu open={globalOpen} onClose={() => setGlobalOpen(false)} />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
