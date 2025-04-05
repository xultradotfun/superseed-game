"use client";

import { useRef } from "react";
import { Mesh, Vector3 } from "three";
import { useThree, ThreeEvent } from "@react-three/fiber";
import { useGameState } from "@/game/state/GameState";

export function Island() {
  const islandRef = useRef<Mesh>(null);
  const { selectedPlantType, handlePlanting } = useGameState();
  const { raycaster, camera, pointer } = useThree();

  // Handle click events for planting
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!selectedPlantType || !islandRef.current) return;

    // Update the raycaster with current pointer position
    raycaster.setFromCamera(pointer, camera);

    // Check intersection with the island
    const intersects = raycaster.intersectObject(islandRef.current);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      // Create a Vector3 for the plant position, placing it exactly at y=0 (soil surface)
      const position = new Vector3(point.x, 0, point.z);
      handlePlanting(position);
    }
  };

  return (
    <group>
      <mesh
        ref={islandRef}
        position={[0, -1, 0]}
        receiveShadow
        onClick={handleClick}
      >
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
