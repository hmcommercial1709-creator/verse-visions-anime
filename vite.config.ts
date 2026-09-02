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
      preset: "cloudflare",
      cloudflare: { 
        nodeCompat: true, 
        deployConfig: true 
      }
    })] : []),
    react(),
  ],
  resolve: { dedupe: ["react", "react-dom", "@tanstack/react-router"] },
}));
