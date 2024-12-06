'use client'
import React from 'react'
import { Button, Center, Link, Text } from '@chakra-ui/react'
import Image from 'next/image'
import NotFoundImg from '@/_assets/illustration/404.svg'
import { useI18n } from '@/_locales/client'

const Page404 = () => {
  const t = useI18n()
  return (
    <Center flexDir={'column'} gap={3} minH={'80vh'} mx={3}>
      <div
        style={{
          position: 'relative',
          maxWidth: '532px',
          aspectRatio: '3 / 2',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {/* <Image
          src={NotFoundImg}
          priority={true}
          width={1000}
          height={567}
          style={{
            aspectRatio: 3 / 2,
            width: '100%',
          }}
          alt={'404' + ` - photo 1`}
        /> */}
        <Text fontWeight={'bold'} fontSize={{ base: 100, md: 150 }}>
          404
        </Text>
      </div>

      <Text
        textTransform='uppercase'
        color={'primary.500'}
        fontSize={{ base: 30, md: 48 }}
        fontWeight={700}
      >
        {t('not_found_title')}
      </Text>
      <Text color={'#475467'} textAlign={'center'}>
        {t('not_found_text')}
      </Text>
      <Button
        mt={3}
        variant={'primary.500'}
        colorScheme='primary.500'
        bg={'primary.500'}
        fontSize={14}
        fontWeight={500}
        href='/'
        as={Link}
      >
        {t('back_main_page')}
      </Button>
    </Center>
  )
}

export default Page404
