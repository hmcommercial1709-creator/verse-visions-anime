import React from "react";

const resources = [
  {
    title: "Ultimate Anime Watchlist 2026",
    desc: "100 must-watch anime across 10 genres. Ratings, episode counts, and a beginner roadmap.",
    file: "/downloads/ultimate-anime-watchlist-2026.pdf",
    icon: "📖",
    badge: "PDF",
    size: "15 pages",
  },
  {
    title: "Anime Tracker Template",
    desc: "Track watched episodes, ratings, and plan your next binge. Works with Excel, Sheets, and Notion.",
    file: "/downloads/anime-tracker-template.csv",
    icon: "📊",
    badge: "CSV",
    size: "Customizable",
  },
  {
    title: "Top 50 Must-Watch Anime",
    desc: "Visual infographic of the highest-rated anime. Perfect for sharing on Pinterest or Reddit.",
    file: "/downloads/top-50-anime-infographic.png",
    icon: "🖼️",
    badge: "PNG",
    size: "High Resolution",
  },
];

const comingSoon = [
  { title: "Anime Budget Planner", desc: "Track your figure and merch spending" },
  { title: "Seasonal Anime Calendar", desc: "Never miss a premiere" },
  { title: "Character Tier List Maker", desc: "Build and share your rankings" },
];

const badgeColor = (badge) => {
  switch ((badge || "").toLowerCase()) {
    case "pdf":
      return "text-[#e94560] bg-[#e94560]/20";
    case "csv":
      return "text-[#00b894] bg-[#00b894]/20";
    case "png":
      return "text-[#0984e3] bg-[#0984e3]/20";
    default:
      return "text-gray-300 bg-gray-700/30";
  }
};

const isExternal = (href) => /^https?:\/\//i.test(href);

const Resources = () => {
  const handleNotify = (title) => {
    if (window && window.alert) {
      window.alert(`Thanks — we'll notify you when "${title}" is available.`);
    } else {
      console.log(`Notify requested for "${title}"`);
    }
  };

  return (
    <section className="min-h-screen bg-[#0f0f1a] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Free Anime Resources</h1>
          <p className="text-gray-400">Downloadable guides and tools for every anime fan</p>
        </header>

        <div role="list" className="grid md:grid-cols-3 gap-6">
          {resources.map((item) => {
            const key = item.file || item.title;
            const external = isExternal(item.file);
            return (
              <article
                role="listitem"
                key={key}
                className="bg-[#1a1a2e] border border-[#333] rounded-xl p-6 hover:border-[#e94560] transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl" aria-hidden>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{item.desc}</p>

                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                          badgeColor(item.badge)
                        }`}
                        aria-hidden
                      >
                        {item.badge}
                      </span>
                      <span className="text-gray-500 text-xs">{item.size}</span>
                      <span className="sr-only"> — Free resource</span>
                    </div>

                    <a
                      href={item.file}
                      download
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      aria-label={`Download ${item.title} (${item.badge})`}
                      className="inline-block w-full sm:w-auto bg-[#e94560] text-white text-center py-3 rounded-lg font-bold hover:scale-105 transform transition-transform focus:outline-none focus:ring-2 focus:ring-[#e94560]/60"
                    >
                      Download {item.badge}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <h2 className="text-2xl font-bold text-center mt-16 mb-8">🔒 Premium Tools Coming Soon</h2>
        <div className="grid md:grid-cols-3 gap-6 opacity-90">
          {comingSoon.map((item) => (
            <article
              key={item.title}
              className="bg-[#151525] border border-dashed border-[#444] rounded-xl p-6 text-center"
            >
              <div className="text-3xl mb-3" aria-hidden>
                🔒
              </div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
              <button
                onClick={() => handleNotify(item.title)}
                className="border border-[#e94560] text-[#e94560] px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560]/60"
                aria-label={`Notify me when ${item.title} is available`}
              >
                Notify Me
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resources;