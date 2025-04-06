"use client";

import { Plant } from "@/game/state/GameState";
import { LuminaBloom } from "./LuminaBloom";
import { EthereumEssence } from "./EthereumEssence";
import { OPStackOrchid } from "./OPStackOrchid";
import { DeFiDandelion } from "./DeFiDandelion";
import { SuperSeedPlant } from "./SuperSeedPlant";

export function PlantRenderer({ plant }: { plant: Plant }) {
  const { id, type, position, growthStage } = plant;

  switch (type) {
    case "LuminaBloom":
      return (
        <LuminaBloom id={id} position={position} growthStage={growthStage} />
      );
    case "EthereumEssence":
      return (
        <EthereumEssence
          id={id}
          position={position}
          growthStage={growthStage}
        />
      );
    case "OPStackOrchid":
      return (
        <OPStackOrchid id={id} position={position} growthStage={growthStage} />
      );
    case "DeFiDandelion":
      return (
        <DeFiDandelion id={id} position={position} growthStage={growthStage} />
      );
    case "SuperSeed":
      return (
        <SuperSeedPlant id={id} position={position} growthStage={growthStage} />
      );
    default:
      return null;
  }
}
