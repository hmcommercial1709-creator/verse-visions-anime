import { createFileRoute } from "@tanstack/react-router";
import { HarborGame } from "@/components/harbor-game";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Harbor Island — Play Free | GameCastle" },
      { name: "description", content: "Build your island, upgrade your defenses and battle approaching fleets in GameCastle's free browser game." },
    ],
    links: [{ rel: "canonical", href: "https://gamecastle.store/play" }],
  }),
  component: () => <HarborGame />,
});
