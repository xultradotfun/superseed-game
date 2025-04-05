"use client";

import { BasePlant, BasePlantProps } from "./BasePlant";

type EthereumEssenceProps = Omit<BasePlantProps, "config" | "renderPlantModel">;

const config = {
  name: "EthereumEssence",
  colors: {
    primary: "#64c4ff",
    secondary: "#a0d8ff",
    stem: "#2d6a9c",
  },
  glowIntensity: 2,
  hitboxSize: 0.4,
};

export function EthereumEssence(props: EthereumEssenceProps) {
  return (
    <BasePlant
      {...props}
      config={config}
      renderPlantModel={({ hoveredPlantId, id, growthStage }) => (
        <group>
          {/* Main crystal */}
          <mesh>
            <octahedronGeometry args={[0.2]} />
            <meshStandardMaterial
              color={config.colors.primary}
              emissive={config.colors.primary}
              emissiveIntensity={
                0.5 * growthStage * (hoveredPlantId === id ? 2 : 1)
              }
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Floating crystals */}
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i * Math.PI * 2) / 3) * 0.3,
                0,
                Math.sin((i * Math.PI * 2) / 3) * 0.3,
              ]}
              scale={0.1}
            >
              <tetrahedronGeometry />
              <meshStandardMaterial
                color={config.colors.secondary}
                emissive={config.colors.secondary}
                emissiveIntensity={
                  0.8 * growthStage * (hoveredPlantId === id ? 2 : 1)
                }
                metalness={0.6}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>
      )}
    />
  );
}
