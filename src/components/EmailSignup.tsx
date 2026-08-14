import { Link } from "@tanstack/react-router";
import { Mail, Rss } from "lucide-react";

export default function EmailSignup() {
  return (
    <section className="rounded-2xl border border-primary/30 bg-card/50 p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
          <Mail className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            New guide alerts
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold">Choose a working update channel</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Email delivery is not connected yet, so GameCastle does not collect addresses on this
            page. Follow the live RSS feed now, or contact the editorial desk if you want to hear
            when email updates become available.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/rss.xml"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110"
            >
              <Rss className="h-4 w-4" aria-hidden="true" />
              Follow the RSS feed
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm font-semibold hover:border-primary/60"
            >
              Contact the editorial desk
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
