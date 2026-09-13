import { Link } from "@tanstack/react-router";
import { Gift, Download } from "lucide-react";

/**
 * The rewards block, carried by every generated catalog page.
 *
 * The site already has real gifts — eight wallpapers at stated resolutions, a
 * watchlist PDF, a tracker CSV and an infographic, all files that exist in
 * public/downloads and actually download. They were reachable from exactly two
 * places: the homepage vault and /rewards/anime-wallpapers. Every imported
 * catalog page was a dead end with respect to them.
 *
 * Two things follow from putting them on every generated page. A visitor who
 * landed from search on one title now has somewhere to go, and the reward
 * pages stop being orphans in the link graph — which is what got them
 * deprioritised by crawlers in the first place.
 *
 * Deliberately honest about what is on offer: it names the real files rather
 * than promising unspecified "exclusive content", and it does not pretend the
 * gift is tied to this particular title.
 */
export function CatalogRewards() {
  return (
    <aside className="my-12 overflow-hidden rounded-2xl border border-primary/30 bg-primary/5">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 rounded-xl border border-primary/40 bg-primary/10 p-2.5 text-primary">
            <Gift className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold">Free downloads for readers</h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Eight anime wallpapers in desktop and mobile resolutions, the Ultimate Anime Watchlist
              2026 as a PDF, a season tracker spreadsheet and a top-50 infographic. Real files, no
              sign-up.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            to="/rewards/anime-wallpapers"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Open the gift library
          </Link>
        </div>
      </div>
    </aside>
  );
}
