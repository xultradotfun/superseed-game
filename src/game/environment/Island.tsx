"use client";

import { useRef } from "react";
import { Mesh } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGameState } from "@/game/state/GameState";

export function Island() {
  const islandRef = useRef<Mesh>(null);
  const { plantingMode, handlePlanting } = useGameState();
  const { raycaster, camera, pointer } = useThree();

  // Handle click events for planting
  const handleClick = () => {
    if (!plantingMode || !islandRef.current) return;

    // Update the raycaster with current pointer position
    raycaster.setFromCamera(pointer, camera);

    // Check intersection with the island
    const intersects = raycaster.intersectObject(islandRef.current);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      // Offset the plant position slightly above the surface
      handlePlanting([point.x, point.y + 0.1, point.z]);
    }
  };

  // Gentle floating animation
  useFrame((state) => {
    if (islandRef.current) {
      islandRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group onClick={handleClick}>
      <mesh ref={islandRef} position={[0, -1, 0]} receiveShadow>
        {/* Main island body */}
        <cylinderGeometry args={[5, 6, 2, 32]} />
        <meshStandardMaterial color="#90a959" roughness={0.8} />
      </mesh>

      {/* Top soil layer */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[5, 5, 0.2, 32]} />
        <meshStandardMaterial color="#6a4928" roughness={1} />
      </mesh>
    </group>
  );
}
