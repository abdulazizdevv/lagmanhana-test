'use client'

import { useI18n } from '@/_locales/client'
import { getBranchById } from '@/_services/branches'
import { getShipperById } from '@/_services/customerService'
import { saveBranchData } from '@/_store/common/common.slice'
import { IRedux } from '@/_types'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const format = 'HH:mm'

function AlertWorkHours({ isBanner }: { isBanner?: number }) {
  const { deliveryType, branch } = useSelector((state: IRedux) => state.common)
  const dispatch = useDispatch()
  const t = useI18n()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data } = useQuery({
    queryKey: ['get-shipper-by-id'],
    queryFn: () =>
      getShipperById(process.env.NEXT_PUBLIC_SHIPPER_ID!).then(
        (res) => res?.data
      ),
    enabled: !Boolean(branch?.id),
  })

  useEffect(() => {
    if (branch?.id && !branch?.work_hour_start) {
      getBranchById(branch?.id).then((res) => {
        dispatch(
          saveBranchData({
            id: res?.data?.id,
            menu_id: res?.data.menu_id ? res?.data.menu_id : '',
            address: res?.data.address,
            name: res?.data.name,
            slug: res?.data?.slug,
            location: res?.data.location,
            future_delivery_order_time: res?.data?.future_delivery_order_time,
            future_self_pickup_order_time:
              res?.data?.future_self_pickup_order_time,
            work_hour_end: res?.data?.work_hour_end,
            work_hour_start: res?.data?.work_hour_start,
          })
        )
      })
    }
  }, [branch?.id])

  // Get branch schedule status
  const isWorkingHour = (start: string, end: string) => {
    const currentTime = dayjs()

    if (start && end) {
      const workHourStart = dayjs(branch?.work_hour_start, format, true)
      const workHourEnd = dayjs(branch?.work_hour_end, format, true)

      if (
        branch?.work_hour_start === '00:00' &&
        branch?.work_hour_end === '23:59'
      ) {
        return true
      }

      if (workHourEnd.isBefore(workHourStart)) {
        // Handle crossing midnight
        if (
          currentTime.isAfter(workHourStart) ||
          currentTime.isBefore(workHourEnd)
        ) {
          return true
        }
      } else {
        if (
          currentTime.isAfter(workHourStart) &&
          currentTime.isBefore(workHourEnd)
        ) {
          return true
        }
      }

      return false
    }

    return null
  }

  if (isWorkingHour(branch?.work_hour_start, branch?.work_hour_end)) {
    return (
      <Alert
        status='warning'
        borderRadius='8px'
        mb={4}
        position='sticky'
        top={{
          base: isBanner ? '160px' : scrollY > 143 ? '160px' : '100px',
          md: scrollY > 143 ? '140px' : isBanner ? '100px' : '80px',
        }}
        transition='top 0.3s ease-in-out'
        left={0}
        zIndex={30}
      >
        <AlertIcon />
        {deliveryType === 'delivery' ? (
          <AlertTitle>
            {t('delivery_starts_working', {
              time: dayjs(branch?.work_hour_start, format, true).format(format),
            })}
          </AlertTitle>
        ) : (
          <AlertTitle fontSize={{ base: '14px', md: '16px' }}>
            {t('establishment_starts_working', {
              time: dayjs(branch?.work_hour_start, format, true).format(format),
            })}
          </AlertTitle>
        )}
        <AlertDescription fontSize={{ base: '12px', md: '16px' }}>
          {t('now_you_can_preorder')}
        </AlertDescription>
      </Alert>
    )
  } else if (isWorkingHour(data?.work_hour_start, data?.work_hour_end)) {
    return (
      <Alert
        status='warning'
        borderRadius='8px'
        mb={4}
        position='sticky'
        top={{
          base: isBanner ? '160px' : '200px',
          md: scrollY > 143 ? '140px' : isBanner ? '100px' : '80px',
        }}
        transition='top 0.3s ease-in-out'
        left={0}
        zIndex={30}
      >
        <AlertIcon />
        {deliveryType === 'delivery' ? (
          <AlertTitle>
            {t('delivery_starts_working', {
              time: dayjs(data?.work_hour_start, format, true).format(format),
            })}
          </AlertTitle>
        ) : (
          <AlertTitle fontSize={{ base: '14px', md: '16px' }}>
            {t('establishment_starts_working', {
              time: dayjs(data?.work_hour_start, format, true).format(format),
            })}
          </AlertTitle>
        )}
        <AlertDescription fontSize={{ base: '12px', md: '16px' }}>
          {t('now_you_can_preorder')}
        </AlertDescription>
      </Alert>
    )
  }

  return null
}

export default AlertWorkHours
