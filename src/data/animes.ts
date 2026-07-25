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
  {
    slug: "dragon-ball-z",
    title: "Dragon Ball Z",
    japaneseTitle: "ドラゴンボールZ",
    year: 1989,
    status: "Completed",
    episodes: 291,
    seasons: 9,
    rating: 8.2,
    popularity: 5,
    studio: "toei",
    genres: ["action", "adventure", "shonen", "supernatural"],
    characters: ["goku", "vegeta"],
    tagline: "The tournament arc that defined the genre.",
    synopsis:
      "The direct continuation of Akira Toriyama's Dragon Ball follows Son Goku into adulthood as invaders from his home planet, androids from a broken future, and a pink child-god of destruction turn Earth into the setting for successively larger tournaments of power. Dragon Ball Z did not invent the escalating power scale, but it standardized every convention modern shonen still runs on.",
    cover: g("#f97316", "#facc15"),
    accent: "#f97316",
    arcs: [
      { title: "Saiyan Saga", episodes: "1–35", summary: "Raditz's arrival reframes Goku's origin, and the Saiyan invasion forces Earth's fighters into a losing battle that reshapes the franchise's stakes." },
      { title: "Frieza Saga", episodes: "36–107", summary: "The Namek arc, and the fight most fans point to as anime's template for the multi-episode boss battle." },
      { title: "Cell Saga", episodes: "108–194", summary: "Androids, a bug-shaped bio-weapon, and the Cell Games — the arc that hands the story briefly to Gohan." },
      { title: "Buu Saga", episodes: "195–291", summary: "Fusion, gods of destruction implied at the edges, and a farewell that Dragon Ball Super would later re-open." },
    ],
    watchOrder: ["Dragon Ball (1986)", "Dragon Ball Z (1989)", "Dragon Ball Z: Kai (recut, 2009)", "Dragon Ball Super (2015)"],
    powerSystem:
      "Ki is a life-energy that can be shaped into projectiles, flight, and defensive barriers. Saiyan biology allows exponential recovery after near-death — the Zenkai boost — and cosmetic transformations (Super Saiyan and its tiers) multiply base ki output.",
    worldBuilding:
      "Earth sits inside a hierarchical cosmology of Kais, gods, and afterlife bureaucracy. The Saiyans are the remnant of a mercenary race, and the Namekians a spiritual civilization that created the Dragon Balls themselves.",
    themes: ["Escalation as narrative rhythm", "Fatherhood and inheritance", "Rivalry as growth", "Sacrifice"],
    quotes: [
      { line: "I am the hope of the universe.", character: "Son Goku" },
    ],
    facts: [
      "Dragon Ball Z: Kai is a recut that trims filler and re-scores much of the original run.",
      "Toriyama sketched Frieza's final form based on a request for the 'simplest possible' silhouette.",
    ],
    awards: ["Anime Grand Prix — Best TV Anime (multiple years)"],
    soundtrack: [
      { title: "Cha-La Head-Cha-La", artist: "Hironobu Kageyama", type: "OP" },
      { title: "Detekoi Tobikiri Zenkai Power!", artist: "MANNA", type: "ED" },
    ],
    voiceActors: [
      { role: "Son Goku", jp: "Masako Nozawa", en: "Sean Schemmel" },
      { role: "Vegeta", jp: "Ryō Horikawa", en: "Christopher Sabat" },
    ],
    faq: [
      { q: "Should I watch Z or Kai first?", a: "Kai is the trimmer, better-paced version for a first watch. The original Z is the definitive artifact if you want the full 1990s presentation." },
      { q: "Do I need to watch Dragon Ball first?", a: "Not strictly, but the original series does a lot of the character work Z assumes." },
    ],
    similar: ["one-piece", "naruto", "yu-yu-hakusho", "hunter-x-hunter"],
  },
  {
    slug: "bleach",
    title: "Bleach",
    japaneseTitle: "ブリーチ",
    year: 2004,
    status: "Ongoing",
    episodes: "?",
    seasons: 4,
    rating: 8.3,
    popularity: 12,
    studio: "pierrot",
    genres: ["action", "supernatural", "shonen"],
    characters: ["ichigo-kurosaki"],
    tagline: "A substitute soul reaper and the war he keeps inheriting.",
    synopsis:
      "Ichigo Kurosaki inherits the powers of a Soul Reaper by accident and quickly finds himself standing between the living world, the Soul Society, and the Hollows that hunt souls in between. Tite Kubo's series is built around swords, ceremony, and the slow reveal that every faction has been at war with itself for centuries.",
    cover: g("#0ea5e9", "#1e293b"),
    accent: "#0ea5e9",
    arcs: [
      { title: "Substitute Soul Reaper", episodes: "1–20", summary: "Ichigo learns what he is, meets the Soul Society's rules, and picks up his first real fight." },
      { title: "Soul Society", episodes: "21–63", summary: "A rescue mission turns into a coup. The Gotei 13 is introduced properly, and Aizen's betrayal reframes the entire series." },
      { title: "Arrancar / Hueco Mundo", episodes: "110–213", summary: "The Espada arrive and the war moves into Aizen's territory." },
      { title: "Thousand-Year Blood War", episodes: "TYBW anime, 2022–", summary: "The Quincy invasion — the manga's final arc, adapted for the first time by Studio Pierrot's 2022 revival." },
    ],
    watchOrder: ["Bleach (2004–2012)", "Bleach: Thousand-Year Blood War (2022– )"],
    powerSystem:
      "Every combatant channels spiritual pressure (reiatsu) through a named weapon (zanpakuto) that unfolds into two additional forms — Shikai and Bankai — each with its own rules. Enemy factions have their own systems: Hollows, Arrancar, Quincy, and Fullbring, all mapped to the same underlying spirit economy.",
    worldBuilding:
      "The world is split across three planes — Living World, Soul Society, and Hueco Mundo — governed by parallel bureaucracies. The Gotei 13, the Central 46, and the Royal Guard sit above the visible plot for most of the series.",
    themes: ["Duty vs. loyalty", "Betrayal from within", "Inherited responsibility", "The named weapon as identity"],
    quotes: [
      { line: "If it were me, I would have chosen a world in which she lived.", character: "Ichigo Kurosaki" },
    ],
    facts: [
      "The 2022 Thousand-Year Blood War adaptation followed a ten-year gap in the anime.",
      "Kubo's early drafts imagined the Soul Society as a Meiji-era Japan analog, a look preserved in the final design.",
    ],
    awards: [],
    soundtrack: [
      { title: "*~Asterisk~", artist: "Orange Range", type: "OP" },
      { title: "Life is Like a Boat", artist: "Rie fu", type: "ED" },
    ],
    voiceActors: [
      { role: "Ichigo Kurosaki", jp: "Masakazu Morita", en: "Johnny Yong Bosch" },
    ],
    faq: [
      { q: "Where does the original anime stop?", a: "It stops mid-Fullbring in 2012. The Thousand-Year Blood War anime picks up the final arc from the manga." },
      { q: "Can I skip the filler?", a: "Community filler guides are extensive for Bleach; the Bount and Zanpakuto Rebellion arcs are commonly skipped." },
    ],
    similar: ["naruto", "jujutsu-kaisen", "yu-yu-hakusho"],
  },
  {
    slug: "my-hero-academia",
    title: "My Hero Academia",
    japaneseTitle: "僕のヒーローアカデミア",
    year: 2016,
    status: "Ongoing",
    episodes: "?",
    seasons: 7,
    rating: 8.0,
    popularity: 8,
    studio: "bones",
    genres: ["action", "shonen", "school", "supernatural"],
    characters: ["izuku-midoriya", "katsuki-bakugo"],
    tagline: "A quirkless boy inherits the greatest hero's power.",
    synopsis:
      "In a world where 80% of humanity is born with a superpower called a Quirk, Izuku Midoriya is not. Kohei Horikoshi's series follows Midoriya from the moment the world's greatest hero picks him as a successor, through his years at U.A. High, and into a full-scale war with a villain organization built out of the society hero culture failed.",
    cover: g("#22c55e", "#0f172a"),
    accent: "#22c55e",
    arcs: [
      { title: "U.A. Sports Festival", episodes: "S2", summary: "The show's version of a tournament arc, used less for winners than for defining every student's public identity." },
      { title: "Hideout Raid", episodes: "S3", summary: "The League of Villains rescue that removes All Might from the board and reshapes the series." },
      { title: "Overhaul", episodes: "S4", summary: "The yakuza arc — a darker, more contained story with lasting consequences for Deku and Mirio." },
      { title: "Paranormal Liberation War", episodes: "S6", summary: "The full-scale confrontation between the Hero Public Safety Commission and Shigaraki's coalition." },
    ],
    watchOrder: ["My Hero Academia (S1–S7)", "Films: Two Heroes, Heroes Rising, World Heroes' Mission"],
    powerSystem:
      "Quirks are inherited, mutation-style superpowers, each with a personal cost and a hard ceiling. One For All, Midoriya's inherited power, is the rare Quirk that grows across generations of users.",
    worldBuilding:
      "Hero work is a regulated industry. U.A. is one of several hero schools, and the Hero Public Safety Commission runs licensing, rankings, and the political fallout when a top hero falls.",
    themes: ["Inheritance", "The cost of a hero economy", "Rivalry as growth", "What society owes its 'quirkless'"],
    quotes: [
      { line: "You can become a hero.", character: "All Might" },
    ],
    facts: [
      "Studio Bones has animated every season of the main series since 2016.",
      "The manga concluded in 2024; the anime's final season has been announced to complete the story.",
    ],
    awards: ["Sugoi Japan Award — Manga (2017)"],
    soundtrack: [
      { title: "The Day", artist: "Porno Graffitti", type: "OP" },
      { title: "Peace Sign", artist: "Kenshi Yonezu", type: "OP" },
    ],
    voiceActors: [
      { role: "Izuku Midoriya", jp: "Daiki Yamashita", en: "Justin Briner" },
      { role: "Katsuki Bakugo", jp: "Nobuhiko Okamoto", en: "Clifford Chapin" },
    ],
    faq: [
      { q: "Are the movies canon?", a: "The films are side-stories written by Horikoshi but sit outside the main manga timeline." },
      { q: "Is the anime finished?", a: "The final season is confirmed. The manga completed in 2024." },
    ],
    similar: ["jujutsu-kaisen", "naruto", "black-clover"],
  },
  {
    slug: "jojos-bizarre-adventure",
    title: "JoJo's Bizarre Adventure",
    japaneseTitle: "ジョジョの奇妙な冒険",
    year: 2012,
    status: "Ongoing",
    episodes: "?",
    seasons: 6,
    rating: 8.5,
    popularity: 15,
    studio: "david-production",
    genres: ["action", "adventure", "supernatural", "shonen"],
    characters: ["jotaro-kujo", "dio-brando"],
    tagline: "Every generation inherits the fight, and the pose.",
    synopsis:
      "Hirohiko Araki's multigenerational saga follows the Joestar family across a century of feuds with an immortal enemy and the strange powers — first Hamon, later Stands — the bloodline develops to fight him. Each part changes protagonist, setting, and genre, but keeps the same operatic sense of style.",
    cover: g("#a855f7", "#facc15"),
    accent: "#a855f7",
    arcs: [
      { title: "Phantom Blood", episodes: "1–9", summary: "Victorian England, the origin of DIO, and the Hamon breathing style." },
      { title: "Battle Tendency", episodes: "10–26", summary: "Joseph Joestar, the Pillar Men, and one of the funniest tonal shifts in shonen." },
      { title: "Stardust Crusaders", episodes: "27–74", summary: "The Stand system is introduced; Jotaro leads a road-trip across Asia to end DIO." },
      { title: "Diamond is Unbreakable", episodes: "75–113", summary: "A small-town serial-killer mystery framed as a Stand story." },
      { title: "Golden Wind", episodes: "114–152", summary: "Italian mafia, betrayal, and one of the tightest ensemble arcs in the franchise." },
      { title: "Stone Ocean", episodes: "153–190", summary: "Part 6, a prison arc that ends the original continuity." },
    ],
    watchOrder: ["JoJo's Bizarre Adventure (2012)", "Stardust Crusaders (2014)", "Diamond is Unbreakable (2016)", "Golden Wind (2018)", "Stone Ocean (2021)"],
    powerSystem:
      "Parts 1–2 use Hamon, a sunlight-based breathing technique. From Part 3 onward, the series runs on Stands — manifested spirit powers unique to each user, with hard rules and named after music references.",
    worldBuilding:
      "A single family bloodline threads through Victorian occultism, WWII-era Nazi archaeology, 1980s Japan, 2000s Italian organized crime, and a Florida women's prison — all connected by the Joestar star birthmark and the shadow of DIO.",
    themes: ["Inheritance", "Style as substance", "Fate and bloodline", "Rules-based supernatural combat"],
    quotes: [
      { line: "Yare yare daze.", character: "Jotaro Kujo" },
    ],
    facts: [
      "David Production has animated every part of the David-era anime since 2012.",
      "Araki's musical references are so extensive that Stand names have been altered in some Western releases for licensing.",
    ],
    awards: ["Shogakukan Manga Award — General (1993)"],
    soundtrack: [
      { title: "Sono Chi no Sadame", artist: "Hiroaki 'Tommy' Tominaga", type: "OP" },
      { title: "Roundabout", artist: "Yes", type: "ED" },
    ],
    voiceActors: [
      { role: "Jotaro Kujo", jp: "Daisuke Ono", en: "Matthew Mercer" },
      { role: "DIO", jp: "Takehito Koyasu", en: "Patrick Seitz" },
    ],
    faq: [
      { q: "Do I have to start with Part 1?", a: "Yes. Every later part assumes you know the Joestar/DIO backstory." },
      { q: "Where is Part 7?", a: "Steel Ball Run has not yet been animated as of 2026." },
    ],
    similar: ["hunter-x-hunter", "yu-yu-hakusho", "dragon-ball-z"],
  },
  {
    slug: "one-punch-man",
    title: "One-Punch Man",
    japaneseTitle: "ワンパンマン",
    year: 2015,
    status: "Ongoing",
    episodes: "?",
    seasons: 2,
    rating: 8.5,
    popularity: 20,
    studio: "madhouse",
    genres: ["action", "comedy", "supernatural"],
    characters: ["saitama"],
    tagline: "A hero for fun who wins in one hit.",
    synopsis:
      "Saitama is a hero so overpowered that no fight lasts more than a punch. ONE and Yusuke Murata's series is a satire of the power-fantasy shonen genre — its real drama is what happens to a man who solved his own premise on page one.",
    cover: g("#facc15", "#ef4444"),
    accent: "#facc15",
    arcs: [
      { title: "Saitama Introduction", episodes: "S1 E1–3", summary: "The premise is set: a bald man in a jumpsuit ends every fight instantly." },
      { title: "Hero Association", episodes: "S1 E4–12", summary: "The show introduces the ranked-hero bureaucracy and Genos as Saitama's disciple." },
      { title: "Monster Association", episodes: "S2", summary: "Garou, the Hero Hunter, becomes the counter-thesis to Saitama's boredom." },
    ],
    watchOrder: ["One-Punch Man Season 1 (2015)", "One-Punch Man Season 2 (2019)"],
    powerSystem:
      "There isn't one in the traditional sense — that's the joke. Every other character has strict rules, ranks, and cybernetic upgrades; Saitama alone breaks the ceiling.",
    worldBuilding:
      "The Hero Association ranks its members S–C-Class and dispatches them against a global bestiary of monsters. Cities are named A through Z, and the destruction economy runs the plot as much as any villain.",
    themes: ["The cost of unmatched power", "Bureaucracy vs heroism", "Discipleship"],
    quotes: [
      { line: "I'm just a guy who's a hero for fun.", character: "Saitama" },
    ],
    facts: [
      "Season 1 was animated by Madhouse; Season 2 moved to J.C.Staff.",
      "The original webcomic by ONE predates Mob Psycho 100 and remains freely readable in Japanese.",
    ],
    awards: ["Sugoi Japan Award — Manga (2015)"],
    soundtrack: [
      { title: "THE HERO !!", artist: "JAM Project", type: "OP" },
    ],
    voiceActors: [
      { role: "Saitama", jp: "Makoto Furukawa", en: "Max Mittelman" },
    ],
    faq: [
      { q: "Is Season 2 worth watching?", a: "Yes, but expect a visible drop in animation quality from the Madhouse-produced first season." },
      { q: "Should I read the webcomic or the manga?", a: "Murata's manga is the polished version. ONE's webcomic is a rougher, faster draft of the same story." },
    ],
    similar: ["mob-psycho-100", "jujutsu-kaisen"],
  },
  {
    slug: "mob-psycho-100",
    title: "Mob Psycho 100",
    japaneseTitle: "モブサイコ100",
    year: 2016,
    status: "Completed",
    episodes: 37,
    seasons: 3,
    rating: 8.6,
    popularity: 25,
    studio: "bones",
    genres: ["action", "comedy", "supernatural", "coming-of-age", "school"],
    characters: ["shigeo-kageyama"],
    tagline: "Being kind matters more than being powerful.",
    synopsis:
      "Shigeo 'Mob' Kageyama is one of the strongest psychics alive and spends most of his middle-school years trying to become a normal teenager. ONE's second major series is the counter-thesis to One-Punch Man — a story about a boy who can level a city and chooses, every day, not to.",
    cover: g("#c026d3", "#0f172a"),
    accent: "#c026d3",
    arcs: [
      { title: "Claw Introduction", episodes: "S1", summary: "The evil-psychic organization Claw is revealed, and Mob's brother's storyline begins." },
      { title: "Separation", episodes: "S2", summary: "Reigen loses Mob's trust — the emotional low point that reframes their entire relationship." },
      { title: "≥100% Confession", episodes: "S3", summary: "The final season, and one of the most tonally consistent shonen endings of the decade." },
    ],
    watchOrder: ["Mob Psycho 100 (2016)", "Mob Psycho 100 II (2019)", "Mob Psycho 100 III (2022)"],
    powerSystem:
      "Psychic ability (esper power) is measured in percentages of emotional pressure. Mob's abilities scale with suppressed feeling; when he reaches 100%, the environment answers.",
    worldBuilding:
      "A contemporary Japan overlaid with a secret ecology of spirits, psychic conmen, and organized esper crime.",
    themes: ["Restraint as strength", "Mentorship without expertise", "Adolescence as loss of control"],
    quotes: [],
    facts: [
      "Studio Bones assigned Yuzuru Tachikawa to direct, whose fluid pencil style became one of the show's signatures.",
      "The manga and anime finished within months of each other, an unusually clean landing for a shonen series.",
    ],
    awards: ["Crunchyroll Anime Award — Best Animation (2020)"],
    soundtrack: [
      { title: "99", artist: "Mob Choir", type: "OP" },
    ],
    voiceActors: [
      { role: "Shigeo Kageyama", jp: "Setsuo Ito", en: "Kyle McCarley" },
    ],
    faq: [
      { q: "Do I need to watch One-Punch Man first?", a: "No. The two ONE adaptations share a writer, not a universe." },
      { q: "Is it appropriate for younger viewers?", a: "Mostly yes — some psychic violence, but no adult content." },
    ],
    similar: ["one-punch-man", "jujutsu-kaisen"],
  },
  {
    slug: "haikyuu",
    title: "Haikyuu!!",
    japaneseTitle: "ハイキュー!!",
    year: 2014,
    status: "Completed",
    episodes: 85,
    seasons: 4,
    rating: 8.7,
    popularity: 10,
    studio: "production-ig",
    genres: ["sports", "drama", "school", "shonen"],
    characters: ["hinata-shoyo"],
    tagline: "A small player, a big net, and a team learning to fly.",
    synopsis:
      "Shoyo Hinata, short even by his generation's standards, joins Karasuno High's volleyball club with one goal: to jump higher than anyone else on the court. Haruichi Furudate's series is one of the most technically respected sports anime ever produced, and Production I.G's adaptation treats every rally like a fight scene.",
    cover: g("#ea580c", "#0f172a"),
    accent: "#ea580c",
    arcs: [
      { title: "Interhigh Preliminaries", episodes: "S1", summary: "The Karasuno vs. Aoba Johsai rivalry begins; the show establishes its core cast." },
      { title: "Spring Tournament Qualifiers", episodes: "S2", summary: "Karasuno vs. Shiratorizawa — the arc that made 'Karasuno' a household word for sports-anime fans." },
      { title: "Spring Tournament", episodes: "S4", summary: "The Nekoma match, the Inarizaki match, and the final push toward nationals." },
    ],
    watchOrder: ["Haikyuu!! (S1–S4)", "Haikyuu!! The Movie: Battle of the Garbage Dump (2024)"],
    powerSystem:
      "None — it's a sports anime. Instead, Furudate stacks position roles (setter, libero, ace, middle blocker) and pattern reads that operate like techniques in a shonen fight.",
    worldBuilding:
      "Japanese high-school volleyball, taken seriously enough to name specific tournaments (Interhigh, Spring High) and to build multi-season arcs around specific rival schools.",
    themes: ["Team as unit", "Small talent vs. big talent", "The rival across the net", "Practice as identity"],
    quotes: [
      { line: "The ball hasn't dropped yet.", character: "Ittetsu Takeda" },
    ],
    facts: [
      "The final chapter of the manga aired within a season of the S4 finale.",
      "The 2024 Dumpster Battle film is the first of two planned theatrical continuations of the anime.",
    ],
    awards: ["Kodansha Manga Award — Shonen (2016)"],
    soundtrack: [
      { title: "Imagination", artist: "SPYAIR", type: "OP" },
    ],
    voiceActors: [
      { role: "Shoyo Hinata", jp: "Ayumu Murase", en: "Bryson Baugus" },
    ],
    faq: [
      { q: "Do I need to know volleyball rules?", a: "No — the show teaches you as it plays." },
      { q: "Is it finished?", a: "The TV series ended in 2020; the story continues in two theatrical films." },
    ],
    similar: ["blue-lock", "slam-dunk", "kurokos-basketball"],
  },
  {
    slug: "blue-lock",
    title: "Blue Lock",
    japaneseTitle: "ブルーロック",
    year: 2022,
    status: "Ongoing",
    episodes: "?",
    seasons: 2,
    rating: 8.0,
    popularity: 30,
    studio: "eight-bit",
    genres: ["sports", "drama", "shonen"],
    characters: ["yoichi-isagi"],
    tagline: "300 strikers, one project, one selfish egoist to save Japan.",
    synopsis:
      "Muneyuki Kaneshiro and Yusuke Nomura's series traps 300 of Japan's most promising strikers in a single facility and asks them to eliminate each other into a single, perfectly selfish World Cup goalscorer. The premise is antithetical to traditional sports-anime team ethics, and that friction is the point.",
    cover: g("#0ea5e9", "#0f172a"),
    accent: "#0ea5e9",
    arcs: [
      { title: "First Selection", episodes: "S1 E1–14", summary: "The Blue Lock facility, the elimination format, and the ranking system are introduced." },
      { title: "Second Selection", episodes: "S1 E15–24", summary: "Team formations and rivalry structures crystallize; Isagi's spatial awareness becomes the show's central metaphor." },
      { title: "Neo Egoist League", episodes: "S2", summary: "The surviving strikers are matched with foreign clubs and pro coaches." },
    ],
    watchOrder: ["Blue Lock Season 1 (2022)", "Blue Lock: Episode Nagi (2024 film)", "Blue Lock Season 2 (2024)"],
    powerSystem:
      "None — but the series treats spatial awareness, ego, and 'weapons' (a striker's signature technique) as if they were.",
    worldBuilding:
      "A near-future Japan whose football federation has authorized an extralegal training facility to manufacture a single World-Cup-winning striker.",
    themes: ["Ego vs. team", "Scarcity as motivation", "Talent hierarchy"],
    quotes: [],
    facts: [
      "Eight Bit's adaptation debuted the same year Japan reached the World Cup round of 16 — a coincidence the marketing leaned into.",
      "The Episode Nagi film re-tells early arcs from the perspective of a supporting character.",
    ],
    awards: ["Kodansha Manga Award — Shonen (2021)"],
    soundtrack: [
      { title: "Chaos ga Kiwamaru", artist: "Unison Square Garden", type: "OP" },
    ],
    voiceActors: [
      { role: "Yoichi Isagi", jp: "Kazuki Ura" },
    ],
    faq: [
      { q: "Do I need to watch Episode Nagi?", a: "No — it's a companion film, not a prerequisite for Season 2." },
      { q: "Is it beginner-friendly?", a: "Yes. The series explains its rules explicitly every arc." },
    ],
    similar: ["haikyuu", "kurokos-basketball"],
  },
  {
    slug: "black-clover",
    title: "Black Clover",
    japaneseTitle: "ブラッククローバー",
    year: 2017,
    status: "Completed",
    episodes: 170,
    seasons: 4,
    rating: 8.1,
    popularity: 22,
    studio: "pierrot",
    genres: ["action", "fantasy", "magic", "shonen"],
    characters: ["asta"],
    tagline: "The one boy in a world of mages who was born without magic.",
    synopsis:
      "Yūki Tabata's series follows Asta, an orphan born with no mana in a kingdom where magic is identity, and Yuno, his rival and best friend, as they both work toward the title of Wizard King. The TV anime ran 170 episodes to the Spade Kingdom raid; the film Sword of the Wizard King continues the story.",
    cover: g("#16a34a", "#0f172a"),
    accent: "#16a34a",
    arcs: [
      { title: "Magic Knights Entrance", episodes: "1–13", summary: "Asta joins the Black Bulls; the guild-culture premise is established." },
      { title: "Eye of the Midnight Sun", episodes: "39–83", summary: "The elf revival plot begins; long-buried grudges reshape the Clover Kingdom." },
      { title: "Spade Kingdom Raid", episodes: "158–170", summary: "The TV series' final arc, ending on a bridge to the Sword of the Wizard King film." },
    ],
    watchOrder: ["Black Clover TV (2017–2021)", "Black Clover: Sword of the Wizard King (2023)"],
    powerSystem:
      "Every citizen of the Clover Kingdom is born with mana and receives a grimoire attuned to their affinity. Asta's anti-magic weapons are the exception the whole plot revolves around.",
    worldBuilding:
      "A Clover Kingdom divided into nine Magic Knight squads, each with its own culture, ranked by public performance and quietly gatekept by nobility.",
    themes: ["Effort vs. talent", "Rivalry as motivation", "Class mobility"],
    quotes: [],
    facts: [
      "The anime is one of Pierrot's longest continuous productions of the 2010s.",
      "Sword of the Wizard King is a canon continuation, not a side story.",
    ],
    awards: [],
    soundtrack: [
      { title: "Haruka Mirai", artist: "Kankaku Piero", type: "OP" },
    ],
    voiceActors: [
      { role: "Asta", jp: "Gakuto Kajiwara", en: "Dallas Reid" },
    ],
    faq: [
      { q: "Is the anime over?", a: "The TV series ended in 2021; the story continues in the 2023 film and in the ongoing manga." },
      { q: "Does Asta ever get magic?", a: "No — his weapons cut magic, which is the entire premise." },
    ],
    similar: ["my-hero-academia", "naruto", "fairy-tail"],
  },
  {
    slug: "dr-stone",
    title: "Dr. Stone",
    japaneseTitle: "ドクターストーン",
    year: 2019,
    status: "Ongoing",
    episodes: "?",
    seasons: 4,
    rating: 8.3,
    popularity: 28,
    studio: "tms",
    genres: ["adventure", "sci-fi", "shonen"],
    characters: ["senku-ishigami"],
    tagline: "Rebuilding civilization from zero, one experiment at a time.",
    synopsis:
      "Riichiro Inagaki and Boichi's series opens with every human on Earth turned to stone. Thousands of years later, high-school genius Senku Ishigami wakes up and starts rebuilding civilization from first principles. The show is a shonen wrapper around a science-history procedural.",
    cover: g("#22c55e", "#0f172a"),
    accent: "#22c55e",
    arcs: [
      { title: "Stone World", episodes: "S1", summary: "The Kingdom of Science is founded; Senku's method — cite the recipe, then build the tool — is established." },
      { title: "Stone Wars", episodes: "S2", summary: "The Empire of Might is confronted; the show introduces its long-term antagonist framework." },
      { title: "New World", episodes: "S3", summary: "A trans-Pacific voyage; the show becomes an adventure travelogue." },
      { title: "Science Future", episodes: "S4", summary: "The final season, adapting the manga's endgame." },
    ],
    watchOrder: ["Dr. Stone (2019)", "Stone Wars (2021)", "New World (2023)", "Science Future (2024)"],
    powerSystem:
      "Real chemistry, mostly. The show cites sources on-screen and takes visible liberties only with time-to-manufacture.",
    worldBuilding:
      "A post-petrification Earth in which the ruins of modern civilization are archaeological. Different survivor communities represent different attitudes toward what humanity was and should become.",
    themes: ["Science as narrative", "Progress vs. force", "Communal knowledge"],
    quotes: [],
    facts: [
      "TMS Entertainment has produced every season; Boichi's art style has driven the show's distinctive character designs.",
      "The Japanese chemistry consultant on the anime is credited by name in the closing sequence.",
    ],
    awards: ["Shogakukan Manga Award — Shonen (2018)"],
    soundtrack: [
      { title: "Good Morning World!", artist: "BURNOUT SYNDROMES", type: "OP" },
    ],
    voiceActors: [
      { role: "Senku Ishigami", jp: "Yusuke Kobayashi", en: "Aaron Dismuke" },
    ],
    faq: [
      { q: "Is the science real?", a: "Mostly yes. The show cites its sources; the manga has a technical adviser." },
      { q: "Do I need a science background?", a: "No — Senku's job is to explain the recipe to you before he cooks it." },
    ],
    similar: ["hunter-x-hunter", "frieren"],
  },
  {
    slug: "yu-yu-hakusho",
    title: "Yu Yu Hakusho",
    japaneseTitle: "幽☆遊☆白書",
    year: 1992,
    status: "Completed",
    episodes: 112,
    seasons: 4,
    rating: 8.5,
    popularity: 40,
    studio: "pierrot",
    genres: ["action", "supernatural", "shonen"],
    characters: ["yusuke-urameshi"],
    tagline: "A delinquent detective for the spirit world.",
    synopsis:
      "Yoshihiro Togashi's series follows Yusuke Urameshi, a teenage delinquent who dies saving a child in the first episode and comes back as Spirit World's official detective. Yu Yu Hakusho ran between Togashi's two masterworks — Slam Dunk-era shonen structure with the tournament rigor Hunter × Hunter would later inherit.",
    cover: g("#166534", "#0f172a"),
    accent: "#22c55e",
    arcs: [
      { title: "Spirit Detective", episodes: "1–25", summary: "The premise is established; Yusuke assembles his team." },
      { title: "Dark Tournament", episodes: "26–66", summary: "The arc most fans still call the template for the modern shonen tournament." },
      { title: "Chapter Black", episodes: "67–94", summary: "Sensui's arc, the moral tone shift that would echo into Hunter × Hunter." },
      { title: "Three Kings", episodes: "95–112", summary: "The Demon World finale — divisive at release, better regarded now." },
    ],
    watchOrder: ["Yu Yu Hakusho (1992)"],
    powerSystem:
      "Spirit energy (reiki, yōki) manifests through named techniques — Spirit Gun, Fists of the Mortal Flame — with strict rules and drawbacks that later became genre-standard.",
    worldBuilding:
      "A three-tier cosmology: Human World, Spirit World bureaucracy, and Demon World. Every arc reframes which of the three is the real problem.",
    themes: ["Rehabilitation", "Rivalry as brotherhood", "The tournament as moral test"],
    quotes: [],
    facts: [
      "Togashi's health issues during the Three Kings arc shaped the compressed final stretch.",
      "The show received a live-action Netflix adaptation in 2023.",
    ],
    awards: ["Shogakukan Manga Award — Shonen (1994)"],
    soundtrack: [
      { title: "Smile Bomb", artist: "Matsuko Mawatari", type: "OP" },
    ],
    voiceActors: [
      { role: "Yusuke Urameshi", jp: "Nozomu Sasaki", en: "Justin Cook" },
    ],
    faq: [
      { q: "Is it available in English?", a: "Yes. The Funimation dub is the reference version for most Western fans." },
      { q: "Do I need to watch the movies?", a: "No — the theatrical films are optional side stories." },
    ],
    similar: ["hunter-x-hunter", "bleach", "jojos-bizarre-adventure"],
  },
];


export const getAnime = (slug: string) => animes.find((a) => a.slug === slug);
export const listAnime = () => animes;
