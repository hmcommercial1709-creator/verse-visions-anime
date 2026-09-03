import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { loadEntity, entityHead } from "@/lib/entity-catalog";
import { CatalogEntityPage } from "@/components/catalog-entity";
import { publishedArticles } from "@/lib/content-registry";

export const Route = createFileRoute("/$locale/articles/$slug")({
  beforeLoad: ({ params }) => {
    if (params.locale !== "en") throw notFound();
    if (publishedArticles().find((item) => item.slug === params.slug)) {
      throw redirect({ href: `/article/${params.slug}`, statusCode: 301 });
    }
  },
  loader: async ({ params }) => {
    const entity = await loadEntity("article", params.slug);
    if (!entity) throw notFound();
    return entity;
  },
  head: ({ loaderData }) => {
    const headResult = entityHead(loaderData);
    const imageUrl = loaderData?.image || loaderData?.coverImage || loaderData?.heroImage;

    if (imageUrl) {
      if (Array.isArray(headResult)) {
        headResult.push({
          tag: "link",
          attrs: {
            rel: "preload",
            as: "image",
            href: imageUrl,
            fetchpriority: "high",
          },
        });
      } else if (typeof headResult === "object" && headResult !== null) {
        headResult.links = [
          ...(headResult.links || []),
          {
            rel: "preload",
            as: "image",
            href: imageUrl,
            fetchpriority: "high",
          },
        ];
      }
    }

    return headResult;
  },
  component: function CatalogRoute() {
    return <CatalogEntityPage entity={Route.useLoaderData()} />;
  },
});
