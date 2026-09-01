import { Link } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Grid3x3, Zap, LinkIcon, ShieldCheck } from "lucide-react";

const SECTIONS = [
  {
    title: "Anime desks",
    icon: Grid3x3,
    links: [
      { to: "/category/action", label: "Action Anime" },
      { to: "/category/fantasy", label: "Fantasy & Isekai" },
      { to: "/category/analysis", label: "Analysis & Mind Games" },
      { to: "/category/sports", label: "Sports Anime" },
      { to: "/category/anime-guides", label: "Anime Guides" },
      { to: "/category/reviews", label: "Anime Reviews" },
    ],
  },
  {
    title: "Discover",
    icon: Zap,
    links: [
      { to: "/", label: "Home" },
      { to: "/browse", label: "Browse Anime" },
      { to: "/trending", label: "Popular Anime" },
      { to: "/watch-order", label: "Watch Orders" },
      { to: "/blog", label: "All Articles" },
    ],
  },
  {
    title: "About GameCastle",
    icon: ShieldCheck,
    links: [
      { to: "/about", label: "About" },
      { to: "/editorial-policy", label: "Editorial Policy" },
      { to: "/contact", label: "Contact" },
      { to: "/privacy-policy", label: "Privacy Policy" },
    ],
  },
];

export function GlobalMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(value) => { if (!value) onClose(); }}>
      <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[60] bg-background/95" />
      <Dialog.Content aria-describedby={undefined} className="fixed inset-0 z-[60] mx-auto flex h-dvh max-w-6xl flex-col px-4 py-6 lg:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary">
              Navigation
            </div>
            <Dialog.Title className="truncate font-display text-2xl font-bold">
              Explore GameCastle Anime
            </Dialog.Title>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full border border-border/60 bg-secondary/50 p-2.5 text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid flex-1 gap-4 overflow-y-auto pb-6 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {SECTIONS.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-border/60 bg-card p-5"
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary/25 to-accent/25 text-primary">
                  <section.icon className="h-4 w-4" />
                </span>
                <h3 className="min-w-0 truncate text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-1">
                {section.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      onClick={onClose}
                      className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground/90 transition-all hover:bg-primary/10 hover:text-primary"
                    >
                      <span className="truncate">{l.label}</span>
                      <LinkIcon className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-70" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
