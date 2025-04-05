"use client";

import { useGameState } from "./GameStateContext";

function formatTime(time: number): string {
  const hours = Math.floor(time);
  const minutes = Math.floor((time % 1) * 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export function GameMenu() {
  const {
    timeSpeed,
    setTimeSpeed,
    isPaused,
    togglePause,
    currentTime,
    setCurrentTime,
  } = useGameState();

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };

  return (
    <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm rounded-lg p-4 text-white min-w-[240px]">
      <h2 className="text-lg font-semibold mb-3">Game Controls</h2>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm">Time of Day</label>
            <span className="text-sm font-mono">{formatTime(currentTime)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="24"
            step="0.1"
            value={currentTime}
            onChange={handleTimeChange}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/20 accent-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Time Speed</label>
          <div className="flex gap-2">
            {[0.5, 1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => setTimeSpeed(speed)}
                className={`px-3 py-1 rounded ${
                  timeSpeed === speed
                    ? "bg-white text-black"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        <div>
          <button
            onClick={togglePause}
            className={`w-full py-2 rounded ${
              isPaused
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>
    </div>
  );
}
