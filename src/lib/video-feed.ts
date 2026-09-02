export type FeedVideo = {
  id: string;
  title: string;
  category: "Anime" | "Gaming";
  description: string;
  slug?: string;
};

export function validYoutubeId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{11}$/.test(value);
}

export function uniqueVideos(items: FeedVideo[]): FeedVideo[] {
  return [...new Map(items.filter((item) => validYoutubeId(item.id)).map((item) => [item.id, item])).values()];
}

// External metadata never supplies iframe URLs or HTML. Only validated IDs
// are passed to the fixed YouTube embed origin.
export function parseTrailerPage(value: unknown): { videos: FeedVideo[]; hasNext: boolean } {
  if (!value || typeof value !== "object" || !("data" in value) || !Array.isArray(value.data)) {
    throw new Error("Invalid trailer response");
  }
  const videos: FeedVideo[] = [];
  for (const item of value.data) {
    if (!item || typeof item !== "object") continue;
    const id = item.trailer?.youtube_id;
    const title = item.title_english || item.title;
    if (!validYoutubeId(id) || typeof title !== "string") continue;
    videos.push({ id, title: title.slice(0, 200), category: "Anime", description: "Anime trailer listed by MyAnimeList via Jikan. Playback and regional availability are controlled by YouTube and the publisher." });
  }
  const pagination = "pagination" in value ? value.pagination : null;
  const hasNext = !!pagination && typeof pagination === "object" && "has_next_page" in pagination && pagination.has_next_page === true;
  return { videos: uniqueVideos(videos), hasNext };
}

export function twitchEmbedUrl(channel: string, hostname: string): string {
  if (!/^[a-zA-Z0-9_]{1,25}$/.test(channel) || !/^[a-zA-Z0-9.-]+$/.test(hostname)) {
    throw new Error("Invalid Twitch channel or parent");
  }
  const url = new URL("https://player.twitch.tv/");
  url.search = new URLSearchParams({ channel, parent: hostname, autoplay: "true", muted: "false" }).toString();
  return url.href;
}
