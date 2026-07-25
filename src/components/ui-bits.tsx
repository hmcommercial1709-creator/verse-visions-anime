import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { to?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" />}
            {item.to ? (
              <Link to={item.to} className="hover:text-primary">{item.label}</Link>
            ) : (
              <span className="text-foreground/80">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Section({ eyebrow, title, subtitle, children, action }: { eyebrow?: string; title: string; subtitle?: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="my-16">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          {eyebrow && <div className="text-xs uppercase tracking-[0.22em] text-primary font-semibold mb-2">{eyebrow}</div>}
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-2 text-muted-foreground max-w-2xl">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-xl font-bold text-gradient">{value}</div>
    </div>
  );
}
