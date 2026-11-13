"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, PerspectiveCamera, Environment, ContactShadows, Center, Float } from "@react-three/drei";
import * as THREE from "three";

// ─── Cinematic Royal Violet Sci-Fi Lighting ───────────────────────────────────
function CinematicLighting() {
  const sweepLightRef = useRef<THREE.PointLight>(null);
  const coreGlowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Specular light sweeping smoothly across the metallic head
    if (sweepLightRef.current) {
      sweepLightRef.current.position.x = -0.10 + Math.sin(time * 0.65) * 2.4;
      sweepLightRef.current.position.y = 1.35 + Math.cos(time * 0.45) * 0.6;
      sweepLightRef.current.position.z = 2.2 + Math.sin(time * 0.35) * 0.5;
    }

    // Glowing violet pulse on the optical eye / sensor core
    if (coreGlowRef.current) {
      coreGlowRef.current.intensity = 3.8 + Math.sin(time * 2.2) * 0.8;
    }
  });

  return (
    <>
      {/* Deep contrast ambient fill */}
      <ambientLight intensity={1.4} color="#0d0b1a" />

      {/* Main Studio Key Light */}
      <directionalLight
        position={[3.0, 6.0, 4.5]}
        intensity={3.6}
        color="#ffffff"
      />

      {/* Symmetrical Royal Violet Rim Lights */}
      <directionalLight
        position={[5.0, 3.0, -3.0]}
        intensity={5.0}
        color="#A855F7"
      />
      <directionalLight
        position={[-5.0, 3.0, -3.0]}
        intensity={4.8}
        color="#8243D9"
      />

      {/* Top Hairline Violet Rim */}
      <directionalLight
        position={[-0.10, 5.5, -2.5]}
        intensity={3.8}
        color="#c084fc"
      />

      {/* Liquid Specular Sweep Light */}
      <pointLight
        ref={sweepLightRef}
        position={[-0.10, 1.35, 2.4]}
        intensity={2.6}
        distance={6.5}
        color="#e9d5ff"
      />

      {/* Glowing Violet Eye / Optical Core Light */}
      <pointLight
        ref={coreGlowRef}
        position={[-0.10, 0.28, 1.4]}
        intensity={3.8}
        distance={3.8}
        color="#a855f7"
      />

      {/* Floor under-glow */}
      <pointLight
        position={[-0.10, -1.1, 1.2]}
        intensity={1.6}
        distance={3.8}
        color="#581c87"
      />
    </>
  );
}

// ─── Centerpiece Autonomous Sentinel Model (OCTOMEM.glb) ──────────────────
function OctomemModel() {
  const { scene } = useGLTF("/3D/OCTOMEM.glb");
  const modelRef = useRef<THREE.Group>(null);
  
  // Model centered in visual stage (-0.10), angled for iconic 3/4 sci-fi perspective (0.22)
  const targetRotation = useRef({ x: 0.04, y: 0.22, z: 0 });
  const targetPosition = useRef({ x: -0.10, y: 0.02, z: 0 });

  useEffect(() => {
    // Enhance materials for polished obsidian & gunmetal finish
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.roughness = 0.20; // Sleek specular gloss
              mat.metalness = 0.90; // Heavy polished gunmetal
              mat.envMapIntensity = 2.2;
              mat.needsUpdate = false;
            }
          });
        }
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!modelRef.current) return;

    const time = state.clock.elapsedTime;
    // Gentle breathing floating motion
    const breathingY = Math.sin(time * 1.5) * 0.012;
    const breathingRoll = Math.sin(time * 0.8) * 0.005;

    // Fluid pointer tracking - model follows mouse cursor smoothly
    const pointerX = state.pointer.x * 0.25;
    const pointerY = state.pointer.y * 0.14;

    targetRotation.current.y = 0.22 + pointerX;
    targetRotation.current.x = 0.04 - pointerY;
    targetRotation.current.z = breathingRoll;
    targetPosition.current.y = 0.02 + breathingY;

    // Fluid damping with delta for 60-120fps smoothness
    modelRef.current.rotation.y = THREE.MathUtils.damp(
      modelRef.current.rotation.y,
      targetRotation.current.y,
      3.2,
      delta
    );
    modelRef.current.rotation.x = THREE.MathUtils.damp(
      modelRef.current.rotation.x,
      targetRotation.current.x,
      3.2,
      delta
    );
    modelRef.current.rotation.z = THREE.MathUtils.damp(
      modelRef.current.rotation.z,
      targetRotation.current.z,
      3.2,
      delta
    );
    modelRef.current.position.y = THREE.MathUtils.damp(
      modelRef.current.position.y,
      targetPosition.current.y,
      3.2,
      delta
    );
    modelRef.current.position.x = THREE.MathUtils.damp(
      modelRef.current.position.x,
      targetPosition.current.x,
      3.2,
      delta
    );
  });

  return (
    <group
      ref={modelRef}
      position={[-0.10, 0.02, 0]}
      rotation={[0.04, 0.22, 0]}
    >
      <Float speed={1.8} rotationIntensity={0.06} floatIntensity={0.12}>
        {/* Exact geometric centering so the sentinel is never sunken or dropped */}
        <Center>
          <primitive object={scene} scale={3.05} />
        </Center>
      </Float>
    </group>
  );
}

// ─── Exported 3D Scene ────────────────────────────────────────────────────────
export default function Octomem3DScene() {
  return (
    <div
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
      title="Drag to rotate OCTOMEM · Move cursor to track"
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        style={{ background: "transparent" }}
      >
        <PerspectiveCamera makeDefault fov={33} position={[0, 0.06, 4.2]} />
        <CinematicLighting />
        <Suspense fallback={null}>
          <OctomemModel />
          {/* Grounded soft ambient floor shadow */}
          <ContactShadows
            position={[-0.10, -1.02, 0]}
            opacity={0.35}
            scale={5.5}
            blur={2.4}
            far={3.2}
            color="#2e1065"
          />
          <Environment preset="night" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          target={[-0.10, 0.06, 0]}
          maxPolarAngle={Math.PI * 0.70}
          minPolarAngle={Math.PI * 0.25}
          rotateSpeed={0.7}
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/3D/OCTOMEM.glb");
