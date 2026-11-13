"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera, Environment, ContactShadows, Center, Float } from "@react-three/drei";
import * as THREE from "three";

function HeadModel() {
  const { scene } = useGLTF("/3D/OCTOMEM_HEAD.glb");
  const modelRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0.04, y: 0.28, z: 0 });
  const targetPosition = useRef({ x: 0, y: -0.15, z: 0 });

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.roughness = 0.2;
              mat.metalness = 0.92;
              mat.envMapIntensity = 2.0;
              mat.needsUpdate = true;
            }
          });
        }
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!modelRef.current) return;

    const time = state.clock.elapsedTime;
    const breathingY = Math.sin(time * 1.6) * 0.02;

    // Fluid pointer tracking - head follows mouse cursor smoothly
    const pointerX = state.pointer.x * 0.28;
    const pointerY = state.pointer.y * 0.16;

    targetRotation.current.y = 0.28 + pointerX;
    targetRotation.current.x = 0.04 - pointerY;
    targetPosition.current.y = -0.15 + breathingY;

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
    modelRef.current.position.y = THREE.MathUtils.damp(
      modelRef.current.position.y,
      targetPosition.current.y,
      3.2,
      delta
    );
  });

  return (
    <group ref={modelRef}>
      <Float speed={2.0} rotationIntensity={0.12} floatIntensity={0.25}>
        <Center top>
          <primitive object={scene} scale={3.35} />
        </Center>
      </Float>
    </group>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={1.6} color="#ffffff" />
      {/* Primary Key Light */}
      <directionalLight
        position={[4, 8, 5]}
        intensity={3.4}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Soft Sky Blue Fill Light */}
      <directionalLight
        position={[-5, 3, 4]}
        intensity={1.8}
        color="#bae6fd"
      />
      {/* Vibrant Violet Rim Light */}
      <directionalLight
        position={[0, 4, -4]}
        intensity={3.2}
        color="#8243D9"
      />
      {/* Eye / Core Accent */}
      <pointLight position={[0, 0.2, 1.2]} intensity={2.2} distance={3.5} color="#c084fc" />
    </>
  );
}

export default function OctomemHeadScene() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <PerspectiveCamera makeDefault fov={34} position={[0, 0.1, 3.8]} />
        <SceneLighting />
        <Suspense fallback={null}>
          <HeadModel />
          <ContactShadows
            position={[0, -0.95, 0]}
            opacity={0.32}
            scale={6.5}
            blur={2.4}
            far={3.5}
            color="#0f172a"
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/3D/OCTOMEM_HEAD.glb");
