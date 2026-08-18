import type { Article } from "./articles";
import drStoneArt from "@/assets/art/dr-stone.webp.asset.json";

const shared = {
  publicationStatus: "published" as const,
  section: "guides" as const,
  category: "fantasy" as const,
  author: "gamecastle-editorial",
  date: "2026-08-05",
  updated: "2026-08-05",
  ogImage: assetUrl(drStoneArt.url),
  cover: "linear-gradient(135deg, #16a34a, #052e16)",
};

export const drStoneRevivalFluidArticle: Article = {
  ...shared,
  slug: "dr-stone-revival-fluid-formula-explained",
  tags: ["dr-stone", "revival-fluid", "nital", "petrification", "science"],
  title: "Dr. Stone Revival Fluid Explained: Formula, Nital and Real Science",
  seoTitle: "Dr. Stone Revival Fluid Explained: Formula & Real Science",
  excerpt:
    "How Dr. Stone's revival fluid works, why Senku combines nitric acid and alcohol, what nital is in real chemistry, and which parts are fictional.",
  tag: "Dr. Stone · Revival Fluid Guide",
  body: [],
  related: ["dr-stone", "frieren", "solo-leveling"],
  faqs: [
    {
      q: "What is the revival fluid formula in Dr. Stone?",
      a: "Senku combines nitric acid from the Miracle Cave with alcohol to create a nital-like revival fluid. The story does not provide a safe real-world depetrification formula because petrification is fictional and both chemicals are hazardous.",
    },
    {
      q: "Is Dr. Stone revival fluid real?",
      a: "Nital is real: it is a nitric-acid and alcohol solution used for etching metals. It cannot revive a petrified person. The series borrows genuine chemistry and applies it to its fictional stone-shell premise.",
    },
    {
      q: "Why did Senku and Taiju revive without manufactured fluid?",
      a: "Both remained conscious for thousands of years while exposed to nitric-acid-rich cave conditions. Senku theorises that continuous brain activity consumed energy and the environmental nitric acid helped weaken the petrification.",
    },
    {
      q: "Where does the alcohol come from in Dr. Stone?",
      a: "Senku first plans to ferment grapes into wine and distil the alcohol. Producing a consistent solvent becomes a supply-chain problem rather than a single lucky discovery.",
    },
    {
      q: "Can the Dr. Stone revival fluid be made at home?",
      a: "It should not be attempted. Nitric acid is highly corrosive and mixing or handling it with alcohol can create severe fire, toxic-fume and explosion hazards. The anime mixture is a fictional plot device, not a safe experiment.",
    },
  ],
  sections: [
    {
      heading: "What Is the Revival Fluid in Dr. Stone?",
      paragraphs: [
        "Quick answer: Dr. Stone's revival fluid is a nital-like mixture made from nitric acid and alcohol. Senku uses nitric acid collected from the bat-filled Miracle Cave and combines it with distilled alcohol to break the fictional petrification shell. The chemistry reference is real; the ability to revive humans is not.",
        "The fluid is the first technology that changes the scale of the story. Fire and stone tools keep one person alive, but revival fluid creates a workforce. Every later furnace, medicine, generator and ship depends on deciding who should be revived and producing enough fluid to wake them.",
        "The series deliberately presents the discovery as an experiment rather than a miracle. Senku compares the conditions around his own revival with Taiju's, identifies the cave deposit as a shared variable and tests combinations until the stone responds. That method — observe, isolate, test and reproduce — becomes the model for every science roadmap that follows.",
        "For the full dependency chain after revival, use the [complete Dr. Stone inventions list](/article/dr-stone-science-tech-tree-guide). This page focuses only on the fluid, its ingredients and the boundary between real chemistry and fiction."
      ],
      blocks: [
        {
          type: "table",
          caption: "Revival fluid ingredients and what each one does in the story",
          columns: ["Component", "Story Source", "Role in the Fiction", "Real-World Note"],
          rows: [
            ["Nitric acid", "Deposits in the Miracle Cave", "Weakens or reacts with the petrification shell", "A real, highly corrosive acid"],
            ["Alcohol", "Fermented and distilled plant sugars", "Combines with nitric acid to form the active mixture", "A real solvent and flammable liquid"],
            ["Nital-like solution", "Nitric acid plus alcohol", "Reverses petrification", "Real nital etches metal; it does not revive life"],
            ["Experimental control", "Repeated tests on stone fragments", "Identifies a reproducible result", "The scientific method is the most realistic part"],
          ],
        },
      ],
    },
    {
      heading: "Why Nitric Acid Matters",
      paragraphs: [
        "Nitric acid is the clue linking the earliest revivals. Senku wakes close to a cave where bat guano and natural processes create nitrate-rich conditions, and Taiju eventually revives in the same environment. That does not prove the acid works alone; it gives Senku the starting variable worth testing.",
        "The cave becomes strategically essential because it is both a laboratory resource and a bottleneck. Whoever controls the nitric-acid supply controls the speed and direction of human revival. Tsukasa's conflict with Senku is therefore also a conflict over access to chemistry.",
        "In real life, nitric acid is used in fertiliser production, metal treatment and industrial synthesis. It is powerful because it is both an acid and an oxidising agent. Those same properties make it dangerous: skin contact, inhalation and mixing with organic liquids can cause catastrophic injury.",
        "GameCastle does not provide quantities or preparation steps because the fictional result cannot occur and the reagents are not suitable for a home experiment. The useful lesson is how the story turns one scarce chemical into a political resource."
      ],
    },
    {
      heading: "Why Alcohol Is the Second Ingredient",
      paragraphs: [
        "Nitric acid provides the shared environmental clue, but Senku needs alcohol before he can make a reliable revival fluid. His plan begins with fermentation: yeast converts sugar from fruit into ethanol. Distillation can then concentrate the alcohol enough for controlled chemical work.",
        "That creates a miniature technology tree. Grapes or another sugar source require gathering and agriculture; fermentation needs time and clean containers; distillation needs heat, vessels and condensation. Even the first headline invention depends on food science, glass or pottery and a stable workforce.",
        "Alcohol also explains why the cave alone does not instantly revive everyone. Environmental nitric acid may contribute, but the manufactured mixture supplies a second chemical condition that produces a repeatable reaction in the story.",
        "The distinction between fermentation and distillation is important. Fermentation creates alcohol biologically; distillation separates and concentrates liquids by their boiling behaviour. Dr. Stone compresses the schedule, but the dependency order is grounded in real processes."
      ],
    },
    {
      heading: "What Is Nital in Real Chemistry?",
      paragraphs: [
        "Nital is a real laboratory solution containing nitric acid in an alcohol. Metallurgists use it to etch polished metal surfaces so grain boundaries and microstructures become visible under examination. It is an analytical preparation, not a medicine.",
        "The name is why many viewers describe Senku's revival fluid as nital. The resemblance is intentional: the fictional stone shell behaves like a material that can be chemically attacked, allowing the story to borrow a recognisable industrial mixture.",
        "The comparison stops there. Human petrification does not exist, and real nital would damage tissue rather than restore it. A chemically plausible name gives the premise texture without turning it into a reproducible biological mechanism.",
        "This is typical Dr. Stone design. The show anchors a fictional goal to a real principle, then compresses equipment, purity and risk so the plot can move. Our [science-accuracy section in the inventions guide](/article/dr-stone-science-tech-tree-guide) applies the same test to glass, antibiotics, electricity and engines."
      ],
      blocks: [
        {
          type: "table",
          caption: "Real nital compared with Dr. Stone revival fluid",
          columns: ["Question", "Real Nital", "Dr. Stone Revival Fluid"],
          rows: [
            ["Purpose", "Etches metal for examination", "Reverses fictional petrification"],
            ["Chemistry", "Nitric acid in an alcohol solvent", "A nital-like nitric-acid and alcohol mixture"],
            ["Effect on humans", "Corrosive and dangerous", "Restorative only within the fiction"],
            ["Safe home experiment?", "No", "No — the fictional outcome cannot occur"],
          ],
        },
      ],
    },
    {
      heading: "How Senku Tests the Revival Fluid",
      paragraphs: [
        "Senku does not begin by pouring chemicals over an intact person. He works with fragments from petrified bodies, changes variables and watches for a reaction. The exact montage is simplified, but the logic is sound: use smaller samples, preserve controls and avoid wasting the only available supply.",
        "Taiju contributes patience and labour while Senku contributes the experimental model. Their partnership matters because thousands of trials require time, containers, notes and a way to keep conditions consistent.",
        "The breakthrough also shows the difference between discovery and production. Finding one successful mixture proves a concept. Reviving a population requires continuous nitric acid, agricultural alcohol, storage vessels, transport and people trusted to use it.",
        "That production problem returns throughout the series. Senku can remember a formula instantly, but civilisation only changes when the team can manufacture it repeatedly."
      ],
    },
    {
      heading: "Why Senku and Taiju Revived First",
      paragraphs: [
        "Senku remains conscious by counting seconds throughout petrification, while Taiju maintains a powerful focus on Yuzuriha. The story treats that continuing brain activity as an energy demand that helps resist the stone state.",
        "Both are also exposed to the Miracle Cave environment. Senku combines the mental and chemical clues into a hypothesis: sustained consciousness plus nitric-acid exposure created the rare conditions for spontaneous revival.",
        "This explanation remains part of the fictional petrification system, not neuroscience. Its narrative purpose is clearer than its biology: the first two people wake because persistence was already their defining trait.",
        "Later mass revival removes the need for every person to remain conscious. Once chemistry can reproduce the missing condition, personal will stops being the only path back."
      ],
    },
    {
      heading: "Revival Fluid as a Strategic Resource",
      paragraphs: [
        "Revival fluid determines population, skills and political power. Reviving a craftsperson, navigator or strong fighter changes what the community can build next. A bottle of fluid is therefore closer to a recruitment system than a healing potion.",
        "Tsukasa wants selective revival because he believes rebuilding the old social order would repeat its failures. Senku wants broad restoration because modern science depends on accumulated knowledge and specialised people. Their disagreement becomes concrete through control of the cave.",
        "The fluid also creates moral decisions. A damaged statue can sometimes be repaired before revival, but missing fragments and limited supply force the characters to choose where labour goes first. Science provides capability without automatically deciding how it should be used.",
        "The next major project asks the opposite question: after waking people, how does the Kingdom of Science keep them alive? Continue with the [Dr. Stone sulfa-drug roadmap](/article/dr-stone-sulfa-drug-roadmap-explained)."
      ],
      blocks: [
        {
          type: "poll",
          question: "What makes revival fluid most important to the story?",
          options: ["It creates a workforce", "It starts the Senku–Tsukasa conflict", "It proves petrification can be reversed", "It turns science into political power"],
        },
      ],
    },
    {
      heading: "Dr. Stone Revival Fluid FAQ",
      paragraphs: [
        "What is in the revival fluid? Nitric acid and alcohol, described as a nital-like mixture.",
        "Is the formula real? Nital is real, but reversing petrification is entirely fictional.",
        "Why is the Miracle Cave important? It supplies nitric acid and controls how quickly new people can be revived.",
        "Why not publish exact mixing instructions? Nitric acid and alcohol are hazardous, the fictional outcome is impossible, and quantities would add risk without educational value.",
        "What should you read next? The [complete inventions tech tree](/article/dr-stone-science-tech-tree-guide) explains what the revived workforce builds after the opening."
      ],
    },
  ],
};

export const drStoneSulfaDrugArticle: Article = {
  ...shared,
  slug: "dr-stone-sulfa-drug-roadmap-explained",
  tags: ["dr-stone", "sulfa-drug", "medicine", "ruri", "science-roadmap"],
  title: "Dr. Stone Sulfa Drug Explained: Medicine Roadmap and Real Science",
  seoTitle: "Dr. Stone Sulfa Drug Explained: Roadmap & Real Science",
  excerpt:
    "Why Senku makes a sulfa drug for Ruri, the materials and team behind the medicine roadmap, how sulfonamides work, and what the anime simplifies.",
  tag: "Dr. Stone · Medicine Roadmap",
  body: [],
  related: ["dr-stone", "frieren"],
  faqs: [
    {
      q: "What medicine does Senku make for Ruri?",
      a: "Senku's team synthesises a sulfa drug, an early antibacterial medicine, to treat the bacterial pneumonia that has made Ruri chronically ill.",
    },
    {
      q: "Why does Senku choose a sulfa drug instead of penicillin?",
      a: "A synthetic sulfonamide can be planned from reachable raw materials and verified through a chemical roadmap. Producing dependable penicillin would require finding the right mould, maintaining a sterile culture and controlling purification with limited equipment.",
    },
    {
      q: "Is the sulfa drug in Dr. Stone real?",
      a: "Sulfonamides are real antibacterial medicines. The anime uses genuine chemistry and medical history, but compresses hazardous synthesis, purification, dosing and the time needed to confirm a safe product.",
    },
    {
      q: "What illness does Ruri have?",
      a: "Senku identifies Ruri's condition as pneumonia caused by a bacterial infection. The sulfa drug works because it targets bacterial metabolism rather than merely reducing symptoms.",
    },
    {
      q: "Can viewers reproduce Senku's medicine?",
      a: "No. Pharmaceutical synthesis requires controlled facilities, verified purity, accurate diagnosis and professional dosing. The story is educational fiction, not medical or laboratory instruction.",
    },
  ],
  sections: [
    {
      heading: "What Is the Sulfa Drug in Dr. Stone?",
      paragraphs: [
        "Quick answer: Senku makes a synthetic sulfonamide antibacterial to treat Ruri's pneumonia. The project requires glassware, high-temperature processing, dangerous acids, coal-derived chemistry and a team capable of collecting and refining each dependency.",
        "The sulfa drug is the first invention whose success changes the Kingdom of Science socially as much as medically. Ruri's recovery proves that Senku can deliver something the village's traditions could not, earning trust, labour and the authority required for later projects.",
        "It also marks a shift from survival science to industrial chemistry. Soap and food can be made with forgiving processes; a medicine needs the right compound, sufficient purity and a dose that helps without creating another problem.",
        "This article explains the roadmap and real science at a safe, conceptual level. It does not provide a synthesis recipe. For the broader build order, open the [complete Dr. Stone inventions list](/article/dr-stone-science-tech-tree-guide)."
      ],
      blocks: [
        {
          type: "table",
          caption: "The major dependencies in Dr. Stone's sulfa-drug roadmap",
          columns: ["Dependency", "Why It Is Needed", "Who or What Unlocks It"],
          rows: [
            ["Heat-resistant glassware", "Holds and separates reactive chemicals", "Kaseki's craftsmanship and silica glass"],
            ["Sulfur source", "Provides sulfur chemistry for the antibacterial compound", "The poisonous spring expedition"],
            ["Acids and alkalis", "Drive intermediate reactions and purification", "Salt, sulfur, charcoal and controlled processing"],
            ["Coal-derived feedstock", "Supplies aromatic chemical building blocks", "Mineral collection and furnace chemistry"],
            ["Precision heating", "Keeps reactions within useful ranges", "Furnaces, charcoal and laboratory vessels"],
            ["Clean water and containers", "Reduces contamination and enables repeatable batches", "Village labour and the glass shop"],
            ["Diagnosis and observation", "Connects the medicine to a bacterial illness", "Senku's clinical reasoning and Ruri's history"],
          ],
        },
      ],
    },
    {
      heading: "Why Ruri Needs an Antibacterial Medicine",
      paragraphs: [
        "Ruri has lived with recurring fever, weakness, coughing and worsening respiratory illness. Senku recognises the pattern as pneumonia rather than a curse or a condition that simple nutrition can solve.",
        "Pneumonia can have different causes, but the story identifies a bacterial infection that is vulnerable to a sulfonamide. That matters because an antibacterial does not treat every fever and cannot replace diagnosis.",
        "The village has supportive care but no way to stop bacterial growth inside the body. Senku's goal is therefore not to make a generic tonic; it is to produce a molecule that interferes with the pathogen strongly enough for Ruri to recover.",
        "The result is dramatic because the series lets viewers understand the target first. Medicine is presented as an engineered answer to a biological mechanism, not as a magic item with a green label."
      ],
    },
    {
      heading: "How Sulfonamides Work in Real Medicine",
      paragraphs: [
        "Sulfonamides were among the first widely used synthetic antibacterial drugs. They interfere with a bacterial pathway used to make folate-related compounds required for growth and replication.",
        "Human cells obtain folate differently, giving the medicine a degree of selective action. That does not make sulfonamides harmless: allergies, interactions, resistance and incorrect dosing are real clinical concerns.",
        "Historically, sulfa drugs transformed treatment before penicillin became widely available. Dr. Stone chooses them because their story matches Senku's philosophy: a medicine assembled through deliberate chemistry rather than discovered as a finished substance.",
        "The anime simplifies the difference between producing a chemical and producing a pharmaceutical. Real medicine requires identity testing, purity standards, dose calculation, monitoring and knowledge of the patient's condition."
      ],
      blocks: [
        {
          type: "table",
          caption: "What the anime gets right and what it compresses",
          columns: ["Element", "Grounded in Real Science", "Compressed for Storytelling"],
          rows: [
            ["Drug class", "Sulfonamides are real antibacterials", "One successful project resolves the full treatment problem"],
            ["Mechanism", "Bacterial metabolism can be selectively disrupted", "Diagnosis and response appear faster and clearer"],
            ["Synthesis", "Organic chemistry can build a sulfonamide", "Hazards, by-products and purification are abbreviated"],
            ["Equipment", "Glassware and controlled heat are essential", "Improvised parts reach pharmaceutical precision rapidly"],
            ["Treatment", "Bacterial pneumonia may respond to an effective antibacterial", "Dose selection and clinical monitoring are simplified"],
          ],
        },
      ],
    },
    {
      heading: "Why Senku Does Not Use Penicillin",
      paragraphs: [
        "Penicillin sounds easier because it originates from mould, but finding a productive strain is only the first step. The team would need sterile culture, controlled growth conditions, extraction, purification and a reliable way to measure potency.",
        "A sulfa roadmap is long yet predictable. Senku can list the chemical dependencies, search for each raw material and assign a build task. The project fits the Kingdom of Science's strength: turning a known endpoint into a chain of solvable logistics.",
        "The choice also reduces biological uncertainty. Fermentation can fail because the organism changes or contamination takes over; a synthetic route fails in ways that are often easier to trace to temperature, material or missing reagent.",
        "Neither option would be simple in reality. The point is that Senku chooses the process he can plan with the people and equipment available, not the medicine modern viewers recognise most easily."
      ],
    },
    {
      heading: "The Glassware and Sulfuric-Acid Bottleneck",
      paragraphs: [
        "Before the team can make medicine, it needs vessels that survive heat and corrosive chemicals. Kaseki's glasswork converts sand and minerals into flasks, tubes and separators, making controlled laboratory chemistry possible for the first time.",
        "Sulfur chemistry creates the most dangerous expedition. The group approaches a toxic spring where one mistake can expose them to lethal gas. Protective equipment, detection and teamwork become prerequisites before collection begins.",
        "The sequence is valuable because it shows that knowledge does not cancel risk. Senku may know which chemical is required, but reaching it safely demands engineering, preparation and people willing to follow the procedure.",
        "Exact preparation details are intentionally omitted here. Concentrated acids and toxic gases require professional facilities; the educational value lies in dependency planning, not imitation."
      ],
    },
    {
      heading: "Who Builds the Medicine Roadmap?",
      paragraphs: [
        "Senku supplies the chemical target and order of operations. Chrome finds and understands local minerals, turning abstract ingredients into places the team can actually reach. Kaseki produces vessels precise enough to stop the entire plan from leaking, cracking or contaminating itself.",
        "Kohaku handles transport and dangerous field work. Ginro and Kinro become part of access and protection. Suika scouts, gathers information and solves small logistical problems that would otherwise stop a reaction before it begins.",
        "Ruri is not merely the prize at the end. Her condition creates a deadline and a measurable test: the Kingdom of Science must deliver a medicine that works for a real person, not a laboratory demonstration.",
        "This division of labour is why the roadmap succeeds. The show credits scientific knowledge without pretending knowledge can mine ore, blow glass, carry water and monitor a patient by itself."
      ],
    },
    {
      heading: "Why the Sulfa Drug Is the Most Important Early Invention",
      paragraphs: [
        "Revival fluid begins the population; the sulfa drug creates the community. Curing Ruri changes Senku from an outsider with strange tools into a leader whose methods have saved someone everyone knows.",
        "The project also unlocks the laboratory. After building glassware, furnaces and acid-handling capability, the team keeps those assets. Later electricity and communication projects start from a much higher technological floor.",
        "Medicine lowers the risk of expansion. Mining, construction and travel become less likely to end in an untreatable infection, so the social return continues after Ruri recovers.",
        "The next great roadmap spends that new workforce and laboratory capacity on information. Continue with [how Dr. Stone built the cell phone](/article/how-dr-stone-built-cell-phone)."
      ],
      blocks: [
        {
          type: "poll",
          question: "What is the sulfa drug's biggest payoff?",
          options: ["Saving Ruri", "Winning the village's trust", "Building the first real laboratory", "Proving the roadmap method works"],
        },
      ],
    },
    {
      heading: "Dr. Stone Sulfa Drug FAQ",
      paragraphs: [
        "What medicine does Senku make? A synthetic sulfonamide antibacterial.",
        "What illness does it treat? The story identifies Ruri's illness as bacterial pneumonia.",
        "Is the chemistry real? The drug class and general principles are real; the schedule, purity and clinical process are compressed.",
        "Why is glass necessary? Repeatable pharmaceutical chemistry needs heat-resistant vessels, separation and controlled handling.",
        "Can the medicine be copied from the anime? No. Pharmaceutical synthesis and treatment require professional laboratories and medical oversight."
      ],
    },
  ],
};

export const drStoneCellPhoneArticle: Article = {
  ...shared,
  slug: "how-dr-stone-built-cell-phone",
  tags: ["dr-stone", "cell-phone", "radio", "vacuum-tube", "stone-wars"],
  title: "How Dr. Stone Built a Cell Phone: Every Component Explained",
  seoTitle: "How Dr. Stone Built a Cell Phone: Components Explained",
  excerpt:
    "How Senku builds the Stone World's phone using power, gold wire, tungsten, vacuum tubes, a microphone and radio transmission—and why it is not cellular.",
  tag: "Dr. Stone · Cell Phone Roadmap",
  body: [],
  related: ["dr-stone", "solo-leveling"],
  faqs: [
    {
      q: "How did Senku make a cell phone in Dr. Stone?",
      a: "Senku's team builds a large two-way radio system from a generator and batteries, extremely fine wire, tungsten components, vacuum tubes, a microphone, speaker, antenna and tuned circuits.",
    },
    {
      q: "Is the Dr. Stone cell phone scientifically possible?",
      a: "The communication principles and major components are real, but making dependable vacuum tubes, insulation, tuned radio circuits and large battery banks with improvised tools would take far more testing and precision.",
    },
    {
      q: "Is Senku's invention actually a cell phone?",
      a: "Not in the modern technical sense. It is closer to a portable wireless transceiver or field radio because there are no cellular towers, cells, network switching or individual mobile subscriptions.",
    },
    {
      q: "Why does the cell phone require tungsten?",
      a: "Tungsten tolerates very high temperatures and helps the team create durable heated components for the vacuum-tube stage. The material is difficult to process, making precision heating another roadmap dependency.",
    },
    {
      q: "Why is the phone important in the Stone Wars?",
      a: "It allows Senku's allies to coordinate over distance, carry out deception and share information faster than Tsukasa's forces can move, turning communication into a strategic weapon.",
    },
  ],
  sections: [
    {
      heading: "What Kind of Phone Does Senku Build?",
      paragraphs: [
        "Quick answer: Senku builds a bulky two-way radio system, not a modern cellular phone. The device converts speech into an electrical signal, uses vacuum-tube electronics to control and amplify it, transmits the signal through radio waves and converts the received signal back into sound.",
        "The word cell phone is a useful story label because the audience immediately understands the goal: two separated teams can speak without a physical messenger. Technically, there are no cellular base stations, frequency reuse cells, switching network, SIM cards or digital processors.",
        "That distinction does not make the invention less impressive. A field radio still requires power generation, batteries, conductive wire, insulation, a microphone, a speaker, vacuum tubes, antennas and circuits precise enough to agree on a frequency.",
        "The full roadmap appears near the middle of the [Dr. Stone inventions tech tree](/article/dr-stone-science-tech-tree-guide). This guide follows the signal from the speaker's voice to the distant receiver and explains what every component contributes."
      ],
      blocks: [
        {
          type: "table",
          caption: "The Stone World phone components and their jobs",
          columns: ["Component", "Job in the System", "Roadmap Dependency"],
          rows: [
            ["Generator and battery bank", "Supply continuous electrical power", "Magnets, copper, carbon chemistry and labour"],
            ["Microphone", "Convert sound vibration into an electrical signal", "Carbon material, diaphragm and wiring"],
            ["Fine conductive wire", "Carry signals and form coils", "Gold or copper processing and insulation"],
            ["Vacuum tubes", "Amplify and control weak electrical signals", "Glassblowing, vacuum, heated elements and precision"],
            ["Tuned circuit", "Select and generate the operating frequency", "Coils, capacitors and careful adjustment"],
            ["Antenna", "Convert electrical oscillation into radio waves and back", "Conductive material, length and placement"],
            ["Speaker or earphone", "Turn the received signal back into sound", "Magnet, coil and vibrating diaphragm"],
          ],
        },
      ],
    },
    {
      heading: "Step One: Generate and Store Electricity",
      paragraphs: [
        "The phone cannot work from a momentary spark. Vacuum tubes and radio transmission need a sustained supply, so the team begins with a hand-cranked generator and a large collection of chemical batteries.",
        "A generator converts motion into electrical current through electromagnetic induction. Magnets, copper wire and a rotating mechanism make the principle possible; villagers provide the continuous mechanical work.",
        "Batteries store chemical energy and release it as electricity when the transmitter or receiver needs power. The story's large battery requirement is a reminder that early radio equipment is inefficient compared with modern semiconductor devices.",
        "Power is the first hidden cost of communication. A smartphone feels weightless because the electrical grid, factories and charging network are invisible. Senku must rebuild that support system before a voice can travel."
      ],
    },
    {
      heading: "Step Two: Make Wire Thin Enough",
      paragraphs: [
        "The cotton-candy machine is not a joke detour. It teaches the team how rotating machinery can draw a material into very fine strands. The same mechanical concept helps produce the thin conductive wire needed for coils and electronic components.",
        "Fine wire matters because a coil's turns, spacing and resistance influence the circuit. Thick, inconsistent metal would waste power and make tuning unreliable.",
        "Gold is valuable here for conductivity, workability and resistance to corrosion, while copper handles many broader electrical roles. The exact material changes by component, but precision matters more than raw quantity.",
        "The episode demonstrates the show's favourite structure: a comfort invention trains the tool and labour process later used for military technology. Candy creates morale and a manufacturing prototype at the same time."
      ],
    },
    {
      heading: "Step Three: Tungsten, Heat and Vacuum Tubes",
      paragraphs: [
        "Vacuum tubes are the electronics at the centre of Senku's system. Before transistors, radios used heated elements inside evacuated glass envelopes to control the flow of electrons, amplify weak signals and generate oscillations.",
        "Glassblowing creates the envelope; a pump removes most of the air; heated elements and metal structures go inside without breaking the seal. Each stage demands materials that survive heat and tolerances much finer than ordinary village tools.",
        "Tungsten is important because it keeps strength at temperatures that destroy many other metals. Processing it is difficult, so Chrome and Kaseki need specialised high-temperature equipment before the roadmap can continue.",
        "The anime compresses failure rates and vacuum quality. In reality, handmade tubes would vary, seals would leak and circuits would require repeated testing. The principle remains correct even when the production success is dramatically generous."
      ],
      blocks: [
        {
          type: "table",
          caption: "Why the vacuum-tube stage is the hardest part",
          columns: ["Problem", "Required Solution", "Likely Real-World Difficulty"],
          rows: [
            ["Heated element", "A high-temperature material such as tungsten", "Shaping and mounting without contamination"],
            ["Glass envelope", "Heat-resistant, precisely formed glass", "Cracks, inconsistent thickness and sealing"],
            ["Low pressure", "A working vacuum pump and airtight joints", "Leaks and insufficient vacuum"],
            ["Electrical feedthrough", "Metal connections sealed through glass", "Different thermal expansion rates"],
            ["Consistent output", "Matched parts and circuit tuning", "Every handmade tube behaves differently"],
          ],
        },
      ],
    },
    {
      heading: "Step Four: Turn a Voice Into an Electrical Signal",
      paragraphs: [
        "A microphone begins with a diaphragm that moves when sound pressure reaches it. That movement changes an electrical property, producing a signal whose pattern follows the speaker's voice.",
        "The raw microphone signal is weak. Vacuum-tube stages amplify and shape it before the transmitter uses it to vary a radio-frequency carrier. The antenna then radiates the modulated energy into the surrounding space.",
        "At the receiver, an antenna captures a tiny portion of that energy. Tuned circuits reject other frequencies, the electronics recover the audio pattern and a speaker moves air to recreate the sound.",
        "This is analogue communication. No digital audio file travels through the air, and no computer reconstructs packets. The system succeeds because the waveform can be preserved well enough for a listener to understand speech."
      ],
    },
    {
      heading: "Step Five: Tune the Transmitter and Receiver",
      paragraphs: [
        "Both devices must operate on compatible frequencies. Coils and capacitors form resonant circuits that favour a particular range, while vacuum tubes supply amplification and oscillation.",
        "Tuning is where an apparently complete radio may still fail. A coil with the wrong number of turns, a leaking capacitor, a weak battery or an antenna of unsuitable length can reduce range or shift the signal away from the receiver.",
        "Senku's knowledge narrows the search, but the team still needs trial, adjustment and clear testing procedures. The series presents this as a final assembly challenge after spending episodes acquiring materials.",
        "Range also depends on terrain, antenna height, power, noise and frequency. The story simplifies radio propagation, yet correctly treats communication as a system rather than one magical box."
      ],
    },
    {
      heading: "Why It Is Not Technically a Cellular Phone",
      paragraphs: [
        "A cellular network divides a region into coverage cells served by base stations. As a user moves, the network hands the connection between cells and routes the call through switching infrastructure.",
        "Senku's system has none of that. Two prepared radio stations communicate directly or through a simple planned link. There is no automatic network discovery, subscriber identity or private one-to-one channel in the smartphone sense.",
        "Wireless transceiver, portable radio or field telephone is therefore more accurate. Calling it a cell phone remains narratively effective because the achievement is social: real-time speech across distance.",
        "The distinction is a strength for the article's science. Dr. Stone rebuilds the earliest practical layer of wireless voice rather than pretending to manufacture modern microprocessors in a village workshop."
      ],
    },
    {
      heading: "How the Phone Wins the Stone Wars",
      paragraphs: [
        "Tsukasa's forces can move quickly and use strong scouts, but messages still travel at the speed of a person. Senku's side can separate into groups and coordinate actions faster than the opposing command understands the situation.",
        "Communication enables deception as well as orders. Gen can deliver a persuasive story to distant allies, while Taiju and Yuzuriha can report from inside enemy territory. The device multiplies the usefulness of every person already in position.",
        "This is why Senku calls information a weapon. The radio does not defeat a fighter physically; it changes which side knows the plan, the timing and the truth.",
        "The roadmap begins only after medicine has united Ishigami Village. Read the previous dependency in the [sulfa-drug guide](/article/dr-stone-sulfa-drug-roadmap-explained), or return to the [complete inventions list](/article/dr-stone-science-tech-tree-guide) for the entire build order."
      ],
      blocks: [
        {
          type: "poll",
          question: "Which phone component is the biggest Stone World achievement?",
          options: ["The battery bank", "Fine wire", "Vacuum tubes", "Radio tuning"],
        },
      ],
    },
    {
      heading: "Dr. Stone Cell Phone FAQ",
      paragraphs: [
        "What did Senku actually build? A large analogue wireless transceiver closer to a field radio than a modern cellular phone.",
        "Why are vacuum tubes necessary? They amplify and control electrical signals before transistors are available.",
        "Why does the roadmap include cotton candy? The machine demonstrates a controlled spinning process useful for creating very fine wire.",
        "Is the radio real science? Yes in principle, but component precision, vacuum quality, reliability and build time are simplified.",
        "Why does it matter to the story? It lets the Kingdom of Science coordinate and deceive across distance, creating an information advantage during the Stone Wars."
      ],
    },
  ],
};

export const drStoneSupportingArticles: Article[] = [
  drStoneRevivalFluidArticle,
  drStoneSulfaDrugArticle,
  drStoneCellPhoneArticle,
];
