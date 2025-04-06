"use client";

import { GameCanvas } from "./GameCanvas";
import { GameMenu } from "./GameMenu";
import { SuperseedProgress } from "./SuperseedProgress";

export default function Scene() {
  return (
    <div className="h-screen w-full relative">
      <GameCanvas />
      <GameMenu />
      <SuperseedProgress />
    </div>
  );
}
