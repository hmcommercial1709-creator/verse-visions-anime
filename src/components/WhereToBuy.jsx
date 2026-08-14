import React from "react";

const WhereToBuy = ({
  productName = "",
  amazonLink = "#",
  crunchyrollLink = "#",
  playasiaLink = "#",
  entertainmentEarthLink = "#",
}) => {
  const stores = [
    { name: "Amazon", link: amazonLink, color: "#FF9900" },
    { name: "Crunchyroll Store", link: crunchyrollLink, color: "#F47521" },
    { name: "Play-Asia", link: playasiaLink, color: "#E60012" },
    { name: "Entertainment Earth", link: entertainmentEarthLink, color: "#00AEEF" },
  ];

  return (
    <div className="bg-[#1a1a2e] border border-[#333] rounded-xl p-6 my-8 max-w-2xl">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">🛒</span>
        <h3 className="text-lg font-bold text-white">Where to Buy {productName}</h3>
      </div>
      <p className="text-gray-500 text-sm mb-4">Compare prices across trusted retailers</p>

      <div className="grid grid-cols-2 gap-3">
        {stores.map((store) => (
          <a
            key={store.name}
            href={store.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#252540] hover:bg-[#e94560] rounded-lg p-3 transition-all hover:-translate-y-0.5 group"
          >
            <div className="font-bold text-sm text-white group-hover:text-white">{store.name}</div>
            <div className="text-gray-500 text-xs group-hover:text-white/80">Check Price →</div>
          </a>
        ))}
      </div>

      <div className="mt-4 bg-[#e94560]/10 border-l-4 border-[#e94560] rounded-r-lg p-3">
        <p className="text-gray-300 text-xs">
          💡 Tip: Prices change frequently. Check all stores for the best deal!
        </p>
      </div>

      <p className="text-[#666] text-[10px] mt-3">
        GameCastle may earn a small commission from qualifying purchases at no extra cost to you.
      </p>
    </div>
  );
};

export default WhereToBuy;