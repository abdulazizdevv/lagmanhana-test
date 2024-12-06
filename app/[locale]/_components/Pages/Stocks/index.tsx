'use client'

import BreadCrumb from '@/_components/Breadcrumb'
import { useI18n } from '@/_locales/client'
import {
  Box,
  Button,
  Center,
  Container,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import { IStocks } from '@/_types'
import StocksCard from '@/_components/StocksCard'
import NoPromos from '@/_assets/illustration/NoPromos.svg'
import Image from 'next/image'
import Link from 'next/link'

const StocksPage = ({ data }: { data: IStocks[] }) => {
  const t = useI18n()

  const BreadcrumbData = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('seo.h1_stock'),
      link: '/promo',
    },
  ]

  if (!data.length) {
    return (
      <Container>
        <Box mt={{ base: '3px', md: '20px' }}>
          <BreadCrumb items={BreadcrumbData} />
        </Box>
        <Center flexDir='column' minH='80vh'>
          <Image src={NoPromos} alt='No promotions' width={110} height={110} />
          <Text fontWeight={600} fontSize='xl' mt={4} mb={2}>
            {t('no_promotions_yet')}
          </Text>
          <Text mb={4} color='#A5A5A5' textAlign='center' maxW='450px'>
            {t('check_back_for_new_offers_and_discounts')}
          </Text>
          <Link href='/'>
            <Button variant='primary'>{t('back_to_home')}</Button>
          </Link>
        </Center>
      </Container>
    )
  }

  return (
    <Container>
      <Box>
        <Box my={{ base: '0px', md: '24px' }}>
          <Box>
            <BreadCrumb items={BreadcrumbData} />
          </Box>
          <Text mb={4} fontWeight={700} fontSize={{ base: 24, md: 28 }}>
            {t('seo.h1_stock')}
          </Text>
        </Box>
        <SimpleGrid
          mt={{ base: 0, md: 3 }}
          columns={{
            base: 1,
            sm: 2,
            lg: 3,
          }}
          gap={{ base: 2, md: 4 }}
        >
          {data?.map((el: IStocks, idx: number) => (
            <StocksCard
              index={idx + 1}
              h1={t('seo.h1_stock')}
              key={el.id}
              data={el}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  )
}

export default StocksPage
