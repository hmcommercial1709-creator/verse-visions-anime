import { createFileRoute, notFound } from "@tanstack/react-router";
import { loadEntity, entityHead } from "@/lib/entity-catalog";
import { CatalogEntityPage } from "@/components/catalog-entity";


export const Route = createFileRoute("/$locale/codes/$slug")({
  beforeLoad: ({ params }) => {
    if (params.locale !== "en") throw notFound();
  },
  loader: async ({ params }) => {
    const entity = await loadEntity("code", params.slug);
    if (!entity) throw notFound();
    return entity;
  },
  head: ({ loaderData }) => entityHead(loaderData),
  component: function CatalogRoute() { return <CatalogEntityPage entity={Route.useLoaderData()} />; },
});
