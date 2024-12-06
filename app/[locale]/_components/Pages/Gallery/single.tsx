'use client'
import { Box, Container, Flex, IconButton, Text } from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import dayjs from 'dayjs'
import BreadCrumb from '@/_components/Breadcrumb'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import { INews } from '@/_types'
import Slider from './components/Slider'
import BackIcon from '@/_assets/icons/BackIcon'
import { useRouter } from 'next/navigation'

const SingleGallery = ({ data }: { data: INews }) => {
  const t = useI18n()
  const currentLocale = useCurrentLocale()
  const router = useRouter()

  const BreadCrumpStocks = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('gallery'),
      link: '/gallery',
    },
    {
      item: data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale],
      link: '/',
    },
  ]

  return (
    <Container
      maxW={{ base: '100%', md: '948px' }}
      mb={{ base: '30px', md: '200px' }}
    >
      <Box my={{ base: 2, md: 4 }}>
        <BreadCrumb items={BreadCrumpStocks} />
        <Box display={{ base: 'none', md: 'block' }}>
          <Text mt={3} fontWeight={700} fontSize={28}>
            {data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
          </Text>
          <Flex alignItems='center' gap={2} mt={2}>
            <Icon icon='mage:calendar-2' width='16px' height='16px' />
            <Text fontSize='sm'>
              {dayjs(data?.created_at)
                .locale('uz' ? 'uz-latn' : 'uz')
                .format('MMMM D, YYYY')}
            </Text>
          </Flex>
        </Box>
        <Flex
          display={{ base: 'flex', md: 'none' }}
          alignItems={'center'}
          gap={1}
          mt={{ base: 0, md: 4 }}
        >
          <IconButton
            p={0}
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
      </Box>
      <Flex
        rounded='3xl'
        p={6}
        bgColor='white'
        flexDirection='column'
        gap='32px'
      >
        <Box
          sx={{
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <Slider
            aspectRatio='2 / 1'
            list={data?.images?.map((image) => ({
              active: true,
              title: data?.title,
              image,
            }))}
            h1={t('gallery')}
          />
        </Box>
        <Flex maxW='670px' margin='0 auto'>
          <Text as='pre' style={{ font: 'inherit', whiteSpace: 'pre-wrap' }}>
            {data?.description?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
          </Text>
        </Flex>
      </Flex>
    </Container>
  )
}

export default SingleGallery
