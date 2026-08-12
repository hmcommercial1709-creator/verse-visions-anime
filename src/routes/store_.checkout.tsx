import { createFileRoute, redirect } from "@tanstack/react-router";

/** The former checkout route now leads to the Amazon affiliate storefront. */
export const Route = createFileRoute("/store_/checkout")({
  beforeLoad: () => {
    throw redirect({ to: "/store", statusCode: 301 });
  },
});
