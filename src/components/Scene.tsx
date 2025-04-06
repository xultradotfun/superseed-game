"use client";

import { GameCanvas } from "./GameCanvas";
import { GameMenu } from "./GameMenu";
import { SuperseedProgress } from "./SuperseedProgress";

export default function Scene() {
  return (
    <div className="w-screen h-screen relative">
      <GameCanvas />

      {/* UI Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Bar */}
        <div className="flex justify-between items-start w-full p-4 gap-4">
          {/* Right Side */}
          <div className="flex-shrink-0">
            <GameMenu />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <SuperseedProgress />
        </div>
      </div>
    </div>
  );
}
