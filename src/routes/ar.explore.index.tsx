import { createFileRoute, Link } from "@tanstack/react-router";
import { EXPLORE_PAGES } from "@/data/explore-pages";
import { absoluteUrl } from "@/lib/seo";

const TITLE = "استكشف أدلة الأنمي والخلفيات والترتيبات والإصدارات";
const DESCRIPTION =
  "استكشف خلفيات الأنمي وترتيب المشاهدة والشخصيات والإصدارات والبث القانوني وأدلة الألعاب باللغة العربية.";

export const Route = createFileRoute("/ar/explore/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/ar/explore") },
      { rel: "alternate", hreflang: "ar", href: absoluteUrl("/ar/explore") },
      { rel: "alternate", hreflang: "en", href: absoluteUrl("/explore") },
      { rel: "alternate", hreflang: "x-default", href: absoluteUrl("/explore") },
    ],
  }),
  component: ExploreHubAr,
});

function ExploreHubAr() {
  return (
    <main dir="rtl" className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <h1 className="font-display text-5xl font-black">استكشف الأنمي</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        خلفيات وترتيب مشاهدة وتصنيفات شخصيات ومتابعة إصدارات موثقة وأدلة بث وألعاب آمنة.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {EXPLORE_PAGES.map((page) => (
          <Link
            key={page.slug}
            to="/ar/explore/$slug"
            params={{ slug: page.slug }}
            className="rounded-2xl border border-border bg-card/40 p-6 hover:border-primary"
          >
            <h2 className="font-display text-xl font-bold">{page.ar.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{page.ar.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
