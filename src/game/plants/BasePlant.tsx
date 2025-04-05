"use client";

import { useRef, useState } from "react";
import { Group, PointLight } from "three";
import { useFrame } from "@react-three/fiber";
import { ParticleSystem } from "@/game/effects/ParticleSystem";
import { usePlantInteraction } from "./PlantInteraction";

export type BasePlantProps = {
  id?: string;
  position?: [number, number, number];
  growthStage?: number;
  config: {
    name: string;
    colors: {
      primary: string;
      secondary: string;
      stem: string;
    };
    glowIntensity?: number;
    hitboxSize?: number;
  };
  renderPlantModel: (props: {
    plantRef: React.RefObject<Group>;
    hoveredPlantId: string | null;
    id?: string;
    growthStage: number;
  }) => React.ReactNode;
};

export function BasePlant({
  id,
  position = [0, 0, 0],
  growthStage = 1,
  config,
  renderPlantModel,
}: BasePlantProps) {
  const plantRef = useRef<Group>(null);
  const lightRef = useRef<PointLight>(null);
  const [isWatering, setIsWatering] = useState(false);
  const { hoveredPlantId, setHoveredPlantId } = usePlantInteraction();

  // Animation and effects
  useFrame((state) => {
    if (plantRef.current && lightRef.current) {
      // Gentle sway
      plantRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
      plantRef.current.rotation.z =
        Math.cos(state.clock.elapsedTime * 0.5) * 0.1;

      // Pulsing glow
      const pulseIntensity = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 1;
      lightRef.current.intensity =
        pulseIntensity *
        growthStage *
        (config.glowIntensity || 1) *
        (hoveredPlantId === id ? 2 : 1);

      // Update watering effect
      if (hoveredPlantId === id) {
        if (!isWatering) setIsWatering(true);
      } else if (isWatering) {
        setIsWatering(false);
      }
    }
  });

  const scale = 0.3 + growthStage * 0.7;
  const hitboxSize = config.hitboxSize || 0.4;

  return (
    <group position={position} scale={scale}>
      {/* Invisible hitbox for better interaction */}
      <mesh
        position={[0, 0.8, 0]}
        onPointerEnter={() => id && setHoveredPlantId(id)}
        onPointerLeave={() => hoveredPlantId === id && setHoveredPlantId(null)}
      >
        <cylinderGeometry args={[hitboxSize, hitboxSize, 1.6, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Selection indicator ring */}
      {hoveredPlantId === id && (
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[hitboxSize + 0.1, hitboxSize + 0.15, 32]} />
          <meshBasicMaterial
            color={config.colors.primary}
            transparent
            opacity={0.5}
          />
        </mesh>
      )}

      {/* Water particles */}
      <ParticleSystem
        position={[0, 1.5, 0]}
        color="#7ad7ff"
        count={15}
        spread={0.3}
        lifetime={0.8}
        size={0.03}
        active={isWatering && hoveredPlantId === id}
      />

      {/* Stem */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
        <meshStandardMaterial
          color={config.colors.stem}
          emissive={config.colors.stem}
          emissiveIntensity={hoveredPlantId === id ? 0.2 : 0}
        />
      </mesh>

      {/* Bulb */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color={config.colors.stem}
          emissive={config.colors.stem}
          emissiveIntensity={hoveredPlantId === id ? 0.2 : 0}
          roughness={0.6}
        />
      </mesh>

      {/* Plant-specific model */}
      {renderPlantModel({
        plantRef,
        hoveredPlantId,
        id,
        growthStage,
      })}

      {/* Glow light */}
      <pointLight
        ref={lightRef}
        distance={2}
        intensity={1 * growthStage * (hoveredPlantId === id ? 2 : 1)}
        color={config.colors.primary}
      />
    </group>
  );
}
