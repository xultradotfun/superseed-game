"use client";

import { useGameState, PlantType } from "@/game/state/GameState";
import { FaStore, FaLock, FaSeedling } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

type SeedDetails = {
  emoji: string;
  description: string;
  cost: {
    type: PlantType;
    amount: number;
  };
  unlockRequirement: string;
};

const SEED_DETAILS: Record<Exclude<PlantType, "LuminaBloom">, SeedDetails> = {
  EthereumEssence: {
    emoji: "💠",
    description: "A mystical plant with geometric patterns",
    cost: { type: "LuminaBloom", amount: 25 },
    unlockRequirement: "Have 15 Lumina Bloom seeds",
  },
  OPStackOrchid: {
    emoji: "🔴",
    description: "A powerful flower with floating segments",
    cost: { type: "EthereumEssence", amount: 20 },
    unlockRequirement: "Master Ethereum Essence cultivation",
  },
  DeFiDandelion: {
    emoji: "✨",
    description: "Releases magical glowing spores",
    cost: { type: "OPStackOrchid", amount: 15 },
    unlockRequirement: "Master OP Stack Orchid cultivation",
  },
};

type ShopProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function Shop({ isOpen, onToggle }: ShopProps) {
  const { gameProgress, purchaseSeed, inventory, canPurchaseSeed } =
    useGameState();

  const getItemState = (type: Exclude<PlantType, "LuminaBloom">) => {
    const details = SEED_DETAILS[type];
    const isUnlocked =
      type === "EthereumEssence"
        ? inventory.LuminaBloom >= 15
        : gameProgress.unlockedSeeds.includes(type);
    const canAfford = canPurchaseSeed(type);

    return {
      isUnlocked,
      canAfford,
      currentAmount: inventory[details.cost.type],
      requiredAmount: details.cost.amount,
    };
  };

  return (
    <button onClick={onToggle} className="relative group">
      <div className="bg-cyan-500/10 backdrop-blur-md p-3 rounded-xl text-cyan-300 hover:bg-cyan-500/20 transition-all border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
        <FaStore className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </div>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-3 bg-gradient-to-b from-cyan-950/80 to-slate-950/80 backdrop-blur-md rounded-2xl text-white shadow-2xl min-w-[400px] max-h-[calc(100vh-8rem)] overflow-y-auto border border-cyan-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-cyan-500/20 bg-cyan-500/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/5 flex items-center justify-center shadow-inner border border-cyan-400/20">
                <HiSparkles className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-2xl font-medium text-cyan-100">
                  Seed Shop
                </h2>
                <p className="text-sm text-cyan-300/60">
                  Discover unique plant varieties
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {(
              Object.entries(SEED_DETAILS) as [
                Exclude<PlantType, "LuminaBloom">,
                SeedDetails
              ][]
            ).map(([type, details]) => {
              const state = getItemState(type);

              return (
                <div
                  key={type}
                  className={`relative group rounded-lg transition-all duration-300 ${
                    state.isUnlocked
                      ? "hover:translate-y-[-1px] hover:shadow-lg hover:shadow-cyan-500/10"
                      : ""
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg border ${
                      state.isUnlocked
                        ? "bg-gradient-to-br from-cyan-950/40 to-slate-950/40 border-cyan-500/20"
                        : "bg-slate-950/40 border-white/5"
                    } ${state.isUnlocked ? "" : "opacity-60"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          state.isUnlocked
                            ? "bg-gradient-to-br from-cyan-500/20 to-cyan-400/5 border border-cyan-400/20 group-hover:scale-105 group-hover:border-cyan-400/40"
                            : "bg-slate-900/50 border border-white/10"
                        }`}
                      >
                        <span className="text-2xl filter drop-shadow-lg">
                          {details.emoji}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-medium text-base truncate text-cyan-100">
                            {type}
                          </h3>
                          {!state.isUnlocked && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-full bg-slate-900/50 border border-white/10 flex items-center justify-center">
                                <FaLock className="w-3 h-3 text-white/40" />
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-cyan-300/60 line-clamp-1 mt-0.5">
                          {details.description}
                        </p>
                        {!state.isUnlocked && (
                          <p className="text-[10px] text-white/40 mt-1">
                            {details.unlockRequirement}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2.5 border-t border-cyan-500/10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex items-center gap-1.5 bg-cyan-500/5 px-2 py-1 rounded-md border border-cyan-500/10">
                          <span className="text-base">
                            {details.cost.type === "LuminaBloom"
                              ? "🌟"
                              : SEED_DETAILS[
                                  details.cost.type as Exclude<
                                    PlantType,
                                    "LuminaBloom"
                                  >
                                ].emoji}
                          </span>
                          <span className="text-xs font-medium text-cyan-100 whitespace-nowrap">
                            {details.cost.amount} {details.cost.type}
                          </span>
                        </div>
                        <p
                          className={`text-[10px] ${
                            state.currentAmount >= details.cost.amount
                              ? "text-cyan-400"
                              : "text-cyan-300/40"
                          }`}
                        >
                          ({state.currentAmount}/{state.requiredAmount})
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          purchaseSeed(type);
                        }}
                        disabled={!state.canAfford}
                        className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium transition-all duration-300 text-xs ${
                          state.canAfford
                            ? "bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 hover:from-cyan-500/30 hover:to-cyan-400/30 border border-cyan-400/30 hover:border-cyan-400/50 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
                            : "bg-slate-900/30 border border-white/5 cursor-not-allowed"
                        }`}
                      >
                        <FaSeedling
                          className={`w-3 h-3 ${
                            state.canAfford ? "text-cyan-400" : "text-white/20"
                          }`}
                        />
                        <span
                          className={
                            state.canAfford ? "text-cyan-100" : "text-white/40"
                          }
                        >
                          Purchase
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </button>
  );
}
