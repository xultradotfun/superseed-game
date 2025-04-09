"use client";

import { useRef, useMemo } from "react";
import { Mesh, Vector3 } from "three";
import { useThree, ThreeEvent } from "@react-three/fiber";
import { useGameState } from "@/game/state/GameState";
import { PlantingIndicator } from "./PlantingIndicator";

export const islandRef = { current: null as Mesh | null };

export function Island() {
  const meshRef = useRef<Mesh>(null);
  const { selectedPlantType, handlePlanting } = useGameState();
  const { raycaster, camera, pointer } = useThree();

  // Memoize grass blades
  const grassBlades = useMemo(
    () =>
      Array.from({ length: 200 }).map((_, i) => {
        const angle = (i / 200) * Math.PI * 2;
        const radius = 4.8 + Math.random() * 0.4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const scale = 0.1 + Math.random() * 0.15;
        const rotation = Math.random() * Math.PI;
        const color = Math.random() > 0.5 ? "#2E7D32" : "#388E3C";
        return { x, z, scale, rotation, color };
      }),
    []
  );

  // Memoize pebbles
  const pebbles = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const radius = Math.random() * 4.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const scale = 0.05 + Math.random() * 0.1;
        const color = Math.random() > 0.5 ? "#c0c0c0" : "#a0a0a0";
        return { x, z, scale, color };
      }),
    []
  );

  // Memoize edge rocks
  const edgeRocks = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const scale = 0.3 + Math.random() * 0.2;
        return { x, z, scale };
      }),
    []
  );

  // Memoize edge grass tufts
  const edgeGrassTufts = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const scale = 0.2 + Math.random() * 0.1;
        return { x, z, scale };
      }),
    []
  );

  // Handle click events for planting
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!selectedPlantType || !meshRef.current) return;

    // Update the raycaster with current pointer position
    raycaster.setFromCamera(pointer, camera);

    // Check intersection with the island
    const intersects = raycaster.intersectObject(meshRef.current);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      // Create a Vector3 for the plant position, placing it exactly at y=0 (soil surface)
      const position = new Vector3(point.x, 0, point.z);
      handlePlanting(position);
    }
  };

  return (
    <group>
      {/* Bottom rock layer */}
      <mesh position={[0, -2.2, 0]} receiveShadow>
        <cylinderGeometry args={[6.5, 4, 2, 8]} />
        <meshStandardMaterial color="#c17f59" roughness={0.8} />
      </mesh>

      {/* Middle rock layer */}
      <mesh position={[0, -1.4, 0]} receiveShadow>
        <cylinderGeometry args={[6, 5.5, 1.6, 10]} />
        <meshStandardMaterial color="#d4916b" roughness={0.7} />
      </mesh>

      {/* Main island body */}
      <mesh
        ref={(mesh) => {
          meshRef.current = mesh;
          islandRef.current = mesh;
        }}
        position={[0, -0.6, 0]}
        receiveShadow
        onClick={handleClick}
      >
        <cylinderGeometry args={[5.2, 5.8, 1.2, 12]} />
        <meshStandardMaterial
          color="#2E7D32"
          roughness={0.8}
          metalness={0.0}
          onBeforeCompile={(shader) => {
            shader.uniforms.time = { value: 0 };
            shader.vertexShader = `
              uniform float time;
              varying vec2 vUv;
              varying vec3 vPosition;
              varying float vElevation;

              // Improved noise function for more natural terrain
              float hash(vec2 p) {
                p = 50.0*fract( p*0.3183099 + vec2(0.71,0.113));
                return -1.0+2.0*fract( p.x*p.y*(p.x+p.y) );
              }

              float noise( in vec2 p ) {
                vec2 i = floor( p );
                vec2 f = fract( p );
                vec2 u = f*f*(3.0-2.0*f);
                return mix( mix( hash( i + vec2(0.0,0.0) ), 
                               hash( i + vec2(1.0,0.0) ), u.x),
                          mix( hash( i + vec2(0.0,1.0) ), 
                               hash( i + vec2(1.0,1.0) ), u.x), u.y);
              }

              // Fractal Brownian Motion for natural terrain
              float fbm(vec2 p) {
                float value = 0.0;
                float amplitude = 0.5;
                float frequency = 1.0;
                for (int i = 0; i < 4; i++) {
                  value += amplitude * noise(p * frequency);
                  amplitude *= 0.5;
                  frequency *= 2.0;
                }
                return value;
              }

              ${shader.vertexShader}
            `.replace(
              "#include <begin_vertex>",
              `
              #include <begin_vertex>
              vUv = uv;
              vPosition = position;

              // Calculate elevation using FBM
              float elevation = fbm(position.xz * 0.5) * 0.2;
              
              // Reduce elevation near edges for smooth transition
              float distanceFromCenter = length(position.xz);
              float edgeFactor = smoothstep(4.0, 5.0, distanceFromCenter);
              elevation *= (1.0 - edgeFactor);

              // Apply elevation
              transformed.y += elevation;
              vElevation = elevation;

              // Add subtle wind movement to grass
              float windStrength = 0.03;
              float windSpeed = time * 0.5;
              float windPattern = fbm(position.xz * 0.5 + windSpeed);
              transformed.xz += windPattern * windStrength * (1.0 - edgeFactor);
              `
            );

            shader.fragmentShader = `
              uniform float time;
              varying vec2 vUv;
              varying vec3 vPosition;
              varying float vElevation;

              // Improved noise functions from vertex shader
              float hash(vec2 p) {
                p = 50.0*fract( p*0.3183099 + vec2(0.71,0.113));
                return -1.0+2.0*fract( p.x*p.y*(p.x+p.y) );
              }

              float noise(vec2 p) {
                vec2 i = floor( p );
                vec2 f = fract( p );
                vec2 u = f*f*(3.0-2.0*f);
                return mix( mix( hash( i + vec2(0.0,0.0) ), 
                               hash( i + vec2(1.0,0.0) ), u.x),
                          mix( hash( i + vec2(0.0,1.0) ), 
                               hash( i + vec2(1.0,1.0) ), u.x), u.y);
              }

              float fbm(vec2 p) {
                float value = 0.0;
                float amplitude = 0.5;
                float frequency = 1.0;
                for (int i = 0; i < 4; i++) {
                  value += amplitude * noise(p * frequency);
                  amplitude *= 0.5;
                  frequency *= 2.0;
                }
                return value;
              }

              ${shader.fragmentShader}
            `.replace(
              "#include <color_fragment>",
              `
              // Base grass colors
              vec3 grassColor = vec3(0.180, 0.490, 0.196);      // #2E7D32
              vec3 darkGrassColor = vec3(0.180, 0.490, 0.196);  // #2E7D32
              vec3 lightGrassColor = vec3(0.220, 0.557, 0.235); // #388E3C
              vec3 dirtColor = vec3(0.545, 0.371, 0.220);

              // Create varied grass pattern
              float grassPattern = fbm(vUv * 20.0);
              float largePattern = fbm(vUv * 5.0);
              
              // Mix different grass colors based on elevation and patterns
              vec3 baseColor = mix(darkGrassColor, grassColor, grassPattern);
              baseColor = mix(baseColor, lightGrassColor, smoothstep(-0.1, 0.1, vElevation));
              
              // Add dirt patches
              float dirtAmount = smoothstep(0.6, 0.8, noise(vUv * 15.0));
              baseColor = mix(baseColor, dirtColor, dirtAmount * 0.3);

              // Add subtle color variation based on height
              float heightColor = smoothstep(-0.1, 0.1, vElevation);
              baseColor *= mix(0.9, 1.1, heightColor);

              // Edge darkening and ambient occlusion
              float edgeFactor = 1.0 - smoothstep(0.8, 1.0, length(vUv - vec2(0.5)));
              float ao = mix(1.0, 0.8, smoothstep(0.0, 0.2, abs(vElevation)));
              
              // Combine all factors
              diffuseColor.rgb = baseColor * ao * mix(0.8, 1.0, edgeFactor);
              
              // Add subtle rim lighting using vNormal
              vec3 viewDir = normalize(cameraPosition - vPosition);
              float rim = 1.0 - max(dot(viewDir, normalize(vNormal)), 0.0);
              rim = pow(rim, 3.0);
              diffuseColor.rgb += rim * 0.1 * lightGrassColor;
              `
            );

            // Add time update for animation
            const updateTime = () => {
              shader.uniforms.time.value = performance.now() * 0.001;
              requestAnimationFrame(updateTime);
            };
            updateTime();
          }}
        />
      </mesh>

      {/* Grass layer with individual blades */}
      <group position={[0, -0.1, 0]}>
        {grassBlades.map((blade, i) => (
          <group
            key={`grass-${i}`}
            position={[blade.x, 0, blade.z]}
            rotation={[0, blade.rotation, 0]}
          >
            <mesh castShadow>
              <boxGeometry args={[0.05, blade.scale, 0.01]} />
              <meshStandardMaterial color={blade.color} roughness={1} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Scattered pebbles */}
      {pebbles.map((pebble, i) => (
        <group key={`pebble-${i}`} position={[pebble.x, 0.02, pebble.z]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[pebble.scale, 6, 6]} />
            <meshStandardMaterial
              color={pebble.color}
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Edge details - rocks */}
      {edgeRocks.map((rock, i) => (
        <group key={i} position={[rock.x, -0.1, rock.z]}>
          <mesh receiveShadow>
            <sphereGeometry args={[rock.scale, 6, 6]} />
            <meshStandardMaterial
              color="#b37148"
              roughness={0.9}
              metalness={0.0}
            />
          </mesh>
        </group>
      ))}

      {/* Edge details - grass tufts */}
      {edgeGrassTufts.map((tuft, i) => (
        <group key={`grass-${i}`} position={[tuft.x, 0, tuft.z]}>
          <mesh receiveShadow>
            <sphereGeometry args={[tuft.scale, 4, 4]} />
            <meshStandardMaterial
              color="#388E3C"
              roughness={1}
              metalness={0.0}
            />
          </mesh>
        </group>
      ))}

      <PlantingIndicator />
    </group>
  );
}
