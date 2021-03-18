import React from 'react'

import * as THREE from 'three'
import { useLoader } from 'react-three-fiber'
import MurTexture from '../assets/img/Mur.jpg'

export default function Wall (position) {
  const textwsureCylinder = useLoader(THREE.TextureLoader, MurTexture)

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 1, 0, 0]} position={position.position} color='yellow'>
        <boxBufferGeometry attach='geometry' args={[30, 10, 2]} />
        <meshStandardMaterial attach='material' map={textwsureCylinder} />

      </mesh>
    </group>
  )
}
