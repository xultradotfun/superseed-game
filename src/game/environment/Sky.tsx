import { BackSide } from "three";
import { GradientTexture } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Airplane() {
  const airplaneRef = useRef<THREE.Group>(null);
  const propellerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (airplaneRef.current && propellerRef.current) {
      const time = state.clock.getElapsedTime();
      // Circular flight path
      const radius = 25;
      const height = 5;
      const speed = 0.2;

      // Position
      const angle = -time * speed;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      airplaneRef.current.position.set(x, height, z);

      // Rotation to face direction of movement
      airplaneRef.current.rotation.y = -angle;

      // Gentle banking in turns
      airplaneRef.current.rotation.z = Math.sin(time * speed) * 0.2;

      // Propeller rotation
      propellerRef.current.rotation.z = time * 8;
    }
  });

  return (
    <group ref={airplaneRef} scale={0.8}>
      {/* Main body - rounded shape */}
      <mesh rotation={[Math.PI / 2, 0, Math.PI]}>
        <capsuleGeometry args={[0.5, 2, 8, 16]} />
        <meshStandardMaterial color="#FF6B6B" />
      </mesh>

      {/* Cockpit dome */}
      <mesh position={[0, 0.4, -0.5]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ADE8F4" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Main wings */}
      <group position={[0, -0.1, 0]}>
        {/* Left wing */}
        <mesh position={[-1.2, 0, 0]}>
          <boxGeometry args={[2, 0.15, 1]} />
          <meshStandardMaterial color="#FF8787" />
        </mesh>
        {/* Right wing */}
        <mesh position={[1.2, 0, 0]}>
          <boxGeometry args={[2, 0.15, 1]} />
          <meshStandardMaterial color="#FF8787" />
        </mesh>
      </group>

      {/* Tail */}
      <group position={[0, 0, 1.2]}>
        {/* Vertical stabilizer */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.12, 1, 0.8]} />
          <meshStandardMaterial color="#FF8787" />
        </mesh>
        {/* Horizontal stabilizers */}
        <mesh position={[0.6, 0, 0]}>
          <boxGeometry args={[0.8, 0.12, 0.6]} />
          <meshStandardMaterial color="#FF8787" />
        </mesh>
        <mesh position={[-0.6, 0, 0]}>
          <boxGeometry args={[0.8, 0.12, 0.6]} />
          <meshStandardMaterial color="#FF8787" />
        </mesh>
      </group>

      {/* Propeller */}
      <group ref={propellerRef} position={[0, 0, -1.3]}>
        <mesh rotation={[0, 0, 0]}>
          <boxGeometry args={[0.1, 1.2, 0.1]} />
          <meshStandardMaterial color="#4A4E69" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.1, 1.2, 0.1]} />
          <meshStandardMaterial color="#4A4E69" />
        </mesh>
      </group>
    </group>
  );
}

function Cloud({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const cloudRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cloudRef.current) {
      // Gentle floating motion with unique pattern based on position
      const time = state.clock.getElapsedTime();
      const xOffset = Math.sin(time * 0.2 + position[0]) * 0.002;
      const yOffset = Math.sin(time * 0.3 + position[2]) * 0.001;
      cloudRef.current.position.y += yOffset;
      cloudRef.current.position.x += xOffset;
    }
  });

  return (
    <group ref={cloudRef} position={position} scale={scale}>
      {/* Main cloud body */}
      <mesh>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Additional puffs */}
      <mesh position={[-1.5, -0.2, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[1.5, -0.3, 0]}>
        <sphereGeometry args={[1.7, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

export function Sky() {
  // Define cloud positions with more variation and depth
  const cloudPositions: Array<{
    position: [number, number, number];
    scale: number;
  }> = [
    // Clouds below the island
    { position: [-15, -8, -10], scale: 1.2 },
    { position: [20, -6, 15], scale: 1.1 },
    { position: [0, -10, 0], scale: 1.3 },
    { position: [-10, -7, 10], scale: 1.0 },

    // Clouds at island level - front
    { position: [-25, 2, 20], scale: 0.9 },
    { position: [30, 3, 25], scale: 0.8 },
    { position: [0, 1, 15], scale: 1.0 },

    // Clouds at island level - back
    { position: [-20, 4, -20], scale: 0.9 },
    { position: [25, 3, -25], scale: 0.8 },
    { position: [5, 2, -15], scale: 1.0 },

    // Higher clouds - scattered around
    { position: [-15, 15, 15], scale: 0.7 },
    { position: [20, 18, -20], scale: 0.6 },
    { position: [-25, 12, -10], scale: 0.8 },
    { position: [15, 14, 10], scale: 0.7 },

    // Far background clouds
    { position: [-30, 20, -35], scale: 0.5 },
    { position: [35, 18, -40], scale: 0.4 },
    { position: [0, 22, -45], scale: 0.3 },
    { position: [-20, 16, 40], scale: 0.4 },
    { position: [25, 19, 35], scale: 0.5 },
  ];

  return (
    <>
      {/* Bright blue sky color for background */}
      <color attach="background" args={["#7CC6DE"]} />

      {/* Sky dome with gradient */}
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial side={BackSide} color="#7CC6DE" fog={false}>
          <GradientTexture
            stops={[0, 0.5, 1]}
            colors={["#B4E7F8", "#7CC6DE", "#5BB1D0"]}
          />
        </meshBasicMaterial>
      </mesh>

      {/* Stylized clouds */}
      {cloudPositions.map((cloud, index) => (
        <Cloud key={index} position={cloud.position} scale={cloud.scale} />
      ))}

      <Airplane />
    </>
  );
}
