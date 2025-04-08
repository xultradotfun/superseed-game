"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Group } from "three";

export function GnomeMode() {
  const gnomeRef = useRef<Group>(null);
  const velocityRef = useRef({ x: 0, y: 0, z: 0 });
  const rotationRef = useRef({ yaw: 0, pitch: 0 });
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const mouseRef = useRef({
    isDragging: false,
    previousX: 0,
    previousY: 0,
    sensitivity: 0.005,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDragging = true;
      mouseRef.current.previousX = e.clientX;
      mouseRef.current.previousY = e.clientY;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDragging = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (mouseRef.current.isDragging) {
        const deltaX = e.clientX - mouseRef.current.previousX;
        const deltaY = e.clientY - mouseRef.current.previousY;

        // Update yaw (left/right rotation)
        rotationRef.current.yaw -= deltaX * mouseRef.current.sensitivity;

        // Update pitch (up/down rotation) with limits
        rotationRef.current.pitch += deltaY * mouseRef.current.sensitivity;
        rotationRef.current.pitch = Math.max(
          -Math.PI / 3, // Look up limit (60 degrees)
          Math.min(Math.PI / 3, rotationRef.current.pitch) // Look down limit (60 degrees)
        );

        mouseRef.current.previousX = e.clientX;
        mouseRef.current.previousY = e.clientY;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useFrame((state, delta) => {
    if (!gnomeRef.current) return;

    const MOVE_SPEED = 3;

    const keys = keysPressed.current;
    const rotation = rotationRef.current;
    const velocity = velocityRef.current;

    // Calculate forward direction based on yaw (horizontal only for movement)
    const direction = new Vector3(
      Math.sin(rotation.yaw),
      0,
      Math.cos(rotation.yaw)
    );

    // Calculate movement
    let moveX = 0;
    let moveZ = 0;

    if (keys["w"]) {
      moveX += direction.x;
      moveZ += direction.z;
    }
    if (keys["s"]) {
      moveX -= direction.x;
      moveZ -= direction.z;
    }
    if (keys["a"]) {
      moveX += direction.z;
      moveZ -= direction.x;
    }
    if (keys["d"]) {
      moveX -= direction.z;
      moveZ += direction.x;
    }

    // Normalize movement vector
    const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (length > 0) {
      moveX /= length;
      moveZ /= length;
    }

    // Update velocity with smooth acceleration
    velocity.x = moveX * MOVE_SPEED * delta;
    velocity.z = moveZ * MOVE_SPEED * delta;

    // Apply velocity to position
    gnomeRef.current.position.x += velocity.x;
    gnomeRef.current.position.z += velocity.z;

    // Keep within island bounds (radius = 4.5)
    const distanceFromCenter = Math.sqrt(
      gnomeRef.current.position.x * gnomeRef.current.position.x +
        gnomeRef.current.position.z * gnomeRef.current.position.z
    );
    if (distanceFromCenter > 4.5) {
      const angle = Math.atan2(
        gnomeRef.current.position.z,
        gnomeRef.current.position.x
      );
      gnomeRef.current.position.x = Math.cos(angle) * 4.5;
      gnomeRef.current.position.z = Math.sin(angle) * 4.5;
    }

    // Update camera position and rotation
    const cameraHeight = 0.3;
    state.camera.position
      .copy(gnomeRef.current.position)
      .add(new Vector3(0, cameraHeight, 0));

    // Calculate look direction with both yaw and pitch
    const lookDirection = new Vector3(
      Math.sin(rotation.yaw) * Math.cos(rotation.pitch),
      -Math.sin(rotation.pitch),
      Math.cos(rotation.yaw) * Math.cos(rotation.pitch)
    );

    // Look in the direction of rotation
    const lookAtPoint = new Vector3()
      .copy(state.camera.position)
      .add(lookDirection);
    state.camera.lookAt(lookAtPoint);

    // Only update gnome's horizontal rotation
    gnomeRef.current.rotation.y = rotation.yaw;
  });

  return (
    <group ref={gnomeRef} position={[0, 0, 0]}>
      {/* Gnome body in first person (just hands visible) */}
      <group position={[0.2, 0.3, -0.2]}>
        <mesh>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#FFE0BD" />
        </mesh>
      </group>
      <group position={[-0.2, 0.3, -0.2]}>
        <mesh>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#FFE0BD" />
        </mesh>
      </group>
    </group>
  );
}
