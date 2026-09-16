import type { Article } from "./articles";

/**
 * The Dandadan mechanics and folklore cluster.
 *
 * Built from the live trend pass on 16 September 2026, where "dandadan" was
 * the highest-placed anime entity in the uncovered queue — trending, and with
 * no article on the site despite five existing hub routes.
 *
 * Those five routes cover the series as an experience: what to watch, in what
 * order, who the cast are, how a battle reads. None of them answers the
 * questions people actually type: what Turbo Granny is, where Momo's powers
 * come from and what they cost, how Okarun's transformation is limited, and
 * which of the folklore is real. Four pages, each on one of those, and each
 * linking back into the hub so the new pages feed it rather than compete.
 *
 * Nothing here asserts a rating, a power level the series does not state, or a
 * plot point the manga leaves open. Later-arc material sits behind the spoiler
 * block type the site already uses.
 */

const shared = {
  publicationStatus: "published" as const,
  section: "guides" as const,
  category: "analysis" as const,
  author: "hana-mori",
  date: "2026-09-16",
  cover: "linear-gradient(135deg, #db2777, #0f172a)",
  // Dandadan is not a row in animes.ts, so `related` points at the nearest
  // neighbours that are: the occult and power-system series a reader of this
  // page is most likely to want next.
  related: ["jujutsu-kaisen", "chainsaw-man", "mob-psycho-100", "hunter-x-hunter"],
};

/* ------------------------------------------------- 1. Turbo Granny ------ */

export const dandadanTurboGrannyArticle: Article = {
  ...shared,
  slug: "dandadan-turbo-granny-explained",
  tags: ["dandadan", "turbo-granny", "yokai", "urban-legends", "occult"],
  title: "Dandadan's Turbo Granny Explained: The Urban Legend, the Curse and the Deal",
  seoTitle: "Turbo Granny Explained: Urban Legend, Curse & the Deal",
  excerpt:
    "Who Turbo Granny is in Dandadan, the real Japanese tunnel legend she comes from, what she actually took from Okarun, and why the series turns its first monster into an ally rather than a defeated boss.",
  ogImage: "/anime/dandadan/world.webp",
  tag: "Dandadan · Guide",
  body: [],
  faqs: [
    {
      q: "Who is Turbo Granny in Dandadan?",
      a: "A spirit haunting an abandoned tunnel, encountered in the opening episodes when Okarun goes there to disprove the supernatural. She is fast, foul-mouthed, and the story's first demonstration that both halves of the central argument — ghosts and aliens — are real.",
    },
    {
      q: "Is Turbo Granny based on a real Japanese urban legend?",
      a: "Yes. Tābo Bābā is a well-known piece of modern Japanese folklore: an old woman who runs at highway speed and chases cars through tunnels and mountain passes. Dandadan keeps the speed, the tunnel and the chase, and adds a personality the legend never had.",
    },
    {
      q: "What did Turbo Granny take from Okarun?",
      a: "His testicles — which the series treats as both a running joke and the actual mechanism of his power. They are the object of the deal that follows, and getting them back is a thread the story keeps pulling rather than resolving immediately.",
    },
    {
      q: "Why does Turbo Granny end up helping the cast?",
      a: "Because Dandadan resolves its supernatural encounters by negotiation and understanding rather than by winning. Her curse becomes an arrangement, and an entity introduced as a threat becomes a permanent, extremely rude member of the household.",
    },
    {
      q: "How fast is Turbo Granny?",
      a: "The series does not put a number on it. What it establishes is relative: she is fast enough that outrunning her is not an option, which is why the first arc is solved by changing the terms of the encounter instead of by escaping it.",
    },
  ],
  sections: [
    {
      heading: "The First Monster, and Why She Matters",
      paragraphs: [
        "Dandadan opens on an argument. Momo Ayase believes in ghosts and thinks aliens are nonsense; Ken Takakura — Okarun — believes in aliens and thinks ghosts are superstition. Each goes to prove the other wrong, and the series settles the bet in the worst possible way: both are right. Okarun's half of that proof is Turbo Granny.",
        "Quick answer: Turbo Granny is a tunnel spirit drawn from a real Japanese urban legend, she takes something from Okarun that becomes the basis of his power, and the arc ends in a deal rather than a victory. That last point is the one that shapes the whole series.",
        "She is the story's thesis statement in one character. A monster arrives, the protagonists cannot beat her on her terms, and the solution turns out to be understanding what she wants. Almost every supernatural encounter in Dandadan follows that shape afterwards — which is why the [occult field manual](/anime/dandadan/occult-world) frames battles as puzzles about territory and rules rather than as strength comparisons.",
      ],
    },
    {
      heading: "The Real Legend: Tābo Bābā",
      paragraphs: [
        "Turbo Granny is not invented. Tābo Bābā — the turbo granny — is a piece of modern Japanese folklore of the same family as the schoolyard legends that spread through the late twentieth century: an old woman who runs at the speed of a car, who appears in tunnels and on mountain passes, and who chases drivers who are foolish enough to be there at night.",
        "It belongs to a recognisable class of story. The setting is a specific, mundane piece of infrastructure — a tunnel, a pass, a stretch of road — and the horror is that something moves faster than a thing built for speed. The legend needs no elaborate mythology; it works because a tunnel at night is already unsettling.",
        "What Dandadan adds is a personality. The legend has no voice, no motive and no history. The series gives her all three, and the result is a character who can be argued with — which is the only reason the first arc can end the way it does. The other folklore the series draws on is covered in [the real legends behind Dandadan](/article/dandadan-japanese-folklore-explained).",
      ],
      blocks: [
        {
          type: "table",
          caption: "The legend as told, and what the series changes",
          columns: ["The urban legend", "Dandadan's version", "Why the change matters"],
          rows: [
            [
              "An old woman who runs at car speed",
              "Kept exactly",
              "The chase is the scene the legend exists for",
            ],
            [
              "Appears in tunnels and mountain passes",
              "Kept — the abandoned tunnel is the setting",
              "Grounds the supernatural in real infrastructure",
            ],
            ["No voice, motive or history", "Loud, rude, with a clear want", "An entity that can be negotiated with"],
            [
              "Ends when you escape, or you do not",
              "Ends in a deal",
              "Sets the pattern for every later encounter",
            ],
          ],
        },
      ],
    },
    {
      heading: "The Curse, and What It Actually Costs",
      paragraphs: [
        "The encounter costs Okarun his testicles, and the series is entirely unembarrassed about saying so. It is played for comedy — and it is also the load-bearing mechanic of his power for a long stretch of the story, which is a genuinely unusual thing for a battle series to build on.",
        "The arrangement that follows is not a cure. Okarun gains access to Turbo Granny's speed in a transformed state, and the transformation has conditions and a hard limit; the full mechanics are in [Okarun's transformation explained](/article/dandadan-okarun-transformation-explained). What he does not get is his body back, and the series keeps that unresolved rather than tidying it away.",
        "This is where Dandadan separates itself from the power-fantasy structure it otherwise resembles. In most series a curse is an obstacle to be removed. Here it is a debt that keeps accruing interest, and the protagonist is faster because of it, which means fixing it has a cost too.",
      ],
    },
    {
      heading: "Why She Becomes an Ally",
      paragraphs: [
        "Turbo Granny does not stop being what she is. She is rude, self-interested, entirely willing to say the worst possible thing at the worst possible moment, and she moves into the household anyway. The series does not redeem her; it accommodates her.",
        "That choice tells you what Dandadan is doing with the supernatural. Yokai in the series are not evil in the way a battle-series villain is evil. They want things, they are bound by rules, and they can be bargained with when someone works out what the rules are. The victory condition is comprehension.",
        "It is also why the cast keeps growing rather than accumulating defeated enemies. For who joins and how the relationships work, the [character encyclopedia](/anime/dandadan/characters) covers the full roster and the chemistry between them.",
      ],
      blocks: [
        {
          type: "spoiler",
          scope: "Dandadan — beyond the opening arc",
          level: "minor",
          heading: "Where she goes from here",
          paragraphs: [
            "Turbo Granny stays relevant well past her own arc, and her knowledge of the spirit world becomes as useful as her speed. If you are watching along, [the episode and arc guide](/anime/dandadan/episode-guide) is written to be read one episode at a time without spoiling what comes next.",
          ],
        },
      ],
    },
    {
      heading: "Why the Tunnel Is Doing Half the Work",
      paragraphs: [
        "Dandadan's first horror set-piece is a chase down an abandoned tunnel, and the choice of location is not incidental. A tunnel is a corridor with no branches: there is the way forward and the way back, and something faster than you is occupying one of them. The geometry removes every option a frightened person would otherwise reach for.",
        "It also removes the audience's escape. In an open space a viewer can imagine running; in a tunnel the only variable left is speed, and the whole premise of the entity is that she has more of it. The scene works before a single supernatural rule is explained, because the shape of the place has already made the argument.",
        "This is the series' habit rather than a one-off. Encounters in Dandadan tend to happen in ordinary, specific, bounded places — a house, a stretch of road, a room — and the boundary is usually part of the problem. [The occult field manual](/anime/dandadan/occult-world) opens its reading method with exactly this: identify the territory first, then look for the entity's rule.",
      ],
    },
    {
      heading: "Negotiation as a Combat System",
      paragraphs: [
        "Most battle series resolve an encounter by finding more force than the opponent has. Dandadan resolves this one by finding out what the opponent wants, and the difference is structural rather than cosmetic — it changes what a fight scene is for.",
        "Once understanding is the win condition, the useful character in a fight is not necessarily the strongest one. Someone has to work out what the entity is bound by, someone has to survive long enough for that to happen, and someone has to be willing to offer something. That distributes importance across a group instead of concentrating it in whoever hits hardest, which is why the cast keeps growing and why each addition changes the shape of encounters rather than just adding output.",
        "It has a cost the series accepts. A story where monsters can be reasoned with cannot generate tension from raw threat alone, so it has to generate it from time, from stakes and from the possibility of misunderstanding. Turbo Granny is the proof of concept: terrifying for four episodes, then permanently in the house, and the series never pretends the second thing cancels the first.",
      ],
      blocks: [
        {
          type: "table",
          caption: "Two ways a supernatural encounter can resolve",
          columns: ["", "Defeat the entity", "Understand the entity"],
          rows: [
            ["The decisive trait", "Power output", "Observation and nerve"],
            ["Who matters in the scene", "The strongest fighter", "Whoever works out the rule"],
            ["What happens afterwards", "The entity is gone", "The entity is usually still here"],
            ["Source of tension", "Can we win", "Can we work it out in time"],
            ["Cost of failure", "Injury or death", "The same, plus the thing stays unresolved"],
          ],
        },
      ],
    },
    {
      heading: "Where to Go Next",
      paragraphs: [
        "If you have not started the series, [how to start watching Dandadan](/anime/dandadan/watch-guide) covers the viewing route and what to expect tonally — the shifts are abrupt by design.",
        "If you want the other half of the power question, [Momo Ayase's powers explained](/article/dandadan-momo-ayase-powers-explained) covers where her abilities come from and why they work differently from Okarun's.",
        "And for the series as a whole, [the complete Dandadan guide](/anime/dandadan) is the hub the rest of these pages hang from.",
      ],
    },
  ],
};

/* ------------------------------------------------------ 2. Momo --------- */

export const dandadanMomoArticle: Article = {
  ...shared,
  slug: "dandadan-momo-ayase-powers-explained",
  tags: ["dandadan", "momo-ayase", "psychic-powers", "esper", "occult"],
  title: "Momo Ayase's Powers Explained: Where They Came From and What They Cost",
  seoTitle: "Momo Ayase Powers Explained: Psychic Abilities & Their Limits",
  excerpt:
    "How Momo Ayase's psychic abilities work in Dandadan, what the encounter with the aliens actually awakened, the part her grandmother plays, and why her power is written as effort rather than as a stat.",
  ogImage: "/anime/dandadan/characters.webp",
  tag: "Dandadan · Character",
  body: [],
  faqs: [
    {
      q: "What are Momo Ayase's powers in Dandadan?",
      a: "Psychic ability — telekinesis is the clearest and most-used form, letting her move and throw objects and redirect force without touching anything. It awakens during the alien encounter in the opening arc rather than being something she trained for.",
    },
    {
      q: "Where did Momo's powers come from?",
      a: "The series ties the awakening to the encounter itself, and to her family: her grandmother Seiko is a working spirit medium, so a sensitivity to the supernatural is already in the household. The encounter is the trigger; the capacity is treated as something that was there.",
    },
    {
      q: "Is Momo stronger than Okarun?",
      a: "They are not comparable on a single axis, and the series avoids making them so. Okarun's transformed state is faster and hits harder for a strictly limited time; Momo's ability is available continuously and works at range. Which of them is more useful depends entirely on the encounter.",
    },
    {
      q: "Who is Seiko Ayase?",
      a: "Momo's grandmother and a professional spirit medium — the family's existing connection to the supernatural, and the reason Momo grew up believing in ghosts while flatly refusing to believe in aliens.",
    },
    {
      q: "Does Momo's power have limits?",
      a: "Yes, and the series shows them through exhaustion and concentration rather than through a stated cap. She tires, she can be overwhelmed, and precision under pressure is repeatedly the thing that fails first. It is written as effort, not as a resource bar.",
    },
  ],
  sections: [
    {
      heading: "The Character Before the Power",
      paragraphs: [
        "Momo Ayase is introduced as someone with a fixed position on the supernatural: ghosts are real because her family deals with them, and aliens are ridiculous. That certainty is the engine of the opening bet, and it is also why the series can make her wrong without making her foolish.",
        "Quick answer: Momo's power is psychic, telekinesis is its most visible form, it awakens during the alien encounter, her grandmother Seiko is a working medium, and the limits are shown through exhaustion rather than stated as numbers.",
        "What is worth noticing is the order of events. She is already brave, already decisive and already the person who acts first — the power arrives after the character is established, so it reads as an amplifier rather than as the reason she matters. The [character encyclopedia](/anime/dandadan/characters) covers how that plays against the rest of the cast.",
      ],
    },
    {
      heading: "What the Ability Actually Does",
      paragraphs: [
        "The clearest and most frequently used form is telekinesis: moving objects, throwing them, catching and redirecting things in motion. In practice this makes her a ranged fighter in a series where most threats want to close distance, and it means the environment is a weapon — which is why so many Dandadan fights are decided by what is lying around.",
        "It is also a defensive ability in a way that is easy to miss. Stopping something is the same action as throwing it, and the series repeatedly uses her to catch a falling person or deflect a strike aimed at someone else. She is often the reason the team survives long enough for a solution to be found.",
        "The ability is not precise by default. Fine control takes concentration, concentration is the first thing to go under pressure, and the series is consistent about it: when Momo is frightened or exhausted, what fails is accuracy, not access.",
      ],
      blocks: [
        {
          type: "table",
          caption: "Momo and Okarun as complementary rather than ranked",
          columns: ["", "Momo", "Okarun (transformed)"],
          rows: [
            ["Range", "Works at distance", "Must close the distance"],
            ["Duration", "Available continuously", "Hard time limit"],
            ["Main strength", "Control of the environment", "Speed and impact"],
            ["Fails when", "Concentration breaks", "The limit runs out"],
            ["Best against", "Multiple or distant threats", "A single fast target"],
          ],
        },
      ],
    },
    {
      heading: "Seiko, and Why the Family Matters",
      paragraphs: [
        "Seiko Ayase is Momo's grandmother and a working spirit medium — not a retired mystic or a plot device, but someone with a practice, a reputation and opinions. She is the reason the Ayase household treats the supernatural as ordinary, and the reason Momo's disbelief was aimed specifically at aliens.",
        "Her presence changes the structure of the series. Most stories of this shape require the protagonists to work everything out alone; Dandadan gives them an adult who knows more than they do and is willing to say so. It lets the plot skip explanations the characters would plausibly already have, and it makes the world feel populated rather than staged.",
        "It also sets up the contrast the whole series runs on. Spirits have lineage, tradition and people who study them. The aliens do not — they are new, unmapped and outside the family's expertise, which is exactly why the story needs both halves of the original argument.",
      ],
    },
    {
      heading: "Power as Effort, Not as a Stat",
      paragraphs: [
        "Dandadan never gives Momo a number. There is no rank, no measured output, no scene where someone assesses her level. What the series shows instead is her getting tired, getting scared, and doing it anyway — and that is a deliberate choice about what kind of story it wants to be.",
        "This puts it at the opposite end of the genre from the systems that make power legible. [Jujutsu Kaisen's cursed energy](/article/jujutsu-kaisen-cursed-energy-explained) is an economy with outputs and vows; [Hunter x Hunter's Nen](/article/hunter-x-hunter-nen-strategy-rules) is a taxonomy with rules you can study. Dandadan has neither, and does not want them.",
        "The trade is real. You lose the pleasure of a system that can be reasoned about in advance, and you gain fights that are decided by nerve and improvisation. Whether that is the better choice depends on what you came for — but it is a choice, consistently made, not an absence of thought.",
      ],
    },
    {
      heading: "The Courage That Arrives Before the Power",
      paragraphs: [
        "The scene that defines Momo is not one where she uses an ability. It is the moment she decides that someone being hurt is her problem, before she has any means of doing something about it — and the series returns to that decision far more often than it returns to her power level.",
        "This matters for how the fights read. A character who was already going to intervene does not become braver when she gains telekinesis; she becomes effective. The power resolves a gap between intention and capability that the story had already established, which is why her first uses of it feel like relief rather than like an upgrade.",
        "It is also why she works as the series' anchor through its tonal swerves. Dandadan moves between comedy, body horror, romance and cosmic threat sometimes within one episode, and the thing that holds those together is a protagonist whose response to all four registers is recognisably the same person. The [character encyclopedia](/anime/dandadan/characters) sets out how that plays against Okarun, Aira and Jiji.",
      ],
    },
    {
      heading: "Fighting at Range in a Series About Closing Distance",
      paragraphs: [
        "Almost every threat in Dandadan wants to reach you. Turbo Granny's whole nature is speed toward a target; the spirits that follow are mostly grapplers, chasers and things that arrive. Against that pattern, an ability that works at distance is not a stylistic choice — it is the counter the team is built around.",
        "It changes what a location means. When Momo is present, anything loose in the environment is ammunition and anything heavy is a wall, so the series stages its fights in places that have furniture, debris and architecture. A fight in an empty field would waste her; a fight in a cluttered house is where she is most dangerous.",
        "And it makes her the one who buys time. The transformed Okarun has a clock, which means someone has to keep a situation survivable until the moment where spending that clock is worth it. Momo is usually that someone, and the series treats holding a line as an achievement rather than as a lesser contribution.",
      ],
      blocks: [
        {
          type: "table",
          caption: "What the ability does when it is not being used to attack",
          columns: ["Situation", "What she does with it", "Why it matters"],
          rows: [
            ["Someone is falling or thrown", "Catches them without contact", "Removes the injury the scene was heading for"],
            ["A strike is aimed at an ally", "Deflects rather than blocks", "Costs less concentration than stopping it dead"],
            ["The team is exposed", "Moves cover into place", "Turns the environment into structure"],
            ["Okarun's limit is running out", "Holds the line", "Buys the seconds the plan needs"],
          ],
        },
      ],
    },
    {
      heading: "Where to Go Next",
      paragraphs: [
        "For the other side of the partnership, [Okarun's transformation explained](/article/dandadan-okarun-transformation-explained) covers the borrowed power, its conditions and its hard limit.",
        "For how the two systems fit together in a fight, [the occult field manual](/anime/dandadan/occult-world) covers territory, entity rules and how to read an encounter.",
        "And if you are new, [the complete Dandadan guide](/anime/dandadan) and [the watch guide](/anime/dandadan/watch-guide) are the spoiler-aware way in.",
      ],
    },
  ],
};

/* --------------------------------------------------- 3. Okarun --------- */

export const dandadanOkarunArticle: Article = {
  ...shared,
  slug: "dandadan-okarun-transformation-explained",
  tags: ["dandadan", "okarun", "turbo-granny", "power-systems", "transformation"],
  title: "Okarun's Transformation Explained: Borrowed Speed, Conditions and the Time Limit",
  seoTitle: "Okarun Transformation Explained: Borrowed Power & Its Limit",
  excerpt:
    "How Okarun's transformation works in Dandadan: whose power he is using, what has to be true before it activates, the hard limit that ends it, and why a borrowed ability is written as a debt rather than an upgrade.",
  ogImage: "/anime/dandadan/hero.webp",
  tag: "Dandadan · Guide",
  body: [],
  faqs: [
    {
      q: "What are Okarun's powers in Dandadan?",
      a: "He transforms into a fast, physically overwhelming form powered by Turbo Granny's curse rather than by anything of his own. The speed is hers; what he contributes is the willingness to use it and, increasingly, the judgement about when.",
    },
    {
      q: "Why is Okarun's transformation limited?",
      a: "Because the power is borrowed, not owned. The series gives the transformed state a hard time limit and ties its availability to the terms of the arrangement with Turbo Granny — which means every fight he is in has a clock, and the tension comes from that clock rather than from a damage total.",
    },
    {
      q: "What does Okarun need to get his body back?",
      a: "The testicles Turbo Granny took, which the story treats as genuinely lost rather than as a problem about to be solved. It stays an open thread, and the power he currently has is entangled with it.",
    },
    {
      q: "Is Okarun's transformation the same as a curse?",
      a: "It is the curse. There is no separate power he unlocked; the transformation is what the curse does when the arrangement allows it. That is the distinction the series keeps making — he is not stronger, he has access to something that belongs to someone else.",
    },
    {
      q: "What is Okarun's real name?",
      a: "Ken Takakura. \"Okarun\" is the nickname Momo gives him, because she refuses to call him by a name she associates with someone else — and it sticks, which is a small joke the series never stops telling.",
    },
  ],
  sections: [
    {
      heading: "A Power That Is Not His",
      paragraphs: [
        "Almost every battle series eventually hands its protagonist a transformation. Dandadan hands Okarun one and then spends the rest of the story reminding him it is on loan. The speed, the strength and the presence all belong to Turbo Granny; what Okarun supplies is the decision to use them and the body they act through.",
        "Quick answer: the transformation runs on Turbo Granny's curse, it is available under the terms of their arrangement, it has a hard time limit, and it does not restore what the curse took. The limit is the point, not a balancing tweak.",
        "This makes the transformation read as debt rather than as growth. He is not becoming stronger in the way a shonen protagonist becomes stronger; he is drawing on an account that belongs to someone else, and the account has terms. [Turbo Granny explained](/article/dandadan-turbo-granny-explained) covers how that arrangement was struck.",
      ],
    },
    {
      heading: "The Clock, and What It Does to a Fight",
      paragraphs: [
        "The transformed state ends. That single design decision changes the shape of every fight Okarun is in: he cannot win by attrition, cannot afford to test an opponent, and cannot treat the transformation as a state to fight in rather than a window to act in.",
        "It forces the fights to be about planning, which is the same instinct behind the rest of the series' combat. A transformation with a clock means the interesting question is never \"can he win\" but \"can the team set up a situation where thirty seconds is enough\" — and that question involves everyone, not just him.",
        "It also means he loses. Repeatedly, and in ways that matter, because running out of time is a failure mode a character cannot train away. The series uses that far more than it uses defeat by a stronger opponent.",
      ],
      blocks: [
        {
          type: "table",
          caption: "Why a borrowed power is written differently from an earned one",
          columns: ["", "A power the hero owns", "Okarun's borrowed power"],
          rows: [
            ["Source", "The character", "Turbo Granny's curse"],
            ["Grows by", "Training and resolve", "The terms of the arrangement"],
            ["Runs out", "Rarely, and dramatically", "Every time, on a clock"],
            ["Losing it", "A setback", "The default state"],
            ["What it costs", "Effort", "Something already taken"],
          ],
        },
      ],
    },
    {
      heading: "Ken Takakura, Before and Underneath",
      paragraphs: [
        "Okarun starts the series as someone with no social standing and one genuine conviction: aliens are real, and he can prove it. That conviction is what takes him to the tunnel, and it is the only thing he brings that the transformation does not supply.",
        "The series is careful to keep him useful when he is not transformed. He researches, he reasons about what an entity wants, and he is the one most likely to work out the rule a fight turns on — which matters, because the transformation is unavailable more often than it is available.",
        "And the nickname is doing quiet work. Momo calls him Okarun because she will not use the name he shares with a famous actor, and the joke is that a character defined by having no presence gets renamed by the person who notices him first. [The character encyclopedia](/anime/dandadan/characters) covers how that relationship develops.",
      ],
      blocks: [
        {
          type: "spoiler",
          scope: "Dandadan — later arcs",
          level: "minor",
          heading: "How the arrangement changes",
          paragraphs: [
            "The terms of what Okarun can access do not stay fixed, and the series tests them as the threats get larger. [The episode and arc guide](/anime/dandadan/episode-guide) is written to be read alongside a watch rather than ahead of it, if you want to follow that without getting ahead of yourself.",
          ],
        },
      ],
    },
    {
      heading: "What the Limit Does to the Character",
      paragraphs: [
        "A transformation with a clock does not just constrain the fights; it constrains who Okarun is allowed to become. He cannot grow into someone who solves problems by transforming, because the transformation is never available long enough to be a solution on its own — so the growth has to happen somewhere else.",
        "Where it happens is preparation. He is the one who reads, who works out what an entity is bound by, who arrives at an encounter already knowing something useful. The series gives him the least reliable power and the most reliable homework, and those two facts are the same design decision seen from different sides.",
        "It also means his best moments are usually decisions rather than blows. Choosing when to spend the window, choosing not to spend it, choosing to spend it protecting someone rather than winning — these are the beats the series builds toward, and none of them would exist if the state simply lasted as long as the fight did.",
      ],
    },
    {
      heading: "Borrowed Power Across the Genre",
      paragraphs: [
        "Dandadan is not alone in giving its protagonist something that belongs to someone else, and the comparison is instructive. [Jujutsu Kaisen](/article/jujutsu-kaisen-sukuna-explained) does it with a vessel and a binding vow, where the occupant is a permanent negotiated threat rather than a resource. Both stories understand that a borrowed power is more interesting than an earned one because it comes with a creditor.",
        "The difference is tone. Jujutsu Kaisen treats the arrangement as a horror — the thing inside is waiting. Dandadan treats it as an inconvenience with a personality, and the entity moves in. Same structure, opposite register, and both work because the debt is never quietly written off.",
        "What neither does is the thing most series do, which is to convert the borrowed power into an owned one as a reward for character growth. Okarun does not graduate out of the curse. The series keeps him in it, and keeps the cost visible, which is why the transformation still generates tension long after a conventional power-up would have stopped.",
      ],
      blocks: [
        {
          type: "table",
          caption: "How the same structure reads in two series",
          columns: ["", "Okarun and Turbo Granny", "Yuji and Sukuna"],
          rows: [
            ["What was taken", "Part of his body", "Control, conditionally"],
            ["The entity now", "Lives with them, rudely", "Waits, and negotiates"],
            ["The limit", "A hard clock on the state", "The terms of a binding vow"],
            ["Register", "Comedy with a real cost", "Horror with a real cost"],
            ["Resolved by growth?", "No — the debt stays", "No — the vow stays"],
          ],
        },
      ],
    },
    {
      heading: "Where to Go Next",
      paragraphs: [
        "For the partner half of the pair, [Momo Ayase's powers explained](/article/dandadan-momo-ayase-powers-explained) covers the psychic side and why the two abilities are complementary rather than ranked.",
        "For the real folklore all of this is built on, [the Japanese legends behind Dandadan](/article/dandadan-japanese-folklore-explained) traces the entities back to their sources.",
        "And [the complete Dandadan guide](/anime/dandadan) is the hub, with [the watch guide](/anime/dandadan/watch-guide) for anyone starting now.",
      ],
    },
  ],
};

/* ------------------------------------------------- 4. the folklore ----- */

export const dandadanFolkloreArticle: Article = {
  ...shared,
  slug: "dandadan-japanese-folklore-explained",
  tags: ["dandadan", "japanese-folklore", "yokai", "urban-legends", "analysis"],
  title: "The Real Japanese Folklore Behind Dandadan: Which Legends Are Actually Real",
  seoTitle: "Dandadan Folklore Explained: The Real Japanese Legends",
  excerpt:
    "Turbo Granny, Acrobatic Silky and the rest — which of Dandadan's entities come from real Japanese urban legends, what the originals say, and what the series changes when it adapts them.",
  ogImage: "/anime/dandadan/episodes.webp",
  tag: "Dandadan · Analysis",
  body: [],
  faqs: [
    {
      q: "Are Dandadan's monsters based on real Japanese legends?",
      a: "Several of the most prominent are. Turbo Granny comes from Tābo Bābā, a modern legend about an old woman who runs at car speed through tunnels, and Acrobatic Silky adapts Akurobatikku Sarasara. The series also invents freely, and the mix is deliberate.",
    },
    {
      q: "What kind of folklore does Dandadan use?",
      a: "Mostly the modern layer rather than the classical one — the twentieth-century schoolyard and roadside legends that spread by word of mouth, rather than the older yokai catalogued in Edo-period collections. That choice is why the entities feel contemporary and specific to places like tunnels and station platforms.",
    },
    {
      q: "What does the series change about the legends?",
      a: "It gives them motives. The originals are usually a situation rather than a character: something happens to you in a place. Dandadan turns each into someone with a want, which is what allows its encounters to end in negotiation instead of escape.",
    },
    {
      q: "Are the aliens based on real material too?",
      a: "They draw on UFO subculture rather than folklore — the recognisable furniture of abduction stories, greys, and named entities from that tradition. The pairing is the series' central joke: two bodies of belief with entirely different textures, both turning out to be true.",
    },
    {
      q: "Do you need to know the folklore to enjoy Dandadan?",
      a: "No. Every entity is explained in-story well enough to follow. Knowing the source adds a layer — you can see which beats are inherited and which are the series' own — but nothing depends on it.",
    },
  ],
  sections: [
    {
      heading: "Modern Legends, Not Ancient Ones",
      paragraphs: [
        "Dandadan's supernatural half is not drawn from the classical yokai catalogues. It comes from the modern layer of Japanese folklore — the urban legends that spread through schools and workplaces in the twentieth century, attached to specific ordinary places: a tunnel, a stretch of road, a hospital corridor, a station at night.",
        "Quick answer: Turbo Granny is from the real Tābo Bābā legend, Acrobatic Silky adapts Akurobatikku Sarasara, the series draws mostly on modern rather than classical folklore, and what it consistently adds is a motive the original never had.",
        "That choice explains the texture of the series. Classical yokai come with iconography, established rules and centuries of illustration. Modern legends come with almost nothing except a place and a threat — which leaves an enormous amount of room for a writer, and Dandadan uses all of it.",
      ],
    },
    {
      heading: "Turbo Granny: Tābo Bābā",
      paragraphs: [
        "The original is simple and effective: an old woman who runs at the speed of a car, encountered in tunnels and on mountain passes, who chases vehicles. It belongs to the family of road legends that circulate wherever there are long dark stretches of infrastructure and people driving through them at night.",
        "The horror works because of the mismatch. A tunnel is built for speed; an old woman is the least threatening figure the imagination supplies; the legend puts them together and the result is worse than a monster would have been. Nothing about it needs explaining, which is why it spread.",
        "Dandadan keeps the speed, the tunnel and the chase, and adds the thing the legend never had — a voice. The full breakdown is in [Turbo Granny explained](/article/dandadan-turbo-granny-explained), including why the arc ends in a deal rather than a defeat.",
      ],
    },
    {
      heading: "Acrobatic Silky: Akurobatikku Sarasara",
      paragraphs: [
        "The second major entity adapts another modern legend, one about a figure that moves in an unnatural, contorted way — the horror being locomotion rather than appearance. Like the tunnel legend, it is built around a single wrong detail rather than an elaborate description.",
        "The series does with it what it did with Turbo Granny: keeps the unsettling movement, then supplies a history. What was a shape in a story becomes a person with something that happened to them, and the encounter turns out to be about that rather than about the fight.",
        "This is the pattern worth watching for across the whole series. The scarier the entity looks, the more likely it is that the resolution is human — and the [occult field manual](/anime/dandadan/occult-world) reads battles the same way, as puzzles about what the thing actually wants.",
      ],
      blocks: [
        {
          type: "table",
          caption: "What the series inherits and what it adds",
          columns: ["Element", "In the original legend", "In Dandadan"],
          rows: [
            ["The threat", "A situation you are caught in", "A character with a want"],
            ["The setting", "A specific ordinary place", "Kept, and made central to the fight"],
            ["Motive", "Usually none given", "Supplied, and usually tragic"],
            ["Resolution", "Escape, or no escape", "Understanding, then negotiation"],
            ["Aftermath", "The story ends", "The entity often stays"],
          ],
        },
      ],
    },
    {
      heading: "The Other Half: UFO Subculture",
      paragraphs: [
        "The alien material does not come from folklore at all. It comes from UFO subculture — the recognisable apparatus of abduction narratives, the standard-issue greys, the conspiracy frame in which agencies know more than they say. It is a different tradition with a different texture: recent, Western-inflected, and argued about rather than told.",
        "Putting the two together is the series' central joke and its structural spine. Momo's belief comes with a family, a practice and a grandmother who does this for a living; Okarun's comes with forum posts and grainy photographs. Both turn out to be correct, and neither tradition is treated as the more respectable one.",
        "It also solves a practical problem. A story with only one supernatural system runs out of new rules; a story with two can keep generating situations by putting them in contact. The alien plots expand outward into conspiracy while the spirit plots turn inward into history, and the cast has to work in both.",
      ],
    },
    {
      heading: "Why Modern Legends Adapt Better Than Ancient Ones",
      paragraphs: [
        "There is a practical reason Dandadan reaches for the twentieth-century layer rather than the Edo-period catalogues, and it is not that the classical yokai are less interesting. It is that they are already finished. A classical yokai arrives with an established appearance, a fixed behaviour and several centuries of illustration, and adapting one means either honouring all of that or visibly breaking it.",
        "Modern legends arrive with almost nothing. A place, a threat, one wrong detail. There is no canonical depiction to contradict, no scholarly tradition to answer to, and no reader who will object that the eyes are the wrong colour. Everything except the core image is free.",
        "That freedom is what lets the series do its actual trick: supplying motive. You cannot easily give a well-documented yokai a new backstory without arguing with the documentation. You can give Tābo Bābā anything you like, because the legend never said why she runs.",
      ],
    },
    {
      heading: "The Pattern: Horror First, Then a Person",
      paragraphs: [
        "Once you have seen it twice, the structure is hard to unsee. An entity is introduced at maximum threat — movement that is wrong, a chase that cannot be won, a place that has become hostile. The episode spends its budget establishing that it cannot be beaten. Then the resolution arrives from an entirely different direction: someone works out what happened to it.",
        "The effect is that the horror is never wasted. In a series where monsters are simply defeated, the frightening first act is a setup the second act discards. Here it is the evidence: the thing was that frightening because of what was done to it, and understanding the second explains the first.",
        "It also gives the series somewhere to go emotionally that a monster-of-the-week structure normally cannot reach. The cast does not accumulate victories; it accumulates people, obligations and things it now knows. That is why the roster on the [character encyclopedia](/anime/dandadan/characters) keeps expanding, and why each addition changes how encounters are solved rather than just adding another fighter.",
      ],
      blocks: [
        {
          type: "table",
          caption: "The three-beat shape of a Dandadan encounter",
          columns: ["Beat", "What happens", "What it is actually establishing"],
          rows: [
            ["The threat", "Wrong movement, a chase, a hostile place", "That force will not solve this"],
            ["The rule", "Someone works out what binds it", "That the entity is a system, not a mood"],
            ["The history", "What was done to it, and by whom", "That the horror was a consequence"],
          ],
        },
      ],
    },
    {
      heading: "Where to Go Next",
      paragraphs: [
        "For how the powers those encounters produce actually work, [Momo's psychic abilities](/article/dandadan-momo-ayase-powers-explained) and [Okarun's borrowed transformation](/article/dandadan-okarun-transformation-explained) cover the two halves of the partnership.",
        "For the series in order, [the episode and arc guide](/anime/dandadan/episode-guide) is spoiler-aware and written to be read one episode at a time.",
        "And [the complete Dandadan guide](/anime/dandadan) collects all of it, with [the watch guide](/anime/dandadan/watch-guide) as the entry point for anyone starting tonight.",
      ],
    },
  ],
};

export const dandadanClusterArticles: Article[] = [
  dandadanTurboGrannyArticle,
  dandadanMomoArticle,
  dandadanOkarunArticle,
  dandadanFolkloreArticle,
];
