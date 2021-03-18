
import React from 'react'
import './App.scss'
import { useThree } from 'react-three-fiber'
import { CubeTextureLoader } from 'three'
import firstImgK from './assets/img/L1.png'
import heaven from './assets/img/L2.png'
import thirdImg from './assets/img/L3.png'
import fourthImg from './assets/img/L4.png'
import ground from './assets/img/L5.png'
import sixthImgK from './assets/img/L6.png'

export default function SkyBox () {
  const { scene } = useThree()
  const loader = new CubeTextureLoader() // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
  const texture = loader.load([fourthImg, sixthImgK, heaven, ground, thirdImg, firstImgK]) // Set the scene background property to the resulting texture.
  scene.background = texture
  return null
}
