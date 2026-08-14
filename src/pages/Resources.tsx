import React from "react";
import EmailSignup from "../components/EmailSignup";

type Resource = {
  id: string;
  title: string;
  desc: string;
  file: string;
  icon: string;
  iconLabel?: string;
  badge: string;
  size: string;
};

type ComingSoonItem = {
  id: string;
  title: string;
  desc: string;
};

const resources: Resource[] = [
  {
    id: "ultimate-anime-2026",
    title: "Ultimate Anime Watchlist 2026",
    desc: "100 must-watch anime across 10 genres. Ratings, episode counts, and a beginner roadmap.",
    file: "/downloads/ultimate-anime-watchlist-2026.pdf",
    icon: "📖",
    iconLabel: "book",
    badge: "PDF",
    size: "15 pages",
  },
  {
    id: "anime-tracker-template",
    title: "Anime Tracker Template",
    desc: "Track watched episodes, ratings, and plan your next binge. Works with Excel, Sheets, and Notion.",
    file: "/downloads/anime-tracker-template.csv",
    icon: "📊",
    iconLabel: "chart",
    badge: "CSV",
    size: "Customizable",
  },
  {
    id: "top-50-infographic",
    title: "Top 50 Must-Watch Anime",
    desc: "Visual infographic of the highest-rated anime. Perfect for sharing on Pinterest or Reddit.",
    file: "/downloads/top-50-anime-infographic.png",
    icon: "🖼️",
    iconLabel: "image",
    badge: "PNG",
    size: "High Resolution",
  },
];

const comingSoon: ComingSoonItem[] = [
  { id: "budget-planner", title: "Anime Budget Planner", desc: "Track your figure and merch spending" },
  { id: "seasonal-calendar", title: "Seasonal Anime Calendar", desc: "Never miss a premiere" },
  { id: "tier-list-maker", title: "Character Tier List Maker", desc: "Build and share your rankings" },
];

const ResourceCard: React.FC<{ item: Resource }> = ({ item }) => {
  return (
    <li className="bg-[#1a1a2e] border border-[#333] rounded-xl p-6 hover:border-[#e94560] transition-all focus-within:ring-2 focus-within:ring-[#e94560]/30">
      <div className="flex items-start">
        <div className="text-4xl mr-4" aria-hidden="true">
          {item.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{item.title}</h3>
          <p className="text-gray-400 text-sm mb-3">{item.desc}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span
          className="inline-block bg-[#e94560]/20 text-[#e94560] text-xs font-bold px-3 py-1 rounded-full"
          aria-label={`${item.badge} file type`}
        >
          FREE • {item.badge}
        </span>

        <span className="text-gray-400 text-xs">{item.size}</span>
      </div>

      <a
        href={item.file}
        download
        aria-label={`Download ${item.title} (${item.badge})`}
        className="mt-4 block w-full bg-[#e94560] text-white text-center py-3 rounded-lg font-bold hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e94560]"
      >
        Download {item.badge}
      </a>
    </li>
  );
};

const ComingSoonCard: React.FC<{ item: ComingSoonItem; onNotify: (id: string) => void }> = ({ item, onNotify }) => {
  return (
    <li className="bg-[#151525] border border-dashed border-[#444] rounded-xl p-6 text-center flex flex-col justify-between">
      <div>
        <div className="text-3xl mb-3" aria-hidden="true">
          🔒
        </div>
        <h3 className="font-bold mb-2">{item.title}</h3>
        <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
      </div>

      <button
        type="button"
        onClick={() => onNotify(item.id)}
        className="mt-2 border border-[#e94560] text-[#e94560] px-4 py-2 rounded-lg text-sm hover:bg-[#e94560]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e94560]"
        aria-label={`Notify me when ${item.title} is available`}
      >
        Notify Me
      </button>
    </li>
  );
};

type ResourcesProps = {
  onNotify?: (id: string) => void;
};

const Resources: React.FC<ResourcesProps> = ({ onNotify = (id: string) => console.log("notify for", id) }) => {
  return (
    <main className="min-h-screen bg-[#0f0f1a] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <header>
          <h1 className="text-4xl font-bold text-center mb-4">Free Anime Resources</h1>
          <p className="text-gray-400 text-center mb-12">Downloadable guides and tools for every anime fan</p>
        </header>

        <section aria-labelledby="free-resources">
          <h2 id="free-resources" className="sr-only">
            Free downloadable resources
          </h2>

          <ul className="grid md:grid-cols-3 gap-6 list-none p-0">
            {resources.map((item) => (
              <ResourceCard key={item.id} item={item} />
            ))}
          </ul>
        </section>

        <div className="mt-12">
          <EmailSignup />
        </div>

        <section aria-labelledby="premium-coming" className="mt-16">
          <h2 id="premium-coming" className="text-2xl font-bold text-center mt-0 mb-8">
            🔒 Premium Tools Coming Soon
          </h2>

          <ul className="grid md:grid-cols-3 gap-6 opacity-60 list-none p-0">
            {comingSoon.map((item) => (
              <ComingSoonCard key={item.id} item={item} onNotify={onNotify} />
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
};

export default Resources;
