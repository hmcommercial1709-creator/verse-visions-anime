import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Resources from "./pages/Resources";

// Very small client-side router to avoid adding an external routing dependency.
// It uses the History API and responds to link clicks that call navigate().
const usePath = () => {
  const [path, setPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to: string) => {
    if (to === window.location.pathname) return;
    window.history.pushState({}, "", to);
    setPath(to);
    // dispatch a popstate so any listeners pick it up
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return { path, navigate };
};

const App: React.FC = () => {
  const { path, navigate } = usePath();

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <Navbar navigate={navigate} currentPath={path} />

      <main>
        {path === "/resources" && <Resources />}
        {(path === "/" || path === "") && <Home />}
        {path !== "/" && path !== "" && path !== "/resources" && (
          <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold">Page not found</h2>
            <p className="mt-2 text-gray-300">No route matches {path} — try the navigation links.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
