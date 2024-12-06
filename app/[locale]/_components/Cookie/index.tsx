'use client'

import { Box, Button, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import nookies from 'nookies'
import { useEffect, useState } from 'react'

function CookiePermission() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const cookies = nookies.get(null)
    if (!cookies['cookie-consent']) {
      setShowPopup(true)
    }
  }, [])

  const acceptCookies = () => {
    nookies.set(null, 'cookie-consent', 'accepted', {
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
    })
    setShowPopup(false)
  }

  // const declineCookies = () => {
  //   nookies.set(null, 'cookie-consent', 'declined', {
  //     maxAge: 365 * 24 * 60 * 60,
  //     path: '/',
  //   })
  //   setShowPopup(false)
  // }

  if (!showPopup) return null

  return (
    <Box
      maxW='370px'
      bgColor='#fff'
      h='fit-content'
      borderRadius='2xl'
      width='calc(100% - 32px)'
      border='1px solid #FFFFFF3D'
      position='fixed'
      backdropFilter='blur(20px)'
      left={{ base: '0%', md: '16px' }}
      bottom={{ base: '8px', md: '8px' }}
      mx={4}
      zIndex={999999}
    >
      <Flex py={2} px={4} gap={2} alignItems={'center'}>
        <Text color='#a5a5a5' fontSize={11}>
          Мы используем cookie 🍪 для улучшения качества обслуживания. Продолжая
          использовать наш сайт, вы соглашаетесь с{' '}
          <Text href='/privacy-policy' as={Link} textDecor='underline'>
            политикой конфиденциальности
          </Text>
          .
        </Text>
        <Button
          py='10px'
          px='16px'
          ml='auto'
          variant='primary'
          minW='70px'
          onClick={acceptCookies}
        >
          OK
        </Button>
      </Flex>
    </Box>
  )
}

export default CookiePermission
