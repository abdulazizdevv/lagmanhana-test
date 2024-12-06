'use client'
import BreadCrumb from '@/_components/Breadcrumb'
import { IGallery } from '@/_types'
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import GalleryCard from './components/GalleryCard'
import { useI18n } from '@/_locales/client'
import NoGallery from '@/_assets/illustration/NoGallery.svg'
import Link from 'next/link'
import Image from 'next/image'

const GalleryPage = ({ data }: { data: IGallery[] }) => {
  const t = useI18n()

  const BreadcrumbData = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('gallery'),
      link: '/gallery',
    },
  ]

  if (!data?.length) {
    return (
      <Container>
        <Box mt={{ base: 2, md: 4 }}>
          <BreadCrumb items={BreadcrumbData} />
        </Box>
        <Center flexDir='column' minH='80vh'>
          <Image src={NoGallery} alt='No news' width={190} height={190} />
          <Text fontWeight={600} fontSize='xl' mt={4} mb={2}>
            {t('no_images_yet')}
          </Text>
          <Text mb={4} color='#A5A5A5' textAlign='center' maxW='450px'>
            {t('gallery_will_be_updated_soon')}
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
      <Box mb={{ base: 4, md: '100px' }}>
        <Box my={{ base: 2, md: 4 }}>
          <BreadCrumb items={BreadcrumbData} />
          <Heading size='lg' mt={{ base: 0, md: 3 }}>
            {t('gallery')}
          </Heading>
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
          {data?.map((el: IGallery, idx: number) => (
            <GalleryCard index={idx} key={el.id} data={el} />
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  )
}

export default GalleryPage
