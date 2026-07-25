export type Anime = {
  slug: string;
  title: string;
  japaneseTitle?: string;
  year: number;
  status: "Ongoing" | "Completed" | "Upcoming";
  episodes: number | "?";
  seasons: number;
  rating: number; // /10
  popularity: number; // rank
  studio: string; // slug
  genres: string[]; // slugs
  characters: string[]; // slugs
  synopsis: string;
  tagline: string;
  cover: string; // gradient descriptor
  accent: string; // hex or css var
  arcs: { title: string; episodes: string; summary: string }[];
  watchOrder: string[];
  powerSystem: string;
  worldBuilding: string;
  themes: string[];
  quotes: { line: string; character: string }[];
  facts: string[];
  awards: string[];
  soundtrack: { title: string; artist: string; type: "OP" | "ED" | "OST" }[];
  voiceActors: { role: string; jp: string; en?: string }[];
  faq: { q: string; a: string }[];
  similar: string[]; // slugs
};

const g = (from: string, to: string) => `linear-gradient(135deg, ${from}, ${to})`;

export const animes: Anime[] = [
  {
    slug: "naruto",
    title: "Naruto",
    japaneseTitle: "ナルト",
    year: 2002,
    status: "Completed",
    episodes: 220,
    seasons: 5,
    rating: 8.4,
    popularity: 3,
    studio: "pierrot",
    genres: ["action", "adventure", "fantasy", "shonen"],
    characters: ["naruto-uzumaki", "sasuke-uchiha", "sakura-haruno", "kakashi-hatake"],
    tagline: "The orphan who dreamed of being Hokage.",
    synopsis:
      "In the hidden leaf village of Konoha, a loud orange-clad orphan named Naruto Uzumaki carries a nine-tailed beast sealed inside him and a promise to himself that he will one day become Hokage. Naruto is a story about identity, loneliness, and the friendships that reshape a broken child into a leader.",
    cover: g("#ff8a3d", "#ff3d7f"),
    accent: "#ff8a3d",
    arcs: [
      { title: "Land of Waves", episodes: "1–19", summary: "Team 7's first real mission introduces stakes, sacrifice, and the shape of the ninja world through Zabuza and Haku." },
      { title: "Chunin Exams", episodes: "20–67", summary: "A tournament arc that turns political when Orochimaru infiltrates Konoha and marks Sasuke, planting the seeds of every future conflict." },
      { title: "Konoha Crush", episodes: "68–80", summary: "The Third Hokage falls, Sunagakure betrays the alliance, and Naruto proves he can stand beside monsters like Gaara." },
      { title: "Search for Tsunade", episodes: "81–100", summary: "Jiraiya takes Naruto on the road, Rasengan is born, and the Sannin's history frames the war ahead." },
      { title: "Sasuke Recovery", episodes: "107–135", summary: "The most emotionally devastating arc of the original series: Sasuke leaves, and Naruto cannot bring him back." },
    ],
    watchOrder: ["Naruto (2002)", "Naruto Shippuden (2007)", "Boruto (2017)"],
    powerSystem:
      "Chakra is the fuel of every technique in Naruto: a blend of physical stamina and spiritual energy shaped through hand seals into ninjutsu, genjutsu, or taijutsu. Bloodline limits (kekkei genkai) like the Sharingan and Byakugan inherit ocular power, while tailed beasts hold cataclysmic natural chakra sealed away in human vessels called jinchuriki.",
    worldBuilding:
      "The Five Great Shinobi Nations are city-states built around hidden villages that sell ninja services like a defense industry. Wars are hot for months and cold for decades, and every treaty rests on the strength of a handful of kage-tier fighters. Bloodline persecution, orphaned child soldiers, and the moral bankruptcy of village elders shape the political spine of the series.",
    themes: ["Identity", "Loneliness", "Mentorship", "Peace vs power", "Cycles of hatred"],
    quotes: [
      { line: "I never go back on my word. That's my ninja way.", character: "Naruto Uzumaki" },
      { line: "In our line of work, if you break the rules you're trash. But those who abandon their friends are worse than trash.", character: "Kakashi Hatake" },
      { line: "A place where someone still thinks about you is a place you can call home.", character: "Jiraiya" },
    ],
    facts: [
      "Masashi Kishimoto originally pitched Naruto as a chef manga before rewriting it as a ninja series.",
      "The Rasengan was designed as an incomplete technique specifically so Naruto could finish what his father Minato started.",
      "Iruka's speech in episode 1 is the moment most fans point to as the emotional lock-in for the whole franchise.",
    ],
    awards: ["Anime Grand Prix 2005 — Best TV Anime", "TV Asahi Top 100 Anime — Top 10"],
    soundtrack: [
      { title: "R★O★C★K★S", artist: "Hound Dog", type: "OP" },
      { title: "Wind", artist: "Akeboshi", type: "ED" },
      { title: "Sadness and Sorrow", artist: "Toshio Masuda", type: "OST" },
    ],
    voiceActors: [
      { role: "Naruto Uzumaki", jp: "Junko Takeuchi", en: "Maile Flanagan" },
      { role: "Sasuke Uchiha", jp: "Noriaki Sugiyama", en: "Yuri Lowenthal" },
      { role: "Kakashi Hatake", jp: "Kazuhiko Inoue", en: "Dave Wittenberg" },
    ],
    faq: [
      { q: "Is Naruto worth watching in 2026?", a: "Yes. Even against modern shonen, Naruto's early arcs still deliver stronger character work than most current-season action shows, and the payoff in Shippuden depends on this foundation." },
      { q: "Should I skip the Naruto filler?", a: "The original series has heavy filler between episodes 136 and 220. A common route is to switch to Shippuden after episode 135 and use a filler guide only for optional side arcs." },
      { q: "Do I need to watch Naruto before Shippuden?", a: "You can start at Shippuden with a recap, but the emotional weight of Sasuke's departure, Iruka's sacrifice, and Gaara's arc all pay off ten times harder if you've lived through the first series." },
    ],
    similar: ["bleach", "hunter-x-hunter", "my-hero-academia", "black-clover"],
  },
  {
    slug: "one-piece",
    title: "One Piece",
    japaneseTitle: "ワンピース",
    year: 1999,
    status: "Ongoing",
    episodes: "?",
    seasons: 22,
    rating: 9.1,
    popularity: 1,
    studio: "toei",
    genres: ["action", "adventure", "fantasy", "shonen", "comedy"],
    characters: ["monkey-d-luffy", "roronoa-zoro", "nami"],
    tagline: "A rubber pirate and an ocean the size of a dream.",
    synopsis:
      "Twenty-two years after the execution of the Pirate King, a straw-hatted teenager named Monkey D. Luffy sets sail with a crew of misfits to find the treasure called One Piece. It is a story about freedom disguised as an adventure, drawn with such conviction that most weeks it is the most read manga in the world.",
    cover: g("#ff3d3d", "#ffb03d"),
    accent: "#ff3d3d",
    arcs: [
      { title: "East Blue Saga", episodes: "1–61", summary: "The founding of the Straw Hats. Every crew member gets a full origin, culminating in Arlong Park." },
      { title: "Alabasta Saga", episodes: "62–135", summary: "Baroque Works, Crocodile, and a desert war that sets the political scale of the world." },
      { title: "Sky Island Saga", episodes: "136–206", summary: "The most divisive arc becomes one of the most rewarded in retrospect: Enel, Skypiea, and the Bell of Shandora." },
      { title: "Water 7 / Enies Lobby", episodes: "207–312", summary: "Robin's rescue and the burning of a World Government flag — the emotional heart of the pre-timeskip series." },
      { title: "Marineford", episodes: "457–489", summary: "A war for one man that ends the age of Whitebeard and reshapes the world." },
      { title: "Wano", episodes: "890–1085", summary: "A samurai country, a shogun, and a dragon: the culmination of every seed Oda planted since Skypiea." },
    ],
    watchOrder: ["One Piece (1999)", "Films (canon: Strong World, Film Z, Stampede, Red)", "One Piece (Netflix live action, optional)"],
    powerSystem:
      "Devil Fruits grant permanent supernatural powers at the cost of the sea. Haki is the invisible willpower that lets fighters hit intangible enemies, sense presence, and, at Conqueror's level, dominate weaker minds. The best fights in One Piece are almost never about who has the flashier fruit — they are about whose will refuses to bend first.",
    worldBuilding:
      "The world is a single ocean broken by the Grand Line, a lawless sea that spirals through four seas and one Red Line. The World Government sits on Marie Geoise, the Marines police the seas, and the Revolutionary Army wages a slow war against the Celestial Dragons. Every island Luffy touches is its own genre — western, samurai, sky pirate, fish-man kingdom — and every one of them adds a piece to a single global plot.",
    themes: ["Freedom", "Found family", "Injustice", "Dreams worth dying for"],
    quotes: [
      { line: "I don't want to conquer anything. I just think the guy with the most freedom in this whole ocean is the Pirate King!", character: "Monkey D. Luffy" },
      { line: "When do you think people die? When they are forgotten.", character: "Dr. Hiluluk" },
      { line: "Inherited will, the destiny of the age, the dreams of people — these are things that will not be stopped.", character: "Gol D. Roger" },
    ],
    facts: [
      "Eiichiro Oda plans One Piece as a single 25+ year story with an ending he claims has not changed since 1997.",
      "The 'Straw Hat' comes from Oda's own middle-school hat, which he lost and always regretted.",
      "One Piece has sold more physical copies than any other comic series in history.",
    ],
    awards: ["Guinness World Record — Most copies published for a comic series by a single author", "Sugoi Japan Award — Top ranked"],
    soundtrack: [
      { title: "We Are!", artist: "Hiroshi Kitadani", type: "OP" },
      { title: "Overtaken", artist: "Kohei Tanaka", type: "OST" },
      { title: "Binks' Sake", artist: "Straw Hat Crew", type: "OST" },
    ],
    voiceActors: [
      { role: "Monkey D. Luffy", jp: "Mayumi Tanaka", en: "Colleen Clinkenbeard" },
      { role: "Roronoa Zoro", jp: "Kazuya Nakai", en: "Christopher Sabat" },
      { role: "Nami", jp: "Akemi Okamura", en: "Luci Christian" },
    ],
    faq: [
      { q: "Is One Piece too long to start?", a: "Not if you approach it as a bookshelf, not a marathon. Most readers do one arc per week and are caught up within a year. Trying to binge 1000+ episodes back to back is the mistake, not the length itself." },
      { q: "Should I read the manga or watch the anime?", a: "Manga if you want density; anime if you want the music, voices, and Luffy's laugh. The Netflix live action is a solid third entry point but stops early in East Blue." },
      { q: "Where does the anime get good?", a: "It never has a slow start. But most people mark Arlong Park as the moment they realize the show is doing something bigger than a gag comedy." },
    ],
    similar: ["hunter-x-hunter", "fairy-tail", "black-clover", "vinland-saga"],
  },
  {
    slug: "attack-on-titan",
    title: "Attack on Titan",
    japaneseTitle: "進撃の巨人",
    year: 2013,
    status: "Completed",
    episodes: 94,
    seasons: 4,
    rating: 9.0,
    popularity: 2,
    studio: "mappa",
    genres: ["action", "drama", "fantasy", "psychological", "horror"],
    characters: ["eren-yeager", "mikasa-ackerman", "levi-ackerman"],
    tagline: "The walls were never meant to keep monsters out.",
    synopsis:
      "For a hundred years, three concentric walls kept the last of humanity safe from man-eating giants called Titans. On the day the walls broke, a boy named Eren Yeager watched his mother die and swore he would burn every last Titan from the earth. Attack on Titan is a story about how that vow slowly rewrites its own meaning until the boy and the monster are impossible to tell apart.",
    cover: g("#5b0e0e", "#111"),
    accent: "#a11d1d",
    arcs: [
      { title: "Trost", episodes: "S1", summary: "The fall of Wall Maria, Eren's first transformation, and the reveal that humanity has weapons it didn't know it had." },
      { title: "Female Titan", episodes: "S1", summary: "Annie's arc turns the show into a thriller and burns the Survey Corps down to its bones." },
      { title: "Uprising", episodes: "S3 Part 1", summary: "Politics take the throne: the crown behind the crown, Historia's ascension, and the true face of Wall Rose." },
      { title: "Return to Shiganshina", episodes: "S3 Part 2", summary: "The basement. Grisha's journal. The moment the world doubles in size and every prior assumption breaks." },
      { title: "War for Paradis", episodes: "S4", summary: "Marley, the Rumbling, and an ending that split the fandom for a decade." },
    ],
    watchOrder: ["Attack on Titan Season 1 (2013)", "Season 2 (2017)", "Season 3 (2018–2019)", "Final Season Part 1 → 2 → 3 (2020–2023)"],
    powerSystem:
      "Nine Titan shifters carry the power of Ymir: each Titan is a mutation and a memory, passing on the experiences of its previous holders. Ackermans and the royal bloodline sit outside the paths, giving the story two supernatural aristocracies to collide.",
    worldBuilding:
      "Paradis is an island prison for the descendants of a race the rest of the world blames for a genocide. Marley is a decaying industrial empire that recruits child soldiers from that same people to keep its Titan monopoly. Nearly every arc reframes who the enemy was, which is why the show rewards a rewatch more than almost any other modern anime.",
    themes: ["Freedom", "Nationalism", "Cycles of violence", "The cost of survival"],
    quotes: [
      { line: "If you win, you live. If you lose, you die. If you don't fight, you can't win.", character: "Eren Yeager" },
      { line: "The only thing we're allowed to do is believe that we won't regret the choice we made.", character: "Levi Ackerman" },
      { line: "This world is cruel. And also very beautiful.", character: "Mikasa Ackerman" },
    ],
    facts: [
      "Hajime Isayama drew the first Titan concept from a drunk customer he was scared of at the internet cafe where he worked.",
      "MAPPA finished the final chapters despite an animator crunch that became one of the most discussed labor stories in the industry.",
      "The show is one of the few modern anime whose finale spikes rewatch demand for every prior season.",
    ],
    awards: ["Crunchyroll Anime Awards — Anime of the Year (2020, 2024)", "Newtype Anime Awards — Best TV Anime"],
    soundtrack: [
      { title: "Guren no Yumiya", artist: "Linked Horizon", type: "OP" },
      { title: "Shinzou wo Sasageyo!", artist: "Linked Horizon", type: "OP" },
      { title: "Vogel im Käfig", artist: "Hiroyuki Sawano", type: "OST" },
    ],
    voiceActors: [
      { role: "Eren Yeager", jp: "Yuki Kaji", en: "Bryce Papenbrook" },
      { role: "Mikasa Ackerman", jp: "Yui Ishikawa", en: "Trina Nishimura" },
      { role: "Levi Ackerman", jp: "Hiroshi Kamiya", en: "Matthew Mercer" },
    ],
    faq: [
      { q: "Is Attack on Titan finished?", a: "Yes. The Final Season concluded in 2023 and adapts the manga through its last chapter." },
      { q: "Is the ending really that controversial?", a: "It is polarizing but not random: every choice in the finale is set up as far back as Season 1. Whether you like it usually depends on whether you read Eren's story as a tragedy or a betrayal." },
      { q: "Where do the movies fit?", a: "The compilation films are optional recaps. Nothing in the movies changes canon; they exist for theatrical viewings." },
    ],
    similar: ["vinland-saga", "demon-slayer", "jujutsu-kaisen", "chainsaw-man"],
  },
  {
    slug: "demon-slayer",
    title: "Demon Slayer",
    japaneseTitle: "鬼滅の刃",
    year: 2019,
    status: "Ongoing",
    episodes: 55,
    seasons: 4,
    rating: 8.7,
    popularity: 4,
    studio: "ufotable",
    genres: ["action", "supernatural", "historical", "shonen"],
    characters: ["tanjiro-kamado", "nezuko-kamado", "zenitsu-agatsuma"],
    tagline: "A sword, a sister, and a sunlit vow.",
    synopsis:
      "In Taisho-era Japan, a coal seller named Tanjiro Kamado comes home to find his family slaughtered and his sister Nezuko turned into a demon. He becomes a demon slayer to protect what's left of her, and by extension, to save every family that isn't strong enough to save itself.",
    cover: g("#0a3d4a", "#0a1a2a"),
    accent: "#39c9c1",
    arcs: [
      { title: "Final Selection", episodes: "1–5", summary: "Tanjiro's training under Urokodaki and the mountain trial that mints new demon slayers." },
      { title: "Mount Natagumo", episodes: "15–21", summary: "The Lower Moon spider family and Tanjiro's first Hinokami Kagura." },
      { title: "Mugen Train", episodes: "Film + S2", summary: "Rengoku vs Akaza — the emotional and commercial ceiling of the modern shonen genre." },
      { title: "Entertainment District", episodes: "S2 Part 2", summary: "Tengen Uzui, Daki, and Gyutaro in Yoshiwara: the arc that made Ufotable's animation the industry benchmark." },
      { title: "Swordsmith Village", episodes: "S3", summary: "The origin of the Nichirin blades and the introduction of Muichiro and Mitsuri." },
    ],
    watchOrder: ["Demon Slayer (2019)", "Mugen Train (Movie)", "Entertainment District Arc (S2)", "Swordsmith Village Arc (S3)", "Hashira Training Arc (S4)"],
    powerSystem:
      "Breathing styles channel human stamina into forms modeled after natural elements: water, thunder, flame, sound, love, insect, mist, serpent, sun. Demons feed on humans, regenerate, and evolve through Blood Demon Arts unique to each demon.",
    worldBuilding:
      "The Demon Slayer Corps is an unofficial organization the government does not acknowledge. Its nine Hashira carry the weight of humanity against Muzan Kibutsuji's Twelve Kizuki. Taisho Japan gives the show its aesthetic identity: gas lamps, kimonos, trains, and a country halfway between feudal and modern.",
    themes: ["Family", "Grief", "Compassion for the monster", "Duty"],
    quotes: [
      { line: "Set your heart ablaze.", character: "Kyojuro Rengoku" },
      { line: "No matter how many people you may lose, you have no choice but to go on living.", character: "Kyojuro Rengoku" },
      { line: "I will always protect you, even if it costs me my life.", character: "Tanjiro Kamado" },
    ],
    facts: [
      "Mugen Train briefly became the highest-grossing film in Japanese history.",
      "Ufotable's water effects in Tanjiro's Water Breathing are hand-drawn animation composited with CGI, a hybrid technique that redefined action anime.",
      "Koyoharu Gotouge concluded the manga at 205 chapters — remarkably tight for a series of this scale.",
    ],
    awards: ["Crunchyroll Anime Awards — Anime of the Year 2020", "Japan Academy Prize — Animation of the Year"],
    soundtrack: [
      { title: "Gurenge", artist: "LiSA", type: "OP" },
      { title: "Homura", artist: "LiSA", type: "ED" },
      { title: "Kamado Tanjiro no Uta", artist: "Go Shiina", type: "OST" },
    ],
    voiceActors: [
      { role: "Tanjiro Kamado", jp: "Natsuki Hanae", en: "Zach Aguilar" },
      { role: "Nezuko Kamado", jp: "Akari Kito", en: "Abby Trott" },
      { role: "Zenitsu Agatsuma", jp: "Hiro Shimono", en: "Aleks Le" },
    ],
    faq: [
      { q: "Do I need to watch Mugen Train after Season 1?", a: "Yes. Mugen Train is canonical and directly leads into Season 2. Skipping it removes the entire emotional anchor for Rengoku." },
      { q: "Is Demon Slayer finished?", a: "The manga is complete. The anime is finishing its final arc through a theatrical trilogy." },
      { q: "Why is the animation so praised?", a: "Ufotable renders 2D characters on 3D-lit environments with hand-composited effects. Very few studios can produce this style at TV-episode cadence." },
    ],
    similar: ["jujutsu-kaisen", "chainsaw-man", "hells-paradise", "bleach"],
  },
  {
    slug: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    japaneseTitle: "呪術廻戦",
    year: 2020,
    status: "Ongoing",
    episodes: 47,
    seasons: 2,
    rating: 8.6,
    popularity: 5,
    studio: "mappa",
    genres: ["action", "supernatural", "school", "shonen"],
    characters: ["yuji-itadori", "megumi-fushiguro", "satoru-gojo"],
    tagline: "Curses are what humans deserve.",
    synopsis:
      "A high schooler named Yuji Itadori swallows a cursed finger to save his classmates and becomes the vessel for a millennia-old curse called Sukuna. Jujutsu Kaisen is a modern shonen that mixes a school-battle premise with the pacing of a horror film and the choreography of a martial-arts epic.",
    cover: g("#141b2d", "#3a1150"),
    accent: "#8a5cff",
    arcs: [
      { title: "Fearsome Womb", episodes: "S1", summary: "Yuji, Megumi, and Nobara take their first mission at the juvenile detention center." },
      { title: "Vs. Mahito", episodes: "S1", summary: "The introduction of Junpei and the transformation of Yuji's shonen ideals into something colder." },
      { title: "Hidden Inventory / Premature Death", episodes: "S2", summary: "Gojo's past — the arc that made a generation understand why he laughs so much." },
      { title: "Shibuya Incident", episodes: "S2", summary: "One of the most brutal arcs in modern shonen. Reshapes the entire cast in a single night." },
    ],
    watchOrder: ["Jujutsu Kaisen 0 (Movie prequel)", "Jujutsu Kaisen S1", "Jujutsu Kaisen S2", "Culling Game (upcoming)"],
    powerSystem:
      "Cursed energy is the residue of negative emotion. Sorcerers refine it into innate techniques, extension techniques, and Domain Expansions — ability spaces that guarantee a hit within a fixed radius. Cursed spirits are the manifested trauma of humanity given form.",
    worldBuilding:
      "Modern Japan hides three jujutsu schools, a conservative sorcerer aristocracy, and a Curses population that the state prefers to pretend does not exist. Every arc peels back a layer of that governance until Shibuya makes clear that the old order was rotting all along.",
    themes: ["Death without meaning", "Youth", "Institutional decay", "Strength and its cost"],
    quotes: [
      { line: "Throughout heaven and earth, I alone am the honored one.", character: "Satoru Gojo" },
      { line: "The only ones who should kill are those prepared to be killed.", character: "Yuji Itadori" },
      { line: "You are not saving people because you want to. You are saving them because you can.", character: "Kento Nanami" },
    ],
    facts: [
      "Gege Akutami has repeatedly said Yuji was designed to be a 'normal' shonen protagonist — the twist being how abnormal that is in this world.",
      "The Shibuya Incident arc was storyboarded to feel like a single 'night' with almost no cuts to daytime.",
      "Toji's fight in Season 2 was animated by a strike team of freelance animators MAPPA credits individually.",
    ],
    awards: ["Crunchyroll Anime Awards — Anime of the Year 2024", "Newtype Anime Awards — Multiple"],
    soundtrack: [
      { title: "Kaikai Kitan", artist: "Eve", type: "OP" },
      { title: "Kaifuku", artist: "Eve", type: "ED" },
      { title: "SPECIALZ", artist: "King Gnu", type: "OP" },
    ],
    voiceActors: [
      { role: "Yuji Itadori", jp: "Junya Enoki", en: "Adam McArthur" },
      { role: "Satoru Gojo", jp: "Yuichi Nakamura", en: "Kaiji Tang" },
      { role: "Megumi Fushiguro", jp: "Yuma Uchida", en: "Robbie Daymond" },
    ],
    faq: [
      { q: "Do I need to watch Jujutsu Kaisen 0 first?", a: "You can watch it before or after Season 1. Watching it first makes Season 2 land harder; watching it after gives you a Yuta cameo payoff." },
      { q: "Is Jujutsu Kaisen appropriate for younger viewers?", a: "It's a mature shonen with graphic violence, on-screen death of civilians, and psychological horror. TV-MA in most regions." },
      { q: "Where does the anime stop?", a: "Season 2 ends inside the Shibuya Incident. The Culling Game arc is next." },
    ],
    similar: ["chainsaw-man", "bleach", "demon-slayer", "hells-paradise"],
  },
  {
    slug: "death-note",
    title: "Death Note",
    japaneseTitle: "デスノート",
    year: 2006,
    status: "Completed",
    episodes: 37,
    seasons: 1,
    rating: 8.6,
    popularity: 7,
    studio: "madhouse",
    genres: ["mystery", "psychological", "supernatural", "drama"],
    characters: ["light-yagami", "l-lawliet"],
    tagline: "A god of the new world begins with a notebook.",
    synopsis:
      "Light Yagami is bored. He is also the top-ranked high school student in Japan, the son of a Tokyo police chief, and cynical enough to think he can fix the world if given a big enough weapon. Then a shinigami drops a notebook with the power to kill anyone whose name is written in it — and the world's greatest detective, known only as L, comes looking for him.",
    cover: g("#111", "#3a0a0a"),
    accent: "#c72c2c",
    arcs: [
      { title: "L Arc", episodes: "1–25", summary: "The greatest cat-and-mouse in anime. Two geniuses circle each other while pretending to be allies." },
      { title: "Near / Mello Arc", episodes: "26–37", summary: "A generation split arc. Beloved by some, dismissed by others; still one of the boldest choices in shonen mystery." },
    ],
    watchOrder: ["Death Note (2006)", "Death Note Relight recap films (optional)"],
    powerSystem:
      "The Death Note kills any human whose full name is written in it while the writer pictures their face. Rules cascade — cause of death, time of death, memory manipulation — and half the show is Light and L exploiting rules the audience hasn't been told yet.",
    worldBuilding:
      "Modern Tokyo, a real-world police force, and one supernatural intrusion. The world of Death Note is our world, which is exactly what makes the moral horror land.",
    themes: ["Justice", "Corruption of power", "God complexes", "Surveillance"],
    quotes: [
      { line: "I am justice! I protect the innocent and those who fear evil. I'll become the god of a new world.", character: "Light Yagami" },
      { line: "If you can't solve the puzzle, you're just another one of its pieces.", character: "L" },
      { line: "Humans are so interesting.", character: "Ryuk" },
    ],
    facts: [
      "The original manga is only 12 volumes and reads like a screenwriting course in structure.",
      "The 'potato chip' scene took three days to storyboard for a sequence under two minutes.",
      "Madhouse's direction leans on classical music cues — 'L's Theme' is one of the most recognized OST tracks in the medium.",
    ],
    awards: ["Tokyo Anime Awards — Best TV Anime nominee", "Newtype — Multiple Best Character wins"],
    soundtrack: [
      { title: "The World", artist: "Nightmare", type: "OP" },
      { title: "L's Theme", artist: "Yoshihisa Hirano", type: "OST" },
      { title: "Alumina", artist: "Nightmare", type: "ED" },
    ],
    voiceActors: [
      { role: "Light Yagami", jp: "Mamoru Miyano", en: "Brad Swaile" },
      { role: "L", jp: "Kappei Yamaguchi", en: "Alessandro Juliani" },
      { role: "Ryuk", jp: "Shido Nakamura", en: "Brian Drummond" },
    ],
    faq: [
      { q: "Is the second half of Death Note worth watching?", a: "Yes, though with tempered expectations. It abandons the L dynamic on purpose and asks the audience to sit with a Light who no longer has a rival worthy of him." },
      { q: "Should I watch the Netflix live action film?", a: "Only as a curiosity. It shares a title with Death Note and almost nothing else." },
      { q: "How violent is Death Note?", a: "The show is mostly psychological. On-screen violence is rare; on-screen consequence is constant." },
    ],
    similar: ["code-geass", "steins-gate", "monster", "psycho-pass"],
  },
  {
    slug: "fullmetal-alchemist-brotherhood",
    title: "Fullmetal Alchemist: Brotherhood",
    japaneseTitle: "鋼の錬金術師",
    year: 2009,
    status: "Completed",
    episodes: 64,
    seasons: 1,
    rating: 9.2,
    popularity: 6,
    studio: "bones",
    genres: ["action", "adventure", "drama", "fantasy", "shonen"],
    characters: ["edward-elric", "alphonse-elric", "roy-mustang"],
    tagline: "In order to obtain, something of equal value must be lost.",
    synopsis:
      "Two brothers try to bring their mother back from the dead and pay for it with a leg, an arm, and a body. Fullmetal Alchemist: Brotherhood follows their search for the Philosopher's Stone through a country whose military is not what it seems and whose alchemy is drawn from something much older than science.",
    cover: g("#3a2a10", "#b06b2a"),
    accent: "#e29a3b",
    arcs: [
      { title: "Introduction / Youswell", episodes: "1–10", summary: "The brothers' history, the human transmutation, and the first cracks in Amestris' military." },
      { title: "Lior / Ishval", episodes: "11–30", summary: "Scar, the Homunculi, and the genocide that built the modern state." },
      { title: "Northern Wall of Briggs", episodes: "31–45", summary: "Olivier Armstrong, Fort Briggs, and the reveal of the country's shape." },
      { title: "Promised Day", episodes: "58–64", summary: "The final arc. Every character pays off; nearly no thread is left dangling." },
    ],
    watchOrder: ["Fullmetal Alchemist: Brotherhood (2009)", "Sacred Star of Milos (side story film)"],
    powerSystem:
      "Alchemy obeys equivalent exchange: to make anything, something of equal mass and value must be given up. Human transmutation breaks that law and always takes more than it should. Alkahestry, from Xing, is a related but medically-rooted variant.",
    worldBuilding:
      "Amestris is a militarized nation on the edge of a continent it has spent generations conquering. Every arc rewrites the map: Ishval, Xing, Xerxes, Briggs. Underneath is a single conspiracy older than any government.",
    themes: ["Family", "Cost of ambition", "War crimes and complicity", "Faith without gods"],
    quotes: [
      { line: "A lesson without pain is meaningless. That's because no one can gain without sacrificing something.", character: "Edward Elric" },
      { line: "Stand up and walk. Keep moving forward. You have strong legs.", character: "Edward Elric" },
      { line: "It's a terrible day for rain.", character: "Roy Mustang" },
    ],
    facts: [
      "Brotherhood is a full re-adaptation, not a continuation of the 2003 anime.",
      "Hiromu Arakawa modeled Amestris' geography on early 20th-century Europe.",
      "The show is one of the few anime to hold the #1 slot on major rating sites for over a decade.",
    ],
    awards: ["Anime Grand Prix", "Seiun Award — Best Comic"],
    soundtrack: [
      { title: "Again", artist: "Yui", type: "OP" },
      { title: "Uso", artist: "Sid", type: "OP" },
      { title: "Bratja", artist: "Michiru Oshima", type: "OST" },
    ],
    voiceActors: [
      { role: "Edward Elric", jp: "Romi Park", en: "Vic Mignogna" },
      { role: "Alphonse Elric", jp: "Rie Kugimiya", en: "Maxey Whitehead" },
      { role: "Roy Mustang", jp: "Shinichiro Miki", en: "Travis Willingham" },
    ],
    faq: [
      { q: "Should I watch FMA 2003 or Brotherhood?", a: "Brotherhood if you want the faithful, tighter version. FMA 2003 is worth revisiting later as a fascinating alternate reality with a very different tone." },
      { q: "How much filler is there?", a: "Effectively none. Brotherhood is 64 episodes because the manga was that lean." },
      { q: "Is it appropriate for teens?", a: "Yes, with heavy themes of war and grief. Recommended 13+." },
    ],
    similar: ["hunter-x-hunter", "vinland-saga", "attack-on-titan", "code-geass"],
  },
  {
    slug: "hunter-x-hunter",
    title: "Hunter x Hunter",
    japaneseTitle: "ハンター×ハンター",
    year: 2011,
    status: "Ongoing",
    episodes: 148,
    seasons: 6,
    rating: 9.1,
    popularity: 8,
    studio: "madhouse",
    genres: ["action", "adventure", "fantasy", "shonen"],
    characters: ["gon-freecss", "killua-zoldyck"],
    tagline: "A boy in green, a killer in white, and a world too big to conquer.",
    synopsis:
      "Gon Freecss wants to find his father. Along the way he becomes a Hunter, meets a boy his own age raised as an assassin, and steps into a story that keeps outgrowing its own shape until it is one of the most ambitious shonen ever drawn.",
    cover: g("#0f6b3a", "#0a3020"),
    accent: "#3ecf6f",
    arcs: [
      { title: "Hunter Exam", episodes: "1–21", summary: "A tournament arc that is really an introduction to the moral rules of the world." },
      { title: "Heavens Arena", episodes: "26–36", summary: "Nen, Hisoka, and the moment the show pivots into a power system." },
      { title: "Yorknew City", episodes: "42–58", summary: "The Phantom Troupe arc. Auction politics, assassinations, and a Kurapika who finally moves." },
      { title: "Chimera Ant", episodes: "76–136", summary: "One of the most divisive and celebrated arcs in anime history. A slow, cruel, quietly devastating masterpiece." },
      { title: "Election", episodes: "137–148", summary: "The Hunter Association politics arc. Cerebral, dense, and beloved by long-term fans." },
    ],
    watchOrder: ["Hunter x Hunter (2011)"],
    powerSystem:
      "Nen is aura control divided into six categories — Enhancer, Emitter, Transmuter, Conjurer, Manipulator, Specialist — each with strengths, weaknesses, and personality tendencies. Restrictions and vows amplify power in exchange for narrower conditions of use.",
    worldBuilding:
      "The world is 90% unexplored. Continents, oceans, and even categories of life have not been catalogued. Hunters are the licensed adventurers who chase what remains. This is a series where the map itself is a mystery.",
    themes: ["Curiosity", "Friendship as identity", "The price of obsession", "What growing up costs"],
    quotes: [
      { line: "If you're a real man, use your fists to speak.", character: "Gon Freecss" },
      { line: "You should enjoy the little detours to the fullest.", character: "Ging Freecss" },
      { line: "I always thought you were my light.", character: "Killua Zoldyck" },
    ],
    facts: [
      "The 2011 adaptation is a full remake and is broadly considered the definitive version.",
      "Chimera Ant covers roughly 60 episodes of manga content in about 60 episodes — extraordinarily faithful pacing.",
      "Yoshihiro Togashi's health has kept the manga on and off hiatus for a decade, but every returning arc still tops charts.",
    ],
    awards: ["Newtype Anime Awards", "Sugoi Japan"],
    soundtrack: [
      { title: "Departure!", artist: "Masatoshi Ono", type: "OP" },
      { title: "Just Awake", artist: "Fear, and Loathing in Las Vegas", type: "OP" },
      { title: "Kingdom of Predators", artist: "Yoshihisa Hirano", type: "OST" },
    ],
    voiceActors: [
      { role: "Gon Freecss", jp: "Megumi Han", en: "Erica Mendez" },
      { role: "Killua Zoldyck", jp: "Mariya Ise", en: "Cristina Vee" },
      { role: "Kurapika", jp: "Miyuki Sawashiro", en: "Erika Harlacher" },
    ],
    faq: [
      { q: "Do I need to watch the 1999 version?", a: "No. The 2011 series covers everything the 1999 version did, and much more." },
      { q: "Is the Chimera Ant arc really that slow?", a: "Yes, and that's the point. It is one of the most disciplined character arcs in anime, and rewards patience with one of the medium's best final acts." },
      { q: "Where does the anime end?", a: "The 2011 anime ends at Chapter 339 with the Election arc. The manga has continued past that, but with long hiatuses." },
    ],
    similar: ["fullmetal-alchemist-brotherhood", "one-piece", "vinland-saga", "naruto"],
  },
  {
    slug: "chainsaw-man",
    title: "Chainsaw Man",
    japaneseTitle: "チェンソーマン",
    year: 2022,
    status: "Ongoing",
    episodes: 12,
    seasons: 1,
    rating: 8.5,
    popularity: 9,
    studio: "mappa",
    genres: ["action", "horror", "supernatural", "shonen"],
    characters: ["denji", "makima", "power"],
    tagline: "A boy, a devil dog, and a normal life he can't afford.",
    synopsis:
      "Denji lives in a shack, eats bread with jam if he's lucky, and hunts devils to pay off his dead father's yakuza debt. He is fused with his pet devil Pochita and becomes Chainsaw Man — a public safety asset with a very small wishlist and a very big weapon.",
    cover: g("#a11d1d", "#3a0a0a"),
    accent: "#ff5252",
    arcs: [
      { title: "Public Safety Introduction", episodes: "S1 Part 1", summary: "Denji joins Makima's division and the show establishes its very particular tone." },
      { title: "Katana Man", episodes: "S1 Part 2", summary: "Yakuza revenge, Reze's arrival, and the escalation into the manga's most beloved run." },
    ],
    watchOrder: ["Chainsaw Man (S1)", "Chainsaw Man: The Movie – Reze Arc"],
    powerSystem:
      "Devils manifest from human fears. Named devils are older and stronger. Contracts trade parts of the human body for a devil's power. Fiends are devils in dead human bodies. Hybrids like Denji sit above all of them.",
    worldBuilding:
      "An alternate 1990s Japan where the Cold War never fully ended and Public Safety hires devil hunters as expendable civil servants. The show's aesthetic is intentionally grimy, cinematic, and film-referential.",
    themes: ["Desire as identity", "Being used", "The banality of monsters", "Class"],
    quotes: [
      { line: "I want a normal life. That's my dream.", character: "Denji" },
      { line: "Dogs love their master unconditionally. That is why I like dogs.", character: "Makima" },
      { line: "Meowy is family. Family is important.", character: "Power" },
    ],
    facts: [
      "Chainsaw Man's Season 1 opening 'KICK BACK' was Kenshi Yonezu's first anime OP to top the Oricon chart in years.",
      "Every ending sequence is a different director and a different visual style — one of the boldest choices in modern anime.",
      "Tatsuki Fujimoto's cited influences include the films of the Coen brothers and David Lynch.",
    ],
    awards: ["Harvey Awards — Best Manga (nominee)", "Crunchyroll Anime Awards — Multiple nominations"],
    soundtrack: [
      { title: "KICK BACK", artist: "Kenshi Yonezu", type: "OP" },
      { title: "Chainsaw Blood", artist: "Vaundy", type: "ED" },
      { title: "Time Left", artist: "Kensuke Ushio", type: "OST" },
    ],
    voiceActors: [
      { role: "Denji", jp: "Kikunosuke Toya", en: "Ryan Colt Levy" },
      { role: "Power", jp: "Fairouz Ai", en: "Sarah Wiedenheft" },
      { role: "Makima", jp: "Tomori Kusunoki", en: "Suzie Yeung" },
    ],
    faq: [
      { q: "Is the anime canon?", a: "Yes. MAPPA's adaptation follows the manga chapter by chapter with only minor scene reordering." },
      { q: "How graphic is Chainsaw Man?", a: "Very. On-screen body horror, adult themes, and a lot of blood. TV-MA." },
      { q: "Where does Season 1 end?", a: "The end of the Katana Man arc, roughly Chapter 38 of the manga." },
    ],
    similar: ["jujutsu-kaisen", "demon-slayer", "hells-paradise", "attack-on-titan"],
  },
  {
    slug: "solo-leveling",
    title: "Solo Leveling",
    japaneseTitle: "俺だけレベルアップな件",
    year: 2024,
    status: "Ongoing",
    episodes: 25,
    seasons: 2,
    rating: 8.3,
    popularity: 10,
    studio: "a1-pictures",
    genres: ["action", "fantasy", "supernatural"],
    characters: ["sung-jinwoo"],
    tagline: "The weakest hunter becomes the only one who levels up.",
    synopsis:
      "In a world where hunters clear monster gates for a living, Sung Jinwoo is a rank-E chore. After a near-death experience in a double dungeon, a mysterious System gives him a single, unfair gift: he alone can level up.",
    cover: g("#0a1030", "#5b1eab"),
    accent: "#7c5cff",
    arcs: [
      { title: "Double Dungeon", episodes: "S1", summary: "Jinwoo's near-death event and the birth of the System." },
      { title: "Job Change", episodes: "S1", summary: "The trial that transforms Jinwoo into a Shadow Monarch candidate." },
      { title: "Jeju Island", episodes: "S2", summary: "S-rank raid arc with the largest choreographed battle in the series so far." },
    ],
    watchOrder: ["Solo Leveling S1 (2024)", "Solo Leveling S2 (2025)"],
    powerSystem:
      "The System quantifies strength as stats and levels. Shadow Extraction turns defeated enemies into loyal soldiers. Rank progression from E to S is normally fixed at awakening — Jinwoo is the exception.",
    worldBuilding:
      "A near-future Earth where dimensional gates opened a decade ago and 'hunters' are the state-licensed profession that fights what comes through. The world's economy, media, and celebrity culture all revolve around the hunter industry.",
    themes: ["Growth", "Isolation", "Power fantasy done cleanly", "Family"],
    quotes: [
      { line: "Arise.", character: "Sung Jinwoo" },
      { line: "I alone level up.", character: "Sung Jinwoo" },
    ],
    facts: [
      "Solo Leveling was originally a Korean web novel, then a webtoon, then a Japanese anime — one of the first cross-medium 'manhwa' hits to make that jump.",
      "Season 1 is the first anime to make hunter-app UI overlays feel cinematic instead of gimmicky.",
      "The soundtrack by Hiroyuki Sawano leans heavily on his signature action motifs.",
    ],
    awards: ["Crunchyroll Anime Awards — New Series"],
    soundtrack: [
      { title: "LEveL", artist: "SawanoHiroyuki[nZk]:TOMORROW X TOGETHER", type: "OP" },
      { title: "request", artist: "ReoNa", type: "ED" },
    ],
    voiceActors: [
      { role: "Sung Jinwoo", jp: "Taito Ban", en: "Aleks Le" },
    ],
    faq: [
      { q: "Do I need to read the webtoon first?", a: "No. The anime is a clean entry point." },
      { q: "Is it just a power fantasy?", a: "It is a power fantasy, executed unusually well. That's the appeal, not a flaw." },
      { q: "When is Season 3?", a: "Announced. Release window pending official confirmation." },
    ],
    similar: ["jujutsu-kaisen", "demon-slayer", "one-piece", "black-clover"],
  },
  {
    slug: "frieren",
    title: "Frieren: Beyond Journey's End",
    japaneseTitle: "葬送のフリーレン",
    year: 2023,
    status: "Ongoing",
    episodes: 28,
    seasons: 1,
    rating: 9.0,
    popularity: 11,
    studio: "madhouse",
    genres: ["fantasy", "adventure", "drama", "slice-of-life"],
    characters: ["frieren"],
    tagline: "The quest is over. The mourning begins.",
    synopsis:
      "An elven mage named Frieren outlives her hero party by half a century and slowly realizes that the ten years she spent with them were the shape of her whole life. Frieren is a fantasy about time, memory, and the small acts of understanding we owe the people we outlast.",
    cover: g("#3a5a3a", "#0a1a2a"),
    accent: "#a8d089",
    arcs: [
      { title: "First Class Mage Exam", episodes: "S1", summary: "The most tightly plotted arc of Season 1, and a masterclass in fantasy exam-arc pacing." },
    ],
    watchOrder: ["Frieren: Beyond Journey's End (2023)"],
    powerSystem:
      "Mana is the raw substance of magic; suppressing your mana output is more advanced than releasing it. Spell diversity ranges from combat to cosmetic — the world's most respected mage is famous for a spell that turns copper into silver.",
    worldBuilding:
      "A post-hero fantasy world a hundred years after the demon king's fall. The kingdoms are rebuilding, the Continental Magic Association is powerful again, and the north still holds demons no one has classified.",
    themes: ["Time", "Grief", "Understanding humans slowly", "Legacy"],
    quotes: [
      { line: "It's been just ten years. It felt so short.", character: "Frieren" },
      { line: "This spell is what I love most about the world.", character: "Frieren" },
    ],
    facts: [
      "Frieren won Anime of the Year at the 2024 Crunchyroll Anime Awards.",
      "Madhouse allocated an unusually long production runway for Season 1, and it shows.",
      "The show's opening 'Yuusha' by YOASOBI became a chart-topping single in Japan.",
    ],
    awards: ["Crunchyroll Anime Awards — Anime of the Year 2024", "Manga Taisho Grand Prize"],
    soundtrack: [
      { title: "Yuusha", artist: "YOASOBI", type: "OP" },
      { title: "Anytime Anywhere", artist: "milet", type: "ED" },
    ],
    voiceActors: [
      { role: "Frieren", jp: "Atsumi Tanezaki", en: "Amanda Lee" },
    ],
    faq: [
      { q: "Is Frieren slow?", a: "It's contemplative, not slow. Almost every scene pays off later, sometimes episodes later." },
      { q: "Is it a sad show?", a: "It is a show about grief that isn't tragic. The tone is warm, not mournful." },
      { q: "Where does the anime stop?", a: "Season 1 ends at the conclusion of the First Class Mage Exam arc." },
    ],
    similar: ["vinland-saga", "attack-on-titan", "hunter-x-hunter", "spy-x-family"],
  },
  {
    slug: "spy-x-family",
    title: "Spy x Family",
    japaneseTitle: "スパイファミリー",
    year: 2022,
    status: "Ongoing",
    episodes: 37,
    seasons: 2,
    rating: 8.5,
    popularity: 12,
    studio: "wit-cloverworks",
    genres: ["action", "comedy", "slice-of-life", "family"],
    characters: [],
    tagline: "A spy, an assassin, a telepath. And they think they're a family.",
    synopsis:
      "A master spy adopts a psychic child and marries a professional killer, and none of the three know the truth about the other two. Spy x Family is a warm, precisely written comedy that occasionally turns into a genuine action thriller.",
    cover: g("#0a1a5b", "#8a2fc9"),
    accent: "#f472b6",
    arcs: [
      { title: "Operation Strix", episodes: "S1", summary: "Loid's mission to enroll Anya at Eden Academy." },
      { title: "Cruise Adventure", episodes: "S2", summary: "Yor at work — the arc most fans point to as the emotional peak." },
    ],
    watchOrder: ["Spy x Family S1", "Spy x Family S2", "Spy x Family CODE: White (film)"],
    powerSystem: "No supernatural power system. Anya is a telepath; that is the only supernatural fact in the show, and it is used precisely.",
    worldBuilding:
      "A stylized 1960s Europe split between two rival states, Ostania and Westalis. Nothing about the geopolitics is meant to map 1:1 to our history, but the aesthetic — trench coats, cars, tailoring — is period-accurate down to the buttons.",
    themes: ["Family as choice", "Identity", "Espionage as comedy"],
    quotes: [
      { line: "Waku waku!", character: "Anya Forger" },
      { line: "You'll live a normal, peaceful life. That is your mission.", character: "Loid Forger" },
    ],
    facts: [
      "The manga is written by Tatsuya Endo, whose previous work leaned much darker.",
      "Anya's face has become one of the most-shared meme templates in modern anime.",
      "The animation is a co-production between Wit Studio and CloverWorks.",
    ],
    awards: ["Crunchyroll Anime Awards — Multiple", "Kodansha Manga Award"],
    soundtrack: [
      { title: "Mixed Nuts", artist: "Official HIGE DANdism", type: "OP" },
      { title: "Kigeki", artist: "Gen Hoshino", type: "ED" },
    ],
    voiceActors: [
      { role: "Loid Forger", jp: "Takuya Eguchi", en: "Alex Organ" },
      { role: "Yor Forger", jp: "Saori Hayami", en: "Natalie Van Sistine" },
      { role: "Anya Forger", jp: "Atsumi Tanezaki", en: "Megan Shipman" },
    ],
    faq: [
      { q: "Is Spy x Family family-friendly?", a: "Yes, with mild violence. It is one of the best 'watch with your family' picks in modern anime." },
      { q: "Do I need to watch the movie?", a: "CODE: White is a standalone story. Optional but recommended." },
      { q: "Where does the anime stop?", a: "Season 2 ends after the Cruise arc. Season 3 is confirmed." },
    ],
    similar: ["frieren", "demon-slayer", "haikyuu", "the-apothecary-diaries"],
  },
];

export const getAnime = (slug: string) => animes.find((a) => a.slug === slug);
export const listAnime = () => animes;
