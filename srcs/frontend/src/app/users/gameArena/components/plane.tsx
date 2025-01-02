'use client'

import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import arenaImg from '@/../assets/arena.jpg'
import blackImg from '@/../assets/black.jpeg'

const planeH = 15
const planeW = 10

export default function Plane() {
  const textures = useTexture({
    inside: arenaImg.src,
    outside: blackImg.src
  })

  const materials = [
    new THREE.MeshStandardMaterial({ map: textures.outside, side: THREE.BackSide }), // right
    new THREE.MeshStandardMaterial({ map: textures.outside, side: THREE.BackSide }), // left
    new THREE.MeshStandardMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide }), // top
    new THREE.MeshStandardMaterial({ map: textures.inside, side: THREE.BackSide }), // bottom
    new THREE.MeshStandardMaterial({ map: textures.outside, side: THREE.BackSide }), // front
    new THREE.MeshStandardMaterial({ map: textures.outside, side: THREE.BackSide })  // back
  ]

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[0, -5, 0]} intensity={1} />
      <mesh material={materials}>
        <boxGeometry args={[planeW, 0, planeH]} />
      </mesh>
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(planeW, 0.3, planeH)]} />
        <lineBasicMaterial attach="material" color="#ff0" />
      </lineSegments>
    </group>
  )
}

