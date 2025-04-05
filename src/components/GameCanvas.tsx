"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import { Suspense } from "react";
import { Island } from "@/game/environment/Island";
import { LuminaBloom } from "@/game/plants/LuminaBloom";
import { EthereumEssence } from "@/game/plants/EthereumEssence";
import { OPStackOrchid } from "@/game/plants/OPStackOrchid";
import { DeFiDandelion } from "@/game/plants/DeFiDandelion";
import { DayNightCycle } from "@/game/environment/DayNightCycle";
import { useGameState, Plant } from "@/game/state/GameState";

export function GameCanvas() {
  const { plants } = useGameState();

  const renderPlant = (plant: Plant) => {
    const position = plant.position;

    switch (plant.type) {
      case "LuminaBloom":
        return (
          <LuminaBloom
            key={plant.id}
            id={plant.id}
            position={position}
            growthStage={plant.growthStage}
          />
        );
      case "EthereumEssence":
        return (
          <EthereumEssence
            key={plant.id}
            id={plant.id}
            position={position}
            growthStage={plant.growthStage}
          />
        );
      case "OPStackOrchid":
        return (
          <OPStackOrchid
            key={plant.id}
            id={plant.id}
            position={position}
            growthStage={plant.growthStage}
          />
        );
      case "DeFiDandelion":
        return (
          <DeFiDandelion
            key={plant.id}
            id={plant.id}
            position={position}
            growthStage={plant.growthStage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Canvas shadows>
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[8, 8, 8]} />
        <DayNightCycle />

        {/* Environment */}
        <Environment preset="sunset" />
        <fog attach="fog" args={["#ffd4b9", 10, 50]} />

        {/* Game Elements */}
        <Island />
        {Object.values(plants).map(renderPlant)}

        {/* Controls */}
        <OrbitControls
          target={[0, 0, 0]}
          maxPolarAngle={Math.PI * 0.45}
          minDistance={5}
          maxDistance={20}
        />
      </Suspense>
    </Canvas>
  );
}
