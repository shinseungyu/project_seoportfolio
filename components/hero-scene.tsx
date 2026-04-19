"use client"

import { useRef, useState, useEffect, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.cos(t / 2) / 8 + 0.25, 0.1)
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, Math.sin(t / 4) / 4, 0.1)
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, Math.sin(t / 4) / 4, 0.1)
    
    // Mouse interaction
    const mouseX = (state.mouse.x * Math.PI) / 10
    const mouseY = (state.mouse.y * Math.PI) / 10
    meshRef.current.rotation.x += mouseY * 0.05
    meshRef.current.rotation.y += mouseX * 0.05
  })

  return (
    <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
      <Sphere
        ref={meshRef}
        args={[1, 100, 100]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color={hovered ? "#818cf8" : "#6366f1"}
          speed={4}
          distort={0.4}
          radius={1}
          metalness={0.6}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  )
}

export function HeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="absolute inset-0 z-0 bg-transparent" />;

  return (
    <div className="absolute inset-0 z-0 h-full w-full opacity-40 md:opacity-60 transition-opacity duration-1000">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#10b981" />
          <AnimatedSphere />
        </Suspense>
      </Canvas>
    </div>
  )
}
