'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
// Style
import { useRouter, useSearchParams } from 'next/navigation'
import { IOrder, IRedux } from '@/_types'
import {
  Box,
  Button,
  Center,
  Container,
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  SimpleGrid,
  Text,
  useMediaQuery,
} from '@chakra-ui/react'
import OrderCard from './Card'
import Preview from './Preview'
import { useI18n } from '@/_locales/client'
import { Icon } from '@iconify/react/dist/iconify.js'
import Image from 'next/image'
import NoOrders from '@/_assets/illustration/emptyOrder.svg'
import BreadCrumb from '@/_components/Breadcrumb'
import PaginatedItems from '@/_components/Pagination'
import PaginationComponent from '@/_components/Pagination'

function Orders({
  ordersData,
}: {
  ordersData: { count: number; orders: IOrder[] } | null
}) {
  const { user } = useSelector((state: IRedux) => state.auth)
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = searchParams.get('page')

  const [current, setCurrent] = useState(page || 1)
  const [md] = useMediaQuery('(max-width: 768px)')
  const t = useI18n()

  const id = searchParams?.get('id')

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
    if (ordersData?.orders?.length && !page && md) {
      router.push(`orders?id=${ordersData.orders[0].id}`)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const BreadCrumpOrders = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('my_order'),
      link: '/orders',
    },
  ]

  if (!ordersData?.orders?.length) {
    return (
      <Container mt={3}>
        <BreadCrumb items={BreadCrumpOrders} />
        <Center flexDir='column' minH='80vh'>
          <Image src={NoOrders} alt='No orders' width={187} height={145} />
          <Text fontWeight={500} fontSize='24px' mt={4} mb={2}>
            {t('no_order_title')}
          </Text>
          <Text mb={4} color='gray.500' textAlign='center' maxW='450px'>
            {t('no_order_descr')}
          </Text>
          <Link href='/'>
            <Button
              variant='primary'
              borderRadius={8}
              fontSize={14}
              fontWeight={500}
              py={'14px'}
            >
              {t('back_to_menu')}
            </Button>
          </Link>
        </Center>
      </Container>
    )
  }

  return (
    <Container mt={{ base: 0, md: 6 }}>
      <Box display={{ base: id ? 'none' : 'block', md: 'block' }}>
        <BreadCrumb items={BreadCrumpOrders} />
        <HStack mt={{ base: 0, md: 3 }} align='center' mb={{ base: 4, md: 8 }}>
          {id && (
            <Link href='/orders'>
              <IconButton
                display={{ base: 'flex', md: 'none' }}
                aria-label='Back to orders'
                icon={
                  <Icon
                    icon='material-symbols:chevron-left-rounded'
                    fontSize={24}
                  />
                }
                variant={'transparent'}
              />
            </Link>
          )}
          <Heading size='lg'>{t('my_orders')}</Heading>
        </HStack>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Box display={{ base: id ? 'none' : 'block', md: 'block' }}>
          {ordersData?.orders?.map((order) => (
            <Link
              key={order.id}
              href={
                page
                  ? `/orders?id=${order.id}&page=${page}`
                  : `/orders?id=${order.id}`
              }
            >
              <OrderCard order={order} />
            </Link>
          ))}
        </Box>
        <Box>{id && <Preview id={id} />}</Box>
      </SimpleGrid>
      {md ? (
        !id && (
          <PaginationComponent
            setCurrent={setCurrent}
            current={current}
            totalItems={ordersData?.count}
            itemsPerPage={10}
          />
        )
      ) : (
        <PaginationComponent
          setCurrent={setCurrent}
          current={current}
          totalItems={ordersData?.count}
          itemsPerPage={10}
        />
      )}
    </Container>
  )
}

export default Orders
