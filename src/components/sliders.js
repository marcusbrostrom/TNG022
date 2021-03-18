
import React, { useRef, useState, useEffect } from 'react'
import './App.scss'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import RangeSlider from 'react-bootstrap-range-slider'
import './components/constants.js'

export default function Slider (minVal, maxVal, stepH, prop) {
  const [value, setValue] = useState(0)
  prop = value
  return (
    <RangeSlider
      min={minVal} max={maxVal} step={stepH}
      value={value}
      onChange={changeEvent => setValue(changeEvent.target.value)}

    />
  )
}
