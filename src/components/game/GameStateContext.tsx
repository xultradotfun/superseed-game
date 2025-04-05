"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface GameState {
  timeSpeed: number;
  isPaused: boolean;
  currentTime: number; // 0-24 hours
  setTimeSpeed: (speed: number) => void;
  setCurrentTime: (time: number) => void;
  togglePause: () => void;
}

const GameStateContext = createContext<GameState | null>(null);

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
}

interface GameStateProviderProps {
  children: ReactNode;
}

export function GameStateProvider({ children }: GameStateProviderProps) {
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(12); // Start at noon

  const togglePause = () => setIsPaused((prev) => !prev);

  return (
    <GameStateContext.Provider
      value={{
        timeSpeed,
        isPaused,
        currentTime,
        setTimeSpeed,
        setCurrentTime,
        togglePause,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}
