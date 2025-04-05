"use client";

import { useState } from "react";
import { useGameState, PlantType } from "@/game/state/GameState";
import { FaSeedling, FaTimes } from "react-icons/fa";

export function GameMenu() {
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const { inventory, selectedPlantType, setSelectedPlantType } = useGameState();

  return (
    <div className="pointer-events-none">
      {/* Top Bar */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 pointer-events-auto">
        <button
          onClick={() => setIsInventoryOpen(!isInventoryOpen)}
          className="bg-white/10 backdrop-blur-md p-3 rounded-lg text-white hover:bg-white/20 transition-colors"
        >
          <FaSeedling className="w-6 h-6" />
        </button>

        {isInventoryOpen && (
          <div className="absolute top-16 right-0 bg-white/10 backdrop-blur-md rounded-lg p-4 text-white shadow-lg min-w-[200px]">
            <h2 className="text-lg font-semibold mb-3">Seeds</h2>
            <div className="space-y-2">
              {Object.entries(inventory).map(([type, count]) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedPlantType(type as PlantType);
                    setIsInventoryOpen(true);
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

      {/* Controls Help */}
      <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md rounded-lg p-4 text-white pointer-events-auto">
        <h2 className="text-lg font-semibold mb-2">Controls</h2>
        <ul className="space-y-1 text-sm">
          <li>🖱️ Left Click + Drag: Rotate Camera</li>
          <li>🖱️ Right Click + Drag: Pan Camera</li>
          <li>🖱️ Scroll: Zoom Camera</li>
          <li>⌨️ Space: Water Plants</li>
          {selectedPlantType && <li>🖱️ Click: Plant {selectedPlantType}</li>}
        </ul>
      </div>

      {/* Planting Mode Indicator */}
      {selectedPlantType && (
        <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md rounded-lg p-4 text-white pointer-events-auto flex items-center gap-4">
          <div>
            <div className="text-sm opacity-80">Currently Planting</div>
            <div className="font-semibold">{selectedPlantType}</div>
          </div>
          <button
            onClick={() => setSelectedPlantType(null)}
            className="bg-white/10 p-2 rounded hover:bg-white/20 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
}
