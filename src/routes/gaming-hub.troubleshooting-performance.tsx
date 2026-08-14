import { createFileRoute } from "@tanstack/react-router";
import {
  TroubleshootingPage,
  branchPaths,
  globalGamingFaqs,
} from "@/components/global-gaming-network";
import { faqSchema, gamingHubHead, howToSchema } from "@/lib/gaming-hub-seo";
const title =
  "Gaming Troubleshooting 2026: Fix Crashes, Lag, Low FPS, Stutter and Hardware Problems";
const description =
  "Diagnose gaming crashes, network lag, FPS drops, stutter, thermals, storage, controllers and code errors with safe GameCastle fixes.";
export const Route = createFileRoute("/gaming-hub/troubleshooting-performance")({
  head: () =>
    gamingHubHead({
      path: branchPaths.fixes,
      title,
      description,
      image: "/gaming-hub/global-gaming-network/troubleshooting.webp",
      schemas: [
        {
          "@type": "Article",
          headline: title,
          description,
          datePublished: "2026-08-14",
          dateModified: "2026-08-14",
          image: "https://gamecastle.store/gaming-hub/global-gaming-network/troubleshooting.webp",
          author: { "@type": "Organization", name: "GameCastle Anime Editorial" },
          publisher: { "@id": "https://gamecastle.store/#organization" },
        },
        howToSchema({
          name: "How to diagnose a gaming performance problem",
          description: "A safe symptom-to-evidence troubleshooting method.",
          steps: [
            { name: "Record the symptom", text: "Preserve errors and conditions." },
            {
              name: "Separate systems",
              text: "Test render, network, storage and input independently.",
            },
            { name: "Build a baseline", text: "Repeat the same scene at stock-safe settings." },
            { name: "Change one variable", text: "Measure the result." },
            { name: "Escalate safely", text: "Use official support or qualified repair." },
          ],
        }),
        faqSchema(globalGamingFaqs.slice(5, 11)),
      ],
    }),
  component: TroubleshootingPage,
});
