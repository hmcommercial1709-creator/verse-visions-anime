import { createSignal, onMount } from "solid-js";

export default function Home() {
  const [currentEpisode, setCurrentEpisode] = createSignal(1);
  const [currentStreamUrl, setCurrentStreamUrl] = createSignal("https://youtube.com");
  const [currentTitle, setCurrentTitle] = createSignal("Anime Stream");
  const [animeList, setAnimeList] = createSignal<any[]>([]);
  const [pageCounter, setPageCounter] = createSignal(1);
  const [dynamicContent, setDynamicContent] = createSignal<any[]>([]);

  // 1. Fetching Global Anime data dynamically via Jikan API for automatic SEO page generation
  onMount(async () => {
    try {
      const response = await fetch('https://jikan.moe');
      const data = await response.json();
      if (data && data.data) {
        setAnimeList(data.data);
      }
    } catch (error) {
      console.error('Error fetching dynamic anime data:', error);
    }

    // 2. Infinite Scroll Retention System to keep visitors hooked forever
    window.addEventListener('scroll', () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 400) {
        setPageCounter(pageCounter() + 1);
        generateLoopingContent();
      }
    });
  });

  const handleAnimeClick = (anime: any, index: number) => {
    setCurrentStreamUrl(`https://youtube.com&start=${index * 25}`);
    setCurrentTitle(anime.title_english || anime.title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changeEpisode = (direction: number) => {
    let nextEp = currentEpisode() + direction;
    if (nextEp < 1) nextEp = 1;
    setCurrentEpisode(nextEp);
  };

  const generateLoopingContent = () => {
    if (pageCounter() % 2 === 0) {
      setDynamicContent([...dynamicContent(), {
        type: 'twitch',
        title: '🎮 Live Trending Gaming Stream',
        url: `https://twitch.tv{window.location.hostname}`
      }]);
    } else {
      setDynamicContent([...dynamicContent(), {
        type: 'game',
        title: '🎲 Secret Mini-Game Unlocked! Play Now',
        url: 'https://gamepix.com'
      }]);
    }
  };

  return (
    <div style={{ "background-color": "#0b0c10", color: "#c5c6c7", "font-family": "sans-serif", "min-height": "100vh", padding: "0 0 40px 0" }}>
      <header style={{ background: "#1f2833", padding: "15px", "text-align": "center", "border-bottom": "2px solid #45f3ff" }}>
        <h1 style={{ margin: 0, color: "#fff", "font-size": "24px" }}>GameCastle <span style={{ color: "#45f3ff" }}>• Anime & Gaming Hub</span></h1>
      </header>

      <div style={{ "max-width": "1200px", margin: "20px auto", padding: "0 15px" }}>
        
        {/* Section 1: Main Video Player */}
        <h2 style={{ color: "#fff", "border-left": "4px solid #45f3ff", "padding-left": "10px", margin: "20px 0" }}>
          📺 Castle Cinema - Stream Anime Now
        </h2>
        <div style={{ background: "#1f2833", "border-radius": "12px", padding: "20px", "margin-bottom": "30px", "box-shadow": "0 4px 15px rgba(0,0,0,0.5)" }}>
          <div style={{ position: "relative", "padding-bottom": "56.25%", height: 0, overflow: "hidden", "border-radius": "8px", background: "#000" }}>
            <iframe id="anime-video-player" src={currentStreamUrl() + `&ep=${currentEpisode()}`} allowfullscreen={true} style={{ position: "absolute", top: 0, left: 0, width: 100 + "%", height: 100 + "%", border: "none" }}></iframe>
          </div>
          <div style={{ "margin-top": "15px", display: "flex", gap: "10px", "justify-content": "center", "flex-wrap": "wrap" }}>
            <button onClick={() => changeEpisode(-1)} style={{ background: "#45f3ff", color: "#0b0c10", border: "none", padding: "10px 20px", "border-radius": "5px", "font-weight": "bold", cursor: "pointer" }}>
              ⏮️ Previous Episode
            </button>
            <span style={{ "align-self": "center", "font-weight": "bold", color: "#fff" }}>
              {currentTitle()} - Episode: {currentEpisode()}
            </span>
            <button onClick={() => changeEpisode(1)} style={{ background: "#45f3ff", color: "#0b0c10", border: "none", padding: "10px 20px", "border-radius": "5px", "font-weight": "bold", cursor: "pointer" }}>
              Next Episode ⏭️
            </button>
          </div>
        </div>
        
        {/* Section 2: Instant Gaming Zone & Chat */}
        <h2 style={{ color: "#fff", "border-left": "4px solid #45f3ff", "padding-left": "10px", margin: "20px 0" }}>
          🎮 Instant Gaming Zone & Live Community
        </h2>
        <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", "margin-bottom": "30px" }}>
          <div style={{ background: "#1f2833", "border-radius": "12px", padding: "15px" }}>
            <div style={{ position: "relative", "padding-bottom": "56.25%", height: 0, overflow: "hidden", "border-radius": "8px", background: "#000" }}>
              <iframe src="https://gamepix.com" allowfullscreen={true} scrolling="no" style={{ position: "absolute", top: 0, left: 0, width: 100 + "%", height: 100 + "%", border: "none" }}></iframe>
            </div>
          </div>
          <div style={{ background: "#1f2833", "border-radius": "12px", padding: "15px" }}>
            <h3 style={{ "margin-top": 0, color: "#fff" }}>💬 Live Otaku Chat</h3>
            <iframe src="https://minnit.chat" style={{ width: "100%", height: "250px", border: "none" }} allowTransparency={true}></iframe>
          </div>
        </div>

        {/* Section 3: Trending Anime List */}
        <h2 style={{ color: "#fff", "border-left": "4px solid #45f3ff", "padding-left": "10px", margin: "20px 0" }}>
          🔥 Click an Anime to Start Free Streaming
        </h2>
        <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(180px, 1fr))", gap: "20px" }}>
          {animeList().length === 0 ? (
            <p style={{ "text-align": "center" }}>Fetching global anime directory...</p>
          ) : (
            animeList().map((anime, index) => (
              <div onClick={() => handleAnimeClick(anime, index)} style={{ background: "#1f2833", "border-radius": "8px", overflow: "hidden", "text-align": "center", "padding-bottom": "10px", cursor: "pointer", transition: "transform 0.3s" }}>
                <img src={anime.images.jpg.image_url} alt={anime.title} style={{ width: "100%", height: "250px", "object-fit": "cover" }} />
                <h3 style={{ "font-size": "14px", margin: "10px 5px", color: "#fff", height: "40px", overflow: "hidden" }}>{anime.title_english || anime.title}</h3>
                <p style={{ "font-size": "12px", color: "#ffcc00", margin: "0 0 5px 0" }}>⭐ Score: {anime.score || 'N/A'}</p>
                <button style={{ background: "#45f3ff", border: "none", padding: "5px 10px", "border-radius": "4px", "font-weight": "bold", "font-size": "11px" }}>▶️ Stream Now</button>
              </div>
            ))
          )}
        </div>

        {/* Dynamic Infinite Scroll Containers */}
        {dynamicContent().map((item) => (
          <div style={{ background: "#1f2833", padding: "20px", "border-radius": "12px", "margin-top": "30px", "text-align": "center", border: "1px dashed #45f3ff" }}>
            <h3 style={{ color: "#fff", "margin-top": 0 }}>{item.title}</h3>
            <div style={{ position: "relative", "padding-bottom": "56.25%", height: 0, overflow: "hidden", "border-radius": "8px" }}>
              <iframe src={item.url} frameborder="0" allowfullscreen={true} scrolling="no" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}></iframe>
            </div>
          </div>
        ))}

        <div style={{ "text-align": "center", padding: "20px", color: "#45f3ff", "font-weight": "bold", "margin-top": "40px" }}>
          ⌛ Keep scrolling to explore endless updates...
        </div>

      </div>
    </div>
  );
}
