'use client'
import { memo } from 'react'
import { Box, Card, Flex, HStack, StackDivider } from '@chakra-ui/react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/_assets/logo.svg'

import { useI18n } from '@/_locales/client'
import dynamic from 'next/dynamic'

const AddressButton = dynamic(() => import('./components/AddressButton'), {
  ssr: false,
})
const DrawerButton = dynamic(() => import('./components/DrawerButton'), {
  ssr: false,
})
const CartButton = dynamic(() => import('./components/CartButton'), {
  ssr: false,
})
const User = dynamic(() => import('./components/User'), {
  ssr: false,
})
const MobileMiddle = dynamic(() => import('./components/MobileMiddle'))
const LanguageSwitch = dynamic(() => import('./components/LanguageSwitch'))
const OrderTypes = dynamic(() => import('./components/OrderTypes'))
const Search = dynamic(() => import('./components/Search'))

function Header() {
  const t = useI18n()
  return (
    <Card
      shadow={'none'}
      position='sticky'
      top={0}
      left={0}
      zIndex={40}
      as={'header'}
      mt={0}
      borderRadius={{ base: '0 0 12px 12px', md: 0 }}
    >
      <Box m={0} px={{ base: '16px', xl: '32px' }}>
        {/* Mobile version */}
        <>
          <Flex
            gap={1}
            py={2}
            align='center'
            justify='space-between'
            display={{ base: 'flex', lg: 'none' }}
          >
            <Flex alignItems={'center'} gap={1}>
              <DrawerButton />
              <Link href='/'>
                <Image
                  src={logo}
                  alt={'logo'}
                  priority={true}
                  width={54}
                  height={36}
                  style={{ width: '54px', height: '36px' }}
                />
              </Link>
            </Flex>
            <User />
          </Flex>
          <Box bg={'#fff'} pb={2} display={{ base: 'block', lg: 'none' }}>
            <MobileMiddle />
          </Box>
        </>
        {/* Desktop version */}
        <Flex
          gap={1}
          py={'6px'}
          m={0}
          align='center'
          bg={'#fff'}
          shadow={0}
          boxShadow={'none'}
          justify='space-between'
          display={{ base: 'none', lg: 'flex' }}
        >
          <Flex align='center' gap={4}>
            <DrawerButton />
            <Link href='/'>
              <Image
                src={logo}
                alt={'logo'}
                priority={true}
                width={64}
                height={60}
                style={{ width: '64px', height: '60px' }}
              />
            </Link>
            <HStack spacing={'16px'}>
              <OrderTypes />
              <AddressButton />
            </HStack>
          </Flex>
          <HStack>
            <Search />
            <LanguageSwitch />
            <CartButton />
            <User />
          </HStack>
        </Flex>
      </Box>
    </Card>
  )
}

export default memo(Header)
