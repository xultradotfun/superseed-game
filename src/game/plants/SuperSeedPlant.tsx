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
    primary: "#4ff4ff", // Bright ethereal cyan
    secondary: "#b4fff3", // Soft cyan glow
    stem: "#2dd4bf", // Teal stem
    accent: "#e2fff9", // Soft white
    energy: "#00e5ff", // Deep cyan energy
    core: "#91fff5", // Inner glow
    glow: "#b8fff7", // Outer glow
  },
  glowIntensity: 3,
  hitboxSize: 1.5,
  disableHarvest: true,
};

type SuperSeedProps = Omit<BasePlantProps, "config" | "renderPlantModel">;

export function SuperSeedPlant(props: SuperSeedProps) {
  const energyRingsRef = useRef<Group>(null);
  const { showVictoryModal } = useGameState();
  const { camera, controls } = useThree();
  const growthStage = props.growthStage ?? 0;

  // Victory celebration effect
  useEffect(() => {
    if (growthStage >= 1) {
      const baseHeight = 0.4 + growthStage * 2.0;
      const beamHeight = baseHeight * 1.5;
      const scale = 2.0;
      const totalHeight = beamHeight * scale;

      // Disable orbit controls
      if (controls) {
        (controls as unknown as { enabled: boolean }).enabled = false;
      }

      // Create a master timeline
      const masterTimeline = gsap.timeline({
        onComplete: () => {
          // Re-enable orbit controls
          if (controls) {
            (controls as unknown as { enabled: boolean }).enabled = true;
          }

          showVictoryModal({
            title: "🌱 SuperSeed Prophecy Fulfilled! 🌟",
            message:
              "Congratulations, brave gardener! You've discovered and grown the legendary SuperSeed - a mystical plant inspired by Superseed, the first blockchain that repays your debt.\n\n" +
              "Through your mastery of the garden's ethereal plants, you've unlocked the secrets of Supercollateral: a revolutionary system of self-repaying loans powered by Proof of Repayment.\n\n" +
              "Your SuperSeedjourney has only begun...",
            links: [
              {
                text: "🌐 Explore Superseed Mainnet",
                url: "https://superseed.xyz",
                description:
                  "Discover self-repaying loans and join the future of DeFi",
              },
              {
                text: "𝕏 Follow 0x_ultra",
                url: "https://twitter.com/0x_ultra",
                description: "Follow the creator on X",
              },
            ],
          });
        },
      });

      // Camera movement
      masterTimeline.to(camera.position, {
        y: totalHeight * 3,
        z: totalHeight * 4,
        duration: 2,
        ease: "power2.inOut",
      });

      // Add continuous spinning animation
      const spinAnimation = gsap.to(camera.position, {
        duration: 8,
        repeat: -1,
        onUpdate: () => {
          const time = Date.now() * 0.001;
          const radius = totalHeight * 4;
          camera.position.x = Math.sin(time * 0.5) * radius;
          camera.position.z = Math.cos(time * 0.5) * radius;
          camera.lookAt(0, totalHeight * 0.8, 0);
        },
      });

      // Cleanup
      return () => {
        // Re-enable orbit controls on cleanup
        if (controls) {
          (controls as unknown as { enabled: boolean }).enabled = true;
        }
        gsap.killTweensOf(camera.position);
        spinAnimation.kill();
      };
    }
  }, [growthStage, camera, controls, showVictoryModal]);

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
      renderPlantModel={({ plantRef, growthStage }) => {
        const scale = 2.0;
        const stemHeight = 0.4 + growthStage * 2.0;

        return (
          <group ref={plantRef} scale={[scale, scale, scale]}>
            {/* Ground glow effect */}
            <pointLight
              position={[0, 0.1, 0]}
              distance={2}
              intensity={0.5 * growthStage}
              color={config.colors.glow}
            />

            {/* Ethereal base glow */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.6, 32]} />
              <meshStandardMaterial
                color={config.colors.glow}
                emissive={config.colors.glow}
                emissiveIntensity={0.4 * growthStage}
                transparent
                opacity={0.3}
              />
            </mesh>

            {/* Organic stem */}
            <group>
              {Array.from({ length: 6 }).map((_, i) => {
                const y = (stemHeight * i) / 5;
                const curve = Math.sin(y * 2) * 0.1;
                return (
                  <mesh
                    key={`stem-${i}`}
                    position={[curve, y, 0]}
                    rotation={[0, 0, curve]}
                  >
                    <cylinderGeometry
                      args={[
                        0.08 - i * 0.01,
                        0.1 - i * 0.01,
                        stemHeight / 4,
                        12,
                      ]}
                    />
                    <meshStandardMaterial
                      color={config.colors.stem}
                      metalness={0.3}
                      roughness={0.7}
                    />
                  </mesh>
                );
              })}
            </group>

            {/* Ethereal energy wisps */}
            {Array.from({ length: 5 }).map((_, i) => (
              <group
                key={`wisp-${i}`}
                position={[
                  Math.sin((i / 5) * Math.PI * 2) * 0.2,
                  (stemHeight * (i + 1)) / 6,
                  Math.cos((i / 5) * Math.PI * 2) * 0.2,
                ]}
              >
                <mesh rotation={[0, (i / 5) * Math.PI * 2, 0]}>
                  <sphereGeometry args={[0.15, 8, 8]} />
                  <meshStandardMaterial
                    color={config.colors.energy}
                    emissive={config.colors.energy}
                    emissiveIntensity={
                      growthStage *
                      (Math.sin(Date.now() * 0.001 + i) * 0.5 + 0.5)
                    }
                    transparent
                    opacity={0.6}
                  />
                </mesh>
                <pointLight
                  distance={1}
                  intensity={0.3 * growthStage}
                  color={config.colors.energy}
                />
              </group>
            ))}

            {/* Flower head */}
            <group position={[0, stemHeight, 0]}>
              {/* Inner core */}
              <mesh>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial
                  color={config.colors.core}
                  emissive={config.colors.core}
                  emissiveIntensity={growthStage}
                  metalness={0.5}
                  roughness={0.2}
                />
              </mesh>

              {/* Organic petals */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const radius = 0.4;
                return (
                  <group
                    key={`petal-${i}`}
                    rotation={[
                      Math.PI / 3 + Math.sin(Date.now() * 0.001 + i) * 0.1,
                      angle,
                      Math.PI / 6,
                    ]}
                  >
                    <mesh position={[radius * 0.7, 0, 0]}>
                      <sphereGeometry args={[0.2, 8, 4]} />
                      <meshStandardMaterial
                        color={config.colors.primary}
                        emissive={config.colors.primary}
                        emissiveIntensity={growthStage * 0.4}
                        metalness={0.3}
                        roughness={0.6}
                      />
                    </mesh>
                  </group>
                );
              })}

              {/* Ethereal aura rings */}
              <group rotation={[Math.PI / 2, 0, Date.now() * 0.0005]}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <mesh key={`aura-${i}`} rotation={[(Math.PI / 6) * i, 0, 0]}>
                    <ringGeometry args={[0.5 + i * 0.2, 0.52 + i * 0.2, 32]} />
                    <meshStandardMaterial
                      color={config.colors.secondary}
                      emissive={config.colors.secondary}
                      emissiveIntensity={growthStage * 0.3}
                      transparent
                      opacity={0.3 - i * 0.1}
                    />
                  </mesh>
                ))}
              </group>
            </group>

            {/* Victory state effects */}
            {growthStage >= 1 && (
              <>
                {/* Ethereal aura */}
                <mesh position={[0, stemHeight, 0]}>
                  <sphereGeometry args={[1.2, 32, 32]} />
                  <meshStandardMaterial
                    color={config.colors.glow}
                    emissive={config.colors.glow}
                    emissiveIntensity={0.4}
                    transparent
                    opacity={0.15}
                  />
                </mesh>

                {/* Particle effects */}
                <ParticleSystem
                  position={[0, stemHeight, 0]}
                  color={config.colors.glow}
                  count={30}
                  spread={1.5}
                  lifetime={3}
                  size={0.08}
                  active={true}
                />

                {/* Ambient glow */}
                <pointLight
                  position={[0, stemHeight, 0]}
                  distance={5}
                  intensity={1.5}
                  color={config.colors.glow}
                />
              </>
            )}
          </group>
        );
      }}
    />
  );
}
