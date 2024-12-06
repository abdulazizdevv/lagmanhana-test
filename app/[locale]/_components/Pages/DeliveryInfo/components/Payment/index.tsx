import React from 'react'

import kaspi from '@/_assets/icons/kaspi2.svg'
import epay from '@/_assets/icons/epay.svg'
import cash from '@/_assets/icons/cash.svg'
import click from '@/_assets/payment/click_lg.svg'
import payme from '@/_assets/payment/payme_lg.svg'
import uzcard from '@/_assets/payment/uzcard_lg.svg'
import Image from 'next/image'
import { Flex, Text } from '@chakra-ui/react'

interface PaymentOptionProps {
  data: any
}

const getPaymentIcon = (type: string) => {
  switch (type) {
    case 'kaspi':
      return <Image src={kaspi} alt='kaspi' />
    case 'epay':
      return <Image src={epay} alt='epay' />
    case 'payme':
      return <Image src={payme} alt='Payme' />
    case 'click':
      return <Image src={click} alt='Click' />
    case 'uzcard':
      return <Image src={uzcard} alt='Uzcard' />
    case 'apelsin':
      return <Image src={uzcard} alt='Apelsin' />
    default:
      return <Image src={cash} alt='Cash' />
  }
}

const Payment: React.FC<PaymentOptionProps> = ({ data }) => {
  return (
    <Flex
      flexDir='column'
      alignItems='center'
      gap={4}
      w={{ base: '100%', md: '292px' }}
    >
      <Flex
        w='full'
        bg='#F9FAFB'
        _dark={{
          bg: '#222222',
        }}
        minH={'78px'}
        borderRadius='12px'
        justifyContent='center'
        alignItems={'center'}
        gap={'10px'}
        // p={'19px'}
      >
        {getPaymentIcon(data?.value)}
        <Text fontSize={'lg'} fontWeight={700}>
          {data?.value === 'cash' && data?.label}
        </Text>
      </Flex>
    </Flex>
  )
}

export default Payment
