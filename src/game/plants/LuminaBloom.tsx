"use client";

import { useRef, useEffect, useState } from "react";
import { Mesh, PointLight } from "three";
import { useFrame } from "@react-three/fiber";
import { useGameState } from "@/game/state/GameState";
import { ParticleSystem } from "@/game/effects/ParticleSystem";

type LuminaBloomProps = {
  id?: string;
  position?: [number, number, number];
  growthStage?: number;
};

export function LuminaBloom({
  id,
  position = [0, 0, 0],
  growthStage = 1,
}: LuminaBloomProps) {
  const flowerRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);
  const { waterPlant } = useGameState();
  const [isWatering, setIsWatering] = useState(false);

  // Handle keyboard events for watering
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && id) {
        waterPlant(id);
        setIsWatering(true);
        setTimeout(() => setIsWatering(false), 1000); // Stop particles after 1 second
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [id, waterPlant]);

  // Gentle swaying animation and glow pulsing
  useFrame((state) => {
    if (flowerRef.current && lightRef.current) {
      // Gentle sway
      flowerRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
      flowerRef.current.rotation.z =
        Math.cos(state.clock.elapsedTime * 0.5) * 0.1;

      // Pulsing glow
      const pulseIntensity = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 1;
      lightRef.current.intensity = pulseIntensity * growthStage;
    }
  });

  // Scale based on growth stage
  const scale = 0.3 + growthStage * 0.7;

  return (
    <group position={position} scale={scale}>
      {/* Water particles */}
      <ParticleSystem
        position={[0, 1.5, 0]}
        color="#7ad7ff"
        count={15}
        spread={0.3}
        lifetime={0.8}
        size={0.03}
        active={isWatering}
      />

      {/* Stem */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
        <meshStandardMaterial color="#4a9c2d" />
      </mesh>

      {/* Flower */}
      <group ref={flowerRef} position={[0, 0.8, 0]}>
        {/* Petals */}
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#f0f7da"
            emissive="#f0f7da"
            emissiveIntensity={0.5 * growthStage}
            roughness={0.2}
          />
        </mesh>

        {/* Center */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#ffe566"
            emissive="#ffe566"
            emissiveIntensity={0.8 * growthStage}
            roughness={0.1}
          />
        </mesh>

        {/* Glow light */}
        <pointLight
          ref={lightRef}
          distance={2}
          intensity={1 * growthStage}
          color="#f0f7da"
        />
      </group>
    </group>
  );
}
