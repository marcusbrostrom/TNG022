import React, { useRef, Suspense } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useLoader, Canvas, useFrame } from 'react-three-fiber'

function Loading () {
  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach='geometry' args={[1, 16, 16]} />
      <meshStandardMaterial
        attach='material'
        color='white'
        transparent
        opacity={0.6}
        roughness={1}
        metalness={0}
      />
    </mesh>
  )
}

function ArWing () {
  const group = useRef()
  const { nodes } = useLoader(GLTFLoader, '../models/arwing.glb')
  // useFrame will run outside of react in animation frames to optimize updates.
  useFrame(() => { group.current.rotation.y += 0.004 }); return (
  // Add a ref to the group. This gives us a hook to manipulate the properties of this geometry in the useFrame callback.
    <group ref={group}>
      <mesh visible geometry={nodes.Default.geometry}>
        <meshStandardMaterial
          attach='material'
          color='white'
          roughness={0.3}
          metalness={0.3}
        />
      </mesh>
    </group>
  )
}

export default function Object () {
  return (
    null
  )
}
