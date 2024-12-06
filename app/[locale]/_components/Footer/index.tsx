'use client'

import { memo, useEffect } from 'react'
import dayjs from 'dayjs'
import {
  Box,
  Container,
  Flex,
  ListItem,
  Text,
  UnorderedList,
  useColorModeValue,
} from '@chakra-ui/react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/_assets/logo.svg'
import AppStore from '@/_assets/app_store.svg'
import GooglePlay from '@/_assets/google_play.svg'
import { Icon } from '@iconify/react'
import styles from './style.module.scss'
import { useI18n } from '@/_locales/client'
import { useShipperById } from '@/_services/customerService'
import { useDispatch } from 'react-redux'
import { settingActions } from '@/_store/settings/settings.slice'
import Pattern from '@/_assets/illustration/Pattern'
import FaceBookIcon from '@/_assets/icons/facebook'
import YoutubeIcon from '@/_assets/icons/Youtube'

function Footer() {
  const t = useI18n()
  const dispatch = useDispatch()

  const { data } = useShipperById({ id: process.env.NEXT_PUBLIC_SHIPPER_ID! })

  useEffect(() => {
    if (data && data?.country) {
      dispatch(
        settingActions.setCountry({
          iso_code: data?.country?.iso_code,
          currency: data?.country?.currency,
        })
      )
    }
  }, [data])

  const bgColor = useColorModeValue('paper.light.500', 'paper.dark.500')

  return (
    <Box as='footer' bgColor={'#fff'} mt={8} position='relative' zIndex={1}>
      <Container>
        {/* Desktop version */}
        <Box pt={'32px'} pb={6} display={{ base: 'none', md: 'block' }}>
          <Flex
            flexWrap={'wrap'}
            alignItems={'start'}
            justifyContent={'space-between'}
          >
            <Flex flexDirection={'column'} gap={6}>
              <Link href='/'>
                <Image
                  src={logo}
                  alt={'logo'}
                  priority={true}
                  width={64}
                  height={40}
                />
              </Link>
              {/* <Flex flexDirection={'column'} gap={4}>
                <Link href='https://apps.apple.com/uz/app/maxway/id1565502018'>
                  <Image
                    src={AppStore}
                    alt={'logo'}
                    priority={true}
                    width={138}
                    height={40}
                  />
                </Link>
                <Link
                  href={
                    'https://play.google.com/store/apps/details?id=uz.udevs.maxway_client_mobile'
                  }
                >
                  <Image
                    src={GooglePlay}
                    alt={'logo'}
                    priority={true}
                    width={138}
                    height={40}
                  />
                </Link>
              </Flex> */}
            </Flex>
            <UnorderedList
              display={'flex'}
              flexDirection={'column'}
              gap={'10px'}
              styleType={'none'}
            >
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/`} className={styles.links}>
                  {t('menu')}
                </Link>
              </ListItem>
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/about`} className={styles.links}>
                  {t('about')}
                </Link>
              </ListItem>
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/promo`} className={styles.links}>
                  {t('stock')}
                </Link>
              </ListItem>
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/restaurants`} className={styles.links}>
                  {t('restaurant')}
                </Link>
              </ListItem>
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/news`} className={styles.links}>
                  {t('news')}
                </Link>
              </ListItem>

              {/* <ListItem>
                <Link href={`/delivery`} className={styles.links}>
                  {t('addresses_and_delivery_zones')}
                </Link>
              </ListItem> */}
            </UnorderedList>
            <UnorderedList
              display={{ base: 'none', lg: 'flex' }}
              flexDirection={'column'}
              gap={'10px'}
              styleType={'none'}
              _hover={{
                color: 'primary.500',
              }}
            >
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/vacancies`} className={styles.links}>
                  {t('vacancies')}
                </Link>
              </ListItem>
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/delivery`} className={styles.links}>
                  {t('addresses_and_delivery_zones')}
                </Link>
              </ListItem>
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/contacts`} className={styles.links}>
                  {t('contact')}
                </Link>
              </ListItem>
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/gallery`} className={styles.links}>
                  {t('gallery')}
                </Link>
              </ListItem>
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/offer`} className={styles.links}>
                  {t('offer')}
                </Link>
              </ListItem>
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/rules`} className={styles.links}>
                  {t('privacy_policy')}
                </Link>
              </ListItem>
              {/* <ListItem>
                <Link href={`/privacy-policy`} className={styles.links}>
                  {t('privacy_policy')}
                </Link>
              </ListItem> */}
            </UnorderedList>
            <div className={styles.footer_social_media}>
              <Flex flexDirection={'column'} alignItems={'end'} gap='12px'>
                {data?.phone?.[0] && (
                  <Text textDecor={'underline'} fontWeight={700} fontSize={24}>
                    <Link href={`tel:${data?.phone?.[0]}`}>
                      {data?.phone?.[0]}
                    </Link>
                  </Text>
                )}
                <Text>
                  {t('from_to', {
                    from: data?.work_hour_start,
                    to: data?.work_hour_end,
                  })}
                </Text>
                <Flex
                  // flexDirection={'column'}
                  // alignItems={'end'}
                  gap='12px'
                  // mt='48px'
                >
                  {/* <Text>{t('share_on_social_media')}</Text> */}
                  <Flex gap='16px'>
                    <Link
                      href={
                        'https://www.instagram.com/lagmanhana_raiymbek?igsh=MXB3ZzZhY2dvOTgwZw=='
                      }
                      rel='nofollow'
                      className={styles.icons}
                    >
                      <Icon icon='skill-icons:instagram' fontSize={32} />
                    </Link>
                    {/* <Link
                      href={'https://t.me/chicagopizza_kz'}
                      rel='nofollow'
                      className={styles.icons}
                    >
                      <Icon icon='logos:telegram' fontSize={32} />{' '}
                    </Link>
                    <Link
                      href={'https://api.whatsapp.com/send?phone=77771292009'}
                      rel='nofollow'
                      className={styles.icons}
                    >
                      <Icon icon='logos:whatsapp-icon' fontSize={36} />
                    </Link> */}
                  </Flex>
                </Flex>
              </Flex>
            </div>
          </Flex>
          <div className={styles.line} />
          <Flex justifyContent={'space-between'} color={'#A5A5A5'}>
            <Text color={'#475467'}>
              © {dayjs().year()} Lagmanhana. {t('all_right_reserved')}.
            </Text>
            <Text color={'#475467'}>
              {/* Powered by{' '} */}
              <Link
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                href='https://delever.uz/'
                target='_blank'
              >
                <Icon
                  icon='mdi:heart'
                  width='1.2em'
                  height='1.2em'
                  style={{ color: 'green' }}
                />
                from Delever
              </Link>
            </Text>
          </Flex>
        </Box>
        {/* Mobile version */}
        <Box
          py={6}
          display={{ base: 'flex', md: 'none' }}
          flexDirection={'column'}
          gap={8}
        >
          <Flex alignItems={'start'} justifyContent={'space-between'}>
            <Link href='/'>
              <Flex flexDir={'column'} gap={2}>
                <Image
                  src={logo}
                  alt={'logo'}
                  priority={true}
                  width={54}
                  height={36}
                />
                <Text>
                  {t('from_to', {
                    from: data?.work_hour_start,
                    to: data?.work_hour_end,
                  })}
                </Text>
              </Flex>
            </Link>
            {data?.phone?.[0] && (
              <Text textDecor={'underline'} fontWeight={500} fontSize={16}>
                <Link href={`tel:${data?.phone?.[0]}`}>{data?.phone?.[0]}</Link>
              </Text>
            )}
          </Flex>
          <Flex justifyContent={'space-between'}>
            <UnorderedList
              display={'flex'}
              flexDirection={'column'}
              gap={'10px'}
              styleType={'none'}
              justifyContent={'flex-start'}
              margin={0}
            >
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/about`} className={styles.links}>
                  {t('about')}
                </Link>
              </ListItem>
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/menu`} className={styles.links}>
                  {t('menu')}
                </Link>
              </ListItem>
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/restaurants`} className={styles.links}>
                  {t('branch')}
                </Link>
              </ListItem>
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/gallery`} className={styles.links}>
                  {t('gallery')}
                </Link>
              </ListItem>
            </UnorderedList>
            <UnorderedList
              display={'flex'}
              flexDirection={'column'}
              gap={'10px'}
              styleType={'none'}
            >
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/vacancies`} className={styles.links}>
                  {t('vacancies')}
                </Link>
              </ListItem>
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/delivery`} className={styles.links}>
                  {t('addresses_and_delivery_zones')}
                </Link>
              </ListItem>
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/contacts`} className={styles.links}>
                  {t('contact')}
                </Link>
              </ListItem>
              <ListItem
                _hover={{
                  color: 'primary.500',
                }}
                color={'#475467'}
                fontWeight={500}
              >
                <Link href={`/offer`} className={styles.links}>
                  {t('offer')}
                </Link>
              </ListItem>
              <ListItem>
                <Link href={`/rules`} className={styles.links}>
                  {t('privacy_policy')}
                </Link>
              </ListItem>
            </UnorderedList>
          </Flex>
          {/* <Flex justifyContent={'center'} gap={2}>
            <Link href='/'>
              <Image
                src={AppStore}
                alt={'app store'}
                priority={true}
                width={138}
                height={40}
              />
            </Link>
            <Link href={'/'}>
              <Image
                src={GooglePlay}
                alt={'google play'}
                priority={true}
                width={138}
                height={40}
              />
            </Link>
          </Flex> */}

          <Box>
            {/* <Text>{t('share_on_social_media')}</Text> */}
            <Flex gap='16px' justifyContent={'center'}>
              <Link
                href={
                  'https://www.instagram.com/lagmanhana_raiymbek?igsh=MXB3ZzZhY2dvOTgwZw=='
                }
                rel='nofollow'
                className={styles.icons}
              >
                <Icon icon='skill-icons:instagram' fontSize={32} />
              </Link>
              {/* <Link
                href={'https://t.me/chicagopizza_kz'}
                rel='nofollow'
                className={styles.icons}
              >
                <Icon icon='logos:telegram' fontSize={32} />{' '}
              </Link>
              <Link
                href={'https://api.whatsapp.com/send?phone=77771292009'}
                rel='nofollow'
                className={styles.icons}
              >
                <Icon icon='logos:whatsapp-icon' fontSize={32} />
              </Link> */}
            </Flex>
          </Box>
          <Flex
            justifyContent={'center'}
            alignItems={'center'}
            flexDir={'column'}
            gap={3}
            color={'#A5A5A5'}
          >
            <Text color={'#475467'}>
              © {dayjs().year()} Lagmanhana. {t('all_right_reserved')}.
            </Text>
            <Text color={'#475467'}>
              <Link
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                href='https://delever.uz/'
                target='_blank'
              >
                <Icon
                  icon='mdi:heart'
                  width='1.2em'
                  height='1.2em'
                  style={{ color: 'green' }}
                />
                from Delever
              </Link>
            </Text>
          </Flex>
        </Box>
      </Container>
    </Box>
  )
}

export default memo(Footer)
