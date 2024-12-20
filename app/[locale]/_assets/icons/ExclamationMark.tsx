import React from 'react'

export default function ExclamationMark({ color = '#A5A5A5' }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z"
        fill={color}
      />
      <path
        d="M12 7C11.447 7 11 7.448 11 8V13C11 13.552 11.447 14 12 14C12.553 14 13 13.552 13 13V8C13 7.448 12.553 7 12 7Z"
        fill={color}
      />
      <path
        d="M12 15C11.74 15 11.48 15.1107 11.29 15.2918C11.109 15.483 11 15.7447 11 16.0063C11 16.2679 11.109 16.5296 11.29 16.7208C11.67 17.0931 12.33 17.0931 12.71 16.7208C12.89 16.5296 13 16.2679 13 16.0063C13 15.7447 12.89 15.483 12.71 15.2918C12.52 15.1107 12.26 15 12 15Z"
        fill={color}
      />
    </svg>
  )
}
