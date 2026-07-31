import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { X, Grid3x3, Zap, LinkIcon, ShieldCheck } from "lucide-react";

const SECTIONS = [
  {
    title: "Main Categories",
    icon: Grid3x3,
    links: [
      { to: "/category/action", label: "Action" },
      { to: "/category/rpg", label: "RPG" },
      { to: "/category/strategy", label: "Strategy" },
      { to: "/category/esports", label: "Esports" },
      { to: "/category/gaming-guides", label: "Gaming Guides" },
      { to: "/category/reviews", label: "Reviews" },
    ],
  },
  {
    title: "Quick Links",
    icon: Zap,
    links: [
      { to: "/", label: "Home" },
      { to: "/blog", label: "All Articles" },
    ],
  },
  {
    title: "Essential Pages",
    icon: ShieldCheck,
    links: [
      { to: "/privacy-policy", label: "Privacy Policy" },
      { to: "/contact", label: "Contact Us" },
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
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Global navigation">
      <button
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-background/95 animate-in fade-in duration-200"
      />
      <div className="relative mx-auto flex h-full max-w-6xl flex-col px-4 py-6 lg:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary">Navigation</div>
            <h2 className="truncate font-display text-2xl font-bold">Explore AnimeVerse</h2>
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
      </div>
    </div>
  );
}
