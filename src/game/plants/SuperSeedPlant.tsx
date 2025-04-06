"use client";

import { BasePlant, BasePlantProps } from "./BasePlant";
import { ParticleSystem } from "@/game/effects/ParticleSystem";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { Group } from "three";
import { useGameState } from "@/game/state/GameState";
import { useThree } from "@react-three/fiber";
import { gsap } from "gsap";

const config = {
  name: "Sacred SuperSeed",
  colors: {
    primary: "#00ffff", // Cyan brand color
    secondary: "#1cd8d2", // Lighter cyan for glow
    stem: "#2dd4bf", // Teal stem
    accent: "#ffffff", // White for accents
    energy: "#80fff9", // Light cyan for energy effects
  },
  glowIntensity: 3,
  hitboxSize: 1.5,
  disableHarvest: true,
};

type SuperSeedProps = Omit<BasePlantProps, "config" | "renderPlantModel">;

export function SuperSeedPlant(props: SuperSeedProps) {
  const energyRingsRef = useRef<Group>(null);
  const { camera } = useThree();
  const { showVictoryModal } = useGameState();
  const hasShownVictory = useRef(false);
  const growthStage = props.growthStage ?? 0;
  const spinningAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const controls = useThree((state) => state.controls);

  useEffect(() => {
    if (growthStage >= 1 && !hasShownVictory.current) {
      hasShownVictory.current = true;

      // Store original camera position and rotation
      const originalPosition = { ...camera.position };
      const originalRotation = { ...camera.rotation };

      // Disable orbit controls
      if (controls) {
        controls.enabled = false;
      }

      // Set up camera for victory animation
      const distance = 60; // Doubled distance from center
      const height = 40; // Doubled height above ground

      // Move camera to starting position
      gsap.set(camera.position, {
        x: 0,
        y: height,
        z: distance,
      });
      camera.lookAt(0, 0, 0);

      // Create the orbit animation
      const timeline = gsap.timeline({ repeat: -1 });
      timeline.to(
        {},
        {
          duration: 20,
          ease: "none",
          onUpdate: function () {
            const progress = this.progress();
            const angle = progress * Math.PI * 2;

            // Calculate camera position on the orbit circle
            camera.position.x = Math.sin(angle) * distance;
            camera.position.z = Math.cos(angle) * distance;
            camera.position.y = height;

            // Look at the center
            camera.lookAt(0, 0, 0);
          },
        }
      );

      spinningAnimationRef.current = timeline;

      // Show victory modal after a short delay
      setTimeout(() => {
        showVictoryModal({
          title: "🎉 Sacred SuperSeed Achieved!",
          message:
            "You have discovered and grown the Sacred SuperSeed - a symbol of growth and innovation in the blockchain ecosystem. This mystical flower represents the pinnacle of achievement, inspired by Superseed: the first blockchain that repays your debt.",
          links: [
            {
              text: "🌱 Explore Superseed - The Future of DeFi",
              url: "https://www.superseed.xyz/",
              description:
                "Discover Supercollateral: self-repaying loans powered by Proof of Repayment (PoR). Join a culture of contribution and help expand Ethereum's frontier.",
            },
            {
              text: "𝕏 Made by 0x_ultra",
              url: "https://twitter.com/0x_ultra",
              description:
                "Follow the creator for more blockchain gaming innovations",
            },
          ],
        });
      }, 1000);

      // Handle cleanup
      const handleModalClose = () => {
        if (spinningAnimationRef.current) {
          spinningAnimationRef.current.kill();
        }

        // Re-enable orbit controls
        if (controls) {
          controls.enabled = true;
        }

        gsap.to(camera.position, {
          x: originalPosition.x,
          y: originalPosition.y,
          z: originalPosition.z,
          duration: 2,
          ease: "power2.inOut",
          onComplete: () => {
            camera.rotation.set(
              originalRotation.x,
              originalRotation.y,
              originalRotation.z
            );
          },
        });
      };

      window.addEventListener("closeVictoryModal", handleModalClose);
      return () => {
        window.removeEventListener("closeVictoryModal", handleModalClose);
        if (spinningAnimationRef.current) {
          spinningAnimationRef.current.kill();
        }
        // Re-enable orbit controls on cleanup
        if (controls) {
          controls.enabled = true;
        }
        gsap.killTweensOf(camera.position);
      };
    }
  }, [growthStage, camera, showVictoryModal, controls]);

  useFrame(({ clock }) => {
    if (energyRingsRef.current) {
      // Rotate energy rings
      energyRingsRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      // Gentle floating motion
      energyRingsRef.current.position.y =
        Math.sin(clock.getElapsedTime()) * 0.1;

      // Victory celebration animation
      if (growthStage >= 1) {
        energyRingsRef.current.rotation.y = clock.getElapsedTime() * 0.5; // Faster rotation
        energyRingsRef.current.position.y =
          Math.sin(clock.getElapsedTime() * 2) * 0.2; // More dramatic floating
      }
    }
  });

  return (
    <BasePlant
      {...props}
      config={config}
      renderPlantModel={({ plantRef, hoveredPlantId, id, growthStage }) => {
        const scale = 2.0;
        const stemHeight = 0.4 + growthStage * 2.0;
        const isHovered = hoveredPlantId === id;
        const rotationAngle = Math.PI / 6 + (growthStage * Math.PI) / 4;
        const time = Date.now() * 0.001; // Use time for leaf animation

        return (
          <group ref={plantRef} scale={[scale, scale, scale]}>
            {/* Base glow */}
            <pointLight
              position={[0, 0.1, 0]}
              distance={2}
              intensity={1}
              color={config.colors.primary}
            />

            {/* Crystal-like stem segments */}
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh
                key={`stem-${i}`}
                position={[0, (stemHeight * i) / 8, 0]}
                rotation={[0, (i * Math.PI) / 8, 0]}
              >
                <cylinderGeometry
                  args={[0.06 - i * 0.005, 0.08 - i * 0.005, stemHeight / 6, 8]}
                />
                <meshStandardMaterial
                  color={config.colors.stem}
                  metalness={0.9}
                  roughness={0.1}
                  emissive={config.colors.stem}
                  emissiveIntensity={0.3 * growthStage * (isHovered ? 1.5 : 1)}
                />
              </mesh>
            ))}

            {/* Crystal Leaves */}
            {Array.from({ length: 6 }).map((_, i) => (
              <group
                key={`leaf-${i}`}
                position={[0, (stemHeight * (i + 1)) / 7, 0]}
                rotation={[
                  Math.PI / 6,
                  (i * Math.PI * 2) / 3 + Math.sin(time * 0.5 + i) * 0.1,
                  0,
                ]}
              >
                {/* Leaf base */}
                <mesh scale={[0.8, 0.15, 0.15]}>
                  <boxGeometry args={[1, 1, 0.1]} />
                  <meshStandardMaterial
                    color={config.colors.stem}
                    metalness={0.9}
                    roughness={0.1}
                    emissive={config.colors.stem}
                    emissiveIntensity={
                      0.4 * growthStage * (isHovered ? 1.5 : 1)
                    }
                  />
                </mesh>
                {/* Leaf glow */}
                <pointLight
                  position={[0.4, 0, 0]}
                  distance={1}
                  intensity={0.5 * growthStage}
                  color={config.colors.stem}
                />
              </group>
            ))}

            {/* Main flower head - oval shape */}
            <group position={[0, stemHeight, 0]}>
              {/* Outer oval ring */}
              {Array.from({ length: 32 }).map((_, i) => (
                <group
                  key={`ring-${i}`}
                  rotation={[0, (i * Math.PI * 2) / 32, rotationAngle]}
                >
                  <mesh position={[0.8, 0, 0]} scale={[1, 1.8, 0.15]}>
                    <sphereGeometry args={[0.12, 8, 8]} />
                    <meshStandardMaterial
                      color={config.colors.primary}
                      metalness={0.9}
                      roughness={0.1}
                      emissive={config.colors.primary}
                      emissiveIntensity={
                        0.6 * growthStage * (isHovered ? 2 : 1)
                      }
                    />
                  </mesh>
                </group>
              ))}

              {/* Energy field */}
              <mesh scale={[1.6, 1.8, 1.6]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial
                  color={config.colors.energy}
                  metalness={0.9}
                  roughness={0.1}
                  emissive={config.colors.energy}
                  emissiveIntensity={0.2 * growthStage}
                  transparent
                  opacity={0.15}
                />
              </mesh>

              {/* Central star/X pattern */}
              {Array.from({ length: 6 }).map((_, i) => (
                <group
                  key={`star-${i}`}
                  rotation={[0, (i * Math.PI) / 3, Math.PI / 2]}
                >
                  <mesh scale={[1, 0.12, 0.12]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial
                      color={config.colors.accent}
                      metalness={0.9}
                      roughness={0.1}
                      emissive={config.colors.accent}
                      emissiveIntensity={growthStage * (isHovered ? 2 : 1)}
                    />
                  </mesh>
                </group>
              ))}

              {/* Center core */}
              <mesh>
                <sphereGeometry args={[0.35, 32, 32]} />
                <meshStandardMaterial
                  color={config.colors.secondary}
                  metalness={0.9}
                  roughness={0.1}
                  emissive={config.colors.secondary}
                  emissiveIntensity={1.2 * growthStage * (isHovered ? 2 : 1)}
                />
              </mesh>

              {/* Floating energy rings */}
              <group ref={energyRingsRef}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <group
                    key={`energy-${i}`}
                    position={[0, i * 0.25 - 0.4, 0]}
                    rotation={[Math.PI / 2, 0, 0]}
                  >
                    <mesh>
                      <torusGeometry args={[1 - i * 0.15, 0.02, 32, 32]} />
                      <meshStandardMaterial
                        color={config.colors.primary}
                        metalness={0.9}
                        roughness={0.1}
                        emissive={config.colors.primary}
                        emissiveIntensity={
                          0.4 * growthStage * (isHovered ? 2 : 1)
                        }
                        transparent
                        opacity={0.8 - i * 0.1}
                      />
                    </mesh>
                  </group>
                ))}
              </group>
            </group>

            {/* Enhanced particle effects when fully grown */}
            {growthStage >= 1 && (
              <>
                {/* Central beam */}
                <mesh position={[0, stemHeight * 1.5, 0]}>
                  <cylinderGeometry args={[0.04, 0.04, 3, 16]} />
                  <meshStandardMaterial
                    color={config.colors.accent}
                    emissive={config.colors.accent}
                    emissiveIntensity={3}
                    transparent
                    opacity={0.7}
                  />
                </mesh>

                {/* Multiple particle systems for more dramatic effect */}
                <ParticleSystem
                  position={[0, stemHeight + 0.5, 0]}
                  color={config.colors.primary}
                  count={25}
                  spread={2}
                  lifetime={2.5}
                  size={0.08}
                  active={true}
                />
                <ParticleSystem
                  position={[0, stemHeight + 1, 0]}
                  color={config.colors.energy}
                  count={20}
                  spread={1.5}
                  lifetime={2}
                  size={0.06}
                  active={true}
                />
                <ParticleSystem
                  position={[0, stemHeight + 1.5, 0]}
                  color={config.colors.accent}
                  count={15}
                  spread={1}
                  lifetime={1.5}
                  size={0.04}
                  active={true}
                />

                {/* Multiple light sources */}
                <pointLight
                  position={[0, stemHeight, 0]}
                  distance={6}
                  intensity={2.5}
                  color={config.colors.primary}
                />
                <pointLight
                  position={[0, stemHeight + 1.5, 0]}
                  distance={4}
                  intensity={2}
                  color={config.colors.accent}
                />
              </>
            )}
          </group>
        );
      }}
    />
  );
}
