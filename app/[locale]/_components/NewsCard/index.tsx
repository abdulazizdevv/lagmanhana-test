'use client'

import { INews } from '@/_types'
import { Box, Button, Card, GridItem, Text } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import defaultImage from '@/_assets/illustration/no_photo.svg'
import { useCurrentLocale, useI18n } from '@/_locales/client'

const NewsCard = ({ data, index }: { data: INews; index: number }) => {
  const router = useRouter()
  const currentLocale = useCurrentLocale()
  const t = useI18n()
  return (
    <Card shadow={'none'} borderRadius={24} p={3} position='relative'>
      <Link href={'/news/' + data?.slug}>
        <Box height='191px' position={'relative'}>
          <Image
            src={
              data?.images?.length > 0
                ? process.env.BASE_URL + data?.images[0]
                : defaultImage
            }
            // alt={t('seo.h1_blog') + ` - photo ${index}`}
            alt={data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
            style={{
              width: '100%',
              objectFit: 'cover',
              borderRadius: '16px',
            }}
            fill
          />
        </Box>
      </Link>
      <Box py={2} pb={'30px'}>
        {' '}
        {/* Add padding-bottom to ensure space for the button */}
        <Text fontSize={'2xl'} fontWeight={500}>
          {data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
        </Text>
        <Text
          color={'#667085'}
          fontWeight={400}
          fontSize={18}
          lineHeight={'21px'}
          h={'66px'}
          mb={4}
        >
          {data?.description?.[
            currentLocale === 'kz' ? 'uz' : currentLocale
          ]?.substring(0, 60) +
            (data?.description?.[currentLocale === 'kz' ? 'uz' : currentLocale]
              ?.length > 60
              ? '...'
              : '')}
        </Text>
      </Box>
      <Link href={'/news/' + data?.slug}>
        <Button
          position='absolute'
          bottom={3}
          left={3}
          right={3}
          bg={'primary.200'}
          variant={'primary.200'}
          borderRadius={12}
          color={'primary.500'}
          fontWeight={500}
        >
          {t('detailed')}
        </Button>
      </Link>
    </Card>
  )
}

export default NewsCard
