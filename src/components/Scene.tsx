"use client";

import { GameCanvas } from "./GameCanvas";
import { GameMenu } from "./GameMenu";

export default function Scene() {
  return (
    <div className="h-screen w-full relative">
      <GameCanvas />
      <GameMenu />
    </div>
  );
}
