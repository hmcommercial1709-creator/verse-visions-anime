import type { Article, ArticleSection } from "./articles";
import type { CategorySlug } from "./categories";

/**
 * Long-form cornerstone posts.
 *
 * Every entry is section-authored (headings + multiple paragraphs), carries at
 * least one illustrated break, and weaves contextual internal links directly
 * into the prose using the `[label](/path)` inline syntax rendered by
 * src/components/rich-text.tsx. Keeping the cross-links inside the copy is what
 * turns the archive into a crawlable cluster instead of a list of orphans.
 */

const g = (a: string, b: string) => `linear-gradient(135deg, ${a}, ${b})`;

type Draft = {
  slug: string;
  publicationStatus?: Article["publicationStatus"];
  category: CategorySlug;
  section: Article["section"];
  title: string;
  excerpt: string;
  author: string;
  date: string;
  tag: string;
  tags: string[];
  cover: [string, string];
  related: string[];
  sections: ArticleSection[];
};

const build = (d: Draft): Article => ({
  slug: d.slug,
  publicationStatus: d.publicationStatus,
  section: d.section,
  category: d.category,
  tags: d.tags,
  title: d.title,
  excerpt: d.excerpt,
  author: d.author,
  date: d.date,
  tag: d.tag,
  cover: g(d.cover[0], d.cover[1]),
  body: d.sections.flatMap((s) => s.paragraphs),
  sections: d.sections,
  related: d.related,
});

const drafts: Draft[] = [
  {
    slug: "attack-on-titan-complete-watch-order",
    category: "gaming-guides",
    section: "guides",
    title: "Attack on Titan: The Complete Watch Order, Recap and Rewatch Guide",
    excerpt:
      "Every season, OVA, compilation film and the Final Chapters in the order that actually serves the story.",
    author: "hana-mori",
    date: "2026-05-22",
    tag: "Watch Order",
    tags: ["attack-on-titan", "watch-order", "guide", "action"],
    cover: ["#7f1d1d", "#0b1120"],
    related: ["attack-on-titan", "fullmetal-alchemist-brotherhood", "chainsaw-man"],
    sections: [
      {
        heading: "Start With Broadcast Order, Not Chronology",
        paragraphs: [
          "Attack on Titan is one of the few modern epics where the broadcast order is also the correct order. The series is built on withheld information: the Season 1 premiere works because you do not know what a Titan is, and the Season 3 finale works because you spent fifty episodes believing the wrong thing about the world. Any chronological recut destroys both effects, which is why every recommendation on this page starts with episode 1 of the 2013 broadcast.",
          "The full path is Season 1 (25 episodes), Season 2 (12), Season 3 Part 1 (12), Season 3 Part 2 (10), Season 4 Part 1 (16), Season 4 Part 2 (12) and the two Final Chapters specials. That is roughly ninety hours with recaps, or about sixty if you skip the compilation films entirely — which we recommend for a first watch.",
          "If you are coming to this series from a different genre entirely, the on-ramp guide in our [beginner's guide to modern shonen](/article/beginner-guide-modern-shonen) explains why Attack on Titan is a harder first anime than it looks, and offers gentler starting points.",
        ],
        blocks: [
          { type: "image", art: "attack-on-titan", caption: "Original GameCastle Anime key visual for the Attack on Titan watch guide." },
        ],
      },
      {
        heading: "Season by Season: What Each Block Is Actually About",
        paragraphs: [
          "Season 1 is a survival horror show wearing a military uniform. The scale of the Titans is the point, and Wit Studio directs the early episodes as a series of helpless encounters rather than fights. The Trost arc is the pivot: the moment the cast stops running and starts solving.",
          "Season 2 is a mystery box that pays off inside twelve episodes, a rarity in long-running anime. Season 3 Part 1 leaves the Titans behind for a political thriller in the interior, and it is the stretch most first-time viewers underrate — it is also where the series' thesis about who benefits from a wall is delivered plainly.",
          "Season 3 Part 2 contains the Shiganshina arc, widely treated as the best sustained hour-for-hour run in the medium's last decade. Season 4, animated by MAPPA, becomes a geopolitical tragedy told from the other side of the sea. If you want a comparison for how a studio handoff can change a show's texture, the argument in our [Jujutsu Kaisen Season 2 review](/article/review-jujutsu-kaisen-s2) covers MAPPA's directing habits in detail.",
        ],
      },
      {
        heading: "Which Compilation Films and OVAs Are Worth It",
        paragraphs: [
          "The four compilation films re-cut the television seasons with some new cuts and remixed audio. They are a legitimate speed-run for a rewatch, but they trim the small character beats that make the ending land. Skip them the first time.",
          "The OVAs are a different story. 'Ilse's Notebook' is genuinely load-bearing for the world's mythology, and the No Regrets pair covering Levi's underground years upgrade the entire back half of the show. Watch No Regrets after Season 1 and Ilse's Notebook before Season 3 Part 2.",
          "'Lost Girls', which follows Annie and Mikasa, is optional but rewarding once you already know the Season 4 outcomes.",
        ],
        blocks: [
          {
            type: "table",
            caption: "Recommended insertion points",
            columns: ["Extra", "Watch after", "Priority"],
            rows: [
              ["No Regrets OVA (Levi)", "Season 1 finale", "High"],
              ["Ilse's Notebook OVA", "Season 3 Part 1", "High"],
              ["Lost Girls OVA", "Season 4 Part 1", "Optional"],
              ["Compilation films", "Rewatch only", "Low"],
            ],
          },
          {
            type: "link",
            label: "The Complete Wano Recap: What Actually Happened",
            to: "/article/one-piece-wano-recap",
            note: "The other long-arc recap most readers pair with this guide.",
          },
        ],
      },
      {
        heading: "The Rewatch: What Changes When You Know",
        paragraphs: [
          "A second pass turns Attack on Titan into a different genre. Season 1 stops being horror and becomes dramatic irony — nearly every early conversation has a double meaning once you know who is sitting in the room. Reiner's behaviour in the training arc is the most quoted example, and it holds up frame by frame.",
          "Pay attention to the framing of walls, doors and windows. The direction uses enclosure as a running visual argument, and the payoff in the final episodes is composed in deliberate opposition to the pilot.",
          "For a structural comparison, our [analysis of why Frieren won the year](/article/why-frieren-won-2024) looks at the opposite strategy: a show that tells you the ending in episode one and mines the aftermath instead of the reveal.",
        ],
      },
      {
        heading: "Where to Go Next",
        paragraphs: [
          "If the war-tragedy register is what hooked you, Vinland Saga is the obvious follow-up and shares a director's eye for consequence. If the tactical problem-solving was the draw, Hunter x Hunter's Chimera Ant arc scratches the same itch at greater length.",
          "For the full catalogue path, the series hub at [Attack on Titan series hub](/anime/attack-on-titan) has the episode index, character files and streaming availability, and our [power-scaling hub](/power-scaling) covers the Titan shifter hierarchy in isolation.",
        ],
        blocks: [
          {
            type: "poll",
            question: "Which Attack on Titan arc is the series' peak?",
            options: ["Trost", "Clash of the Titans", "Shiganshina", "Marley", "Rumbling"],
          },
        ],
      },
    ],
  },
  {
    slug: "demon-slayer-hashira-ranked",
    category: "action",
    section: "top-lists",
    title: "All Nine Hashira, Ranked by Skill, Feats and Narrative Weight",
    excerpt:
      "Breathing styles, on-screen feats and the difference between raw output and battlefield value.",
    author: "kenji-arata",
    date: "2026-05-18",
    tag: "Ranking",
    tags: ["demon-slayer", "ranking", "power-scaling", "action"],
    cover: ["#0ea5e9", "#111827"],
    related: ["demon-slayer", "jujutsu-kaisen", "bleach"],
    sections: [
      {
        heading: "The Criteria: Output, Utility, Result",
        paragraphs: [
          "Ranking the Hashira on vibes produces the same list every time, so we score three separate axes. Output is raw destructive ceiling. Utility is what a swordsman contributes when they are not the strongest person on the field. Result is what actually happened when the demon in front of them was stronger than they were.",
          "Splitting the axes matters because Demon Slayer's fights are almost never won by the highest number. They are won by a Hashira buying thirty seconds so a teammate can land a decapitation, which is a form of strength most rankings ignore entirely.",
          "Readers who want the general framework we use across the site can find it in our [power-scaling hub](/power-scaling), which explains how we treat feats, statements and author commentary differently.",
        ],
        blocks: [
          { type: "image", art: "demon-slayer", caption: "Original GameCastle Anime key visual for the Hashira ranking." },
        ],
      },
      {
        heading: "Tier One: Gyomei, Sanemi, Giyu",
        paragraphs: [
          "Gyomei Himejima sits at the top with less argument than any other placement on this list. Stone Breathing with a flail and axe gives him the highest raw output in the corps, and he is the only Hashira who reaches the Demon Slayer Mark, transparent world and red blade state in the same engagement.",
          "Sanemi Shinazugawa combines Wind Breathing with Marechi blood that functions as a battlefield-wide debuff on any demon that inhales it. His durability is the real feat: he takes damage that would end most of the roster and continues to press.",
          "Giyu Tomioka is the technician. Water Breathing's Eleventh Form is a defensive style he invented himself, and it is the only reason two of the corps' most important survivors are alive at the end.",
        ],
      },
      {
        heading: "Tier Two: Mitsuri, Obanai, Muichiro",
        paragraphs: [
          "Mitsuri Kanroji's muscle composition is a genuine biological outlier, and Love Breathing's whip-blade converts that into a coverage weapon nobody else can copy. Obanai Iguro's Serpent Breathing is the corps' best answer to erratic movement, and his partnership with Mitsuri is the most effective duo on the field.",
          "Muichiro Tokito is the ceiling-versus-experience problem in one person. Mist Breathing at fourteen, with the Mark unlocked, produces feats that outstrip several senior Hashira — and a body that cannot yet survive the cost of using them.",
          "If you enjoy this kind of technique accounting, the deep dive in our [Gojo Limitless explainer](/article/gojo-satoru-limitless-technique-explained) applies the same method to a system with far stricter internal rules.",
        ],
        blocks: [
          {
            type: "table",
            caption: "Ranking summary",
            columns: ["Rank", "Hashira", "Breathing", "Strongest axis"],
            rows: [
              ["1", "Gyomei Himejima", "Stone", "Output"],
              ["2", "Sanemi Shinazugawa", "Wind", "Durability"],
              ["3", "Giyu Tomioka", "Water", "Technique"],
              ["4", "Mitsuri Kanroji", "Love", "Coverage"],
              ["5", "Obanai Iguro", "Serpent", "Precision"],
              ["6", "Muichiro Tokito", "Mist", "Ceiling"],
              ["7", "Kyojuro Rengoku", "Flame", "Result"],
              ["8", "Tengen Uzui", "Sound", "Utility"],
              ["9", "Shinobu Kocho", "Insect", "Strategy"],
            ],
          },
        ],
      },
      {
        heading: "Tier Three Is Not a Weak Tier",
        paragraphs: [
          "Kyojuro Rengoku, Tengen Uzui and Shinobu Kocho occupy the bottom three slots and every one of them produced a result the tiers above did not. Rengoku held an Upper Rank to a draw and lost nobody. Tengen coordinated a four-person kill against Gyutaro while poisoned. Shinobu, who physically cannot decapitate a demon, engineered her own death into the only viable weapon against Doma.",
          "This is why the 'result' axis exists. In a series where every fight is a resource problem, converting a loss into a win for the corps is a higher-order skill than winning alone.",
          "For a completely different scoring model, our [combat system design piece](/article/combat-system-design-anime-vs-games) breaks down how telegraphs and punish windows make a fight legible in the first place.",
        ],
      },
      {
        heading: "The Argument We Expect to Get Wrong",
        paragraphs: [
          "The most contested placement is Giyu over Mitsuri, and we will defend it on technique breadth rather than raw statistics. The second is Muichiro at six, which will look low to anyone weighting potential and high to anyone weighting completed fights.",
          "The series hub at [Demon Slayer series hub](/anime/demon-slayer) carries the full breathing-style index, arc summaries and character files if you want to build your own ranking from the raw feats.",
        ],
        blocks: [
          {
            type: "poll",
            question: "Who is the strongest Hashira?",
            options: ["Gyomei", "Sanemi", "Giyu", "Mitsuri", "Muichiro"],
          },
        ],
      },
    ],
  },
  {
    slug: "one-piece-devil-fruit-system-explained",
    category: "gaming-guides",
    section: "guides",
    title: "The Devil Fruit System Explained: Types, Awakening and the Rules Oda Never Breaks",
    excerpt:
      "Paramecia, Zoan, Logia, awakening, Haki interaction and the internal logic that keeps a 1,100-chapter power system coherent.",
    author: "lina-vasquez",
    date: "2026-05-14",
    tag: "Explainer",
    tags: ["one-piece", "power-system", "explainer", "adventure"],
    cover: ["#f59e0b", "#7c2d12"],
    related: ["one-piece", "hunter-x-hunter", "bleach"],
    sections: [
      {
        heading: "Three Categories, One Cost",
        paragraphs: [
          "Every Devil Fruit falls into Paramecia, Zoan or Logia, and every single one charges the same price: the sea rejects you forever. That fixed cost is the reason the system has survived a quarter century of escalation. No matter how absurd a power becomes, seawater and sea-prism stone remain the universal off switch.",
          "Paramecia alter the body or the world around it. Zoan grant a transformation, and the mythical and ancient sub-classes are where the ceiling lives. Logia turn the user into an element, which sounds unbeatable until you remember that Haki was introduced specifically to make it beatable.",
          "For a comparison with a rival system that solved the same escalation problem differently, our [Nen and rule-bound power systems](/article/hunter-x-hunter-nen-strategy-rules) piece is the natural companion read.",
        ],
        blocks: [
          { type: "image", art: "one-piece", caption: "Original GameCastle Anime key visual for the Devil Fruit explainer." },
        ],
      },
      {
        heading: "Why Logia Stopped Being the Top Tier",
        paragraphs: [
          "For the first half of the series, Logia was a hard counter to anyone without a gimmick. Then Haki arrived and reframed the entire hierarchy: armament Haki lets a fist land on smoke, and the intangibility becomes a mobility and utility advantage rather than an invulnerability.",
          "This is careful design, not a retcon. Oda seeded Haki long before it was named, and the fruits that survived the transition are the ones with utility beyond 'you cannot hit me' — logistics, terrain control, and information.",
          "The lesson generalises: power systems age well when their trump card can be answered by skill rather than by a bigger number. We make the same argument about breathing forms in our [Hashira ranking](/article/demon-slayer-hashira-ranked).",
        ],
      },
      {
        heading: "Awakening: The Second Ceiling",
        paragraphs: [
          "Awakening extends a fruit's effect beyond the user's own body. A Paramecia user begins transforming the environment; a Zoan user gains a semi-autonomous, regenerating enhancement. It is the mechanism that lets Oda raise the ceiling without inventing new fruits for established characters.",
          "Crucially, awakening has a visible training cost and a visible stamina drain. It is not a free upgrade, which keeps the fights readable.",
          "The Wano arc is the clearest showcase of awakening as a narrative device rather than a stat boost — our [complete Wano recap](/article/one-piece-wano-recap) tracks how each awakening changes the shape of a battlefield.",
        ],
        blocks: [
          {
            type: "table",
            caption: "Type comparison at a glance",
            columns: ["Type", "Core effect", "Ceiling", "Common weakness"],
            rows: [
              ["Paramecia", "Alters body or surroundings", "Awakening reshapes terrain", "Narrow application"],
              ["Zoan", "Transformation, boosted physique", "Mythical class, self-healing", "Predictable forms"],
              ["Logia", "Elemental body", "Large-scale area control", "Haki, natural counters"],
            ],
          },
        ],
      },
      {
        heading: "The Rules Oda Never Breaks",
        paragraphs: [
          "Four rules have held for the entire run: one fruit per person, seawater disables, the fruit reincarnates after death, and Haki bypasses intangibility. Every apparent exception has an in-world mechanism attached rather than a hand-wave.",
          "That consistency is why fan theorising about One Piece functions like reverse-engineering rather than guessing. The system is closed enough to reason inside.",
          "New readers should start at the series hub [One Piece series hub](/anime/one-piece) for the arc index, or with the entry guide in our [beginner's guide to modern shonen](/article/beginner-guide-modern-shonen).",
        ],
      },
    ],
  },
  {
    slug: "hunter-x-hunter-nen-system-guide",
    category: "gaming-guides",
    section: "guides",
    title: "The Nen System, Fully Explained: Categories, Conditions and Why It Still Sets the Standard",
    excerpt:
      "Six categories, four basic principles and the contract mechanic that makes every Hunter x Hunter fight a negotiation.",
    author: "lina-vasquez",
    date: "2026-05-09",
    tag: "Explainer",
    tags: ["hunter-x-hunter", "power-system", "explainer", "analysis"],
    cover: ["#22c55e", "#052e16"],
    related: ["hunter-x-hunter", "jujutsu-kaisen", "one-piece"],
    sections: [
      {
        heading: "Four Principles Before Any Ability",
        paragraphs: [
          "Nen is taught as four fundamentals — Ten, Zetsu, Ren and Hatsu — and the order matters. Everything exotic in the series is a variation on aura control learned in that sequence, which is why fights between skilled users read as chess rather than as escalation.",
          "The genius is that defence is the first thing taught. A Hunter x Hunter fight is usually decided by who understands the other's aura leakage first, not by who hits harder.",
          "Readers coming from a different system will recognise the design goal from our [Devil Fruit explainer](/article/one-piece-devil-fruit-system-explained): fix the rules early, escalate inside them.",
        ],
        blocks: [
          { type: "image", art: "hunter-x-hunter", caption: "Original GameCastle Anime key visual for the Nen system guide." },
        ],
      },
      {
        heading: "The Six Categories and What They Cost",
        paragraphs: [
          "Enhancement, Transmutation, Emission, Conjuration, Manipulation and Specialisation sit on a hexagon, and your proficiency drops the further you move from your natural category. That single constraint prevents the generalist problem that ruins most power systems.",
          "Conjurers pay in imagination and detail. Manipulators pay in setup and conditions. Specialists pay in rarity. Nobody gets a free ability, and the series repeatedly shows characters losing because they picked a technique that fights their own type.",
          "The conditional contract — accepting a restriction in exchange for power — is the mechanic everyone copies. It is also the reason the Chimera Ant arc's climax works: the strongest ability in the series is bought with the user's life.",
        ],
        blocks: [
          {
            type: "table",
            caption: "Category quick reference",
            columns: ["Category", "Core use", "Typical cost"],
            rows: [
              ["Enhancement", "Boost body and objects", "Low creativity ceiling"],
              ["Transmutation", "Change aura properties", "High training time"],
              ["Emission", "Detach and project aura", "Aura loss at range"],
              ["Conjuration", "Create physical objects", "Extreme detail requirement"],
              ["Manipulation", "Control targets", "Conditions and setup"],
              ["Specialisation", "Unique effects", "Rarity, unpredictability"],
            ],
          },
          {
            type: "link",
            label: "Satoru Gojo's Limitless Technique Explained",
            to: "/article/gojo-satoru-limitless-technique-explained",
            note: "The closest modern descendant of Nen's rule-bound design.",
          },
        ],
      },
      {
        heading: "Why It Still Sets the Standard",
        paragraphs: [
          "Nen ages well because it is a system of trade-offs rather than tiers. A weaker character with a better contract beats a stronger one on a regular basis, and the audience can verify the logic afterwards.",
          "It also produces the medium's best non-combat tension. Auction rules, card games and information brokerage all run on the same mechanics as the fights.",
          "Start at the series hub [Hunter x Hunter series hub](/anime/hunter-x-hunter) for the arc index, or read our [best action anime of the decade](/article/best-action-anime-of-the-decade-ranked) ranking for where it lands against its peers.",
        ],
      },
    ],
  },
  {
    slug: "best-anime-openings-of-all-time",
    category: "action",
    section: "top-lists",
    title: "The 25 Greatest Anime Openings Ever Made, and What Each One Gets Right",
    excerpt:
      "Storyboarding, cut timing and the ninety-second contract every great OP signs with its audience.",
    author: "juno-park",
    date: "2026-05-04",
    tag: "Top List",
    tags: ["openings", "music", "ranking", "craft"],
    cover: ["#8b5cf6", "#1e1b4b"],
    related: ["attack-on-titan", "jujutsu-kaisen", "mob-psycho-100"],
    sections: [
      {
        heading: "An Opening Is a Thesis Statement",
        paragraphs: [
          "Ninety seconds is enough time to tell an audience what a show believes. The best openings do not summarise the plot; they establish the register — comedic, tragic, absurd, sincere — and set the pace at which the series intends to move.",
          "Storyboard credit is the single best predictor of quality. The names that recur on the greatest openings are the same names that turn up on the most technically ambitious episodes of the year.",
          "If you want the vocabulary behind the animation calls in this list, start with our [sakuga explainer](/article/sakuga-explained-what-makes-a-fight-scene-great).",
        ],
        blocks: [
          { type: "image", art: "trailer", caption: "Original GameCastle Anime artwork for the openings feature." },
        ],
      },
      {
        heading: "The Top Five",
        paragraphs: [
          "Our top slot goes to an opening that changes its own choreography as the season progresses — a rare production luxury and a direct statement about a cast that will not end the story as it began. Second place goes to a single-take-feeling sequence built on match cuts, where every transition is motivated by a shape rather than a beat drop.",
          "Third and fourth are both music-first entries: the visuals exist to serve a track that would chart on its own. Fifth is the purest example of tonal misdirection in the medium — a bright, poppy sequence attached to one of the bleakest shows on this site.",
          "Full disclosure on methodology: we weight rewatch behaviour heavily. An opening you skip after three episodes is not a great opening, regardless of how good the first viewing felt.",
        ],
      },
      {
        heading: "The Craft Notes Nobody Mentions",
        paragraphs: [
          "Cut length is the invisible variable. Openings that feel energetic usually average under one second per cut in the chorus, while openings that feel monumental hold shots for four or five seconds and move the camera instead.",
          "Colour scripts matter more than character cameos. The sequences that endure use a restricted palette per section so the final chorus can introduce one new colour as a payoff.",
          "For the show-level version of this argument, our [Jujutsu Kaisen Season 2 review](/article/review-jujutsu-kaisen-s2) tracks how MAPPA's direction uses the same restraint inside episodes.",
        ],
        blocks: [
          {
            type: "poll",
            question: "What makes an opening great?",
            options: ["The track", "The storyboard", "Character moments", "Foreshadowing"],
          },
        ],
      },
      {
        heading: "Where the List Goes Next",
        paragraphs: [
          "We revise this ranking every six months as new seasons air, and reader nominations decide two of the twenty-five slots. Send us the sequence you think we missed.",
          "The full audio-visual hub lives at [openings hub](/openings), and the soundtrack companion piece is at [soundtracks hub](/soundtracks).",
        ],
      },
    ],
  },
  {
    slug: "solo-leveling-progression-system-breakdown",
    publicationStatus: "archived",
    category: "rpg",
    section: "editorial",
    title: "Solo Leveling's Progression System, Broken Down Like an RPG Designer Would",
    excerpt:
      "Stat allocation, shadow economy and why the power fantasy stays satisfying past the first arc.",
    author: "lina-vasquez",
    date: "2026-04-29",
    tag: "Analysis",
    tags: ["solo-leveling", "progression", "rpg", "analysis"],
    cover: ["#6366f1", "#020617"],
    related: ["solo-leveling", "one-punch-man", "hunter-x-hunter"],
    sections: [
      {
        heading: "The System Is the Protagonist",
        paragraphs: [
          "Solo Leveling's central conceit is that one hunter receives a literal game interface — quests, stats, penalties, a store. The reason it works better than the dozens of series that copied it is that the interface has rules the story obeys even when they are inconvenient.",
          "Daily quests carry a punishment for failure. Stat points are finite. The shop charges currency the protagonist has to earn. Each of those is a designer's guardrail against a power fantasy that stops being fun.",
          "For the wider genre context, our [review of Season 2](/article/solo-leveling-s2-review) covers how the adaptation paces those systems on screen.",
        ],
        blocks: [
          { type: "image", art: "solo-leveling", caption: "Original GameCastle Anime key visual for the progression breakdown." },
        ],
      },
      {
        heading: "Shadow Extraction as an Economy",
        paragraphs: [
          "Shadow extraction converts defeated enemies into a standing army, which turns every fight into a resource decision rather than a binary win. That is a genuine RPG-design idea: the reward for combat is a permanent asset, and assets have upkeep in mana.",
          "The army also solves the pacing problem that kills most overpowered-protagonist stories. Once the hero can delegate, the narrative can stage battles at a scale a single character could never carry.",
          "Compare that with the opposite solution in our [One Punch Man piece on comedy and stakes](/article/one-punch-man-stakes-problem), where the answer to invincibility is to abandon stakes entirely and mine the joke.",
        ],
        blocks: [
          {
            type: "table",
            caption: "Progression loop",
            columns: ["Stage", "Input", "Output"],
            rows: [
              ["Daily quest", "Time, discipline", "Stat points"],
              ["Dungeon clear", "Mana, risk", "Currency, items"],
              ["Shadow extraction", "Mana upkeep", "Permanent unit"],
              ["Job change", "Milestone gate", "New ability tier"],
            ],
          },
        ],
      },
      {
        heading: "Where the Design Strains",
        paragraphs: [
          "The system's weakest point is the late-game currency curve: once the protagonist's income outpaces any purchasable upgrade, the shop stops being a decision and becomes flavour text. Good RPGs solve this with prestige sinks; the story solves it by escalating the threat instead.",
          "The second strain is information asymmetry. The audience only knows what the interface displays, which makes some victories feel handed down rather than earned.",
          "None of that stops the loop from being one of the most efficiently designed in modern anime. The series hub at [Solo Leveling series hub](/anime/solo-leveling) collects the episode guides and character files.",
        ],
      },
    ],
  },
  {
    slug: "one-punch-man-stakes-problem",
    category: "action",
    section: "editorial",
    title: "The One Punch Man Problem: How to Write Stakes for a Character Who Cannot Lose",
    excerpt:
      "Invincibility is a comedy premise and a structural trap. Here is how the series escapes it, and where it does not.",
    author: "rowan-fitzgerald",
    date: "2026-04-24",
    tag: "Editorial",
    tags: ["one-punch-man", "writing", "analysis", "comedy"],
    cover: ["#facc15", "#78350f"],
    related: ["one-punch-man", "mob-psycho-100", "solo-leveling"],
    sections: [
      {
        heading: "The Premise Is a Punchline and a Problem",
        paragraphs: [
          "Saitama wins every fight in one hit. That is the joke, and the joke is genuinely good — the series mines the anticlimax with more discipline than any parody before it. But an unbeatable protagonist removes the engine most action stories run on.",
          "The solution the series lands on is displacement: the stakes move to characters who can lose. Genos, Mumen Rider and the S-Class roster carry the tension while Saitama carries the theme.",
          "This is the same structural move Mob Psycho makes, and we cover the comparison in our [best action anime ranking](/article/best-action-anime-of-the-decade-ranked).",
        ],
        blocks: [
          { type: "image", art: "one-punch-man", caption: "Original GameCastle Anime key visual for the stakes essay." },
        ],
      },
      {
        heading: "Displacement, Recognition and the Hero Association",
        paragraphs: [
          "The Hero Association is the series' real antagonist system. Rank, publicity and bureaucracy give Saitama something he cannot punch, and that produces the only sustained tension available to a character with no physical peers.",
          "Mumen Rider's scene against the Deep Sea King is the thesis in miniature: the least powerful character generates the most dramatic weight because he is the only one who can actually fail.",
          "Where the design strains is in the mid-run arcs, where the association plot occasionally stalls while the roster expands. Padding is the tax on displacement.",
        ],
      },
      {
        heading: "What Other Series Should Steal",
        paragraphs: [
          "Three lessons transfer. First, if your protagonist cannot lose, give them something to want that violence does not obtain. Second, invest in a supporting cast whose losses are permanent. Third, keep the comedy sincere — mockery ages badly, affection does not.",
          "Solo Leveling takes the opposite route, escalating the world so the protagonist can stay threatened; our [progression breakdown](/article/solo-leveling-system-progression-explained) covers how that scales.",
          "The series hub is at [One Punch Man series hub](/anime/one-punch-man) with episode notes and the S-Class file.",
        ],
        blocks: [
          {
            type: "poll",
            question: "Does One Punch Man need higher stakes?",
            options: ["No, the joke is the point", "Yes, in the mid arcs", "Only for the supporting cast"],
          },
        ],
      },
    ],
  },
  {
    slug: "spring-2026-season-preview-risk-guide",
    publicationStatus: "review",
    category: "news",
    section: "news",
    title: "Spring 2026 Season Preview: Every Show Worth Your Watchlist, Sorted by Risk",
    excerpt:
      "Sequels, adaptations and original projects — with a candid read on which schedules look survivable.",
    author: "marcus-oduya",
    date: "2026-04-20",
    tag: "Season Preview",
    tags: ["seasonal", "preview", "news", "2026"],
    cover: ["#38bdf8", "#0c4a6e"],
    related: ["jujutsu-kaisen", "frieren", "spy-x-family"],
    sections: [
      {
        heading: "How to Read a Season Preview",
        paragraphs: [
          "A season preview is a risk assessment, not a ranking. Three things predict whether a show lands: the studio's current concurrent workload, whether the series director has shipped a full cour before, and how much finished source material exists.",
          "Anything failing two of those three is a gamble regardless of how good the promotional art looks. We flag them rather than hide them.",
          "The live simulcast grid lives at [seasonal simulcast grid](/seasonal), and the airing calendar updates weekly.",
        ],
        blocks: [
          { type: "image", art: "trailer", caption: "Original GameCastle Anime artwork for the seasonal preview." },
        ],
      },
      {
        heading: "The Safe Bets",
        paragraphs: [
          "Returning seasons with intact staff lists are the safest watchlist additions of any season, and this spring has an unusually strong set. Continuations benefit from established pipelines, pre-approved designs and a crew that already knows the show's timing.",
          "Adaptations of completed manga with a single-cour scope are the next safest tier. A finished source removes the pacing improvisation that damages so many first seasons.",
          "For newcomers building a first watchlist, our [beginner's guide](/article/beginner-guide-modern-shonen) pairs well with this preview.",
        ],
      },
      {
        heading: "The Gambles Worth Taking",
        paragraphs: [
          "Original projects are where the season's surprises come from, and two of this spring's originals have veteran series composers attached to first-time directors — historically a strong combination.",
          "The riskiest entries are the ongoing-manga adaptations announced with a broadcast date less than a year out. Watch the episode 4-6 window: that is where schedule pressure first shows in the linework.",
          "We publish a mid-season check-in that revisits every call on this page. The archive is at [news archive](/news).",
        ],
        blocks: [
          {
            type: "table",
            caption: "Risk tiers",
            columns: ["Tier", "Profile", "Advice"],
            rows: [
              ["Safe", "Sequel, same staff", "Add to watchlist now"],
              ["Solid", "Finished source, one cour", "Watch weekly"],
              ["Gamble", "Original, new director", "Give it three episodes"],
              ["Risky", "Short lead time", "Wait for reviews"],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "frieren-and-the-slow-fantasy-movement",
    category: "reviews",
    section: "reviews",
    title: "Frieren and the Rise of Slow Fantasy: A Genre Shift, Reviewed",
    excerpt:
      "Why the year's most patient show became its most popular, and what the imitators keep missing.",
    author: "aiko-tanaka",
    date: "2026-04-15",
    tag: "Review",
    tags: ["frieren", "fantasy", "review", "analysis"],
    cover: ["#34d399", "#064e3b"],
    related: ["frieren", "fullmetal-alchemist-brotherhood", "hunter-x-hunter"],
    sections: [
      {
        heading: "The Premise Everyone Underestimated",
        paragraphs: [
          "A fantasy series that opens after the final boss dies should not work. Frieren works because the quest structure is replaced by an emotional one: an elf who outlives her party learns, slowly, what the decade she spent with them meant.",
          "Madhouse's direction commits to the pace. Scenes hold. Conversations end without a punchline. The show trusts an audience trained on cliffhangers to sit still, and the audience did.",
          "Our earlier essay on [why Frieren won the year](/article/why-frieren-won-2024) covers the awards case; this piece is about the genre it started.",
        ],
        blocks: [
          { type: "image", art: "frieren", caption: "Original GameCastle Anime key visual for the slow-fantasy review." },
        ],
      },
      {
        heading: "The Magic System Is Doing Quiet Work",
        paragraphs: [
          "Mana suppression, mundane spells and a bureaucratic mage exam give the world a texture that rewards attention without demanding it. It is a rule-bound system delivered without a single explanatory chalkboard scene.",
          "That restraint is the hardest thing to copy. Series that adopt Frieren's pacing without its systems produce atmosphere with nothing underneath.",
          "Readers who like rule-bound magic should compare it with our [Nen system guide](/article/hunter-x-hunter-nen-strategy-rules), which is the maximalist version of the same instinct.",
        ],
      },
      {
        heading: "Score and Recommendation",
        paragraphs: [
          "9.2/10. The first cour is close to flawless; the exam arc trades some of the melancholy for structure, which is a fair exchange but a noticeable one.",
          "Watch it weekly rather than bingeing. The show's central subject is the passage of time, and a seven-day gap between episodes is, unusually, part of the experience.",
          "The series hub is at [Frieren series hub](/anime/frieren) and the wider reviews archive is at [reviews archive](/reviews).",
        ],
        blocks: [
          {
            type: "link",
            label: "The 15 Best Action Anime of the Decade",
            to: "/article/best-action-anime-of-the-decade-ranked",
            note: "For readers who want the opposite tempo.",
          },
        ],
      },
    ],
  },
  {
    slug: "haikyuu-sports-anime-blueprint",
    category: "esports",
    section: "editorial",
    title: "The Haikyuu Blueprint: Why Sports Anime Beats Every Other Genre at Tension",
    excerpt:
      "Rally structure, rotational stakes and the reason a volleyball point can outperform a world-ending battle.",
    author: "kenji-arata",
    date: "2026-04-10",
    tag: "Analysis",
    tags: ["haikyuu", "sports", "analysis", "blue-lock"],
    cover: ["#fb923c", "#7c2d12"],
    related: ["haikyuu", "blue-lock", "mob-psycho-100"],
    sections: [
      {
        heading: "Rules Create Tension for Free",
        paragraphs: [
          "The reason sports anime generates more reliable tension than fantasy is structural: the rules are known before the first whistle. No power-up can be invented mid-match, and the audience can score the situation themselves.",
          "Haikyuu exploits this ruthlessly. Rotation means the team's best attacker is periodically stuck in the back row, which manufactures pressure without a writer intervening.",
          "Our [combat system design piece](/article/combat-system-design-anime-vs-games) makes the same point about telegraphs in fights: legibility is what makes an audience lean forward.",
        ],
        blocks: [
          { type: "image", art: "haikyuu", caption: "Original GameCastle Anime key visual for the sports blueprint." },
        ],
      },
      {
        heading: "Small Stakes, Enormous Weight",
        paragraphs: [
          "A single point can carry an entire episode because the show has spent seasons establishing what each player can and cannot do. When a setter chooses a different attacker, the audience understands the risk without narration.",
          "Contrast that with Blue Lock, which manufactures stakes by inventing an elimination structure on top of football. Both work; Haikyuu's version ages better because it never needs to raise the external threat.",
          "The rival-team treatment is the other half of the blueprint: every opponent gets enough interiority that the loss hurts on both sides of the net.",
        ],
        blocks: [
          {
            type: "table",
            caption: "Two approaches to sports tension",
            columns: ["Series", "Source of stakes", "Risk"],
            rows: [
              ["Haikyuu", "Rules and rotation", "Slow build"],
              ["Blue Lock", "Elimination format", "Escalation fatigue"],
            ],
          },
        ],
      },
      {
        heading: "What Other Genres Should Copy",
        paragraphs: [
          "Publish your rules early, keep them fixed, and let the audience do the maths. Every genre benefits from it, and the shows that ignore it end up explaining their own climaxes.",
          "The sports hub lives at [Haikyuu series hub](/anime/haikyuu), and our [Hashira ranking](/article/demon-slayer-hashira-ranked) shows the same scoring discipline applied to a battle series.",
        ],
      },
    ],
  },
  {
    slug: "chainsaw-man-adaptation-tone-analysis",
    category: "reviews",
    section: "reviews",
    title: "Chainsaw Man's Adaptation, Reconsidered: Grime, Restraint and the Cinematic Gamble",
    excerpt:
      "MAPPA's film-grammar approach split the fandom. Two years on, here is what it bought and what it cost.",
    author: "rowan-fitzgerald",
    date: "2026-04-06",
    tag: "Review",
    tags: ["chainsaw-man", "adaptation", "review", "mappa"],
    cover: ["#dc2626", "#1c1917"],
    related: ["chainsaw-man", "jujutsu-kaisen", "attack-on-titan"],
    sections: [
      {
        heading: "The Choice: Film Grammar Over Manga Panels",
        paragraphs: [
          "The adaptation deliberately avoids replicating the manga's panel compositions. Instead it uses handheld camera logic, naturalistic lighting and a muted palette — a live-action grammar applied to a cartoon about a chainsaw devil.",
          "That decision bought texture. Tokyo feels wet, cheap and lived-in, and the violence has weight because the world around it is mundane.",
          "It also cost comedic timing in places where the source's panel rhythm was the joke. Both things are true, and the discourse has mostly refused to hold them together.",
        ],
        blocks: [
          { type: "image", art: "chainsaw-man", caption: "Original GameCastle Anime key visual for the adaptation review." },
        ],
      },
      {
        heading: "Where the Approach Pays Off",
        paragraphs: [
          "The quieter episodes are the strongest. Domestic scenes, meals and commutes give the horror somewhere to land, and the restraint makes the eventual set pieces feel like a rupture rather than a routine.",
          "Sound design deserves specific credit: the mix keeps ambience high and score low, which is unusual for the genre and hugely effective.",
          "For the counter-example of a MAPPA production that leans into panel fidelity instead, see our [Jujutsu Kaisen Season 2 review](/article/review-jujutsu-kaisen-s2).",
        ],
      },
      {
        heading: "The Reze Arc Question",
        paragraphs: [
          "The film continuation is the real test. The Reze arc is the source's most tonally balanced stretch, and it needs the comedy to work as hard as the horror.",
          "Our reporting on the theatrical rollout is in the [Reze arc preview](/article/chainsaw-man-reze-arc-preview), which covers the release footprint.",
          "8.5/10 for the television run. The series hub at [Chainsaw Man series hub](/anime/chainsaw-man) has the episode index.",
        ],
        blocks: [
          {
            type: "poll",
            question: "Was the cinematic approach the right call?",
            options: ["Yes, entirely", "Mostly", "It lost the comedy", "No"],
          },
        ],
      },
    ],
  },
  {
    slug: "how-anime-gets-made-production-committees",
    category: "news",
    section: "editorial",
    title: "How Anime Actually Gets Made: Production Committees, Schedules and Where the Money Goes",
    excerpt:
      "A plain-language guide to the funding structure behind every show you watch, and why it explains delays.",
    author: "marcus-oduya",
    date: "2026-04-01",
    tag: "Industry",
    tags: ["industry", "production", "explainer", "business"],
    cover: ["#64748b", "#0f172a"],
    related: ["attack-on-titan", "demon-slayer", "one-piece"],
    sections: [
      {
        heading: "The Committee Is Not the Studio",
        paragraphs: [
          "Most anime is financed by a production committee: a consortium of publishers, streaming platforms, music labels, toy makers and broadcasters who each buy a slice of the rights and share the risk. The animation studio is usually a contractor, not an owner.",
          "This single fact explains most industry confusion. When a beloved show does not get a sequel despite good ratings, it is usually because merchandise and disc revenue — not viewing figures — did not clear the committee's threshold.",
          "It also explains why studios with hit shows can still run thin margins, a topic we touch on in our [convention season guide](/article/convention-season-2026-guide) when covering announcement timing.",
        ],
        blocks: [
          { type: "image", art: "clans", caption: "Original GameCastle Anime artwork for the production industry explainer." },
        ],
      },
      {
        heading: "The Schedule Is the Real Constraint",
        paragraphs: [
          "A television cour is thirteen episodes. Pre-production — scripts, storyboards, designs, colour scripts — ideally finishes months before broadcast. When it does not, the schedule compresses into the broadcast window and quality degrades visibly around episodes five to eight.",
          "Streaming money has improved budgets more than it has improved schedules. More funding buys more outsourcing capacity, not more calendar time.",
          "Watch for the tells: static conversation shots, off-model faces in the middle of an episode, and recap episodes appearing without narrative reason.",
        ],
        blocks: [
          {
            type: "table",
            caption: "Where a committee's revenue comes from",
            columns: ["Stream", "Typical share", "Notes"],
            rows: [
              ["Streaming licences", "Large and growing", "Now often the anchor investor"],
              ["Merchandise", "High margin", "Drives sequel decisions"],
              ["Music", "Steady", "Label partners sit on committees"],
              ["Physical discs", "Declining", "Still decisive for niche titles"],
            ],
          },
        ],
      },
      {
        heading: "What This Means for Viewers",
        paragraphs: [
          "Legal streaming is the single most direct way an ordinary viewer influences a sequel decision, because platform licence renewals are negotiated on measurable engagement.",
          "Delay announcements are usually good news for the finished product, even when they are frustrating. A studio that pushes a broadcast is a studio protecting the episodes you have not seen yet.",
          "Our seasonal risk assessments apply all of this in practice — see the [Spring 2026 preview](/article/spring-2026-season-preview-risk-guide).",
        ],
      },
    ],
  },
  {
    slug: "best-anime-streaming-services-compared",
    publicationStatus: "review",
    category: "gaming-guides",
    section: "guides",
    title: "Anime Streaming Services Compared: Catalogue, Dubs, Price and Regional Gaps",
    excerpt:
      "A practical comparison of where the catalogue actually is, including simulcast timing and subtitle quality.",
    author: "hana-mori",
    date: "2026-03-30",
    tag: "Guide",
    tags: ["streaming", "guide", "comparison", "services"],
    cover: ["#0ea5e9", "#082f49"],
    related: ["one-piece", "frieren", "spy-x-family"],
    sections: [
      {
        heading: "Catalogue Beats Price",
        paragraphs: [
          "Subscription pricing across the major anime platforms is close enough that it should rarely decide your choice. Catalogue depth, simulcast timing and regional availability vary far more, and those are the variables worth comparing.",
          "The single biggest differentiator is back-catalogue licensing. Two services can both carry this season's headline show while differing wildly on the twenty-year-old series you actually want next.",
          "Our live availability data per title sits on each series hub — for example [One Piece series hub](/anime/one-piece) — and the aggregate view is at [streaming hub](/streaming).",
        ],
        blocks: [
          { type: "image", art: "spy-x-family", caption: "Original GameCastle Anime artwork for the streaming comparison." },
        ],
      },
      {
        heading: "Simulcast Timing and Subtitle Quality",
        paragraphs: [
          "Simulcast delay ranges from one hour to a full week depending on the platform and territory. If you follow weekly discussion, this is the most important spec on the page.",
          "Subtitle quality is uneven and rarely discussed. Look for services that credit their translators; credited work is consistently better on honorifics, sign translation and song subtitles.",
          "Dub availability usually trails the sub by two to six weeks, with a handful of simuldub exceptions on flagship titles.",
        ],
        blocks: [
          {
            type: "table",
            caption: "What to compare before subscribing",
            columns: ["Factor", "Why it matters", "How to check"],
            rows: [
              ["Back catalogue", "Decides what you watch after the hype show", "Search three older favourites"],
              ["Simulcast delay", "Spoiler exposure", "Check last week's release time"],
              ["Dub schedule", "Accessibility", "Look for simuldub badges"],
              ["Region gaps", "Licences differ per country", "Test the catalogue before paying"],
            ],
          },
        ],
      },
      {
        heading: "The Honest Recommendation",
        paragraphs: [
          "Most viewers are best served by one primary subscription plus rotating a second service for a month whenever it holds a season you care about. Annual plans only make sense on your primary.",
          "If you are building a first watchlist to justify a subscription, start with our [beginner's guide to modern shonen](/article/beginner-guide-modern-shonen) and the [Spring 2026 preview](/article/spring-2026-season-preview-risk-guide).",
        ],
      },
    ],
  },
  {
    slug: "jujutsu-kaisen-domain-expansion-guide",
    category: "action",
    section: "guides",
    title: "Domain Expansion, Explained: Every Rule, Counter and Cost in Jujutsu Kaisen",
    excerpt:
      "Sure-hit effects, domain clashes, simple domains and the reason the technique is a last resort rather than an opener.",
    author: "rowan-fitzgerald",
    date: "2026-03-27",
    tag: "Explainer",
    tags: ["jujutsu-kaisen", "power-system", "explainer", "domains"],
    cover: ["#7c3aed", "#0b1120"],
    related: ["jujutsu-kaisen", "hunter-x-hunter", "bleach"],
    sections: [
      {
        heading: "What a Domain Actually Does",
        paragraphs: [
          "A Domain Expansion builds an enclosed territory out of the user's innate technique and cursed energy. Inside it, the technique becomes a guaranteed hit — no dodging, no interruption, no luck. That guarantee is the entire mechanic.",
          "The cost is proportionate. Domains drain enormous cursed energy, expose the user's technique in detail, and lock both combatants into a space where the loser usually does not walk out.",
          "The foundational rules are covered in our [Limitless explainer](/article/gojo-satoru-limitless-technique-explained), which is the prerequisite read for this guide.",
        ],
        blocks: [
          { type: "image", art: "limitless", caption: "Original GameCastle Anime artwork for the domain expansion guide." },
        ],
      },
      {
        heading: "Clashes, Simple Domain and Falling Blossom",
        paragraphs: [
          "When two domains meet, the more refined one takes the space — refinement, not raw power, decides the outcome. That is why an incomplete domain can still be a viable defensive play against a stronger sorcerer.",
          "Simple Domain is the counter every non-domain user learns: a small neutral territory that negates the enemy's sure-hit effect within arm's reach. Falling Blossom Emotion adds a cursed-energy layer that reacts on contact.",
          "The third counter is the crudest and the most common: hit the barrier hard enough that the caster has to spend energy maintaining it instead of killing you.",
        ],
        blocks: [
          {
            type: "table",
            caption: "Domain counters",
            columns: ["Counter", "Requirement", "Effect"],
            rows: [
              ["Rival domain", "Own domain", "More refined domain wins the space"],
              ["Simple Domain", "Training, no technique needed", "Negates sure-hit at close range"],
              ["Falling Blossom Emotion", "Advanced control", "Repels contact with the barrier"],
              ["Barrier assault", "Raw output", "Forces upkeep cost on the caster"],
            ],
          },
          {
            type: "link",
            label: "The Complete Shibuya Incident Timeline",
            to: "/article/shibuya-incident-timeline",
            note: "Where nearly every domain rule on this page is tested at once.",
          },
        ],
      },
      {
        heading: "Why Domains Are a Last Resort",
        paragraphs: [
          "Opening with a domain tells your opponent exactly how your technique works, which in a world of prepared sorcerers is often fatal. It also empties the tank, and Jujutsu Kaisen fights are frequently decided by whoever has energy left in the final minute.",
          "The best users treat it as a finisher or an escape valve, not an opener — and the fights where a character breaks that rule are usually the fights they lose.",
          "For the political context around who is allowed to learn these techniques, read our [three great sorcerer families guide](/article/three-great-sorcerer-families).",
        ],
      },
    ],
  },
  {
    slug: "anime-glossary-for-new-fans",
    category: "gaming-guides",
    section: "guides",
    title: "The Anime Glossary: 60 Terms New Fans Actually Need, Explained Plainly",
    excerpt:
      "Cour, sakuga, seinen, simulcast, OVA, ONA and every other word the discourse assumes you already know.",
    author: "hana-mori",
    date: "2026-03-24",
    tag: "Beginner",
    tags: ["glossary", "beginner", "guide", "terminology"],
    cover: ["#a78bfa", "#1e1b4b"],
    related: ["demon-slayer", "frieren", "spy-x-family"],
    sections: [
      {
        heading: "Format and Schedule Terms",
        paragraphs: [
          "A cour is a broadcast quarter, roughly eleven to thirteen episodes. A season in the anime sense means a three-month broadcast window (winter, spring, summer, autumn), which is why 'two-cour season' is not a contradiction.",
          "An OVA is a direct-to-video episode, an ONA is released online first, and a special is usually a short extra bundled with a disc release. Simulcast means the episode streams internationally within hours of the Japanese broadcast.",
          "If you are choosing where to watch, our [streaming comparison](/article/best-anime-streaming-services-compared) covers simulcast delays by platform.",
        ],
        blocks: [
          { type: "image", art: "frieren", caption: "Original GameCastle Anime artwork for the beginner glossary." },
        ],
      },
      {
        heading: "Demographic and Genre Terms",
        paragraphs: [
          "Shonen, shojo, seinen and josei are publishing demographics, not genres. They describe the magazine's target readership, which is why a seinen can be a comedy and a shonen can be a horror.",
          "Isekai means 'another world' and describes a premise. Iyashikei describes an intended effect — healing, calm. Battle shonen, slice of life and sports are genre labels that cut across all of the above.",
          "The full beginner path is in our [guide to modern shonen](/article/beginner-guide-modern-shonen).",
        ],
        blocks: [
          {
            type: "table",
            caption: "Demographics decoded",
            columns: ["Term", "Target readership", "Common misconception"],
            rows: [
              ["Shonen", "Teen boys", "Not a synonym for action"],
              ["Shojo", "Teen girls", "Not a synonym for romance"],
              ["Seinen", "Adult men", "Not a synonym for dark"],
              ["Josei", "Adult women", "Rarely licensed, often excellent"],
            ],
          },
        ],
      },
      {
        heading: "Production and Craft Terms",
        paragraphs: [
          "Sakuga refers to the standout animation cuts a studio invests in; our [sakuga explainer](/article/sakuga-explained-what-makes-a-fight-scene-great) covers the vocabulary in depth. Key animation, in-betweens and douga describe the labour stages behind those cuts.",
          "A production committee is the funding consortium behind a show, explained in full in [how anime actually gets made](/article/how-anime-gets-made-production-committees). Seiyuu are voice actors, and gekiga is an older term for dramatic, adult-oriented manga.",
          "Keep this page bookmarked — we extend it every time a term starts showing up in comment threads without explanation.",
        ],
      },
    ],
  },
];

export const longformArticles: Article[] = drafts.map(build);
