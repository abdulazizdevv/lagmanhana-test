import BreadCrumb from '@/_components/Breadcrumb'
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import logo from '@/_assets/logo.svg'
import img4 from '@/_assets/maxwayAbout.png'
import Image from 'next/image'
import Carousel from './Carousel'
import { getI18n } from '@/_locales/server'
import Script from 'next/script'

const About = async () => {
  const t = await getI18n()

  const BreadCrumbBranches = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('about'),
      link: '/about',
    },
  ]

  return (
    <>
      <Container>
        <Box mt={{ base: 0, md: 6 }} mb={'109px'}>
          <BreadCrumb items={BreadCrumbBranches} />
          <Heading display={'none'} as={'h1'}>
            {t('about')}
          </Heading>
          <Flex
            mt={4}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={4}
          >
            <Image
              src={logo}
              width={114}
              height={72}
              alt={t('about') + ` - photo 1`}
            />
            <Text
              fontSize={{ base: '18px', md: '23px' }}
              textAlign={'center'}
              fontWeight={700}
            >
              {t('about_title')}
            </Text>
          </Flex>
          {/* <Carousel /> */}
          <Flex justifyContent='center' alignItems='center' mt={10}>
            <Text
              textAlign={'start'}
              maxW={'664px'}
              fontSize={{ base: '14px', md: '16px' }}
              color={'#101828'}
              fontWeight={400}
              lineHeight={'24px'}
              dangerouslySetInnerHTML={{ __html: t('about_text') }}
            ></Text>
          </Flex>
          {/* <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            justifyContent={'space-between'}
            mt={10}
          >
            <Text
              w={'100%'}
              fontSize={{ base: '18px', md: '40px' }}
              fontWeight={700}
            >
              {t('about_branch_title')}
            </Text>
            <Text
              // color={{ base: '#4D4D4D', md: '#fff' }}
              color={'gray.700'}
              fontSize={{ base: '14px', md: '16px' }}
              mt={2}
              mb={6}
            >
              {t('about_branch_text')}
            </Text>
          </Flex> */}
          {/* <Grid alignItems={'center'} templateColumns='repeat(5, 1fr)' gap={4}>
            <GridItem colSpan={2} display={{ base: 'none', md: 'block' }}>
              <Image
                src={img4}
                width={360}
                height={460}
                alt={t('about') + ` - photo 2`}
              />
            </GridItem>
            <GridItem colSpan={{ base: 5, md: 3 }}>
              <Grid templateColumns='repeat(6, 1fr)' mb={'80px'}>
                <GridItem colSpan={3}>
                  <Text
                    fontSize={{ base: '40px', md: '64px' }}
                    fontWeight={700}
                  >
                    <Text
                      display={'inline-block'}
                      // color={{ base: '#A5A5A5', md: '#FBEA11' }}
                    >
                      20
                    </Text>
                    <Text color={'primary.500'} as={'span'}>
                      +
                    </Text>
                  </Text>
                  <Text
                    fontSize={{ base: '14px', md: '16px' }}
                    color={'#A5A5A5'}
                  >
                    {t('branches')}
                  </Text>
                </GridItem>
                <GridItem colSpan={3}>
                  <Text
                    fontSize={{ base: '40px', md: '64px' }}
                    fontWeight={700}
                  >
                    <Text
                      display={'inline-block'}
                      // color={{ base: '#A5A5A5', md: '#FBEA11' }}
                    >
                      30
                    </Text>
                    <Text color={'primary.500'} as={'span'}>
                      +
                    </Text>
                  </Text>
                  <Text
                    fontSize={{ base: '14px', md: '16px' }}
                    color={'#A5A5A5'}
                  >
                    {t('events')}
                  </Text>
                </GridItem>
              </Grid>
              <Grid templateColumns='repeat(6, 1fr)' gap={4}>
                <GridItem colSpan={3}>
                  <Text
                    fontSize={{ base: '40px', md: '64px' }}
                    fontWeight={700}
                  >
                    <Text
                      display={'inline-block'}
                      // color={{ base: '#A5A5A5', md: '#FBEA11' }}
                    >
                      2млн
                    </Text>
                    <Text color={'primary.500'} as={'span'}>
                      +
                    </Text>
                  </Text>
                  <Text
                    color={'#A5A5A5'}
                    maxW={'318px'}
                    fontSize={{ base: '14px', md: '16px' }}
                  >
                    {t('for_clients')}
                  </Text>
                </GridItem>
                <GridItem colSpan={3}>
                  <Text
                    fontSize={{ base: '40px', md: '64px' }}
                    fontWeight={700}
                  >
                    <Text
                      display={'inline-block'}
                      // color={{ base: '#A5A5A5', md: '#FBEA11' }}
                    >
                      1200
                    </Text>
                    <Text color={'primary.500'} as={'span'}>
                      +
                    </Text>
                  </Text>
                  <Text
                    color={'#A5A5A5'}
                    fontSize={{ base: '14px', md: '16px' }}
                    maxW={'318px'}
                  >
                    {t('workers_text')}{' '}
                  </Text>
                </GridItem>
              </Grid>
            </GridItem>
          </Grid> */}
        </Box>
      </Container>
    </>
  )
}

export default About
