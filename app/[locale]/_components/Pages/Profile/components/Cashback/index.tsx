import CreditCard from '@/_components/CreditCard'
import NumberToPrice from '@/_components/NumberToPrice'
import { useI18n } from '@/_locales/client'
import { getIikoCustomerInfo } from '@/_services/customerService'
import { IRedux } from '@/_types'
import { Box, Card, HStack, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useSelector } from 'react-redux'

function Cashback() {
  const t = useI18n()
  const { user } = useSelector((state: IRedux) => state.auth)

  const { data } = useQuery({
    queryKey: ['get-iiko-customer-info'],
    queryFn: () =>
      getIikoCustomerInfo({ phone: user?.phone }).then((res) => res?.data),
  })
  return (
    <HStack
      justify='space-between'
      bg='brand.400'
      _dark={{ bg: 'paper.dark.400' }}
      px={{ base: 2, md: 3 }}
      py={{ base: 3, md: 4 }}
      rounded='12px'
    >
      <Text fontSize={18} fontWeight={500} lineHeight={1}>
        {t('balance')}
      </Text>
      <NumberToPrice
        value={data?.balance || 0}
        unstyled={true}
        textProps={{ fontSize: '18px', fontWeight: 500, lineHeight: '21px' }}
        spanProps={{ fontSize: '18px', fontWeight: 500, lineHeight: '21px' }}
      />
    </HStack>
  )
}

export default Cashback
