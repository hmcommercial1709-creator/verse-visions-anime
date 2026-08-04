import type { Article } from "./articles";
import hxhArt from "@/assets/art/hunter-x-hunter.webp.asset.json";

/**
 * Cornerstone English guide for the Hunter x Hunter Nen cluster:
 * "hunter x hunter nen explained", "nen types", "nen abilities",
 * "nen categories".
 *
 * Original slug and publication date are preserved.
 */
export const hxhNenArticle: Article = {
  slug: "hunter-x-hunter-nen-strategy-rules",
  section: "guides",
  category: "strategy",
  tags: ["hunter-x-hunter", "nen", "power-systems", "strategy"],
  title: "Hunter x Hunter Nen Explained: All Six Nen Types and Abilities",
  seoTitle: "Hunter x Hunter Nen Explained: All Six Nen Types & Abilities",
  excerpt:
    "Hunter x Hunter Nen explained: the six Nen types, their traits, how aura is trained, and how vows and conditions make abilities stronger.",
  ogImage: hxhArt.url,
  author: "hana-mori",
  date: "2026-04-11",
  updated: "2026-08-04",
  tag: "Hunter x Hunter · Guide",
  cover: "linear-gradient(135deg, #0ea5e9, #0c2340)",
  body: [],
  related: ["hunter-x-hunter"],
  faqs: [
    {
      q: "What are the six Nen types in Hunter x Hunter?",
      a: "Enhancement, Emission, Transmutation, Conjuration, Manipulation and Specialisation. The first five sit on a hexagon where neighbouring categories are easier to learn and opposite ones are hardest; Specialisation sits apart and covers abilities that fit nowhere else.",
    },
    {
      q: "How is a person's Nen type decided?",
      a: "By water divination. A leaf is floated on a glass of water and aura is applied: the water level rising means Enhancement, the taste changing means Transmutation, the leaf moving means Manipulation, colour change means Emission, an impurity appearing means Conjuration, and anything else points to Specialisation.",
    },
    {
      q: "What is the strongest Nen type?",
      a: "None of them is strongest in the abstract. Enhancers get the most raw durability and output for the least complexity, Specialists get the most unusual effects, and everything else depends on the ability's conditions. In practice the strongest Nen user is the one whose conditions are best matched to the fight.",
    },
    {
      q: "How do vows and restrictions make Nen abilities stronger?",
      a: "Accepting a restriction increases the power of an ability in proportion to the cost. Restrictions only pay well when they could plausibly lose the fight — a condition that never triggers is cheap and yields very little extra strength.",
    },
    {
      q: "Why does revealing a Nen ability weaken it?",
      a: "Because Nen combat is fought on information. Once an opponent knows the conditions and limits of an ability, they can avoid its trigger or force it to run out, so concealment is often worth more than raw output.",
    },
  ],
  sections: [
    {
      heading: "What Is Nen in Hunter x Hunter?",
      paragraphs: [
        "Nen is the ability to control your own life energy, called aura, and shape it into a personal power. It has two halves: the four basic techniques that everyone trains, and the specialised ability a user designs for themselves. That combination is why Hunter x Hunter fights read like negotiations rather than collisions — every user arrives with a rule set, and the fight is a search for the move the other cannot answer.",
        "Quick answer: Nen is the martial art of controlling aura, your own life energy. Every user falls into one of six Nen types — Enhancement, Emission, Transmutation, Conjuration, Manipulation or Specialisation — determined by water divination. Abilities are then built with self-imposed conditions and vows, which trade freedom for proportional power.",
        "The system's central mechanic is not aura volume. It is the vow: accept a restriction, receive proportional power. That single rule turns every ability into a design puzzle with a visible price tag, and it is what makes the power system feel researched rather than invented.",
      ],
    },
    {
      heading: "The Six Nen Types at a Glance",
      paragraphs: [
        "The five ordinary categories sit on a hexagon. Neighbouring types are partially accessible to you; the type directly opposite yours is the hardest to train and the least efficient. Specialisation sits on its own, and a user can drift into it later in life.",
      ],
      blocks: [
        {
          type: "table",
          caption: "The six Nen types, their traits and canonical examples",
          columns: ["Nen Type", "Main Trait", "Typical Strength", "Example"],
          rows: [
            ["Enhancement", "Strengthens what already exists", "Highest raw durability and output for the least complexity", "Gon Freecss — Jajanken"],
            ["Emission", "Separates aura from the body", "Ranged attacks and remote effects", "Razor — aura-charged projectiles"],
            ["Transmutation", "Changes the properties of aura", "Versatile close-range tricks", "Killua Zoldyck — electricity, Godspeed"],
            ["Conjuration", "Creates a physical object from aura", "Tailor-made tools with strict rules", "Kurapika — Chain Jail"],
            ["Manipulation", "Controls living things or objects", "Board control and long game setups", "Shalnark — Black Voice"],
            ["Specialisation", "Anything the other five cannot cover", "Unique, often unrepeatable effects", "Chrollo Lucilfer — Skill Hunter"],
          ],
        },
      ],
    },
    {
      heading: "How Nen Is Learned and Trained",
      paragraphs: [
        "Training starts with the four basic techniques. Ten opens the aura nodes and holds aura around the body, Zetsu shuts the flow off to hide presence and recover, Ren floods the body with as much aura as it can carry, and Hatsu is the personal expression of aura that becomes an ability.",
        "Advanced applications follow: Gyo for concentrating aura in one spot, In for making it invisible, En for a sensing field, Shu for extending aura into an object, and Ko or Ken for allocation extremes. Water divination then identifies the user's category, which decides which kind of Hatsu they can build efficiently.",
        "Efficiency, not possibility, is the real constraint. Any user can attempt any category, but far from their own type the aura cost climbs steeply — which is exactly why a Conjurer cannot brute-force a problem an Enhancer solves, and why teams are built around the roster they have.",
      ],
    },
    {
      heading: "How Nen Abilities Are Built: Conditions and Vows",
      paragraphs: [
        "The restrictions that generate the most power are the ones that could plausibly lose the fight. A condition that never triggers is cheap and yields little. Knov, Kurapika and Chrollo all pay in ways that constrain them at the worst possible moment, by design.",
        "Information is the second currency. Knowing an opponent's ability degrades it; concealing yours is worth more than raw output. Hence the recurring structure where a fight's decisive move is a disclosure rather than a strike.",
        "If you want to see the whole system running at once, read the Chimera Ant arc as three parties trading information and restriction across a clock they can all see. The tension is arithmetic, and it is exact.",
      ],
      blocks: [
        {
          type: "poll",
          question: "Which Nen type would you want?",
          options: ["Enhancement", "Transmutation", "Conjuration", "Specialisation"],
        },
      ],
    },
    {
      heading: "Nen Types in Practice: Notable Users",
      paragraphs: [
        "Gon is the textbook Enhancer: a simple ability with escalating conditions, staked on the willingness to accept a cost. Read the full breakdown on our [Gon Freecss character profile](/character/gon-freecss).",
        "Killua shows what a Transmuter buys — his electricity work converts a narrow property change into speed, precision and lethality, covered on the [Killua Zoldyck profile](/character/killua-zoldyck).",
        "For series background, arcs and cast details, see the [Hunter x Hunter series hub](/anime/hunter-x-hunter).",
      ],
    },
    {
      heading: "Hunter x Hunter Nen: Common Questions",
      paragraphs: [
        "What are the six Nen types? Enhancement, Emission, Transmutation, Conjuration, Manipulation and Specialisation.",
        "How is a Nen type decided? By water divination — the reaction of a leaf on a glass of water when aura is applied reveals the user's category.",
        "What is the strongest Nen type? None in the abstract. Enhancers get the best output-to-complexity ratio, Specialists the most unusual effects, and the rest is decided by conditions.",
        "How do vows make abilities stronger? A restriction grants power in proportion to its cost, so only conditions that could plausibly lose the fight pay well.",
        "Why does revealing an ability weaken it? Because knowing the conditions lets an opponent dodge the trigger or run the ability out — information is the fight's main currency.",
      ],
    },
  ],
};
