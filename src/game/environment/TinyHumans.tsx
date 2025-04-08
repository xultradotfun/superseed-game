"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Group, MathUtils } from "three";
import { useGameState } from "@/game/state/GameState";

type Human = {
  position: Vector3;
  targetPosition: Vector3;
  rotation: number;
  targetRotation: number;
  action: "walking" | "watering" | "observing";
  actionTimer: number;
  skinTone: string;
  clothesColor: string;
  hatColor: string;
  walkCycle: number;
  lastUpdateTime: number;
};

const SKIN_TONES = [
  "#FFE0BD", // Light
  "#FFD1AA", // Light medium
  "#E6B697", // Medium
  "#C68642", // Medium dark
  "#8D5524", // Dark
];

const CLOTHES_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Sage
  "#FFEEAD", // Yellow
];

const HAT_COLORS = [
  "#FF4B4B", // Bright red
  "#4CAF50", // Green
  "#2196F3", // Blue
  "#FF9800", // Orange
  "#9C27B0", // Purple
];

export function TinyHumans() {
  const humanRefs = useRef<Group[]>([]);
  const humans = useRef<Human[]>([]);
  const { plants } = useGameState();

  // Initialize humans
  useMemo(() => {
    const numHumans = 5;
    humans.current = Array.from({ length: numHumans }, () => {
      const colorIndex = Math.floor(Math.random() * 5);
      return {
        position: new Vector3(
          (Math.random() - 0.5) * 8,
          0,
          (Math.random() - 0.5) * 8
        ),
        targetPosition: new Vector3(),
        rotation: Math.random() * Math.PI * 2,
        targetRotation: 0,
        action: "walking",
        actionTimer: 0,
        walkCycle: 0,
        lastUpdateTime: 0,
        skinTone: SKIN_TONES[colorIndex],
        clothesColor: CLOTHES_COLORS[colorIndex],
        hatColor: HAT_COLORS[colorIndex],
      };
    });
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    humans.current.forEach((human, index) => {
      // Update action timer
      human.actionTimer -= delta;

      // Choose new action when timer expires
      if (human.actionTimer <= 0) {
        if (human.action === "walking") {
          // 20% chance to start watering if near a plant
          if (Math.random() < 0.2 && Object.values(plants).length > 0) {
            const randomPlant =
              Object.values(plants)[
                Math.floor(Math.random() * Object.values(plants).length)
              ];
            if (randomPlant) {
              const plantPos = new Vector3(
                randomPlant.position[0],
                0,
                randomPlant.position[2]
              );
              human.targetPosition.copy(plantPos);
              // Add offset in the direction they're facing
              const offset = new Vector3(0.5, 0, 0.5);
              offset.applyAxisAngle(new Vector3(0, 1, 0), human.rotation);
              human.targetPosition.add(offset);
              human.action = "watering";
              human.actionTimer = 3 + Math.random() * 2; // Water for 3-5 seconds
            }
          } else {
            // Choose new random position on the island
            const angle = Math.random() * Math.PI * 2;
            const radius = 3.5 + Math.random() * 1; // Keep within island radius (4.5 max)
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            human.targetPosition.set(x, 0, z);
            human.targetRotation = Math.atan2(
              human.targetPosition.x - human.position.x,
              human.targetPosition.z - human.position.z
            );
            human.actionTimer = 4 + Math.random() * 3; // Walk for longer
          }
        } else {
          // Return to walking
          human.action = "walking";
          human.actionTimer = 2 + Math.random() * 2;
        }
      }

      // Update position and rotation with smoother movement
      if (human.action === "walking") {
        const speed = 0.8 * delta; // Slower movement
        human.position.lerp(human.targetPosition, speed);
        human.rotation = MathUtils.lerp(
          human.rotation,
          human.targetRotation,
          speed * 3
        );

        // Update walk cycle for leg animation
        human.walkCycle = (time * 3) % (Math.PI * 2);
      }

      // Ensure they stay within island bounds
      const distanceFromCenter = Math.sqrt(
        human.position.x * human.position.x +
          human.position.z * human.position.z
      );
      if (distanceFromCenter > 4.5) {
        const angle = Math.atan2(human.position.z, human.position.x);
        human.position.x = Math.cos(angle) * 4.5;
        human.position.z = Math.sin(angle) * 4.5;
        // Set new target towards center
        human.targetPosition.set(0, 0, 0);
        human.targetRotation = Math.atan2(-human.position.x, -human.position.z);
      }

      // Update mesh
      if (humanRefs.current[index]) {
        const heightOffset = new Vector3(0, 0.18, 0);
        humanRefs.current[index].position
          .copy(human.position)
          .add(heightOffset);
        humanRefs.current[index].rotation.y = human.rotation;
      }
    });
  });

  return (
    <group>
      {humans.current.map((human, index) => (
        <group
          key={index}
          ref={(el) => (humanRefs.current[index] = el!)}
          scale={0.15} // Make them tiny!
          position={[0, 0, 0]} // Base position, actual height added in position update
        >
          {/* Body - Clothes */}
          <mesh position={[0, 0, 0]}>
            <capsuleGeometry args={[0.35, 0.5, 12, 16]} />
            <meshStandardMaterial color={human.clothesColor} />
          </mesh>

          {/* Belt */}
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.37, 0.08, 8, 16]} />
            <meshStandardMaterial color="#4A4E69" metalness={0.3} />
          </mesh>

          {/* Head with face */}
          <group position={[0, 0.6, 0]}>
            {/* Face */}
            <mesh>
              <sphereGeometry args={[0.3, 12, 12]} />
              <meshStandardMaterial color={human.skinTone} />
            </mesh>

            {/* Beard */}
            <mesh position={[0, -0.15, 0.1]} scale={[1, 0.7, 0.5]}>
              <sphereGeometry args={[0.25, 12, 12]} />
              <meshStandardMaterial color="white" />
            </mesh>

            {/* Eyes */}
            <mesh position={[0.1, 0.05, 0.25]} rotation={[0, 0, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[-0.1, 0.05, 0.25]} rotation={[0, 0, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#000000" />
            </mesh>

            {/* Nose */}
            <mesh position={[0, 0, 0.3]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color={human.skinTone} />
            </mesh>

            {/* Gnome Hat */}
            <group position={[0, 0.3, 0]}>
              {/* Hat base */}
              <mesh position={[0, 0, 0]} rotation={[0.2, 0, 0]}>
                <cylinderGeometry args={[0.3, 0.35, 0.4, 12]} />
                <meshStandardMaterial color={human.hatColor} />
              </mesh>
              {/* Hat top */}
              <mesh position={[0, 0.4, 0]} rotation={[0.2, 0, 0]}>
                <coneGeometry args={[0.3, 0.8, 12]} />
                <meshStandardMaterial color={human.hatColor} />
              </mesh>
            </group>
          </group>

          {/* Arms with animation */}
          <group
            position={[0, 0.2, 0]}
            rotation={[0, 0, human.action === "watering" ? -Math.PI / 4 : 0]}
          >
            {/* Sleeves */}
            <mesh
              position={[-0.4, 0, 0]}
              rotation={[
                0,
                0,
                human.action === "walking"
                  ? Math.sin(human.walkCycle) * 0.3
                  : 0,
              ]}
            >
              <capsuleGeometry args={[0.12, 0.4, 8, 8]} />
              <meshStandardMaterial color={human.clothesColor} />
            </mesh>
            <mesh
              position={[0.4, 0, 0]}
              rotation={[
                0,
                0,
                human.action === "walking"
                  ? -Math.sin(human.walkCycle) * 0.3
                  : 0,
              ]}
            >
              <capsuleGeometry args={[0.12, 0.4, 8, 8]} />
              <meshStandardMaterial color={human.clothesColor} />
            </mesh>
            {/* Hands */}
            <mesh
              position={[-0.4, -0.2, 0]}
              rotation={[
                0,
                0,
                human.action === "walking"
                  ? Math.sin(human.walkCycle) * 0.3
                  : 0,
              ]}
            >
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color={human.skinTone} />
            </mesh>
            <mesh
              position={[0.4, -0.2, 0]}
              rotation={[
                0,
                0,
                human.action === "walking"
                  ? -Math.sin(human.walkCycle) * 0.3
                  : 0,
              ]}
            >
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color={human.skinTone} />
            </mesh>
          </group>

          {/* Legs with walking animation */}
          <group position={[0, -0.3, 0]}>
            {/* Boots */}
            <mesh
              position={[-0.2, 0, 0]}
              rotation={[
                human.action === "walking"
                  ? Math.sin(human.walkCycle) * 0.3
                  : 0,
                0,
                0,
              ]}
            >
              <boxGeometry args={[0.25, 0.2, 0.35]} />
              <meshStandardMaterial color="#4A4E69" metalness={0.3} />
            </mesh>
            <mesh
              position={[0.2, 0, 0]}
              rotation={[
                human.action === "walking"
                  ? -Math.sin(human.walkCycle) * 0.3
                  : 0,
                0,
                0,
              ]}
            >
              <boxGeometry args={[0.25, 0.2, 0.35]} />
              <meshStandardMaterial color="#4A4E69" metalness={0.3} />
            </mesh>
            {/* Legs */}
            <mesh
              position={[-0.2, 0.25, 0]}
              rotation={[
                human.action === "walking"
                  ? Math.sin(human.walkCycle) * 0.3
                  : 0,
                0,
                0,
              ]}
            >
              <capsuleGeometry args={[0.12, 0.3, 8, 8]} />
              <meshStandardMaterial color={human.clothesColor} />
            </mesh>
            <mesh
              position={[0.2, 0.25, 0]}
              rotation={[
                human.action === "walking"
                  ? -Math.sin(human.walkCycle) * 0.3
                  : 0,
                0,
                0,
              ]}
            >
              <capsuleGeometry args={[0.12, 0.3, 8, 8]} />
              <meshStandardMaterial color={human.clothesColor} />
            </mesh>
          </group>

          {/* Watering can with water particles */}
          {human.action === "watering" && (
            <group position={[-0.6, 0.2, 0.2]} rotation={[0, 0, -Math.PI / 4]}>
              <mesh>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial
                  color="#4A4E69"
                  metalness={0.6}
                  roughness={0.2}
                />
              </mesh>
              <mesh position={[0.2, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
                <meshStandardMaterial
                  color="#4A4E69"
                  metalness={0.6}
                  roughness={0.2}
                />
              </mesh>
              {/* Water stream */}
              <mesh position={[0.4, -0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
                <cylinderGeometry args={[0.02, 0.01, 0.4, 8]} />
                <meshStandardMaterial
                  color="#7ad7ff"
                  transparent
                  opacity={0.6}
                />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
}
