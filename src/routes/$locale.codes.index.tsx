import { createFileRoute, notFound } from "@tanstack/react-router";
import { loadEntities } from "@/lib/entity-catalog";
import { CatalogIndex } from "@/components/catalog-entity";

export const Route = createFileRoute("/$locale/codes/")({
  beforeLoad: ({ params }) => { if (params.locale !== "en") throw notFound(); },
  loader: () => loadEntities("code"),
  head: ({ loaderData }) => ({
    meta: [{ title: "Game codes catalog · GameCastle Anime" },
      { name: "description", content: "Browse published game codes catalog on GameCastle Anime." },
      { name: "robots", content: loaderData?.length ? "index, follow" : "noindex, follow" }],
    links: [{ rel: "canonical", href: "https://gamecastle.store/en/codes" }],
  }),
  component: function CatalogRoute() { return <CatalogIndex title="Game codes catalog" entities={Route.useLoaderData()} />; },
});
