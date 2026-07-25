export type Studio = { slug: string; name: string; founded: number; country: string; blurb: string; notable: string[]; accent: string };

export const studios: Studio[] = [
  { slug: "mappa", name: "MAPPA", founded: 2011, country: "Japan", accent: "#ef4444",
    blurb: "Founded by Madhouse veteran Masao Maruyama. In a decade, MAPPA became the studio behind Attack on Titan Final Season, Jujutsu Kaisen, and Chainsaw Man — a portfolio nobody else can match in the same span.",
    notable: ["attack-on-titan", "jujutsu-kaisen", "chainsaw-man"] },
  { slug: "ufotable", name: "ufotable", founded: 2000, country: "Japan", accent: "#22d3ee",
    blurb: "Best known for a proprietary compositing pipeline that fuses 2D character animation with dynamically-lit 3D environments. Home of Fate/stay night: Unlimited Blade Works and Demon Slayer.",
    notable: ["demon-slayer"] },
  { slug: "madhouse", name: "Madhouse", founded: 1972, country: "Japan", accent: "#a855f7",
    blurb: "One of the most respected studios in the industry, with a catalog that includes Death Note, Hunter x Hunter (2011), Monster, Frieren, and much of Satoshi Kon's filmography.",
    notable: ["death-note", "hunter-x-hunter", "frieren"] },
  { slug: "bones", name: "Bones", founded: 1998, country: "Japan", accent: "#f59e0b",
    blurb: "The studio behind Fullmetal Alchemist: Brotherhood, Mob Psycho 100, and My Hero Academia. Beloved for tight action and clean layouts.",
    notable: ["fullmetal-alchemist-brotherhood"] },
  { slug: "toei", name: "Toei Animation", founded: 1948, country: "Japan", accent: "#ff8a3d",
    blurb: "Japan's oldest major animation studio. Home of Dragon Ball, Sailor Moon, One Piece, and a long history of format-defining work.",
    notable: ["one-piece"] },
  { slug: "pierrot", name: "Pierrot", founded: 1979, country: "Japan", accent: "#ff8a3d",
    blurb: "The long-running studio behind Naruto, Bleach, and Tokyo Ghoul.",
    notable: ["naruto"] },
  { slug: "wit-cloverworks", name: "Wit Studio × CloverWorks", founded: 2012, country: "Japan", accent: "#f472b6",
    blurb: "A co-production line best known for Spy x Family, alongside independent hits including Attack on Titan (S1–3) at Wit and Bocchi the Rock at CloverWorks.",
    notable: ["spy-x-family"] },
  { slug: "a1-pictures", name: "A-1 Pictures", founded: 2005, country: "Japan", accent: "#7c5cff",
    blurb: "Prolific studio behind Sword Art Online, Kaguya-sama, 86, and Solo Leveling.",
    notable: ["solo-leveling"] },
];

export const getStudio = (slug: string) => studios.find((s) => s.slug === slug);
