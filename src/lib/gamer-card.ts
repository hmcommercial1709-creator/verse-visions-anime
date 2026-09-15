/**
 * The statements printed on a shareable taste card.
 *
 * Every line is computed from the picks themselves. That constraint is the
 * whole point: a card that says "you have elite taste" says nothing, is true
 * of everyone, and is worth nothing to share. A card that says "3 of your 5
 * picks are Studio MAPPA" is about one person, and is the reason someone posts
 * it.
 *
 * So there is no flattery table here and no random adjectives. Where the picks
 * do not support a statement, the statement is not made — `insights` simply
 * returns fewer lines.
 */

export interface CardPick {
  slug: string;
  name: string;
  categories?: string[] | null;
  entityType?: string | null;
}

export interface CardInsight {
  label: string;
  value: string;
  /** What in the picks produced this, so nothing is unexplained. */
  basis: string;
}

export const MAX_PICKS = 6;
export const MIN_PICKS = 3;

const tally = (values: string[]) => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = value.trim();
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
};

/** Every genre across the picks, most common first. */
export const genreSpread = (picks: CardPick[]) =>
  tally(picks.flatMap((pick) => pick.categories ?? []));

/**
 * How concentrated the taste is: the share of genre mentions taken by the
 * single most common genre. 1 means every pick shares one genre; near 0 means
 * the picks have almost nothing in common.
 */
export function focusScore(picks: CardPick[]): number | null {
  const spread = genreSpread(picks);
  if (!spread.length) return null;
  const total = spread.reduce((sum, [, count]) => sum + count, 0);
  if (!total) return null;
  return spread[0][1] / total;
}

/**
 * A rarity read, in plain words rather than a fabricated percentile.
 *
 * It is tempting to print "rarer than 92% of users" — and it would be a lie:
 * nothing here knows what other users picked. What IS knowable is how unusual
 * the COMBINATION is against the catalog's own genre vocabulary, so that is
 * what it says, and it says it as a description rather than a number.
 */
export function rarityLabel(picks: CardPick[]): string | null {
  const spread = genreSpread(picks);
  if (spread.length < 2) return null;
  const distinct = spread.length;
  if (distinct >= picks.length * 2) return "Wide open — almost no two picks overlap";
  if (distinct >= picks.length) return "Broad — you range across genres";
  if (distinct <= 2) return "Laser-focused — you know exactly what you like";
  return "Balanced — a clear lean with room to roam";
}

/** The lines the card prints. Fewer picks simply mean fewer lines. */
export function insights(picks: CardPick[]): CardInsight[] {
  const out: CardInsight[] = [];
  if (picks.length < MIN_PICKS) return out;

  const spread = genreSpread(picks);
  if (spread.length) {
    const [genre, count] = spread[0];
    out.push({
      label: "Signature genre",
      value: genre,
      basis: `${count} of your ${picks.length} picks ${count === 1 ? "is" : "are"} tagged ${genre}`,
    });
  }

  if (spread.length >= 2) {
    out.push({
      label: "Range",
      value: `${spread.length} genres`,
      basis: `across ${picks.length} picks`,
    });
  }

  const focus = focusScore(picks);
  if (focus !== null) {
    out.push({
      label: "Focus",
      value: `${Math.round(focus * 100)}%`,
      basis: "share of your genre tags taken by your top genre",
    });
  }

  const rarity = rarityLabel(picks);
  if (rarity) out.push({ label: "Shape", value: rarity, basis: "from the spread above" });

  const kinds = tally(picks.map((p) => p.entityType ?? "").filter(Boolean));
  if (kinds.length > 1) {
    out.push({
      label: "Crossover",
      value: kinds.map(([k, n]) => `${n} ${k}`).join(" · "),
      basis: "you picked across more than one catalog",
    });
  }

  return out;
}

/** Stable share text; no emoji soup, no invented superlatives. */
export function shareCaption(picks: CardPick[]): string {
  const spread = genreSpread(picks);
  const top = spread[0]?.[0];
  const names = picks
    .slice(0, 3)
    .map((p) => p.name)
    .join(", ");
  return top
    ? `My taste card: ${top} — ${names}${picks.length > 3 ? ` +${picks.length - 3}` : ""}`
    : `My taste card: ${names}`;
}

/*
 * CTA_SAFE_BAND_PX, adsInBand(), ctaRevealThreshold() and shouldRevealCta()
 * stood here. They existed to keep a fixed bottom-right button clear of ad
 * boxes and to decide when a scroll had gone far enough to reveal it.
 *
 * The button moved into the site header, next to search. In normal flow it
 * cannot overlap an ad and there is no scroll threshold to tune, so the
 * safest version of this code is the version that no longer exists.
 */
