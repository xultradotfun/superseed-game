import { BackSide } from "three";
import { GradientTexture } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameState } from "@/game/state/GameState";
import { useState, useEffect } from "react";
import { ChatBubble } from "./ChatBubble";

// Create a context for flight mode
import { createContext, useContext } from "react";
export const FlightModeContext = createContext<{
  isFlightMode: boolean;
  setFlightMode: (value: boolean) => void;
}>({ isFlightMode: false, setFlightMode: () => {} });

function PlayerPlane() {
  const planeRef = useRef<THREE.Group>(null);
  const propellerRef = useRef<THREE.Group>(null);
  const velocityRef = useRef({ x: 0, y: 0, z: 0 });
  const rotationRef = useRef({ pitch: 0, yaw: 0, roll: 0 });
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Show instructions for 5 seconds when flight mode starts
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 5000);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearTimeout(timer);
    };
  }, []);

  useFrame((state, delta) => {
    if (!planeRef.current) return;

    const FORWARD_SPEED = 8;
    const TURN_SPEED = 3.0; // Increased turn speed
    const PITCH_SPEED = 1.2;
    const TURN_SMOOTHING = 0.92; // Separate smoothing for turns
    const PITCH_SMOOTHING = 0.85; // Keep pitch more responsive

    const keys = keysPressed.current;
    const rotation = rotationRef.current;
    const velocity = velocityRef.current;

    // Calculate target rotations
    const targetPitch = keys["s"] ? PITCH_SPEED : keys["w"] ? -PITCH_SPEED : 0;

    // Accumulate yaw instead of setting it directly
    if (keys["a"]) rotation.yaw += TURN_SPEED * delta;
    if (keys["d"]) rotation.yaw -= TURN_SPEED * delta;

    // Smooth only the pitch, let yaw accumulate
    rotation.pitch +=
      (targetPitch - rotation.pitch) * (1 - PITCH_SMOOTHING) * delta * 3;

    // Clamp pitch to prevent over-rotation (-30 to +30 degrees)
    rotation.pitch = Math.max(
      Math.min(rotation.pitch, Math.PI / 6),
      -Math.PI / 6
    );

    // Calculate forward direction based on yaw
    const direction = new THREE.Vector3(
      Math.sin(rotation.yaw),
      0,
      Math.cos(rotation.yaw)
    );

    // Apply pitch to vertical movement
    const verticalSpeed = -Math.sin(rotation.pitch) * FORWARD_SPEED;

    // Update velocity with smooth acceleration
    velocity.x = direction.x * FORWARD_SPEED * delta;
    velocity.y = verticalSpeed * delta;
    velocity.z = direction.z * FORWARD_SPEED * delta;

    // Apply velocity to position
    planeRef.current.position.x += velocity.x;
    planeRef.current.position.y += velocity.y;
    planeRef.current.position.z += velocity.z;

    // Keep the plane above ground level
    if (planeRef.current.position.y < 1) {
      planeRef.current.position.y = 1;
    }

    // Update plane rotation
    planeRef.current.rotation.y = rotation.yaw;
    planeRef.current.rotation.x = rotation.pitch;

    // Add banking effect during turns
    const turnDirection = keys["a"] ? 1 : keys["d"] ? -1 : 0;
    const targetRoll = turnDirection * (Math.PI / 6); // 30-degree bank
    rotation.roll +=
      (targetRoll - rotation.roll) * (1 - TURN_SMOOTHING) * delta * 3;
    planeRef.current.rotation.z = rotation.roll;

    // Rotate propeller
    if (propellerRef.current) {
      propellerRef.current.rotation.z += 0.5;
    }

    // Update camera to follow from behind and slightly above
    const cameraOffset = new THREE.Vector3(
      -Math.sin(rotation.yaw) * 10,
      4 + Math.abs(rotation.pitch) * 2,
      -Math.cos(rotation.yaw) * 10
    );

    state.camera.position.copy(planeRef.current.position).add(cameraOffset);

    // Look at a point ahead of the plane
    const lookAtPoint = new THREE.Vector3().copy(planeRef.current.position);
    const lookAheadDistance = 8;
    lookAtPoint.add(direction.multiplyScalar(lookAheadDistance));
    lookAtPoint.y += rotation.pitch * 2;
    state.camera.lookAt(lookAtPoint);
  });

  return (
    <group ref={planeRef} position={[0, 5, 0]} rotation={[0, Math.PI, 0]}>
      {showInstructions && (
        <ChatBubble
          message="Flight Controls: W/S - Pitch Up/Down, A/D - Turn Left/Right 🛩️"
          visible={true}
        />
      )}
      {/* Reuse the same airplane model from the NPC plane */}
      <mesh rotation={[Math.PI / 2, Math.PI, Math.PI]}>
        <capsuleGeometry args={[0.5, 2, 8, 16]} />
        <meshStandardMaterial color="#FF6B6B" />
      </mesh>
      <mesh position={[0, 0.4, 0.5]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ADE8F4" metalness={0.5} roughness={0.2} />
      </mesh>
      <group position={[0, -0.1, 0]}>
        <mesh position={[-1.2, 0, 0]}>
          <boxGeometry args={[2, 0.15, 1]} />
          <meshStandardMaterial color="#FF8787" />
        </mesh>
        <mesh position={[1.2, 0, 0]}>
          <boxGeometry args={[2, 0.15, 1]} />
          <meshStandardMaterial color="#FF8787" />
        </mesh>
      </group>
      <group position={[0, 0, -1.2]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.12, 1, 0.8]} />
          <meshStandardMaterial color="#FF8787" />
        </mesh>
        <mesh position={[0.6, 0, 0]}>
          <boxGeometry args={[0.8, 0.12, 0.6]} />
          <meshStandardMaterial color="#FF8787" />
        </mesh>
        <mesh position={[-0.6, 0, 0]}>
          <boxGeometry args={[0.8, 0.12, 0.6]} />
          <meshStandardMaterial color="#FF8787" />
        </mesh>
      </group>
      <group ref={propellerRef} position={[0, 0, 1.3]}>
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

function Airplane() {
  const airplaneRef = useRef<THREE.Group>(null);
  const propellerRef = useRef<THREE.Group>(null);
  const { gameProgress } = useGameState();
  const achievement = gameProgress.achievements.find(
    (a) => a.id === "find_airplane"
  );
  const [hovered, setHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const { setFlightMode } = useContext(FlightModeContext);

  const messages = [
    "Hey! What are you looking at? 🤨",
    "Stop poking me! I'm trying to fly here! ✈️",
    "Do you know how hard it is to pilot AND talk? 😤",
    "I'm getting dizzy from all these circles... 😵‍💫",
    "Fine! You want to fly? Here, take the controls! 🛩️",
  ];

  const handleClick = () => {
    // First click handles achievement
    if (!achievement?.completed) {
      window.dispatchEvent(
        new CustomEvent("updateAchievement", {
          detail: {
            id: "find_airplane",
            progress: 1,
            completed: true,
          },
        })
      );
    }

    // Show next message in sequence
    setClickCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount === messages.length - 1) {
        // On the last message, enable flight mode after a delay
        setTimeout(() => {
          setFlightMode(true);
        }, 2000);
      }
      if (prev >= messages.length - 1) {
        return 0;
      }
      return nextCount;
    });
    setShowMessage(true);
  };

  useFrame((state) => {
    if (airplaneRef.current && propellerRef.current) {
      const time = state.clock.getElapsedTime();
      // Circular flight path
      const radius = 25;
      const height = 5;
      const speed = 0.2;

      // Update position and rotation
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
    <group
      ref={airplaneRef}
      scale={0.8}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <ChatBubble message={messages[clickCount]} visible={showMessage} />

      {/* Main body - rounded shape */}
      <mesh rotation={[Math.PI / 2, 0, Math.PI]}>
        <capsuleGeometry args={[0.5, 2, 8, 16]} />
        <meshStandardMaterial
          color={hovered ? "#FF8787" : "#FF6B6B"}
          emissive={hovered ? "#FF8787" : "#000000"}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
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
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.05}
          roughness={0.95}
          metalness={0}
        />
      </mesh>
      {/* Additional puffs */}
      <mesh position={[-1.5, -0.2, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.05}
          roughness={0.95}
          metalness={0}
        />
      </mesh>
      <mesh position={[1.5, -0.3, 0]}>
        <sphereGeometry args={[1.7, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.05}
          roughness={0.95}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

export function Sky() {
  const [isFlightMode, setFlightMode] = useState(false);

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
    <FlightModeContext.Provider value={{ isFlightMode, setFlightMode }}>
      {/* Bright blue sky color for background */}
      <color attach="background" args={["#A7E8FF"]} />

      {/* Sky dome with gradient */}
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial side={BackSide} color="#A7E8FF" fog={false}>
          <GradientTexture
            stops={[0, 0.5, 1]}
            colors={["#D4F5FF", "#A7E8FF", "#7CC6DE"]}
          />
        </meshBasicMaterial>
      </mesh>

      {/* Stylized clouds */}
      {cloudPositions.map((cloud, index) => (
        <Cloud key={index} position={cloud.position} scale={cloud.scale} />
      ))}

      {isFlightMode ? <PlayerPlane /> : <Airplane />}
    </FlightModeContext.Provider>
  );
}
