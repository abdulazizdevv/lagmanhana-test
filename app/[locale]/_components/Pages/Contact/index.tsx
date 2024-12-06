'use client'
import BreadCrumb from '@/_components/Breadcrumb'
import { QRCodeCanvas } from 'qrcode.react'
import { useI18n } from '@/_locales/client'
import {
  Box,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import React from 'react'
import { IShipper } from '@/_types'
import YoutubeIcon from '@/_assets/icons/Youtube'
import Telegram from './telegram.svg'
import WhatsUp from '@/_assets/icons/whatsup2.webp'
import Script from 'next/script'

const Contact = ({ shipper }: { shipper: IShipper }) => {
  const t = useI18n()

  const BreadCrumbBranches = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('contact'),
      link: '/contacts',
    },
  ]

  return (
    <>
      <Container>
        <Box>
          <Box mt={4}>
            <BreadCrumb items={BreadCrumbBranches} />
          </Box>
          <Heading as={'h1'} mb={'12px'}>
            {t('contact')}
          </Heading>
        </Box>
        <Flex
          mb={{ base: 0, md: '60vh' }}
          flexDirection={{ base: 'column-reverse', md: 'column' }}
        >
          <Grid templateColumns='repeat(8, 1fr)' gap={6}>
            <GridItem
              colSpan={{ base: 8, md: 6 }}
              display={'flex'}
              gap={'46px'}
              flexDirection={'column'}
              bg={'#fff'}
              borderRadius={'24px'}
              p={{ base: '16px', md: 6 }}
            >
              <Flex gap={'12px'}>
                <Icon icon='mi:call' width='30px' height='30px' />
                <Flex gap={'12px'} flexDirection={'column'}>
                  <Text fontSize={{ base: 18, md: 22 }} color={'#A5A5A5'}>
                    {t('call_center')}
                  </Text>
                  <Text
                    href={`tel:${shipper?.phone?.[0]}`}
                    fontSize={{ base: 14, md: 20 }}
                    as={Link}
                  >
                    {shipper?.phone?.[0]}
                  </Text>
                </Flex>
              </Flex>
              <Flex gap={'12px'}>
                <Icon icon='mdi:internet' width='30px' height='30px' />
                <Flex gap={'12px'} flexDirection={'column'}>
                  <Text fontSize={{ base: 18, md: 22 }} color={'#A5A5A5'}>
                    {t('social_media')}
                  </Text>
                  <Flex gap={4} fontSize={48}>
                    <Link
                      href={
                        'https://www.instagram.com/lagmanhana_raiymbek?igsh=MXB3ZzZhY2dvOTgwZw=='
                      }
                      rel='nofollow'
                    >
                      <Icon icon='skill-icons:instagram' />
                    </Link>
                    {/* <Link href={'https://t.me/chicagopizza_kz'} rel='nofollow'>
                      <Icon icon='logos:telegram' />{' '}
                    </Link>
                    <Link
                      href={'https://api.whatsapp.com/send?phone=77771292009'}
                      rel='nofollow'
                    >
                      <Icon icon='logos:whatsapp-icon' fontSize={54} />
                    </Link> */}
                  </Flex>
                </Flex>
              </Flex>
              <Flex gap={'12px'}>
                <Icon icon='ep:location' width='30px' height='30px' />
                <Flex gap={'12px'} flexDirection={'column'}>
                  <Text fontSize={{ base: 18, md: 22 }} color={'#A5A5A5'}>
                    {t('office_address')}
                  </Text>
                  <Text
                    fontSize={{ base: 14, md: 20 }}
                    maxWidth={{ base: '300px', md: '100%' }}
                  >
                    <Link
                      href={
                        'https://yandex.kz/maps/163/astana/house/e_652_koshesi_2/Y0gYcgVgSUcAQFtrfXx0eHtjbA==/?l=masstransit&ll=71.420027%2C51.059708&no-distribution=1&z=16.78'
                      }
                      target='_blank'
                    >
                      г.Астана Улица Е 652, 2
                    </Link>
                  </Text>
                </Flex>
              </Flex>
            </GridItem>
            <GridItem
              colSpan={{ base: 8, md: 2 }}
              display={'flex'}
              gap={'16px'}
              flexDirection={'column'}
              p={'32px'}
              bg={'#fff'}
              borderRadius={'24px'}
            >
              <Center
                bg={'white'}
                w={{ base: '197px', md: '100%' }}
                margin={'0 auto'}
                borderRadius={'10px'}
                p={3}
              >
                <QRCodeCanvas
                  value={`https://t.me/${shipper?.call_center_tg?.replace(
                    '@',
                    ''
                  )}`}
                  size={200}
                  bgColor={'#ffffff'}
                  fgColor={'#000000'}
                  level={'M'}
                  includeMargin={false}
                  imageSettings={{
                    src: Telegram.src,
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </Center>
              <Box textAlign={'center'}>
                <Text fontSize={20} fontWeight={600}>
                  {t('telegram_bot')}
                </Text>
                <Link
                  href={`https://t.me/${shipper?.call_center_tg?.replace(
                    '@',
                    ''
                  )}`}
                >
                  {shipper?.call_center_tg || '-'}
                </Link>
              </Box>
            </GridItem>
          </Grid>
          {/* <Box>
          <Text
            fontSize={{ base: 30, md: 40 }}
            fontWeight={700}
            mt={{ base: '8px', md: '48px' }}
            mb={6}
            textAlign={'center'}
          >
            Часто задаваемые вопросы
          </Text>
          <Accordion allowMultiple mb={{ base: '32px', md: '125px' }}>
            <AccordionItem borderColor={'#292929'}>
              <h2>
                <AccordionButton>
                  <Box
                    as='span'
                    flex='1'
                    textAlign='left'
                    fontSize={{ base: 16, md: 20 }}
                    fontWeight={{ base: 600, md: 700 }}
                    py={{ base: '13px', md: 6 }}
                  >
                    Можно ли поменять способ оплаты после заказа
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel
                pb={4}
                fontSize={{ base: 14, md: 16 }}
                fontWeight={400}
                color={'#A5A5A5'}
              >
                Algorithmic trading is a form of automated trading that uses
                computer programs or algorithms to execute trades in financial
                markets. These algorithms are designed to analyze market data,
                such as price and volume, and make trading decisions based on
                predefined rules and parameters. Algorithmic trading can be used
                for a variety of financial instruments, including stocks, bonds,
                futures, options, and currencies.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem borderColor={'#292929'}>
              <h2>
                <AccordionButton>
                  <Box
                    as='span'
                    flex='1'
                    textAlign='left'
                    fontSize={{ base: 16, md: 20 }}
                    fontWeight={{ base: 600, md: 700 }}
                    py={{ base: '13px', md: 6 }}
                  >
                    Можно ли отменить заказ в приложении если я заказал в боте
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel
                pb={4}
                fontSize={{ base: 14, md: 16 }}
                fontWeight={400}
                color={'#A5A5A5'}
              >
                Algorithmic trading is a form of automated trading that uses
                computer programs or algorithms to execute trades in financial
                markets. These algorithms are designed to analyze market data,
                such as price and volume, and make trading decisions based on
                predefined rules and parameters. Algorithmic trading can be used
                for a variety of financial instruments, including stocks, bonds,
                futures, options, and currencies.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem borderColor={'#292929'}>
              <h2>
                <AccordionButton>
                  <Box
                    as='span'
                    flex='1'
                    textAlign='left'
                    fontSize={{ base: 16, md: 20 }}
                    fontWeight={{ base: 600, md: 700 }}
                    py={{ base: '13px', md: 6 }}
                  >
                    Как перейти к боту если у тебя нет телеграмма
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel
                pb={4}
                fontSize={{ base: 14, md: 16 }}
                fontWeight={400}
                color={'#A5A5A5'}
              >
                Algorithmic trading is a form of automated trading that uses
                computer programs or algorithms to execute trades in financial
                markets. These algorithms are designed to analyze market data,
                such as price and volume, and make trading decisions based on
                predefined rules and parameters. Algorithmic trading can be used
                for a variety of financial instruments, including stocks, bonds,
                futures, options, and currencies.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem borderColor={'#292929'}>
              <h2>
                <AccordionButton>
                  <Box
                    as='span'
                    flex='1'
                    textAlign='left'
                    fontSize={{ base: 16, md: 20 }}
                    fontWeight={{ base: 600, md: 700 }}
                    py={{ base: '13px', md: 6 }}
                  >
                    Если заказал собой взять могу ли это поменять на доставку
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel
                pb={4}
                fontSize={{ base: 14, md: 16 }}
                fontWeight={400}
                color={'#A5A5A5'}
              >
                Algorithmic trading is a form of automated trading that uses
                computer programs or algorithms to execute trades in financial
                markets. These algorithms are designed to analyze market data,
                such as price and volume, and make trading decisions based on
                predefined rules and parameters. Algorithmic trading can be used
                for a variety of financial instruments, including stocks, bonds,
                futures, options, and currencies.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box> */}
        </Flex>
      </Container>
      {/* <Script
        id='microdata-contact'
        strategy='lazyOnload'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: microdataJson }}
      /> */}
    </>
  )
}

export default Contact
