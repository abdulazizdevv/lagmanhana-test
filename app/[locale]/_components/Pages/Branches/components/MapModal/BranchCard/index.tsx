import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  useMediaQuery,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import React from 'react'

import MarkerPinIcon from '@/_assets/icons/MarkerPinIcon'
import { useI18n } from '@/_locales/client'
import { IBranch } from '@/_types'

function BranchCard({ data }: { data: IBranch | null }) {
  const t = useI18n()
  const [lg] = useMediaQuery('(max-width: 960px)')
  if (data) {
    return (
      <Box
        // mt={lg ? 4 : 0}
        // mx={lg ? 4 : 0}
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
            <Text fontWeight={700}>
              {t('delivery_from_nearest_branch', {
                nearestBranch: data?.name,
              })}
            </Text>
            <Text color='gray.500'>{data?.address}</Text>
            <Text color='gray.500' fontSize='xs'>
              <Text color='primary.500' as='span'>
                {t('working_hours')}
              </Text>
              : {data?.work_hour_start} - {data?.work_hour_end}
            </Text>
          </div>
        </Flex>
      </Box>
    )
  }

  return null
}

export default BranchCard
