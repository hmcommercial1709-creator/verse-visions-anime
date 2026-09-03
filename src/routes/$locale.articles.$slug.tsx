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
    const baseHead = entityHead(loaderData);
    const imageUrl = (loaderData as any)?.image || (loaderData as any)?.coverImage || (loaderData as any)?.heroImage;

    if (Array.isArray(baseHead)) {
      const preloadLink = imageUrl ? {
        tag: "link",
        attrs: {
          rel: "preload",
          as: "image",
          href: imageUrl,
          fetchpriority: "high",
        },
      } : null;
      return (preloadLink ? [...baseHead, preloadLink] : baseHead) as any;
    }

    return {
      ...(baseHead || {}),
      links: [
        ...((baseHead as any)?.links || []),
        ...(imageUrl ? [{ rel: "preload", as: "image", href: imageUrl, fetchpriority: "high" }] : []),
      ],
    } as any;
  },
  component: function CatalogRoute() {
    return <CatalogEntityPage entity={Route.useLoaderData()} />;
  },
});
