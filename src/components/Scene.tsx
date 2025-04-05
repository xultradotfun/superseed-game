"use client";

import dynamic from "next/dynamic";

// Dynamically import the Scene component to avoid SSR issues with Three.js
const Scene = dynamic(() => import("./game/GameScene"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="text-lg">Loading 3D Scene...</div>
    </div>
  ),
});

export default Scene;
