'use client'

import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react'
import MaxwayAdvert from '@/_assets/Maxway_advert.png'
import Image from 'next/image'
import Link from 'next/link'
import CloseButton from './CloseButton'
import { useI18n } from '@/_locales/client'
import { useSelector } from 'react-redux'
import { IRedux } from '@/_types'

function MobileAd({ isClosable = true }) {
  const t = useI18n()

  const { mobileAd, caniuseCookies } = useSelector(
    (state: IRedux) => state.session
  )

  return (
    <Box
      maxW='592px'
      width='calc(100% - 32px)'
      h='fit-content'
      borderRadius='2xl'
      background={
        'linear-gradient(91.42deg, rgba(51, 51, 51, 0.75) 0%, rgba(51, 51, 51, 0.35) 100%)'
      }
      border='1px solid #FFFFFF3D'
      display={{
        base: mobileAd && caniuseCookies ? 'block' : 'none',
        md: mobileAd ? 'block' : 'none',
      }}
      position='fixed'
      backdropFilter='blur(20px)'
      transform={{ base: 'translateX(0%)', md: 'translateX(-50%)' }}
      left={{ base: '0%', md: '50%' }}
      bottom={{ base: '8px', md: '8px' }}
      mx={4}
    >
      <Flex p={2} gap={2} alignItems={'center'}>
        {isClosable && <CloseButton />}
        <Image src={MaxwayAdvert} alt='Lagmanhana' width={64} height={64} />
        <Stack gap='3px'>
          <Text fontSize={14} lineHeight={1}>
            Lagmanhana
          </Text>
          <Text color={'#A5A5A5'} fontSize={11} lineHeight={1}>
            SmartPicasso
          </Text>
          <Text fontSize={10} lineHeight={1}>
            ⭐⭐⭐⭐⭐
          </Text>
          <Text color={'#A5A5A5'} fontSize={12} lineHeight={1}>
            GET — On the App Store
          </Text>
        </Stack>
        <Button
          href='/privacy-policy'
          as={Link}
          py={'10px'}
          px={'16px'}
          variant='primary'
          ml='auto'
        >
          {t('download')}
        </Button>
      </Flex>
    </Box>
  )
}

export default MobileAd
