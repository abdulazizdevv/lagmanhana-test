import { Box, Flex, Text, useColorModeValue, useRadio } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import React from 'react'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useI18n } from '@/_locales/client'
import { IBranch } from '@/_types'

dayjs.extend(customParseFormat)

function Card({ data, active, ...props }: any) {
  const t = useI18n()

  // Get branch schedule status
  const scheduleStatus = (branch: IBranch) => {
    const currentTime = dayjs()
    const format = 'HH:mm'

    if (branch && branch?.work_hour_start && branch?.work_hour_end) {
      const workHourStart = dayjs(branch?.work_hour_start, format, true)
      const workHourEnd = dayjs(branch?.work_hour_end, format, true)

      if (
        branch?.work_hour_start === '00:00' &&
        branch?.work_hour_end === '23:59'
      ) {
        return (
          <span
          // style={{ color: '#5AC53A' }}
          >
            {t('works_around_the_clock')}
          </span>
        )
      }

      if (workHourEnd.isBefore(workHourStart)) {
        // Handle crossing midnight
        if (
          currentTime.isAfter(workHourStart) ||
          currentTime.isBefore(workHourEnd)
        ) {
          return (
            <span
            // style={{ color: '#5982e7' }}
            >
              {t('restaurant_will_close_at', {
                work_hour_end: branch?.work_hour_end,
              })}
            </span>
          )
        }
      } else {
        if (
          currentTime.isBefore(workHourStart) ||
          currentTime.isAfter(workHourEnd)
        ) {
          return (
            <span
            // style={{ color: '#5982e7' }}
            >
              {t('restaurant_will_close_at', {
                work_hour_end: branch?.work_hour_end,
              })}
            </span>
          )
        }
      }

      return (
        <span
        // style={{ color: '#F2271C' }}
        >
          {t('restaurant_will_open_at', {
            work_hour_start: branch?.work_hour_start,
          })}
        </span>
      )
    }

    return null
  }

  const bgColor500 = useColorModeValue('paper.light.500', 'paper.dark.500')
  const bgColor400 = useColorModeValue('paper.light.100', 'paper.dark.400')

  return (
    <Box
      cursor="pointer"
      bgColor={active ? bgColor500 : bgColor400}
      border="1px solid"
      borderColor={active ? 'primary.400' : 'transparent'}
      _hover={{ bgColor: bgColor500 }}
      borderRadius="2xl"
      transition="150ms ease-in-out"
      px={3}
      py={2}
      {...props}
    >
      <Flex fontSize="sm" align="center" gap={1.5}>
        <Icon icon="material-symbols:location-on" fontSize={16} />
        <Text fontWeight={700}>{data.name}</Text>
      </Flex>
      <Text mt={1} mb={2} color="#A5A5A5" lineHeight={1.2} fontSize="sm">
        {data.address}
      </Text>
      <Text color="#A5A5A5" fontSize="xs">
        {scheduleStatus(data)}
      </Text>
    </Box>
  )
}

export default Card
