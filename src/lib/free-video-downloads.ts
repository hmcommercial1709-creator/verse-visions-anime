export type FreeVideoFile = {
  title: string;
  url: string;
  source: string;
  license: string;
  author: string;
  size: number;
  provider: "Wikimedia Commons" | "Internet Archive";
  rightsSource?: string;
};

type Info = { url?: unknown; descriptionurl?: unknown; mime?: unknown; size?: unknown; extmetadata?: Record<string, { value?: unknown }> };
const text = (value: unknown) => typeof value === "string" ? value.replace(/<[^>]*>/g, "").slice(0, 500) : "";
function sourceUrl(value: unknown, host: string): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === host && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
export function downloadSearchUrl(title: string): string {
  const phrase = title.replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").trim().slice(0, 160);
  if (phrase.length < 2) throw new Error("Enter at least two letters.");
  return `https://commons.wikimedia.org/w/api.php?${new URLSearchParams({
    action: "query", format: "json", origin: "*", generator: "search",
    gsrsearch: `intitle:"${phrase}" filetype:video`, gsrnamespace: "6", gsrlimit: "8",
    prop: "imageinfo", iiprop: "url|size|mime|extmetadata",
    iiextmetadatafilter: "LicenseShortName|Artist|Restrictions|Copyrighted|ImageDescription", iiextmetadatalanguage: "en",
  })}`;
}
export function parseFreeVideoFiles(payload: unknown): FreeVideoFile[] {
  if (!payload || typeof payload !== "object" || "error" in payload) throw new Error("Download search is unavailable. Please retry.");
  const query = "query" in payload ? payload.query : undefined;
  if (!query) return [];
  if (typeof query !== "object" || !("pages" in query) || !query.pages || typeof query.pages !== "object") throw new Error("Invalid source response.");
  const results: FreeVideoFile[] = [];
  for (const raw of Object.values(query.pages)) {
    const page = raw as { title?: unknown; imageinfo?: Info[] };
    if (/trailer|teaser|gameplay|let[’\']?s play/i.test(text(page.title))) continue;
    const info = page.imageinfo?.[0];
    if (!info || typeof info.mime !== "string" || !["video/webm", "video/ogg", "video/mp4"].includes(info.mime)) continue;
    const description = text(info.extmetadata?.ImageDescription?.value);
    if (!/anime|animat|アニメ|أنمي|رسوم متحركة/i.test(description)) continue;
    const license = text(info.extmetadata?.LicenseShortName?.value);
    // Accept only explicit open licenses. Do not treat absent rights metadata
    // or a search match as evidence that a commercial episode is downloadable.
    if (!/^(Public domain|CC0|CC BY(?:-SA)? [1-4]\.0)$/i.test(license)) continue;
    if (text(info.extmetadata?.Restrictions?.value)) continue;
    const url = sourceUrl(info.url, "upload.wikimedia.org");
    const source = sourceUrl(info.descriptionurl, "commons.wikimedia.org");
    if (!url || !source || !url.includes("/wikipedia/commons/")) continue;
    results.push({ provider: "Wikimedia Commons", title: text(page.title).replace(/^File:/, ""), url, source, license, author: text(info.extmetadata?.Artist?.value) || "See source credits", size: typeof info.size === "number" && info.size > 0 ? info.size : 0 });
  }
  return [...new Map(results.map((item) => [item.url, item])).values()];
}
async function findCommonsFiles(title: string, signal: AbortSignal): Promise<FreeVideoFile[]> {
  const response = await fetch(downloadSearchUrl(title), { signal: AbortSignal.any([signal, AbortSignal.timeout(12000)]) });
  if (!response.ok) throw new Error("The download source is temporarily unavailable. Please retry.");
  return parseFreeVideoFiles(await response.json());
}

// This Archive item is the original source cited on the Commons page whose
// public-domain status was reviewed. No arbitrary archive upload is trusted.
const ARCHIVE_ITEM = "namakura-gatana-1917";
const RIGHTS_SOURCE = "https://commons.wikimedia.org/wiki/File:Kouichi_Jun%27ichi_-_Namakura_Gatana_(1917)_-_4-minute_restored_version.webm";
async function findArchiveFiles(title: string, signal: AbortSignal): Promise<FreeVideoFile[]> {
  if (!/^(namakura gatana|the dull sword)(?:\s*\(1917\)|\s+1917)?$/i.test(title.trim())) return [];
  const response = await fetch(`https://archive.org/metadata/${ARCHIVE_ITEM}`, { signal: AbortSignal.any([signal, AbortSignal.timeout(12000)]) });
  if (!response.ok) throw new Error("Archive source unavailable");
  const data = await response.json();
  if (data.metadata?.identifier !== ARCHIVE_ITEM || !Array.isArray(data.files)) throw new Error("Invalid Archive response");
  return data.files.flatMap((file: { name?: unknown; format?: unknown; size?: unknown }): FreeVideoFile[] => {
    if (typeof file.name !== "string" || file.name.includes("/") || file.format !== "MPEG4") return [];
    return [{ title: file.name, url: `https://archive.org/download/${ARCHIVE_ITEM}/${encodeURIComponent(file.name)}`, source: `https://archive.org/details/${ARCHIVE_ITEM}`, license: "Public domain", author: "Junichi Kouchi", size: Number(file.size) || 0, provider: "Internet Archive", rightsSource: RIGHTS_SOURCE }];
  });
}
export async function findFreeVideoFiles(title: string, signal: AbortSignal): Promise<FreeVideoFile[]> {
  const results = await Promise.allSettled([findCommonsFiles(title, signal), findArchiveFiles(title, signal)]);
  const files = results.flatMap((result) => result.status === "fulfilled" ? result.value : []);
  if (!files.length && results.some((result) => result.status === "rejected")) throw new Error("Download source unavailable. Retry later.");
  return files;
}
