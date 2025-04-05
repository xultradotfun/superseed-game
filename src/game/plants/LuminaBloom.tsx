"use client";

import { BasePlant, BasePlantProps } from "./BasePlant";

type LuminaBloomProps = Omit<BasePlantProps, "config" | "renderPlantModel">;

const config = {
  name: "LuminaBloom",
  colors: {
    primary: "#f0f7da",
    secondary: "#ffe566",
    stem: "#4a9c2d",
  },
  glowIntensity: 1,
  hitboxSize: 0.3,
};

export function LuminaBloom(props: LuminaBloomProps) {
  return (
    <BasePlant
      {...props}
      config={config}
      renderPlantModel={({ hoveredPlantId, id, growthStage }) => (
        <group>
          {/* Petals */}
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
              color={config.colors.primary}
              emissive={config.colors.primary}
              emissiveIntensity={
                0.5 * growthStage * (hoveredPlantId === id ? 2 : 1)
              }
              roughness={0.2}
              metalness={0.3}
            />
          </mesh>

          {/* Center */}
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color={config.colors.secondary}
              emissive={config.colors.secondary}
              emissiveIntensity={
                0.8 * growthStage * (hoveredPlantId === id ? 2 : 1)
              }
              roughness={0.1}
              metalness={0.4}
            />
          </mesh>
        </group>
      )}
    />
  );
}
