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
  const isArabic = locale.code === "ar";
  const topic = cleanPath.split("/").filter(Boolean).at(-1)?.replace(/[-_]+/g, " ") || "GameCastle Anime";

  return (
    <div dir={locale.dir} lang={locale.hrefLang} className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <div className="rounded-2xl border border-border/60 bg-card/80 p-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Languages className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {locale.short} · {locale.dir.toUpperCase()}
            </p>
            <h1 className="font-display text-2xl font-bold">
              {isArabic ? `${topic} — دليل GameCastle Anime بالعربية` : `GameCastle Anime — ${locale.label}`}
            </h1>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          {isArabic
            ? `مرحباً بك في صفحة ${topic} العربية من GameCastle Anime. استخدم الأقسام والروابط المتصلة للوصول إلى الأدلة والمقالات والشخصيات ذات الصلة بسهولة.`
            : `This is the ${locale.english} edition for ${cleanPath}. Use the connected navigation to explore related anime and gaming resources.`}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to={isArabic ? "/ar/anime" : cleanPath}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground glow-primary hover:brightness-110"
          >
            {isArabic ? "عرض الدليل المرتبط" : "Read the related guide"} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
          <LanguageSelector variant="footer" align="start" />
        </div>

        {!isArabic && <div className="mt-8 border-t border-border/60 pt-6">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Globe className="h-3.5 w-3.5" /> {isArabic ? "إصدارات اللغة" : "Other editions of this page"}
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
        </div>}
      </div>
    </div>
  );
}
