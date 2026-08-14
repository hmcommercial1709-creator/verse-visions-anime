import { createFileRoute } from "@tanstack/react-router";
import {
  ComparisonLabPage,
  branchPaths,
  globalGamingFaqs,
} from "@/components/global-gaming-network";
import { faqSchema, gamingHubHead, howToSchema } from "@/lib/gaming-hub-seo";
const title =
  "Game Comparisons & Performance 2026: RPG Meta, FPS, Graphics Settings and Player Choice";
const description =
  "Compare RPG systems, frame-rate modes, graphics trade-offs, player choices and gaming value in the GameCastle performance lab.";
export const Route = createFileRoute("/gaming-hub/game-comparisons-performance")({
  head: () =>
    gamingHubHead({
      path: branchPaths.comparisons,
      title,
      description,
      image: "/gaming-hub/global-gaming-network/comparisons.webp",
      schemas: [
        {
          "@type": "Article",
          headline: title,
          description,
          datePublished: "2026-08-14",
          dateModified: "2026-08-14",
          image: "https://gamecastle.store/gaming-hub/global-gaming-network/comparisons.webp",
          author: { "@type": "Organization", name: "GameCastle Anime Editorial" },
          publisher: { "@id": "https://gamecastle.store/#organization" },
        },
        howToSchema({
          name: "How to compare game performance fairly",
          description: "A controlled game and settings comparison.",
          steps: [
            { name: "Match versions", text: "Record game patch, platform and driver." },
            { name: "Match the scene", text: "Use the same save and camera path." },
            { name: "Warm the system", text: "Expose thermal and shader behavior." },
            { name: "Capture frame time", text: "Measure consistency beside average FPS." },
            { name: "Evaluate image cost", text: "Record quality and accessibility trade-offs." },
          ],
        }),
        faqSchema(globalGamingFaqs.slice(3, 8)),
      ],
    }),
  component: ComparisonLabPage,
});
