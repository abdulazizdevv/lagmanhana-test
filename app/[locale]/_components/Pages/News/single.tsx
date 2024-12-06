'use client'
import BreadCrumb from '@/_components/Breadcrumb'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import { Box, Container, Flex, IconButton, Text } from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import { INews, IReviews } from '@/_types'
import dayjs from 'dayjs'
import Carousel from '@/_components/Carousel'
import Link from 'next/link'
import BackIcon from '@/_assets/icons/BackIcon'
import { useRouter } from 'next/navigation'
import CRating from './components/CRating'
import { Rating, RoundedStar } from '@smastrom/react-rating'
import Script from 'next/script'

const SingleNews = ({ data, reviews }: { data: INews; reviews: IReviews }) => {
  const t = useI18n()
  const currentLocale = useCurrentLocale()
  const [rate, setRate] = useState(0)

  const router = useRouter()
  const BreadCrumpStocks = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('news'),
      link: '/news',
    },
    {
      item: data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale],
      link: '/',
    },
  ]
  const onSelectRate = (newValue: any) => {
    setRate(newValue)
    // setOpenModal(true)
  }

  // const microdata = {
  //   '@context': 'http://schema.org',
  //   '@type': 'Product',
  //   name: 'Star rating snippet aggregator',
  //   aggregateRating: {
  //     '@type': 'AggregateRating',
  //     // ratingValue: data?.rating,
  //     ratingValue: 2,
  //     bestRating: '5',
  //     reviewCount: reviews?.count,
  //   },
  // }
  // const microdataJson = JSON.stringify(microdata)

  return (
    <>
      <Container maxW={'960px'} mb={{ base: '30px', md: '200px' }}>
        <Box my={{ base: '5px', md: '20px' }}>
          <BreadCrumb items={BreadCrumpStocks} />
          <Box mb={4}>
            <Flex alignItems={'center'} gap={1} mt={{ base: 0, md: 4 }}>
              <IconButton
                p={0}
                display={{ base: 'flex', md: 'none' }}
                aria-label='back'
                justifyContent={'center'}
                variant={'ghost'}
                icon={<BackIcon color='black' />}
                onClick={() => router.back()}
              />
              <Text fontWeight={700} fontSize={{ base: 22, md: 28 }}>
                {data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
              </Text>
            </Flex>
            <Flex alignItems={'center'} gap={'8px'} mt={'8px'}>
              <Icon
                icon='mage:calendar-2'
                width='16px'
                height='16px'
                style={{ color: '#101828' }}
              />
              <Text color={'#101828'} fontSize={14}>
                {dayjs(data?.created_at)
                  .locale('uz' ? 'uz-latn' : 'uz')
                  .format('MMMM D, YYYY')}
              </Text>
            </Flex>
            <Flex py={2} alignItems={'center'} justifyContent={'space-between'}>
              <Flex alignItems={'center'} justifyContent={'space-between'}>
                <Flex alignItems={'center'} gap={2}>
                  <Rating
                    readOnly={Boolean(true)}
                    style={{ maxWidth: 90 }}
                    value={data?.rate || 0}
                    itemStyles={{
                      itemShapes: RoundedStar,
                      activeFillColor: '#FFC500',
                      inactiveFillColor: '#E0E8F1',
                    }}
                    // onChange={onSelectRate}
                  />
                  {/* {data?.rate}/5 */}
                  <Text fontWeight={500} fontSize={12}>
                    {data?.rate || 0}/5
                  </Text>
                  <Text fontWeight={400} fontSize={12}>
                    {data?.rate || 0} отзывов
                  </Text>
                </Flex>
                {/* <Text fontSize={12} color={'#A5A5A5'}>
                {CUSTOM_ITEM_LABELS?.[currentLocale === 'kz' ? 'uz' : currentLocale]?.[rate - 1]}
              </Text> */}
              </Flex>
              <CRating review={reviews} newsId={data?.id} data={data} />
            </Flex>
          </Box>
        </Box>
        <Flex
          bg={'#fff'}
          p={{ base: 2, md: 4 }}
          rounded={'2xl'}
          flexDirection={'column'}
          gap={'24px'}
        >
          <Box
            sx={{
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <Carousel
              list={data?.images?.map((image) => ({
                active: true,
                title: data?.title,
                image,
              }))}
              h1={data?.title[currentLocale === 'kz' ? 'uz' : currentLocale]}
              aspectRatio='6 / 3'
            />
          </Box>
          <Flex
            flexDir={{ base: 'column-reverse', md: 'row' }}
            maxW={'669px'}
            margin={'0 auto'}
            gap={'24px'}
          >
            <Flex
              justifyContent={{ base: 'center', md: 'start' }}
              alignItems={'center'}
              flexDir={{ base: 'row', md: 'column' }}
              gap={'16px'}
            >
              <Link href={'/'}>
                <Icon
                  icon='mdi:facebook'
                  width='24px'
                  height='24px'
                  style={{ color: 'white' }}
                />
              </Link>
              <Link href={'/'}>
                <Icon
                  icon='ri:instagram-line'
                  width='1.2em'
                  height='1.2em'
                  style={{ color: 'white' }}
                />
              </Link>
              <Link href={'/'}>
                <Icon
                  icon='bi:telegram'
                  width='1.2em'
                  height='1.2em'
                  style={{ color: 'white' }}
                />
              </Link>
            </Flex>
            {/* <CRating
            review={product?.review}
            productId={product?.product_id}
            orderData={orderData}
            product={product}
          /> */}

            <Text fontSize={{ base: 14, md: 16 }} color={'#101828'}>
              <pre style={{ font: 'inherit', whiteSpace: 'pre-wrap' }}>
                {
                  data?.description?.[
                    currentLocale === 'kz' ? 'uz' : currentLocale
                  ]
                }
              </pre>
            </Text>
          </Flex>
        </Flex>
      </Container>
      {/* <Script
        id='microdata-news'
        strategy='lazyOnload'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: microdataJson }}
      /> */}
    </>
  )
}

export default SingleNews
