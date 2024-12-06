import KaspiFull from '@/_assets/payment/KaspiFull'
import { useI18n } from '@/_locales/client'
import { Button, Card, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import NumberToPrice from '../NumberToPrice'

function KaspiCard({
  link,
  price,
}: {
  link: string | undefined
  price: number
}) {
  const t = useI18n()
  const router = useRouter()
  return (
    <Card borderRadius='2xl' p={3} minW={{ md: '367px' }}>
      <Stack spacing={2}>
        <Text>{t('your_order_is_waiting_for_payment')}</Text>
        <Text fontWeight={700} fontSize='xl'>
          {t('total_amount_due')} <br />
          <NumberToPrice value={price} display='inline-flex' />
        </Text>
        <Button
          mt={2}
          variant={'primary'}
          rightIcon={<KaspiFull />}
          onClick={() => link && router.push(link)}
          isDisabled={!link}
        >
          {t('pay_with')}
        </Button>
      </Stack>
    </Card>
  )
}

export default KaspiCard
