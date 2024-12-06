import { useEffect, useState, forwardRef, useMemo } from 'react'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useI18n } from '@/_locales/client'
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react'
import CTabs from '@/_components/Tabs'
import { Icon } from '@iconify/react/dist/iconify.js'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { getWorkingHours } from '@/_services/branches'
import { useSelector } from 'react-redux'
import { IRedux, IWorkingHour } from '@/_types'
import Calendar from './components/Calendar'
import('dayjs/locale/uz-latn')
import('dayjs/locale/ru')
import('dayjs/locale/en')

interface IProps {
  isOpen: boolean
  value: string | null
  title: string
  interval: number
  branchWorkHours: {
    work_hour_start?: string
    work_hour_end?: string
  }
  onClose: () => void
  onChange: (e: string) => void
}

function OrderTimePicker({
  isOpen,
  value,
  title,
  interval,
  branchWorkHours,
  onClose,
  onChange,
}: IProps) {
  const [activeTab, setActiveTab] = useState<string>('today')
  const [isToday, setIsToday] = useState(true)
  const [tillTmrw, setTillTmrw] = useState<string[]>([]) // Time until tomorrow
  const [selDate, setSelDate] = useState(null) // Selected Date
  const [workHours, setWorkHours] = useState<IWorkingHour | null>(null) // Selected Day's working hours

  const t = useI18n()
  const format = 'HH:mm'
  const currentLocale: string = 'ru'
  const currentDate = dayjs().format('YYYY-MM-DD')
  const commonState = useSelector((state: IRedux) => state.common)

  dayjs.extend(isBetween)

  const { data: workingHoursData }: UseQueryResult<IWorkingHour[]> = useQuery({
    queryKey: ['branch_delivery_time', commonState?.branch?.id],
    queryFn: () =>
      getWorkingHours(commonState?.branch?.id, 'branch_delivery_time').then(
        (res) => res?.data?.working_hours
      ),
    enabled: Boolean(commonState?.branch?.id),
  })

  const isWorkingHour = () => {
    const currentTime = dayjs()
    const branch = branchWorkHours

    if (branch && branch?.work_hour_start && branch?.work_hour_end) {
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
          currentTime.isBefore(workHourStart) ||
          currentTime.isAfter(workHourEnd)
        ) {
          return true
        }
      }

      return false
    }

    return true
  }

  const onCalendarSelect = (e: any) => {
    let selectedDate = dayjs(e)
    let currentDate = dayjs()

    if (selectedDate.get('date') !== currentDate.get('date')) {
      setSelDate(e)
    } else {
      setIsToday(true)
    }
    if (workingHoursData) {
      setWorkHours(workingHoursData[selectedDate.get('day')])
    }
    setActiveTab('today')
  }

  useEffect(() => {
    if (isOpen) {
      let ranges = []
      const workHourStart = dayjs(
        workHours?.from_time || branchWorkHours?.work_hour_start,
        format,
        true
      )
      const workHourEnd = dayjs(
        workHours?.to_time || branchWorkHours?.work_hour_end,
        format,
        true
      )
      if (isToday) {
        let currentOrderStartTime = dayjs().add(+interval, 'm')
        if (isWorkingHour()) {
          while (workHourEnd?.get('hour') > currentOrderStartTime.get('hour')) {
            currentOrderStartTime = currentOrderStartTime.add(1, 'h')
            ranges.push(currentOrderStartTime.format('HH') + ':' + '00')
            ranges.push(currentOrderStartTime.format('HH') + ':' + '30')
          }
        } else {
          currentOrderStartTime = currentOrderStartTime
            .hour(workHourStart?.get('hour'))
            .minute(workHourStart?.get('m'))
          while (workHourEnd?.get('hour') > currentOrderStartTime.get('hour')) {
            ranges.push(currentOrderStartTime.format('HH:mm'))
            currentOrderStartTime = currentOrderStartTime.add(30, 'm')
          }
        }
      } else if (selDate) {
        let orderStartTime = dayjs(selDate)
          .hour(workHourStart?.get('hour'))
          // .minute(workHourStart?.get('m'))
          .add(+interval, 'm')
        while (
          orderStartTime.isSameOrBefore(
            dayjs(selDate)
              .hour(workHourEnd?.get('hour'))
              .minute(workHourEnd?.get('m'))
          )
        ) {
          ranges.push(orderStartTime.format('HH:mm'))
          orderStartTime = orderStartTime.add(30, 'm')
        }
      }
      setTillTmrw(ranges)
    }
  }, [interval, isToday, selDate, branchWorkHours, workHours, isOpen])

  const tabOptions = useMemo(
    () => [
      {
        label: selDate
          ? dayjs(selDate)
              .locale(currentLocale == 'uz' ? 'uz-latn' : currentLocale)
              .format('D MMMM')
          : t('today'),
        value: 'today',
      },
      { label: t('another_day'), value: 'another_day' },
    ],
    [selDate, t]
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg={'#00000080'} backdropFilter="blur(5px)" />
      <ModalContent mx={'16px'}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CTabs
            index={activeTab === 'today' ? 0 : 1}
            tabs={tabOptions}
            onChange={(e) => {
              setActiveTab(e)
              setSelDate(null)
              setIsToday(e === 'today')
            }}
            panels={
              <TabPanels>
                <TabPanel maxH={'60vh'} overflowY={'auto'} px={0}>
                  {isToday ? (
                    <SimpleGrid columns={2} gap={4}>
                      {isWorkingHour() && interval > 0 && (
                        <Button
                          py={3}
                          display={'flex'}
                          justifyContent={'space-between'}
                          variant={'ghost'}
                          fontWeight={400}
                          bg={'#F5F6FA'}
                          // variant={value == null ? 'primary' : 'solid'}
                          onClick={() => onChange('')}
                        >
                          {t('today')}: {interval || 0} {t('minutes')}
                          {value == null ? (
                            <Icon
                              icon="material-symbols:check-small-rounded"
                              fontSize={24}
                            />
                          ) : undefined}
                        </Button>
                      )}
                      {tillTmrw?.map((time) => (
                        <Button
                          // variant={
                          //   value == currentDate + ' ' + time
                          //     ? 'primary'
                          //     : 'solid'
                          // }
                          variant={'ghost'}
                          bg={'#F5F6FA'}
                          display={'flex'}
                          fontWeight={400}
                          justifyContent={'space-between'}
                          key={time}
                          onClick={() =>
                            onChange(currentDate + ' ' + time + ':00')
                          }
                        >
                          {time}
                          {value == currentDate + ' ' + time ? (
                            <Box textAlign={'right'}>
                              <Icon
                                icon="material-symbols:check-small-rounded"
                                fontSize={24}
                              />
                            </Box>
                          ) : undefined}
                        </Button>
                      ))}
                    </SimpleGrid>
                  ) : (
                    selDate && (
                      <SimpleGrid columns={2} gap={4}>
                        {tillTmrw?.map((time) => (
                          <Button
                            // variant={
                            //   value == selDate + ' ' + time
                            //     ? 'primary'
                            //     : 'solid'
                            // }
                            variant={'ghost'}
                            bg={'#F5F6FA'}
                            display={'flex'}
                            fontWeight={400}
                            justifyContent={'space-between'}
                            key={time}
                            onClick={() =>
                              onChange(selDate + ' ' + time + ':00')
                            }
                          >
                            {time}
                            {value == selDate + ' ' + time ? (
                              <Icon
                                icon="material-symbols:check-small-rounded"
                                fontSize={24}
                              />
                            ) : undefined}
                          </Button>
                        ))}
                      </SimpleGrid>
                    )
                  )}
                </TabPanel>
                <TabPanel px={0}>
                  <Calendar onSelect={onCalendarSelect} />
                </TabPanel>
              </TabPanels>
            }
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default OrderTimePicker
