'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import Plane from '../components/plane';
import Paddle from '../components/paddle';
import { useGameSocket } from '@/context/GameSocketContext';
import WinnerCared from './WinnerCared';

const planeH = 15;
const planeW = 11.25;
const paddleWidth = 1.875;

export default function ThreeScene({ onScoreUpdate }) {
  const { myPaddel, oppPaddel, ball, move, gameEnded, winner, me: wsMe } = useGameSocket();
  const ballRef = useRef();

  // Memoize player position calculation
  const me = useMemo(() => (myPaddel.y === 0 ? -1 : 1), [myPaddel.y]);

  // Score update handler
  const handleScoreUpdate = useCallback(() => {
    onScoreUpdate?.({
      player1: myPaddel.score,
      player2: oppPaddel.score,
      winner: myPaddel.score > oppPaddel.score ? myPaddel : oppPaddel,
    });
  }, [onScoreUpdate, myPaddel.score, oppPaddel.score]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          move(me === 1 ? 'left' : 'right');
          break;
        case 'ArrowRight':
          move(me === 1 ? 'right' : 'left');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, me]); // Added missing 'me' dependency

  // Ball position updates
  useEffect(() => {
    if (ballRef.current) {
      ballRef.current.position.set(
        me * (-5.625 + ((ball.x * planeW) / 600)),
        0.2,
        -7.5 + ((ball.y * planeH) / 800)
      );
    }
  }, [ball.x, ball.y, me]); // Added missing 'me' dependency

  // Score updates
  useEffect(() => {
    handleScoreUpdate();
  }, [handleScoreUpdate]);

  // Fixed JSX structure
  return (
    // <div className="flex w-[calc(90vw-250px)] h-[calc(90vh-80px)] mr-10 ml-10">
      (
        gameEnded 
          ? 
        <WinnerCared player={wsMe} winner={winner} />
          :
          <div className="w-full h-full ">
          <Canvas
            camera={{ position: [0, 20, 0], fov: 60 }}
            gl={{ alpha: true }}  // Enable alpha channel
            onCreated={({ gl }) => {
              gl.setClearColor(0xffffff, 0.5); // Black with 50% opacity
            }}
            style={{ background: 'transparent' }} // Fallback CSS
          >
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
          <Paddle
            position={[
              me * (-5.625 + (myPaddel.x * planeW) / 600 + paddleWidth / 2),
              0,
              me * (planeH / 2 - 0.1),
            ]}
            color="red"
            />
          <Paddle
            position={[
              me * (-5.625 + (oppPaddel.x * planeW) / 600 + paddleWidth / 2),
              0,
              me * (-(planeH / 2) + 0.1),
            ]}
            color="blue"
            />
          </Canvas>
          </div>
      )
    // </div>
  );
}