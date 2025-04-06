"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Color, Matrix4, InstancedMesh } from "three";

type Particle = {
  position: Vector3;
  velocity: Vector3;
  life: number;
  maxLife: number;
  color: Color;
};

type ParticleSystemProps = {
  position: [number, number, number];
  color?: string;
  count?: number;
  spread?: number;
  lifetime?: number;
  size?: number;
  active?: boolean;
};

export function ParticleSystem({
  position,
  color = "#ffffff",
  count = 20,
  spread = 0.5,
  lifetime = 1,
  size = 0.05,
  active = false,
}: ParticleSystemProps) {
  const particles = useRef<Particle[]>([]);
  const meshRef = useRef<InstancedMesh>(null);

  // Initialize particles
  useMemo(() => {
    particles.current = Array.from({ length: count }, () => ({
      position: new Vector3(...position),
      velocity: new Vector3(
        (Math.random() - 0.5) * spread,
        Math.random() * spread,
        (Math.random() - 0.5) * spread
      ),
      life: 0,
      maxLife: lifetime + Math.random() * lifetime * 0.5,
      color: new Color(color),
    }));
  }, [count, position, spread, lifetime, color]);

  useFrame((_, delta) => {
    if (!meshRef.current || !active) return;

    const matrix = new Matrix4();
    const gravity = new Vector3(0, -2, 0);

    particles.current.forEach((particle, i) => {
      if (particle.life >= particle.maxLife) {
        // Reset particle
        particle.position.set(...position);
        particle.velocity.set(
          (Math.random() - 0.5) * spread,
          Math.random() * spread,
          (Math.random() - 0.5) * spread
        );
        particle.life = 0;
      }

      // Update particle
      particle.velocity.add(gravity.multiplyScalar(delta));
      particle.position.add(particle.velocity.multiplyScalar(delta));
      particle.life += delta;

      // Set transform
      const scale = 1 - particle.life / particle.maxLife;
      matrix.makeScale(scale * size, scale * size, scale * size);
      matrix.setPosition(particle.position);
      if (meshRef.current) {
        meshRef.current.setMatrixAt(i, matrix);
      }
    });

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </instancedMesh>
  );
}
