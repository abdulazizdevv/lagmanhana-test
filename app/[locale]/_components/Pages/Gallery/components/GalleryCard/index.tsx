'use client'

import { IGallery, INews } from '@/_types'
import { Box, Button, Card, Flex, Link, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import dayjs from 'dayjs'
import defaultImage from '@/_assets/illustration/no_photo.svg'
import { Icon } from '@iconify/react/dist/iconify.js'

const GalleryCard = ({ data, index }: { data: IGallery; index: number }) => {
  const currentLocale = useCurrentLocale()
  const t = useI18n()

  const getLocaleText = (obj: any) =>
    obj?.[currentLocale === 'kz' ? 'uz' : currentLocale]

  return (
    <Card
      shadow={'none'}
      className='gallery-card'
      borderRadius={24}
      p={3}
      position='relative'
    >
      <Link href={'/gallery/' + data?.slug}>
        <Box
          sx={{
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
          height='191px'
          position={'relative'}
        >
          <Image
            src={
              data?.images?.length > 0
                ? process.env.BASE_URL + data?.images[0]
                : defaultImage
            }
            alt={t('gallery') + ` - photo ${index}`}
            style={{
              width: '100%',
              objectFit: 'cover',
              borderRadius: '16px',
            }}
            fill
          />
        </Box>
      </Link>
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
      <Box py={2} pb={'30px'}>
        <Text fontSize={'2xl'} fontWeight={500}>
          {getLocaleText(data?.title)}
        </Text>
        <Text
          color={'#667085'}
          fontWeight={400}
          fontSize={18}
          lineHeight={'21px'}
          h={'66px'}
          mb={4}
        >
          {getLocaleText(data?.description)?.substring(0, 60) +
            (getLocaleText(data?.description)?.length > 60 ? '...' : '')}
        </Text>
      </Box>
      <Link href={'/gallery/' + data?.slug}>
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

export default GalleryCard
