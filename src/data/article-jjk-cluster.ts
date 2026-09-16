import { assetUrl } from "@/lib/asset-url";
import type { Article } from "./articles";
import jjkArt from "@/assets/art/jujutsu-kaisen.webp.asset.json";
import jjkS2Art from "@/assets/art/review-jujutsu-kaisen-s2.webp.asset.json";

/**
 * The Jujutsu Kaisen mechanics cluster.
 *
 * The site already answers the franchise's narrative questions — watch order,
 * the Shibuya timeline, the three great families, and Gojo's Limitless. What
 * it had no page for was the system those stories run on: where cursed energy
 * comes from, what a domain actually does, how the grading scale works, and
 * who Sukuna is underneath the fingers.
 *
 * Four pages, written to be read in any order and linked so that each one
 * hands the reader the next question it raises. Every page targets a distinct
 * long-tail intent rather than the franchise head term, which a six-week-old
 * site has no chance of taking from Fandom or MyAnimeList.
 *
 * Nothing here asserts a rating, a ranking the series does not make, or a
 * detail the manga leaves open. Where the answer is genuinely unsettled the
 * text says so instead of inventing a resolution.
 */

const shared = {
  publicationStatus: "published" as const,
  section: "guides" as const,
  category: "analysis" as const,
  author: "hana-mori",
  date: "2026-09-16",
  cover: "linear-gradient(135deg, #7c3aed, #1e1b4b)",
};

/* ------------------------------------------------- 1. cursed energy ----- */

export const jjkCursedEnergyArticle: Article = {
  ...shared,
  slug: "jujutsu-kaisen-cursed-energy-explained",
  tags: ["jujutsu-kaisen", "cursed-energy", "cursed-techniques", "power-systems", "black-flash"],
  title: "Jujutsu Kaisen Cursed Energy Explained: Techniques, Output and Limits",
  seoTitle: "Cursed Energy Explained: Techniques, Black Flash & Binding Vows",
  excerpt:
    "How cursed energy works in Jujutsu Kaisen: where it comes from, why cursed techniques cannot be learned, what reverse cursed technique costs, and how black flash and binding vows change a fight.",
  ogImage: assetUrl(jjkArt.url),
  tag: "Jujutsu Kaisen · Guide",
  body: [],
  related: ["jujutsu-kaisen", "hunter-x-hunter", "one-piece", "bleach"],
  faqs: [
    {
      q: "Where does cursed energy come from in Jujutsu Kaisen?",
      a: "From the negative emotions of ordinary people — fear, hatred, regret, resentment. Everyone produces it and almost everyone leaks it away without noticing. A sorcerer is simply someone who can perceive that flow and hold on to it instead of losing it.",
    },
    {
      q: "Can a sorcerer learn a new cursed technique?",
      a: "No. An innate technique is fixed from birth and cannot be swapped, taught or copied. What a sorcerer can improve is output, control, speed, cursed-tool skill and the conditions they attach to what they already have — which is why two users of the same technique are rarely equally dangerous.",
    },
    {
      q: "What is reverse cursed technique and why is it so rare?",
      a: "Multiplying negative cursed energy by negative cursed energy produces positive energy, which heals. The difficulty is that it requires running two flows of cursed energy at once with precision, under injury, and the cost of getting it wrong is immediate. Very few sorcerers manage it, and fewer can apply it to anyone other than themselves.",
    },
    {
      q: "What is black flash?",
      a: "A hit where cursed energy lands within roughly a ten-thousandth of a second of the physical impact. The space at the point of contact distorts and the damage is multiplied — the series puts the multiplier at 2.5. It cannot be reliably forced; it is a matter of timing under pressure, which is why landing one is treated as a threshold moment for a sorcerer.",
    },
    {
      q: "What is a binding vow?",
      a: "A self-imposed restriction that buys power in proportion to what it genuinely costs. A vow that could never plausibly lose you the fight pays almost nothing. Vows can also be made between two people, in which case breaking the terms carries its own penalty.",
    },
  ],
  sections: [
    {
      heading: "What Cursed Energy Actually Is",
      paragraphs: [
        "Cursed energy is the waste product of human feeling. Fear on a crowded train, resentment held for years, the low background dread of a hospital corridor — all of it leaks out of ordinary people and pools in the places that produced it. Left alone long enough and in enough quantity, that pool takes shape on its own and becomes a curse.",
        "Quick answer: cursed energy comes from negative emotion, sorcerers are the small minority who can perceive and retain it, and a sorcerer's innate cursed technique is fixed at birth. Output, control and the conditions a user attaches to their technique are what actually decide fights — not who holds the larger reserve.",
        "That last point is what separates Jujutsu Kaisen from a straightforward power-level series. A sorcerer with a modest technique and excellent control beats a stronger opponent with a clumsy one often enough that the pattern is the rule rather than the exception. The system rewards preparation and precision, and it punishes anyone who treats raw output as the whole answer.",
        "This guide works through the system in the order it actually matters: where the energy comes from, what a cursed technique is and is not, the two techniques every sorcerer wants and almost none has, and the rules — vows, tools, counters — that decide how all of it plays out under pressure.",
      ],
    },
    {
      heading: "Cursed Techniques Are Inherited, Not Learned",
      paragraphs: [
        "A cursed technique is an innate pattern for shaping cursed energy, and it arrives with the sorcerer. It cannot be taught, swapped or copied by ordinary means. Some run in families — which is the whole basis of the clan politics covered in [the three great sorcerer families](/article/three-great-sorcerer-families) — and some appear with no lineage behind them at all.",
        "This is why training in Jujutsu Kaisen looks so different from training in most battle series. Nobody unlocks a second technique through effort. What improves is everything around it: how much energy the user can put out, how finely they can control it, how fast they can apply it, how well they fight without it, and how cleverly they have shaped its conditions.",
        "It also explains why the series keeps returning to hand-to-hand combat. A sorcerer who can only win by using their technique is a sorcerer who can be read. Physical skill, cursed tools and the willingness to fight without spending energy are not fallbacks — they are the difference between a technique that works once and one that keeps working.",
      ],
      blocks: [
        {
          type: "table",
          caption: "What a sorcerer can and cannot change about their own power",
          columns: ["Fixed at birth", "Improvable with training", "Why it matters"],
          rows: [
            [
              "The innate cursed technique itself",
              "Output — how much energy is available",
              "Decides how long a technique can be sustained",
            ],
            [
              "Whether a technique exists at all",
              "Control — how precisely energy is shaped",
              "Separates two users of the same technique",
            ],
            [
              "Family or lineage the technique came from",
              "Speed of application under pressure",
              "A technique that lands too late does nothing",
            ],
            [
              "—",
              "Conditions and binding vows attached to it",
              "The main way a weaker technique becomes dangerous",
            ],
          ],
        },
      ],
    },
    {
      heading: "Reverse Cursed Technique: Healing at a Price",
      paragraphs: [
        "Cursed energy is negative by definition, so it cannot heal anything on its own. Reverse cursed technique gets around that with a piece of arithmetic the series states plainly: multiply negative by negative and the result is positive. Run two flows of cursed energy against each other correctly and what comes out restores rather than destroys.",
        "The difficulty is entirely in the execution. It means holding two separate flows steady, at the same time, while injured — which is precisely when concentration is hardest to keep. Most sorcerers never manage it. Among those who do, the majority can only apply it to themselves; healing another person is a further step again, and the series treats sorcerers who can do it as strategically valuable in their own right.",
        "Reverse cursed technique is also what makes certain fights unwinnable by attrition. An opponent who can close their own wounds mid-fight cannot be worn down; they have to be overwhelmed, outlasted on energy, or hit with something they cannot repair in time. [Gojo's Limitless](/article/gojo-satoru-limitless-technique-explained) is the clearest example of a defence that has to be solved rather than ground down.",
      ],
    },
    {
      heading: "Black Flash: The Two-and-a-Half Multiplier",
      paragraphs: [
        "When a physical strike and its cursed energy land within roughly a ten-thousandth of a second of each other, space at the point of impact distorts and the damage is multiplied by 2.5. That is black flash, and it is the single most efficient thing a sorcerer can do with a fist.",
        "What makes it matter narratively is that it cannot be commanded. It is a timing window too small to aim for deliberately, so landing one depends on a state of focus that tends to arrive in the middle of a fight rather than before it. Sorcerers who have landed one describe the experience as clarifying — and the series repeatedly uses a first black flash as the marker that a character has crossed from competent to genuinely dangerous.",
        "Chains of consecutive black flashes are rarer still, and the series treats each one in a row as a meaningful escalation rather than a stat. This is the same design instinct behind [Hunter x Hunter's Nen](/article/hunter-x-hunter-nen-strategy-rules): the strongest options are gated behind conditions the user cannot simply decide to meet.",
      ],
    },
    {
      heading: "Binding Vows: Buying Power With Real Risk",
      paragraphs: [
        "A binding vow is a restriction a sorcerer accepts in exchange for strength, and the exchange rate is honest. A condition that genuinely narrows what you can do — a technique that only works at a certain range, on a certain target, after a certain declaration — returns real power. A condition that could never plausibly cost you the fight returns almost nothing.",
        "The system has a second form: vows made between two parties, where each side gives something and breaking the terms carries its own penalty. These are used for truces, for borrowed techniques and for arrangements between people who have no reason to trust each other, and they are binding in a way that promises in most series are not.",
        "The most quietly important rule is that revealing a technique's conditions out loud tends to strengthen it. Explanation is itself a restriction — it hands the opponent information — and the system pays for that. It is also why so many Jujutsu Kaisen fights contain a character calmly explaining exactly how they are about to win.",
      ],
      blocks: [
        {
          type: "table",
          caption: "Common vow shapes and what each one buys",
          columns: ["Restriction accepted", "What it returns", "Why the price is fair"],
          rows: [
            [
              "The technique only works at close range",
              "Higher output or efficiency",
              "Closing distance is where a sorcerer is most exposed",
            ],
            [
              "The user explains the technique aloud",
              "A direct increase in the technique's power",
              "The opponent can now plan around it",
            ],
            [
              "A condition that must be met before use",
              "A far stronger effect when it lands",
              "The condition can fail at the worst moment",
            ],
            [
              "A vow agreed between two people",
              "Access to something otherwise unavailable",
              "Breaking the terms carries its own penalty",
            ],
          ],
        },
      ],
    },
    {
      heading: "Cursed Tools, Cursed Objects and Fighting Without a Technique",
      paragraphs: [
        "Not all power in the series is innate. Cursed tools are weapons made or refined to carry cursed energy, and they let a sorcerer apply force that has nothing to do with their own technique. Some are graded like sorcerers are; the strongest are treated as assets worth fighting over.",
        "Cursed objects are a separate category: physical remains or artefacts that hold a curse's power in storage. The twenty fingers of Sukuna are the series' central example, and they are the reason the plot happens at all — see [the full breakdown of Sukuna](/article/jujutsu-kaisen-sukuna-explained) for how a thousand-year-old sorcerer ended up distributed across a country in pieces.",
        "Between tools, hand-to-hand skill and sheer output, it is entirely possible to be dangerous in Jujutsu Kaisen without a useful innate technique — and several of the series' most respected sorcerers are exactly that. It is one of the cleaner ideas in the system: the technique you were born with sets your ceiling, not your floor.",
      ],
    },
    {
      heading: "Where Cursed Energy Goes Next",
      paragraphs: [
        "Everything above is the groundwork for the system's two large mechanics. The first is the domain — a technique's final form, where the rules of a space are rewritten so that an attack cannot miss. That has its own page: [Domain Expansion explained](/article/jujutsu-kaisen-domain-expansion-explained), including the counters that make domains survivable.",
        "The second is the grading scale that the jujutsu world uses to decide who is sent where, and how dangerous a curse is before anyone engages it. [The grade system](/article/jujutsu-kaisen-grades-explained) covers both sorcerer ranks and cursed spirit classes, and why the two scales do not mean quite the same thing.",
        "If you are coming to the series rather than the mechanics, [the complete watch order](/article/jujutsu-kaisen-watch-order-and-manga-jump) covers the anime, the film and where the manga picks up.",
      ],
    },
  ],
};

/* ---------------------------------------------- 2. domain expansion ----- */

export const jjkDomainExpansionArticle: Article = {
  ...shared,
  slug: "jujutsu-kaisen-domain-expansion-explained",
  tags: ["jujutsu-kaisen", "domain-expansion", "sure-hit", "cursed-techniques", "simple-domain"],
  title: "Jujutsu Kaisen Domain Expansion Explained: Sure-Hit, Barriers and Counters",
  seoTitle: "Domain Expansion Explained: Sure-Hit Effect, Barriers & Counters",
  excerpt:
    "What a domain expansion actually does in Jujutsu Kaisen: the barrier, the sure-hit effect, why two domains clash the way they do, and the three counters that let a sorcerer survive one.",
  ogImage: assetUrl(jjkS2Art.url),
  tag: "Jujutsu Kaisen · Guide",
  body: [],
  related: ["jujutsu-kaisen", "hunter-x-hunter", "bleach", "solo-leveling"],
  faqs: [
    {
      q: "What does a domain expansion actually do?",
      a: "It builds a barrier containing the user's innate domain, and inside that space their cursed technique is given a sure-hit effect — it lands automatically rather than having to connect. It is the strongest expression of a cursed technique and the most expensive thing a sorcerer can do with cursed energy.",
    },
    {
      q: "What is the sure-hit effect?",
      a: "Inside a completed domain, the user's technique does not need to travel, aim or be dodged. It applies. This is why the counters below target the barrier and the guarantee rather than trying to avoid the attack — inside a finished domain there is nothing to avoid.",
    },
    {
      q: "What happens when two domain expansions collide?",
      a: "The domains push against each other and the more refined one takes the space. Refinement here means how completely the domain is realised, not simply who has more cursed energy — an incomplete or barrierless domain is at a disadvantage against a finished one even when the user is individually stronger.",
    },
    {
      q: "How can you survive someone else's domain?",
      a: "Three ways appear in the series: Simple Domain, which projects a small neutral territory that negates the sure-hit inside its radius; Falling Blossom Emotion, which repels the barrier on contact; and casting your own domain to contest the space. All three demand training that most sorcerers never complete.",
    },
    {
      q: "Why do some sorcerers use a domain without a barrier?",
      a: "An open domain covers a far wider area than a sealed one, at the cost of the guaranteed hit — the technique becomes near-unavoidable rather than automatic. It is a deliberate trade of certainty for range, and it also means the target is not sealed in with the user.",
    },
  ],
  sections: [
    {
      heading: "What a Domain Expansion Is",
      paragraphs: [
        "A domain expansion is a cursed technique taken to its conclusion. The user constructs a barrier, fills it with an environment built out of their own technique, and inside that space the technique stops being something that has to connect and becomes something that simply applies.",
        "Quick answer: a domain is a barrier plus an innate environment plus a sure-hit effect. It costs an enormous amount of cursed energy, it is the strongest move most sorcerers will ever have, and there are exactly three known ways to survive being caught in one.",
        "The reason domains dominate late-series fights is not that they do more damage. It is that they remove the part of combat where skill lives. No dodging, no blocking, no reading the attack — inside a finished domain the outcome is decided before the technique resolves. Everything interesting therefore happens in the seconds before a domain closes, or in the counters that break the guarantee after it does.",
      ],
    },
    {
      heading: "The Three Parts of a Domain",
      paragraphs: [
        "A complete domain has a barrier, an environment and a sure-hit effect, and the three are not independent. The barrier defines the space. The environment is the innate domain made physical — the landscape a technique would produce if it were a place rather than an action. The sure-hit effect is what the first two buy.",
        "Building all three at once is the hard part, and it is why so few sorcerers have a domain at all. An incomplete domain — a barrier that does not fully close, or an environment without the guarantee — still does something, but it forfeits the property that makes domains decisive. Several characters fight with exactly that: a domain good enough to shape a fight, not good enough to end one.",
        "Cost is the other constraint. A domain drains cursed energy at a rate that makes it unsustainable, so it is opened to finish an exchange rather than to conduct one. A sorcerer who opens a domain and fails to resolve the fight inside it has spent their best option and is now the one in trouble.",
      ],
      blocks: [
        {
          type: "table",
          caption: "The components of a domain and what is lost when one is missing",
          columns: ["Component", "What it provides", "Consequence if incomplete"],
          rows: [
            [
              "Barrier",
              "Seals the space and defines its limits",
              "The domain can be escaped or contested from outside",
            ],
            [
              "Innate environment",
              "The technique expressed as a place",
              "The effect weakens or applies unevenly",
            ],
            [
              "Sure-hit effect",
              "The technique lands automatically",
              "Without it the attack can still be avoided",
            ],
            [
              "Cursed energy to sustain it",
              "Holds all three open",
              "The domain collapses before it resolves anything",
            ],
          ],
        },
      ],
    },
    {
      heading: "Domain Clash: Why Refinement Beats Raw Power",
      paragraphs: [
        "When two domains open against each other they do not simply coexist. They push, and the space goes to the more refined one. Refinement is a measure of how completely the domain is realised — barrier integrity, how fully the environment expresses the technique, how cleanly the sure-hit is enforced.",
        "This is one of the system's better decisions, because it means a domain clash is not a numbers check. A sorcerer with less raw output and a finished domain can take the space from someone stronger whose domain is unbarriered or unpolished. The series uses this repeatedly to make fights turn on preparation rather than on who was written as more powerful.",
        "It also gives the counters below their importance. If domain versus domain were settled purely by energy, everything would collapse into a single ranking. Because it is settled by construction quality, a sorcerer who cannot win a clash still has two other options.",
      ],
    },
    {
      heading: "The Three Counters to a Domain",
      paragraphs: [
        "Simple Domain is the first and most widely taught. Rather than contesting the whole space, the user projects a small neutral territory around themselves — typically a radius of a few metres — inside which the enemy's sure-hit effect does not apply. It does not remove the domain. It carves out a pocket where the guarantee stops working, and the fight becomes survivable again.",
        "Falling Blossom Emotion is the second: cursed energy applied so that contact with a domain's barrier repels it rather than admitting the user. It is a counter to being sealed in at all, and it is described in the series as a difficult, specialised skill rather than a standard part of training.",
        "The third is simply to open your own domain and contest the space, which returns to the refinement question above. All three require training that most sorcerers never complete, which is the point: domains are supposed to be close to unanswerable, and the answers are supposed to be rare.",
      ],
      blocks: [
        {
          type: "table",
          caption: "How each counter interacts with a domain",
          columns: ["Counter", "What it targets", "Limitation"],
          rows: [
            [
              "Simple Domain",
              "The sure-hit effect, inside a small radius",
              "Protects a pocket, not the whole space",
            ],
            [
              "Falling Blossom Emotion",
              "The barrier itself, on contact",
              "Highly specialised and difficult to learn",
            ],
            [
              "Your own domain expansion",
              "The opposing domain's claim to the space",
              "Loses to a more refined domain",
            ],
            [
              "Leaving before it closes",
              "The window before the barrier completes",
              "Only works in the seconds before it seals",
            ],
          ],
        },
      ],
    },
    {
      heading: "Open Domains and the Range Trade",
      paragraphs: [
        "Not every domain uses a barrier. An open domain covers a much larger area than a sealed one and does not trap the user inside with the target, but it gives up the guaranteed hit — the technique becomes extremely difficult to avoid rather than impossible.",
        "That trade is worth taking in specific circumstances. Against several opponents, or in a space where sealing yourself in with one of them is the worse risk, area beats certainty. Against a single strong opponent who can be sealed in, it is usually the weaker choice — and in a clash against a completed domain, the lack of a barrier is a real disadvantage.",
        "[Sukuna's Malevolent Shrine](/article/jujutsu-kaisen-sukuna-explained) is the series' defining example of an open domain, and it is deliberately positioned as terrifying for exactly this reason: the area it covers is not bounded by a room.",
      ],
      blocks: [
        {
          type: "spoiler",
          scope: "Jujutsu Kaisen — mid-series arcs",
          level: "major",
          heading: "Domains beyond the Shibuya arc",
          paragraphs: [
            "The arcs after Shibuya push domains further as a mechanic — domains built around a condition rather than a straightforward attack, and domains used defensively rather than to finish a fight. If you are watching the anime and want to stay clear of that territory, [the watch order guide](/article/jujutsu-kaisen-watch-order-and-manga-jump) marks where the adaptation currently stands.",
          ],
        },
      ],
    },
    {
      heading: "Reading a Domain Fight",
      paragraphs: [
        "Once the mechanics are clear, Jujutsu Kaisen's late fights become much easier to follow. Watch for the moment a character starts forming a barrier, because everything before it is positioning and everything after it is resolution. Watch for whether a domain closes fully. Watch for a small ring of light around a character's feet, which is Simple Domain and means the sure-hit has just stopped applying.",
        "The system also explains some apparent inconsistencies. A sorcerer who does not open a domain against a weaker opponent is conserving the energy, not holding back for drama. A sorcerer who opens one immediately is signalling that they expect not to win a longer exchange.",
        "For the energy economics underneath all of this — output, control, reverse cursed technique and the vows that change the arithmetic — start with [cursed energy explained](/article/jujutsu-kaisen-cursed-energy-explained). For who gets sent to face what, see [the grade system](/article/jujutsu-kaisen-grades-explained).",
      ],
    },
  ],
};

/* -------------------------------------------------------- 3. Sukuna ----- */

export const jjkSukunaArticle: Article = {
  ...shared,
  slug: "jujutsu-kaisen-sukuna-explained",
  tags: ["jujutsu-kaisen", "sukuna", "malevolent-shrine", "cursed-objects", "villains"],
  title: "Ryomen Sukuna Explained: The Fingers, Malevolent Shrine and the King of Curses",
  seoTitle: "Ryomen Sukuna Explained: Fingers, Malevolent Shrine & Vessel Rules",
  excerpt:
    "Who Ryomen Sukuna is, why twenty fingers had to be preserved instead of destroyed, how Dismantle and Cleave differ, and what the binding vow with Yuji Itadori actually allows.",
  ogImage: assetUrl(jjkArt.url),
  tag: "Jujutsu Kaisen · Character",
  body: [],
  related: ["jujutsu-kaisen", "attack-on-titan", "chainsaw-man", "bleach"],
  faqs: [
    {
      q: "Is Sukuna a curse or a human?",
      a: "He was a human sorcerer roughly a thousand years before the present day, not a curse born from negative emotion. He is called the King of Curses for what he did and what he became after death, not because of what he originally was — which is why his remains behave as cursed objects rather than as a curse that can simply be exorcised.",
    },
    {
      q: "Why were Sukuna's fingers preserved instead of destroyed?",
      a: "Because they could not be destroyed. Jujutsu society sealed the twenty fingers as cursed objects and distributed them precisely because no method existed to remove them permanently, and leaving them intact under supervision was judged safer than failing to destroy them in the open.",
    },
    {
      q: "What is the difference between Dismantle and Cleave?",
      a: "Both are cutting techniques. Dismantle is a fixed slashing attack applied to a target, while Cleave adjusts to the target's own durability and cursed energy, which lets it cut things a fixed attack would not. The distinction matters because it means an opponent's defences do not straightforwardly reduce the damage.",
    },
    {
      q: "What is Malevolent Shrine?",
      a: "Sukuna's domain expansion. It is an open domain with no barrier, which gives it an unusually large area of effect at the cost of the absolute guarantee a sealed domain provides. Inside it his cutting techniques apply continuously across that area.",
    },
    {
      q: "Why can Sukuna not simply take over Yuji Itadori?",
      a: "Because of a binding vow made between them. The terms of that vow are what keep control with Yuji under normal conditions and define the narrow circumstances in which it changes hands — which is the reason the series can keep Sukuna present without the story ending.",
    },
  ],
  sections: [
    {
      heading: "Who Sukuna Was Before He Was a Curse",
      paragraphs: [
        "Ryomen Sukuna is not a curse in the technical sense the series uses everywhere else. He was a human sorcerer, active roughly a thousand years before the story, during a period jujutsu society remembers as its golden age — and the reason he is remembered at all is that the sorcerers of that age could not kill him.",
        "Quick answer: Sukuna was a human sorcerer of the golden age, his remains became twenty indestructible cursed objects, Yuji Itadori is his vessel, his techniques are Dismantle and Cleave, and his domain is the barrierless Malevolent Shrine.",
        "That origin matters mechanically. Curses born from negative emotion can be exorcised — dispel the emotion's accumulation and the thing stops existing. Sukuna's remains are not that. They are the physical leftovers of a person, which is why sealing and distribution was the only option available, and why the whole plot proceeds from a decision made by people who knew they were choosing the least bad option.",
      ],
    },
    {
      heading: "The Twenty Fingers and Why They Were Never Destroyed",
      paragraphs: [
        "Twenty fingers were preserved, sealed and scattered. It reads as negligence until you take the reason seriously: no method existed to destroy them. Attempting destruction and failing would have meant losing track of an object that cannot be unmade, in the open, with no way to recover it.",
        "Sealed distribution is a containment strategy, not a storage strategy. Each finger is individually dangerous — capable of drawing curses to it and of producing effects on anyone who ingests it — and spreading them prevents any single failure from releasing the whole. It is the same logic as separating parts of anything you cannot neutralise.",
        "The strategy holds exactly as long as nobody eats one. The series begins with a high-schooler doing precisely that, and the remainder of the plot is jujutsu society managing the consequences of a containment plan meeting an ordinary teenager with good instincts and no information.",
      ],
    },
    {
      heading: "Dismantle, Cleave and the Fire Technique",
      paragraphs: [
        "Sukuna's cursed technique is cutting, and it comes in two forms that are easy to confuse. Dismantle is a fixed slashing attack — a set of cuts applied to a target regardless of what that target is. Cleave adjusts to the target: it reads durability and cursed energy and calibrates the cut to that specific defence.",
        "The distinction is the whole reason his technique scales. A fixed attack is answerable by being tough enough. An attack that adjusts to the toughness it meets is not, which is why defensive strength alone is a poor answer to him and why opponents tend to look for ways to avoid being targeted rather than ways to endure it.",
        "Alongside the cutting techniques the series gives him a fire technique, which the manga treats as a separate extension of his repertoire rather than a variation on the cuts. For the general rules about what a technique can and cannot be, see [cursed energy explained](/article/jujutsu-kaisen-cursed-energy-explained).",
      ],
      blocks: [
        {
          type: "table",
          caption: "Sukuna's known techniques and what each one is for",
          columns: ["Technique", "What it does", "Why it matters"],
          rows: [
            [
              "Dismantle",
              "A fixed slashing attack applied to the target",
              "Efficient, fast, and enough for most opponents",
            ],
            [
              "Cleave",
              "A cut calibrated to the target's durability and energy",
              "Defensive strength does not straightforwardly reduce it",
            ],
            [
              "Fire technique",
              "An extension beyond the cutting techniques",
              "Removes the assumption that he only has one answer",
            ],
            [
              "Malevolent Shrine",
              "Open domain expansion, no barrier",
              "Very large area of effect, no sealed guarantee",
            ],
          ],
        },
      ],
    },
    {
      heading: "Malevolent Shrine: Area Instead of Certainty",
      paragraphs: [
        "Malevolent Shrine is the series' defining open domain. It has no barrier, which means it is not confined to a room and everyone inside its radius is in it — but it also means it does not carry the absolute sure-hit guarantee that a sealed domain provides. What it produces instead is a continuous application of his cutting techniques across an enormous area.",
        "As a trade this is unusually favourable to him specifically, because the thing a barrier normally buys — certainty against one target — matters less when the technique is cutting and the area is that large. Against a single opponent who could otherwise be sealed in, it is the weaker configuration; against everything else in the vicinity, it is far worse for everyone present.",
        "The general mechanics of barriers, sure-hit effects and what happens when two domains meet are covered in [Domain Expansion explained](/article/jujutsu-kaisen-domain-expansion-explained), including the three counters that make any domain survivable.",
      ],
    },
    {
      heading: "The Vessel and the Binding Vow",
      paragraphs: [
        "Yuji Itadori is not possessed in the ordinary sense. He is a vessel, and the arrangement between him and Sukuna is governed by a binding vow — the same mechanic that lets any sorcerer trade a restriction for power, applied here to the question of who is in control of a body.",
        "The terms of that vow are what make the series possible. Without them the story would be over in a chapter: an entity of Sukuna's capability with unrestricted access to a body has no opposition worth writing. With them, control stays with Yuji under normal conditions and changes hands only in specific circumstances, which turns Sukuna from an ending into a permanent, negotiated threat.",
        "It is also a neat demonstration of how seriously the series takes its own rules. The vow is not a plot convenience bolted on; it is the standard mechanic, used at the largest possible stakes, with the same logic that governs a sorcerer choosing to fight at close range for extra output.",
      ],
      blocks: [
        {
          type: "spoiler",
          scope: "Jujutsu Kaisen — Shibuya and after",
          level: "major",
          heading: "How the arrangement changes later",
          paragraphs: [
            "The balance between vessel and occupant does not stay fixed, and the Shibuya arc is where the terms are tested hardest. [The Shibuya Incident timeline](/article/shibuya-incident-timeline) covers what happens there in order and what it costs the jujutsu world.",
          ],
        },
      ],
    },
    {
      heading: "Where Sukuna Sits in the Power Structure",
      paragraphs: [
        "Sukuna is the reference point the series measures other threats against, which makes him useful for reading the rest of the cast. When a character is described as special grade, the implied question is how far they are from him rather than how far they are from an ordinary sorcerer — and [the grade system](/article/jujutsu-kaisen-grades-explained) explains why that scale stops being informative at the top.",
        "He is also the clearest argument that the series' power system is about conditions rather than numbers. A technique that adjusts to its target, a domain that trades certainty for area, and a vow that constrains the strongest entity in the setting are all the same design idea: power in Jujutsu Kaisen is defined by what it is allowed to do, not by how much of it there is.",
        "For the political history that produced the sorcerers standing against him, [the three great families](/article/three-great-sorcerer-families) covers the clans and their hold on jujutsu society.",
      ],
    },
  ],
};

/* -------------------------------------------------------- 4. grades ----- */

export const jjkGradesArticle: Article = {
  ...shared,
  slug: "jujutsu-kaisen-grades-explained",
  tags: ["jujutsu-kaisen", "grades", "special-grade", "cursed-spirits", "power-scaling"],
  title: "Jujutsu Kaisen Grades Explained: Sorcerer Ranks and Cursed Spirit Classes",
  seoTitle: "Jujutsu Kaisen Grades Explained: Sorcerer Ranks & Curse Classes",
  excerpt:
    "How the grading system works in Jujutsu Kaisen: the sorcerer ranks from grade 4 to special grade, the semi-grades in between, how cursed spirits are classed, and why the two scales do not mean the same thing.",
  ogImage: assetUrl(jjkS2Art.url),
  tag: "Jujutsu Kaisen · Guide",
  body: [],
  related: ["jujutsu-kaisen", "solo-leveling", "hunter-x-hunter", "my-hero-academia"],
  faqs: [
    {
      q: "What are the sorcerer grades in Jujutsu Kaisen, in order?",
      a: "From lowest to highest: grade 4, grade 3, semi-grade 2, grade 2, semi-grade 1, grade 1, and special grade. The semi-grades sit between the numbered ranks and mark a sorcerer who has met some but not all of the requirements for the next full grade.",
    },
    {
      q: "How is a sorcerer's grade decided?",
      a: "By assessment from higher-ranking sorcerers and the jujutsu authorities, weighing the usefulness of the innate technique, cursed energy output, control, combat experience and results in the field. It is a judgement about assignment — what this person can safely be sent to deal with — not a score.",
    },
    {
      q: "Is a special grade curse as strong as a special grade sorcerer?",
      a: "Not necessarily. The two scales describe different things: a sorcerer's grade is a judgement about capability and deployment, while a curse's grade is a threat classification for the people who have to exorcise it. They use the same words and are not directly comparable.",
    },
    {
      q: "What makes a curse special grade?",
      a: "Enough accumulated cursed energy and, in the most dangerous cases, intelligence — a curse that can think, plan and use a cursed technique is a categorically different problem from one that is merely powerful. The series' most serious antagonist curses are dangerous because they cooperate, not only because they are strong.",
    },
    {
      q: "Why are there so few special grade sorcerers?",
      a: "Because the grade is not the top of a ladder that training climbs. It marks someone whose innate technique, output and control combine into something the ordinary structure cannot categorise or reliably oppose, and that combination is largely decided at birth.",
    },
  ],
  sections: [
    {
      heading: "What the Grades Are Actually For",
      paragraphs: [
        "The grading system in Jujutsu Kaisen is an assignment tool before it is a power ranking. Its purpose is to answer a practical question — who can be sent to deal with this, without dying — and everything about how it is structured follows from that.",
        "Quick answer: sorcerers run from grade 4 up through grade 3, semi-grade 2, grade 2, semi-grade 1, grade 1 and finally special grade. Cursed spirits use a parallel scale from grade 4 to special grade. The two scales share vocabulary but measure different things, and neither is a straightforward damage number.",
        "This is why the grades stop being informative exactly where fans most want them to be. At the top of the scale the system runs out of categories, and the characters who matter most are grouped together under a single label that mostly means \"outside the structure\". A ranking designed for dispatch decisions was never going to settle who beats whom.",
      ],
    },
    {
      heading: "The Sorcerer Ranks, From Grade 4 to Special Grade",
      paragraphs: [
        "Grade 4 is the entry rank: a sorcerer who can perceive and use cursed energy and is trusted with the least dangerous work, usually supervised. Grade 3 handles routine exorcisms alone. The semi-grades — semi-grade 2 and semi-grade 1 — exist because promotion is not a clean step; they mark a sorcerer who has met part of the standard for the rank above.",
        "Grade 2 and grade 1 are where most competent working sorcerers sit, and grade 1 is already a serious assessment: it implies a technique with real utility, the output to sustain it and the judgement to survive assignments that go wrong. The gap between grade 1 and special grade is far wider than the gap between any two numbered grades.",
        "Special grade is not the next step up so much as a separate category. It marks a sorcerer whose combination of technique, output and control the ordinary structure cannot usefully classify — and because that combination is largely set at birth, no amount of promotion through the numbered ranks reliably arrives there.",
      ],
      blocks: [
        {
          type: "table",
          caption: "The sorcerer grades in order, and what each implies",
          columns: ["Grade", "Typical assignment", "What it implies about the sorcerer"],
          rows: [
            ["Grade 4", "Lowest-risk work, usually supervised", "Can perceive and use cursed energy"],
            ["Grade 3", "Routine exorcisms, alone", "Reliable against ordinary curses"],
            ["Semi-grade 2", "Grade 2 work under conditions", "Meets part of the grade 2 standard"],
            ["Grade 2", "Standard field duty", "A technique with real practical use"],
            ["Semi-grade 1", "Grade 1 work under conditions", "Meets part of the grade 1 standard"],
            ["Grade 1", "Serious assignments, including special grade support", "Output, utility and field judgement"],
            ["Special grade", "Threats nothing else can be sent to", "Outside what the structure can categorise"],
          ],
        },
      ],
    },
    {
      heading: "How Curses Are Graded, and Why It Is a Different Scale",
      paragraphs: [
        "Cursed spirits are classed on a parallel scale, from grade 4 up to special grade, but the classification answers a different question: how dangerous is this to the people who have to remove it. A curse's grade is a threat assessment, not a statement about its capability relative to a sorcerer of the same label.",
        "At the low end the distinction is mostly about harm. Grade 4 curses are a nuisance; grade 3 and grade 2 curses can injure and kill ordinary people and require a trained sorcerer. The line that actually matters sits higher, and it is not about raw strength at all.",
        "It is about intelligence. A powerful curse that acts on instinct is a difficult exorcism. A curse that can think, plan, speak, use a cursed technique and cooperate with others is a categorically different problem — and the series' most serious antagonists are dangerous for that reason first and their output second.",
      ],
      blocks: [
        {
          type: "table",
          caption: "Curse grades as a threat classification",
          columns: ["Grade", "Danger to ordinary people", "What is required to exorcise it"],
          rows: [
            ["Grade 4", "Minimal", "A grade 4 or 3 sorcerer"],
            ["Grade 3", "Can injure", "A grade 3 sorcerer"],
            ["Grade 2", "Can kill", "A grade 2 sorcerer, or a team"],
            ["Grade 1", "Lethal, and resists a single sorcerer", "A grade 1 sorcerer, usually with support"],
            [
              "Special grade",
              "Catastrophic, and often intelligent",
              "A special grade sorcerer, or a coordinated group",
            ],
          ],
        },
      ],
    },
    {
      heading: "Why the Scale Breaks Down at the Top",
      paragraphs: [
        "Every grading system compresses at its extremes, and Jujutsu Kaisen's is unusually honest about it. Once a sorcerer is special grade, the label has stopped carrying information: it says only that the ordinary structure does not apply, not how this person compares to the other people it does not apply to.",
        "The series leans into this rather than patching it. Fights at that level turn on technique matchups, conditions, preparation, information and whether someone can open a domain in time — the mechanics covered in [cursed energy](/article/jujutsu-kaisen-cursed-energy-explained) and [domain expansion](/article/jujutsu-kaisen-domain-expansion-explained), not on a rank.",
        "This is a deliberate design position shared with the best-built power systems in the genre. [Hunter x Hunter's Nen](/article/hunter-x-hunter-nen-strategy-rules) refuses to rank its six types against each other, and [One Piece's Devil Fruits](/article/one-piece-devil-fruit-system-explained) make the same argument about types versus users. A ranking that resolved every fight in advance would remove the reason to watch the fight.",
      ],
    },
    {
      heading: "Reading Grades Without Over-Reading Them",
      paragraphs: [
        "The practical use of the grading system is contextual. When the series tells you a curse is special grade, it is telling you which sorcerers can be sent and how afraid the people in the room should be. When it tells you a sorcerer is grade 1, it is telling you they are trusted with serious work and are still not in the same conversation as the people at the top.",
        "What it is not doing is promising an outcome. A grade 1 sorcerer with a technique that happens to counter a special grade curse's specific weakness can win a fight the grades say they should lose — and the series does this often enough that treating grades as predictions will mislead you consistently.",
        "For the political structure that decides who gets assessed and promoted in the first place, [the three great sorcerer families](/article/three-great-sorcerer-families) covers the clans and their influence over jujutsu society. For the entity the whole scale is implicitly measured against, see [Sukuna explained](/article/jujutsu-kaisen-sukuna-explained).",
      ],
    },
  ],
};

export const jujutsuKaisenClusterArticles: Article[] = [
  jjkCursedEnergyArticle,
  jjkDomainExpansionArticle,
  jjkSukunaArticle,
  jjkGradesArticle,
];
