import { createFileRoute, redirect } from "@tanstack/react-router";

const parseSearch = (search: Record<string, unknown>) => ({
  q: typeof search.q === "string" ? search.q : undefined,
  genre: typeof search.genre === "string" ? search.genre : undefined,
  studio: typeof search.studio === "string" ? search.studio : undefined,
  status: typeof search.status === "string" ? search.status : undefined,
  decade: typeof search.decade === "string" ? search.decade : undefined,
  sort:
    search.sort === "year" ||
    search.sort === "popularity" ||
    search.sort === "title" ||
    search.sort === "rating"
      ? search.sort
      : undefined,
});

export const Route = createFileRoute("/explore")({
  validateSearch: parseSearch,
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/browse",
      search,
      replace: true,
      statusCode: 301,
    });
  },
});
