'use client'

export default function Paddle({ position, color }: { position: [number, number, number] , color: string }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1.875,0.375, 0.375]} />
      <meshPhongMaterial color={color} />
    </mesh>
  )
}

