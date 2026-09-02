import { createServerFn } from "@tanstack/react-start";
import { fetchFreeGames } from "./free-games.server";
export const getFreeGames = createServerFn({ method: "GET" }).handler(() => fetchFreeGames());
