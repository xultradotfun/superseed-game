"use client";

import { BasePlant, BasePlantProps } from "./BasePlant";

type OPStackOrchidProps = Omit<BasePlantProps, "config" | "renderPlantModel">;

const config = {
  name: "OPStackOrchid",
  colors: {
    primary: "#ff4081",
    secondary: "#ffffff",
    stem: "#9c2d4a",
  },
  glowIntensity: 1,
  hitboxSize: 0.4,
};

export function OPStackOrchid(props: OPStackOrchidProps) {
  return (
    <BasePlant
      {...props}
      config={config}
      renderPlantModel={({ plantRef, hoveredPlantId, id, growthStage }) => (
        <group ref={plantRef} position={[0, 1.2, 0]}>
          {/* Floating flower segments */}
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, i * 0.2, 0]}>
              <torusGeometry args={[0.15, 0.05, 16, 32]} />
              <meshStandardMaterial
                color={config.colors.primary}
                emissive={config.colors.primary}
                emissiveIntensity={
                  0.5 * growthStage * (hoveredPlantId === id ? 2 : 1)
                }
                metalness={0.3}
                roughness={0.7}
                transparent
                opacity={1}
              />
            </mesh>
          ))}

          {/* Center */}
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color={config.colors.secondary}
              emissive={config.colors.secondary}
              emissiveIntensity={
                0.8 * growthStage * (hoveredPlantId === id ? 2 : 1)
              }
              metalness={0.5}
              roughness={0.5}
              transparent
              opacity={1}
            />
          </mesh>
        </group>
      )}
    />
  );
}
