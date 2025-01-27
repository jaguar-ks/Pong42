'use client'

import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei'
import Plane from '../components/plane'
import Paddle from '../components/paddle'
import { useGameSocket } from '@/context/GameSocketContext'
import { useUserContext } from '@/context/UserContext'

const planeH = 15
const planeW = 11.25

export default function ThreeScene({ onScoreUpdate, player1, player2 }) {
  const { myPaddel, oppPaddel, ball, move } = useGameSocket()
  const ballRef = useRef()

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          move('left')
          break
        case 'ArrowRight':
          move('right')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [move])

  useEffect(() => {
    console.log(ball.current)
    if (ballRef.current) {
      ballRef.current.position.set(
        -5.625 + ((ball.current.x * planeW) / 600),
        0.2,
        -7.5 + ((ball.current.y * planeH) / 800)
      )
    }
  }, [ball])

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
        <Paddle position={[myPaddel.current.x, myPaddel.current.y, (planeH / 2) - 0.1]} />
        <Paddle position={[oppPaddel.current.x, oppPaddel.current.y, -(planeH / 2) + 0.01]} />
      </Canvas>
    </div>
  )
}
