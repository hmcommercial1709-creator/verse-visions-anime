import { getAnime } from "@/data/animes";
import { trailerFor } from "@/data/trailers";

/**
 * Video-first content model (English).
 *
 * Each entry pairs an embeddable official YouTube video (summary, AMV or short
 * review) with a 2–3 paragraph English write-up written for search, plus the
 * licensed platform the visitor should finish the episode on. No hosted video,
 * no pirated sources — the CTA always points at the official platform.
 */
export type VideoKind = "summary" | "amv" | "review";

export type VideoSummary = {
  animeSlug: string;
  kind: VideoKind;
  youtubeId: string;
  /** Headline shown above the embed. */
  title: string;
  /** 2–3 paragraphs rendered under the player for SEO. */
  paragraphs: string[];
};

export const KIND_LABEL: Record<VideoKind, string> = {
  summary: "Anime summary",
  amv: "AMV music video",
  review: "Quick review",
};

/** Licensed platform used by the "watch full episode" CTA. */
const PLATFORMS: Record<string, { label: string; search: string }> = {
  crunchyroll: { label: "Crunchyroll", search: "https://www.crunchyroll.com/search?q=" },
  netflix: { label: "Netflix", search: "https://www.netflix.com/search?q=" },
};

const PLATFORM_BY_SLUG: Record<string, keyof typeof PLATFORMS> = {
  "attack-on-titan": "netflix",
  "spy-x-family": "netflix",
};

export function officialPlatformFor(slug: string, title: string) {
  const key = PLATFORM_BY_SLUG[slug] ?? "crunchyroll";
  const p = PLATFORMS[key];
  return {
    label: p.label,
    url: `${p.search}${encodeURIComponent(title)}`,
  };
}

const COPY: Record<string, string[]> = {
  "jujutsu-kaisen": [
    "This Jujutsu Kaisen video summary rebuilds the whole sorcery world in order: the moment Yuji Itadori swallows Sukuna's finger, his life sentence as the King of Curses' vessel, and the political machinery of Jujutsu High that decides who lives long enough to graduate. Every beat is placed on a clear timeline, with the episodes worth watching in full clearly flagged.",
    "From there we break down cursed energy as a power system: how curses are born out of negative human emotion, the gap between inherited techniques like Satoru Gojo's Limitless and self-taught ones, and why a Domain Expansion is the ceiling of any fight in this series. Everything explained is anime-only — no manga spoilers slip in.",
    "The last section is a viewing order for newcomers: season one, then Jujutsu Kaisen 0, then the Shibuya Incident arc. If the breakdown helped, continue the full episode on the official platform in original quality and support the studio that made it.",
  ],
  "demon-slayer": [
    "This summary walks Tanjiro Kamado's arc from the morning he loses his family to his place inside the Demon Slayer Corps, with a beginner-friendly explanation of the world rules: who the Upper Moons are, and why Muzan Kibutsuji is a fundamentally different kind of shonen antagonist.",
    "We also cover Breathing Styles as a discipline-based power system rather than a talent-based one, and how ufotable turns each duel into moving artwork with layered lighting and 3D camera work — which is exactly why the full episode in high quality hits differently.",
    "It is the fastest way to catch up before the next season. When you are done, head to the official platform for the full episode and the scenes no recap can carry.",
  ],
  "one-piece": [
    "This One Piece summary is for anyone intimidated by the episode count. We start at Luffy's departure and move through the major landmarks — Alabasta, Enies Lobby, Marineford, Wano — marking what can be condensed and what must never be skipped.",
    "We also map the world's power hierarchy: the three Devil Fruit categories, Conqueror's Haki, the Yonko and Admiral balance, and the World Government storyline that gives the fights weight far beyond the punches.",
    "If you are building a watchlist, use the order in the video, then finish the episodes in full on the official platform — the originals carry visual detail and pivotal dialogue that minutes of recap simply cannot hold.",
  ],
  "attack-on-titan": [
    "This recap reassembles Attack on Titan in a logical sequence: life inside the walls, the fall of Shiganshina, the truth behind the Titans, and the complete inversion of Eren Yeager's perspective across the final seasons.",
    "We discuss the ideas that turned it into a global phenomenon — freedom versus safety, the repeating cycle of inherited hatred, and how a victim becomes an executioner — with a clear on-screen warning before any ending spoiler.",
    "Afterwards, continue the full episode on the official platform: the score and sound design are half of this show's experience, and they only land at original quality.",
  ],
  "chainsaw-man": [
    "A quick review of Chainsaw Man: Denji wants nothing from life but a full meal and a quiet place to sleep, and a simple contract with a chainsaw devil turns him into a weapon held by a secretive public safety bureau.",
    "We unpack what makes it work — horror braided with pitch-black comedy, a rhythm that never lets the viewer feel safe, and Makima as one of the most argued-about character designs of recent years — plus where MAPPA's animation peaks.",
    "If the review landed, watch the full episode on the official platform. This show lives on vocal timing and editing, the first things any short recap loses.",
  ],
  "solo-leveling": [
    "This Solo Leveling summary explains how Sung Jinwoo goes from the weakest E-rank hunter alive to a player with a leveling system of his own, and what gates and dungeons actually mean in this world.",
    "We also cover why the pacing is so addictive: a clean upward power curve, fast payoffs for the viewer, and A-1 Pictures' fight direction backed by one of the strongest recent soundtracks.",
    "Use the video to catch up, then continue the full episode on the official platform where subtitles and original quality are available.",
  ],
  frieren: [
    "Frieren: Beyond Journey's End is a different kind of fantasy, and this summary shows why. The story begins after the Demon King is already dead, following the elf mage Frieren as she learns what time and loss mean once her human companions are gone.",
    "We talk about the deliberately quiet pacing, the way the series builds its world through small details instead of battles, and the reason it swept best-anime lists.",
    "If you want something gentle with genuinely sharp writing, continue the full episode on the official platform and give yourself time to watch it at its intended pace.",
  ],
  "spy-x-family": [
    "Spy x Family in summary: an elite spy, a contract killer and a telepathic child form a fake family that slowly turns real. The video explains the episode structure and how the show balances comedy against espionage tension.",
    "We spend time on Anya Forger as the comedic engine, and on the cold-war political backdrop that makes the series more serious than its surface, alongside the WIT Studio and CloverWorks direction.",
    "Afterwards, continue the full episode on the official platform for the licensed subtitles and the official dub where available.",
  ],
  "blue-lock": [
    "This Blue Lock summary lays out the premise: hundreds of young strikers in one facility, one goal — manufacture the most selfish striker on earth. We follow Yoichi Isagi's growth and the elimination rules that drive it.",
    "We cover the visual language, borrowed from battle anime rather than traditional sports anime, and why the series splits opinion among actual football fans.",
    "Continue the full episode on the official platform to follow each match with its full sound and visual detail.",
  ],
  haikyuu: [
    "Haikyuu!! is the best entry point into sports anime, and this summary shows why: an unremarkable school team, a short wing spiker with an extraordinary jump, and a genius setter who cannot stand losing.",
    "We explain the volleyball fundamentals as the show teaches them, how it converts tactics into real suspense, and why its matches are considered the genre's high-water mark.",
    "Watch the full episode on the official platform to feel the tension of every single point — a recap gives you the score, never the feeling.",
  ],
  naruto: [
    "This Naruto summary reorders the story from the start: an orphaned boy carrying the Nine-Tailed Fox, chasing the title of Hokage so his village will finally see him.",
    "We move through the key landmarks — Team 7, the Chunin Exams, Sasuke's defection, the Fourth Great Ninja War — with guidance on which filler stretches you can safely skip.",
    "After the summary, continue the full episodes on the official platform in the correct order for the complete emotional payoff.",
  ],
};

/** Fallback copy for series that don't have hand-written text yet. */
function fallbackCopy(title: string, year: number): string[] {
  return [
    `This video is an English summary of ${title} (${year}): where the story starts, the core cast, and the timeline of events exactly as the official episodes present them.`,
    `We also explain the power system and the central conflict, and mark the pivotal episodes worth watching in full, with a clear warning before anything spoiler-heavy.`,
    `For the original experience in full quality with licensed subtitles, continue the full episode on the official platform using the button below the summary.`,
  ];
}

const KIND_CYCLE: VideoKind[] = ["summary", "review", "amv"];

/** All video entries, derived from verified official YouTube ids. */
export const videoSummaries: VideoSummary[] = Object.keys(COPY).flatMap((slug, i) => {
  const anime = getAnime(slug);
  const youtubeId = trailerFor(slug);
  if (!anime || !youtubeId) return [];
  const kind = KIND_CYCLE[i % KIND_CYCLE.length];
  return [
    {
      animeSlug: slug,
      kind,
      youtubeId,
      title: `${KIND_LABEL[kind]} · ${anime.title}`,
      paragraphs: COPY[slug] ?? fallbackCopy(anime.title, anime.year),
    },
  ];
});

export const getVideoSummary = (slug: string) => videoSummaries.find((v) => v.animeSlug === slug);

/** Episode-level copy, falling back to series-level text. */
export function episodeVideoCopy(slug: string, title: string, number: number, year: number) {
  const base = getVideoSummary(slug);
  const intro = `${title} episode ${number} summary: the video walks through the episode's key events and character turns, with a plain-language reminder of what matters going into the next one.`;
  return [intro, ...(base ? base.paragraphs.slice(1) : fallbackCopy(title, year).slice(1))];
}
