import React from "react";

type Props = {
  navigate: (to: string) => void;
  currentPath: string;
};

const Nav: React.FC<Props> = ({ navigate, currentPath }) => {
  return (
    <header className="bg-[#0f0f1a] border-b border-[#111]">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            className="text-white font-bold text-lg"
          >
            GameCastle
          </a>

          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPath === "/" ? "text-white" : "text-gray-300"
              }`}
            >
              Home
            </button>

            <button
              onClick={() => navigate("/resources")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPath === "/resources" ? "text-white" : "text-gray-300"
              }`}
            >
              Resources
            </button>

            <a
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                navigate("/blog");
              }}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-300"
            >
              Blog
            </a>
          </nav>
        </div>

        <div>
          <a
            href="/subscribe"
            onClick={(e) => {
              e.preventDefault();
              navigate("/subscribe");
            }}
            className="bg-[#e94560] text-white px-4 py-2 rounded-md font-bold text-sm"
          >
            Subscribe
          </a>
        </div>
      </div>
    </header>
  );
};

export default Nav;
