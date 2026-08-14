import { createFileRoute } from "@tanstack/react-router";
import {
  ReleaseRadarPage,
  branchPaths,
  globalGamingFaqs,
} from "@/components/global-gaming-network";
import { faqSchema, gamingHubHead, howToSchema } from "@/lib/gaming-hub-seo";
const title =
  "Upcoming Games 2026–2027: Release Dates, Platforms, Pre-Orders & Global Launch Radar";
const description =
  "Track verified 2026 and 2027 game release dates, platforms, editions, pre-order safety and official launch windows with GameCastle.";
export const Route = createFileRoute("/gaming-hub/releases-2026-2027")({
  head: () =>
    gamingHubHead({
      path: branchPaths.releases,
      title,
      description,
      image: "/gaming-hub/global-gaming-network/release-radar.webp",
      schemas: [
        {
          "@type": "Article",
          headline: title,
          description,
          datePublished: "2026-08-14",
          dateModified: "2026-08-14",
          image: "https://gamecastle.store/gaming-hub/global-gaming-network/release-radar.webp",
          author: { "@type": "Organization", name: "GameCastle Anime Editorial" },
          publisher: { "@id": "https://gamecastle.store/#organization" },
        },
        howToSchema({
          name: "How to verify an upcoming game and pre-order",
          description: "A safe release and edition verification workflow.",
          steps: [
            { name: "Identify the exact game", text: "Record edition, platform and region." },
            { name: "Confirm the date", text: "Use the publisher or platform store." },
            { name: "Check platform scope", text: "Do not infer simultaneous launches." },
            { name: "Verify bonuses", text: "Read the selected seller's current terms." },
            { name: "Review cancellation", text: "Understand payment and refund rules." },
          ],
        }),
        faqSchema(globalGamingFaqs.slice(0, 4)),
      ],
    }),
  component: ReleaseRadarPage,
});
