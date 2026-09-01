import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(), tsconfigPaths(),
    tanstackStart({ server: { entry: "server" } }),
    ...(command === "build" ? [nitro({
      preset: "cloudflare-module",
      cloudflare: { nodeCompat: true, deployConfig: true,
        wrangler: { name: "verse-visions-anime",
          routes: [
            { pattern: "gamecastle.store", custom_domain: true },
            { pattern: "www.gamecastle.store", custom_domain: true },
          ],
        },
      },
    })] : []),
    react(),
  ],
  resolve: { dedupe: ["react", "react-dom", "@tanstack/react-router"] },
}));
