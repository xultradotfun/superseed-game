"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { useSpring, animated } from "@react-spring/three";

interface LuminaBloomProps {
  position: [number, number, number];
  growthStage?: number; // 0 to 1
}

export function LuminaBloom({ position, growthStage = 1 }: LuminaBloomProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  // Growth and hover animations
  const { scale, emissiveIntensity } = useSpring({
    scale: hovered ? 1.1 : 1,
    emissiveIntensity: hovered ? 0.5 : 0.2,
    config: { mass: 1, tension: 170, friction: 26 },
  });

  return (
    <animated.group
      ref={groupRef}
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Stem */}
      <mesh position={[0, 0.3, 0]} scale={[0.05, 0.6, 0.05]}>
        <cylinderGeometry />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>

      {/* Flower */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <animated.meshStandardMaterial
          color="#E8F5E9"
          emissive="#81C784"
          emissiveIntensity={emissiveIntensity}
          toneMapped={false}
        />
      </mesh>

      {/* Petals */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[0, 0.7, 0]}
          rotation={[0, (i / 5) * Math.PI * 2, 0.3]}
        >
          <coneGeometry args={[0.1, 0.2, 3]} />
          <meshStandardMaterial
            color="#A5D6A7"
            emissive="#81C784"
            emissiveIntensity={0.2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </animated.group>
  );
}
