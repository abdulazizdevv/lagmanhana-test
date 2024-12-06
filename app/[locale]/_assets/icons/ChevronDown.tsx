import React from 'react'

export default function ChevronDown({
  color,
  width = 21,
  height = 21,
}: {
  color?: any
  width?: any
  height?: any
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 21 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5.66699 7.5L10.667 12.5L15.667 7.5'
        stroke={color ? color : '#667085'}
        strokeWidth='1.66667'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}
