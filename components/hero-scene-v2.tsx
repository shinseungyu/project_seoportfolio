"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function HeroSceneV2() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return

    let renderer: THREE.WebGLRenderer
    let scene: THREE.Scene
    let camera: THREE.PerspectiveCamera
    let frameId: number
    
    // Starfield elements
    const starCount = 1000
    const stars: {
      position: THREE.Vector3
      velocity: THREE.Vector3
      twinkleSpeed: number
      phase: number
      originalSize: number
    }[] = []
    
    let starGeometry: THREE.BufferGeometry
    let starPoints: THREE.Points

    const init = () => {
      const container = containerRef.current
      if (!container) return

      const width = container.clientWidth || window.innerWidth
      const height = container.clientHeight || window.innerHeight

      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
      camera.position.z = 5

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      container.appendChild(renderer.domElement)

      // Create a soft circle texture for stars (Bokeh effect)
      const createCircleTexture = () => {
        const canvas = document.createElement("canvas")
        canvas.width = 64
        canvas.height = 64
        const context = canvas.getContext("2d")
        if (!context) return null
        
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
        gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.8)")
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.2)")
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        
        context.fillStyle = gradient
        context.fillRect(0, 0, 64, 64)
        
        const texture = new THREE.CanvasTexture(canvas)
        return texture
      }

      const starTexture = createCircleTexture()

      // Initialize Stars
      const positions = new Float32Array(starCount * 3)
      const colors = new Float32Array(starCount * 3)
      const sizes = new Float32Array(starCount)

      // Color Palette: White, Cyan (Ice Blue), Gold, Amber
      const palette = [
        new THREE.Color(0xffffff), // White
        new THREE.Color(0xa5f3fc), // Cyan-100
        new THREE.Color(0xffd700), // Gold
        new THREE.Color(0xf59e0b), // Amber-500
        new THREE.Color(0xfef3c7)  // Yellow-100 (Cream)
      ]

      for (let i = 0; i < starCount; i++) {
        // Distribute in a Large Cylinder/Cloud
        const radius = Math.random() * 25
        const angle = Math.random() * Math.PI * 2
        const x = Math.cos(angle) * radius
        const y = (Math.random() - 0.5) * 15
        const z = (Math.random() - 0.5) * 20 - 5
        
        const starSize = Math.random() * 0.15 + 0.05
        const color = palette[Math.floor(Math.random() * palette.length)]

        stars.push({
          position: new THREE.Vector3(x, y, z),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.002,
            (Math.random() - 0.5) * 0.002,
            (Math.random() - 0.5) * 0.002
          ),
          twinkleSpeed: 0.01 + Math.random() * 0.02,
          phase: Math.random() * Math.PI * 2,
          originalSize: starSize
        })
        
        positions[i * 3] = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z

        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        sizes[i] = starSize
      }

      starGeometry = new THREE.BufferGeometry()
      starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
      starGeometry.setAttribute("starSize", new THREE.BufferAttribute(sizes, 1))

      const starMaterial = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        map: starTexture,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })

      starPoints = new THREE.Points(starGeometry, starMaterial)
      scene.add(starPoints)

      const handleMouseMove = (event: MouseEvent) => {
        mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
        mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
      }
      window.addEventListener("mousemove", handleMouseMove)

      const animate = () => {
        frameId = requestAnimationFrame(animate)
        
        const positionsAttr = starGeometry.attributes.position as THREE.BufferAttribute
        const time = Date.now() * 0.001

        for (let i = 0; i < starCount; i++) {
          const s = stars[i]
          
          // Organic Drifting
          s.position.x += s.velocity.x + Math.sin(time * 0.5 + s.phase) * 0.001
          s.position.y += s.velocity.y + Math.cos(time * 0.5 + s.phase) * 0.001
          s.position.z += s.velocity.z

          // Reset if too far
          if (s.position.z > 5) s.position.z = -20
          if (Math.abs(s.position.x) > 25) s.position.x *= -0.95
          if (Math.abs(s.position.y) > 15) s.position.y *= -0.95

          positionsAttr.setXYZ(i, s.position.x, s.position.y, s.position.z)
        }
        positionsAttr.needsUpdate = true

        // Parallax / Camera smooth move
        camera.position.x += (mouseRef.current.x * 2 - camera.position.x) * 0.05
        camera.position.y += (-mouseRef.current.y * 2 - camera.position.y) * 0.05
        camera.lookAt(0, 0, -5)

        // Scene Slow Rotation
        scene.rotation.y += 0.0003
        scene.rotation.x += 0.0001

        renderer.render(scene, camera)
      }
      animate()

      const handleResize = () => {
        const w = container.clientWidth || window.innerWidth
        const h = container.clientHeight || window.innerHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      window.addEventListener("resize", handleResize)
    }

    const rafId = requestAnimationFrame(() => init())

    return () => {
      cancelAnimationFrame(rafId)
      cancelAnimationFrame(frameId)
      if (renderer) {
        if (containerRef.current?.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement)
        }
        renderer.dispose()
      }
      if (starGeometry) starGeometry.dispose()
      window.removeEventListener("mousemove", () => {}) 
      window.removeEventListener("resize", () => {})
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 h-full w-full opacity-60 pointer-events-none"
      id="hero-3d-starfield"
    />
  )
}
