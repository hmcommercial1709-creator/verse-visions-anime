import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { loadEntity, entityHead } from "@/lib/entity-catalog";
import { CatalogEntityPage } from "@/components/catalog-entity";
import { publishedArticles } from "@/lib/content-registry";

export const Route = createFileRoute("/$locale/articles/$slug")({
  beforeLoad: ({ params }) => {
    if (params.locale !== "en") throw notFound();
    if (publishedArticles().find((item) => item.slug === params.slug)) throw redirect({ href: `/article/${params.slug}`, statusCode: 301 });
  },
  loader: async ({ params }) => {
    const entity = await loadEntity("article", params.slug);
    if (!entity) throw notFound();
    return entity;
  },
  head: ({ loaderData }) => entityHead(loaderData),
  component: function CatalogRoute() { return <CatalogEntityPage entity={Route.useLoaderData()} />; },
});
