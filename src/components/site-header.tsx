import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Search,
  Menu,
  X,
  Sparkles,
  Flame,
  Compass,
  Tv,
  BookOpen,
  Users,
  Building2,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";
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
import { populatedGenres, populatedStudios, publishedAnime } from "@/lib/content-registry";

const navGenres = populatedGenres();
const navStudios = populatedStudios();
const navAnime = publishedAnime();
const genreLinks = (slugs: string[]) =>
  slugs
    .filter((slug) => navGenres.some((genre) => genre.slug === slug))
    .map((slug) => ({
      to: `/genre/${slug}`,
      label: navGenres.find((genre) => genre.slug === slug)?.name ?? slug,
    }));

const megaGroups = [
  {
    label: "Browse",
    icon: Compass,
    columns: [
      {
        title: "Discovery",
        links: [
          { to: "/browse", label: "All Anime" },
          { to: "/seasonal", label: "Seasonal" },
          { to: "/trending", label: "Trending" },
          { to: "/top-rated", label: "Top Rated" },
          { to: "/upcoming", label: "Upcoming" },
          { to: "/new-releases", label: "New Releases" },
          { to: "/completed", label: "Completed" },
        ],
      },
      {
        title: "By format",
        links: [
          { to: "/classic", label: "Classic & Retro" },
          { to: "/timeline", label: "Anime Timeline" },
          { to: "/watch-order", label: "Watch Orders" },
          { to: "/genre/family", label: "Kids & Family" },
        ],
      },

      {
        title: "Popular",
        links: navAnime.slice(0, 6).map((a) => ({ to: `/anime/${a.slug}`, label: a.title })),
      },
    ],
  },
  {
    label: "Genres",
    icon: Sparkles,
    columns: [
      {
        title: "Action & Adventure",
        links: genreLinks(["action", "adventure", "fantasy", "shonen", "mecha", "sci-fi"]),
      },
      {
        title: "Story & Feels",
        links: genreLinks(["drama", "romance", "slice-of-life", "comedy", "family", "school"]),
      },
      {
        title: "Dark & Cerebral",
        links: genreLinks([
          "mystery",
          "psychological",
          "horror",
          "supernatural",
          "historical",
          "isekai",
        ]),
      },
    ],
  },
  {
    label: "Editorial",
    icon: BookOpen,
    columns: [
      {
        title: "News & Reviews",
        links: [
          { to: "/reviews", label: "Reviews" },
          { to: "/top-lists", label: "Top Lists" },
          { to: "/editorial", label: "Editorial" },
          { to: "/authors", label: "Our Writers" },
        ],
      },
      {
        title: "Hubs",
        links: [
          { to: "/guides", label: "Anime Guides" },
          { to: "/manga-spoilers", label: "Manga Spoilers" },
          { to: "/power-scaling", label: "Power Scaling" },
          { to: "/anime/jujutsu-kaisen", label: "Jujutsu Kaisen" },
          { to: "/watch-order", label: "Watch Order" },
        ],
      },

      {
        title: "Must-read deep dives",
        links: [
          {
            to: "/article/gojo-satoru-limitless-technique-explained",
            label: "Gojo Limitless Explained",
          },
          {
            to: "/article/shibuya-incident-timeline",
            label: "Shibuya Incident Timeline",
          },
          {
            to: "/article/one-piece-wano-recap",
            label: "The Complete Wano Recap",
          },
          {
            to: "/article/jujutsu-kaisen-watch-order-and-manga-jump",
            label: "Jujutsu Kaisen Watch Order",
          },
          {
            to: "/article/hunter-x-hunter-nen-strategy-rules",
            label: "Hunter x Hunter Nen Guide",
          },
          {
            to: "/article/dr-stone-science-tech-tree-guide",
            label: "Dr. Stone Science Guide",
          },
        ],
      },
    ],
  },

  {
    label: "Studios",
    icon: Building2,
    columns: [
      {
        title: "Studios",
        links: [
          { to: "/studios", label: "All Studios" },
          ...navStudios.slice(0, 5).map((s) => ({ to: `/studio/${s.slug}`, label: s.name })),
        ],
      },
      {
        title: "Streaming",
        links: [
          { to: "/streaming", label: "Streaming Platforms" },
          { to: "/seasonal", label: "Seasonal Anime" },
          { to: "/upcoming", label: "Upcoming Anime" },
          { to: "/completed", label: "Completed Anime" },
        ],
      },
      {
        title: "GameCastle Anime",
        links: [
          { to: "/about", label: "About Us" },
          { to: "/contact", label: "Contact" },
          { to: "/editorial-policy", label: "Editorial Policy" },
          { to: "/privacy-policy", label: "Privacy Policy" },
          { to: "/terms-of-service", label: "Terms of Service" },
          { to: "/faq", label: "FAQ" },
        ],
      },
    ],
  },
];

/** Direct category hubs surfaced in the main navigation. */
const categoryHubs = [
  { to: "/explore", label: "Explore" },
  { to: "/store", label: "Store" },
  { to: "/rewards/anime-wallpapers", label: "🎁 Free Gift" },
  { to: "/gaming-hub", label: "Gaming Hub" },
  { to: "/guides", label: "Guides" },
  { to: "/resources", label: "Free Resources" },
  { to: "/watch-order", label: "Watch Orders" },
  { to: "/timeline", label: "Timeline" },
  { to: "/power-scaling", label: "Power Scaling" },
  { to: "/characters", label: "Characters" },
  { to: "/seasonal", label: "Seasonal" },
  { to: "/reviews", label: "Reviews" },
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
      if (e.defaultPrevented || e.isComposing || e.repeat) return;
      const target = e.target;
      if (target instanceof HTMLElement && (target.isContentEditable || target.closest("input, textarea, select, [role='textbox']"))) return;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setMobileOpen(false);
        setGlobalOpen(false);
        setOpenMenu(null);
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
          scrolled ? "bg-background/95 border-b border-border/60" : "bg-background/70"
        }`}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:gap-4 lg:px-6">
          <Link
            to="/"
            aria-label="GameCastle Anime home"
            className="flex min-w-0 shrink items-center gap-2"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent glow-primary">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0 leading-none">
              <div className="whitespace-nowrap font-display text-base font-bold tracking-tight sm:text-lg">
                Game<span className="text-gradient">Castle</span>
                <span className="hidden sm:inline"> Anime</span>
              </div>
              <div className="hidden min-[1600px]:block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Anime Guides, Watch Orders & Power Systems
              </div>
            </div>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 2xl:flex">
            {megaGroups.map((g) => (
              <button
                key={g.label}
                onMouseEnter={() => setOpenMenu(g.label)}
                onClick={() => setOpenMenu(openMenu === g.label ? null : g.label)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  openMenu === g.label
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <g.icon className="h-3.5 w-3.5" />
                {NAV_KEYS[g.label] ? t(NAV_KEYS[g.label]) : g.label}
                <ChevronDown className="h-3 w-3 opacity-70" />
              </button>
            ))}
            <Link
              to="/characters"
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 min-[1800px]:flex items-center gap-1.5"
            >
              <Users className="h-3.5 w-3.5" /> Characters
            </Link>
            <Link
              to="/blog"
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 min-[1800px]:flex items-center gap-1.5"
            >
              <Tv className="h-3.5 w-3.5" /> Blog
            </Link>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden min-w-[180px] items-center gap-2 rounded-lg border border-border/60 bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground lg:flex min-[1800px]:min-w-[240px]"
            >
              <Search className="h-4 w-4" />
              <span>{t("search")}…</span>
              <span className="ml-auto rounded border border-border/60 px-1.5 py-0.5 text-[10px] font-mono">
                ⌘K
              </span>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label={t("search")}
              className="rounded-md p-2 text-muted-foreground hover:text-foreground lg:hidden"
            >
              <Search className="h-5 w-5" />
            </button>
            <LanguageSelector variant="header" />
            <button
              onClick={() => setGlobalOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={globalOpen}
              aria-label={t("menu")}
              className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">{t("menu")}</span>
            </button>
            <button
              className="rounded-md p-2 text-muted-foreground hover:text-foreground 2xl:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Full navigation"
            >
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
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  h.to === "/store"
                    ? "inline-flex items-center gap-1.5 border-[#ff9900]/50 bg-[#ff9900]/10 text-[#ffb84d] hover:bg-[#ff9900]/20"
                    : "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                {h.to === "/store" ? (
                  <>
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>{h.label}</span>
                    <span className="rounded-full bg-[#ff9900] px-1.5 py-0.5 text-[8px] font-black leading-none text-[#111827]">
                      NEW
                    </span>
                  </>
                ) : (
                  h.label
                )}
              </Link>
            ))}
            <span className="h-4 w-px shrink-0 bg-border/70" aria-hidden="true" />
            <Link
              to="/browse"
              className="shrink-0 rounded-full border border-border/60 px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              All anime
            </Link>

            {navGenres.slice(0, 14).map((g) => (
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
          <div className="absolute inset-x-0 top-full hidden 2xl:block" onMouseEnter={() => {}}>
            <div className="mx-auto max-w-7xl px-4 lg:px-6 pb-6">
              <div className="rounded-2xl border border-border/60 bg-popover shadow-2xl p-6">
                <div className="grid grid-cols-3 gap-8">
                  {megaGroups
                    .find((g) => g.label === openMenu)!
                    .columns.map((col) => (
                      <div key={col.title}>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                          {col.title}
                        </div>
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
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-background/90" />
          <Dialog.Content aria-describedby={undefined} className="fixed right-0 top-0 z-50 h-dvh w-[86%] max-w-sm overflow-y-auto bg-card border-l border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="font-display text-lg font-bold">Menu</Dialog.Title>
              <button aria-label="Close full navigation" onClick={() => setMobileOpen(false)} className="rounded-md p-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-6">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  Category hubs
                </div>
                <ul className="space-y-1.5">
                  {categoryHubs.map((h) => (
                    <li key={h.to}>
                      <Link
                        to={h.to}
                        onClick={() => setMobileOpen(false)}
                        className="block py-1 text-sm font-semibold text-primary"
                      >
                        {h.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {megaGroups.map((g) => (
                <div key={g.label}>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                    {g.label}
                  </div>
                  <ul className="space-y-1.5">
                    {g.columns
                      .flatMap((c) => c.links)
                      .map((l) => (
                        <li key={l.to}>
                          <Link
                            to={l.to}
                            onClick={() => setMobileOpen(false)}
                            className="block py-1 text-sm"
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  About &amp; legal
                </div>
                <ul className="space-y-1.5">
                  {[
                    { to: "/about", label: "About Us" },
                    { to: "/contact", label: "Contact" },
                    { to: "/privacy-policy", label: "Privacy Policy" },
                    { to: "/terms-of-service", label: "Terms of Service" },
                  ].map((l) => (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        onClick={() => setMobileOpen(false)}
                        className="block py-1 text-sm"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <GlobalMenu open={globalOpen} onClose={() => setGlobalOpen(false)} />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
