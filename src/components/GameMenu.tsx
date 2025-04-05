"use client";

import { useState } from "react";
import { useGameState, PlantType } from "@/game/state/GameState";
import { FaSeedling } from "react-icons/fa";

export function GameMenu() {
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const { inventory, selectedPlantType, setSelectedPlantType } = useGameState();

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
      <button
        onClick={() => setIsInventoryOpen(!isInventoryOpen)}
        className="bg-white/10 backdrop-blur-md p-3 rounded-lg text-white hover:bg-white/20 transition-colors pointer-events-auto"
      >
        <FaSeedling className="w-6 h-6" />
      </button>

      {isInventoryOpen && (
        <div className="absolute top-20 right-4 bg-white/10 backdrop-blur-md rounded-lg p-4 text-white pointer-events-auto shadow-lg min-w-[200px]">
          <h2 className="text-lg font-semibold mb-3">Inventory</h2>
          <div className="space-y-2">
            {Object.entries(inventory).map(([type, count]) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedPlantType(type as PlantType);
                  setIsInventoryOpen(false);
                }}
                className={`w-full flex justify-between items-center p-2 rounded ${
                  selectedPlantType === type
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
                disabled={count === 0}
              >
                <span>{type}</span>
                <span className="text-sm opacity-80">{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
