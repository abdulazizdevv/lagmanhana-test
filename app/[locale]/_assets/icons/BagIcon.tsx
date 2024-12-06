import React from 'react'

export default function BagIcon({
  color = 'white',
  width = '20',
  height = '20',
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g clipPath='url(#clip0_5392_59026)'>
        <path
          d='M2.15504 8.33333H17.8437M15.0286 5L4.97007 5C2.87771 5 1.31263 6.93854 1.73528 9.00666L3.09772 15.6733C3.41424 17.2221 4.76553 18.3333 6.3325 18.3333H13.6662C15.2332 18.3333 16.5845 17.2221 16.901 15.6733L18.2634 9.00666C18.6861 6.93853 17.121 5 15.0286 5Z'
          stroke={color}
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M7.5 1.66667L5 5'
          stroke={color}
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M12.5 1.66667L15 5'
          stroke={color}
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M7.5 11.6667L7.5 15'
          stroke={color}
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M12.5 11.6667L12.5 15'
          stroke={color}
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_5392_59026'>
          <rect width='20' height='20' fill='white' />
        </clipPath>
      </defs>
    </svg>
  )
}
