import { Link } from "@tanstack/react-router";
import { Network } from "lucide-react";
import { relatedLinks } from "@/lib/internal-links";
import { useUi } from "@/lib/i18n-ui";

const KIND_LABEL: Record<string, string> = {
  anime: "Series",
  article: "Read",
  character: "Character",
  genre: "Genre",
  studio: "Studio",
  category: "Hub",
  hub: "Hub",
};

/**
 * Auto-generated internal link block. Targets come from the validated link
 * graph, so dead or unpublished pages are pruned before render.
 */
export function InternalLinkNetwork({
  path,
  topics,
  limit = 8,
  title,
  className = "",
}: {
  path: string;
  topics: string[];
  limit?: number;
  title?: string;
  className?: string;
}) {
  const t = useUi();
  const links = relatedLinks(path, topics, limit);
  if (!links.length) return null;

  return (
    <nav
      aria-label="Related pages"
      className={`rounded-2xl border border-border/60 bg-card/80 p-5 ${className}`}
    >
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <Network className="h-3.5 w-3.5" /> {title ?? t("related")}
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="flex items-center gap-2 rounded-lg border border-transparent px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-secondary/50 hover:text-foreground"
            >
              <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                {KIND_LABEL[l.kind] ?? l.kind}
              </span>
              <span className="truncate">{l.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
