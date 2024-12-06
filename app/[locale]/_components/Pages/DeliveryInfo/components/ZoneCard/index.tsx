import NumberToPrice from '@/_components/NumberToPrice'
import { useI18n } from '@/_locales/client'
import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const ZoneCard = ({
  data,
  setActiveZone,
  geozoneData,
}: {
  data: any
  geozoneData: any
  setActiveZone: any
}) => {
  const t = useI18n()

  return (
    <Box
      mb={3}
      cursor={'pointer'}
      h='fit-content'
      display='flex'
      bg='#F9FAFB'
      flexDirection='column'
      p={4}
      borderRadius='16px'
      position='relative'
      overflow='hidden'
      maxW={{ base: '100%', md: '400px', lg: '504px' }} // Responsive max width
      w={{ base: '100%', md: '400px', lg: '504px' }} //
      border={`1px solid ${
        data?.id === geozoneData?.id ? data?.rgb_code : '#fff'
      }`}
      onClick={() => setActiveZone(data?.id)}
    >
      <Box
        position='absolute'
        left='0px'
        top='0px'
        bottom='0px'
        width='6px'
        backgroundColor={data?.rgb_code || 'primary.500'}
        borderRadius='16px 0 0 16px'
      />
      <Flex flexDir={'column'} gap={2}>
        <Flex gap={1}>
          <Text fontSize={{ base: 12, md: 15 }} color={'gray.600'}>
            {t('minimum_order_amount_delivery')}:
          </Text>
          <NumberToPrice
            textProps={{
              color: '#101828',
              fontSize: { base: 12, md: 14 },
            }}
            spanProps={{
              color: '#101828',
              fontSize: { base: 12, md: 14 },
            }}
            value={data?.min_order_amount}
          />
        </Flex>
        <Text fontSize={{ base: 12, md: 15 }} color={'gray.600'}>
          {t('delivery_time')}:{' '}
          <Text as={'span'} color={'#101828'} fontSize={14}>
            {data?.delivery_time} min
          </Text>
        </Text>
        {data?.free_delivery_order_amount > 0 && (
          <Flex gap={1}>
            <Text fontSize={{ base: 12, md: 15 }} color={'gray.600'}>
              {t('free_delivery_from')}
            </Text>
            <NumberToPrice
              textProps={{
                color: '#101828',
                fontSize: { base: 12, md: 14 },
              }}
              spanProps={{
                color: '#101828',
                fontSize: { base: 12, md: 14 },
              }}
              value={data?.free_delivery_order_amount}
            />
          </Flex>
        )}
        {/* <Flex gap={1}>
          <Text fontSize={{ base: 12, md: 15 }} color={'gray.600'}>
            {t('delivery_amount')}:{' '}
          </Text>
          <NumberToPrice
            textProps={{
              color: '#101828',
              fontSize: { base: 12, md: 14 },
            }}
            spanProps={{
              color: '#101828',
              fontSize: { base: 12, md: 14 },
            }}
            value={10000}
          />
        </Flex> */}
      </Flex>
    </Box>
  )
}

export default ZoneCard
