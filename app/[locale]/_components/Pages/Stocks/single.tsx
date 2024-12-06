'use client'
import BreadCrumb from '@/_components/Breadcrumb'
import PostText from '@/_components/PostText'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import { Box, Card, Container, Flex, IconButton, Text } from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import Image from 'next/image'
import React from 'react'
import { IStocks } from '@/_types'
import dayjs from 'dayjs'
import BackIcon from '@/_assets/icons/BackIcon'
import { useRouter } from 'next/navigation'

const SingleStock = ({ data }: { data: IStocks }) => {
  const t = useI18n()
  const currentLocale = useCurrentLocale()
  const router = useRouter()
  const BreadCrumpStocks = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('stocks'),
      link: '/promo',
    },
    {
      item: data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale],
      link: '',
    },
  ]

  return (
    <Container maxW={'964px'} mb={{ base: '30px', md: '200px' }}>
      <Box my={{ base: '5px', md: '20px' }}>
        <Box my={{ base: 0, md: 4 }}>
          <BreadCrumb items={BreadCrumpStocks} />
        </Box>
        <Box>
          <Flex alignItems={'center'} mt={{ base: 0, md: 4 }} gap={1}>
            <IconButton
              variant={'ghost'}
              onClick={() => router.back()}
              aria-label='back'
              justifyContent={'center'}
              display={{ base: 'flex', md: 'none' }}
              icon={<BackIcon color='black' />}
            />
            <Text fontWeight={700} fontSize={{ base: 22, md: 28 }}>
              {data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
            </Text>
          </Flex>
          <Flex alignItems={'center'} gap={'8px'} mt={'8px'}>
            <Icon icon='mage:calendar-2' />
            <Text fontSize={14}>
              {dayjs(data?.created_at)
                .locale('uz' ? 'uz-latn' : 'uz')
                .format('MMMM D, YYYY')}
            </Text>
          </Flex>
        </Box>
      </Box>
      <Card
        shadow={'none'}
        display={'flex'}
        p={{ base: 2, md: 4 }}
        borderRadius={24}
        flexDirection={'column'}
        gap={{ base: '9px', md: '24px' }}
      >
        {data?.image && (
          <Box
            style={{
              position: 'relative',
              width: 'auto',
              // height: 'auto',
              maxHeight: '487px',
              display: 'grid',
              placeItems: 'center',
            }}
            aspectRatio={{ base: 2 / 1, md: 3 / 2 }}
          >
            <Image
              src={process.env.BASE_URL + data?.image}
              alt={
                data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale] +
                ` - photo 1`
              }
              style={{
                width: '100%',
                borderRadius: '12px',
                objectFit: 'cover',
              }}
              priority={true}
              fill
            />
          </Box>
        )}
        <Box fontSize={{ base: 16, md: 18 }}>
          <PostText data={data} />
        </Box>
      </Card>
    </Container>
  )
}

export default SingleStock
