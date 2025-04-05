"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import { Environment } from "./Environment";
import { GameStateProvider } from "./GameStateContext";
import { GameMenu } from "./GameMenu";
import { ACESFilmicToneMapping } from "three";

export default function GameScene() {
  return (
    <GameStateProvider>
      <div className="h-screen w-full relative">
        <Canvas
          shadows
          gl={{
            antialias: true,
            toneMapping: ACESFilmicToneMapping,
            alpha: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 2]} // Responsive pixel ratio
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[8, 8, 8]} />
            <Environment />
            <OrbitControls
              target={[0, 0, 0]}
              maxPolarAngle={Math.PI * 0.45}
              minDistance={5}
              maxDistance={20}
              enableDamping
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>
        <GameMenu />
      </div>
    </GameStateProvider>
  );
}
