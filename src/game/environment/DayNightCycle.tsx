"use client";

import { useRef } from "react";
import { DirectionalLight } from "three";
import { useFrame } from "@react-three/fiber";

export function DayNightCycle() {
  const sunRef = useRef<DirectionalLight>(null);
  const moonRef = useRef<DirectionalLight>(null);

  useFrame((state) => {
    if (sunRef.current && moonRef.current) {
      // Complete cycle every 5 minutes (300 seconds)
      const cycleProgress = (state.clock.elapsedTime % 300) / 300;
      const angle = cycleProgress * Math.PI * 2;

      // Update sun position
      sunRef.current.position.x = Math.cos(angle) * 10;
      sunRef.current.position.y = Math.sin(angle) * 10;
      sunRef.current.intensity = Math.max(0, Math.sin(angle));

      // Update moon position (opposite to sun)
      moonRef.current.position.x = Math.cos(angle + Math.PI) * 10;
      moonRef.current.position.y = Math.sin(angle + Math.PI) * 10;
      moonRef.current.intensity = Math.max(0, -Math.sin(angle)) * 0.5;
    }
  });

  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.2} />

      {/* Sun */}
      <directionalLight
        ref={sunRef}
        position={[10, 0, 10]}
        intensity={1}
        color="#ffd700"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Moon */}
      <directionalLight
        ref={moonRef}
        position={[-10, 0, 10]}
        intensity={0.5}
        color="#b4c7e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
    </>
  );
}
