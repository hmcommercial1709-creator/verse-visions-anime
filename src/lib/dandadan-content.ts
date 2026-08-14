export const BASE="/anime/dandadan";
export const branches=[
 {slug:"episode-guide",title:"Episode & Arc Guide",tag:"Story route",image:"/anime/dandadan/episodes.webp",description:"Spoiler-light summaries, arc checkpoints and the reason every episode matters."},
 {slug:"characters",title:"Characters & Relationships",tag:"Human core",image:"/anime/dandadan/characters.webp",description:"Momo, Okarun, Seiko, Aira and Jiji—growth, chemistry, powers and team roles."},
 {slug:"occult-world",title:"Yokai, Aliens & Powers",tag:"World explained",image:"/anime/dandadan/world.webp",description:"Folklore, extraterrestrials, curses, psychic ability and the rules connecting them."},
 {slug:"watch-guide",title:"Beginner Watch Guide",tag:"Start here",image:"/anime/dandadan/watch-guide.webp",description:"Viewing order, expectations, spoiler policy, legal availability and manga next steps."},
] as const;
export type Branch=(typeof branches)[number]["slug"];
export const episodes=[
 ["1","That's How Love Starts, Ya Know!","Momo and Okarun challenge each other's beliefs; aliens and ghosts answer both wagers.","The premise, chemistry and double mythology arrive at once."],
 ["2","That's a Space Alien, Ain't It?!","The aftermath forces cooperation when a new extraterrestrial threat attacks.","Neither skepticism nor belief is enough alone."],
 ["3","It's a Granny vs. Granny Clash!","Seiko reframes spiritual combat around knowledge, timing and territory.","The mentor layer grounds the supernatural rules."],
 ["4","Kicking Turbo Granny's Ass","A rematch becomes a tactical high-speed chase with emotional consequences.","Comedy increases rather than erases the stakes."],
 ["5","Like, Where Are Your Balls?!","School life returns while embarrassment and missing pieces move the mystery.","Romance and plot become one engine."],
 ["6","A Dangerous Woman Arrives","Aira's assumptions create rivalry, insecurity and fresh danger.","A new viewpoint complicates the heroes."],
 ["7","To a Kinder World","Acrobatic Silky's history turns fear into the season's most compassionate story.","A model for the series' yokai writing."],
 ["8","I've Got This Funny Feeling","Friendship tensions and alien pressure collide.","The ensemble begins to function as a team."],
 ["9","Merge! Serpo Dover Demon Nessie!","Several threats combine in an outrageous but readable battle.","Every power receives a clear tactical job."],
 ["10","Have You Ever Seen a Cattle Mutilation?","Odd evidence and social fallout broaden the conspiracy.","A curiosity-driven bridge chapter."],
 ["11","First Love","Jiji arrives with history, charisma and a haunted-house problem.","Romantic tension opens a new mystery."],
 ["12","Let's Go to the Cursed House","The group investigates Jiji's home and finds an organized danger.","The gateway to the Cursed House arc."],
] as const;
export const characters=[
 ["Momo Ayase","Psychic lead","Direct, perceptive and brave. Her belief in spirits is balanced by skepticism toward aliens.","Psychokinesis · spiritual awareness · leadership"],
 ["Ken ‘Okarun’ Takakura","Occult researcher","An alien believer whose kindness and anxious intelligence make him a natural investigator.","Research · curse-powered speed · persistence"],
 ["Seiko Ayase","Mentor and medium","She treats exorcism as fieldwork: boundaries, local gods, timing and confidence.","Barriers · spiritual tools · tactical authority"],
 ["Aira Shiratori","Rival turned ally","Her desire to be special creates mistakes, but courage lets her grow beyond them.","Acrobatic power · adaptability · boldness"],
 ["Jin ‘Jiji’ Enjoji","Friend with a haunting","Warm charisma hides real fear; his home connects personal history to a dangerous curse.","Athleticism · empathy · supernatural sensitivity"],
] as const;
export const world=[
 ["Yokai and grudges","Spirits are shaped by place, memory and unresolved emotion; force rarely explains why they exist."],
 ["Aliens and experiments","Extraterrestrials use technology, collection and imitation, giving science fiction a different logic."],
 ["Psychic ability","Momo's flexible power responds to concentration and spiritual perception, but is never limitless."],
 ["Curses and transformation","Borrowed power offers speed and force at the cost of control and unfinished business."],
 ["Territory and rules","Shrines, tunnels and homes matter. Knowledge of a location can outweigh strength."],
 ["Emotional resolution","Many encounters end only after the pain beneath the monster is understood."],
] as const;
export const steps=[
 ["Start with episode 1","The premiere is the perfect tone test: romance, comedy, aliens, ghosts and action are all present."],
 ["Watch in broadcast order","The story is serialized; do not jump to fight clips before their emotional setup."],
 ["Use the episode guide","Read only the summary for the episode you finished to reduce accidental spoilers."],
 ["Check legal availability locally","Catalogs vary by country; verify the official series page or a licensed regional platform."],
 ["Continue with the manga if desired","After the available adaptation, verify the latest covered chapter before continuing."],
] as const;
