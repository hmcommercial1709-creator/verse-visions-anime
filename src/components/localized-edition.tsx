import { Link } from "@tanstack/react-router";
import { ArrowRight, Globe, Languages } from "lucide-react";
import { LOCALES, getLocale, localizePath } from "@/lib/i18n";
import { LanguageSelector } from "@/components/language-selector";

/**
 * Renders the localized URL shell for a language sub-path. Translated copy is
 * dropped in per locale as it ships; until then the English original is linked
 * so no route is a dead end.
 */
export function LocalizedEditionNotice({ locale: code, path }: { locale: string; path: string }) {
  const locale = getLocale(code);
  const cleanPath = path.replace(/\/+$/, "") || "/";

  return (
    <div dir={locale.dir} lang={locale.hrefLang} className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <div className="rounded-2xl border border-border/60 bg-card/50 p-8 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Languages className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {locale.short} · {locale.dir.toUpperCase()}
            </p>
            <h1 className="font-display text-2xl font-bold">
              AnimeVerse — {locale.label}
            </h1>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          This is the <strong className="text-foreground">{locale.english}</strong> URL for{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">{cleanPath}</code>. The
          localized edition is being translated by our editorial team. Until it lands, read the
          English original — nothing is lost.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to={cleanPath}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground glow-primary hover:brightness-110"
          >
            Read in English <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
          <LanguageSelector variant="footer" align="start" />
        </div>

        <div className="mt-8 border-t border-border/60 pt-6">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Globe className="h-3.5 w-3.5" /> Other editions of this page
          </p>
          <div className="flex flex-wrap gap-2">
            {LOCALES.filter((l) => l.code !== locale.code).map((l) => (
              <Link
                key={l.code}
                to={localizePath(cleanPath, l.code)}
                className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {l.short} · {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
