'use client'

import CloseIcon from '@/_assets/icons/CloseIcon'
import HamburgerIcon from '@/_assets/icons/hamburger'
import { useI18n } from '@/_locales/client'
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Stack,
  StackDivider,
  Text,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import Image from 'next/image'
import Link from 'next/link'
import logo from '@/_assets/logo.svg'

import { useSelector } from 'react-redux'
import AuthDialog from '@/_components/AuthDialog'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import BackButton from '../BackButton'
import LanguageSwitch from './LanguageSwitch'
import { IRedux } from '@/_types'
import { fonts } from '@/fonts'
import LogOut from '@/_assets/icons/LogOut'
import LoginBtn from './components/LoginBtn'
import UserData from './components/UserData'

function DrawerButton() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isAuth, setIsAuth] = useState(false)

  const t = useI18n()
  const pathname = usePathname()
  const { user } = useSelector((state: IRedux) => state.auth)
  const [isMobile] = useMediaQuery('(max-width: 992px)')
  const links = [
    { id: 'drawer-menu', label: t('menu'), link: '/' },
    { id: 'drawer-about', label: t('about'), link: '/about' },
    { id: 'drawer-promotions', label: t('promotions'), link: '/promo' },
    { id: 'drawer-restaurants', label: t('restaurants'), link: '/restaurants' },
    { id: 'drawer-news', label: t('news'), link: '/news' },
    { id: 'drawer-gallery', label: t('gallery'), link: '/gallery' },
    { id: 'drawer-vacancies', label: t('vacancies'), link: '/vacancies' },
    {
      id: 'drawer-addresses_and_delivery_zones',
      label: t('addresses_and_delivery_zones'),
      link: '/delivery',
    },
    { id: 'drawer-contact', label: t('contact'), link: '/contacts' },
    { id: 'drawer-offer', label: t('offer'), link: '/offer' },
    { id: 'drawer-rules', label: t('privacy_policy'), link: '/rules' },
    // { label: t('privacy_policy'), link: '/privacy-policy' },
  ]

  const txtColor = useColorModeValue('#222222', '#FFFFFF')

  return (
    <>
      <IconButton
        aria-label='Open menu'
        icon={<HamburgerIcon color={txtColor} />}
        variant='ghost'
        onClick={onOpen}
      />
      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent px={{ base: 2, md: 4 }}>
          <DrawerHeader py={'18px'} px={0}>
            {isMobile ? (
              <>
                {user ? (
                  <UserData
                    onClose={onClose}
                    setIsAuth={setIsAuth}
                    isAuth={isAuth}
                  />
                ) : (
                  <LoginBtn
                    onClose={onClose}
                    setIsAuth={setIsAuth}
                    isAuth={isAuth}
                  />
                )}
              </>
            ) : (
              <HStack justify='space-between'>
                <Link href='/'>
                  <Image
                    src={logo}
                    alt={'logo'}
                    priority={true}
                    width={64}
                    height={40}
                    style={{ width: '64px', height: '40px' }}
                  />
                </Link>

                <IconButton
                  aria-label='Open menu'
                  icon={<CloseIcon color={txtColor} />}
                  variant='ghost'
                  onClick={onClose}
                  bg={'#fff'}
                  borderRadius={'full'}
                />
              </HStack>
            )}
          </DrawerHeader>
          <LanguageSwitch />
          <DrawerBody p={0} mt={4}>
            <Stack>
              {links.map((item) => (
                <Link href={item?.link} key={item?.link} id={item?.id}>
                  <HStack
                    justify='space-between'
                    py={'6px'}
                    onClick={onClose}
                    fontWeight={400}
                    _hover={{
                      color: 'primary.500',
                    }}
                  >
                    <Text>{item?.label}</Text>
                  </HStack>
                </Link>
              ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <AuthDialog isOpen={isAuth} onClose={() => setIsAuth(false)} />
    </>
  )
}

export default DrawerButton
