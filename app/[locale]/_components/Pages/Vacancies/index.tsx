'use client'

import BreadCrumb from '@/_components/Breadcrumb'
import { useI18n } from '@/_locales/client'
import {
  Box,
  Button,
  Center,
  Container,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { IVacancy } from '@/_types'
import VacancyCard from './components/VacancyCard'
import NoVacancy from '@/_assets/illustration/NoVacancy.svg'
import Link from 'next/link'
import Image from 'next/image'
import VacanciesEmpty from '@/_assets/icons/VacanciesEmpty'

const VacanciesPage = ({ data }: { data: IVacancy[] }) => {
  const t = useI18n()

  const BreadcrumbData = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('vacancies'),
      link: '/vacancies',
    },
  ]

  if (!data?.length) {
    return (
      <Container>
        <Box mt={{ base: '3px', md: '20px' }}>
          <BreadCrumb items={BreadcrumbData} />
        </Box>
        <Center flexDir='column' minH='80vh'>
          <VacanciesEmpty />
          {/* <Image src={NoVacancy} alt='No vacancy' width={190} height={190} /> */}
          <Text fontWeight={700} fontSize='24px' mt={'33px'} mb={2}>
            {t('no_vacancies_yet')}
          </Text>
          <Text
            mb={4}
            color='#A5A5A5'
            textAlign='center'
            maxW='450px'
            fontWeight={400}
          >
            {t('no_open_vacancies')}
          </Text>
          <Link href='/'>
            <Button variant='primary' fontSize={14} fontWeight={500} h={'48px'}>
              {t('back_menu')}
            </Button>
          </Link>
        </Center>
      </Container>
    )
  }

  return (
    <Container>
      <Box mb={{ base: '16px', md: '142px' }}>
        <Box my={{ base: 0, md: '20px' }} mb={4}>
          <Box>
            <BreadCrumb items={BreadcrumbData} />
          </Box>
          <Text
            // display={{ base: 'none', md: 'block' }}
            // mt={'12px'}
            fontWeight={700}
            fontSize={28}
          >
            {t('vacancies')}
          </Text>
        </Box>
        <SimpleGrid
          mt={{ base: 0, md: 3 }}
          columns={{
            base: 1,
            sm: 2,
            lg: 3,
          }}
          gap={{ base: 2, md: 4 }}
        >
          {data?.map((el: IVacancy) => (
            <VacancyCard key={el.id} data={el} />
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  )
}

export default VacanciesPage
