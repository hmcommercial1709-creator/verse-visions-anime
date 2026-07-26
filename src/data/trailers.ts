/**
 * Verified official YouTube trailer IDs (checked against the oEmbed endpoint,
 * all from official publisher channels). Used by the video player so a card
 * mounts a real embed instead of degrading to an off-site search link.
 */
export const TRAILERS: Record<string, string> = {
  "jujutsu-kaisen": "pkKu9hLT-t8",
  "demon-slayer": "x7uLutVRBfI",
  "one-piece": "Ades3pQbeh8",
  "attack-on-titan": "MUCN-JwUvbY",
  "chainsaw-man": "l96zmDlWCBk",
  "solo-leveling": "LrNvF8gcJPM",
  frieren: "Iwr1aLEDpe4",
  "spy-x-family": "ofXigq9aIpo",
  "blue-lock": "QAlsuW5EXUg",
  haikyuu: "JOGp2c7-cKc",
  naruto: "22R0j8UKRzY",
};

/** Keyword aliases so free-text search queries resolve to a real trailer. */
const ALIASES: Array<[RegExp, string]> = [
  [/jujutsu|gojo|shibuya|sorcerer/i, "jujutsu-kaisen"],
  [/demon slayer|kimetsu|tanjiro/i, "demon-slayer"],
  [/one piece|luffy|wano/i, "one-piece"],
  [/attack on titan|shingeki|eren/i, "attack-on-titan"],
  [/chainsaw|denji|makima/i, "chainsaw-man"],
  [/solo leveling|jinwoo/i, "solo-leveling"],
  [/frieren/i, "frieren"],
  [/spy ?x ?family|anya|loid/i, "spy-x-family"],
  [/blue lock|isagi/i, "blue-lock"],
  [/haikyu/i, "haikyuu"],
  [/naruto|sasuke|shippuden/i, "naruto"],
];

/** Resolve a trailer id from an anime slug or a free-text query. */
export function trailerFor(input?: string): string | undefined {
  if (!input) return undefined;
  const direct = TRAILERS[input];
  if (direct) return direct;
  const match = ALIASES.find(([re]) => re.test(input));
  return match ? TRAILERS[match[1]] : undefined;
}
