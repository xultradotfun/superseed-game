"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const GameCanvas = dynamic(
  () => import("./GameCanvas").then((mod) => mod.GameCanvas),
  { ssr: false }
);

const GameMenu = dynamic(
  () => import("./GameMenu").then((mod) => mod.GameMenu),
  { ssr: false }
);

const SuperseedProgress = dynamic(
  () => import("./SuperseedProgress").then((mod) => mod.SuperseedProgress),
  { ssr: false }
);

export default function Scene() {
  return (
    <div className="h-screen w-full relative">
      <Suspense fallback={<div>Loading...</div>}>
        <GameCanvas />
        <GameMenu />
        <SuperseedProgress />
      </Suspense>
    </div>
  );
}
