import { createFileRoute, notFound } from "@tanstack/react-router";
import { loadEntityPage } from "@/lib/entity-catalog.functions";
import { CatalogIndex } from "@/components/catalog-entity";

export const Route = createFileRoute("/$locale/articles/")({
  beforeLoad: ({ params }) => { if (params.locale !== "en") throw notFound(); },
  validateSearch: (search: Record<string, unknown>) => ({ page: Math.max(1, Number(search.page) || 1) }),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => loadEntityPage({ data: { kind: "article", page: deps.page } }),
  head: ({ loaderData }) => ({
    meta: [{ title: "Articles · GameCastle Anime" },
      { name: "description", content: "Browse published articles on GameCastle Anime." },
      { name: "robots", content: loaderData?.entities.length ? "index, follow" : "noindex, follow" }],
    links: [{ rel: "canonical", href: `https://gamecastle.store/en/articles${(loaderData?.page ?? 1) > 1 ? `?page=${loaderData?.page}` : ""}` }],
  }),
  component: function CatalogRoute() { return <CatalogIndex {...Route.useLoaderData()} title="Articles" basePath="/en/articles" />; },
});
