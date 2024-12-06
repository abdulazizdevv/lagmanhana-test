'use client'

import React, { useState } from 'react'
import BreadCrumb from '@/_components/Breadcrumb'
import { useI18n } from '@/_locales/client'
import {
  Box,
  Button,
  Card,
  Container,
  GridItem,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { authActions } from '@/_store/auth/auth.slice'
import { useRouter } from 'next/navigation'
import Details from './components/Details'
import MobileAd from '@/_components/MobileAd'
import Addresses from './components/Addresses'
import Cashback from './components/Cashback'

const Profile = () => {
  const t = useI18n()
  const router = useRouter()
  const dispatch = useDispatch()

  const BreadCrumpProfile = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('profile'),
      link: '/profile',
    },
  ]

  const onLogout = () => {
    dispatch(authActions.logout())
    router.push('/')
  }

  return (
    <>
      <Container mt={{ base: 3, md: 6 }} pb={{ base: '37px', md: '83px' }}>
        <BreadCrumb items={BreadCrumpProfile} />
        <Box mb={5}>
          <Heading as={'h1'}>{t('profile')}</Heading>
        </Box>
        <Stack gap={4} maxW='536px'>
          <Card shadow={'none'} p={3} gap={4} borderRadius='2xl'>
            <Details />
            <Cashback />
          </Card>
          <Addresses />
          <Button
            mt={2}
            w={{ md: 'fit-content' }}
            color={'error'}
            bg={'#fff'}
            variant='#fff'
            onClick={onLogout}
            h={'48px'}
          >
            {t('logout')}
          </Button>
        </Stack>
      </Container>
    </>
  )
}

export default Profile
