"use client";

import { useRef, useState, useEffect } from "react";
import { Group, PointLight } from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { ParticleSystem } from "@/game/effects/ParticleSystem";
import { usePlantInteraction } from "./PlantInteraction";
import { useGameState } from "@/game/state/GameState";

export type BasePlantProps = {
  id: string;
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
    plantRef: React.RefObject<Group | null>;
    hoveredPlantId: string | null;
    id?: string;
    growthStage: number;
  }) => React.ReactNode;
};

export function BasePlant({
  id,
  position = [0, 0, 0],
  growthStage = 0,
  config,
  renderPlantModel,
}: BasePlantProps) {
  const plantRef = useRef<Group>(null);
  const lightRef = useRef<PointLight>(null);
  const [isWatering, setIsWatering] = useState(false);
  const [isHarvestHovered, setIsHarvestHovered] = useState(false);
  const { hoveredPlantId, setHoveredPlantId } = usePlantInteraction();
  const { harvestPlant } = useGameState();

  // Debug log for growth stage
  useEffect(() => {
    console.log(`Plant ${id} state:`, {
      growthStage,
      isFullyGrown: growthStage >= 1,
      position,
      config,
    });
  }, [id, growthStage, position, config]);

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

  const handleHarvest = () => {
    console.log("Harvest clicked:", {
      id,
      growthStage,
      isFullyGrown: growthStage >= 1,
      harvestFunctionExists: !!harvestPlant,
    });
    if (growthStage >= 1) {
      console.log("Calling harvestPlant with id:", id);
      harvestPlant(id);
    } else {
      console.log("Plant not ready for harvest, growth stage:", growthStage);
    }
  };

  const baseScale = 0.8; // Base scale for the plant
  const flowerScale = 0.3 + growthStage * 0.7; // Scale for flower parts
  const stemHeight = 0.4 + growthStage * 0.8; // Stem grows from 0.4 to 1.2 units
  const hitboxSize = config.hitboxSize || 0.4;

  return (
    <group position={position} scale={baseScale}>
      {/* Invisible hitbox for better interaction */}
      <mesh
        position={[0, stemHeight * 1.2, 0]}
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

      {/* Growth completion indicator */}
      {growthStage >= 1 && (
        <>
          {/* Wheat emoji chat bubble */}
          <Html
            position={[0, stemHeight + 0.8, 0]}
            center
            distanceFactor={8}
            style={{
              background: isHarvestHovered
                ? "rgba(255, 255, 255, 1)"
                : "rgba(255, 255, 255, 0.9)",
              padding: "8px 12px",
              borderRadius: "16px",
              border: "3px solid rgba(0, 0, 0, 0.8)",
              fontSize: "32px",
              cursor: "pointer",
              userSelect: "none",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              transform: isHarvestHovered ? "scale(1.1)" : "scale(1)",
              transition: "all 0.2s ease-out",
              pointerEvents: "auto",
            }}
            onPointerEnter={() => setIsHarvestHovered(true)}
            onPointerLeave={() => setIsHarvestHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              console.log("Harvest HTML element clicked");
              handleHarvest();
            }}
          >
            <div
              style={{ pointerEvents: "auto" }}
              onClick={(e) => {
                e.stopPropagation();
                console.log("Inner div clicked");
                handleHarvest();
              }}
            >
              🌾
            </div>
          </Html>

          {/* Sparkle particles */}
          <ParticleSystem
            position={[0, stemHeight + 0.6, 0]}
            color="#ffffff"
            count={5}
            spread={0.3}
            lifetime={1}
            size={0.03}
            active={true}
          />

          {/* Glow light for the emoji */}
          <pointLight
            position={[0, stemHeight + 0.8, 0]}
            distance={1.5}
            intensity={isHarvestHovered ? 3 : 2}
            color="#ffffff"
          />
        </>
      )}

      {/* Water particles */}
      <ParticleSystem
        position={[0, stemHeight * 1.5, 0]}
        color="#7ad7ff"
        count={15}
        spread={0.3}
        lifetime={0.8}
        size={0.03}
        active={isWatering && hoveredPlantId === id}
      />

      <group ref={plantRef}>
        {/* Stem */}
        <mesh position={[0, stemHeight / 2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, stemHeight, 8]} />
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

        {/* Plant-specific model with growth scaling */}
        <group position={[0, stemHeight, 0]} scale={flowerScale}>
          {renderPlantModel({
            plantRef,
            hoveredPlantId,
            id,
            growthStage,
          })}
        </group>

        {/* Glow light */}
        <pointLight
          ref={lightRef}
          position={[0, stemHeight, 0]}
          distance={2}
          intensity={1 * growthStage * (hoveredPlantId === id ? 2 : 1)}
          color={config.colors.primary}
        />
      </group>
    </group>
  );
}
