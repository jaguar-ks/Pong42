'use client'

import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei'
import Plane from '../components/plane'
import Paddle from '../components/paddle'

const planeH = 15
const planeW = 10

export default function ThreeScene({ onScoreUpdate, player1, player2}) {
  const [paddle1Pos, setPaddle1Pos] = useState([0, 0, (planeH / 2) - 0.1])
  const [paddle2Pos, setPaddle2Pos] = useState([0, 0, -(planeH / 2) + 0.1])
  const ballRef = useRef()

  useEffect(() => {
    let paddle1Direction = 0
    let paddle2Direction = 0

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          paddle1Direction = -1
          break
        case 'ArrowRight':
          paddle1Direction = 1
          break
        case 'a':
          paddle2Direction = -1
          break
        case 'd':
          paddle2Direction = 1
          break
      }
    }

    const handleKeyUp = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          paddle1Direction = 0
          break
        case 'a':
        case 'd':
          paddle2Direction = 0
          break
      }
    }

    const animate = () => {
      setPaddle1Pos(prev => [
        Math.max(Math.min(prev[0] + paddle1Direction * 0.5, 4), -4),
        prev[1],
        prev[2]
      ])
      setPaddle2Pos(prev => [
        Math.max(Math.min(prev[0] + paddle2Direction * 0.5, 4), -4),
        prev[1],
        prev[2]
      ])
      requestAnimationFrame(animate)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    animate()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <div className="h-full aspect-[1/0.5]">
      <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
        <OrbitControls />
        <ambientLight intensity={0.4} />
        <Plane />
        <Sphere ref={ballRef} args={[0.2, 32, 32]} position={[0, 0.2, 0]}>
          <meshPhysicalMaterial
            color="white"
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </Sphere>
        <Paddle position={paddle1Pos as [number, number, number]} />
        <Paddle position={paddle2Pos as [number, number, number]} />
      </Canvas>
    </div>
  )
}
