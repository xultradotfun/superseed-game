"use client";

import { useEffect, useState } from "react";
import { useGameState } from "@/game/state/GameState";

export function usePlantInteraction() {
  const { waterPlant } = useGameState();
  const [hoveredPlantId, setHoveredPlantId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && hoveredPlantId) {
        waterPlant(hoveredPlantId);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [hoveredPlantId, waterPlant]);

  return {
    hoveredPlantId,
    setHoveredPlantId,
  };
}
