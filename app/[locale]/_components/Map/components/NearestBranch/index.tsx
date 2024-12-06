import MarkerPinIcon from '@/_assets/icons/MarkerPinIcon'
import { useI18n } from '@/_locales/client'
import { IBranch, IRedux } from '@/_types'
import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { useSelector } from 'react-redux'

function NearestBranch({ data }: { data: IBranch | null }) {
  const t = useI18n()

  const common = useSelector((state: IRedux) => state.common)

  if (data?.id)
    return (
      <Box
        p={3}
        fontSize='small'
        bgColor='gray.100'
        _dark={{ bgColor: 'paper.dark.400' }}
        borderRadius='2xl'
        transition='100ms ease-in-out'
      >
        <Flex align='flex-start' gap={1.5}>
          <MarkerPinIcon />
          <div>
            <Text fontWeight={700}>
              {common?.deliveryType !== 'delivery'
                ? t('delivery_from_nearest_branch', {
                    nearestBranch: data?.name,
                  })
                : t('delivery_from_nearest_address', {
                    nearestBranch: data?.name,
                  })}
            </Text>
            <Text
              color='gray.500'
              whiteSpace='nowrap'
              overflow='hidden'
              textOverflow='ellipsis'
              maxW={'80vw'}
            >
              {data?.address}
            </Text>
          </div>
        </Flex>
      </Box>
    )

  return (
    <Box
      p={3}
      fontSize='small'
      bgColor='gray.100'
      borderRadius='2xl'
      transition='100ms ease-in-out'
      _dark={{ bgColor: 'paper.dark.400' }}
    >
      <Flex align='flex-start' gap={1.5}>
        <MarkerPinIcon />
        <div>
          <Text fontWeight={700}>{t('select_an_address_or_drag_the_map')}</Text>
          <Text color='gray.500'>{t('address_not_specified')}</Text>
        </div>
      </Flex>
    </Box>
  )
}

export default NearestBranch
