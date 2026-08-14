import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/ar/explore")({
  component: Outlet,
});
