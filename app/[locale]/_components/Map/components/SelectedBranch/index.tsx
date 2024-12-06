import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

import { useI18n } from '@/_locales/client'
import { IBranch } from '@/_types'
import MarkerPinIcon from '@/_assets/icons/MarkerPinIcon'

function BranchCard({ data }: { data: IBranch | null }) {
  const t = useI18n()

  if (data) {
    return (
      <Box
        p={3}
        maxW='full'
        fontSize='sm'
        bgColor='gray.100'
        _dark={{ bgColor: 'paper.dark.400' }}
        borderRadius='2xl'
        transition='100ms ease-in-out'
      >
        <Flex align='flex-start' gap={1.5}>
          <MarkerPinIcon />
          <Box maxW='80%'>
            <Text fontWeight={700}>{data?.name}</Text>
            <Text
              color='gray.500'
              whiteSpace='nowrap'
              overflow='hidden'
              textOverflow='ellipsis'
            >
              {data?.address}
            </Text>
          </Box>
        </Flex>
      </Box>
    )
  }

  return (
    <Box
      p={3}
      fontSize='sm'
      bgColor='gray.100'
      _dark={{ bgColor: 'paper.dark.400' }}
      borderRadius='2xl'
      transition='100ms ease-in-out'
    >
      <Flex align='flex-start' gap={1.5}>
        <MarkerPinIcon />
        <div>
          <Text fontWeight={700}>{t('select_branch')}</Text>
          <Text color='gray.500'>{t('branch_is_not_selected')}</Text>
        </div>
      </Flex>
    </Box>
  )
}

export default BranchCard
