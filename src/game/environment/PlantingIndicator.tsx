"use client";

import { useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useGameState } from "@/game/state/GameState";
import { islandRef } from "./Island";
import { ParticleSystem } from "@/game/effects/ParticleSystem";

// Plant-specific colors
const PLANT_COLORS = {
  LuminaBloom: "#f0f7da",
  EthereumEssence: "#64c4ff",
  OPStackOrchid: "#ff4081",
  DeFiDandelion: "#ffeb3b",
  SuperSeed: "#4ff4ff",
};

export function PlantingIndicator() {
  const { selectedPlantType } = useGameState();
  const { raycaster, camera, pointer, clock } = useThree();
  const [hoverPosition, setHoverPosition] = useState<Vector3 | null>(null);
  const [isValidPosition, setIsValidPosition] = useState(true);

  // Get color based on selected plant type
  const color = useMemo(() => {
    if (!selectedPlantType) return "#4ff4ff";
    return PLANT_COLORS[selectedPlantType] || "#4ff4ff";
  }, [selectedPlantType]);

  // Update hover position on each frame
  useFrame(() => {
    if (!selectedPlantType || !islandRef.current) {
      setHoverPosition(null);
      return;
    }

    // Update the raycaster with current pointer position
    raycaster.setFromCamera(pointer, camera);

    // Check intersection with the island
    const intersects = raycaster.intersectObject(islandRef.current);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      const newPosition = new Vector3(point.x, 0, point.z);
      setHoverPosition(newPosition);

      // Check if position is within bounds (5 units from center)
      const distanceFromCenter = Math.sqrt(
        point.x * point.x + point.z * point.z
      );
      setIsValidPosition(distanceFromCenter <= 4.5);
    } else {
      setHoverPosition(null);
    }
  });

  if (!selectedPlantType || !hoverPosition) return null;

  const time = clock.getElapsedTime();
  const pulseScale = 1 + Math.sin(time * 2) * 0.05; // Subtle pulsing animation

  return (
    <group position={hoverPosition.toArray()}>
      {/* Ground highlight */}
      <mesh
        position={[0, 0.001, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={pulseScale}
      >
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Outer ring */}
      <mesh
        position={[0, 0.05, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={pulseScale}
      >
        <ringGeometry args={[0.45, 0.5, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>

      {/* Main selection ring */}
      <mesh position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.45, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isValidPosition ? 0.5 : 0.2}
        />
      </mesh>

      {/* Inner glow ring */}
      <mesh
        position={[0, 0.03, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={pulseScale}
      >
        <ringGeometry args={[0.2, 0.3, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>

      {/* Center dot */}
      <mesh
        position={[0, 0.04, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={pulseScale}
      >
        <circleGeometry args={[0.1, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isValidPosition ? 0.8 : 0.3}
        />
      </mesh>

      {/* Vertical beam */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.01, 0.03, 1, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isValidPosition ? 0.3 : 0.1}
        />
      </mesh>

      {/* Sparkle particles */}
      <ParticleSystem
        position={[0, 0.8, 0]}
        color={color}
        count={isValidPosition ? 15 : 5}
        spread={0.4}
        lifetime={1.2}
        size={0.04}
        active={true}
      />

      {/* Invalid position warning particles */}
      {!isValidPosition && (
        <ParticleSystem
          position={[0, 0.3, 0]}
          color="#ff4444"
          count={8}
          spread={0.5}
          lifetime={0.8}
          size={0.03}
          active={true}
        />
      )}
    </group>
  );
}
