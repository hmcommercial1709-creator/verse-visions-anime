import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { loadEntity, entityHead } from "@/lib/entity-catalog";
import { CatalogEntityPage } from "@/components/catalog-entity";
import { storeProducts } from "@/data/store-products";

export const Route = createFileRoute("/$locale/product/$slug")({
  beforeLoad: ({ params }) => {
    if (params.locale !== "en") throw notFound();
    if (storeProducts.find((item) => item.slug === params.slug)) throw redirect({ href: `/store/${params.slug}`, statusCode: 301 });
  },
  loader: async ({ params }) => {
    const entity = await loadEntity("product", params.slug);
    if (!entity) throw notFound();
    return entity;
  },
  head: ({ loaderData }) => entityHead(loaderData),
  component: function CatalogRoute() { return <CatalogEntityPage entity={Route.useLoaderData()} />; },
});
