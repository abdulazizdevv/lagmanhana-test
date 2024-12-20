import React from 'react'

export default function GeolocationIcon({ color = 'white' }) {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 18 18'
      xmlns='http://www.w3.org/2000/svg'
    >
      <mask
        id='mask0_1138_50368'
        style={{ maskType: 'alpha' }}
        maskUnits='userSpaceOnUse'
        x='0'
        y='0'
        width='18'
        height='18'
      >
        <rect width='18' height='18' fill='#D9D9D9' />
      </mask>
      <g mask='url(#mask0_1138_50368)'>
        <path
          d='M7.53789 10.4623L2.68164 8.49356C2.51914 8.43105 2.40039 8.33418 2.32539 8.20293C2.25039 8.07168 2.21289 7.9373 2.21289 7.7998C2.21289 7.6623 2.25352 7.52793 2.33477 7.39668C2.41602 7.26543 2.53789 7.16855 2.70039 7.10605L14.2129 2.83105C14.3629 2.76855 14.5066 2.75605 14.6441 2.79355C14.7816 2.83105 14.9004 2.8998 15.0004 2.9998C15.1004 3.0998 15.1691 3.21855 15.2066 3.35605C15.2441 3.49355 15.2316 3.6373 15.1691 3.7873L10.8941 15.2998C10.8316 15.4623 10.7348 15.5842 10.6035 15.6654C10.4723 15.7467 10.3379 15.7873 10.2004 15.7873C10.0629 15.7873 9.92852 15.7498 9.79727 15.6748C9.66602 15.5998 9.56914 15.4811 9.50664 15.3186L7.53789 10.4623Z'
          fill={color}
        />
      </g>
    </svg>
  )
}
