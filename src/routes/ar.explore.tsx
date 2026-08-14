import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { EXPLORE_PAGES } from "@/data/explore-pages";
export const Route = createFileRoute("/ar/explore")({ head: () => ({ meta: [{ title: "استكشف أدلة الأنمي والخلفيات والترتيبات والإصدارات" }, { name: "description", content: "استكشف خلفيات الأنمي وترتيب المشاهدة والشخصيات والإصدارات والبث القانوني وأدلة الألعاب باللغة العربية." }] }), component: ExploreHubAr });
function ExploreHubAr() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname.replace(/\/$/, "") !== "/ar/explore") return <Outlet />;
  return <main dir="rtl" className="mx-auto max-w-7xl px-4 py-12 lg:px-6"><h1 className="font-display text-5xl font-black">استكشف الأنمي</h1><p className="mt-4 max-w-3xl text-lg text-muted-foreground">خلفيات وترتيب مشاهدة وتصنيفات شخصيات ومتابعة إصدارات موثقة وأدلة بث وألعاب آمنة.</p><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{EXPLORE_PAGES.map((p) => <Link key={p.slug} to="/ar/explore/$slug" params={{ slug: p.slug }} className="rounded-2xl border border-border bg-card/40 p-6 hover:border-primary"><h2 className="font-display text-xl font-bold">{p.ar.title}</h2><p className="mt-2 text-sm text-muted-foreground">{p.ar.description}</p></Link>)}</div></main>;
}
