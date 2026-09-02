export type FreeGame = { id: number; title: string; description: string; image: string; url: string; platform: string; genre: string };
export function parseFreeGames(data: unknown): FreeGame[] {
  if (!Array.isArray(data)) throw new Error("Game directory unavailable");
  return data.flatMap((raw): FreeGame[] => {
    if (!raw || typeof raw !== "object" || !Number.isSafeInteger(raw.id) || typeof raw.title !== "string" || typeof raw.game_url !== "string") return [];
    let url: URL;
    let image: URL;
    try { url = new URL(raw.game_url); image = new URL(raw.thumbnail); } catch { return []; }
    if (url.protocol !== "https:" || url.username || url.password || !["www.freetogame.com", "freetogame.com"].includes(url.hostname) || !url.pathname.startsWith("/open/")) return [];
    if (image.protocol !== "https:" || image.hostname !== "www.freetogame.com") return [];
    return [{ id: raw.id, title: raw.title.slice(0, 150), description: String(raw.short_description ?? "").slice(0, 600), image: image.href, url: url.href, platform: String(raw.platform ?? ""), genre: String(raw.genre ?? "") }];
  });
}
