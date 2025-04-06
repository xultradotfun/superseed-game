"use client";

import Scene from "@/components/Scene";
import { GameStateProvider } from "@/game/state/GameState";

export default function Home() {
  return (
    <main>
      <GameStateProvider>
        <Scene />
      </GameStateProvider>
    </main>
  );
}
