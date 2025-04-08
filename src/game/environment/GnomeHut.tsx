"use client";

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export function GnomeHut() {
  // Load the meme texture
  const memeTexture = useLoader(TextureLoader, "/iloveyou.jpg");

  return (
    <group position={[-2, 0, 2]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Main hut body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1, 1.2, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Interior meme walls - both sides */}
      <group position={[0, 0.3, -0.4]}>
        {/* Front facing wall */}
        <mesh rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshStandardMaterial
            map={memeTexture}
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>
        {/* Back facing wall */}
        <mesh rotation={[0, 0, 0]}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshStandardMaterial
            map={memeTexture}
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>
      </group>

      {/* Roof */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <coneGeometry args={[1.2, 0.8, 8]} />
        <meshStandardMaterial color="#654321" roughness={0.7} />
      </mesh>

      {/* Door */}
      <group position={[0, -0.2, 0.9]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.7, 0.05]} />
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </mesh>
        {/* Door handle */}
        <mesh position={[0.15, 0, 0.03]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Windows */}
      <group>
        {/* Left window */}
        <mesh position={[-0.7, 0.2, 0.4]} rotation={[0, Math.PI / 1.59, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.05]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
        </mesh>
        {/* Right window */}
        <mesh position={[0.7, 0.2, 0.4]} rotation={[0, Math.PI / 2.6, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.05]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Chimney */}
      <group position={[0.4, 1.1, -0.4]}>
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
          <meshStandardMaterial color="#8B4513" roughness={1} />
        </mesh>
      </group>

      {/* Garden decorations */}
      <group position={[-1, -0.5, 0.5]}>
        {/* Flower pot */}
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.1, 0.2, 8]} />
          <meshStandardMaterial color="#D2691E" />
        </mesh>
        {/* Flowers */}
        <group position={[0, 0.1, 0]}>
          <mesh>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#FF69B4" />
          </mesh>
        </group>
      </group>

      {/* Welcome mat */}
      <mesh position={[0, -0.59, 1.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial color="#556B2F" roughness={1} />
      </mesh>
    </group>
  );
}
