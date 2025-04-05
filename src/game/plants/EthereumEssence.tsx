"use client";

import { useRef, useEffect, useState } from "react";
import { PointLight, Group } from "three";
import { useFrame } from "@react-three/fiber";
import { useGameState } from "@/game/state/GameState";
import { ParticleSystem } from "@/game/effects/ParticleSystem";
import { GrowthEffect } from "@/game/effects/GrowthEffect";

type EthereumEssenceProps = {
  id?: string;
  position?: [number, number, number];
  growthStage?: number;
};

export function EthereumEssence({
  id,
  position = [0, 0, 0],
  growthStage = 1,
}: EthereumEssenceProps) {
  const plantRef = useRef<Group>(null);
  const lightRef = useRef<PointLight>(null);
  const { waterPlant } = useGameState();
  const [isWatering, setIsWatering] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [previousGrowthStage, setPreviousGrowthStage] = useState(growthStage);

  // Track growth stage changes
  useEffect(() => {
    setPreviousGrowthStage(growthStage);
  }, [growthStage]);

  // Handle keyboard events for watering
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && id) {
        waterPlant(id);
        setIsWatering(true);
        setTimeout(() => setIsWatering(false), 1000);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [id, waterPlant]);

  // Geometric pattern rotation and glow effect
  useFrame((state) => {
    if (plantRef.current && lightRef.current) {
      // Rotate geometric patterns
      plantRef.current.rotation.y = state.clock.elapsedTime * 0.2;

      // Pulsing glow effect
      const glowIntensity = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 1;
      lightRef.current.intensity = glowIntensity * growthStage * 2;

      // Toggle ethereal particles
      setIsGlowing(Math.sin(state.clock.elapsedTime * 2) > 0.7);
    }
  });

  const scale = 0.3 + growthStage * 0.7;

  return (
    <group position={position} scale={scale}>
      {/* Effects */}
      <GrowthEffect
        position={[0, 0, 0]}
        growthStage={growthStage}
        previousGrowthStage={previousGrowthStage}
      />
      <ParticleSystem
        position={[0, 1.5, 0]}
        color="#7ad7ff"
        count={15}
        spread={0.3}
        lifetime={0.8}
        size={0.03}
        active={isWatering}
      />
      <ParticleSystem
        position={[0, 0.8, 0]}
        color="#64c4ff"
        count={10}
        spread={0.5}
        lifetime={1.5}
        size={0.02}
        active={isGlowing}
      />

      {/* Plant Model */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
        <meshStandardMaterial color="#2d6a9c" />
      </mesh>

      <group ref={plantRef} position={[0, 0.8, 0]}>
        <mesh>
          <octahedronGeometry args={[0.2]} />
          <meshStandardMaterial
            color="#64c4ff"
            emissive="#64c4ff"
            emissiveIntensity={0.5 * growthStage}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * (Math.PI * 2)) / 3) * 0.3,
              0,
              Math.sin((i * (Math.PI * 2)) / 3) * 0.3,
            ]}
            scale={0.1}
          >
            <tetrahedronGeometry />
            <meshStandardMaterial
              color="#a0d8ff"
              emissive="#a0d8ff"
              emissiveIntensity={0.8 * growthStage}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
        ))}

        <pointLight
          ref={lightRef}
          distance={3}
          intensity={2 * growthStage}
          color="#64c4ff"
        />
      </group>
    </group>
  );
}
