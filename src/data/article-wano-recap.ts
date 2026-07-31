import type { Article } from "./articles";

/**
 * Cornerstone rewrite of the Wano recap. Target cluster: "wano",
 * "wano arc explained", "what happened in wano", "wano arc episodes",
 * "is wano worth watching", "wano ending explained".
 */
export const wanoRecapArticle: Article = {
  slug: "one-piece-wano-recap",
  section: "guides",
  category: "gaming-guides",
  tags: ["one-piece", "wano", "arc-guide", "recap", "watch-order"],
  title:
    "Wano Arc Explained: The Complete One Piece Wano Recap, Episode List, Timeline and Ending (2026 Guide)",
  excerpt:
    "What happened in Wano, in order: the episode range, every phase of the raid on Onigashima, the Kaido and Orochi outcomes, and why the arc changed One Piece's endgame.",
  author: "hana-mori",
  date: "2026-07-31",
  tag: "One Piece · Arc Guide",
  cover: "linear-gradient(135deg, #ef4444, #1a1005 55%, #facc15)",
  body: [],
  related: ["one-piece"],
  faqs: [
    {
      q: "What episodes is the Wano arc in One Piece?",
      a: "The Wano Country arc runs from episode 890 through episode 1085 in the anime, with the Reverie and Levely material immediately before it (episodes 878–889) acting as setup. Manga readers cover the same story in chapters 909–1057.",
    },
    {
      q: "What actually happened in the Wano arc?",
      a: "The Straw Hats allied with the Nine Red Scabbards, Kin'emon's samurai and the Mink tribe to overthrow Shogun Kurozumi Orochi and the Emperor Kaido. After a raid on Onigashima that ran across four phases, Orochi was killed, Kaido and Big Mom were defeated and dropped into a collapsed magma chamber, Momonosuke was installed as Shogun, and Luffy was declared one of the Four Emperors of the Sea.",
    },
    {
      q: "Is the Wano arc worth watching or should I skip it?",
      a: "It is not skippable. Wano resolves the Kozuki family mystery, the Poneglyph hunt, Kaido's history with Roger's era, Zoro's ancestry and Luffy's Devil Fruit awakening. Skipping it makes the Final Saga incoherent.",
    },
    {
      q: "How long does the Wano arc take to watch?",
      a: "Roughly 195 episodes, about 78 hours at full length. Watching only the canon episodes and using the recap-free stream cuts brings that closer to 62–65 hours.",
    },
    {
      q: "Does Luffy defeat Kaido in Wano?",
      a: "Yes. Luffy wins on the roof-to-summit fight after awakening his Devil Fruit and landing Bajrang Gun, sending Kaido through Onigashima's floor into the magma below alongside Big Mom, who was defeated separately by Kid and Law.",
    },
    {
      q: "What is the correct watch order around Wano?",
      a: "Whole Cake Island, then the Reverie, then Wano, then Egghead. The two Film Red and Film Gold side stories sit outside the timeline and can be watched after Wano without conflict.",
    },
  ],
  sections: [
    {
      heading: "Wano Arc Explained in One Paragraph (No Spoilers Beyond the Premise)",
      paragraphs: [
        "Wano Country is the longest continuous story One Piece has ever told, and it is also the most tightly plotted. If you only want the short answer: the Straw Hat Grand Fleet, the surviving samurai of the Kozuki clan and the Mink tribe of Zou combine into one alliance to overthrow two powers at once — a shogun who sold his country to a pirate, and the pirate himself, an Emperor of the Sea who has never lost a fight. The arc is structured like a heist that becomes a siege that becomes a war, and by the end the political map of the world has changed in ways the series had been setting up since Skypiea.",
        "Everything below is organised the way readers actually search for it. First the practical data — the episode range, the chapter range, how long it takes, where it sits in the watch order. Then the recap itself in six phases, in order, written so you can use it either as a refresher before the Final Saga or as a substitute for a rewatch. Late-arc outcomes and the ending live behind labelled spoiler gates so this page is safe to read at any point in the story.",
        "One thing worth saying up front, because it is the most common objection to the arc: Wano is long, but it is not padded in the way its reputation suggests. The length comes from the number of resolutions it has to deliver. Sixteen named characters have arcs that conclude here, and three separate historical mysteries — the Kozuki cipher, Kaido's link to Roger's final year, and the origin of the Ancient Weapons — get real answers rather than teases.",
      ],
      blocks: [
        {
          type: "table",
          caption: "Wano Country at a glance: where it starts, where it ends, and how it maps between anime and manga.",
          columns: ["Question", "Anime", "Manga"],
          rows: [
            ["Arc range", "Episodes 890–1085", "Chapters 909–1057"],
            ["Setup you should not skip", "Episodes 878–889 (Reverie)", "Chapters 903–908"],
            ["Runtime / read time", "≈195 episodes, ~78 hours", "≈149 chapters, ~15 hours"],
            ["Filler inside the arc", "Very little; a handful of recap episodes", "None"],
            ["What comes next", "Egghead Island (1086+)", "Egghead (1058+)"],
          ],
        },
      ],
    },
    {
      heading: "What Episode Does Wano Start and End? (Full Episode Breakdown)",
      paragraphs: [
        "The single most searched question about this arc is where it begins, and the honest answer has two layers. The arc proper opens at episode 890, when the crew lands on Wano's shores in scattered groups. But the story starts earlier: the Reverie sequence, episodes 878 to 889, establishes the political stakes at the world-government level that Wano pays off, and the Zou arc before it introduces Kin'emon's alliance and the Mink tribe. If you jump straight to 890 you will still follow the plot; you will simply miss why the ending matters globally rather than locally.",
        "The arc's internal structure is four acts, and knowing where the act breaks fall is the most useful thing a viewer can have, because each act changes the show's genre. Act one is an infiltration story: disguises, information gathering, a country that punishes curiosity. Act two is a heist and a betrayal, ending with the alliance's plan in ruins. Act three is the raid on Onigashima itself, which is where the arc converts into sustained action. Act four is the aftermath — a long, deliberate decompression that sets the Final Saga's board.",
        "For anyone budgeting time, the recap-free cut of the arc is the practical answer to the pacing complaints. A meaningful number of episodes in acts two and three open with extended recaps of the previous week, which is invisible on a weekly broadcast and grating on a binge. Skipping the pre-title recaps takes roughly a quarter off the arc's effective runtime with zero story loss.",
      ],
      blocks: [
        {
          type: "table",
          caption: "The four acts of Wano, with the episode ranges and what changes in each.",
          columns: ["Act", "Episodes", "What Happens", "Genre Shift"],
          rows: [
            ["Act 1 — Arrival", "890–928", "The crew infiltrates Wano in disguise; Luffy is imprisoned at the Prisoner Mine", "Infiltration / mystery"],
            ["Act 2 — The Plan Collapses", "929–981", "The Fire Festival plan is exposed; the alliance loses its element of surprise", "Heist / betrayal"],
            ["Act 3 — The Raid on Onigashima", "982–1076", "Live-floor battles, the roof fight, the flying island, Kaido and Big Mom", "War / sustained action"],
            ["Act 4 — Aftermath", "1077–1085", "Succession, the Poneglyph, the new world order and the Emperor announcement", "Political epilogue"],
          ],
        },
        {
          type: "link",
          label: "The Complete One Piece Watch Order (With Skippable Filler Marked)",
          to: "/article/one-piece-watch-order-complete-guide",
          note: "Where Wano sits in the full run, plus which films are safe to watch and when.",
        },
      ],
    },
    {
      heading: "Phase 1 — Arrival: Why Wano Is a Country That Punishes Questions",
      paragraphs: [
        "Wano opens as a mystery rather than a fight, and it is deliberately disorienting. The crew is scattered, the country is closed, and the currency of the arc is information: who the Kozuki retainers are, why the land is poisoned, what the Fire Festival is, and who the shogun really answers to. Oda structures the first act so the audience learns the country the way an outsider would — through rumour, censorship and the visible gap between the capital's prosperity and the ruin of the outer regions.",
        "The environmental storytelling is the strongest it has ever been in the series. Rivers run with industrial runoff from Kaido's weapons factories, villages survive on contaminated water, and the state's official explanation is that Wano has always been this way. That is the arc's real thesis: an occupation maintained by rewriting history. It is the same idea the Void Century has been circling for hundreds of chapters, tested at a scale a reader can hold in their head.",
        "Practically, this phase is where the alliance is assembled. Kin'emon's Scabbards are revealed piece by piece, the Minks arrive from Zou, Law's crew is already embedded, and Kid's separate vendetta is running in parallel. It is also where Luffy's plot thread splits off into the Prisoner Mine, which is the setup for the single most important mechanical development of the arc — his discovery of advanced Haki through repeated, humiliating failure against a much stronger opponent.",
      ],
      blocks: [
        {
          type: "image",
          art: "one-piece-wano-recap",
          caption: "Wano's closed borders and industrial ruin: the arc's politics are visible in its landscape before anyone explains them.",
        },
      ],
    },
    {
      heading: "Phase 2 — The Fire Festival Plan and How It Falls Apart",
      paragraphs: [
        "The alliance's plan is straightforward and good: use the Fire Festival's chaos as cover, sail on Onigashima with a small strike force, kill Kaido and Orochi in the same night. What makes act two work is that the plan fails before it launches, and it fails for a reason the story earned rather than for convenience. Information leaks through a member of the alliance under coercion, Orochi's intelligence apparatus does its job, and the raid goes ahead anyway with the surprise element gone and half the expected numbers.",
        "This is the emotional centre of the arc for long-time readers, because it is where Wano stops being about a nation and becomes about a family. The Kozuki retainers have been waiting twenty years for one night. They know the odds have collapsed. They go anyway. That decision — knowingly walking into an unwinnable fight because the alternative is another generation under occupation — is the thing the entire arc is built to make you feel, and it is why the flashback material that follows it lands as hard as it does.",
        "Structurally, this act also solves a problem One Piece usually struggles with: the sheer number of allies. Rather than giving everyone a moment, Oda assigns each ally a specific job on Onigashima and lets the raid's geography — the live floor, the treasure room, the skull dome, the roof — do the work of separating the cast into fights that can breathe.",
      ],
      blocks: [
        {
          type: "spoiler",
          scope: "Wano act 2",
          level: "major",
          heading: "How the plan is exposed (open only if you have watched past episode 970)",
          paragraphs: [
            "Kanjuro, one of the Nine Red Scabbards, is revealed as a Kurozumi loyalist who has been feeding Orochi information for twenty years. He hands over the meeting point and the timing, then abducts Momonosuke, forcing the alliance to launch early and openly.",
            "The reveal is set up much earlier than most readers notice: Kanjuro's drawings failing at critical moments, his convenient absences, and the fact that the Scabbards' plans had been intercepted repeatedly across two decades with no explanation.",
          ],
        },
      ],
    },
    {
      heading: "Phase 3 — The Raid on Onigashima, Floor by Floor",
      paragraphs: [
        "The raid is the longest sustained action sequence in the series, and reading it as a single fight is why some viewers burn out. It is better understood as five simultaneous battles on different floors of the same building, each with its own stakes and its own resolution. The live floor holds the numbers game against the Beast Pirates' rank and file. The treasure room and interior corridors hold the Tobiroppo duels. The roof holds the Emperors. The skull dome holds the political fight — Orochi, the Scabbards and the succession. And outside, the island is airborne and heading for the Flower Capital, which is the arc's ticking clock.",
        "What the raid does exceptionally well is give every major Straw Hat a fight that resolves a long-standing question about them rather than just a stronger opponent. Zoro's fight is about the limits of his swords and his lineage. Sanji's is about the body his family gave him and whether using it costs him his humanity. Robin's is about whether she can survive being wanted for what she knows. Franky, Usopp, Nami, Chopper and Jinbe all get equivalent tests, and none of them are decorative.",
        "The roof fight deserves separate mention because it is the structural hinge of the modern series. Five captains of the Worst Generation stand against two Emperors of the Sea, and the fight is written as a genuine attrition problem rather than a power-level exchange: the alliance's win condition is separation, not damage. Splitting Kaido from Big Mom is the whole strategy, and the moment it succeeds you can feel the arc turn.",
      ],
      blocks: [
        {
          type: "table",
          caption: "The raid's parallel fronts and what each one resolves for the story.",
          columns: ["Front", "Key Combatants", "What It Resolves"],
          rows: [
            ["The roof", "Luffy, Zoro, Law, Kid, Killer vs Kaido and Big Mom", "Whether the Worst Generation can contend at Emperor level"],
            ["Skull dome / stage", "The Nine Red Scabbards vs Kaido, then Orochi", "Twenty years of Kozuki vengeance and the shogunate itself"],
            ["Live floor", "Straw Hats and Minks vs Beast Pirates rank and file", "The numbers problem and the Mink alliance's payoff"],
            ["Interior duels", "Zoro, Sanji, Robin, Franky, Usopp, Nami, Chopper, Jinbe vs Tobiroppo and All-Stars", "Each crew member's individual long-running arc"],
            ["Outside / sky", "Momonosuke, Yamato, the Flower Capital", "The ticking clock and Momonosuke's claim to lead"],
          ],
        },
      ],
    },
    {
      heading: "Phase 4 — The Flashbacks: Oden, Roger, and the Twenty Lost Years",
      paragraphs: [
        "The Oden flashback is the reason Wano works. Dropped in the middle of act two, it reframes everything the audience has seen: the poisoned rivers, the closed borders, the retainers' desperation, and Wano's refusal to open to the world. It also connects Wano directly to Gol D. Roger's final voyage, which is the single largest piece of world-building the series has delivered since Ohara.",
        "Two revelations do the heavy lifting. First, Wano's isolation is not xenophobia but a promise — Oden's own decision, made for reasons the flashback withholds until the end. Second, Roger's crew reached the final island, and what they found there is described clearly enough to reset the reader's model of the endgame while withholding the specific answer. Wano is where One Piece stops being a treasure hunt and becomes a story about an inherited war.",
        "The flashback is also, structurally, where the arc earns its length. A shorter Wano could have delivered the raid. It could not have delivered the twenty-year weight that makes the raid feel like a conclusion rather than an escalation.",
      ],
      blocks: [
        {
          type: "link",
          label: "One Piece story arcs ranked and explained",
          to: "/anime/one-piece",
          note: "The full arc index, with episode ranges and the canon/filler split.",
        },
      ],
    },
    {
      heading: "The Wano Ending Explained: Every Outcome, In Order",
      paragraphs: [
        "The ending of Wano is not one event but a sequence of six, and search traffic for 'wano ending explained' mostly comes from readers who remember the fights and not the settlement. Below is the resolution list, gated because it is the most spoiler-heavy material on this page. Open it only if you have finished the arc or you genuinely want to be spoiled.",
        "What is safe to say without gates: the arc closes with a formal change in the world's power structure, a new Poneglyph in the crew's possession, a succession settled in the Flower Capital, and a Straw Hat crew that leaves Wano with a target on its back rather than a rumour attached to it. The Final Saga begins from a position the series has never been in before — Luffy is no longer an underdog in the eyes of the world.",
      ],
      blocks: [
        {
          type: "spoiler",
          scope: "Wano ending",
          level: "ending",
          heading: "The six outcomes of Wano (full spoilers)",
          paragraphs: [
            "1. Orochi is killed and the Kurozumi claim to the shogunate ends; Denjiro's twenty-year infiltration as Kyoshiro is the mechanism.",
            "2. Kaido is defeated by Luffy after his Devil Fruit awakening, and Big Mom is defeated separately by Kid and Law. Both Emperors fall into the magma chamber beneath Onigashima.",
            "3. Momonosuke is installed as Shogun of Wano, and the country begins the process of opening its borders on his own terms rather than Oden's promise.",
            "4. The Road Poneglyph held by Kaido passes to the Straw Hats, putting them one step from Laugh Tale's coordinates.",
            "5. Luffy is publicly named one of the Four Emperors of the Sea, replacing Kaido, and his bounty is raised to three billion.",
            "6. The alliance fractures cleanly — Law, Kid, Yamato and the Minks each set separate courses — which is how the Final Saga gets multiple simultaneous plotlines rather than one convoy.",
          ],
        },
      ],
    },
    {
      heading: "Is Wano Worth Watching? An Honest Answer for Binge Viewers",
      paragraphs: [
        "Yes, and the reason is not sentimental. Wano is load-bearing for everything after it. The Final Saga assumes you know who holds which Poneglyph, why Luffy's Devil Fruit behaves the way it now does, what happened to two of the Four Emperors, and why Wano's borders opening matters to the World Government. Skipping the arc does not save you time; it converts every subsequent episode into a partially comprehensible one.",
        "That said, the pacing criticism is legitimate and worth planning around. Three things make the binge dramatically better: skip the pre-title recaps, watch acts two and three in blocks of four to six episodes rather than one at a time, and do not pause between the Oden flashback and the raid. The arc was written for a weekly reader; a binge viewer has to do a small amount of scheduling work to get the intended shape.",
        "If you are returning after a long break rather than watching for the first time, the most efficient path is this page's phase summaries plus the last eight episodes of act four. That gives you the board state without re-spending seventy hours.",
      ],
      blocks: [
        {
          type: "poll",
          question: "Where does Wano rank for you among One Piece's arcs?",
          options: ["Best arc in the series", "Top three", "Great but too long", "Overrated"],
        },
      ],
    },
    {
      heading: "Frequently Asked Questions About the Wano Arc",
      paragraphs: [
        "What episodes is the Wano arc in One Piece? The arc runs from episode 890 to episode 1085, with the Reverie sequence in episodes 878 to 889 as essential setup. In the manga it covers chapters 909 to 1057.",
        "What actually happened in the Wano arc? The Straw Hats and their allies overthrew Shogun Kurozumi Orochi and the Emperor Kaido across a four-act campaign that ended in the raid on Onigashima. Orochi was killed, both Emperors present were defeated, Momonosuke became Shogun, the crew gained a Road Poneglyph, and Luffy was declared one of the Four Emperors of the Sea.",
        "How long does the Wano arc take to watch? About 78 hours at full length, or roughly 62 to 65 hours if you skip the recurring pre-title recaps and the handful of recap episodes.",
        "Can I skip Wano and go straight to Egghead? No. Egghead opens assuming the reader knows the outcomes of Wano's power shift, the Poneglyph count, and Luffy's awakened Devil Fruit. It is the least skippable long arc in the series.",
        "Is there filler in Wano? Very little. Unlike earlier stretches of One Piece, Wano is almost entirely canon; the pacing issue is recap density inside canon episodes rather than non-canon episodes you can drop.",
        "Does Zoro get a major fight in Wano? Yes, and it resolves questions about his swords and his ancestry that the series had left open since the East Blue saga. Details are inside the spoiler gate above.",
      ],
      blocks: [
        {
          type: "link",
          label: "One Piece series hub: arcs, characters, watch order and episode guides",
          to: "/anime/one-piece",
        },
      ],
    },
  ],
};
