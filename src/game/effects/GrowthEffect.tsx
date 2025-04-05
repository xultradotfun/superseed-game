"use client";

import { useRef, useEffect, useState } from "react";
import { ParticleSystem } from "./ParticleSystem";
import { soundSystem } from "@/game/audio/SoundSystem";

type GrowthEffectProps = {
  position: [number, number, number];
  growthStage: number;
  previousGrowthStage?: number;
};

export function GrowthEffect({
  position,
  growthStage,
  previousGrowthStage = 0,
}: GrowthEffectProps) {
  const [isGrowing, setIsGrowing] = useState(false);
  const lastGrowthRef = useRef(growthStage);

  // Detect growth changes
  useEffect(() => {
    if (growthStage > lastGrowthRef.current) {
      setIsGrowing(true);
      soundSystem.playSound("grow");
      setTimeout(() => setIsGrowing(false), 2000); // Effect duration
    }
    lastGrowthRef.current = growthStage;
  }, [growthStage]);

  // Calculate vertical offset based on growth stage
  const heightOffset = 0.8 * growthStage; // Adjust particle height as plant grows

  return (
    <>
      {/* Growth sparkles */}
      <ParticleSystem
        position={[position[0], position[1] + heightOffset, position[2]]}
        color="#ffeb3b"
        count={20}
        spread={0.5}
        lifetime={1}
        size={0.02}
        active={isGrowing}
      />

      {/* Rising energy particles */}
      <ParticleSystem
        position={[position[0], position[1], position[2]]}
        color="#4caf50"
        count={15}
        spread={0.3}
        lifetime={1.5}
        size={0.015}
        active={isGrowing}
      />

      {/* Ambient glow particles */}
      <ParticleSystem
        position={[position[0], position[1] + heightOffset, position[2]]}
        color="#81c784"
        count={10}
        spread={0.4}
        lifetime={2}
        size={0.01}
        active={growthStage > previousGrowthStage}
      />
    </>
  );
}
