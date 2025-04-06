"use client";

import { useState } from "react";
import { useGameState, PlantType } from "@/game/state/GameState";
import { FaSeedling, FaTimes } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { Shop } from "./Shop";
import Image from "next/image";

// Import SEED_DETAILS from Shop
const SEED_DETAILS: Record<
  Exclude<PlantType, "LuminaBloom">,
  { emoji: string; isImage?: boolean }
> = {
  EthereumEssence: {
    emoji: "💠",
  },
  OPStackOrchid: {
    emoji: "🔴",
  },
  DeFiDandelion: {
    emoji: "✨",
  },
  SuperSeed: {
    emoji: "/superlogo.png",
    isImage: true,
  },
};

export function GameMenu() {
  const [isInventoryOpen, setIsInventoryOpen] = useState(true);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const { inventory, selectedPlantType, setSelectedPlantType } = useGameState();

  const handleInventoryToggle = () => {
    setIsInventoryOpen(!isInventoryOpen);
    if (!isInventoryOpen) {
      setIsShopOpen(false);
    }
  };

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
    if (!isShopOpen) {
      setIsInventoryOpen(false);
    }
  };

  const renderSeedIcon = (type: PlantType) => {
    if (type === "LuminaBloom")
      return <span className="text-2xl filter drop-shadow-lg">🌟</span>;

    const details = SEED_DETAILS[type];
    if (details.isImage) {
      return (
        <Image
          src={details.emoji}
          alt={`${type} icon`}
          width={32}
          height={32}
          className="opacity-90"
        />
      );
    }
    return (
      <span className="text-2xl filter drop-shadow-lg">{details.emoji}</span>
    );
  };

  return (
    <div className="pointer-events-none">
      {/* Inventory Button and Panel */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 pointer-events-auto">
        <div className="flex gap-2">
          <Shop isOpen={isShopOpen} onToggle={handleShopToggle} />
          <button onClick={handleInventoryToggle} className="relative group">
            <div className="bg-cyan-500/10 backdrop-blur-md p-3 rounded-xl text-cyan-300 hover:bg-cyan-500/20 transition-all border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
              <FaSeedling className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </div>
          </button>
        </div>

        {isInventoryOpen && (
          <div
            className="absolute top-full right-0 mt-3 bg-gradient-to-b from-cyan-950/80 to-slate-950/80 backdrop-blur-md rounded-2xl text-white shadow-2xl min-w-[360px] max-h-[calc(100vh-8rem)] overflow-y-auto border border-cyan-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-cyan-500/20 bg-cyan-500/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/5 flex items-center justify-center shadow-inner border border-cyan-400/20">
                  <HiSparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-medium text-cyan-100">
                    Seed Inventory
                  </h2>
                  <p className="text-sm text-cyan-300/60">
                    Plant and grow magical seeds
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {Object.entries(inventory).map(([type, count]) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedPlantType(type as PlantType);
                    setIsInventoryOpen(false);
                  }}
                  disabled={count === 0}
                  className={`relative group w-full rounded-lg transition-all duration-300 ${
                    count > 0
                      ? "hover:translate-y-[-1px] hover:shadow-lg hover:shadow-cyan-500/10"
                      : ""
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg border ${
                      count > 0
                        ? selectedPlantType === type
                          ? "bg-gradient-to-br from-cyan-500/30 to-cyan-400/20 border-cyan-400/30"
                          : "bg-gradient-to-br from-cyan-950/40 to-slate-950/40 border-cyan-500/20"
                        : "bg-slate-950/40 border-white/5 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          count > 0
                            ? "bg-gradient-to-br from-cyan-500/20 to-cyan-400/5 border border-cyan-400/20 group-hover:scale-105 group-hover:border-cyan-400/40"
                            : "bg-slate-900/50 border border-white/10"
                        }`}
                      >
                        {renderSeedIcon(type as PlantType)}
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-medium text-base text-cyan-100">
                          {type}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            count > 0
                              ? "bg-cyan-500/10 text-cyan-300"
                              : "bg-slate-900/50 text-white/40"
                          }`}
                        >
                          {count}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls Help */}
      <div className="absolute bottom-4 right-4 bg-gradient-to-b from-cyan-950/80 to-slate-950/80 backdrop-blur-md rounded-2xl text-white pointer-events-auto border border-cyan-500/20">
        <div className="p-6 border-b border-cyan-500/20 bg-cyan-500/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/5 flex items-center justify-center shadow-inner border border-cyan-400/20">
              <span className="text-2xl">🎮</span>
            </div>
            <div>
              <h2 className="text-2xl font-medium text-cyan-100">Controls</h2>
              <p className="text-sm text-cyan-300/60">
                Game controls and actions
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-400/5 border border-cyan-400/20 flex items-center justify-center">
                <span className="text-sm">{action.split(" ")[0]}</span>
              </div>
              <div>
                <div className="text-sm text-cyan-100">
                  {action.split(" ").slice(1).join(" ")}
                </div>
                <div className="text-xs text-cyan-300/60">{description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Planting Mode Indicator */}
      {selectedPlantType && (
        <div className="absolute top-20 right-4 bg-gradient-to-b from-cyan-950/80 to-slate-950/80 backdrop-blur-md rounded-2xl text-white pointer-events-auto border border-cyan-500/20">
          <div className="p-4">
            <div>
              <div className="text-xs text-cyan-300/60 uppercase tracking-wider mb-2">
                Currently Planting
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-400/5 border border-cyan-400/20 flex items-center justify-center">
                    {renderSeedIcon(selectedPlantType)}
                  </div>
                  <span className="font-medium text-cyan-100">
                    {selectedPlantType}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPlantType(null)}
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-400/5 border border-cyan-400/20 flex items-center justify-center hover:bg-cyan-500/30 transition-all"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
