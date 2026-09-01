import { createFileRoute, notFound } from "@tanstack/react-router";
import { loadEntities } from "@/lib/entity-catalog";
import { CatalogIndex } from "@/components/catalog-entity";

export const Route = createFileRoute("/$locale/articles/")({
  beforeLoad: ({ params }) => { if (params.locale !== "en") throw notFound(); },
  loader: () => loadEntities("article"),
  head: ({ loaderData }) => ({
    meta: [{ title: "Articles · GameCastle Anime" },
      { name: "description", content: "Browse published articles on GameCastle Anime." },
      { name: "robots", content: loaderData?.length ? "index, follow" : "noindex, follow" }],
    links: [{ rel: "canonical", href: "https://gamecastle.store/en/articles" }],
  }),
  component: function CatalogRoute() { return <CatalogIndex title="Articles" entities={Route.useLoaderData()} />; },
});
