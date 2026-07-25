import { useEffect, useState } from "react";
import { List } from "lucide-react";
import type { DerivedSection } from "@/lib/reading";

/** Sticky table of contents with scroll-spy for long-form reading. */
export function TableOfContents({ sections }: { sections: DerivedSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: [0, 1] },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-2xl border border-border/60 bg-card/50 p-4">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        <List className="h-3.5 w-3.5" /> In this article
      </div>
      <ol className="mt-3 space-y-1 text-sm">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={`block rounded-md border-l-2 py-1.5 pl-3 transition-colors ${
                active === s.id
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              <span className="mr-1.5 font-mono text-[10px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
              {s.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
