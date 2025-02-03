'use client'

export default function Paddle({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[2, 0.2, 0.2]} />
      <meshPhongMaterial color="red" />
    </mesh>
  )
}

