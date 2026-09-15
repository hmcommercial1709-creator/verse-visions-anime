import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { storeProducts } from "@/data/store-products";

/**
 * Legacy product URL: kept only to forward the real store products.
 *
 * Anything else used to fall through to loadEntity({ kind: "product" }),
 * which read game_nexus_matrix — the fabricated table — so the page either
 * 404ed or rendered an invented product. Only the redirect was ever real, so
 * only the redirect remains.
 */
export const Route = createFileRoute("/$locale/product/$slug")({
  beforeLoad: ({ params }) => {
    if (params.locale !== "en") throw notFound();
    if (storeProducts.find((item) => item.slug === params.slug)) {
      throw redirect({ href: `/store/${params.slug}`, statusCode: 301 });
    }
    throw notFound();
  },
});
