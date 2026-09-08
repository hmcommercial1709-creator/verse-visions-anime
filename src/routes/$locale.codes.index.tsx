import { createFileRoute, notFound } from "@tanstack/react-router";
import { loadEntityPage } from "@/lib/entity-catalog.functions";
import { CatalogIndex } from "@/components/catalog-entity";

export const Route = createFileRoute("/$locale/codes/")({
  beforeLoad: ({ params }) => { if (params.locale !== "en") throw notFound(); },
  validateSearch: (search: Record<string, unknown>) => ({ page: Math.max(1, Number(search.page) || 1) }),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => loadEntityPage({ data: { kind: "code", page: deps.page } }),
  head: ({ loaderData }) => ({
    meta: [{ title: "Game codes catalog · GameCastle Anime" },
      { name: "description", content: "Browse published game codes catalog on GameCastle Anime." },
      { name: "robots", content: loaderData?.entities.length ? "index, follow" : "noindex, follow" }],
    links: [{ rel: "canonical", href: `https://gamecastle.store/en/codes${(loaderData?.page ?? 1) > 1 ? `?page=${loaderData?.page}` : ""}` }],
  }),
  component: function CatalogRoute() { return <CatalogIndex {...Route.useLoaderData()} title="Game codes catalog" basePath="/en/codes" />; },
});
