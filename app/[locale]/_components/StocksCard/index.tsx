'use client'

import { IStocks } from '@/_types'
import Image from 'next/image'
import Link from 'next/link'
import { Box, Button, Card, Text } from '@chakra-ui/react'
import defaultImage from '@/_assets/illustration/no_photo.svg'
import { useCurrentLocale, useI18n } from '@/_locales/client'

const StocksCard = ({
  data,
  h1,
  index,
}: {
  data: IStocks
  h1: string
  index: number
}) => {
  const t = useI18n()
  const currentLocale = useCurrentLocale()

  return (
    <Card shadow={'none'} borderRadius={24} p={3} position='relative'>
      <Link href={'/promo/' + data?.slug}>
        <Box height='191px' position={'relative'}>
          <Image
            src={data?.image ? data?.image : defaultImage}
            // alt={data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
            alt={h1 + ` - photo ${index}`}
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
        <Text fontSize={24} fontWeight={500}>
          {data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
        </Text>
        <Text
          color={'#667085'}
          fontWeight={400}
          fontSize={18}
          lineHeight={'21px'}
          h={'66px'}
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
      <Link href={'/promo/' + data?.slug}>
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
          // w='100%' // Adjust width to fit within the card padding
        >
          {t('detailed')}
        </Button>
      </Link>
    </Card>
  )
}

export default StocksCard
