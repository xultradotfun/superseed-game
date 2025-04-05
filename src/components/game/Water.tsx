"use client";

import { useRef, useMemo } from "react";
import { useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

// Custom shader material for water
const WaterMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#2196F3"),
    uFoamColor: new THREE.Color("#E3F2FD"),
    uBigWavesElevation: 0.2,
    uBigWavesFrequency: new THREE.Vector2(3, 1.5),
    uBigWaveSpeed: 0.5,
    uSmallWavesElevation: 0.1,
    uSmallWavesFrequency: 2,
    uSmallWavesSpeed: 0.15,
    uSmallWavesIterations: 4,
    uLightPos: new THREE.Vector3(2, 8, 4),
  },
  // Vertex shader
  `
    uniform float uTime;
    uniform float uBigWavesElevation;
    uniform vec2 uBigWavesFrequency;
    uniform float uBigWaveSpeed;
    uniform float uSmallWavesElevation;
    uniform float uSmallWavesFrequency;
    uniform float uSmallWavesSpeed;
    uniform float uSmallWavesIterations;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vElevation;

    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      // Big waves
      float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWaveSpeed) *
                       sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWaveSpeed) *
                       uBigWavesElevation;

      // Small waves
      for(float i = 1.0; i <= uSmallWavesIterations; i++) {
        elevation -= abs(sin(modelPosition.x * uSmallWavesFrequency * i + uTime * uSmallWavesSpeed) *
                        sin(modelPosition.z * uSmallWavesFrequency * i + uTime * uSmallWavesSpeed)) *
                        uSmallWavesElevation / i;
      }
      
      modelPosition.y += elevation;

      // Calculate normal based on elevation gradient
      vec3 normal = normalize(vec3(
        -cos(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWaveSpeed) * uBigWavesElevation,
        1.0,
        -cos(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWaveSpeed) * uBigWavesElevation
      ));
      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
      
      vPosition = position;
      vNormal = normal;
      vElevation = elevation;
    }
  `,
  // Fragment shader
  `
    uniform vec3 uColor;
    uniform vec3 uFoamColor;
    uniform vec3 uLightPos;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vElevation;
    
    void main() {
      // Basic lighting
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(uLightPos);
      float diff = max(dot(normal, lightDir), 0.0);
      
      // Specular highlights
      vec3 viewDir = normalize(cameraPosition - vPosition);
      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
      
      // Wave height based foam
      float foam = smoothstep(-0.05, 0.1, vElevation);
      
      // Final color
      vec3 diffuseColor = mix(uColor, uFoamColor, foam * 0.5);
      vec3 finalColor = diffuseColor * (0.3 + diff * 0.7) + spec * uFoamColor * 0.5;
      
      gl_FragColor = vec4(finalColor, 0.9);
    }
  `
);

// Extend Three.js materials with our custom material
extend({ WaterMaterial });

// Add types for the water material
declare global {
  namespace JSX {
    interface IntrinsicElements {
      waterMaterial: any;
    }
  }
}

type WaterMaterialType = {
  uTime: number;
  uLightPos: THREE.Vector3;
} & THREE.ShaderMaterial;

export function Water() {
  const waterRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<WaterMaterialType>(null);

  // Create a more detailed geometry for better wave effect
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(100, 100, 128, 128);
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uTime = clock.getElapsedTime();
    }
  });

  return (
    <mesh
      ref={waterRef}
      rotation-x={-Math.PI / 2}
      position={[0, -0.8, 0]}
      receiveShadow
    >
      <primitive object={geometry} attach="geometry" />
      <waterMaterial
        ref={materialRef}
        key={WaterMaterial.key}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
