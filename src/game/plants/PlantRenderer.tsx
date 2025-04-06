"use client";

import { Plant } from "@/game/state/GameState";
import { LuminaBloomPlant } from "./LuminaBloomPlant";
import { EthereumEssencePlant } from "./EthereumEssencePlant";
import { OPStackOrchidPlant } from "./OPStackOrchidPlant";
import { DeFiDandelionPlant } from "./DeFiDandelionPlant";
import { SuperSeedPlant } from "./SuperSeedPlant";

export function PlantRenderer({ plant }: { plant: Plant }) {
  const { id, type, position, growthStage } = plant;

  switch (type) {
    case "LuminaBloom":
      return (
        <LuminaBloomPlant
          id={id}
          position={position}
          growthStage={growthStage}
        />
      );
    case "EthereumEssence":
      return (
        <EthereumEssencePlant
          id={id}
          position={position}
          growthStage={growthStage}
        />
      );
    case "OPStackOrchid":
      return (
        <OPStackOrchidPlant
          id={id}
          position={position}
          growthStage={growthStage}
        />
      );
    case "DeFiDandelion":
      return (
        <DeFiDandelionPlant
          id={id}
          position={position}
          growthStage={growthStage}
        />
      );
    case "SuperSeed":
      return (
        <SuperSeedPlant id={id} position={position} growthStage={growthStage} />
      );
    default:
      return null;
  }
}
