import { useGameState } from "@/game/state/GameState";
import { useState } from "react";
import { FaStar, FaLock, FaScroll, FaSeedling, FaTrophy } from "react-icons/fa";
import { ReactNode } from "react";

type Tab = "prophecy" | "achievements" | "mastery";

export function SuperseedProgress() {
  const { gameProgress } = useGameState();
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

  return (
    <div className="fixed left-4 top-4 bg-black/20 rounded-2xl backdrop-blur-md w-[360px]">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-2 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "text-white border-b-2 border-white"
                : "text-white/50 hover:text-white/70"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Prophecy Tab */}
        {activeTab === "prophecy" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <h2 className="text-xl font-medium text-white/90">
                  Sacred Superseed
                </h2>
                <p className="text-sm text-white/50">
                  {superseedProgress.prophecyPiecesFound} of{" "}
                  {superseedProgress.totalPieces} pieces found
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {prophecyAchievements
                .sort((a, b) => (a.prophecyPiece ?? 0) - (b.prophecyPiece ?? 0))
                .map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl ${
                      achievement.completed ? "bg-white/20" : "bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {achievement.completed ? (
                          <FaStar className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <FaLock className="w-4 h-4 text-white/30" />
                        )}
                        <span className="font-medium text-white/90">
                          {achievement.name}
                        </span>
                      </div>
                      <span className="text-sm text-white/50">
                        Piece {(achievement.prophecyPiece ?? 0) + 1}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mb-3">
                      {achievement.description}
                    </p>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${
                            (achievement.progress / achievement.maxProgress) *
                            100
                          }%`,
                          backgroundColor: achievement.completed
                            ? "#fbbf24"
                            : "rgba(255,255,255,0.3)",
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <FaTrophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-white/90">
                  Achievements
                </h2>
                <p className="text-sm text-white/50">
                  {regularAchievements.filter((a) => a.completed).length} of{" "}
                  {regularAchievements.length} completed
                </p>
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {regularAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl ${
                    achievement.completed ? "bg-white/20" : "bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {achievement.completed ? (
                        <FaStar className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <FaLock className="w-4 h-4 text-white/30" />
                      )}
                      <span className="font-medium text-white/90">
                        {achievement.name}
                      </span>
                    </div>
                    <span className="text-sm tabular-nums text-white/50">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mb-3">
                    {achievement.description}
                  </p>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/30 transition-all duration-500"
                      style={{
                        width: `${
                          (achievement.progress / achievement.maxProgress) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mastery Tab */}
        {activeTab === "mastery" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <FaSeedling className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-white/90">
                  Plant Mastery
                </h2>
                <p className="text-sm text-white/50">
                  Master each type of plant
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {Object.entries(plantMasteries).map(([type, mastery]) => (
                <div key={type} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white/90">{type}</h3>
                      <div className="flex gap-4 mt-1 text-sm text-white/50">
                        <span>🌱 {mastery.plantsGrown} grown</span>
                        <span>✨ {mastery.perfectGrowths} perfect</span>
                        <span>🎯 {mastery.seedsCollected} seeds</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/30 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (mastery.perfectGrowths / 10) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
