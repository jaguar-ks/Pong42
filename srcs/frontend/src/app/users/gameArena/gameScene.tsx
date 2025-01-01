'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface GameSceneProps {
  cameraView: 'front' | 'side'
  isActive: boolean
}

export function GameScene({ cameraView, isActive }: GameSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    cube: THREE.Mesh
    animationFrameId?: number
  }>()

  useEffect(() => {
    if (!containerRef.current) return

    // Setup scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Create a cube
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    camera.position.z = 5

    // Animation
    const animate = () => {
      if (!isActive) return
      
      const animationFrameId = requestAnimationFrame(animate)
      sceneRef.current!.animationFrameId = animationFrameId

      cube.rotation.x += 0.01
      cube.rotation.y += 0.01

      renderer.render(scene, camera)
    }

    sceneRef.current = { scene, camera, renderer, cube }
    
    if (isActive) {
      animate()
    }

    // Cleanup
    return () => {
      if (sceneRef.current?.animationFrameId) {
        cancelAnimationFrame(sceneRef.current.animationFrameId)
      }
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [isActive])

  // Update camera position based on view
  useEffect(() => {
    if (!sceneRef.current) return

    const { camera } = sceneRef.current
    
    if (cameraView === 'front') {
      camera.position.set(0, 0, 5)
    } else {
      camera.position.set(5, 0, 0)
    }
    
    camera.lookAt(0, 0, 0)
  }, [cameraView])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return

      const { camera, renderer } = sceneRef.current
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}

