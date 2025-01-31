'use client'

import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei'
import Plane from '../components/plane'
import Paddle from '../components/paddle'
import { useGameSocket } from '@/context/GameSocketContext'

const planeH = 15
const planeW = 11.25
const paddleWidth = 1.875

export default function ThreeScene({ onScoreUpdate, player1, player2 }) {
  const { myPaddel, oppPaddel, ball, move } = useGameSocket()
  const ballRef = useRef()
  const me = myPaddel.y == 0 ? -1 : 1

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          move(me == 1 ? 'left' : 'right')
          break
        case 'ArrowRight':
          move(me == 1 ? 'right' : 'left')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [move, me])

  useEffect(() => {
    if (ballRef.current) {
      ballRef.current.position.set(
        me * (-5.625 + ((ball.x * planeW) / 600)),
        0.2,
        -7.5 + ((ball.y * planeH) / 800)
      )
    }
  }, [ball, me])

  useEffect(() => {
    if (onScoreUpdate) {
      onScoreUpdate({ player1: player1.score, player2: player2.score, winner: player1.score > player2.score ? player1 : player2 })
    }
  }, [onScoreUpdate, player1, player2])

  return (
    <div className="h-full aspect-[1/0.5]">
      <Canvas camera={{ position: [0, 20, 0], fov: 60 }}>
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
        <Paddle position={[me * (-5.625 + myPaddel.x *planeW /600 + paddleWidth /2) ,0, me * ((planeH / 2) -0.1)]} color="red"/>
        <Paddle position={[me * (-5.625 + (oppPaddel.x * planeW)/600 + paddleWidth /2) , 0, me * (-(planeH / 2) + 0.1)]} color="blue"/>

      </Canvas>
    </div>
  )
}
