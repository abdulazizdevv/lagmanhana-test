import Loading from '@/_components/Loading'
import React from 'react'

function loading() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <Loading />
    </div>
  )
}

export default loading
