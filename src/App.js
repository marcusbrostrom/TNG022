
import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import './App.scss'
import { Canvas, useFrame, useThree, useLoader } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import RangeSlider from 'react-bootstrap-range-slider'
import './components/constants.js'
import Skybox from './Skybox.js'
import Objects from './components/Object.js'
import woodTest from './assets/img/door_1.jpg'
import woodTestR from './assets/img/door_2.jpg'
import golvTexture from './assets/img/dirt.jpg'
import batteringTexture from './assets/img/batteringZ.jpg'
import WallStone from './components/wall.js'

const massa = 5000
const line = 1
const vinkelGrader = 50
let radianer = vinkelGrader * 0.0175
let volume = massa / 663
let basArea = Math.sqrt(volume / 2.5)
let lengthLog = 2.5 * basArea
let radie = Math.sqrt(basArea / Math.PI)
const inertiaY = (massa * radie ^ 2) / 4 + (massa * lengthLog ^ 2) / 12 + (massa * line)
const stepH = 1 / 1000
let kraft = massa * 9.82
let angVel = 0
let kraftZ = -kraft * Math.sin(radianer)
let torque = 0
let angAcc = 0
let posX = line * Math.sin(radianer)
let posY = line - line * Math.cos(radianer)
let broms = 1
const thicknessWall = 0.5
let wall = -8
let onHit = false
let doorRight = 0
let doorLeft = -doorRight
let hitPos = (wall + lengthLog / 2 + thicknessWall / 2)
let wallRightPosX = -5.1
let wallLeftPosX = 5.1
let wallForce = 0

const Slider = ({ minVal, maxVal, stepH, onChange }) => {
  const handleChange = (changeEvent) => {
    setValue(changeEvent.target.value)
    onChange(changeEvent.target.value)
  }
  const [value, setValue] = useState(0)
  return (
    <RangeSlider
      min={minVal} max={maxVal} step={stepH}
      value={value}
      onChange={handleChange}
    />
  )
}

const Menu = ({ onSlider, onSlider2, onGrader }) => {
  return (
    <div id='sliderDiv'>
      <p>Length of rpe</p>
      <Slider id='slider' minVal={[1]} maxVal={[20]} stepH='0.5' onChange={onSlider} />
      <p>Mass</p>

      <Slider id='sliderMassa' minVal={[5000]} maxVal={[20000]} stepH='0.5' onChange={onSlider2} />
      <p>Angle</p>
      <Slider id='slidervinkelGrader' minVal={[0]} maxVal={[90]} stepH='0.5' onChange={onGrader} />
    </div>

  )
}
const Update = (line, massa, vinkelGrader, start) => {
  volume = massa / 663
  basArea = Math.sqrt(volume / 2.5)
  lengthLog = 2.5 * basArea
  radie = Math.sqrt(basArea / Math.PI)
  kraftZ = -kraft * Math.sin(radianer)
  torque = line * kraftZ
  hitPos = (wall + lengthLog / 2 + thicknessWall / 2)

  if (start === true) {
    broms = -angVel * 0.15
    angAcc = (1 / inertiaY) * torque + broms
    angVel += angAcc * stepH
    radianer += stepH * angVel
    posY = line - line * Math.cos(radianer)
    posX = line * Math.sin(radianer)

    if (posX < hitPos && onHit === false) {
      wallForce = angVel
      angVel = 0
      kraft = kraft / 10
      onHit = true
    }
  } else {
    radianer = vinkelGrader * 0.0175
    onHit = false
    kraft = massa * 9.82
    posY = line - line * Math.cos(radianer)
    posX = line * Math.sin(radianer)
  }
}

const SpinningMesh = ({ position, args, color, line, massa, vinkelGrader, start }) => {
  useFrame(() => (Update(line, massa, vinkelGrader, start)))

  const mesh = useRef(null)

  useFrame(() => (mesh.current.position.z = posX))
  useFrame(() => (mesh.current.position.y = posY + 3))
  const textureCylinder = useLoader(THREE.TextureLoader, batteringTexture)

  return (
    <mesh castShadow position={position} ref={mesh} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderBufferGeometry attach='geometry' args={[radie, radie, lengthLog, 32]} />
      <meshStandardMaterial attach='material' map={textureCylinder} />
    </mesh>
  )
}
const UpdateDoors = ({ start }) => {
  if (onHit === true && doorRight > -Math.PI / 2) {
    doorRight += wallForce / 1000
    wallForce -= wallForce / 60
    doorLeft = -doorRight
    console.log(doorRight)
    wallRightPosX = -(5 - Math.cos(doorRight) * 5) - 5.1
    wallLeftPosX = 5 - Math.cos(doorLeft) * 5 + 5.1
    wall = Math.sin(doorRight) * 5 - 8
  } else if (onHit === false) {
    doorRight = 0
    doorLeft = 0
    wallRightPosX = -5.1
    wallLeftPosX = 5.1
    wall = -8
  }
}

const WallRight = ({ start }) => {
  useFrame(() => (UpdateDoors(start)))
  const mesh = useRef(null)
  useFrame(() => (mesh.current.rotation.y = doorRight))
  useFrame(() => (mesh.current.position.x = wallRightPosX))
  useFrame(() => (mesh.current.position.z = wall))

  const texture = useLoader(THREE.TextureLoader, woodTest)

  return (

    <mesh ref={mesh} receiveShadow rotation={[-Math.PI / 1, doorRight, 0]} position={[wallRightPosX, 3, wall]} color='red'>
      <boxBufferGeometry attach='geometry' args={[10, 10, thicknessWall]} />
      <meshStandardMaterial attach='material' map={texture} />

    </mesh>

  )
}
const WallLeft = ({ wallPosX }) => {
  const mesh = useRef(null)
  useFrame(() => (mesh.current.rotation.y = doorLeft))
  useFrame(() => (mesh.current.position.x = wallLeftPosX))
  useFrame(() => (mesh.current.position.z = wall))
  const texture2 = useLoader(THREE.TextureLoader, woodTestR)

  return (

    <mesh ref={mesh} receiveShadow rotation={[-Math.PI / 1, doorLeft, 0]} position={[wallLeftPosX, 3, wall]} color='red'>
      <boxBufferGeometry attach='geometry' args={[10, 10, thicknessWall]} />
      <meshStandardMaterial attach='material' map={texture2} />

    </mesh>

  )
}
const Golv = () => {
  const texture3 = useLoader(THREE.TextureLoader, golvTexture)

  return (

    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
      <planeBufferGeometry attach='geometry' args={[100, 100]} />
      <meshStandardMaterial attach='material' map={texture3} />
    </mesh>

  )
}
const CameraController = () => {
  const { camera, gl } = useThree()
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement)

      controls.minDistance = 3
      controls.maxDistance = 20000
      return () => {
        controls.dispose()
      }
    },
    [camera, gl]
  )
  return null
}

function App () {
  const [line, setLine] = useState(0)
  const handleSlider = (value) => {
    setLine(value)
  }
  const [massa, setMassa] = useState(0)
  const handleSliderMassa = (value) => {
    setMassa(value)
  }
  const [vinkelGrader, setvinkelGrader] = useState(0)
  const handleSlidervinkelGrader = (value) => {
    setvinkelGrader(value)
  }

  const [start, setStart] = useState(false)
  const starter = () => { start ? setStart(false) : setStart(true) }

  return (

    <>
      <div id='container'>
        <div id='menyDiv'>
          <Menu onSlider={handleSlider} onSlider2={handleSliderMassa} onGrader={handleSlidervinkelGrader} />
          <button onClick={starter}>    {start ? <span>Stop simulation</span> : <span>Start simulation</span>}</button>
        </div>

        <Canvas id='viewport' shadowMap colorManagement camera={{ position: [-10, 3, 0], fov: 120 }}>

          <CameraController />
          <ambientLight intensity={0.3} />
          <directionalLight
            castShadow
            position={[0, 10, 0]}
            intensity={1}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-10, 0, -20]} intensity={0.5} />
          <pointLight position={[0, -10, 0]} intensity={1.5} />

          <SpinningMesh
            position={[0, 3, 0]} args={[radie, radie, lengthLog, 32]} color='blue' line={line}
            massa={massa} vinkelGrader={vinkelGrader} start={start}
          />
          <WallRight start={start} />
          <WallLeft />
          <Skybox />
          <Objects />
          <Golv />
          <WallStone position={[-25, 3, -8]} />
          <WallStone position={[25, 3, -8]} />

        </Canvas>

      </div>
    </>
  )
}

export default App
