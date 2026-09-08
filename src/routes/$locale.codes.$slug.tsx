import { createFileRoute, notFound } from "@tanstack/react-router";
import { CatalogEntityPage } from "@/components/catalog-entity";
import { loadEntity } from "@/lib/entity-catalog.functions";
import { entityHead } from "@/lib/entity-catalog";

export const Route = createFileRoute("/$locale/codes/$slug")({
  beforeLoad: ({ params }) => {
    if (params.locale !== "en") throw notFound();
  },
  loader: async ({ params }) => {
    return loadEntity({ data: { kind: "code", slug: params.slug } });
  },
  head: ({ loaderData }) => {
    return entityHead(loaderData);
  },
  component: function ProgrammaticCodePage() {
    const entity = Route.useLoaderData();
    return entity ? <CatalogEntityPage entity={entity} /> : <main className="mx-auto max-w-4xl px-4 py-12"><h1>Content unavailable</h1><p>This listing is not ready for indexing.</p></main>;
  },
});
