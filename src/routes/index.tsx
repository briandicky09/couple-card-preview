import { createFileRoute } from "@tanstack/react-router";
import { Game } from "@/components/game/Game";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Love Quest — A Pixel Romance Mini Game" },
      {
        name: "description",
        content:
          "A romantic pixel-aesthetic interactive love quiz. Play through cute scenes, answer questions, and unlock a heartfelt final letter.",
      },
      { property: "og:title", content: "Love Quest — A Pixel Romance Mini Game" },
      {
        property: "og:description",
        content: "Play a tiny pixel adventure made just for you ♡",
      },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Caveat:wght@500;700&display=swap",
      },
    ],
  }),
});

function Index() {
  return <Game />;
}
