'use client'

// Style
import { IOrder } from '@/_types'
import {
  Container,
  Grid,
  GridItem,
  HStack,
  Heading,
  Link,
  Text,
} from '@chakra-ui/react'
import { useI18n } from '@/_locales/client'
import { Icon } from '@iconify/react/dist/iconify.js'
import KaspiCard from '@/_components/KaspiCard'
import QRCard from './components/QRCard'

function Kaspi({ data }: { data: IOrder }) {
  const t = useI18n()

  return (
    <Container mt={4}>
      <HStack>
        <Heading size='lg'>{t('pay_for_order')}</Heading>
        <Icon
          icon='material-symbols:check-circle-rounded'
          fontSize={34}
          color='#2CDA94'
        />
      </HStack>
      <Text my={3}>{t('successfully_create_order')}:</Text>
      <Text fontSize='xl' fontWeight={700}>
        #{data?.external_order_id}
      </Text>
      <Grid
        mt={6}
        gap={6}
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        <GridItem>
          <KaspiCard
            link={'https://pay.kaspi.kz/pay/nipohqem'}
            price={(data?.delivery_price || 0) + (data?.order_amount || 0) || 0}
          />
        </GridItem>
        <GridItem
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
        >
          <QRCard
            price={(data?.delivery_price || 0) + (data?.order_amount || 0) || 0}
          />
          <Link
            href={'/orders?id=' + data?.id}
            mt={2}
            display={'flex'}
            alignItems={'center'}
            fontSize={20}
            gap={2}
          >
            <Icon
              icon='eva:arrow-back-fill'
              width='1.2em'
              height='1.2em'
              style={{ color: 'black' }}
            />
            {t('go_to_order')}
          </Link>
        </GridItem>
      </Grid>
    </Container>
  )
}

export default Kaspi
