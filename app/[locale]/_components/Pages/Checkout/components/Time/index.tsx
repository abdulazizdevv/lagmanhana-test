import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import { useI18n } from '@/_locales/client'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { IRedux, IShipper } from '@/_types'
import { checkoutActions } from '@/_store/checkout/checkout.slice'
import OrderTimePicker from '@/_components/OrderTimePicker'
import('dayjs/locale/uz-latn')
import('dayjs/locale/ru')
import('dayjs/locale/en')

function TimeDetails({
  shipper,
  isLoading,
  branchWorkHours,
}: {
  shipper: IShipper
  isLoading: boolean
  branchWorkHours: { work_hour_start: string; work_hour_end: string }
}) {
  dayjs.extend(calendar)

  const [isTimePicker, setIsTimePicker] = useState(false)

  const dispatch = useDispatch()
  const currentLocale: string = 'ru'
  const checkoutState = useSelector((state: IRedux) => state.checkout)

  const t = useI18n()
  const commonState = useSelector((state: IRedux) => state.common)

  const onChange = (val: string) => {
    dispatch(checkoutActions.changeFutureTime(val))
    setIsTimePicker(false)
  }

  const intervalTimePicker: number = useMemo(() => {
    if (
      commonState?.branch?.future_self_pickup_order_time ||
      commonState?.branch?.future_delivery_order_time
    ) {
      if (
        commonState?.deliveryType === 'self-pickup' &&
        Number(commonState?.branch?.future_self_pickup_order_time || 0) !== 0
      ) {
        return Number(commonState?.branch?.future_self_pickup_order_time || 0)
      }
      if (
        commonState?.deliveryType === 'delivery' &&
        Number(commonState?.branch?.future_delivery_order_time || 0) !== 0
      ) {
        return Number(commonState?.branch?.future_delivery_order_time || 0)
      }
    }

    return Number(shipper.future_order_time || 0)
  }, [
    commonState?.branch?.future_self_pickup_order_time,
    commonState?.branch?.future_delivery_order_time,
    commonState?.deliveryType,
    shipper.future_order_time,
  ])

  if (!branchWorkHours?.work_hour_start) {
    return (
      <Alert status="warning" borderRadius="8px" mb={4}>
        <AlertIcon />
        <AlertTitle>{t('branch_is_not_selected')}.</AlertTitle>
        <AlertDescription>{t('select_another_address')}</AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <Box>
        <Text fontSize="xl" fontWeight={700} mb={{ base: 2, md: 4 }}>
          {commonState?.deliveryType === 'self-pickup'
            ? t('delivery_terms')
            : t('delivery_terms')}
        </Text>
        <Button
          py={2}
          px={'6px'}
          fontSize={16}
          bg={'#F2F4F7'}
          fontWeight={400}
          variant={'ghost'}
          isLoading={isLoading}
          w={{ base: '100%', md: 'fit-content' }}
          justifyContent={{ base: 'space-between', md: 'center' }}
          onClick={() => setIsTimePicker(true)}
        >
          <Flex alignItems="center" gap={1}>
            <Icon icon="iconamoon:clock-fill" color="#FFE000" fontSize={24} />

            {checkoutState?.future_time ? (
              <>
                {dayjs(checkoutState.future_time).isSame(dayjs(), 'day')
                  ? t('today')
                  : dayjs(checkoutState.future_time)
                      .locale(
                        currentLocale === 'uz' ? 'uz-latn' : currentLocale
                      )
                      .format(currentLocale === 'en' ? 'MMMM DD' : 'DD MMMM')}
                {' - '}
                {dayjs(checkoutState.future_time).format(
                  currentLocale === 'en' ? 'hh:mm A' : 'HH:mm'
                )}
              </>
            ) : (
              <>
                {t('today')} ~{' '}
                {dayjs()
                  .add(Number(intervalTimePicker), 'minute')
                  .format(currentLocale === 'en' ? 'hh:mm A' : 'HH:mm')}
                {' ('}
                {intervalTimePicker} {t('minutes')}
                {')'}
              </>
            )}
          </Flex>

          <Icon
            icon="material-symbols:keyboard-arrow-down-rounded"
            fontSize={24}
            color="gray"
          />
        </Button>
      </Box>
      {!isLoading && branchWorkHours?.work_hour_start && (
        <OrderTimePicker
          isOpen={isTimePicker}
          onClose={() => setIsTimePicker(false)}
          onChange={onChange}
          value={checkoutState?.future_time ? checkoutState?.future_time : null}
          title={t(
            commonState?.deliveryType === 'self-pickup'
              ? 'pickup_time'
              : 'delivery_time'
          )}
          interval={intervalTimePicker}
          branchWorkHours={branchWorkHours}
        />
      )}
    </>
  )
}

export default TimeDetails
