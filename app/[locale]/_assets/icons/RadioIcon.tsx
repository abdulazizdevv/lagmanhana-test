import React from 'react'
import { chakra } from '@chakra-ui/react'

const RadioIcon = ({
  width = 20,
  height = 21,
}: {
  width?: any
  height?: any
}) => {
  return (
    <chakra.svg
      width={width}
      height={height}
      viewBox='0 0 20 21'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect
        x='0.25'
        y='0.75'
        width='19.5'
        height='19.5'
        rx='9.75'
        fill='#F9F5FF'
      />
      <rect
        x='0.25'
        y='0.75'
        width='19.5'
        height='19.5'
        rx='9.75'
        stroke='#F87A1D'
        strokeWidth='0.5'
      />
      <circle cx='10' cy='10.5' r='3' fill='#F87A1D' />
    </chakra.svg>
  )
}

export default RadioIcon
