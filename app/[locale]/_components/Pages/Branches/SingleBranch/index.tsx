'use client'
import BreadCrumb from '@/_components/Breadcrumb'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import { IBranch } from '@/_types'
import {
  Box,
  Card,
  Container,
  Divider,
  Flex,
  IconButton,
  Text,
} from '@chakra-ui/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Gradus360 from '@/_assets/icons/360.png'
import axios from 'axios'
import Link from 'next/link'
import Carousel from '@/_components/Carousel'
import { Icon } from '@iconify/react/dist/iconify.js'
import MenuIcon from '@/_assets/icons/MenuIcon'
import BackIcon from '@/_assets/icons/BackIcon'
import { useRouter } from 'next/navigation'

const SingleBranch = ({ data }: { data: IBranch }) => {
  const [virtualTourUrl, setVirtualTourUrl] = useState('')
  const router = useRouter()
  const t = useI18n()
  const currentLocale = useCurrentLocale()
  const [showMore, setShowMore] = useState(false)

  const BreadCrumbBranches = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('branch'),
      link: '/restaurants',
    },
    {
      item: data?.name,
      link: '',
    },
  ]
  const handleShowMore = () => {
    setShowMore(!showMore)
  }

  useEffect(() => {
    if (data?.virtual_tour) {
      axios
        .get(data?.virtual_tour)
        ?.then(() => setVirtualTourUrl(data?.virtual_tour))
        .catch((err: any) => console.log(err))
    }
  }, [data?.virtual_tour])

  return (
    <Container mt={{ base: 1, lg: 6 }} mb={{ base: '15px', md: '153px' }}>
      <Box width={{ base: '100%', lg: '60%' }}>
        <BreadCrumb items={BreadCrumbBranches} />
        <Flex
          alignItems={'center'}
          mt={{ base: 0, md: 4 }}
          mb={{ base: 0, md: '25px' }}
          gap={1}
        >
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            aria-label='back'
            bg={'transparent'}
            variant={'ghost'}
            onClick={() => router.back()}
            icon={<BackIcon color='#000' />}
          />
          <Text
            fontWeight={700}
            fontSize={{ base: 22, md: 32 }}
            lineHeight={'26px'}
            as={'h2'}
          >
            {data?.name}
          </Text>
        </Flex>
        <Card
          shadow={'none'}
          p={{ base: 3, md: 4 }}
          borderRadius={24}
          my={4}
          mb={8}
        >
          {data?.images?.length > 0 && (
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px',
                boxShadow: '0px 0px 45px 0px #00000012',
              }}
              height={{ base: 'auto', md: '317px' }}
              mb={4}
            >
              <Carousel
                aspectRatio='3 / 2'
                list={data?.images?.map((image) => ({
                  active: true,
                  title: data?.name,
                  image,
                }))}
                h1={data.name}
                options={{ arrows: false }}
              />
            </Box>
          )}
          <Flex
            alignItems={'center'}
            gap={2}
            _hover={{
              '& .hover-icon': {
                transform: 'translateX(5px)',
                transition: '100ms ease-in-out',
              },
            }}
          >
            <Link
              href={`https://yandex.com/maps/?ll=${data?.location?.long}%2C${data?.location?.lat}&mode=whatshere&whatshere%5Bpoint%5D=${data?.location?.long}%2C${data?.location?.lat}&z=14`}
              target='_blank'
              rel='noreferrer'
              style={{ fontWeight: 700, fontSize: 22 }}
            >
              {data?.address}
            </Link>
            <Icon className='hover-icon' icon='formkit:right' />
          </Flex>
          <Text mt={2} color={'gray.500'} fontSize={14} maxW='655px'>
            {data?.description?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
          </Text>
          <Flex mt={4} flexDirection={'column'} gap={2}>
            <Flex
              gap={{ base: 1, md: 2 }}
              // flexDirection={{ base: 'column', md: 'row' }}
            >
              <Text color={'#475467'} fontSize={15}>
                {t('schedule')}:{' '}
              </Text>
              <Text fontSize={14}>
                {data?.work_hour_start} ~ {data?.work_hour_end}
                {/* {ScheduleStatus({ branch: data, t })} */}
              </Text>
            </Flex>
            <Flex
              gap={{ base: 1, md: 2 }}
              // flexDirection={{ base: 'column', md: 'row' }}
            >
              <Text color={'#475467'} fontSize={15}>
                {t('phone_number')}:{' '}
              </Text>
              {data?.phones.map((el: string) => (
                <Text
                  key={el}
                  href={`tel:${el}`}
                  as={Link}
                  _hover={{ textDecoration: 'underline' }}
                >
                  {el}
                </Text>
              ))}
            </Flex>
            <Divider color={'#00000012'} my={4} />

            {data?.destination && (
              <Flex
                gap={{ base: 1, md: 2 }}
                // flexDirection={{ base: 'column', md: 'row' }}
              >
                <Text color={'#475467'} fontSize={15}>
                  {t('destination_branch')}:{' '}
                </Text>
                <Text> {data?.destination} </Text>
              </Flex>
            )}
            <Flex
              gap={{ base: 1, md: 2 }}
              // flexDirection={{ base: 'column', md: 'row' }}
            >
              <Text color={'#475467'} fontSize={15}>
                {t('parking')}:
              </Text>
              <Text>{data?.has_parking ? t('there_is') : t('no')}</Text>
            </Flex>
            {data?.seats_count > 0 && (
              <Flex
                gap={{ base: 1, md: 2 }}
                // flexDirection={{ base: 'column', md: 'row' }}
              >
                <Text color={'#475467'} fontSize={15}>
                  {' '}
                  {t('seat_count')}:{' '}
                </Text>
                <Text>{data?.seats_count}</Text>
              </Flex>
            )}
          </Flex>
          <Divider color={'#00000012'} my={4} />
          <Flex flexDirection={'column'} gap={2} mt={4}>
            {virtualTourUrl && (
              <Flex
                href={virtualTourUrl}
                alignItems={'center'}
                as={Link}
                gap={4}
                _hover={{ textDecor: 'underline' }}
              >
                <Image
                  src={Gradus360}
                  alt={data?.name + ` - photo 1`}
                  width={32}
                  height={32}
                />
                <Text>{t('virtual_tour')}</Text>
              </Flex>
            )}
            <Flex
              href='/'
              as={Link}
              alignItems={'center'}
              gap={4}
              _hover={{ textDecor: 'underline' }}
            >
              <MenuIcon />
              <Text>{t('menu')}</Text>
            </Flex>
          </Flex>
        </Card>
      </Box>
      {data?.seo_text?.[currentLocale === 'kz' ? 'uz' : currentLocale] && (
        <Box>
          <Box position={'relative'} padding='0 6.5vw' mb={'92px'}>
            <Divider
              orientation='vertical'
              bg={'primary.500'}
              height={'100%'}
              position={'absolute'}
              top={0}
              left={0}
              w={'1px'}
            />
            <Box position={'relative'} marginTop={'92px'} color={'#808080'}>
              {!showMore && (
                <Box
                  dangerouslySetInnerHTML={{
                    __html:
                      data?.seo_text?.[
                        currentLocale === 'kz' ? 'uz' : currentLocale
                      ]?.substring(0, 800) + '...',
                  }}
                ></Box>
              )}
              <Box
                sx={
                  !showMore
                    ? {
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        backgroundImage:
                          'linear-gradient(transparent, #f2f4f7)',
                        zIndex: 1,
                        width: '100%',
                        height: '50px',
                      }
                    : {}
                }
              />
              {showMore && (
                <Box
                  dangerouslySetInnerHTML={{
                    __html:
                      data?.seo_text?.[
                        currentLocale === 'kz' ? 'uz' : currentLocale
                      ],
                  }}
                ></Box>
              )}
            </Box>
            <Box>
              <Text
                cursor={'pointer'}
                as={'span'}
                color={'#808080'}
                fontWeight={500}
                onClick={handleShowMore}
              >
                {showMore ? t('less') : t('more')}
              </Text>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  )
}

export default SingleBranch
