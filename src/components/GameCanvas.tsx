"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  BakeShadows,
  SoftShadows,
} from "@react-three/drei";
import { Suspense } from "react";
import { Island } from "@/game/environment/Island";
import { LuminaBloom } from "@/game/plants/LuminaBloom";
import { EthereumEssence } from "@/game/plants/EthereumEssence";
import { OPStackOrchid } from "@/game/plants/OPStackOrchid";
import { DeFiDandelion } from "@/game/plants/DeFiDandelion";
import { SuperSeedPlant } from "@/game/plants/SuperSeedPlant";
import { SceneLighting } from "@/game/environment/SceneLighting";
import { Sky } from "@/game/environment/Sky";
import { useGameState, Plant } from "@/game/state/GameState";
import { TinyHumans } from "@/game/environment/TinyHumans";

export function GameCanvas() {
  const { plants } = useGameState();

  const renderPlant = (plant: Plant) => {
    switch (plant.type) {
      case "LuminaBloom":
        return (
          <LuminaBloom
            key={plant.id}
            id={plant.id}
            position={plant.position}
            growthStage={plant.growthStage}
          />
        );
      case "EthereumEssence":
        return (
          <EthereumEssence
            key={plant.id}
            id={plant.id}
            position={plant.position}
            growthStage={plant.growthStage}
          />
        );
      case "OPStackOrchid":
        return (
          <OPStackOrchid
            key={plant.id}
            id={plant.id}
            position={plant.position}
            growthStage={plant.growthStage}
          />
        );
      case "DeFiDandelion":
        return (
          <DeFiDandelion
            key={plant.id}
            id={plant.id}
            position={plant.position}
            growthStage={plant.growthStage}
          />
        );
      case "SuperSeed":
        return (
          <SuperSeedPlant
            key={plant.id}
            id={plant.id}
            position={plant.position}
            growthStage={plant.growthStage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Canvas
      shadows="soft"
      gl={{
        antialias: true,
      }}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[8, 8, 8]} />

        {/* Sky and Atmosphere */}
        <Sky />
        <fog attach="fog" args={["#7CC6DE", 30, 60]} />

        {/* Enhanced shadows */}
        <SoftShadows size={40} samples={20} focus={0.5} />
        <BakeShadows />

        {/* Lighting and effects */}
        <SceneLighting />

        {/* Game Elements */}
        <Island />
        {Object.values(plants).map(renderPlant)}
        <TinyHumans />

        {/* Controls */}
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
  );
}
