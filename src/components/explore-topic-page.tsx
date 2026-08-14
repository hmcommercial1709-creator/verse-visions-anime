import { ArrowRight, CheckCircle2, Download, ExternalLink } from "lucide-react";
import type { ExplorePage } from "@/data/explore-pages";

const wallpaperAssets = [
  "pirate-ocean-sunset-hd.webp",
  "ninja-moon-village-hd.webp",
  "demon-hunter-wisteria-hd.webp",
  "giant-wall-battle-hd.webp",
];

export function ExploreTopicPage({ page, language }: { page: ExplorePage; language: "en" | "ar" }) {
  const copy = page[language];
  const ar = language === "ar";
  const prefix = ar ? "/ar" : "";
  return (
    <main dir={ar ? "rtl" : "ltr"} className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
      <nav aria-label={ar ? "مسار التنقل" : "Breadcrumb"} className="mb-6 text-sm text-muted-foreground">
        <a href={prefix || "/"}>{ar ? "الرئيسية" : "Home"}</a> / <a href={`${prefix}/explore`}>{ar ? "استكشف" : "Explore"}</a> / <span>{copy.title}</span>
      </nav>
      <header className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-card to-background p-7 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">{ar ? "دليل GameCastle" : "GameCastle guide"}</p>
        <h1 className="mt-3 font-display text-4xl font-black md:text-6xl">{copy.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{copy.intro}</p>
        <a href={`${ar ? "" : "/ar"}/explore/${page.slug}`} className="mt-6 inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary">
          {ar ? "English" : "العربية"}
        </a>
      </header>

      {page.category === "wallpapers" && (
        <section className="mt-10 grid gap-5 sm:grid-cols-2">
          {wallpaperAssets.map((asset) => (
            <article key={asset} className="overflow-hidden rounded-2xl border border-border bg-card">
              <img src={`/rewards/thumbs/${asset}`} alt={`${copy.title} — ${asset.replaceAll("-", " ")}`} className="aspect-video w-full object-cover" loading="lazy" />
              <div className="flex items-center justify-between gap-3 p-4">
                <span className="text-sm text-muted-foreground">HD WebP</span>
                <a href={`/rewards/wallpapers/${asset}`} download className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"><Download className="h-4 w-4" />{ar ? "تنزيل مجاني" : "Free download"}</a>
              </div>
            </article>
          ))}
        </section>
      )}

      <section className="mt-12 grid gap-5 md:grid-cols-2">
        {copy.items.map((item, i) => (
          <article key={item} className="rounded-2xl border border-border/70 bg-card/50 p-6">
            <div className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" /><div><h2 className="font-display text-xl font-bold">{ar ? `النقطة ${i + 1}` : `Key point ${i + 1}`}</h2><p className="mt-2 leading-7 text-muted-foreground">{item}</p></div></div>
          </article>
        ))}
      </section>

      {page.official?.length ? <section className="mt-12 rounded-2xl border border-border p-6"><h2 className="font-display text-2xl font-bold">{ar ? "مصادر ومتابعة رسمية" : "Official sources and further checks"}</h2><div className="mt-4 flex flex-wrap gap-3">{page.official.map((x) => <a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:border-primary">{x.label}<ExternalLink className="h-4 w-4" /></a>)}</div></section> : null}

      <section className="mt-12"><h2 className="font-display text-3xl font-bold">{ar ? "أسئلة شائعة" : "Frequently asked questions"}</h2><div className="mt-5 space-y-4">{copy.faq.map(([q, a]) => <details key={q} className="rounded-2xl border border-border bg-card/40 p-5"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-3 leading-7 text-muted-foreground">{a}</p></details>)}</div></section>
      <section className="mt-12 rounded-3xl border border-primary/25 bg-primary/10 p-7"><h2 className="font-display text-2xl font-bold">{ar ? "تابع الاستكشاف" : "Keep exploring"}</h2><div className="mt-4 flex flex-wrap gap-3"><a href={`${prefix}/explore`} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">{ar ? "كل الأدلة" : "All guides"}<ArrowRight className="h-4 w-4" /></a><a href={`${prefix}/rewards/anime-wallpapers`} className="rounded-xl border border-border px-5 py-3 font-semibold">{ar ? "هدية الخلفيات" : "Wallpaper gift"}</a></div></section>
    </main>
  );
}
