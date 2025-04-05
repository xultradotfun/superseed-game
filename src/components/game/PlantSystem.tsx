"use client";

import { LuminaBloom } from "./plants/LuminaBloom";

// For testing, we'll place some Lumina Blooms in a circle
const testPlants = Array.from({ length: 8 }).map((_, i) => {
  const angle = (i / 8) * Math.PI * 2;
  const radius = 2;
  return {
    id: `test-${i}`,
    position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [
      number,
      number,
      number
    ],
  };
});

export function PlantSystem() {
  return (
    <group>
      {testPlants.map((plant) => (
        <LuminaBloom key={plant.id} position={plant.position} />
      ))}
    </group>
  );
}
