import { Download, FileText, Table2 } from "lucide-react";

export default function DownloadBanner() {
  return (
    <section className="border-y border-primary/25 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:px-6 lg:py-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Free, real downloads
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Build your 2026 anime watchlist
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            Start with 23 titles from the live GameCastle catalog. The 15-page PDF includes a
            spoiler-light roadmap, while the editable CSV helps you track episodes and personal
            ratings.
          </p>
          <ul className="mt-5 grid gap-2 text-sm text-foreground/85 sm:grid-cols-2">
            <li>• Real catalog titles and episode data</li>
            <li>• No email gate or fake subscription</li>
            <li>• Beginner-friendly viewing roadmap</li>
            <li>• Excel, Google Sheets and Notion-ready CSV</li>
          </ul>
        </div>

        <div className="grid min-w-[270px] gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <a
            href="/downloads/ultimate-anime-watchlist-2026.pdf"
            download
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground hover:brightness-110"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Download the PDF
            <Download className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="/downloads/anime-tracker-template.csv"
            download
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/70 px-5 py-3 font-semibold hover:border-primary/60"
          >
            <Table2 className="h-4 w-4" aria-hidden="true" />
            Download the tracker
          </a>
        </div>
      </div>
    </section>
  );
}
