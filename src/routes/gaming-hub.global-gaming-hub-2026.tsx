import { createFileRoute } from "@tanstack/react-router";
import {
  GlobalGamingHub,
  globalGamingFaqs,
  globalHubDescription,
  globalHubPath,
  globalHubTitle,
} from "@/components/global-gaming-network";
import { faqSchema, gamingHubHead, howToSchema } from "@/lib/gaming-hub-seo";
export const Route = createFileRoute("/gaming-hub/global-gaming-hub-2026")({
  head: () =>
    gamingHubHead({
      path: globalHubPath,
      title: globalHubTitle,
      description: globalHubDescription,
      image: "/gaming-hub/global-gaming-network/hero.webp",
      schemas: [
        {
          "@type": "Article",
          headline: globalHubTitle,
          description: globalHubDescription,
          image: [
            "https://gamecastle.store/gaming-hub/global-gaming-network/hero.webp",
            "https://gamecastle.store/gaming-hub/global-gaming-network/release-radar.webp",
          ],
          datePublished: "2026-08-14",
          dateModified: "2026-08-14",
          author: { "@type": "Organization", name: "GameCastle Anime Editorial" },
          publisher: { "@id": "https://gamecastle.store/#organization" },
          mainEntityOfPage: `https://gamecastle.store${globalHubPath}`,
        },
        howToSchema({
          name: "How to research a game release, performance problem or endgame barrier",
          description: "A five-step evidence-first gaming research method.",
          steps: [
            {
              name: "Define the intent",
              text: "Identify release, comparison, technical or walkthrough intent.",
            },
            {
              name: "Verify current sources",
              text: "Check publisher, platform, patch and storefront details.",
            },
            {
              name: "Establish a baseline",
              text: "Record the version, platform, region and repeatable test.",
            },
            {
              name: "Change one variable",
              text: "Test one setting, route or build decision at a time.",
            },
            {
              name: "Escalate safely",
              text: "Use official support or a qualified technician when required.",
            },
          ],
        }),
        faqSchema(globalGamingFaqs),
      ],
    }),
  component: GlobalGamingHub,
});
