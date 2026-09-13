import type { FacetEntry, CatalogType } from "./matrix";
import type { FacetPageData } from "./facet-loader";
import { parseMeta } from "./catalog-facts";

/**
 * The Arabic edition of the matrix.
 *
 * The rule the rest of this repository follows applies here too: an Arabic URL
 * is published only where there is real Arabic content behind it. A page with
 * an English heading, English sentences and hreflang="ar" is a false signal
 * and a duplicate at the same time — it tells Google there is an Arabic
 * edition and then serves the English one.
 *
 * What makes a genuine Arabic facet page possible is that the vocabulary is
 * small and closed. AniList publishes a fixed list of about twenty genres and
 * Steam a similar set; translating that list once is real translation, not
 * machine output, and the computed sentences are generated from templates
 * written in Arabic rather than run through a translator. The catalogue
 * entries keep their original titles, which is what an Arabic anime site does
 * anyway — nobody searches for a transliterated episode list.
 *
 * A facet whose value is NOT in the table gets no Arabic page. A studio name
 * has no Arabic form we can invent, so /ar/anime/browse/studio-… simply does
 * not exist, and the English page stands alone with no alternate. That is the
 * honest outcome, and it is why hasArabicEdition() gates both the route and
 * the sitemap.
 */

/** AniList's genre vocabulary, plus the Steam genres that overlap it. */
const GENRES: Record<string, string> = {
  Action: "أكشن",
  Adventure: "مغامرة",
  Comedy: "كوميديا",
  Drama: "دراما",
  Ecchi: "إتشي",
  Fantasy: "فانتازيا",
  Horror: "رعب",
  "Mahou Shoujo": "فتاة ساحرة",
  Mecha: "ميكا",
  Music: "موسيقى",
  Mystery: "غموض",
  Psychological: "نفسي",
  Romance: "رومانسي",
  "Sci-Fi": "خيال علمي",
  "Slice of Life": "شريحة من الحياة",
  Sports: "رياضة",
  Supernatural: "خارق للطبيعة",
  Thriller: "إثارة",
  Hentai: "هنتاي",
  // Steam genres that do not overlap the AniList set.
  Indie: "مستقل",
  RPG: "تقمّص أدوار",
  Simulation: "محاكاة",
  Strategy: "استراتيجية",
  Casual: "عارضة",
  Racing: "سباقات",
  "Massively Multiplayer": "متعدد اللاعبين الضخم",
  "Early Access": "وصول مبكر",
  "Free to Play": "مجانية",
};

const SEASONS: Record<string, string> = {
  WINTER: "شتاء",
  SPRING: "ربيع",
  SUMMER: "صيف",
  FALL: "خريف",
};

const PLATFORMS: Record<string, string> = {
  windows: "ويندوز",
  mac: "ماك",
  linux: "لينكس",
};

const FORMATS: Record<string, string> = {
  TV: "مسلسل تلفزيوني",
  MOVIE: "فيلم",
  OVA: "أوفا",
  ONA: "أونا",
  SPECIAL: "حلقة خاصة",
  MUSIC: "مقطع موسيقي",
};

/**
 * Whether this intersection can be served in Arabic at all.
 *
 * Studios are the reason this exists: "Madhouse" has no Arabic form, and
 * transliterating it would be inventing a name nobody searches for. Any
 * intersection carrying a dimension we cannot translate has no Arabic edition.
 */
export function hasArabicEdition(entry: FacetEntry): boolean {
  return entry.parts.every((part) => {
    switch (part.dim) {
      case "genre":
        return part.value in GENRES;
      case "year":
        return true;
      case "platform":
        return part.value in PLATFORMS;
      case "format":
        return part.value in FORMATS;
      case "season":
        return part.value.split(" ")[0] in SEASONS;
      default:
        return false;
    }
  });
}

/** "أنمي أكشن (2020)" — written as Arabic, not word-for-word from English. */
export function facetTitleAr(type: CatalogType, entry: FacetEntry): string {
  const noun = type === "game" ? "ألعاب" : "أنمي";
  const by = (dim: string) => entry.parts.find((p) => p.dim === dim);
  const genre = by("genre");
  const platform = by("platform");
  const year = by("year");
  const season = by("season");
  const format = by("format");

  const head = genre ? `${noun} ${GENRES[genre.value]}` : noun;
  const tail: string[] = [];
  if (format) tail.push(`— ${FORMATS[format.value]}`);
  if (platform) tail.push(`على ${PLATFORMS[platform.value]}`);
  if (season) {
    const [s, y] = season.value.split(" ");
    tail.push(`— ${SEASONS[s]} ${y}`);
  } else if (year) {
    tail.push(`(${year.value})`);
  }
  return [head, ...tail].join(" ");
}

/**
 * The computed sentences in Arabic. Written as Arabic templates filled with
 * the same numbers the English page uses, so the two editions state the same
 * facts without one being a translation artefact of the other.
 */
export function facetStatementsAr(type: CatalogType, data: FacetPageData): string[] {
  const noun = type === "game" ? "لعبة" : "عنوان";
  const out: string[] = [];
  const metas = data.rows.map((r) => parseMeta(r.metadata)).filter(Boolean);

  out.push(`يضم هذا التقاطع ${data.total.toLocaleString("ar-EG")} ${noun} في كتالوج GameCastle.`);

  const scores = metas
    .map((m) => m?.averageScore ?? m?.metacritic ?? null)
    .filter((s): s is number => typeof s === "number" && s > 0);
  if (scores.length >= 3) {
    const sorted = [...scores].sort((a, b) => a - b);
    const mid = sorted[sorted.length >> 1];
    out.push(
      `تتراوح تقييمات الـ${scores.length} مُقيَّمة في هذه الصفحة بين ${sorted[0]} و${sorted[sorted.length - 1]}، بوسيط ${mid}.`,
    );
  }

  const years = metas
    .map((m) => m?.seasonYear ?? m?.releaseYear ?? m?.startYear ?? null)
    .filter((y): y is number => typeof y === "number");
  if (years.length >= 3) {
    const min = Math.min(...years);
    const max = Math.max(...years);
    if (min !== max) out.push(`وتمتد من عام ${min} إلى ${max}.`);
  }

  const makers = new Map<string, number>();
  for (const m of metas) {
    const primary = (m?.studios ?? []).find((s) => s.isMain) ?? m?.studios?.[0];
    const name = primary?.name ?? m?.developers?.[0];
    if (name) makers.set(name, (makers.get(name) ?? 0) + 1);
  }
  const top = [...makers].sort((a, b) => b[1] - a[1]).slice(0, 3);
  if (top.length >= 2 && top[0][1] > 1) {
    const word = type === "game" ? "المطوّرون" : "الاستوديوهات";
    // Studio names stay in their original script: they are proper nouns with
    // no established Arabic form, and transliterating them would produce
    // something nobody searches for.
    out.push(`${word} الأكثر تكراراً هنا: ${top.map(([n, c]) => `${n} (${c})`).join("، ")}.`);
  }

  return out;
}

/** The Arabic URL for an intersection whose English path is known. */
export const arFacetPath = (englishPath: string) => `/ar${englishPath}`;
