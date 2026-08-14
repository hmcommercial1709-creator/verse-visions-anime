// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            minSize: 20_000,
            groups: [
              { name: "content-data", test: /src[\\/](data|content)[\\/]/, priority: 50, maxSize: 250_000 },
              { name: "site-components", test: /src[\\/]components[\\/]/, priority: 45, maxSize: 250_000 },
              { name: "site-libraries", test: /src[\\/]lib[\\/]/, priority: 40, maxSize: 250_000 },
              { name: "react-vendor", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 30 },
              { name: "tanstack-vendor", test: /node_modules[\\/]@tanstack[\\/]/, priority: 25 },
              { name: "ui-vendor", test: /node_modules[\\/](@radix-ui|lucide-react|cmdk|sonner|vaul)[\\/]/, priority: 20 },
              { name: "vendor", test: /node_modules[\\/]/, priority: 10, maxSize: 300_000 },
            ],
          },
        },
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
