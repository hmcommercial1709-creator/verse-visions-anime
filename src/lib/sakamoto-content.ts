export const SBASE="/anime/sakamoto-days";
export const sakamotoBranches=[
 {slug:"episode-guide",title:"Episode & Mission Guide",tag:"22-episode route",image:"/anime/sakamoto-days/episodes.webp",description:"Spoiler-aware mission summaries, arc boundaries, tactical highlights and emotional turning points."},
 {slug:"characters",title:"Characters & Assassin Files",tag:"The cast",image:"/anime/sakamoto-days/characters.webp",description:"Sakamoto, Shin, Lu, Nagumo, the Order and the enemies reshaping their peaceful life."},
 {slug:"assassin-world",title:"JAA, The Order & Combat",tag:"World explained",image:"/anime/sakamoto-days/world.webp",description:"Organizations, rankings, weapons, clairvoyance and the environmental logic behind every fight."},
 {slug:"watch-guide",title:"Beginner Watch Guide",tag:"Start here",image:"/anime/sakamoto-days/watch.webp",description:"Viewing order, tone, age guidance, official streaming and the safest route into the manga."},
] as const;export type SBranch=(typeof sakamotoBranches)[number]["slug"];
export const missions=[
 ["1–2","The retired legend","Sakamoto's quiet family store is interrupted when Shin arrives with an ultimatum.","Family peace becomes the story's non-negotiable rule."],
 ["3–5","The bounty begins","New attackers test the store team across ordinary public spaces.","Everyday objects become tactical tools rather than decoration."],
 ["6–7","Heisuke and the lab","A gifted marksman and a dangerous facility expand the team and the conspiracy.","Long-range combat and experimental threats widen the system."],
 ["8–9","Amusement park mission","A family outing becomes a layered protection operation.","Comedy, parenting and action occupy the same scene."],
 ["10–11","Boiled and the Order","A veteran enemy tests Sakamoto while elite assassins enter the board.","The ceiling of professional combat rises sharply."],
 ["12–14","Death-row prisoners","X's network unleashes unpredictable killers against the JAA world.","The conflict moves from personal bounty to organized destabilization."],
 ["15–17","Team pressure","Shin and Lu must contribute without relying on Sakamoto to solve every problem.","Side characters gain tactical agency."],
 ["18–19","Order intervention","Elite agents reveal radically different philosophies and fighting styles.","Power is shown through efficiency, not exposition."],
 ["20–22","JCC gateway","Clues about X point toward assassin education, hidden history and the next investigation.","The season opens a larger institutional mystery."],
] as const;
export const assassinFiles=[
 ["Taro Sakamoto","Retired legendary hitman","A family man whose greatest strength is not violence but control: he reads space instantly and protects without killing.","Improvisation · reflexes · environmental mastery"],
 ["Shin Asakura","Telepath and partner","Reading thoughts gives Shin information, not automatic victory. His growth comes from acting decisively under sensory pressure.","Clairvoyance · teamwork · emotional intelligence"],
 ["Lu Shaotang","Martial artist","Lu adds mobility, blunt honesty and a different criminal-world history to the store family.","Chinese martial arts · adaptability · courage"],
 ["Nagumo","Order operative","A smiling master of disguise whose friendliness never makes his intent fully readable.","Deception · transformation · elite close combat"],
 ["Heisuke Mashimo","Sniper","Socially awkward but technically brilliant, Heisuke turns geometry, timing and trust into long-range support.","Ricochet calculation · precision · loyalty"],
 ["X / Slur","Systemic threat","The antagonist attacks the structure and ideology of the assassin world, not only Sakamoto himself.","Recruitment · disruption · long-term strategy"],
] as const;
export const assassinWorld=[
 ["JAA","The Japanese Association of Assassins regulates jobs, training and professional legitimacy."],
 ["The Order","An elite enforcement group whose members function as specialists rather than interchangeable power levels."],
 ["JCC","The assassin academy reveals how surveillance, exams, tools and institutional loyalty are taught."],
 ["No-killing family rule","Sakamoto's promise creates harder tactical problems and gives every victory moral shape."],
 ["Environmental combat","Trains, stores and public attractions become complete toolkits; spatial reading matters more than signature attacks."],
 ["Clairvoyance limits","Shin can access thoughts, but speed, noise, range and interpretation keep the ability dramatic rather than absolute."],
] as const;
export const sakamotoSteps=[
 ["Watch the 22 episodes in order","The adaptation is serialized and its cast introductions build directly into the X and JCC storyline."],
 ["Expect comedy with real stakes","The series moves from domestic warmth to professional danger without treating either as filler."],
 ["Track rules, not power numbers","Weapons and abilities matter, but positioning, intent and restraint decide most encounters."],
 ["Use official availability","Netflix identifies the anime as a 22-episode 2025 series; catalog access can still vary by region."],
 ["Continue through official manga editions","VIZ publishes Yuto Suzuki's manga in English; verify the latest adapted chapter before jumping ahead."],
] as const;
