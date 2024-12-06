import { useState, useEffect } from 'react'

import styles from './style.module.scss'
import classNames from 'classnames'
import { useI18n } from '@/_locales/client'
import { getStatusName, getTrackingStatus } from '@/_utils/getStatus'
import { Box, Text, Tooltip, useColorModeValue } from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import NewDocumentIcon from '@/_assets/icons/NewDocumentIcon'

interface IProps {
  statusId: string
  isSelfPickup: boolean
  paymentLink: string
  complex: boolean
}

export default function StatusBar({
  statusId,
  isSelfPickup,
  paymentLink,
  complex,
}: IProps) {
  const t = useI18n()
  const [orderStatus, setOrderStatus] = useState('new')

  const iconColor = useColorModeValue('white', 'black')

  useEffect(() => {
    setOrderStatus(getTrackingStatus(statusId))
  }, [statusId])

  return (
    <div className={styles.status_container}>
      {complex && (
        <h4>
          {paymentLink
            ? t('order.payment_awaited')
            : t(`order.${getStatusName(statusId)}`)}
        </h4>
      )}
      <div className={styles.status_box}>
        <Status
          active={
            orderStatus === 'future' ||
            orderStatus === 'new' ||
            orderStatus === 'cancelled' ||
            orderStatus === 'accepted' ||
            orderStatus === 'getting_ready' ||
            orderStatus === 'ready' ||
            orderStatus === 'courier-picked' ||
            orderStatus === 'delivered'
          }
          label={
            statusId == 'bf9cc968-367d-4391-93fa-f77eda2a7a99'
              ? t('order.future')
              : t('order.new')
          }
        >
          <NewDocumentIcon color={iconColor} />
        </Status>
        <div className={styles.dash}></div>
        <Status
          active={
            orderStatus === 'accepted' ||
            orderStatus === 'getting_ready' ||
            orderStatus === 'ready' ||
            orderStatus === 'courier-picked' ||
            orderStatus === 'delivered'
          }
          error={orderStatus === 'cancelled'}
          label={
            orderStatus === 'cancelled'
              ? t('order.cancelled')
              : t('order.operator-accepted')
          }
        >
          {orderStatus === 'cancelled' ? (
            <Icon
              icon='material-symbols:priority-high-rounded'
              fontSize='inherit'
            />
          ) : (
            <Icon icon='material-symbols:done-rounded' fontSize='inherit' />
          )}
        </Status>
        <div className={styles.dash}></div>
        <Status
          active={
            orderStatus === 'ready' ||
            orderStatus === 'courier-picked' ||
            orderStatus === 'delivered'
          }
          label={t('order.ready')}
        >
          <Icon icon='ic:round-restaurant' fontSize='inherit' />
        </Status>
        {!isSelfPickup && (
          <>
            <div className={styles.dash}></div>
            {!isSelfPickup && (
              <>
                <Status
                  active={
                    orderStatus === 'courier-picked' ||
                    orderStatus === 'delivered'
                  }
                  label={t('order.courier-picked')}
                >
                  <Icon icon='mingcute:riding-line' fontSize='inherit' />
                </Status>
                <div className={styles.dash}></div>
              </>
            )}
            <Status
              active={orderStatus === 'delivered'}
              label={isSelfPickup ? t('order.finished') : t('order.delivered')}
            >
              <Icon
                icon='material-symbols:done-all-rounded'
                fontSize='inherit'
              />
            </Status>
          </>
        )}
      </div>
    </div>
  )
}

const Status = ({
  active,
  error,
  label,
  children,
}: {
  active: boolean
  error?: boolean
  label: string
  children: React.ReactNode
}) => {
  return (
    <Tooltip label={label}>
      <Box
        fontSize='24px'
        className={styles.status}
        bg={active ? 'primary.400' : error ? 'red.400' : 'paper.light.200'}
        color={active || error ? 'white' : 'black'}
        _dark={{
          bg: active ? 'white' : error ? 'red.400' : 'paper.dark.400',
          color: active ? 'black' : 'white',
        }}
      >
        {children}
      </Box>
    </Tooltip>
  )
}
