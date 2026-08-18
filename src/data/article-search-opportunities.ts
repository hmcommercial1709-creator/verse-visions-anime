import { assetUrl } from "@/lib/asset-url";
import type { Article } from "./articles";
import frierenArt from "@/assets/art/frieren.webp.asset.json";
import attackOnTitanArt from "@/assets/art/attack-on-titan.webp.asset.json";

/**
 * Search Console opportunity articles.
 *
 * These guides replace short draft stubs that already earned impressions and
 * near-page-one rankings. Their original URLs and publication dates remain
 * stable; the updated date marks the substantive editorial expansion.
 */
export const frierenMagicSystemArticle: Article = {
  slug: "frieren-magic-system-deep-dive",
  publicationStatus: "published",
  section: "guides",
  category: "fantasy",
  tags: ["frieren", "magic-system", "mana", "spells", "mage-exam"],
  title: "Frieren Magic System Explained: Mana, Spells and the Mage Exam",
  seoTitle: "Frieren Magic System Explained: Mana, Spells & Mage Exam",
  excerpt:
    "How Frieren's magic system works: mana, suppression, spell analysis, Zoltraak, defensive magic and the rules behind the First-Class Mage Exam.",
  ogImage: assetUrl(frierenArt.url),
  author: "aiko-tanaka",
  date: "2026-03-12",
  updated: "2026-08-05",
  tag: "Frieren · Magic System Guide",
  cover: "linear-gradient(135deg, #3a5a3a, #0a1a2a)",
  body: [],
  related: ["frieren", "hunter-x-hunter", "dr-stone"],
  faqs: [
    {
      q: "How does magic work in Frieren?",
      a: "Magic is shaped from mana through learned spells. A mage's total mana matters, but control, concealment, spell analysis, casting speed and matchup knowledge often decide a fight before raw output does.",
    },
    {
      q: "Why does Frieren hide her mana?",
      a: "Frieren suppresses her visible mana to make opponents underestimate her. The habit was taught as an anti-demon tactic because demons judge status and danger largely through the mana they can perceive.",
    },
    {
      q: "What is Zoltraak in Frieren?",
      a: "Zoltraak began as a demon's lethal piercing spell. Human mages studied it, incorporated it into standard offensive magic and developed defensive magic specifically to stop it, making it the clearest example of the system evolving over time.",
    },
    {
      q: "Is Frieren the strongest mage?",
      a: "Frieren is one of the era's most experienced and dangerous mages, but the series avoids a simple ranking. Serie has greater breadth and mana, while matchups, preparation and the ability to hide information can overturn apparent power gaps.",
    },
    {
      q: "What does the First-Class Mage Exam test?",
      a: "It tests far more than spell power: mana control, teamwork, survival, analysis, adaptability and judgment. Each stage is designed to expose mages who rely on a single overwhelming technique.",
    },
  ],
  sections: [
    {
      heading: "How Frieren's Magic System Works",
      paragraphs: [
        "Quick answer: magic in Frieren: Beyond Journey's End is a learned craft powered by mana. Mages shape mana into individual spells, but the decisive skills are usually control and information — hiding how much mana you have, reading another mage's output, analysing an unfamiliar spell and choosing the right counter before the opponent understands your plan.",
        "That makes the system look quiet compared with a typical battle anime. There are no public levels and almost no named power tiers. A small utility spell can matter for a lifetime, while an enormous reserve can be strategically useless if the owner telegraphs every cast. The rules reward patience, which is why Frieren's age is an ability without ever appearing on a status screen.",
        "The series also treats magic as accumulated culture. Spells are researched, preserved, traded, lost and rediscovered. What terrifies one generation can become basic curriculum in the next. This guide explains the system from the ground up: mana and suppression, spell learning, offensive and defensive magic, Zoltraak, the First-Class Mage Exam and the reason visualisation matters.",
        "For the broader story and cast, begin with the [Frieren series hub](/anime/frieren). If you want to see the show's rules introduced without later-arc context, our [episode 1 guide](/anime/frieren/episode/1) is the spoiler-light starting point.",
      ],
      blocks: [
        {
          type: "table",
          caption: "The parts of Frieren's magic system and what each one changes.",
          columns: ["System element", "What it controls", "Why it matters"],
          rows: [
            ["Mana reserve", "How much magical energy a mage can draw on", "Sets endurance and the ceiling for demanding spells"],
            ["Mana control", "Precision, efficiency and stability", "Lets a skilled mage spend less and conceal more"],
            ["Mana suppression", "How much power other people can sense", "Creates false information before a fight starts"],
            ["Spell analysis", "Reading and understanding another spell", "Turns unfamiliar magic into something that can be countered"],
            ["Visualisation", "The caster's ability to imagine an effect as possible", "Limits what a mage can reproduce or overcome"],
            ["Experience", "A library of spells, matchups and habits", "Lets an older mage solve problems without overpowering them"],
          ],
        },
      ],
    },
    {
      heading: "Mana, Detection and Why Frieren Suppresses Her Power",
      paragraphs: [
        "Mana is both fuel and information. A mage can usually sense another mage's output, so walking into a confrontation with unsuppressed mana is like showing an opponent your hand before the game begins. Frieren's defining discipline is the ability to keep that signal artificially small for years at a time.",
        "Suppression does not create extra power. It hides the reserve that already exists, and maintaining the disguise requires constant fine control. That cost explains why most human mages do not live this way: the training is tedious, the immediate reward is invisible, and a lifetime of restraint can look less impressive than one spectacular spell.",
        "Against demons, the deception is especially effective. Demons use mana as a social and tactical signal, so an apparently weak mage is treated as weak until evidence forces a correction. Frieren turns that assumption into an opening. She does not win because the opponent cannot sense mana; she wins because they trust the wrong reading.",
        "Fern learns the same lesson in a more practical form. Her casting is fast, economical and deliberately unshowy. The pairing demonstrates the system's central claim: refined basics can be more dangerous than a rare technique when the basics arrive before the opponent can respond.",
      ],
      blocks: [
        {
          type: "image",
          art: "frieren",
          caption:
            "Original GameCastle Anime illustration representing concealed mana, spell study and the long memory behind Frieren's magic.",
        },
      ],
    },
    {
      heading: "How Spells Are Learned, Collected and Improved",
      paragraphs: [
        "Spells in Frieren are learnable pieces of knowledge rather than personality-locked superpowers. Grimoires, teachers and direct analysis can all transmit them. A mage still needs the control and imagination to reproduce what they learn, but the spell itself belongs to a body of research that can outlive its creator.",
        "This is why Frieren collects apparently useless magic. A spell that removes rust or creates flowers records what a culture cared enough to solve. Utility magic also makes the world feel inhabited: people developed spells for agriculture, clothing, cleaning and memory long before the audience arrived, and those solutions continue to circulate after their inventors disappear.",
        "Analysis is the bridge between seeing a spell and owning an answer to it. Experienced mages observe the structure of an attack, test its limits and build a counter. Given enough time, yesterday's unbeatable technique becomes tomorrow's standard lesson. The system therefore progresses historically, not only individually.",
        "That historical layer is close to the technology chain in our [Dr. Stone inventions guide](/article/dr-stone-science-tech-tree-guide): knowledge compounds because each generation begins with tools the previous generation had to discover from nothing.",
      ],
    },
    {
      heading: "Zoltraak, Defensive Magic and an Evolving Metagame",
      paragraphs: [
        "Zoltraak is the cleanest example of the setting changing around a spell. It begins as killing magic associated with a demon whose attack human mages cannot reliably answer. After the spell is studied, humans adopt it as ordinary offensive magic and build defensive barriers around its exact threat profile.",
        "The important point is not that Zoltraak becomes weaker. The environment becomes better prepared. Standard defensive magic is efficient because it is designed against the attacks mages expect to face, and that efficiency creates a new weakness: a defence optimised for one class of threat may spend too much mana or fail outright against something with different physical properties.",
        "Frieren's battles therefore work like a metagame. Common attacks produce common defences; common defences invite specialised attacks; specialists become vulnerable when their one good matchup disappears. No technique stays dominant merely because it was dominant when invented.",
        "This is also why a table of destructive output would explain very little. The meaningful questions are whether an attack is recognised, whether the defender prepared for its structure and how much mana the exchange costs on both sides.",
      ],
    },
    {
      heading: "Visualisation: The Rule Behind Impossible Spells",
      paragraphs: [
        "The system repeatedly connects magic to visualisation: a mage must be able to conceive of the result as something their magic can realise. This is not permission to imagine anything and receive it. Knowledge, control and mana still set the boundary, but the caster's mental model determines whether they can cross the final step.",
        "That rule makes confidence mechanically relevant without turning confidence into a generic power-up. A mage who understands a material, a movement or a spell structure can visualise it with greater precision. A mage facing something they regard as categorically impossible may fail before the mana contest begins.",
        "The best fights use visualisation as a matchup rule. An ability can be overwhelming against opponents who accept its premise and much less reliable against someone whose experience gives them a different model of what is possible. Age matters because centuries of examples widen Frieren's mental library.",
        "For a more explicit system built around declared restrictions, compare the [Hunter x Hunter Nen guide](/article/hunter-x-hunter-nen-strategy-rules). Nen publishes its prices through vows; Frieren hides comparable tradeoffs inside study, control and belief.",
      ],
    },
    {
      heading: "What the First-Class Mage Exam Actually Tests",
      paragraphs: [
        "The First-Class Mage Exam is often described as a power test, but its structure rejects that reading. The stages force mages into teams, unfamiliar environments and incomplete-information problems. A candidate with greater mana can still fail through poor cooperation, slow analysis or an inability to adjust when their preferred spell is the wrong tool.",
        "The exam also reveals how institutions shape magic. Passing is not proof that a mage is objectively stronger than everyone who fails. It means the examiners consider that mage capable of handling the authority and risk attached to the title under the conditions they chose.",
        "Serie's presence makes the final distinction clear. She values talent, ambition and the shape of a candidate's potential, while Frieren values patient accumulation and ordinary human purposes. Both positions are expressed through magic, which turns the exam into an argument about what mastery is for.",
        "That is why the arc belongs in a magic-system guide rather than only a plot summary. It stress-tests every rule introduced earlier — concealment, analysis, teamwork, visualisation and historical knowledge — without inventing a new meter for the audience to memorise.",
      ],
      blocks: [
        {
          type: "poll",
          question: "Which part of Frieren's magic system decides the most fights?",
          options: ["Mana control", "Suppression and deception", "Spell analysis", "Visualisation"],
        },
      ],
    },
    {
      heading: "Why Frieren's Magic System Feels Different",
      paragraphs: [
        "Frieren's system is satisfying because power is rarely the whole answer. Time produces knowledge; knowledge produces efficient choices; efficient choices preserve mana; and preserved mana leaves room for the one overwhelming spell that ends the fight. The visible attack is only the last link in that chain.",
        "The same logic gives non-combat spells emotional weight. A flower spell can matter more than a battlefield victory because the story measures magic by what survives in another person's memory. The system is not separate from the show's themes of time and loss; it is how those themes become actions.",
        "The practical reading order is simple: watch for what each mage knows, what they are hiding and what they believe is possible. Once those three questions are visible, fights that first looked effortless become tightly reasoned exchanges.",
      ],
      blocks: [
        {
          type: "link",
          label: "Explore Frieren: Beyond Journey's End",
          to: "/anime/frieren",
          note: "Series details, episode guides, characters and related long-form analysis.",
        },
      ],
    },
  ],
};

export const odmGearArticle: Article = {
  slug: "attack-on-titan-odm-gear-tactics-analysis",
  publicationStatus: "published",
  section: "guides",
  category: "action",
  tags: ["attack-on-titan", "odm-gear", "equipment", "tactics", "explained"],
  title: "Attack on Titan ODM Gear Explained: Meaning, Mechanics and Tactics",
  seoTitle: "Attack on Titan ODM Gear Explained: Meaning, Parts & Tactics",
  excerpt:
    "What ODM stands for in Attack on Titan, how the gear works, why gas and anchor points matter, and the tactics soldiers use to fight Titans.",
  ogImage: assetUrl(attackOnTitanArt.url),
  author: "rowan-fitzgerald",
  date: "2026-03-05",
  updated: "2026-08-05",
  tag: "Attack on Titan · Equipment Guide",
  cover: "linear-gradient(135deg, #166534, #0b1120)",
  body: [],
  related: ["attack-on-titan"],
  faqs: [
    {
      q: "What does ODM stand for in Attack on Titan?",
      a: "ODM stands for Omni-Directional Mobility. ODM gear uses gas-powered grappling lines, anchors and hand controls to let a trained soldier accelerate and change direction through three-dimensional space.",
    },
    {
      q: "How does ODM gear work?",
      a: "The user fires anchors into solid surfaces, retracts the attached cables and releases compressed gas for acceleration and steering. The system depends on strong anchor points, remaining gas, cable angle and the user's ability to manage momentum.",
    },
    {
      q: "Why does ODM gear use gas?",
      a: "Compressed gas powers acceleration and helps control direction. Because the supply is finite, soldiers cannot fly indefinitely; every approach, correction and escape consumes part of a limited resource.",
    },
    {
      q: "Why do Attack on Titan soldiers carry replaceable blades?",
      a: "Titan tissue is difficult to cut cleanly and repeated strikes damage the blades. Spare segmented blades allow soldiers to replace a worn edge quickly without abandoning the hand controls.",
    },
    {
      q: "Could ODM gear work in real life?",
      a: "Not as shown. The acceleration, cable loads and abrupt direction changes would place extreme forces on the body and the anchor surface. The fictional system is convincing because it displays consistent constraints, not because its full performance is physically achievable.",
    },
  ],
  sections: [
    {
      heading: "What ODM Gear Means and How It Works",
      paragraphs: [
        "Quick answer: ODM stands for Omni-Directional Mobility. Attack on Titan's ODM gear is a gas-powered movement system built around two grappling lines, retracting cables, hand controls, a body harness and replaceable blades. Soldiers fire anchors into solid surfaces, pull themselves along the cables and use compressed gas to accelerate or change direction.",
        "The gear does not grant free flight. It converts the environment into a series of temporary pivot points, which means every movement begins with a question: what can the user anchor to? Cities and forests offer many answers. Open ground offers almost none.",
        "That dependence is the reason ODM action remains readable even when characters move at enormous speed. The audience can see the next anchor, the remaining distance and the Titan's position. A successful attack is a route through space rather than a burst of unexplained mobility.",
        "If you are starting or rewatching the series, use our [complete Attack on Titan watch order](/article/attack-on-titan-complete-watch-order). This guide focuses only on the equipment and the tactics it makes possible.",
      ],
      blocks: [
        {
          type: "table",
          caption: "The main ODM gear components and the constraint each one creates.",
          columns: ["Component", "Job", "Tactical constraint"],
          rows: [
            ["Anchors and grappling lines", "Attach the user to solid surfaces", "A weak or missing anchor removes the route"],
            ["Cable reels", "Retract line and convert tension into movement", "Cable angle controls the arc of travel"],
            ["Gas canisters", "Provide acceleration and steering thrust", "Finite fuel limits time in the air"],
            ["Hand grips and triggers", "Fire anchors, reel cables and control gas", "Complex inputs demand extensive training"],
            ["Harness", "Distribute load across the body", "Bad posture turns acceleration into injury"],
            ["Replaceable blades", "Cut the Titan's nape", "Edges wear and must be changed during combat"],
          ],
        },
      ],
    },
    {
      heading: "The Parts of ODM Gear",
      paragraphs: [
        "The visible grappling hooks are only one part of the system. Each side of the user's waist carries mechanisms for line deployment and retraction, while gas canisters supply thrust. The hand grips combine movement controls with blade handles so a soldier can steer, attack and replace a damaged blade without switching tools.",
        "The harness matters because the load cannot be carried by the arms. Acceleration is transferred through the hips, legs and torso, letting the body rotate around the cable line. Training scenes emphasise balance before combat because a person who cannot keep their centre of mass under control becomes the projectile.",
        "The blades are narrow, segmented and replaceable. Titans can regenerate most wounds, so the soldier needs a fast, deep cut across the nape rather than general damage. A blade that chips before completing that cut is a failed attack, which makes spare edges part of the ammunition economy.",
        "Together, these parts create two resources to track: gas for movement and blades for kills. Elite soldiers look superhuman because they waste very little of either.",
      ],
      blocks: [
        {
          type: "image",
          art: "attack-on-titan",
          caption:
            "Original GameCastle Anime illustration representing cable arcs, gas-driven acceleration and the urban terrain ODM gear needs.",
        },
      ],
    },
    {
      heading: "Anchors, Momentum and Three-Dimensional Movement",
      paragraphs: [
        "An anchor does not simply pull the user in a straight line. Once the line is under tension, it becomes the radius of an arc. Retracting the cable reduces that radius, gas adds speed and the body can rotate around the pivot until the user releases or fires the opposite anchor.",
        "Using two lines creates a temporary plane of control. One cable can hold the main turn while the other corrects the path, stabilises the body or prepares the next pivot. The best movement sequences are chains of overlapping anchors in which the next route is established before the previous one is released.",
        "Momentum is both the weapon and the danger. Speed gives a blade enough force to cross the nape, but an approach that is too direct leaves no escape path. Skilled soldiers arrive on a curve, cut across the target and spend the remaining momentum leaving the Titan's reach.",
        "This is why the forest of giant trees and dense urban districts are tactically valuable. Vertical surfaces at many angles allow continuous route changes. In flat terrain, the same equipment loses most of its advantage and soldiers depend on horses, formations and prepared structures.",
      ],
    },
    {
      heading: "Why ODM Gear Can Kill Titans",
      paragraphs: [
        "Titan regeneration turns ordinary wounds into delays. The reliable kill condition is destroying the nape, a small target high above ground and normally protected by the Titan's body position. ODM gear solves the access problem rather than the durability problem.",
        "A standard attack has four phases: approach outside the hands' easiest reach, establish an anchor beyond or above the target, accelerate past the nape, and leave on a route the Titan cannot follow. Missing any phase changes the attack from a kill attempt into a collision.",
        "Teams improve the odds by splitting attention. One soldier draws the Titan's eyes or controls its movement while another takes the blind-side route. Against abnormal Titans, the formation has to adapt because speed, posture and unpredictable movement can invalidate a textbook approach.",
        "The equipment therefore rewards reconnaissance and communication. Knowing the target's behaviour is often worth more than entering with greater speed.",
      ],
    },
    {
      heading: "Gas, Blade Wear and the Failure Modes That Create Tension",
      paragraphs: [
        "Finite gas is the system's most important rule. Every launch, correction and emergency escape spends fuel. A soldier can have perfect blades and a clear target and still be trapped because the canister no longer produces enough thrust to build momentum.",
        "Anchors create the second failure mode. They need a surface that can take the load. Loose masonry, thin branches and damaged structures can fail after the line is fired, and open country may offer no anchor at all. The user is only as mobile as the environment permits.",
        "Blade wear creates the third. Replaceable edges make recovery possible, but changing a blade costs time and a soldier carries a limited supply. Multiple Titans turn every unnecessary strike into a later tactical problem.",
        "Human limits sit underneath all three. Abrupt acceleration stresses the joints and spine; rapid rotation destroys orientation; and one poor trigger input can put both cables on the same unusable line. The series exaggerates survivable forces, but it is consistent about fatigue and training.",
      ],
    },
    {
      heading: "ODM Tactics in Cities, Forests and Open Ground",
      paragraphs: [
        "Cities are ideal for vertical ambushes. Rooflines and walls create dense anchor options, alleys channel Titans into predictable paths and squads can attack from different elevations. The cost is visibility: corners hide both targets and damaged structures.",
        "Forests trade walls for long trunks. The height supports wide, fast arcs and lets a squad maintain momentum, but it also creates occlusion. A soldier may have excellent anchors and very little warning about what is behind the next tree.",
        "Open ground is the worst environment. Without elevated anchors, soldiers cannot sustain three-dimensional movement, so scouting formations rely on horses, spacing and early warning instead. That strategic weakness is explored in our [Survey Corps tactics analysis](/anime/attack-on-titan).",
        "Interior fighting creates the opposite problem: too many nearby surfaces and too little room to spend speed safely. Short anchor changes and controlled gas bursts replace the long arcs used against Titans outdoors.",
      ],
      blocks: [
        {
          type: "link",
          label: "Attack on Titan Military Tactics, Analysed",
          to: "/anime/attack-on-titan",
          note: "Formation scouting, flare signals, logistics and why terrain decides survival before a fight begins.",
        },
      ],
    },
    {
      heading: "Anti-Personnel Gear and Different Design Priorities",
      paragraphs: [
        "Later equipment variants reveal how specialised the original design is. Standard ODM gear is built to approach a large target, pass its body at speed and deliver a close blade strike. Fighting armed humans changes every requirement.",
        "Anti-personnel configurations prioritise ranged attacks, cover and sudden changes of line. The user no longer needs to reach a nape, and the opponent can predict or shoot along a visible cable. Movement becomes shorter and more defensive because exposure matters more than cutting momentum.",
        "The contrast proves that ODM gear is not a generic flying machine. Its layout, weapons and training doctrine were shaped by one enemy and one kill condition. Change the enemy and the equipment has to change with it.",
      ],
    },
    {
      heading: "Could ODM Gear Work in Real Life?",
      paragraphs: [
        "A real grappling-and-winch system could move a person in controlled conditions, but the performance shown in Attack on Titan would be extraordinarily dangerous. The user experiences large acceleration changes, the cable transmits severe loads to small anchor points and the body often stops or turns faster than human joints can tolerate.",
        "The gas supply would also need exceptional energy density to deliver repeated launches from compact canisters. A building surface strong enough to hold one static person may still fail when that person hits the line at speed.",
        "The useful realism is therefore structural rather than literal. Fuel runs out, anchors fail, terrain matters, equipment wears and training changes efficiency. Those consistent limits make the audience believe in the action even when the engineering is heightened.",
        "That is the design lesson behind the gear: spectacle becomes more exciting when the viewer knows exactly what can go wrong.",
      ],
      blocks: [
        {
          type: "poll",
          question: "Which ODM gear limitation creates the most tension?",
          options: ["Running out of gas", "Missing an anchor", "Blade wear", "Open terrain"],
        },
      ],
    },
  ],
};
