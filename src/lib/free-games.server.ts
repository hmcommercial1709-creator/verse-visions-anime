import { parseFreeGames, type FreeGame } from "./free-games";
let cached: { expires: number; games: FreeGame[] } | undefined;
let pending: Promise<FreeGame[]> | undefined;
export async function fetchFreeGames(): Promise<FreeGame[]> {
  if (cached && cached.expires > Date.now()) return cached.games;
  if (pending) return pending;
  pending = (async () => {
    const response = await fetch("https://www.freetogame.com/api/games?sort-by=popularity", { signal: AbortSignal.timeout(12000), headers: { accept: "application/json" } });
    if (!response.ok) throw new Error("Game directory unavailable");
    const games = parseFreeGames(await response.json());
    if (!games.length) throw new Error("Game directory returned no usable entries");
    cached = { games, expires: Date.now() + 60 * 60 * 1000 };
    return games;
  })().finally(() => { pending = undefined; });
  return pending;
}
