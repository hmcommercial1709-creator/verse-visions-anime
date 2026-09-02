import { createSignal, onMount } from "solid-js";

export default function Home() {
  const [currentEpisode, setCurrentEpisode] = createSignal(1);
  const [currentStreamUrl, setCurrentStreamUrl] = createSignal("https://www.youtube.com/embed/jfKfPfyJRdk");
  const [currentTitle, setCurrentTitle] = createSignal("Global Ultimate Anime & Gaming Stream Hub");
  const [animeList, setAnimeList] = createSignal<any[]>([]);
  const [dynamicFeed, setDynamicFeed] = createSignal<any[]>([]);
  const [scrollCount, setScrollCount] = createSignal(1);

  onMount(async () => {
    try {
      const response = await fetch('https://api.jikan.moe/v4/top/anime');
      const data = await response.json();
      if (data && data.data) {
        setAnimeList(data.data);
      }
    } catch (error) {
      console.error('Error synchronizing global anime stream network:', error);
    }

    window.addEventListener('scroll', () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 600) {
        setScrollCount((prev) => prev + 1);
        injectNextGlobalFeed();
      }
    });
  });

  const handleAnimeClick = (anime: any) => {
    setCurrentStreamUrl("https://www.youtube.com/embed/jfKfPfyJRdk");
    setCurrentTitle(anime.title_english || anime.title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changeEpisode = (direction: number) => {
    let nextEp = currentEpisode() + direction;
    if (nextEp < 1) nextEp = 1;
    setCurrentEpisode(nextEp);
  };

  const injectNextGlobalFeed = () => {
    const typeIndex = scrollCount() % 3;
    let newFeedItem;

    if (typeIndex === 0) {
      newFeedItem = {
        id: Date.now(),
        title: 'Next-Gen Cloud Gaming Arcade: Play Instantly Without Downloads',
        url: 'https://gamepix.com'
      };
    } else if (typeIndex === 1) {
      newFeedItem = {
        id: Date.now(),
        title: 'Live Worldwide Otaku & Gaming Esport Championship Broadcast 24/7',
        url: 'https://www.youtube.com/embed/5qap5aO4i9A'
      };
    } else {
      newFeedItem = {
        id: Date.now(),
        title: 'Exclusive Unblocked HD Anime Stream - Trending Worldwide',
        url: 'https://www.youtube.com/embed/jfKfPfyJRdk'
      };
    }

    setDynamicFeed((prev) => [...prev, newFeedItem]);
  };

  return (
    <main style={{ "background-color": "#060709", color: "#e0e0e0", "font-family": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", "min-height": "100vh", padding: "0 0 50px 0", display: "block", width: "100%" }}>
      
      <div style={{ display: "none" }}>
        <h1>GameCastle.store - Watch Free Anime Online & Play Instant Cloud HTML5 Games</h1>
        <h2>World's #1 Free Anime Streaming Hub, HD Subbed & Dubbed Episodes, Unblocked Browser Games, Live Otaku Community</h2>
        <p>Welcome to GameCastle.store, the absolute ultimate global platform to watch trending anime online in HD, stream Naruto, One Piece, Attack on Titan, Jujutsu Kaisen, Solo Leveling, Demon Slayer, Bleach, Dragon Ball, and play free unblocked browser games instantly without downloads. Experience lightning-fast global edge servers, zero buffering, live chatrooms, and 24/7 non-stop entertainment.</p>
        <h3>Top Search Keywords: Free anime streaming, watch anime online English sub dubbed, unblocked games HTML5, GameCastle store, best anime website 2026.</h3>
      </div>

      <header style={{ background: "rgba(11, 12, 16, 0.95)", "backdrop-filter": "blur(10px)", padding: "12px 25px", "text-align": "center", "border-bottom": "2px solid #45f3ff", position: "sticky", top: 0, "z-index": 9999, display: "flex", "justify-content": "space-between", "align-items": "center", "box-shadow": "0 4px 20px rgba(69, 243, 255, 0.15)" }}>
        <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
          <span style={{ "font-size": "22px" }}>🏰</span>
          <h1 style={{ margin: 0, color: "#fff", "font-size": "20px", "letter-spacing": "0.5px" }}>GameCastle <span style={{ color: "#45f3ff" }}>• Global Universe</span></h1>
        </div>
        <div style={{ background: "rgba(69, 243, 255, 0.1)", color: "#45f3ff", padding: "5px 12px", "border-radius": "20px", "font-size": "11px", "font-weight": "bold", border: "1px solid #45f3ff" }}>
          GLOBAL RANK #1 LIVE
        </div>
      </header>

      <div style={{ "max-width": "1300px", margin: "25px auto", padding: "0 15px" }}>
        
        <section>
          <div style={{ display: "flex", "justify-content": "space-between", "align-items": "center", margin: "20px 0 15px 0" }}>
            <h2 style={{ color: "#fff", "border-left": "4px solid #45f3ff", "padding-left": "12px", margin: 0, "font-size": "19px" }}>
              Castle Cinema - Ultra HD Worldwide Stream
            </h2>
            <span style={{ color: "#45f3ff", "font-size": "12px", "font-weight": "bold" }}>LIVE SERVERS ONLINE</span>
          </div>

          <div style={{ background: "#1f2833", "border-radius": "14px", padding: "20px", "margin-bottom": "35px", "box-shadow": "0 10px 30px rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ position: "relative", "padding-bottom": "56.25%", height: 0, overflow: "hidden", "border-radius": "10px", background: "#000" }}>
              <iframe src={currentStreamUrl()} allowfullscreen={true} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}></iframe>
            </div>
            
            <div style={{ "margin-top": "18px", display: "flex", gap: "12px", "justify-content": "center", "align-items": "center", "flex-wrap": "wrap" }}>
              <button onClick={() => changeEpisode(-1)} style={{ background: "#45f3ff", color: "#0b0c10", border: "none", padding: "11px 22px", "border-radius": "6px", "font-weight": "bold", cursor: "pointer", transition: "transform 0.2s", "box-shadow": "0 4px 12px rgba(69,243,255,0.3)" }}>
                Previous Episode
              </button>
              <div style={{ "background": "#0b0c10", padding: "10px 20px", "border-radius": "6px", border: "1px solid #2c353d", "text-align": "center" }}>
                <span style={{ "font-weight": "bold", color: "#fff", "font-size": "14px" }}>
                  {currentTitle()} <span style={{ color: "#45f3ff" }}>(Ep: {currentEpisode()})</span>
                </span>
              </div>
              <button onClick={() => changeEpisode(1)} style={{ background: "#45f3ff", color: "#0b0c10", border: "none", padding: "11px 22px", "border-radius": "6px", "font-weight": "bold", cursor: "pointer", transition: "transform 0.2s", "box-shadow": "0 4px 12px rgba(69,243,255,0.3)" }}>
                Next Episode
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ color: "#fff", "border-left": "4px solid #45f3ff", "padding-left": "12px", margin: "25px 0 15px 0", "font-size": "19px" }}>
            Instant Cloud Gaming Arcade - Zero Loading Times
          </h2>
          <div style={{ background: "#1f2833", "border-radius": "14px", padding: "15px", "margin-bottom": "35px", "box-shadow": "0 10px 30px rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ position: "relative", "padding-bottom": "50%", height: 0, overflow: "hidden", "border-radius": "10px", background: "#000" }}>
              <iframe src="https://gamepix.com" allowfullscreen={true} scrolling="no" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}></iframe>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ color: "#fff", "border-left": "4px solid #45f3ff", "padding-left": "12px", margin: "25px 0 15px 0", "font-size": "19px" }}>
            Trending Worldwide Anime Directory - Click to Launch HD Stream
          </h2>
          <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(190px, 1fr))", gap: "20px" }}>
            {animeList().length === 0 ? (
              <div style={{ "grid-column": "1 / -1", "text-align": "center", padding: "40px", color: "#45f3ff", "font-weight": "bold" }}>
                Synchronizing global cloud database and high-speed streaming links...
              </div>
            ) : (
              animeList().map((anime) => (
                <div onClick={() => handleAnimeClick(anime)} style={{ background: "#1f2833", "border-radius": "10px", overflow: "hidden", "text-align": "center", "padding-bottom": "12px", cursor: "pointer", transition: "transform 0.25s ease, box-shadow 0.25s ease", border: "1px solid rgba(255,255,255,0.04)", "box-shadow": "0 5px 15px rgba(0,0,0,0.4)" }}
                     onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(69,243,255,0.2)"; }}
                     onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.4)"; }}>
                  <img src={anime.images.jpg.image_url} alt={anime.title} style={{ width: "100%", height: "260px", "object-fit": "cover" }} />
                  <h3 style={{ "font-size": "14px", margin: "12px 8px 6px 8px", color: "#fff", height: "40px", overflow: "hidden", "text-overflow": "ellipsis", display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical" }}>
                    {anime.title_english || anime.title}
                  </h3>
                  <p style={{ "font-size": "12px", color: "#ffcc00", margin: "0 0 10px 0", "font-weight": "bold" }}>Global Score: {anime.score || 'N/A'}</p>
                  <button style={{ background: "#45f3ff", color: "#0b0c10", border: "none", padding: "6px 14px", "border-radius": "5px", "font-weight": "bold", "font-size": "11px", cursor: "pointer" }}>
                    Stream Now
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {dynamicFeed().map((item) => (
          <section style={{ "margin-top": "35px" }}>
            <div style={{ background: "#1f2833", padding: "20px", "border-radius": "14px", "text-align": "center", border: "1px dashed #45f3ff", "box-shadow": "0 10px 30px rgba(0,0,0,0.6)" }}>
              <h3 style={{ color: "#fff", "margin-top": 0, "font-size": "17px", "margin-bottom": "15px" }}>{item.title}</h3>
              <div style={{ position: "relative", "padding-bottom": "56.25%", height: 0, overflow: "hidden", "border-radius": "10px", background: "#000" }}>
                <iframe src={item.url} allowfullscreen={true} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}></iframe>
              </div>
            </div>
          </section>
        ))}

        <div style={{ "text-align": "center", padding: "40px", color: "#45f3ff", "font-weight": "bold", "margin-top": "30px", "font-size": "14px", "letter-spacing": "0.5px" }}>
          Keep scrolling down... Infinite global content is loading automatically for you.
        </div>

      </div>
    </main>
  );
}
