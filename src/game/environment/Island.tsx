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
      {/* Bottom rock layer */}
      <mesh position={[0, -2.2, 0]} receiveShadow>
        <cylinderGeometry args={[6.5, 4, 2, 8]} />
        <meshStandardMaterial color="#c17f59" roughness={0.8} />
      </mesh>

      {/* Middle rock layer */}
      <mesh position={[0, -1.4, 0]} receiveShadow>
        <cylinderGeometry args={[6, 5.5, 1.6, 10]} />
        <meshStandardMaterial color="#d4916b" roughness={0.7} />
      </mesh>

      {/* Main island body */}
      <mesh
        ref={islandRef}
        position={[0, -0.6, 0]}
        receiveShadow
        onClick={handleClick}
      >
        <cylinderGeometry args={[5.2, 5.8, 1.2, 12]} />
        <meshStandardMaterial color="#7ec544" roughness={0.6} metalness={0.0} />
      </mesh>

      {/* Grass layer */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[5.1, 5.2, 0.3, 12]} />
        <meshStandardMaterial color="#8ed349" roughness={0.8} metalness={0.0} />
      </mesh>

      {/* Top soil layer */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[5, 5.1, 0.2, 12]} />
        <meshStandardMaterial color="#825d36" roughness={1} metalness={0.0} />
      </mesh>

      {/* Edge details - rocks */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={i} position={[x, -0.1, z]}>
            <mesh receiveShadow>
              <sphereGeometry args={[0.3 + Math.random() * 0.2, 6, 6]} />
              <meshStandardMaterial
                color="#b37148"
                roughness={0.9}
                metalness={0.0}
              />
            </mesh>
          </group>
        );
      })}

      {/* Edge details - grass tufts */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.5;
        const radius = 4.8 + Math.random() * 0.4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={`grass-${i}`} position={[x, 0.1, z]}>
            <mesh receiveShadow>
              <coneGeometry args={[0.2, 0.4, 4]} />
              <meshStandardMaterial
                color="#9ee054"
                roughness={0.8}
                metalness={0.0}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
