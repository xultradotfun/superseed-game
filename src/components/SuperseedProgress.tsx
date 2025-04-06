import { useGameState } from "@/game/state/GameState";
import { useState } from "react";
import { FaStar, FaLock, FaScroll, FaSeedling, FaTrophy } from "react-icons/fa";
import { ReactNode } from "react";
import Image from "next/image";

type Tab = "prophecy" | "achievements" | "mastery";

interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  prophecyPiece?: number;
}

export function SuperseedProgress() {
  const { gameProgress, canClaimSuperSeed, claimSuperSeed } = useGameState();
  const { superseedProgress, achievements, plantMasteries } = gameProgress;
  const [activeTab, setActiveTab] = useState<Tab>("prophecy");

  const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
    {
      id: "prophecy",
      label: "Prophecy",
      icon: <FaScroll className="w-4 h-4" />,
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: <FaTrophy className="w-4 h-4" />,
    },
    {
      id: "mastery",
      label: "Mastery",
      icon: <FaSeedling className="w-4 h-4" />,
    },
  ];

  // Filter achievements by type
  const prophecyAchievements = achievements.filter(
    (a) => a.prophecyPiece !== undefined
  );
  const regularAchievements = achievements.filter(
    (a) => a.prophecyPiece === undefined
  );

  const renderAchievementCard = (
    achievement: Achievement,
    showPiece?: boolean
  ) => (
    <div
      key={achievement.id}
      className={`relative p-4 rounded-lg border transition-all duration-500 ${
        achievement.completed
          ? "bg-gradient-to-br from-cyan-500/30 to-cyan-400/20 border-cyan-400/30 shadow-lg shadow-cyan-500/20 transform hover:-translate-y-0.5"
          : "bg-gradient-to-br from-cyan-950/40 to-slate-950/40 border-cyan-500/20"
      }`}
    >
      {/* Completion Effects */}
      {achievement.completed && (
        <>
          <div className="absolute inset-0 rounded-lg bg-cyan-400/10 animate-pulse" />
          <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-cyan-400/0 via-cyan-400/50 to-cyan-400/0 opacity-20 animate-[shimmer_2s_infinite]" />
        </>
      )}

      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {achievement.completed ? (
              <div className="relative">
                <FaStar className="w-5 h-5 text-cyan-400 animate-[pulse_2s_infinite]" />
                <div className="absolute inset-0 w-5 h-5 bg-cyan-400 rounded-full blur-sm opacity-50 animate-[pulse_2s_infinite]" />
              </div>
            ) : (
              <FaLock className="w-4 h-4 text-cyan-300/30" />
            )}
            <span className="font-medium text-cyan-100">
              {achievement.name}
            </span>
          </div>
          {showPiece && (
            <span className="text-sm text-cyan-300/60">
              Piece {(achievement.prophecyPiece ?? 0) + 1}
            </span>
          )}
          {!showPiece && (
            <span className="text-sm tabular-nums text-cyan-300/60">
              {achievement.progress}/{achievement.maxProgress}
            </span>
          )}
        </div>
        <p className="text-sm text-cyan-300/60 mb-3">
          {achievement.description}
        </p>
        <div className="h-1.5 bg-cyan-950/60 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-1000 ease-out"
            style={{
              width: `${
                (achievement.progress / achievement.maxProgress) * 100
              }%`,
              background: achievement.completed
                ? "linear-gradient(to right, rgb(34 211 238 / 0.6), rgb(34 211 238 / 0.8))"
                : "linear-gradient(to right, rgb(34 211 238 / 0.1), rgb(34 211 238 / 0.2))",
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed left-4 top-4 bg-gradient-to-b from-cyan-950/80 to-slate-950/80 rounded-2xl backdrop-blur-md w-[min(280px,calc(100vw-8rem))] border border-cyan-500/20 shadow-2xl pointer-events-auto">
      {/* Tabs */}
      <div className="flex border-b border-cyan-500/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 text-xs font-medium transition-all ${
              activeTab === tab.id
                ? "text-cyan-100 border-b-2 border-cyan-400"
                : "text-cyan-300/50 hover:text-cyan-300/70"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-3">
        {/* Prophecy Tab */}
        {activeTab === "prophecy" && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/5 flex items-center justify-center shadow-inner border border-cyan-400/20">
                <Image
                  src="/superlogo.png"
                  alt="Superseed Logo"
                  width={20}
                  height={20}
                  className="opacity-90"
                />
              </div>
              <div>
                <h2 className="text-lg font-medium text-cyan-100">
                  Sacred Superseed
                </h2>
                <p className="text-xs text-cyan-300/60">
                  {superseedProgress.prophecyPiecesFound} of{" "}
                  {superseedProgress.totalPieces} pieces found
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {prophecyAchievements
                .sort((a, b) => (a.prophecyPiece ?? 0) - (b.prophecyPiece ?? 0))
                .map((achievement) => renderAchievementCard(achievement, true))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/5 flex items-center justify-center shadow-inner border border-cyan-400/20">
                <FaTrophy className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-medium text-cyan-100">
                  Achievements
                </h2>
                <p className="text-xs sm:text-sm text-cyan-300/60">
                  {regularAchievements.filter((a) => a.completed).length} of{" "}
                  {regularAchievements.length} completed
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {regularAchievements.map((achievement) =>
                renderAchievementCard(achievement)
              )}
            </div>
          </div>
        )}

        {/* Mastery Tab */}
        {activeTab === "mastery" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/5 flex items-center justify-center shadow-inner border border-cyan-400/20">
                <FaSeedling className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-medium text-cyan-100">
                  Plant Mastery
                </h2>
                <p className="text-xs sm:text-sm text-cyan-300/60">
                  Master each type of plant
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(plantMasteries).map(([type, mastery]) => (
                <div
                  key={type}
                  className={`p-3 sm:p-4 rounded-lg border transition-all duration-500 ${
                    mastery.perfectGrowths >= 10
                      ? "bg-gradient-to-br from-cyan-500/30 to-cyan-400/20 border-cyan-400/30 shadow-lg shadow-cyan-500/20 transform hover:-translate-y-0.5"
                      : "bg-gradient-to-br from-cyan-950/40 to-slate-950/40 border-cyan-500/20"
                  }`}
                >
                  {mastery.perfectGrowths >= 10 && (
                    <>
                      <div className="absolute inset-0 rounded-lg bg-cyan-400/10 animate-pulse" />
                      <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-cyan-400/0 via-cyan-400/50 to-cyan-400/0 opacity-20 animate-[shimmer_2s_infinite]" />
                    </>
                  )}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-cyan-100">{type}</h3>
                        <div className="flex gap-4 mt-1.5 text-xs text-cyan-300/60">
                          <span>🌱 {mastery.plantsGrown} grown</span>
                          <span>✨ {mastery.perfectGrowths} perfect</span>
                          <span>🎯 {mastery.seedsCollected} seeds</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-1.5 bg-cyan-950/60 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.min(
                            (mastery.perfectGrowths / 10) * 100,
                            100
                          )}%`,
                          background:
                            mastery.perfectGrowths >= 10
                              ? "linear-gradient(to right, rgb(34 211 238 / 0.6), rgb(34 211 238 / 0.8))"
                              : "linear-gradient(to right, rgb(34 211 238 / 0.1), rgb(34 211 238 / 0.2))",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add SuperSeed claim section when all pieces are found */}
      {superseedProgress.prophecyPiecesFound ===
        superseedProgress.totalPieces && (
        <div className="p-3 sm:p-4 border-t border-cyan-500/20">
          <div className="text-center">
            {canClaimSuperSeed() ? (
              <>
                <div className="mb-3 sm:mb-4">
                  <div className="text-base sm:text-lg font-medium text-cyan-100 mb-2">
                    🎉 Sacred SuperSeed Unlocked! 🎉
                  </div>
                  <div className="text-xs sm:text-sm text-cyan-300/60">
                    You have collected all prophecy pieces and unlocked the
                    legendary Sacred SuperSeed!
                  </div>
                </div>
                <button
                  onClick={claimSuperSeed}
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  Claim Sacred SuperSeed
                </button>
              </>
            ) : (
              <div className="text-xs sm:text-sm text-cyan-300/60">
                You have already claimed the Sacred SuperSeed.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
