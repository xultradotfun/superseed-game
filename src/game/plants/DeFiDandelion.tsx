"use client";

import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { BasePlant, BasePlantProps } from "./BasePlant";

type DeFiDandelionProps = Omit<BasePlantProps, "config" | "renderPlantModel">;

const config = {
  name: "DeFiDandelion",
  colors: {
    primary: "#ffeb3b",
    secondary: "#ffffff",
    stem: "#4a9c2d",
  },
  glowIntensity: 1,
  hitboxSize: 0.4,
};

export function DeFiDandelion(props: DeFiDandelionProps) {
  const [isReleasing, setIsReleasing] = useState(false);

  // Custom animation frame for spore release
  useFrame((state) => {
    setIsReleasing(Math.sin(state.clock.elapsedTime * 0.5) > 0.9);
  });

  return (
    <BasePlant
      {...props}
      config={config}
      renderPlantModel={({ hoveredPlantId, id, growthStage }) => (
        <>
          <group>
            {/* Seed head */}
            <mesh>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial
                color={config.colors.primary}
                emissive={config.colors.primary}
                emissiveIntensity={
                  0.3 *
                  growthStage *
                  (hoveredPlantId === id ? 2 : 1) *
                  (isReleasing ? 1.5 : 1)
                }
                metalness={0.2}
                roughness={0.8}
              />
            </mesh>

            {/* Floating seeds */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              return (
                <mesh
                  key={i}
                  position={[
                    Math.cos(angle) * 0.25 * (isReleasing ? 1.1 : 1),
                    Math.sin(angle) * 0.1 * (isReleasing ? 1.2 : 1),
                    Math.sin(angle) * 0.25 * (isReleasing ? 1.1 : 1),
                  ]}
                >
                  <sphereGeometry args={[0.03, 8, 8]} />
                  <meshStandardMaterial
                    color={config.colors.secondary}
                    emissive={config.colors.secondary}
                    emissiveIntensity={
                      0.5 *
                      growthStage *
                      (hoveredPlantId === id ? 2 : 1) *
                      (isReleasing ? 1.3 : 1)
                    }
                    metalness={0.3}
                    roughness={0.6}
                  />
                </mesh>
              );
            })}
          </group>
        </>
      )}
    />
  );
}
