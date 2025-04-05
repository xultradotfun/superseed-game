"use client";

import { useRef } from "react";
import { DirectionalLight } from "three";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
  BrightnessContrast,
  HueSaturation,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function SceneLighting() {
  const mainLightRef = useRef<DirectionalLight>(null);
  const fillLightRef = useRef<DirectionalLight>(null);

  return (
    <>
      {/* Bright blue-tinted ambient light for overall illumination */}
      <ambientLight intensity={0.6} color="#b3d9ff" />

      {/* Main directional light (sun) */}
      <directionalLight
        ref={mainLightRef}
        position={[-5, 8, -5]}
        intensity={1.2}
        color="#fff5e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-bias={-0.0001}
      />

      {/* Fill light for softer shadows */}
      <directionalLight
        ref={fillLightRef}
        position={[4, 6, 4]}
        intensity={0.8}
        color="#ffedd6"
      />

      {/* Subtle rim light */}
      <directionalLight position={[0, 2, -8]} intensity={0.3} color="#b3e6ff" />

      {/* Post-processing effects */}
      <EffectComposer>
        {/* Bloom effect for the glowing elements */}
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.5}
          blendFunction={BlendFunction.SCREEN}
        />

        {/* Color grading */}
        <ToneMapping
          mode={2} // Reinhard tone mapping
          resolution={256}
          adaptive={true}
          adaptationRate={1}
        />

        {/* Brightness and contrast adjustment */}
        <BrightnessContrast
          brightness={0.1} // Slightly brighter
          contrast={0.1} // Slightly more contrast
        />

        {/* Color enhancement */}
        <HueSaturation
          hue={0} // No hue shift
          saturation={0.15} // Slightly more saturated
        />
      </EffectComposer>

      {/* Hemisphere light for sky/ground color interaction */}
      <hemisphereLight
        color="#b3e6ff" // Sky color (light blue)
        groundColor="#509d3f" // Ground color (grass green)
        intensity={0.5}
      />
    </>
  );
}
