import React from 'react'
// import AddressButton from '../AddressButton'
// import SelectDeliveryType from './components/SelectDeliveryType'
import { Box } from '@chakra-ui/react'
import dynamic from 'next/dynamic'

const AddressButton = dynamic(() => import('../AddressButton'))
const SelectDeliveryType = dynamic(
  () => import('./components/SelectDeliveryType')
)

function MobileMiddle() {
  return (
    <Box
      display={{ base: 'flex', lg: 'none' }}
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <AddressButton />
      <SelectDeliveryType />
    </Box>
  )
}

export default MobileMiddle
