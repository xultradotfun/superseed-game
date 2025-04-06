"use client";

import { useState } from "react";
import { useGameState, PlantType } from "@/game/state/GameState";
import { FaSeedling, FaTimes } from "react-icons/fa";

export function GameMenu() {
  const [isInventoryOpen, setIsInventoryOpen] = useState(true);
  const { inventory, selectedPlantType, setSelectedPlantType } = useGameState();

  return (
    <div className="pointer-events-none">
      {/* Inventory Button and Panel */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 pointer-events-auto">
        <button
          onClick={() => setIsInventoryOpen(!isInventoryOpen)}
          className="bg-black/20 backdrop-blur-md p-3 rounded-xl text-white/90 hover:bg-black/30 transition-all"
        >
          <FaSeedling className="w-6 h-6" />
        </button>

        {isInventoryOpen && (
          <div className="absolute top-16 right-0 bg-black/20 backdrop-blur-md rounded-2xl p-6 text-white shadow-xl min-w-[280px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <FaSeedling className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-medium text-white/90">
                Seed Inventory
              </h2>
            </div>
            <div className="space-y-2">
              {Object.entries(inventory).map(([type, count]) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedPlantType(type as PlantType);
                    setIsInventoryOpen(true);
                  }}
                  disabled={count === 0}
                  className={`w-full flex justify-between items-center p-3 rounded-xl transition-all ${
                    count === 0
                      ? "opacity-30 cursor-not-allowed"
                      : selectedPlantType === type
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10 text-white/90"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <span className="text-lg">🌱</span>
                    </div>
                    <span className="font-medium">{type}</span>
                  </div>
                  <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls Help */}
      <div className="absolute bottom-4 right-4 bg-black/20 backdrop-blur-md rounded-2xl p-6 text-white pointer-events-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <span className="text-2xl">🎮</span>
          </div>
          <h2 className="text-xl font-medium text-white/90">Controls</h2>
        </div>
        <div className="space-y-3">
          {[
            ["🖱️ Left Click + Drag", "Rotate Camera"],
            ["🖱️ Right Click + Drag", "Pan Camera"],
            ["🖱️ Scroll", "Zoom Camera"],
            ["⌨️ Space", "Water Plants"],
            ...(selectedPlantType
              ? [["🖱️ Click", `Plant ${selectedPlantType}`]]
              : []),
          ].map(([action, description]) => (
            <div key={action} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-sm">{action.split(" ")[0]}</span>
              </div>
              <div>
                <div className="text-sm text-white/90">
                  {action.split(" ").slice(1).join(" ")}
                </div>
                <div className="text-xs text-white/50">{description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Planting Mode Indicator */}
      {selectedPlantType && (
        <div className="absolute top-20 right-4 bg-black/20 backdrop-blur-md rounded-2xl p-6 text-white pointer-events-auto">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-sm text-white/50 uppercase tracking-wider">
                Currently Planting
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-lg">🌱</span>
                </div>
                <span className="font-medium text-white/90">
                  {selectedPlantType}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedPlantType(null)}
              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
