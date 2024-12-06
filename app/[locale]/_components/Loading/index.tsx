import React from 'react'
import { Spinner } from '@chakra-ui/react'

function Loading() {
  return (
    <>
      <Spinner thickness='3px' size={'xl'} color='primary.500' />
    </>
  )
}

export default Loading
