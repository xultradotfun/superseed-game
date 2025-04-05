"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment as EnvironmentMap, Cloud, Stars } from "@react-three/drei";
import * as THREE from "three";
import { PlantSystem } from "./PlantSystem";
import { useGameState } from "./GameStateContext";
import { Water } from "./Water";

function TerrainLayer({
  height,
  radius,
  color,
}: {
  height: number;
  radius: number;
  color: string;
}) {
  return (
    <mesh position={[0, height, 0]} receiveShadow castShadow>
      <cylinderGeometry args={[radius, radius * 1.1, 0.3, 32]} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

export function Island() {
  return (
    <group position={[0, -0.3, 0]}>
      {/* Main terrain layers */}
      <TerrainLayer height={-0.6} radius={5} color="#8D6E63" />{" "}
      {/* Base rock */}
      <TerrainLayer height={-0.3} radius={4.5} color="#A1887F" />{" "}
      {/* Mid layer */}
      <TerrainLayer height={0} radius={4} color="#81C784" /> {/* Top grass */}
      {/* Decorative rocks */}
      {[1, 2, 3].map((i) => (
        <group
          key={i}
          position={[Math.sin(i * 2) * 3, 0.2, Math.cos(i * 2) * 3]}
        >
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color="#795548" roughness={0.9} />
          </mesh>
        </group>
      ))}
      {/* Plants */}
      <PlantSystem />
    </group>
  );
}

export function Environment() {
  const lightRef = useRef(new THREE.Vector3());
  const { timeSpeed, isPaused, currentTime, setCurrentTime } = useGameState();

  useFrame(({ clock }) => {
    if (isPaused) return;

    // Update current time based on elapsed time and speed
    const deltaTime = clock.getDelta() * timeSpeed * 0.1;
    const newTime = (currentTime + deltaTime) % 24;
    setCurrentTime(newTime);

    // Update sun position based on current time
    const angle = (currentTime / 24) * Math.PI * 2;
    lightRef.current.set(Math.cos(angle) * 10, Math.sin(angle) * 10, 0);
  });

  const isNight = currentTime > 18 || currentTime < 6;

  return (
    <>
      <EnvironmentMap
        preset={isNight ? "night" : "dawn"}
        background
        blur={0.5}
      />
      <ambientLight intensity={isNight ? 0.2 : 0.5} />
      <directionalLight
        position={lightRef.current.toArray()}
        intensity={isNight ? 0.5 : 1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Island />
      <Water />

      {/* Atmospheric effects */}
      {!isNight && (
        <>
          <Cloud
            seed={1}
            position={[-10, 8, -5]}
            opacity={0.5}
            speed={0.4}
            segments={20}
          />
          <Cloud
            seed={2}
            position={[10, 10, -5]}
            opacity={0.5}
            speed={0.4}
            segments={20}
          />
        </>
      )}
      {isNight && (
        <Stars
          radius={50}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      )}

      {/* Warmer fog during day, cooler at night */}
      <fog attach="fog" args={[isNight ? "#1a237e" : "#e3f2fd", 15, 50]} />
    </>
  );
}
