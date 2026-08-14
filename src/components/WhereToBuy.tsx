import React from "react";

type Props = {
  productName: string;
  amazonLink?: string;
  crunchyrollLink?: string;
  playasiaLink?: string;
  entertainmentEarthLink?: string;
};

const storeButton = (
  name: string,
  url: string | undefined,
  accent: string
) => {
  const disabled = !url;

  return (
    <a
      href={url ?? "#"}
      target={url ? "_blank" : undefined}
      rel={url ? "noopener noreferrer" : undefined}
      aria-disabled={disabled}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-[#252540] hover:bg-[#e94560] transition-colors ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <span
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ background: accent }}
        aria-hidden
      ></span>

      <span className="flex-1 text-left text-sm text-white font-medium">
        {name} <span className="text-gray-300">Check Price →</span>
      </span>
    </a>
  );
};

const WhereToBuy: React.FC<Props> = ({
  productName,
  amazonLink,
  crunchyrollLink,
  playasiaLink,
  entertainmentEarthLink,
}) => {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-[#1a1a2e] border border-[#333] rounded-xl p-6">
        <header className="flex items-center gap-3 mb-3">
          <div className="text-2xl" aria-hidden>
            🛒
          </div>
          <h3 className="text-white font-bold text-lg">
            Where to Buy {productName}
          </h3>
        </header>

        <p className="text-gray-400 text-sm mb-4">Compare prices across trusted retailers</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {storeButton("Amazon", amazonLink, "#FF9900")}
          {storeButton("Crunchyroll Store", crunchyrollLink, "#F47521")}
          {storeButton("Play-Asia", playasiaLink, "#E53935")}
          {storeButton("Entertainment Earth", entertainmentEarthLink, "#2B7BB9")}
        </div>

        <div
          className="rounded-md p-3"
          style={{ background: "rgba(233,69,96,0.1)", borderLeft: "4px solid #e94560" }}
        >
          <p className="text-sm text-gray-200">💡 Tip: Prices change frequently. Check all stores for the best deal!</p>
        </div>

        <p className="text-gray-500 text-xs mt-3">GameCastle may earn a small commission from qualifying purchases at no extra cost to you.</p>
      </div>
    </div>
  );
};

export default WhereToBuy;
