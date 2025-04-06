import { useGameState } from "@/game/state/GameState";

export function SuperseedProgress() {
  const { gameProgress } = useGameState();
  const { superseedProgress, achievements, plantMasteries } = gameProgress;

  return (
    <div className="fixed left-4 top-4 bg-black/20 p-6 rounded-2xl backdrop-blur-md max-w-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <span className="text-2xl">✨</span>
        </div>
        <h2 className="text-xl font-medium text-white/90">Sacred Superseed</h2>
      </div>

      {/* Prophecy Progress */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-white/70 mb-3 uppercase tracking-wider">
          Prophecy Pieces
        </h3>
        <div className="flex gap-2">
          {Array.from({ length: superseedProgress.totalPieces }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                i < superseedProgress.prophecyPiecesFound
                  ? "bg-white/90"
                  : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Plant Mastery */}
      <div className="mb-6 space-y-4">
        <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider">
          Plant Mastery
        </h3>
        {Object.entries(plantMasteries).map(([type, mastery]) => (
          <div key={type} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/90">{type}</span>
              <span className="text-xs text-white/50">
                {mastery.plantsGrown}/10
              </span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/90 transition-all duration-500"
                style={{
                  width: `${Math.min((mastery.plantsGrown / 10) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Achievements */}
      <div>
        <h3 className="text-sm font-medium text-white/70 mb-3 uppercase tracking-wider">
          Recent Achievements
        </h3>
        <div className="space-y-3">
          {achievements
            .filter((a) => a.progress > 0)
            .slice(0, 3)
            .map((achievement) => (
              <div key={achievement.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-white/90">
                      {achievement.name}
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">
                      {achievement.description}
                    </div>
                  </div>
                  <span className="text-xs text-white/70 tabular-nums">
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/90 transition-all duration-500"
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
    </div>
  );
}
