"use client";

import { useRef, useMemo, useState, createContext } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Group, MathUtils } from "three";
import { useGameState } from "@/game/state/GameState";
import { ChatBubble } from "./ChatBubble";
import { GnomeMode } from "./GnomeMode";
import { GnomeHut } from "./GnomeHut";

// Action probabilities (must sum to 1)
const ACTION_PROBABILITIES = {
  WATER_PLANTS: 0.25, // 25% chance to water plants
  REST_IN_HUT: 0.1, // 10% chance to rest
  GARDEN: 0.25, // 25% chance to garden
  RANDOM_WALK: 0.4, // 40% chance to walk randomly
} as const;

// Action durations in seconds
const ACTION_DURATIONS = {
  WATER_PLANTS: [3, 5], // 3-5 seconds
  REST_IN_HUT: [4, 6], // 4-6 seconds
  GARDEN: [4, 6], // 4-6 seconds
  RANDOM_WALK: [4, 7], // 4-7 seconds
  WALKING: [2, 4], // 2-4 seconds for returning to walking
} as const;

// Message settings
const MESSAGE_SETTINGS = {
  CHANCE: 0.3, // 30% chance to show a message when eligible
  COOLDOWN: 8000, // 8 seconds minimum between messages
  DISPLAY_TIME: 3000, // 3 seconds message display time
} as const;

// Create a context for gnome mode
export const GnomeModeContext = createContext<{
  isGnomeMode: boolean;
  setGnomeMode: (value: boolean) => void;
}>({ isGnomeMode: false, setGnomeMode: () => {} });

// Gnome chat messages
const GNOME_MESSAGES = [
  "Hello there! I'm just tending to these plants! 🌱",
  "Have you seen my red hat anywhere? Oh wait, it's on my head! 😅",
  "The garden is looking lovely today! 🌸",
  "I've been watering plants all day, my arms are tired! 💪",
  "Want to join our gnome community? Just find all of us! 🎯",
  "One more gnome to meet and you can become one of us! 🧙‍♂️",
  "Welcome to the gnome life! 🪄",
  "Time for a quick rest in our cozy hut! 🏠",
  "The garden needs some extra care today! 🌺",
  "Nothing better than gardening with friends! 👥",
];

type Human = {
  position: Vector3;
  targetPosition: Vector3;
  rotation: number;
  targetRotation: number;
  action: "walking" | "watering" | "observing" | "resting" | "gardening";
  actionTimer: number;
  skinTone: string;
  clothesColor: string;
  hatColor: string;
  walkCycle: number;
  lastUpdateTime: number;
  clicked: boolean;
  message: string;
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
  const [clickCount, setClickCount] = useState(0);
  const [showMessages, setShowMessages] = useState<boolean[]>([]);
  const [isGnomeMode, setGnomeMode] = useState(false);
  const lastMessageTimes = useRef<number[]>([]);

  // Initialize humans with new properties
  useMemo(() => {
    const numHumans = 5;
    humans.current = Array.from({ length: numHumans }, (_, index) => {
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
        clicked: false,
        message: GNOME_MESSAGES[index],
      };
    });
    setShowMessages(new Array(numHumans).fill(false));
  }, []);

  // Handle gnome clicks
  const handleGnomeClick = (index: number) => {
    if (!humans.current[index].clicked) {
      humans.current[index].clicked = true;
      const newCount = clickCount + 1;
      setClickCount(newCount);

      // Update message based on click count
      const message =
        newCount === 5
          ? "Welcome to the gnome life!🪄"
          : newCount === 4
          ? "One more gnome to meet and you can become one of us! 🧙‍♂️"
          : GNOME_MESSAGES[index];

      humans.current[index].message = message;

      if (newCount === 5) {
        // All gnomes clicked, enable gnome mode after a delay
        setTimeout(() => {
          setGnomeMode(true);
        }, 2000);
      }

      // Show message for this gnome
      setShowMessages((prev) => {
        const newMessages = [...prev];
        newMessages[index] = true;
        // Hide message after 3 seconds
        setTimeout(() => {
          setShowMessages((prev) => {
            const newMessages = [...prev];
            newMessages[index] = false;
            return newMessages;
          });
        }, 3000);
        return newMessages;
      });
    }
  };

  // Function to check if enough time has passed since last message
  const canShowMessage = (index: number) => {
    const now = Date.now();
    if (!lastMessageTimes.current[index]) {
      lastMessageTimes.current[index] = 0;
    }
    return now - lastMessageTimes.current[index] >= MESSAGE_SETTINGS.COOLDOWN;
  };

  // Function to show message with cooldown and chance
  const tryShowMessage = (index: number, message: string) => {
    if (canShowMessage(index) && Math.random() < MESSAGE_SETTINGS.CHANCE) {
      lastMessageTimes.current[index] = Date.now();
      humans.current[index].message = message;
      setShowMessages((prev) => {
        const newMessages = [...prev];
        newMessages[index] = true;
        setTimeout(() => {
          setShowMessages((prev) => {
            const newMessages = [...prev];
            newMessages[index] = false;
            return newMessages;
          });
        }, MESSAGE_SETTINGS.DISPLAY_TIME);
        return newMessages;
      });
      return true;
    }
    return false;
  };

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const hutPosition = new Vector3(-2, 0, 2);

    humans.current.forEach((human, index) => {
      // Update action timer
      human.actionTimer -= delta;

      // Choose new action when timer expires
      if (human.actionTimer <= 0) {
        const random = Math.random();

        if (human.action === "walking") {
          if (
            random < ACTION_PROBABILITIES.WATER_PLANTS &&
            Object.values(plants).length > 0
          ) {
            // Water plants
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
              const offset = new Vector3(0.5, 0, 0.5);
              offset.applyAxisAngle(new Vector3(0, 1, 0), human.rotation);
              human.targetPosition.add(offset);
              human.action = "watering";
              human.actionTimer =
                ACTION_DURATIONS.WATER_PLANTS[0] +
                Math.random() *
                  (ACTION_DURATIONS.WATER_PLANTS[1] -
                    ACTION_DURATIONS.WATER_PLANTS[0]);
              human.message =
                "These plants are thirsty! Time for some water! 💧";
              tryShowMessage(index, human.message);
            }
          } else if (
            random <
            ACTION_PROBABILITIES.WATER_PLANTS + ACTION_PROBABILITIES.REST_IN_HUT
          ) {
            // Rest in hut
            human.targetPosition.copy(hutPosition);
            const offset = new Vector3((Math.random() - 0.5) * 0.5, 0, 1);
            human.targetPosition.add(offset);
            human.action = "resting";
            human.actionTimer =
              ACTION_DURATIONS.REST_IN_HUT[0] +
              Math.random() *
                (ACTION_DURATIONS.REST_IN_HUT[1] -
                  ACTION_DURATIONS.REST_IN_HUT[0]);
            human.message = "Time for a quick rest in our cozy hut! 🏠";
            tryShowMessage(index, human.message);
          } else if (
            random <
            ACTION_PROBABILITIES.WATER_PLANTS +
              ACTION_PROBABILITIES.REST_IN_HUT +
              ACTION_PROBABILITIES.GARDEN
          ) {
            // Garden around hut
            const gardenSpot = new Vector3(
              hutPosition.x + (Math.random() - 0.5) * 2,
              0,
              hutPosition.z + (Math.random() - 0.5) * 2
            );
            human.targetPosition.copy(gardenSpot);
            human.action = "gardening";
            human.actionTimer =
              ACTION_DURATIONS.GARDEN[0] +
              Math.random() *
                (ACTION_DURATIONS.GARDEN[1] - ACTION_DURATIONS.GARDEN[0]);
            human.message = "The garden needs some extra care today! 🌺";
            tryShowMessage(index, human.message);
          } else {
            // Random walk
            const angle = Math.random() * Math.PI * 2;
            const radius = 3.5 + Math.random() * 1;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            human.targetPosition.set(x, 0, z);
            human.targetRotation = Math.atan2(
              human.targetPosition.x - human.position.x,
              human.targetPosition.z - human.position.z
            );
            human.actionTimer =
              ACTION_DURATIONS.RANDOM_WALK[0] +
              Math.random() *
                (ACTION_DURATIONS.RANDOM_WALK[1] -
                  ACTION_DURATIONS.RANDOM_WALK[0]);
          }
        } else {
          // Return to walking
          human.action = "walking";
          human.actionTimer =
            ACTION_DURATIONS.WALKING[0] +
            Math.random() *
              (ACTION_DURATIONS.WALKING[1] - ACTION_DURATIONS.WALKING[0]);
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
    <GnomeModeContext.Provider value={{ isGnomeMode, setGnomeMode }}>
      <group>
        <GnomeHut />
        {isGnomeMode && <GnomeMode />}
        {humans.current.map((human, index) => (
          <group
            key={index}
            ref={(el) => (humanRefs.current[index] = el!)}
            scale={0.15}
            position={[0, 0, 0]}
            onClick={(e) => {
              // Stop event propagation to prevent clicking through
              e.stopPropagation();
              if (!isGnomeMode) {
                handleGnomeClick(index);
              }
            }}
          >
            {showMessages[index] && (
              <ChatBubble
                message={human.message}
                visible={true}
                position={[0, 3, 0]}
              />
            )}

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
              <group
                position={[-0.6, 0.2, 0.2]}
                rotation={[0, 0, -Math.PI / 4]}
              >
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

            {/* Add gardening tools when gardening */}
            {human.action === "gardening" && (
              <group
                position={[-0.6, 0.2, 0.2]}
                rotation={[0, 0, -Math.PI / 4]}
              >
                <mesh>
                  <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
                  <meshStandardMaterial color="#8B4513" />
                </mesh>
                <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <coneGeometry args={[0.15, 0.3, 8]} />
                  <meshStandardMaterial color="#A0522D" metalness={0.3} />
                </mesh>
              </group>
            )}
          </group>
        ))}
      </group>
    </GnomeModeContext.Provider>
  );
}
