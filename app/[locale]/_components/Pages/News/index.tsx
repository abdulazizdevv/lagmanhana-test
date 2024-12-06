'use client'

import BreadCrumb from '@/_components/Breadcrumb'
import { useI18n } from '@/_locales/client'
import {
  Box,
  Button,
  Center,
  Container,
  Grid,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { INews } from '@/_types'
import NewsCard from '@/_components/NewsCard'
import NoNews from '@/_assets/illustration/emptyNews.svg'
import Link from 'next/link'
import Image from 'next/image'
import PaginationComponent from '@/_components/Pagination'
import { useSearchParams } from 'next/navigation'

const NewsPage = ({
  data,
}: {
  data: { news_events: INews[]; count: number }
}) => {
  const t = useI18n()
  const searchParams = useSearchParams()
  const page = searchParams.get('page')

  const [current, setCurrent] = useState(page || 1)

  const BreadcrumbData = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('seo.h1_blog'),
      link: '/news',
    },
  ]

  if (!data?.news_events?.length) {
    return (
      <Container>
        <Box mt={{ base: 0, md: '20px' }}>
          <BreadCrumb items={BreadcrumbData} />
          <Text
            display={{ base: 'none', md: 'block' }}
            mt={{ base: 0, md: 4 }}
            fontWeight={700}
            fontSize={28}
          >
            {t('seo.h1_blog')}
          </Text>
        </Box>
        <Center flexDir='column' minH='80vh'>
          <Image src={NoNews} alt={'no news'} width={110} height={110} />
          <Text fontWeight={600} fontSize='2xl' mt={4} mb={2}>
            {t('no_news_yet')}
          </Text>
          <Text mb={4} color='gray.500' textAlign='center' maxW='450px'>
            {t('fresh_news_coming_soon')}
          </Text>
          <Link href='/'>
            <Button fontWeight={500} variant='primary'>
              {t('back_to_home')}
            </Button>
          </Link>
        </Center>
      </Container>
    )
  }

  return (
    <Container>
      <Box mb={{ base: '16px', md: '142px' }}>
        <Box my={{ base: 0, md: '20px' }}>
          <BreadCrumb items={BreadcrumbData} />
          <Text fontWeight={700} fontSize={28}>
            {t('seo.h1_blog')}
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
          {data?.news_events?.map((el: INews, index: number) => (
            <NewsCard index={index + 1} key={el.id} data={el} />
          ))}
        </SimpleGrid>
        {data?.count > 10 && (
          <Box pt={3}>
            <PaginationComponent
              setCurrent={setCurrent}
              current={current}
              totalItems={data?.count}
              itemsPerPage={10}
            />
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default NewsPage
