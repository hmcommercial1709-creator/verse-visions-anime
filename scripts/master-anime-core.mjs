import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const baseAnime = [
  "One Piece", "Attack on Titan", "Dragon Ball", "Jujutsu Kaisen", "Demon Slayer",
  "Hunter x Hunter", "Dr. Stone", "Solo Leveling", "Naruto", "Bleach",
  "Death Note", "Fullmetal Alchemist", "Steins;Gate", "Chainsaw Man", "Tokyo Ghoul",
  "My Hero Academia", "Black Clover", "Blue Lock", "Vinland Saga", "Cyberpunk Edgerunners",
  "Mob Psycho 100", "Neon Genesis Evangelion", "Haikyuu", "Spy x Family", "Berserk"
];

const markets = [
  { lang: "ar-SA", market: "Middle East & Arab World" },
  { lang: "en-US", market: "North America" },
  { lang: "ja-JP", market: "Japan & East Asia" },
  { lang: "es-ES", market: "Latin America & Spain" },
  { lang: "de-DE", market: "Central Europe" }
];

async function synchronizeAnimeMatrix() {
  console.log("[Anime-Core] Launching global anime neural matrix synchronization...");
  let totalInserted = 0;
  const batchSize = 500;
  let batch = [];

  for (let i = 0; i < baseAnime.length; i++) {
    const anime = baseAnime[i];
    for (let m = 0; m < markets.length; m++) {
      const currentMarket = markets[(i + m) % markets.length];

      for (let node = 1; node <= 250; node++) {
        const slug = `omni-anime-${i}-${node}-${currentMarket.lang.toLowerCase()}`;
        const record = {
          slug: slug,
          title: `${anime} - Neural Matrix Node ${node} (${currentMarket.market})`,
          target_language: currentMarket.lang,
          target_market: currentMarket.market,
          "webRTC_voice_channels_active": true,
          neural_node_data: { core_index: node, synapse_sync: true, bandwidth: "10Gbps" },
          matrix_metrics: { engagement: 99.8, frequency: "432Hz", sync_rate: "optimal" },
          status: "active"
        };

        batch.push(record);

        if (batch.length >= batchSize) {
          const { error } = await supabase.from('anime_nexus_matrix').upsert(batch, { onConflict: 'slug' });
          if (error) {
            console.error(`Sync error at batch:`, error.message);
          } else {
            totalInserted += batch.length;
            console.log(`Successfully synchronized ${totalInserted} anime neural records...`);
          }
          batch = [];
        }
      }
    }
  }

  if (batch.length > 0) {
    const { error } = await supabase.from('anime_nexus_matrix').upsert(batch, { onConflict: 'slug' });
    if (!error) {
      totalInserted += batch.length;
    }
  }

  console.log(`[Anime-Core] Successfully synchronized total ${totalInserted} global anime records.`);
}

synchronizeAnimeMatrix().catch(console.error);
