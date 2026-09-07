import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      // تعطيل الفحص الصارم للمسارات مؤقتاً لتجنب خطأ planning.js
    }),
    react(),
    nitro({ preset: "cloudflare_module" }),
  ],
  resolve: { 
    dedupe: [
      "react", 
      "react-dom", 
      "@tanstack/react-router", 
      "@tanstack/react-start",
      "@tanstack/router-core",
      "@tanstack/start"
    ] 
  },
  ssr: {
    noExternal: true,
  },
});
