import React from 'react'
import type { SVGProps } from 'react'
function ShoppingCartIcon({ color = 'white' }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='1.2em'
      height='1.2em'
      viewBox='0 0 24 24'
    >
      <path
        fill='currentColor'
        d='M10 13.25a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75m4.75.75a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0z'
      ></path>
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='M9.65 3.375a.75.75 0 0 0-1.3-.75l-2 3.464a.752.752 0 0 0-.069.161H6a2.75 2.75 0 0 0-1.739 4.88l.667 4.585l.447 2.093a3.049 3.049 0 0 0 2.561 2.384c2.697.375 5.432.375 8.128 0a3.049 3.049 0 0 0 2.561-2.384l.447-2.093l.667-4.584A2.75 2.75 0 0 0 18 6.25h-.281a.754.754 0 0 0-.07-.162l-2-3.464a.75.75 0 1 0-1.298.75l1.66 2.875H7.99zm8.484 8.372a2.819 2.819 0 0 1-.134.003H6c-.045 0-.09-.001-.133-.003l.538 3.703l.437 2.045a1.549 1.549 0 0 0 1.301 1.211c2.559.356 5.155.356 7.714 0a1.549 1.549 0 0 0 1.301-1.21l.437-2.046zM4.75 9c0-.69.56-1.25 1.25-1.25h12a1.25 1.25 0 1 1 0 2.5H6c-.69 0-1.25-.56-1.25-1.25'
        clipRule='evenodd'
      ></path>
    </svg>
  )
}

export default ShoppingCartIcon
