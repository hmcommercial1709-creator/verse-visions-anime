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
  category: "fantasy",
  tags: ["dr-stone", "inventions", "tech-tree", "science", "guide"],
  title: "Dr. Stone Inventions List in Order: Complete Science Tech Tree",
  seoTitle: "Dr. Stone Inventions List in Order: Complete Tech Tree",
  excerpt:
    "The complete Dr. Stone inventions list in order, from revival fluid and the sulfa drug to the cell phone, aircraft and spacecraft, with real-science notes.",

  ogImage: assetUrl(drStoneArt.url),
  author: "hana-mori",
  date: "2026-02-05",
  updated: "2026-08-05",
  tag: "Dr. Stone · Guide",
  cover: "linear-gradient(135deg, #16a34a, #052e16)",
  body: [],
  related: ["dr-stone", "frieren", "solo-leveling", "hunter-x-hunter"],
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
    {
      q: "Does Senku build every Dr. Stone invention himself?",
      a: "No. Senku designs the roadmap and handles much of the chemistry, but Chrome finds materials, Kaseki makes precision parts, Kohaku and the villagers supply labour, Gen recruits allies, Ryusui handles navigation and logistics, and later specialists contribute computing and advanced engineering.",
    },
  ],
  sections: [
    {
      heading: "The Dr. Stone Inventions List at a Glance",
      paragraphs: [
        "Dr. Stone is built like a tech tree with a cast attached. Every invention Senku Ishigami attempts has prerequisites, and the series is unusually disciplined about honouring them: no glass without silica sand and a hot enough furnace, no antibiotics without glassware, no telephone without copper wire, and no copper wire without smelting.",
        "Quick answer: Dr. Stone's inventions follow a strict dependency order. Senku begins with revival fluid and stone-age tools, then iron and glass, then the sulfa drug that wins the village over, then electricity, the light bulb and the cell phone, and finally steam power, ships, aircraft and a spacecraft.",
        "That discipline is why the show's pacing works. Long stretches are spent on charcoal, bellows, salt and manpower — the unglamorous inputs — so that each headline machine arrives as a payoff rather than a coincidence. The other constraint is social: Senku needs people, and people need reasons. Food, medicine and comfort come early because they buy the labour that heavy industry requires.",
        "Read the list below as a build order rather than a highlight reel. The point is not that Senku makes a phone; it is that the phone is the top of a chain the story spent two seasons laying down. If you want a comparison, our [Frieren magic-system deep dive](/article/frieren-magic-system-deep-dive) looks at how another series makes its rules feel researched rather than invented.",
      ],
      blocks: [
        {
          type: "table",
          caption: "All major Dr. Stone inventions, what they are for, what they need and where they land in the story.",
          columns: ["Invention", "Purpose", "Materials", "Story stage"],
          rows: [
            ["Revival fluid", "Reverse petrification", "Nitric acid from cave deposits, alcohol", "Stone World opening"],
            ["Stone-age tool kit", "Survival, hunting, shelter", "Cord, stone, wood, fire", "Stone World opening"],
            ["Ramen and cola", "Morale, recruiting allies", "Wheat, wild ingredients, carbonate springs", "Early Kingdom of Science"],
            ["Iron (tatara furnace)", "Tools, blades, wire, machine parts", "Iron sand, charcoal, forced air", "Early Kingdom of Science"],
            ["Glass", "Lab vessels, lenses, lamps", "Silica sand, high-temperature furnace", "Early Kingdom of Science"],
            ["Sulfa drug", "Cure pneumonia, win village trust", "Glassware, sulfur, acids, careful synthesis", "Village arc"],
            ["Generator", "Electricity for later machines", "Magnets, copper wire, iron core", "Village and Stone Wars arcs"],
            ["Light bulb", "Light, and proof of vacuum control", "Glass bulb, tungsten filament, vacuum", "Stone Wars arc"],
            ["Cell phone", "Long-range coordination in battle", "Copper wire, vacuum tube, electricity", "Stone Wars arc"],
            ["Steam engine", "Powered transport and machinery", "Iron, boiler, pressure sealing", "Post-Stone-Wars industry"],
            ["Ship and navigation gear", "Ocean travel to new regions", "Timber, iron fittings, instruments", "Treasure Island era"],
            ["Refined fuel and aircraft", "Fast long-distance travel", "Petroleum, refining, precision engines", "Late story"],
            ["Spacecraft", "Reach the petrification source", "Entire industrial base rebuilt", "Final arc"],
          ],
        },
      ],
    },
    {
      heading: "How the Dr. Stone Science Roadmap Works",
      paragraphs: [
        "The science roadmap has two axes. The material axis decides what is physically possible: charcoal and forced air give higher furnace temperatures, temperature gives iron and glass, glass gives laboratory chemistry, and chemistry gives everything from medicine to refined fuel. Nothing in the series jumps a rung on that ladder.",
        "The social axis decides what is practical. Senku inventions that look frivolous — cola, ramen, soap, sweets — exist to recruit and retain the workforce that heavy industry needs, and each one also demonstrates that his methods deliver results faster than superstition does.",
        "Keep both axes in mind and the list stops looking like trivia. Every entry in the table above is either a material unlock, a labour unlock, or a payoff that spends both.",
      ],
    },

    {
      heading: "Early Senku Inventions: Survival Tools and Revival Fluid",
      paragraphs: [
        "The first tier is pure stone age. Senku wakes in a petrified world with no infrastructure, so the opening inventions are cord, spears, a fire pit, a stone-and-charcoal lamp and a rough calendar kept by counting days. None of it is impressive on its own; all of it is the base of the tree.",
        "The revival fluid is the genuine breakthrough of this stage. Senku identifies a nitric-acid source in a bat cave and mixes it with alcohol to free other petrified humans, which turns a solo survival story into a project with a workforce. Choosing who to revive becomes an early strategic decision rather than a moral afterthought.",
        "Comfort inventions matter more than they look. Ramen, cola, soap and simple sweets are how Senku converts suspicious strangers into collaborators, and they double as small proofs that his methods deliver. Chrome's stone-cellar collection of minerals is the other quiet unlock here: a catalogued material supply is what lets the lab attempt anything harder.",
      ],
    },
    {
      heading: "Medicine on the Science Roadmap: The Sulfa Drug",
      paragraphs: [
        "The first true milestone is medical, not military. Ruri, the village priestess, is dying of pneumonia, and Senku commits the young Kingdom of Science to synthesising a sulfa drug — an antibacterial compound that predates penicillin and, crucially, can be built from materials the group can actually reach.",
        "The roadmap is the most instructive sequence in the series. It needs heat-resistant glassware, so glass comes first. It needs sulfur and acid handling, so a sulfur source and safe vessels come next. Every step is a separate expedition or build, and the show lets each failure cost time. That is the honest version of a tech tree: the recipe is public, the logistics are the difficulty.",
        "The social payoff is larger than the medical one. Curing Ruri converts Ishigami Village from a cautious host into a partner, which is what makes later heavy industry possible at all. Antibiotics also change the risk profile of everything that follows, since injuries and infections stop being automatic death sentences during dangerous construction work.",
      ],
    },
    {
      heading: "Dr. Stone Inventions for Electricity, Glass and Industry",
      paragraphs: [
        "Iron and glass are the two materials the rest of the series routes through. Iron arrives via a tatara-style furnace fed with iron sand, charcoal and forced air, giving the lab blades, nails, vessel fittings and — most importantly — wire. Glass arrives from silica sand at high temperature, giving flasks, lenses and eventually sealed bulbs.",
        "Electricity follows from magnets plus copper wire. A hand-cranked generator is enough to start, and once current exists the tree branches quickly: electrolysis for chemicals the group cannot mine, arc heat for higher furnace temperatures, and stored power for machines that cannot wait on muscle. Kaseki, the village craftsman, is effectively a prerequisite in himself, because precision parts need a machinist and not just a smith.",
        "The light bulb belongs in this tier rather than the luxury column. Making one work forces the lab to solve filament material and vacuum sealing, and both skills transfer directly to the vacuum tube that powers the next tier. In tech-tree terms it is a cheap-looking node that opens an expensive one.",
      ],
    },
    {
      heading: "Senku Inventions for Communication and Information",
      paragraphs: [
        "The cell phone is the series' signature build, and it is a genuine dependency payoff: copper wire from smelting, vacuum tubes from glass and filament work, and steady current from the generator. Senku's team assembles a crude wired-and-radio telephone system during the Stone Wars, and it wins that conflict less by force than by coordination — one side can pass information instantly, the other cannot.",
        "Around it sit the information tools that make a small population effective: paper, printing and written records, so knowledge stops living in one person's head. Chalk-and-slate diagrams, maps and material inventories are unglamorous inventions that quietly raise the ceiling on every project.",
        "Communication also changes the story's shape. Once messages travel faster than people, arcs can run multiple operations at once, and the series shifts from single-village problems to expeditions with a base of operations. For a comparison with another progression-driven series, our [Solo Leveling System guide](/article/solo-leveling-system-progression-explained) breaks down how a very different kind of rule set escalates.",
      ],
    },
    {
      heading: "Vehicles, Engines and Advanced Dr. Stone Technology",
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
      heading: "Dr. Stone Inventions in Order by Technology Tier",
      paragraphs: [
        "A complete list is easier to understand when inventions are grouped by dependency rather than episode number. The order below follows the technology tree: survival and revival, materials and medicine, electricity and communication, industrial transport, then late-story precision engineering.",
        "Some entries are small tools rather than headline machines. They still belong because a gas mask, battery or length of copper wire may unlock more of the roadmap than a spectacular vehicle. Dr. Stone repeatedly treats the supporting component as the real invention.",
        "Arc labels are intentionally broad so anime viewers can use the table without exact episode spoilers. The late-story rows describe the type of technology while the dedicated spoiler block above protects the final purpose."
      ],
      blocks: [
        {
          type: "table",
          caption: "Major Dr. Stone inventions in build order, grouped by technology tier",
          columns: ["Order", "Invention or Unlock", "Why It Matters", "Technology Tier"],
          rows: [
            ["1", "Calendar and timekeeping", "Preserves a scientific timeline after petrification", "Opening survival"],
            ["2", "Fire, charcoal and stone tools", "Heat, food, cutting and basic construction", "Opening survival"],
            ["3", "Cord, rope and simple traps", "Shelter, hunting and mechanical advantage", "Opening survival"],
            ["4", "Revival fluid", "Turns petrified people back into a workforce", "Opening survival"],
            ["5", "Soap", "Hygiene, chemistry practice and infection control", "Early Kingdom of Science"],
            ["6", "Gunpowder", "Deterrence, mining potential and proof of chemical control", "Early Kingdom of Science"],
            ["7", "Ramen", "Food preservation, morale and recruitment", "Early Kingdom of Science"],
            ["8", "Cola and sweets", "Wins trust and demonstrates controlled carbonation", "Early Kingdom of Science"],
            ["9", "Charcoal furnace and bellows", "Raises temperature beyond an open fire", "Materials"],
            ["10", "Iron from iron sand", "Unlocks tools, fittings, wire and machines", "Materials"],
            ["11", "Glass and laboratory vessels", "Makes repeatable chemistry and lenses possible", "Materials"],
            ["12", "Gas masks and silver detector", "Allows safer access to poisonous sulfur sources", "Medicine roadmap"],
            ["13", "Sulfuric acid chain", "Supplies a key reagent for advanced chemistry", "Medicine roadmap"],
            ["14", "Sulfa drug", "Cures Ruri and wins Ishigami Village's support", "Medicine roadmap"],
            ["15", "Magnets and copper wire", "Core components for electricity and motors", "Electricity"],
            ["16", "Hand-cranked generator", "Produces controllable electrical current", "Electricity"],
            ["17", "Batteries", "Stores power for machines that cannot be continuously cranked", "Electricity"],
            ["18", "Light bulb", "Solves filament and vacuum-sealing problems", "Electricity"],
            ["19", "Cotton-candy machine", "Demonstrates spinning machinery and creates fine wire", "Electricity"],
            ["20", "Vacuum tube", "Amplifies and controls electronic signals", "Communication"],
            ["21", "Cell phone and radio network", "Coordinates separated teams during the Stone Wars", "Communication"],
            ["22", "Record player", "Recovers an astronaut message preserved on glass", "Information"],
            ["23", "Paper and printing", "Copies maps, plans and knowledge beyond one person", "Information"],
            ["24", "Steam engine", "Replaces muscle with continuous mechanical power", "Industrial power"],
            ["25", "Steam Gorilla vehicle", "Moves people and heavy loads across land", "Industrial power"],
            ["26", "Tank and reinforced equipment", "Applies engines and materials to battlefield protection", "Stone Wars"],
            ["27", "Dynamite", "Provides controlled explosive force for conflict and construction", "Stone Wars"],
            ["28", "Camera and photographic process", "Records information visually and reproducibly", "Exploration"],
            ["29", "Perseus sailing ship", "Carries an expedition across the ocean", "Age of Exploration"],
            ["30", "Radar and sonar", "Detects distant objects and maps underwater conditions", "Age of Exploration"],
            ["31", "Motorboat and improved engines", "Adds speed and manoeuvrability to travel", "Age of Exploration"],
            ["32", "Petroleum refining", "Supplies concentrated fuel and lubricants", "Industrial expansion"],
            ["33", "Aircraft", "Compresses journeys that previously took entire arcs", "Late story"],
            ["34", "Mass production systems", "Scales revival, food, fuel and machine components", "Global rebuilding"],
            ["35", "Electronic computer", "Handles calculations beyond practical manual work", "Precision engineering"],
            ["36", "Rocket systems and spacecraft", "Combines the entire rebuilt industrial base", "Final technology tier"],
          ],
        },
      ],
    },
    {
      heading: "How Scientifically Accurate Are the Dr. Stone Inventions?",
      paragraphs: [
        "Dr. Stone usually gets the dependency and scientific principle right, then compresses time, purity and labour for storytelling. A real process may require tighter temperature control, cleaner reagents, repeated failed batches and far more specialised equipment than the anime shows.",
        "That distinction matters. The series is not a laboratory manual, but it is unusually honest about why one technology must come before another. Viewers can learn the shape of metallurgy, glassmaking, antibiotics, electromagnetism and engines without assuming they could safely reproduce the procedure from an episode.",
        "Revival fluid is the obvious fictional element because petrification itself is fictional. Once the premise is accepted, most later inventions use real scientific relationships even when the production schedule is dramatically accelerated."
      ],
      blocks: [
        {
          type: "table",
          caption: "Real scientific principle versus the story's dramatic compression",
          columns: ["Project", "Real Principle", "What the Story Simplifies"],
          rows: [
            ["Tatara furnace", "Charcoal and forced air reduce iron sand at high heat", "Fuel use, slag control and repeated smelting runs"],
            ["Glassware", "Silica and additives melt into workable glass", "Temperature control, annealing and breakage rates"],
            ["Sulfa drug", "Sulfonamides are real antibacterial medicines", "Purification, dosing, by-products and production time"],
            ["Generator", "Moving conductors through a magnetic field produces current", "Magnet quality, insulation and machining precision"],
            ["Light bulb", "A heated filament glows inside a low-oxygen enclosure", "Vacuum quality and filament lifespan"],
            ["Vacuum-tube phone", "Electronic amplification can carry voice signals", "Signal noise, tuning, component tolerances and range"],
            ["Steam engine", "Pressurised steam converts heat into mechanical work", "Boiler safety, seals and manufacturing consistency"],
            ["Aircraft and spacecraft", "Propulsion follows real fuel, mass and control constraints", "Enormous labour, testing, supply chains and development time"],
          ],
        },
      ],
    },
    {
      heading: "Who Builds the Inventions With Senku?",
      paragraphs: [
        "Senku is the system architect, but the Kingdom of Science is not a one-person laboratory. He remembers formulas, chooses the next dependency and translates modern technology into steps a stone-world team can perform. The actual build succeeds because other characters supply skills he does not have.",
        "Chrome is the field scientist and mineral collector. His curiosity identifies local materials and produces independent discoveries rather than merely following instructions. Kaseki is the master craftsman whose precision turns a correct diagram into glassware, gears, engines and sealed components that actually work.",
        "Kohaku, Taiju and the wider workforce solve the energy problem: mining, carrying, farming and construction. Gen converts inventions into alliances; Ryusui contributes navigation, resource planning and large-project ambition; Francois keeps expeditions supplied; later specialists make advanced computation and precision manufacturing possible.",
        "This division of labour is the article's most important accuracy point. Modern technology is not a pile of clever ideas. It is coordinated expertise, materials, logistics and repeatable production. For a power system built around individual restrictions instead of social dependencies, compare the [Hunter x Hunter Nen guide](/article/hunter-x-hunter-nen-strategy-rules). For externally granted powers, see the [One Piece Devil Fruit guide](/article/one-piece-devil-fruit-system-explained)."
      ],
    },
    {
      heading: "The Full Dr. Stone Inventions List in Order",
      paragraphs: [
        "Condensed build order, tier by tier: revival fluid and stone-age tools; food, soap and cola for morale and recruitment; charcoal, iron sand and the furnace; glass and laboratory vessels; the sulfa drug; magnets, wire and the generator; the light bulb and vacuum sealing; the vacuum tube and the telephone; paper and printing; steam power and vehicles; ships and navigation; petroleum refining, engines and flight; and finally the large-scale programme of the closing arc.",
        "The rule behind the order is simple: nothing appears before the material and the manpower that make it possible. When you spot an invention arriving early, the story has usually just paid for it with an expedition, a new ally or a failed attempt — which is exactly why the series rewards rewatching with the dependency chain in mind.",
        "For individual science roadmaps, continue with [how revival fluid works](/article/dr-stone-revival-fluid-formula-explained), [the sulfa drug that saves Ruri](/article/dr-stone-sulfa-drug-roadmap-explained) and [how Senku builds the Stone World phone](/article/how-dr-stone-built-cell-phone). For series background, cast and season details, see our [Dr. Stone series hub](/anime/dr-stone).",
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
      heading: "Dr. Stone Inventions FAQ",
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
