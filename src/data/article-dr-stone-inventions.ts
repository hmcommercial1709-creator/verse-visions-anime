import type { Article } from "./articles";
import drStoneArt from "@/assets/art/dr-stone.webp.asset.json";

/**
 * Cornerstone English guide for the Dr. Stone invention cluster:
 * "dr stone inventions list", "dr stone all inventions",
 * "dr stone inventions in order", "dr stone science inventions",
 * "dr stone technology tree".
 *
 * Original URL and publication date are preserved; `updated` drives the
 * visible "Last updated" byline and Article dateModified.
 */
export const drStoneInventionsArticle: Article = {
  slug: "dr-stone-science-tech-tree-guide",
  section: "guides",
  category: "rpg",
  tags: ["dr-stone", "inventions", "tech-tree", "science", "guide"],
  title: "Dr. Stone Inventions List: The Complete Science Tech Tree",
  seoTitle: "Dr. Stone Inventions List: Complete Science & Tech Tree",
  excerpt:
    "Explore the major inventions in Dr. Stone in order, from basic tools and medicine to communication, engines and advanced technology.",
  ogImage: drStoneArt.url,
  author: "hana-mori",
  date: "2026-02-05",
  updated: "2026-08-04",
  tag: "Dr. Stone · Guide",
  cover: "linear-gradient(135deg, #16a34a, #052e16)",
  body: [],
  related: ["dr-stone"],
  faqs: [
    {
      q: "What is the first invention in Dr. Stone?",
      a: "The revival fluid comes first. Senku works out that a nitric-acid solution mixed with alcohol reverses petrification, which is how Taiju and later everyone else is freed. Stone-age basics — cord, spears, a lamp and a working fire pit — follow immediately after.",
    },
    {
      q: "How many inventions are there in Dr. Stone?",
      a: "There is no single official count, because the story treats small tools and headline machines the same way. Roughly forty to fifty named creations matter to the plot, from soap and cola to the sulfa drug, the generator, the light bulb, the cell phone and the final spacecraft.",
    },
    {
      q: "What is the most important invention in Dr. Stone?",
      a: "The sulfa drug. It cures Ruri's pneumonia, wins Ishigami Village's trust and therefore secures the labour force every later project depends on. Technically it also proves the lab can run a long chemical chain from raw materials.",
    },
    {
      q: "Does Dr. Stone use real science?",
      a: "Mostly yes. The chemistry and the dependency order are grounded in real processes, and the series consults specialists. Timescales are compressed for drama, so a furnace, a purification run or a machine build takes far less story time than it would in reality.",
    },
    {
      q: "What order should you follow the Dr. Stone tech tree in?",
      a: "Watch order matches build order: survival tools, then iron and glass, then medicine, then electricity, then communication, then engines and vehicles, then the late-story advanced technology. Each tier supplies the materials the next tier needs.",
    },
  ],
  sections: [
    {
      heading: "How the Dr. Stone Science Tech Tree Works",
      paragraphs: [
        "Dr. Stone is built like a tech tree with a cast attached. Every invention Senku Ishigami attempts has prerequisites, and the series is unusually disciplined about honouring them: no glass without silica sand and a hot enough furnace, no antibiotics without glassware, no telephone without copper wire, and no copper wire without smelting.",
        "That discipline is why the show's pacing works. Long stretches are spent on charcoal, bellows, salt and manpower — the unglamorous inputs — so that each headline machine arrives as a payoff rather than a coincidence. The other constraint is social: Senku needs people, and people need reasons. Food, medicine and comfort come early because they buy the labour that heavy industry requires.",
        "Read the list below as a build order rather than a highlight reel. The point is not that Senku makes a phone; it is that the phone is the top of a chain the story spent two seasons laying down. If you want the character side of the same idea, our [Frieren magic-system deep dive](/article/frieren-magic-system-deep-dive) looks at how another series makes rules feel researched, and [Grinding vs Storytelling](/article/grinding-vs-storytelling-progression-pacing) covers why earned progression reads better than granted power.",
      ],
      blocks: [
        {
          type: "table",
          caption: "Major Dr. Stone inventions, their prerequisites and where they land in the story.",
          columns: ["Invention", "Materials or prerequisite", "Purpose", "Story stage"],
          rows: [
            ["Revival fluid", "Nitric acid from cave deposits, alcohol", "Reverse petrification", "Stone World opening"],
            ["Stone-age tool kit", "Cord, stone, wood, fire", "Survival, hunting, shelter", "Stone World opening"],
            ["Ramen and cola", "Wheat, wild ingredients, carbonate springs", "Morale, recruiting allies", "Early Kingdom of Science"],
            ["Iron (tatara furnace)", "Iron sand, charcoal, forced air", "Tools, blades, wire, machine parts", "Early Kingdom of Science"],
            ["Glass", "Silica sand, high-temperature furnace", "Lab vessels, lenses, lamps", "Early Kingdom of Science"],
            ["Sulfa drug", "Glassware, sulfur, acids, careful synthesis", "Cure pneumonia, win village trust", "Village arc"],
            ["Generator", "Magnets, copper wire, iron core", "Electricity for later machines", "Village and Stone Wars arcs"],
            ["Light bulb", "Glass bulb, tungsten filament, vacuum", "Light, and proof of vacuum control", "Stone Wars arc"],
            ["Cell phone", "Copper wire, vacuum tube, electricity", "Long-range coordination in battle", "Stone Wars arc"],
            ["Steam engine", "Iron, boiler, pressure sealing", "Powered transport and machinery", "Post-Stone-Wars industry"],
            ["Ship and navigation gear", "Timber, iron fittings, instruments", "Ocean travel to new regions", "Treasure Island era"],
            ["Refined fuel and aircraft", "Petroleum, refining, precision engines", "Fast long-distance travel", "Late story"],
            ["Spacecraft", "Entire industrial base rebuilt", "Reach the petrification source", "Final arc"],
          ],
        },
      ],
    },
    {
      heading: "Early Survival Inventions",
      paragraphs: [
        "The first tier is pure stone age. Senku wakes in a petrified world with no infrastructure, so the opening inventions are cord, spears, a fire pit, a stone-and-charcoal lamp and a rough calendar kept by counting days. None of it is impressive on its own; all of it is the base of the tree.",
        "The revival fluid is the genuine breakthrough of this stage. Senku identifies a nitric-acid source in a bat cave and mixes it with alcohol to free other petrified humans, which turns a solo survival story into a project with a workforce. Choosing who to revive becomes an early strategic decision rather than a moral afterthought.",
        "Comfort inventions matter more than they look. Ramen, cola, soap and simple sweets are how Senku converts suspicious strangers into collaborators, and they double as small proofs that his methods deliver. Chrome's stone-cellar collection of minerals is the other quiet unlock here: a catalogued material supply is what lets the lab attempt anything harder.",
      ],
    },
    {
      heading: "Medicine and the Sulfa Drug Roadmap",
      paragraphs: [
        "The first true milestone is medical, not military. Ruri, the village priestess, is dying of pneumonia, and Senku commits the young Kingdom of Science to synthesising a sulfa drug — an antibacterial compound that predates penicillin and, crucially, can be built from materials the group can actually reach.",
        "The roadmap is the most instructive sequence in the series. It needs heat-resistant glassware, so glass comes first. It needs sulfur and acid handling, so a sulfur source and safe vessels come next. Every step is a separate expedition or build, and the show lets each failure cost time. That is the honest version of a tech tree: the recipe is public, the logistics are the difficulty.",
        "The social payoff is larger than the medical one. Curing Ruri converts Ishigami Village from a cautious host into a partner, which is what makes later heavy industry possible at all. Antibiotics also change the risk profile of everything that follows, since injuries and infections stop being automatic death sentences during dangerous construction work.",
      ],
    },
    {
      heading: "Electricity, Glass and Industrial Tools",
      paragraphs: [
        "Iron and glass are the two materials the rest of the series routes through. Iron arrives via a tatara-style furnace fed with iron sand, charcoal and forced air, giving the lab blades, nails, vessel fittings and — most importantly — wire. Glass arrives from silica sand at high temperature, giving flasks, lenses and eventually sealed bulbs.",
        "Electricity follows from magnets plus copper wire. A hand-cranked generator is enough to start, and once current exists the tree branches quickly: electrolysis for chemicals the group cannot mine, arc heat for higher furnace temperatures, and stored power for machines that cannot wait on muscle. Kaseki, the village craftsman, is effectively a prerequisite in himself, because precision parts need a machinist and not just a smith.",
        "The light bulb belongs in this tier rather than the luxury column. Making one work forces the lab to solve filament material and vacuum sealing, and both skills transfer directly to the vacuum tube that powers the next tier. In tech-tree terms it is a cheap-looking node that opens an expensive one.",
      ],
    },
    {
      heading: "Communication and Information Technology",
      paragraphs: [
        "The cell phone is the series' signature build, and it is a genuine dependency payoff: copper wire from smelting, vacuum tubes from glass and filament work, and steady current from the generator. Senku's team assembles a crude wired-and-radio telephone system during the Stone Wars, and it wins that conflict less by force than by coordination — one side can pass information instantly, the other cannot.",
        "Around it sit the information tools that make a small population effective: paper, printing and written records, so knowledge stops living in one person's head. Chalk-and-slate diagrams, maps and material inventories are unglamorous inventions that quietly raise the ceiling on every project.",
        "Communication also changes the story's shape. Once messages travel faster than people, arcs can run multiple operations at once, and the series shifts from single-village problems to expeditions with a base of operations. For a comparison with another progression-driven series, our [Solo Leveling System guide](/article/solo-leveling-system-progression-explained) breaks down how a very different kind of rule set escalates.",
      ],
    },
    {
      heading: "Vehicles, Engines and Advanced Technology",
      paragraphs: [
        "The industrial tier begins with steam. A boiler, sealed pressure and iron parts give the Kingdom of Science powered movement — vehicles that carry loads no team of villagers could, and rotating power for workshop machinery. From there the tree opens into ocean travel: a seaworthy ship, navigation instruments and the food preservation needed for a long voyage.",
        "Chemistry keeps pace with mechanics. Petroleum access allows refining, refining allows better fuels and lubricants, and better fuels allow engines with far higher power-to-weight ratios than steam. That is the step that makes flight plausible within the story's own rules rather than as a wish.",
        "By the late arcs the group is not inventing single objects any more; it is rebuilding an industrial base capable of precision manufacturing, and the goals scale accordingly.",
      ],
      blocks: [
        {
          type: "spoiler",
          scope: "Dr. Stone late story",
          level: "major",
          heading: "Late-story inventions (spoilers)",
          paragraphs: [
            "The final stretch of the story pushes the tech tree past anything Senku could have built alone. Aircraft shorten expeditions that used to take arcs, and the search for the source of petrification turns into a full space programme — the endgame requires rebuilding enough heavy industry, fuel refining and precision engineering to leave the planet.",
            "The petrification device itself becomes a tool rather than only a threat, which is the series' neatest structural trick: the phenomenon that started the story ends up as one more node on the tech tree, with its own prerequisites and its own costs.",
          ],
        },
      ],
    },
    {
      heading: "Dr. Stone Inventions in Order",
      paragraphs: [
        "Condensed build order, tier by tier: revival fluid and stone-age tools; food, soap and cola for morale and recruitment; charcoal, iron sand and the furnace; glass and laboratory vessels; the sulfa drug; magnets, wire and the generator; the light bulb and vacuum sealing; the vacuum tube and the telephone; paper and printing; steam power and vehicles; ships and navigation; petroleum refining, engines and flight; and finally the large-scale programme of the closing arc.",
        "The rule behind the order is simple: nothing appears before the material and the manpower that make it possible. When you spot an invention arriving early, the story has usually just paid for it with an expedition, a new ally or a failed attempt — which is exactly why the series rewards rewatching with the dependency chain in mind.",
        "For series background, cast and season details, see our [Dr. Stone series hub](/anime/dr-stone).",
      ],
      blocks: [
        {
          type: "poll",
          question: "Which Dr. Stone invention is the real turning point?",
          options: ["Revival fluid", "Sulfa drug", "The generator", "The cell phone"],
        },
      ],
    },
    {
      heading: "Frequently Asked Questions",
      paragraphs: [
        "What is the first invention in Dr. Stone? The revival fluid — a nitric-acid and alcohol solution that reverses petrification — alongside the basic stone-age tools Senku needs to survive long enough to make it.",
        "How many inventions are there in Dr. Stone? There is no official count, since the series treats small tools and headline machines alike. Roughly forty to fifty named creations matter to the plot.",
        "What is the most important invention in Dr. Stone? The sulfa drug. It cures Ruri's pneumonia, earns Ishigami Village's trust and secures the workforce every later project needs.",
        "Does Dr. Stone use real science? Largely yes. The processes and their order are grounded in real chemistry and metallurgy, with timescales compressed for storytelling.",
        "What order should you follow the tech tree in? Survival tools, iron and glass, medicine, electricity, communication, engines and vehicles, then the late-story advanced technology — the same order the anime presents them.",
      ],
    },
  ],
};
